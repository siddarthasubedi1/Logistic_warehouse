const request =
    require("supertest");

const bcrypt =
    require("bcrypt");

const sharp =
    require("sharp");

const app =
    require("../app");

const User =
    require("../src/models/User");

const TrainingModule =
    require("../src/models/TrainingModule");


/* =========================================================
   GENERATE REAL TEST PNG

   Sharp creates a valid PNG buffer so the test image
   passes the same validation used by the real application.
========================================================= */

async function createTestImageBuffer() {
    return sharp({
        create: {
            width:
                20,

            height:
                20,

            channels:
                3,

            background: {
                r:
                    255,

                g:
                    255,

                b:
                    255,
            },
        },
    })
        .png()
        .toBuffer();
}


/* =========================================================
   CREATE TEST USER
========================================================= */

async function createUser({
    firstName,
    lastName,
    email,
    username,
    password,
    role,
    assignedTrainingSections = [],
}) {
    const passwordHash =
        await bcrypt.hash(
            password,
            12
        );


    return User.create({
        firstName,
        lastName,
        email,
        username,
        passwordHash,
        role,
        assignedTrainingSections,

        ...(role !==
            "admin" && {
            age:
                25,

            phoneNumber:
                "9800000000",

            address:
                "Kathmandu, Nepal",

            gender:
                "female",
        }),

        accountStatus:
            "created",

        status:
            "active",

        mustChangePassword:
            false,
    });
}


/* =========================================================
   LOGIN TEST USER
========================================================= */

async function login(
    username,
    password
) {
    const response =
        await request(app)
            .post(
                "/api/auth/login"
            )
            .send({
                username,
                password,
            });


    expect(
        response.statusCode
    ).toBe(
        200
    );


    expect(
        response.body
            .accessToken
    ).toBeDefined();


    return response.body
        .accessToken;
}


/* =========================================================
   AUTH HEADER
========================================================= */

function auth(
    token
) {
    return {
        Authorization:
            `Bearer ${token}`,
    };
}


/* =========================================================
   SPRINT 2 INTEGRATION TEST
========================================================= */

