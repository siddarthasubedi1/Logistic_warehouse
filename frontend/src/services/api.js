import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});


api.interceptors.request.use(
    (config) => {
        const accessToken =
            sessionStorage.getItem(
                "accessToken"
            );

        if (accessToken) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }


        /*
            IMPORTANT:

            Do not force application/json
            when FormData is being sent.

            The browser must automatically
            generate:

            multipart/form-data;
            boundary=...

            This fixes profile-image upload.
        */

        if (
            config.data instanceof
            FormData
        ) {
            delete config.headers[
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


api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        const status =
            error.response?.status;

        const code =
            error.response?.data
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
                window.location.pathname !==
                "/login"
            ) {
                window.location.replace(
                    "/login"
                );
            }
        }


        // ==================================================
        // REVOKED SESSION
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
                window.location.pathname !==
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