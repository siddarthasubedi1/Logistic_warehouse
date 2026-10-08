const request = require('supertest');
const app = require('../app');
const User = require('../src/models/User');
const TrainingModule = require('../src/models/TrainingModule');
const TrainingProgramme = require('../src/models/TrainingProgramme');
const TrainingAssignment = require('../src/models/TrainingAssignment');
const LearningSection = require('../src/models/LearningSection');
const SectionCompletion = require('../src/models/SectionCompletion');
const AssessmentQuestion = require('../src/models/AssessmentQuestion');
const AssessmentAttempt = require('../src/models/AssessmentAttempt');
const CertificateRequest = require('../src/models/CertificateRequest');
const Notification = require('../src/models/Notification');
const { reconcileCertificateEligibility, calculateModuleRating, CERTIFICATE_KEY_PREFIX } = require('../src/services/certificateService');
const { generateCertificatePdf } = require('../src/services/certificatePdfService');
const { generateAccessToken } = require('../src/utils/generateTokens');

const keys = ['manual-handling', 'working-at-height', 'cyber-awareness'];
const header = user => ({ Authorization: `Bearer ${generateAccessToken(user)}` });

async function makeUser(username, role, createdBy = null) {
  return User.create({
    username, firstName: username, lastName: 'Test', email: `${username}@example.invalid`, role,
    passwordHash: 'fixture-only', accountStatus: 'created', status: 'active', mustChangePassword: false,
    createdBy,
    ...(role === 'trainee' ? { age: 24, phoneNumber: '9800000000', address: 'Kathmandu', gender: 'female', assignedTrainingSections: keys } : {}),
  });
}

async function createCompletedModule({ admin, trainee, key, index, attempts = 1, secondsPerAttempt = 60 }) {
  const module = await TrainingModule.create({ key, code: `C${index}`, name: key.replace(/-/g, ' '), description: 'Certificate eligibility module.', createdBy: admin._id });
  const programme = await TrainingProgramme.create({ programmeType: module.key, title: `${module.name} beginner`, shortDescription: 'Certificate training.', description: 'Complete learning and assessment.', learningObjectives: 'Learn and pass.', owner: admin._id, level: 'beginner', passMark: 70, createdBy: admin._id });
  const assignment = await TrainingAssignment.create({ trainee: trainee._id, programme: programme._id, assignedBy: admin._id });
  const section = await LearningSection.create({ programme: programme._id, title: 'Required learning', content: 'Study this content.', order: 1, status: 'active', createdBy: admin._id });
  await SectionCompletion.create({ trainee: trainee._id, programme: programme._id, section: section._id, completedAt: new Date() });
  const question = await AssessmentQuestion.create({ programme: programme._id, level: 'basic', question: 'Safe answer?', options: ['Yes', 'No'], correctAnswer: 'Yes', points: 1, status: 'active', createdBy: admin._id });
  for (let number = 1; number <= attempts; number += 1) {
    const startedAt = new Date(Date.now() - (attempts - number + 1) * 100000);
    const submittedAt = new Date(startedAt.getTime() + secondsPerAttempt * 1000);
    const passed = number === attempts;
    await AssessmentAttempt.create({
      trainee: trainee._id, programme: programme._id, assignment: assignment._id,
      questionSet: [question._id], answers: [{ question: question._id, answer: passed ? 'Yes' : 'No', correct: passed, pointsAwarded: passed ? 1 : 0 }],
      level: 'basic', status: 'submitted', score: passed ? 1 : 0, totalPoints: 1,
      percentage: passed ? 100 : 0, passed, passMark: 70, attemptNumber: number, startedAt, submittedAt,
    });
  }
  return { module, programme };
}