describe(
    "Training Content - Training Programme, Learning Section and Assignment",

    () => {
        test(
            "Trainer ownership, Admin override, section ordering, assignment and Trainee access work together",

            async () => {
                /* ==========================================
                   VALID TEST IMAGE
                =========================================== */

                const TEST_IMAGE_BUFFER =
                    await createTestImageBuffer();


                /* ==========================================
                   PASSWORDS
                =========================================== */

                const adminPassword =
                    "AdminPassword123!";

                const trainerPassword =
                    "TrainerPassword123!";

                const traineePassword =
                    "TraineePassword123!";


                /* ==========================================
                   CREATE ADMIN
                =========================================== */

                const admin =
                    await createUser({
                        firstName:
                            "Sprint",

                        lastName:
                            "Admin",

                        email:
                            "training-content.admin@test.com",

                        username:
                            "training-contentadmin",

                        password:
                            adminPassword,

                        role:
                            "admin",
                    });


                /* ==========================================
                   CREATE TRAINER A
                =========================================== */

                const trainerA =
                    await createUser({
                        firstName:
                            "Trainer",

                        lastName:
                            "Alpha",

                        email:
                            "trainer.alpha@test.com",

                        username:
                            "traineralpha",

                        password:
                            trainerPassword,

                        role:
                            "trainer",

                        assignedTrainingSections: [
                            "manual-handling",
                        ],
                    });


                /* ==========================================
                   CREATE TRAINER B
                =========================================== */

                await createUser({
                    firstName:
                        "Trainer",

                    lastName:
                        "Beta",

                    email:
                        "trainer.beta@test.com",

                    username:
                        "trainerbeta",

                    password:
                        trainerPassword,

                    role:
                        "trainer",

                    assignedTrainingSections: [
                        "manual-handling",
                    ],
                });


                /* ==========================================
                   CREATE TRAINEE

                   Trainee is eligible for BOTH Training Content
                   programme types.
                =========================================== */

                const trainee =
                    await createUser({
                        firstName:
                            "Sprint",

                        lastName:
                            "Trainee",

                        email:
                            "training-content.trainee@test.com",

                        username:
                            "training-contenttrainee",

                        password:
                            traineePassword,

                        role:
                            "trainee",

                        assignedTrainingSections: [
                            "manual-handling",
                            "working-at-height",
                        ],
                    });


                /* ==========================================
                   CREATE DATABASE-BACKED TRAINING MODULE

                   Training Content programme creation now validates
                   programmeType against TrainingModule.
                   The test must therefore create the same
                   module relationship used by the real app.
                =========================================== */

                await TrainingModule.create({
                    name:
                        "Manual Handling",

                    code:
                        "MH",

                    key:
                        "manual-handling",

                    description:
                        "Manual handling safety training module used by the Training Content integration test.",

                    status:
                        "active",

                    createdBy:
                        admin._id,
                });


                /* ==========================================
                   LOGIN USERS
                =========================================== */

                const adminToken =
                    await login(
                        "training-contentadmin",
                        adminPassword
                    );


                const trainerAToken =
                    await login(
                        "traineralpha",
                        trainerPassword
                    );


                const trainerBToken =
                    await login(
                        "trainerbeta",
                        trainerPassword
                    );


                const traineeToken =
                    await login(
                        "training-contenttrainee",
                        traineePassword
                    );


                /* ==========================================
                   TRAINER A CREATES PROGRAMME
                =========================================== */

                const createProgrammeResponse =
                    await request(app)
                        .post(
                            "/api/training-programmes"
                        )
                        .set(
                            auth(
                                trainerAToken
                            )
                        )
                        .send({
                            programmeType:
                                "manual-handling",

                            title:
                                "Manual Handling Essentials",

                            description:
                                "Safe lifting, carrying and movement techniques for warehouse staff.",

                            passMark:
                                80,

                            status:
                                "active",
                        });


                expect(
                    createProgrammeResponse
                        .statusCode
                ).toBe(
                    201
                );


                const programme =
                    createProgrammeResponse
                        .body
                        .programme;


                /* ==========================================
                   VERIFY OWNER
                =========================================== */

                expect(
                    String(
                        programme
                            .owner?._id ||
                        programme.owner
                    )
                ).toBe(
                    trainerA
                        ._id
                        .toString()
                );


                /* ==========================================
                   TRAINER B CANNOT EDIT TRAINER A PROGRAMME
                =========================================== */

                const deniedUpdate =
                    await request(app)
                        .patch(
                            `/api/training-programmes/${programme._id}`
                        )
                        .set(
                            auth(
                                trainerBToken
                            )
                        )
                        .send({
                            title:
                                "Unauthorised Edit",
                        });


                expect(
                    [
                        403,
                        404,
                    ]
                ).toContain(
                    deniedUpdate
                        .statusCode
                );


                /* ==========================================
                   ADMIN CAN VIEW PROGRAMME
                =========================================== */

                const adminProgrammeResponse =
                    await request(app)
                        .get(
                            `/api/training-programmes/${programme._id}`
                        )
                        .set(
                            auth(
                                adminToken
                            )
                        );


                expect(
                    adminProgrammeResponse
                        .statusCode
                ).toBe(
                    200
                );


                /* ==========================================
                   IMAGE REQUIRED VALIDATION
                =========================================== */

                const sectionWithoutImage =
                    await request(app)
                        .post(
                            `/api/training-programmes/${programme._id}/sections`
                        )
                        .set(
                            auth(
                                trainerAToken
                            )
                        )
                        .field(
                            "title",
                            "Section Without Image"
                        )
                        .field(
                            "content",
                            "This learning section intentionally does not include an image."
                        )
                        .field(
                            "imageAltText",
                            "Test image description"
                        )
                        .field(
                            "status",
                            "active"
                        );


                expect(
                    sectionWithoutImage
                        .statusCode
                ).toBe(
                    400
                );


                expect(
                    sectionWithoutImage
                        .body
                        .code
                ).toBe(
                    "TRAINING_IMAGE_REQUIRED"
                );


                /* ==========================================
                   CREATE SECTION ONE
                =========================================== */

                const sectionOneResponse =
                    await request(app)
                        .post(
                            `/api/training-programmes/${programme._id}/sections`
                        )
                        .set(
                            auth(
                                trainerAToken
                            )
                        )
                        .field(
                            "title",
                            "Introduction to Manual Handling"
                        )
                        .field(
                            "content",
                            "Understand why correct manual handling reduces workplace injury risk."
                        )
                        .field(
                            "imageAltText",
                            "Worker demonstrating safe manual handling technique"
                        )
                        .field(
                            "status",
                            "active"
                        )
                        .attach(
                            "image",
                            TEST_IMAGE_BUFFER,
                            {
                                filename:
                                    "manual-handling-introduction.png",

                                contentType:
                                    "image/png",
                            }
                        );


                /* ==========================================
                   CREATE SECTION TWO
                =========================================== */

                const sectionTwoResponse =
                    await request(app)
                        .post(
                            `/api/training-programmes/${programme._id}/sections`
                        )
                        .set(
                            auth(
                                trainerAToken
                            )
                        )
                        .field(
                            "title",
                            "Safe Lifting Technique"
                        )
                        .field(
                            "content",
                            "Plan the lift, keep the load close and avoid twisting while lifting."
                        )
                        .field(
                            "imageAltText",
                            "Worker lifting a box using safe lifting posture"
                        )
                        .field(
                            "status",
                            "active"
                        )
                        .attach(
                            "image",
                            TEST_IMAGE_BUFFER,
                            {
                                filename:
                                    "safe-lifting-technique.png",

                                contentType:
                                    "image/png",
                            }
                        );


                /* ==========================================
                   DEBUG SECTION ERRORS IF THEY OCCUR
                =========================================== */

                if (
                    sectionOneResponse
                        .statusCode !==
                    201
                ) {
                    console.log(
                        "SECTION ONE ERROR:",
                        sectionOneResponse
                            .statusCode,
                        sectionOneResponse
                            .body
                    );
                }


                if (
                    sectionTwoResponse
                        .statusCode !==
                    201
                ) {
                    console.log(
                        "SECTION TWO ERROR:",
                        sectionTwoResponse
                            .statusCode,
                        sectionTwoResponse
                            .body
                    );
                }


                /* ==========================================
                   VERIFY SECTION CREATION
                =========================================== */

                expect(
                    sectionOneResponse
                        .statusCode
                ).toBe(
                    201
                );


                expect(
                    sectionTwoResponse
                        .statusCode
                ).toBe(
                    201
                );


                const sectionOne =
                    sectionOneResponse
                        .body
                        .section;


                const sectionTwo =
                    sectionTwoResponse
                        .body
                        .section;


                /* ==========================================
                   VERIFY IMAGE PATH
                =========================================== */

                expect(
                    sectionOne
                        .imageUrl
                ).toBeDefined();


                expect(
                    sectionOne
                        .imageUrl
                ).toContain(
                    "/uploads/training/"
                );


                expect(
                    sectionTwo
                        .imageUrl
                ).toBeDefined();


                expect(
                    sectionTwo
                        .imageUrl
                ).toContain(
                    "/uploads/training/"
                );


                /* ==========================================
                   VERIFY AUTOMATIC ORDER
                =========================================== */

                expect(
                    sectionOne.order
                ).toBe(
                    1
                );


                expect(
                    sectionTwo.order
                ).toBe(
                    2
                );


                /* ==========================================
                   TRAINER B CANNOT EDIT SECTION
                =========================================== */

                const deniedSectionEdit =
                    await request(app)
                        .patch(
                            `/api/training-programmes/${programme._id}/sections/${sectionOne._id}`
                        )
                        .set(
                            auth(
                                trainerBToken
                            )
                        )
                        .send({
                            title:
                                "Unauthorised Section Edit",
                        });


                expect(
                    [
                        403,
                        404,
                    ]
                ).toContain(
                    deniedSectionEdit
                        .statusCode
                );


                /* ==========================================
                   REORDER LEARNING SECTIONS
                =========================================== */

                const reorderResponse =
                    await request(app)
                        .put(
                            `/api/training-programmes/${programme._id}/sections/reorder`
                        )
                        .set(
                            auth(
                                trainerAToken
                            )
                        )
                        .send({
                            sectionIds: [
                                sectionTwo._id,
                                sectionOne._id,
                            ],
                        });


                expect(
                    reorderResponse
                        .statusCode
                ).toBe(
                    200
                );


                /* ==========================================
                   ADMIN ASSIGNS PROGRAMME TO TRAINEE
                =========================================== */

                const assignmentResponse =
                    await request(app)
                        .post(
                            "/api/training-assignments"
                        )
                        .set(
                            auth(
                                adminToken
                            )
                        )
                        .send({
                            programmeId:
                                programme._id,

                            traineeId:
                                trainee._id,
                        });


                /* ==========================================
                   DEBUG ASSIGNMENT ERROR
                =========================================== */

                if (
                    assignmentResponse
                        .statusCode !==
                    201
                ) {
                    console.log(
                        "ASSIGNMENT ERROR:",
                        assignmentResponse
                            .statusCode,
                        assignmentResponse
                            .body
                    );
                }


                expect(
                    assignmentResponse
                        .statusCode
                ).toBe(
                    201
                );


                /* ==========================================
                   DUPLICATE ASSIGNMENT MUST FAIL
                =========================================== */

                const duplicateAssignment =
                    await request(app)
                        .post(
                            "/api/training-assignments"
                        )
                        .set(
                            auth(
                                adminToken
                            )
                        )
                        .send({
                            programmeId:
                                programme._id,

                            traineeId:
                                trainee._id,
                        });


                expect(
                    [
                        400,
                        409,
                    ]
                ).toContain(
                    duplicateAssignment
                        .statusCode
                );


                /* ==========================================
                   TRAINEE SEES ASSIGNED TRAINING
                =========================================== */

                const myTrainingResponse =
                    await request(app)
                        .get(
                            "/api/my-training"
                        )
                        .set(
                            auth(
                                traineeToken
                            )
                        );


                expect(
                    myTrainingResponse
                        .statusCode
                ).toBe(
                    200
                );


                expect(
                    myTrainingResponse
                        .body
                        .assignments
                        .length
                ).toBe(
                    1
                );


                /* ==========================================
                   TRAINEE LOADS PROGRAMME DETAILS
                =========================================== */

                const myProgrammeResponse =
                    await request(app)
                        .get(
                            `/api/my-training/${programme._id}`
                        )
                        .set(
                            auth(
                                traineeToken
                            )
                        );


                expect(
                    myProgrammeResponse
                        .statusCode
                ).toBe(
                    200
                );


                /* ==========================================
                   TRAINEE LOADS LEARNING SECTIONS
                =========================================== */

                const mySectionsResponse =
                    await request(app)
                        .get(
                            `/api/my-training/${programme._id}/sections`
                        )
                        .set(
                            auth(
                                traineeToken
                            )
                        );


                if (
                    mySectionsResponse
                        .statusCode !==
                    200
                ) {
                    console.log(
                        "MY TRAINING SECTIONS ERROR:",
                        mySectionsResponse
                            .statusCode,
                        mySectionsResponse
                            .body
                    );
                }


                expect(
                    mySectionsResponse
                        .statusCode
                ).toBe(
                    200
                );


                /* ==========================================
                   VERIFY REORDERED SECTION SEQUENCE
                =========================================== */

                expect(
                    mySectionsResponse
                        .body
                        .sections
                        .map(
                            (
                                section
                            ) =>
                                section.title
                        )
                ).toEqual([
                    "Safe Lifting Technique",
                    "Introduction to Manual Handling",
                ]);


                /* ==========================================
                   VERIFY TRAINEE RECEIVES IMAGE PATHS
                =========================================== */

                expect(
                    mySectionsResponse
                        .body
                        .sections[0]
                        .imageUrl
                ).toContain(
                    "/uploads/training/"
                );


                expect(
                    mySectionsResponse
                        .body
                        .sections[1]
                        .imageUrl
                ).toContain(
                    "/uploads/training/"
                );


                /* ==========================================
                   VERIFY IMAGE ALT TEXT
                =========================================== */

                expect(
                    mySectionsResponse
                        .body
                        .sections[0]
                        .imageAltText
                ).toBe(
                    "Worker lifting a box using safe lifting posture"
                );


                expect(
                    mySectionsResponse
                        .body
                        .sections[1]
                        .imageAltText
                ).toBe(
                    "Worker demonstrating safe manual handling technique"
                );


                /* ==========================================
                   TRAINEE CANNOT CREATE PROGRAMME
                =========================================== */

                const traineeManagementAttempt =
                    await request(app)
                        .post(
                            "/api/training-programmes"
                        )
                        .set(
                            auth(
                                traineeToken
                            )
                        )
                        .send({
                            programmeType:
                                "manual-handling",

                            title:
                                "Should Not Work",

                            description:
                                "Trainees must not create training programmes.",

                            passMark:
                                80,

                            status:
                                "active",
                        });


                expect(
                    traineeManagementAttempt
                        .statusCode
                ).toBe(
                    403
                );
            }
        );
    }
);