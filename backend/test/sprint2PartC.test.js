const request = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');

const User = require('../src/models/User');
const TrainingModule = require('../src/models/TrainingModule');
const TrainingProgramme = require('../src/models/TrainingProgramme');
const TrainingAssignment = require('../src/models/TrainingAssignment');
const LearningSection = require('../src/models/LearningSection');
const SectionCompletion = require('../src/models/SectionCompletion');
const AssessmentQuestion = require('../src/models/AssessmentQuestion');

const {
    generateAccessToken,
} = require('../src/utils/generateTokens');


const PASSWORD = 'Sprint2Test123!';


const auth = (token) => ({
    Authorization: `Bearer ${token}`,
});


/*
|--------------------------------------------------------------------------
| Test User Helper
|--------------------------------------------------------------------------
*/
async function user(
    username,
    role,
    extra = {}
) {
    return User.create({
        firstName: username,

        lastName: 'Test',

        email: `${username}@test.local`,

        username,

        passwordHash:
            await bcrypt.hash(
                PASSWORD,
                12
            ),

        role,

        ...(role !== 'admin'
            ? {
                age: 25,

                phoneNumber:
                    '9800000000',

                address:
                    'Kathmandu, Nepal',

                gender:
                    'female',
            }
            : {}),

        accountStatus:
            'created',

        status:
            'active',

        mustChangePassword:
            false,

        assignedTrainingSections:
            extra.assignedTrainingSections ||
            [],
    });
}


/*
|--------------------------------------------------------------------------
| Token Helper
|--------------------------------------------------------------------------
*/
function tokenFor(user) {
    return generateAccessToken(
        user
    );
}


/*
|--------------------------------------------------------------------------
| Assessment Question Helper
|--------------------------------------------------------------------------
*/
async function createQuestions(
    programme,
    admin,
    level = 'basic',
    count = 30
) {
    const questions = [];

    for (
        let i = 1;
        i <= count;
        i++
    ) {
        const question =
            await AssessmentQuestion.create({
                programme:
                    programme._id,

                level,

                question:
                    `${level} safety question ${i}?`,

                options: [
                    'Correct',
                    'Wrong',
                ],

                correctAnswer:
                    'Correct',

                points:
                    1,

                feedback:
                    `${level} safety feedback ${i}`,

                order:
                    i,

                status:
                    'active',

                createdBy:
                    admin._id,
            });

        questions.push(
            question
        );
    }

    return questions;
}


/*
|--------------------------------------------------------------------------
| Main Test Fixture
|--------------------------------------------------------------------------
*/
async function fixture() {

    const admin =
        await user(
            'pcadmin',
            'admin'
        );


    const trainerA =
        await user(
            'pctrainera',
            'trainer',
            {
                assignedTrainingSections: [
                    'manual-handling',
                ],
            }
        );


    const trainerB =
        await user(
            'pctrainerb',
            'trainer',
            {
                assignedTrainingSections: [
                    'manual-handling',
                ],
            }
        );


    const traineeA =
        await user(
            'pctraineea',
            'trainee',
            {
                assignedTrainingSections: [
                    'manual-handling',
                ],
            }
        );


    const traineeB =
        await user(
            'pctraineeb',
            'trainee',
            {
                assignedTrainingSections: [
                    'manual-handling',
                ],
            }
        );


    await TrainingModule.create({
        name:
            'Manual Handling',

        code:
            'MH',

        key:
            'manual-handling',

        description:
            'Manual handling module for Part C tests.',

        status:
            'active',

        createdBy:
            admin._id,
    });


    const programme =
        await TrainingProgramme.create({
            programmeType:
                'manual-handling',

            title:
                'Manual Handling Safety',

            shortDescription:
                'Core manual handling safety training.',

            description:
                'Manual handling programme used for Training Content Part C acceptance testing.',

            learningObjectives:
                'Recognise manual handling hazards and apply safe manual handling techniques.',

            prerequisite:
                '',

            level:
                'beginner',

            owner:
                trainerA._id,

            passMark:
                60,

            status:
                'active',

            createdBy:
                admin._id,
        });


    return {
        admin,

        trainerA,

        trainerB,

        traineeA,

        traineeB,

        programme,

        tokens: {
            admin:
                tokenFor(
                    admin
                ),

            trainerA:
                tokenFor(
                    trainerA
                ),

            trainerB:
                tokenFor(
                    trainerB
                ),

            traineeA:
                tokenFor(
                    traineeA
                ),

            traineeB:
                tokenFor(
                    traineeB
                ),
        },
    };
}


