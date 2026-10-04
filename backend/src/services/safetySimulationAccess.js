const mongoose = require('mongoose');
const User = require('../models/User');
const TrainingModule = require('../models/TrainingModule');
const TrainingProgramme = require('../models/TrainingProgramme');
const TrainingAssignment = require('../models/TrainingAssignment');
const { syncUnlockedProgressionAssignments, getModuleLevelAccess, normalizeProgrammeLevel } = require('./traineeLevelProgressService');
const { getOrCreateProgrammeProgress } = require('./trainingProgressService');
const { hasProgrammeAssessmentPass, reconcileProgrammeActivityProgress } = require('./programmeActivityProgress');
const { MissionError } = require('../../../shared/simulationEngine.mjs');
const requireId = value => { if (!mongoose.Types.ObjectId.isValid(value)) throw new MissionError('Invalid record identifier.'); };
async function managerProgrammes(user) {
  if (user.role === 'admin') return TrainingProgramme.find({ deletedAt: null }).lean();
  const trainer = await User.findById(user.id).select('assignedTrainingSections').lean();
  return TrainingProgramme.find({ deletedAt: null, programmeType: { $in: trainer?.assignedTrainingSections || [] }, $or: [{ owner: user.id }, { authorizedTrainers: user.id }] }).lean();
}
async function managerProgramme(user, id, { creating = false } = {}) {
  requireId(id);
  const programme = await TrainingProgramme.findById(id).lean();
  if (!programme) throw new MissionError('Programme not found.', 'NOT_FOUND', 404);
  if (creating && programme.deletedAt) throw new MissionError('Archived programmes cannot receive new missions.', 'PROGRAMME_ARCHIVED', 409);
  if (user.role !== 'admin') {
    const trainer = await User.findById(user.id).select('assignedTrainingSections').lean();
    const permitted = user.role === 'trainer' && trainer?.assignedTrainingSections?.includes(programme.programmeType) && (String(programme.owner) === user.id || (programme.authorizedTrainers || []).some(id => String(id) === user.id));
    if (!permitted) throw new MissionError('You are not assigned and authorised for this training programme.', 'TRAINER_SCOPE_DENIED', 403);
  }
  const module = await TrainingModule.findOne({ key: programme.programmeType }).lean();
  if (creating && (!module || module.status !== 'active')) throw new MissionError('Select an active training module.', 'MODULE_INACTIVE', 409);
  return programme;
}
async function traineeProgramme(user, id, { requirePass = false } = {}) {
  requireId(id);
  const programme = await TrainingProgramme.findOne({ _id: id, status: 'active', deletedAt: null }).lean();
  if (!programme || !await TrainingModule.exists({ key: programme.programmeType, status: 'active' })) throw new MissionError('Active training programme not found.', 'NOT_FOUND', 404);
  await syncUnlockedProgressionAssignments(user.id, programme.programmeType);
  const assignment = await TrainingAssignment.findOne({ trainee: user.id, programme: id, status: 'active' });
  if (!assignment) throw new MissionError('This programme is not assigned to you.', 'TRAINING_NOT_ASSIGNED', 403);
  const level = normalizeProgrammeLevel(programme.level);
  const access = await getModuleLevelAccess(user.id, programme.programmeType);
  if (!access[level]?.unlocked) throw new MissionError('Complete the previous training level first.', 'PROGRAMME_LEVEL_LOCKED', 403);
  const progress = await getOrCreateProgrammeProgress({ traineeId: user.id, programmeId: id, assignmentId: assignment._id });
  const assessmentLevel = { beginner: 'basic', intermediate: 'intermediate', advanced: 'high' }[level];
  await reconcileProgrammeActivityProgress({ traineeId: user.id, programmeId: id, level: assessmentLevel, progress });
  if (progress.isModified()) await progress.save();
  const locked = !hasProgrammeAssessmentPass(progress, assessmentLevel);
  if (requirePass && locked) throw new MissionError('Pass this level assessment before starting an optional safety mission.', 'ASSESSMENT_NOT_PASSED', 403);
  return { programme, locked };
}
module.exports = { requireId, managerProgrammes, managerProgramme, traineeProgramme };
