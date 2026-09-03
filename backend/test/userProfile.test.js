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
    return await request(app)
        .post("/api/auth/login")
        .send({
            username,
            password,
        });
}


describe(
    "Protected User Profile API",
    () => {

        test(
            "DASH-01 - unauthenticated user should not access profile API",
            async () => {

                const response =
                    await request(app)
                        .get(
                            "/api/users/me"
                        );


                expect(
                    response.statusCode
                ).toBe(401);
            }
        );


        test(
            "DASH-02 - Admin should access own profile",
            async () => {

                const password =
                    "AdminProfile123!";


                await createUser({
                    firstName:
                        "Profile",

                    lastName:
                        "Admin",

                    email:
                        "profile.admin@test.com",

                    username:
                        "profileadmin",

                    password,

                    role:
                        "admin",
                });


                const loginResponse =
                    await loginUser(
                        "profileadmin",
                        password
                    );


                expect(
                    loginResponse.statusCode
                ).toBe(200);


                const token =
                    loginResponse.body
                        .accessToken;


                const response =
                    await request(app)
                        .get(
                            "/api/users/me"
                        )
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        );


                expect(
                    response.statusCode
                ).toBe(200);


                expect(
                    response.body.user.role
                ).toBe("admin");


                expect(
                    response.body.user.username
                ).toBe("profileadmin");
            }
        );


        test(
            "DASH-03 - Trainer should access own profile",
            async () => {

                const password =
                    "TrainerProfile123!";


                await createUser({
                    firstName:
                        "Profile",

                    lastName:
                        "Trainer",

                    email:
                        "profile.trainer@test.com",

                    username:
                        "profiletrainer",

                    password,

                    role:
                        "trainer",
                });


                const loginResponse =
                    await loginUser(
                        "profiletrainer",
                        password
                    );


                const token =
                    loginResponse.body
                        .accessToken;


                const response =
                    await request(app)
                        .get(
                            "/api/users/me"
                        )
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        );


                expect(
                    response.statusCode
                ).toBe(200);


                expect(
                    response.body.user.role
                ).toBe("trainer");


                expect(
                    response.body.user.username
                ).toBe("profiletrainer");
            }
        );


        test(
            "DASH-04 - Trainee should access own profile",
            async () => {

                const password =
                    "TraineeProfile123!";


                await createUser({
                    firstName:
                        "Profile",

                    lastName:
                        "Trainee",

                    email:
                        "profile.trainee@test.com",

                    username:
                        "profiletrainee",

                    password,

                    role:
                        "trainee",
                });


                const loginResponse =
                    await loginUser(
                        "profiletrainee",
                        password
                    );


                const token =
                    loginResponse.body
                        .accessToken;


                const response =
                    await request(app)
                        .get(
                            "/api/users/me"
                        )
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        );


                expect(
                    response.statusCode
                ).toBe(200);


                expect(
                    response.body.user.role
                ).toBe("trainee");


                expect(
                    response.body.user.username
                ).toBe("profiletrainee");
            }
        );

    }
);