/*
|--------------------------------------------------------------------------
| TRAINING CONTENT PART C TESTS
|--------------------------------------------------------------------------
*/
describe(
    'Training Content Part C acceptance/security regression',
    () => {

        /*
        |--------------------------------------------------------------------------
        | T2-02 / T2-03 / T2-04
        |--------------------------------------------------------------------------
        */
        test(
            'T2-02/T2-03/T2-04 ownership and management role enforcement',
            async () => {

                const f =
                    await fixture();


                const own =
                    await request(app)
                        .patch(
                            `/api/programmes/${f.programme._id}`
                        )
                        .set(
                            auth(
                                f.tokens.trainerA
                            )
                        )
                        .send({
                            title:
                                'Updated Manual Handling Safety',
                        });


                expect(
                    own.statusCode
                ).toBe(
                    200
                );


                const other =
                    await request(app)
                        .patch(
                            `/api/programmes/${f.programme._id}`
                        )
                        .set(
                            auth(
                                f.tokens.trainerB
                            )
                        )
                        .send({
                            title:
                                'Forbidden edit',
                        });


                expect([
                    403,
                    404,
                ]).toContain(
                    other.statusCode
                );


                const trainee =
                    await request(app)
                        .post(
                            '/api/programmes'
                        )
                        .set(
                            auth(
                                f.tokens.traineeA
                            )
                        )
                        .send({
                            programmeType:
                                'manual-handling',

                            title:
                                'Forbidden',

                            shortDescription:
                                'Trainee must not create this programme.',

                            description:
                                'This programme creation request must be rejected.',

                            learningObjectives:
                                'This should never be created.',

                            level:
                                'beginner',

                            passMark:
                                60,

                            status:
                                'active',
                        });


                expect(
                    trainee.statusCode
                ).toBe(
                    403
                );
            }
        );


        /*
        |--------------------------------------------------------------------------
        | T2-05 / T2-06
        |--------------------------------------------------------------------------
        */
        test(
            'T2-05/T2-06 Admin assignment works and duplicate active assignment is rejected',
            async () => {

                const f =
                    await fixture();


                const body = {
                    programmeId:
                        f.programme._id.toString(),

                    traineeId:
                        f.traineeA._id.toString(),
                };


                const first =
                    await request(app)
                        .post(
                            '/api/assignments'
                        )
                        .set(
                            auth(
                                f.tokens.admin
                            )
                        )
                        .send(
                            body
                        );


                expect(
                    first.statusCode
                ).toBe(
                    201
                );


                const duplicate =
                    await request(app)
                        .post(
                            '/api/assignments'
                        )
                        .set(
                            auth(
                                f.tokens.admin
                            )
                        )
                        .send(
                            body
                        );


                expect(
                    duplicate.statusCode
                ).toBe(
                    409
                );


                expect(
                    duplicate.body.code
                ).toBe(
                    'DUPLICATE_ACTIVE_ASSIGNMENT'
                );


                const trainerAttempt =
                    await request(app)
                        .post(
                            '/api/assignments'
                        )
                        .set(
                            auth(
                                f.tokens.trainerA
                            )
                        )
                        .send({
                            ...body,

                            traineeId:
                                f.traineeB._id.toString(),
                        });


                expect(
                    trainerAttempt.statusCode
                ).toBe(
                    403
                );
            }
        );


        /*
        |--------------------------------------------------------------------------
        | T2-09
        |--------------------------------------------------------------------------
        */
        test(
            'T2-09 missing module panorama returns safe fallback instead of mixed Warehouse Tour data',
            async () => {

                const f =
                    await fixture();


                await TrainingAssignment.create({
                    programme:
                        f.programme._id,

                    trainee:
                        f.traineeA._id,

                    assignedBy:
                        f.admin._id,

                    status:
                        'active',
                });


                const response =
                    await request(app)
                        .get(
                            `/api/programmes/${f.programme._id}/environment`
                        )
                        .set(
                            auth(
                                f.tokens.traineeA
                            )
                        );


                expect(
                    response.statusCode
                ).toBe(
                    200
                );


                expect(
                    response.body.panorama
                ).toBeNull();


                expect(
                    response.body.fallback
                ).toMatch(
                    /panorama/i
                );
            }
        );


        /*
        |--------------------------------------------------------------------------
        | T2-10 / T2-11
        |--------------------------------------------------------------------------
        */
        test(
            'T2-10/T2-11 learning completion unlocks Basic but Intermediate stays locked',
            async () => {

                const f =
                    await fixture();


                await TrainingAssignment.create({
                    programme:
                        f.programme._id,

                    trainee:
                        f.traineeA._id,

                    assignedBy:
                        f.admin._id,

                    status:
                        'active',
                });


                const section =
                    await LearningSection.create({
                        programme:
                            f.programme._id,

                        title:
                            'Safe lifting',

                        content:
                            'Learn and apply safe lifting technique.',

                        order:
                            1,

                        status:
                            'active',

                        createdBy:
                            f.admin._id,
                    });


                const lockedBasic =
                    await request(app)
                        .get(
                            `/api/training-content/trainee/${f.programme._id}/assessments/basic`
                        )
                        .set(
                            auth(
                                f.tokens.traineeA
                            )
                        );


                expect(
                    lockedBasic.statusCode
                ).toBe(
                    403
                );


                await SectionCompletion.create({
                    trainee:
                        f.traineeA._id,

                    programme:
                        f.programme._id,

                    section:
                        section._id,
                });


                await createQuestions(
                    f.programme,
                    f.admin,
                    'basic',
                    30
                );


                const basic =
                    await request(app)
                        .get(
                            `/api/training-content/trainee/${f.programme._id}/assessments/basic`
                        )
                        .set(
                            auth(
                                f.tokens.traineeA
                            )
                        );


                expect(
                    basic.statusCode
                ).toBe(
                    200
                );


                expect(
                    basic.body.attemptId
                ).toBeTruthy();


                expect(
                    Array.isArray(
                        basic.body.questions
                    )
                ).toBe(
                    true
                );


                expect(
                    basic.body.questions.length
                ).toBeGreaterThan(
                    0
                );


                expect(
                    JSON.stringify(
                        basic.body
                    )
                ).not.toMatch(
                    /correctAnswer/i
                );


                const intermediate =
                    await request(app)
                        .get(
                            `/api/training-content/trainee/${f.programme._id}/assessments/intermediate`
                        )
                        .set(
                            auth(
                                f.tokens.traineeA
                            )
                        );


                expect(
                    intermediate.statusCode
                ).toBe(
                    403
                );
            }
        );


        /*
        |--------------------------------------------------------------------------
        | T2-12 / T2-13
        |--------------------------------------------------------------------------
        */
        test(
            'T2-12/T2-13 server scoring records a successful Beginner assessment attempt',
            async () => {

                const f =
                    await fixture();


                await TrainingAssignment.create({
                    programme:
                        f.programme._id,

                    trainee:
                        f.traineeA._id,

                    assignedBy:
                        f.admin._id,

                    status:
                        'active',
                });


                const section =
                    await LearningSection.create({
                        programme:
                            f.programme._id,

                        title:
                            'Required learning',

                        content:
                            'Required content for progression.',

                        order:
                            1,

                        status:
                            'active',

                        createdBy:
                            f.admin._id,
                    });


                await SectionCompletion.create({
                    trainee:
                        f.traineeA._id,

                    programme:
                        f.programme._id,

                    section:
                        section._id,
                });


                await createQuestions(
                    f.programme,
                    f.admin,
                    'basic',
                    30
                );


                const assessment =
                    await request(app)
                        .get(
                            `/api/training-content/trainee/${f.programme._id}/assessments/basic`
                        )
                        .set(
                            auth(
                                f.tokens.traineeA
                            )
                        );


                expect(
                    assessment.statusCode
                ).toBe(
                    200
                );


                expect(
                    assessment.body.attemptId
                ).toBeTruthy();


                expect(
                    Array.isArray(
                        assessment.body.questions
                    )
                ).toBe(
                    true
                );


                expect(
                    assessment.body.questions.length
                ).toBeGreaterThan(
                    0
                );


                expect(
                    JSON.stringify(
                        assessment.body
                    )
                ).not.toMatch(
                    /correctAnswer/i
                );


                const attemptId =
                    assessment.body.attemptId;


                for (
                    const question
                    of assessment.body.questions
                ) {
                    const answerResponse =
                        await request(app)
                            .post(
                                `/api/training-content/trainee/${f.programme._id}/assessments/basic/questions/${question._id}/check`
                            )
                            .set(
                                auth(
                                    f.tokens.traineeA
                                )
                            )
                            .send({
                                attemptId,

                                answer:
                                    'Correct',
                            });


                    expect(
                        answerResponse.statusCode
                    ).toBe(
                        200
                    );


                    if (
                        Object.prototype.hasOwnProperty.call(
                            answerResponse.body,
                            'recorded'
                        )
                    ) {
                        expect(
                            answerResponse.body.recorded
                        ).toBe(
                            true
                        );
                    }


                    expect(
                        answerResponse.body
                    ).not.toHaveProperty(
                        'correct'
                    );


                    expect(
                        answerResponse.body
                    ).not.toHaveProperty(
                        'correctAnswer'
                    );
                }


                const submit =
                    await request(app)
                        .post(
                            `/api/training-content/trainee/${f.programme._id}/assessments/basic/submit`
                        )
                        .set(
                            auth(
                                f.tokens.traineeA
                            )
                        )
                        .send({
                            attemptId,
                        });


                expect(
                    submit.statusCode
                ).toBe(
                    201
                );


                expect(
                    submit.body.attempt
                ).toBeTruthy();


                expect(
                    submit.body.attempt.passed
                ).toBe(
                    true
                );


                expect(
                    submit.body.attempt.percentage
                ).toBe(
                    100
                );


                expect(
                    submit.body.attempt.attemptNumber
                ).toBe(
                    1
                );
            }
        );


        /*
        |--------------------------------------------------------------------------
        | T2-14
        |--------------------------------------------------------------------------
        */
        test(
            'T2-14 separate assessment attempts are preserved',
            async () => {

                const f =
                    await fixture();


                await TrainingAssignment.create({
                    programme:
                        f.programme._id,

                    trainee:
                        f.traineeA._id,

                    assignedBy:
                        f.admin._id,

                    status:
                        'active',
                });


                const section =
                    await LearningSection.create({
                        programme:
                            f.programme._id,

                        title:
                            'Required learning',

                        content:
                            'Required content for repeated attempt testing.',

                        order:
                            1,

                        status:
                            'active',

                        createdBy:
                            f.admin._id,
                    });


                await SectionCompletion.create({
                    trainee:
                        f.traineeA._id,

                    programme:
                        f.programme._id,

                    section:
                        section._id,
                });


                await createQuestions(
                    f.programme,
                    f.admin,
                    'basic',
                    30
                );


                /*
                |--------------------------------------------------------------------------
                | FIRST ATTEMPT
                |--------------------------------------------------------------------------
                */
                const firstAssessment =
                    await request(app)
                        .get(
                            `/api/training-content/trainee/${f.programme._id}/assessments/basic`
                        )
                        .set(
                            auth(
                                f.tokens.traineeA
                            )
                        );


                expect(
                    firstAssessment.statusCode
                ).toBe(
                    200
                );


                expect(
                    firstAssessment.body.attemptId
                ).toBeTruthy();


                const firstAttemptId =
                    firstAssessment.body.attemptId;


                for (
                    const question
                    of firstAssessment.body.questions
                ) {
                    const answerResponse =
                        await request(app)
                            .post(
                                `/api/training-content/trainee/${f.programme._id}/assessments/basic/questions/${question._id}/check`
                            )
                            .set(
                                auth(
                                    f.tokens.traineeA
                                )
                            )
                            .send({
                                attemptId:
                                    firstAttemptId,

                                answer:
                                    'Correct',
                            });


                    expect(
                        answerResponse.statusCode
                    ).toBe(
                        200
                    );
                }


                const firstSubmit =
                    await request(app)
                        .post(
                            `/api/training-content/trainee/${f.programme._id}/assessments/basic/submit`
                        )
                        .set(
                            auth(
                                f.tokens.traineeA
                            )
                        )
                        .send({
                            attemptId:
                                firstAttemptId,
                        });


                expect(
                    firstSubmit.statusCode
                ).toBe(
                    201
                );


                expect(
                    firstSubmit.body.attempt.attemptNumber
                ).toBe(
                    1
                );


                expect(
                    firstSubmit.body.attempt.passed
                ).toBe(
                    true
                );


                /*
                |--------------------------------------------------------------------------
                | SECOND ATTEMPT
                |--------------------------------------------------------------------------
                */
                const secondAssessment =
                    await request(app)
                        .get(
                            `/api/training-content/trainee/${f.programme._id}/assessments/basic`
                        )
                        .set(
                            auth(
                                f.tokens.traineeA
                            )
                        );


                expect(
                    secondAssessment.statusCode
                ).toBe(
                    200
                );


                expect(
                    secondAssessment.body.attemptId
                ).toBeTruthy();


                const secondAttemptId =
                    secondAssessment.body.attemptId;


                expect(
                    String(
                        secondAttemptId
                    )
                ).not.toBe(
                    String(
                        firstAttemptId
                    )
                );


                /*
                |--------------------------------------------------------------------------
                | Deliberately submit wrong answers
                |--------------------------------------------------------------------------
                */
                for (
                    const question
                    of secondAssessment.body.questions
                ) {
                    const answerResponse =
                        await request(app)
                            .post(
                                `/api/training-content/trainee/${f.programme._id}/assessments/basic/questions/${question._id}/check`
                            )
                            .set(
                                auth(
                                    f.tokens.traineeA
                                )
                            )
                            .send({
                                attemptId:
                                    secondAttemptId,

                                answer:
                                    'Wrong',
                            });


                    expect(
                        answerResponse.statusCode
                    ).toBe(
                        200
                    );
                }


                const secondSubmit =
                    await request(app)
                        .post(
                            `/api/training-content/trainee/${f.programme._id}/assessments/basic/submit`
                        )
                        .set(
                            auth(
                                f.tokens.traineeA
                            )
                        )
                        .send({
                            attemptId:
                                secondAttemptId,
                        });


                expect(
                    secondSubmit.statusCode
                ).toBe(
                    201
                );


                expect(
                    secondSubmit.body.attempt.attemptNumber
                ).toBe(
                    2
                );


                expect(
                    secondSubmit.body.attempt.passed
                ).toBe(
                    false
                );


                expect(
                    String(
                        firstAttemptId
                    )
                ).not.toBe(
                    String(
                        secondAttemptId
                    )
                );
            }
        );


        /*
        |--------------------------------------------------------------------------
        | Results Isolation
        |--------------------------------------------------------------------------
        */
        test(
            'results are isolated: trainee sees own, Trainer B cannot see Trainer A programme attempts',
            async () => {

                const f =
                    await fixture();


                const traineeResults =
                    await request(app)
                        .get(
                            '/api/trainee/results'
                        )
                        .set(
                            auth(
                                f.tokens.traineeA
                            )
                        );


                expect(
                    traineeResults.statusCode
                ).toBe(
                    200
                );


                expect(
                    Array.isArray(
                        traineeResults.body.attempts
                    )
                ).toBe(
                    true
                );


                expect(
                    traineeResults.body.attempts.every(
                        (attempt) =>
                            String(
                                attempt.trainee?._id ||
                                attempt.trainee
                            ) ===
                            f.traineeA._id.toString()
                    )
                ).toBe(
                    true
                );


                const trainerBResults =
                    await request(app)
                        .get(
                            `/api/trainee/results?programmeId=${f.programme._id}`
                        )
                        .set(
                            auth(
                                f.tokens.trainerB
                            )
                        );


                expect(
                    trainerBResults.statusCode
                ).toBe(
                    200
                );


                expect(
                    trainerBResults.body.attempts
                ).toHaveLength(
                    0
                );
            }
        );
    }
);