describe('cumulative certificate workflow', () => {
  test('first completed module creates one-module certificate and admin notification', async () => {
    const admin = await makeUser('firstadmin', 'admin');
    const trainee = await makeUser('firsttrainee', 'trainee', admin._id);
    await createCompletedModule({ admin, trainee, key: 'cyber-awareness', index: 0, attempts: 2, secondsPerAttempt: 70 });

    const result = await reconcileCertificateEligibility(trainee._id);
    expect(result.eligibility.eligibleModules).toHaveLength(1);
    const certificate = await CertificateRequest.findOne({ trainee: trainee._id, certificateKey: new RegExp(`^${CERTIFICATE_KEY_PREFIX}:`) }).lean();
    expect(certificate.status).toBe('pending');
    expect(certificate.moduleKeys).toEqual(['cyber-awareness']);
    expect(certificate.eligibilitySnapshot.modules).toHaveLength(1);
    expect(certificate.eligibilitySnapshot.modules[0].rating.assessmentAttempts).toBe(2);
    expect(await Notification.countDocuments({ recipient: admin._id, type: 'certificate' })).toBe(1);
  });

  test('second completion creates a new cumulative certificate containing both modules and supersedes the older unsent request', async () => {
    const admin = await makeUser('secondadmin', 'admin');
    const trainee = await makeUser('secondtrainee', 'trainee', admin._id);
    await createCompletedModule({ admin, trainee, key: 'cyber-awareness', index: 0, attempts: 1, secondsPerAttempt: 40 });
    await reconcileCertificateEligibility(trainee._id);

    await createCompletedModule({ admin, trainee, key: 'manual-handling', index: 1, attempts: 3, secondsPerAttempt: 180 });
    const result = await reconcileCertificateEligibility(trainee._id);
    expect(result.eligibility.eligibleModules).toHaveLength(2);

    const all = await CertificateRequest.find({ trainee: trainee._id, certificateKey: new RegExp(`^${CERTIFICATE_KEY_PREFIX}:`) }).sort({ eligibleAt: 1 }).lean();
    expect(all).toHaveLength(2);
    expect(all[0].status).toBe('superseded');
    expect(all[1].status).toBe('pending');
    expect(all[1].moduleKeys).toEqual(['manual-handling', 'cyber-awareness']);
    expect(all[1].eligibilitySnapshot.modules).toHaveLength(2);
    const ratings = Object.fromEntries(all[1].eligibilitySnapshot.modules.map(module => [module.key, module.rating.stars]));
    expect(ratings['cyber-awareness']).toBeGreaterThanOrEqual(1);
    expect(ratings['manual-handling']).toBeGreaterThanOrEqual(1);
    expect(await Notification.countDocuments({ recipient: admin._id, type: 'certificate' })).toBe(2);
  });

  test('third completion creates a certificate listing all three modules with separate ratings', async () => {
    const admin = await makeUser('thirdadmin', 'admin');
    const trainee = await makeUser('thirdtrainee', 'trainee', admin._id);
    for (const [index, key] of ['cyber-awareness', 'manual-handling', 'working-at-height'].entries()) {
      await createCompletedModule({ admin, trainee, key, index, attempts: index + 1, secondsPerAttempt: 45 + index * 60 });
      await reconcileCertificateEligibility(trainee._id);
    }
    const latest = await CertificateRequest.findOne({ trainee: trainee._id, status: 'pending', certificateKey: new RegExp(`^${CERTIFICATE_KEY_PREFIX}:`) }).lean();
    expect(latest.moduleKeys).toEqual(keys);
    expect(latest.eligibilitySnapshot.modules).toHaveLength(3);
    expect(latest.eligibilitySnapshot.modules.every(module => Number(module.rating?.stars) >= 1 && Number(module.rating?.stars) <= 5)).toBe(true);
  });

  test('rating combines assessment pace and attempts on a five-star scale', () => {
    expect(calculateModuleRating({ assessmentAttempts: 1, requiredAssessments: 1, totalAssessmentSeconds: 40, totalQuestionAttempts: 1 }).stars).toBe(5);
    const slower = calculateModuleRating({ assessmentAttempts: 3, requiredAssessments: 1, totalAssessmentSeconds: 600, totalQuestionAttempts: 2 });
    expect(slower.stars).toBeLessThan(5);
    expect(slower.stars).toBeGreaterThanOrEqual(1);
  });

  test('PDF supports multiple completed modules', () => {
    const pdf = generateCertificatePdf({
      traineeName: 'Demo Trainee', certificateNumber: 'UKLW-2026-3M-DEMO1234', issuedAt: new Date(), issuedBy: 'System Administrator',
      modules: [
        { key: 'cyber-awareness', name: 'Cyber Awareness', rating: { stars: 5, assessmentAttempts: 1, totalAssessmentSeconds: 50 } },
        { key: 'manual-handling', name: 'Manual Handling', rating: { stars: 4.5, assessmentAttempts: 2, totalAssessmentSeconds: 130 } },
        { key: 'working-at-height', name: 'Working at Height', rating: { stars: 4, assessmentAttempts: 3, totalAssessmentSeconds: 240 } },
      ],
    });
    expect(pdf.subarray(0, 4).toString()).toBe('%PDF');
    expect(pdf.length).toBeGreaterThan(1000);
  });

  test('admin queue returns only active cumulative certificate stages and registered trainee email', async () => {
    const admin = await makeUser('queueadmin', 'admin');
    const trainee = await makeUser('queuetrainee', 'trainee', admin._id);
    await createCompletedModule({ admin, trainee, key: 'cyber-awareness', index: 0 });
    await reconcileCertificateEligibility(trainee._id);
    await createCompletedModule({ admin, trainee, key: 'manual-handling', index: 1 });
    await reconcileCertificateEligibility(trainee._id);

    const old = { host: process.env.SMTP_HOST, user: process.env.SMTP_USER, pass: process.env.SMTP_PASS };
    process.env.SMTP_HOST = '';
    process.env.SMTP_USER = '';
    process.env.SMTP_PASS = '';
    try {
      const denied = await request(app).get('/api/admin/certificates').set(header(trainee));
      expect(denied.status).toBe(403);
      const list = await request(app).get('/api/admin/certificates').set(header(admin));
      expect(list.status).toBe(200);
      expect(list.body.emailConfigured).toBe(false);
      expect(list.body.certificates).toHaveLength(1);
      expect(list.body.certificates[0].recipientEmail).toBe(trainee.email);
      expect(list.body.certificates[0].modules).toHaveLength(2);
      expect(list.body.certificates[0].downloadAvailable).toBe(false);
      const downloadBeforeSend = await request(app).get(`/api/admin/certificates/${list.body.certificates[0]._id}/download`).set(header(admin));
      expect(downloadBeforeSend.status).toBe(200);
      expect(downloadBeforeSend.headers["content-type"]).toMatch(/application\/pdf/);
    } finally {
      process.env.SMTP_HOST = old.host;
      process.env.SMTP_USER = old.user;
      process.env.SMTP_PASS = old.pass;
    }
  });
});
