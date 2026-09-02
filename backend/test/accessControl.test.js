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
}) {
    const passwordHash =
        await bcrypt.hash(
            password,
            10
        );

    return await User.create({
        firstName,
        lastName,
        email,
        username,
        passwordHash,
        role,
        status: "active",
        mustChangePassword: false,
    });
}


async function loginUser(
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

    return response;
}


describe(
    "Role-Based Access Control",
    () => {

        test(
            "AC-08 - unauthenticated user should not access Admin API",
            async () => {

                const response =
                    await request(app)
                        .get(
                            "/api/admin/users"
                        );


                expect(
                    response.statusCode
                ).toBe(401);
            }
        );


        test(
            "AC-15 - invalid token should be rejected",
            async () => {

                const response =
                    await request(app)
                        .get(
                            "/api/admin/users"
                        )
                        .set(
                            "Authorization",
                            "Bearer invalid-token"
                        );


                expect(
                    response.statusCode
                ).toBe(401);
            }
        );


        test(
            "AC-11 - Trainer should not access Admin API",
            async () => {

                const password =
                    "TrainerPassword123!";


                await createUser({
                    firstName:
                        "Access",

                    lastName:
                        "Trainer",

                    email:
                        "access.trainer@test.com",

                    username:
                        "accesstrainer",

                    password,

                    role:
                        "trainer",
                });


                const loginResponse =
                    await loginUser(
                        "accesstrainer",
                        password
                    );


                expect(
                    loginResponse.statusCode
                ).toBe(200);


                const token =
                    loginResponse.body
                        .accessToken;


                expect(token).toBeDefined();


                const response =
                    await request(app)
                        .get(
                            "/api/admin/users"
                        )
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        );


                expect(
                    response.statusCode
                ).toBe(403);
            }
        );


        test(
            "AC-12 - Trainee should not access Admin API",
            async () => {

                const password =
                    "TraineePassword123!";


                await createUser({
                    firstName:
                        "Access",

                    lastName:
                        "Trainee",

                    email:
                        "access.trainee@test.com",

                    username:
                        "accesstrainee",

                    password,

                    role:
                        "trainee",
                });


                const loginResponse =
                    await loginUser(
                        "accesstrainee",
                        password
                    );


                expect(
                    loginResponse.statusCode
                ).toBe(200);


                const token =
                    loginResponse.body
                        .accessToken;


                expect(token).toBeDefined();


                const response =
                    await request(app)
                        .get(
                            "/api/admin/users"
                        )
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        );


                expect(
                    response.statusCode
                ).toBe(403);
            }
        );


        test(
            "AC-13 - Admin should access Admin API",
            async () => {

                const password =
                    "AdminPassword123!";


                await createUser({
                    firstName:
                        "Access",

                    lastName:
                        "Admin",

                    email:
                        "access.admin@test.com",

                    username:
                        "accessadmin",

                    password,

                    role:
                        "admin",
                });


                const loginResponse =
                    await loginUser(
                        "accessadmin",
                        password
                    );


                expect(
                    loginResponse.statusCode
                ).toBe(200);


                const token =
                    loginResponse.body
                        .accessToken;


                expect(token).toBeDefined();


                const response =
                    await request(app)
                        .get(
                            "/api/admin/users"
                        )
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        );


                expect(
                    response.statusCode
                ).toBe(200);
            }
        );

    }
);