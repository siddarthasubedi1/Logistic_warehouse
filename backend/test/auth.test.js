const request = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../app");
const User = require("../src/models/User");


describe("Authentication", () => {

    test(
        "AUTH-01 - should allow valid Admin login",
        async () => {

            const password =
                "AdminPassword123!";

            const passwordHash =
                await bcrypt.hash(
                    password,
                    10
                );


            await User.create({
                firstName: "Test",
                lastName: "Admin",
                email: "admin@test.com",
                username: "testadmin",
                passwordHash,
                role: "admin",
                status: "active",
                mustChangePassword: false,
            });


            const response =
                await request(app)

                    .post(
                        "/api/auth/login"
                    )

                    .send({
                        username:
                            "testadmin",

                        password,
                    });


            expect(
                response.statusCode
            ).toBe(200);


            expect(
                response.body.user.role
            ).toBe("admin");
        }
    );


    test(
        "AUTH-02 - should allow valid Trainer login",
        async () => {

            const password =
                "TrainerPassword123!";

            const passwordHash =
                await bcrypt.hash(
                    password,
                    10
                );


            await User.create({
                firstName: "Test",
                lastName: "Trainer",
                email: "trainer@test.com",
                username: "testtrainer",
                passwordHash,
                role: "trainer",
                age: 25,
                phoneNumber: "9800000000",
                address: "Kathmandu, Nepal",
                gender: "male",
                status: "active",
                mustChangePassword: false,
            });


            const response =
                await request(app)

                    .post(
                        "/api/auth/login"
                    )

                    .send({
                        username:
                            "testtrainer",

                        password,
                    });


            expect(
                response.statusCode
            ).toBe(200);


            expect(
                response.body.user.role
            ).toBe("trainer");
        }
    );


    test(
        "AUTH-03 - should allow valid Trainee login",
        async () => {

            const password =
                "TraineePassword123!";

            const passwordHash =
                await bcrypt.hash(
                    password,
                    10
                );


            await User.create({
                firstName: "Test",
                lastName: "Trainee",
                email: "trainee@test.com",
                username: "testtrainee",
                passwordHash,
                role: "trainee",
                age: 22,
                phoneNumber: "9811111111",
                address: "Lalitpur, Nepal",
                gender: "female",
                status: "active",
                mustChangePassword: false,
            });


            const response =
                await request(app)

                    .post(
                        "/api/auth/login"
                    )

                    .send({
                        username:
                            "testtrainee",

                        password,
                    });


            expect(
                response.statusCode
            ).toBe(200);


            expect(
                response.body.user.role
            ).toBe("trainee");
        }
    );


    test(
        "AUTH-04 - should reject invalid password",
        async () => {

            const passwordHash =
                await bcrypt.hash(
                    "CorrectPassword123!",
                    10
                );


            await User.create({
                firstName: "Wrong",
                lastName: "Password",
                email: "wrong@test.com",
                username: "wrong.password",
                passwordHash,
                role: "trainer",

                age: 25,
                phoneNumber: "9800000001",
                address: "Kathmandu, Nepal",
                gender: "male",

                accountStatus: "created",
                status: "active",
                mustChangePassword: false,
            });


            const response =
                await request(app)

                    .post(
                        "/api/auth/login"
                    )

                    .send({
                        username:
                            "wrongpassworduser",

                        password:
                            "WrongPassword123!",
                    });


            expect(
                response.statusCode
            ).toBe(401);
        }
    );


    test(
        "AUTH-05 - should reject unknown username",
        async () => {

            const response =
                await request(app)

                    .post(
                        "/api/auth/login"
                    )

                    .send({
                        username:
                            "unknownuser",

                        password:
                            "Password123!",
                    });


            expect(
                response.statusCode
            ).toBe(401);
        }
    );


    test(
        "AUTH-07 - should reject deactivated user",
        async () => {

            const password =
                "DisabledPassword123!";

            const passwordHash =
                await bcrypt.hash(
                    password,
                    10
                );


            await User.create({
                firstName: "Disabled",
                lastName: "User",
                email: "disabled@test.com",
                username: "disableduser",
                passwordHash,
                role: "trainer",

                age: 25,
                phoneNumber: "9800000002",
                address: "Kathmandu, Nepal",
                gender: "male",

                accountStatus: "created",
                status: "deactivated",
                mustChangePassword: false,
            });


            const response =
                await request(app)

                    .post(
                        "/api/auth/login"
                    )

                    .send({
                        username:
                            "disableduser",

                        password,
                    });


            expect(
                response.statusCode
            ).toBe(403);
        }
    );

});