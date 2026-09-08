import axios from "axios";


const api =
    axios.create({
        baseURL:
            "http://localhost:5000/api",

        withCredentials:
            true,
    });


// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(
    (config) => {
        const accessToken =
            sessionStorage.getItem(
                "accessToken"
            );


        if (
            accessToken
        ) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }


        /*
            Do not force application/json
            while sending FormData.
        */

        if (
            config.data instanceof
            FormData
        ) {
            delete config
                .headers[
                "Content-Type"
            ];
        }


        return config;
    },

    (error) => {
        return Promise.reject(
            error
        );
    }
);


// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        const status =
            error.response
                ?.status;


        const code =
            error.response
                ?.data
                ?.code;


        // ==================================================
        // DEACTIVATED ACCOUNT
        // ==================================================

        if (
            status === 403 &&
            code ===
            "ACCOUNT_DEACTIVATED"
        ) {
            sessionStorage.removeItem(
                "accessToken"
            );


            sessionStorage.removeItem(
                "user"
            );


            if (
                window.location
                    .pathname !==
                "/login"
            ) {
                window.location.replace(
                    "/login"
                );
            }
        }


        // ==================================================
        // FIRST LOGIN PASSWORD CHANGE REQUIRED
        // ==================================================

        if (
            status === 403 &&
            code ===
            "PASSWORD_CHANGE_REQUIRED"
        ) {
            /*
                Keep authentication state because the
                change-password request requires the
                temporary authenticated access token.

                We only move the user back to /login,
                where the mandatory modal is displayed.
            */

            if (
                window.location
                    .pathname !==
                "/login"
            ) {
                window.location.replace(
                    "/login"
                );
            }
        }


        // ==================================================
        // SESSION REVOKED
        // ==================================================

        if (
            status === 401 &&
            code ===
            "SESSION_REVOKED"
        ) {
            sessionStorage.removeItem(
                "accessToken"
            );


            sessionStorage.removeItem(
                "user"
            );


            if (
                window.location
                    .pathname !==
                "/login"
            ) {
                window.location.replace(
                    "/login"
                );
            }
        }


        return Promise.reject(
            error
        );
    }
);


export default api;