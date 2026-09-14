const request = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../app");
const User = require("../src/models/User");


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

        ...(role !== "admin" && {
            age: 25,
            phoneNumber: "9800000000",
            address: "Kathmandu, Nepal",
            gender: "female",
        }),

        accountStatus: "created",
        status: "active",
        mustChangePassword: false,
    });
}


async function login(
    username,
    password
) {
    const response =
        await request(app)
            .post("/api/auth/login")
            .send({
                username,
                password,
            });

    expect(
        response.statusCode
    ).toBe(200);

    expect(
        response.body.accessToken
    ).toBeDefined();

    return response.body.accessToken;
}


function auth(token) {
    return {
        Authorization:
            `Bearer ${token}`,
    };
}


describe(
    "Sprint 2 - Training Programme, Learning Section and Assignment",
    () => {
        test(
            "Trainer ownership, Admin override, section ordering, assignment and Trainee access work together",
            async () => {
                const adminPassword =
                    "AdminPassword123!";

                const trainerPassword =
                    "TrainerPassword123!";

                const traineePassword =
                    "TraineePassword123!";


                await createUser({
                    firstName: "Sprint",
                    lastName: "Admin",
                    email: "sprint2.admin@test.com",
                    username: "sprint2admin",
                    password: adminPassword,
                    role: "admin",
                });


                const trainerA =
                    await createUser({
                        firstName: "Trainer",
                        lastName: "Alpha",
                        email: "trainer.alpha@test.com",
                        username: "traineralpha",
                        password: trainerPassword,
                        role: "trainer",
                        assignedTrainingSections: [
                            "manual-handling",
                        ],
                    });


                await createUser({
                    firstName: "Trainer",
                    lastName: "Beta",
                    email: "trainer.beta@test.com",
                    username: "trainerbeta",
                    password: trainerPassword,
                    role: "trainer",
                    assignedTrainingSections: [
                        "manual-handling",
                    ],
                });


                const trainee =
                    await createUser({
                        firstName: "Sprint",
                        lastName: "Trainee",
                        email: "sprint2.trainee@test.com",
                        username: "sprint2trainee",
                        password: traineePassword,
                        role: "trainee",
                    });


                const adminToken =
                    await login(
                        "sprint2admin",
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
                        "sprint2trainee",
                        traineePassword
                    );


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
                    createProgrammeResponse.statusCode
                ).toBe(201);


                const programme =
                    createProgrammeResponse.body
                        .programme;


                expect(
                    String(
                        programme.owner?._id ||
                        programme.owner
                    )
                ).toBe(
                    trainerA._id.toString()
                );


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
                    [403, 404]
                ).toContain(
                    deniedUpdate.statusCode
                );


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
                    adminProgrammeResponse.statusCode
                ).toBe(200);


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
                        .send({
                            title:
                                "Introduction to Manual Handling",

                            content:
                                "Understand why correct manual handling reduces workplace injury risk.",

                            imageUrl:
                                "",

                            imageAltText:
                                "",

                            status:
                                "active",
                        });


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
                        .send({
                            title:
                                "Safe Lifting Technique",

                            content:
                                "Plan the lift, keep the load close and avoid twisting while lifting.",

                            imageUrl:
                                "",

                            imageAltText:
                                "",

                            status:
                                "active",
                        });


                expect(
                    sectionOneResponse.statusCode
                ).toBe(201);

                expect(
                    sectionTwoResponse.statusCode
                ).toBe(201);


                const sectionOne =
                    sectionOneResponse.body
                        .section;

                const sectionTwo =
                    sectionTwoResponse.body
                        .section;


                expect(
                    sectionOne.order
                ).toBe(1);

                expect(
                    sectionTwo.order
                ).toBe(2);


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
                    [403, 404]
                ).toContain(
                    deniedSectionEdit.statusCode
                );


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
                    reorderResponse.statusCode
                ).toBe(200);


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


                expect(
                    assignmentResponse.statusCode
                ).toBe(201);


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
                    [400, 409]
                ).toContain(
                    duplicateAssignment.statusCode
                );


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
                    myTrainingResponse.statusCode
                ).toBe(200);

                expect(
                    myTrainingResponse.body
                        .assignments
                        .length
                ).toBe(1);


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


                expect(
                    mySectionsResponse.statusCode
                ).toBe(200);


                expect(
                    mySectionsResponse.body
                        .sections
                        .map(
                            (section) =>
                                section.title
                        )
                ).toEqual([
                    "Safe Lifting Technique",
                    "Introduction to Manual Handling",
                ]);


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
                    traineeManagementAttempt.statusCode
                ).toBe(403);
            }
        );
    }
);