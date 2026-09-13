import axios from "axios";

import {
    clearAuthSession,
    getAccessToken,
    saveAccessToken,
} from "../utils/session";


export const API_BASE_URL =
    import.meta.env
        .VITE_API_URL ||
    "http://localhost:5000/api";


const api =
    axios.create({
        baseURL:
            API_BASE_URL,

        withCredentials:
            true,

        timeout:
            15000,
    });


const refreshClient =
    axios.create({
        baseURL:
            API_BASE_URL,

        withCredentials:
            true,

        timeout:
            15000,
    });


function redirectToLogin() {
    if (
        typeof window ===
        "undefined"
    ) {
        return;
    }

    if (
        window.location.pathname !==
        "/login"
    ) {
        window.location.replace(
            "/login"
        );
    }
}


let refreshPromise =
    null;


async function refreshAccessToken() {
    if (
        refreshPromise
    ) {
        return refreshPromise;
    }

    refreshPromise =
        refreshClient
            .post(
                "/auth/refresh"
            )
            .then(
                (
                    response
                ) => {
                    const token =
                        response.data
                            ?.accessToken;

                    if (
                        !token
                    ) {
                        throw new Error(
                            "No access token returned."
                        );
                    }

                    saveAccessToken(
                        token
                    );

                    return token;
                }
            )
            .finally(
                () => {
                    refreshPromise =
                        null;
                }
            );

    return refreshPromise;
}


/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

api.interceptors.request.use(
    (
        config
    ) => {
        const token =
            getAccessToken();

        if (
            token
        ) {
            config.headers =
                config.headers ||
                {};

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        if (
            typeof FormData !==
            "undefined" &&
            config.data instanceof
            FormData &&
            config.headers
        ) {
            delete config.headers[
                "Content-Type"
            ];
        }

        return config;
    },

    (
        error
    ) =>
        Promise.reject(
            error
        )
);


/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
    (
        response
    ) =>
        response,

    async (
        error
    ) => {
        const response =
            error.response;

        const status =
            response?.status;

        const code =
            String(
                response
                    ?.data
                    ?.code ||
                ""
            )
                .trim()
                .toUpperCase();

        const originalRequest =
            error.config;

        const requestUrl =
            originalRequest
                ?.url ||
            "";

        const publicAuthRequest =
            [
                "/auth/login",
                "/auth/forgot-password",
                "/auth/refresh",
            ].some(
                (
                    endpoint
                ) =>
                    requestUrl.includes(
                        endpoint
                    )
            );


        /* ACCOUNT DISABLED */

        if (
            status ===
            403 &&
            code ===
            "ACCOUNT_DEACTIVATED"
        ) {
            clearAuthSession();

            redirectToLogin();

            return Promise.reject(
                error
            );
        }


        /* FORCE PASSWORD CHANGE */

        if (
            status ===
            403 &&
            code ===
            "PASSWORD_CHANGE_REQUIRED"
        ) {
            redirectToLogin();

            return Promise.reject(
                error
            );
        }


        /* UNAUTHORIZED */

        if (
            status ===
            401 &&
            !publicAuthRequest &&
            !originalRequest
                ?._retry
        ) {
            originalRequest._retry =
                true;

            try {
                const newToken =
                    await refreshAccessToken();

                originalRequest.headers =
                    originalRequest.headers ||
                    {};

                originalRequest.headers.Authorization =
                    `Bearer ${newToken}`;

                return api(
                    originalRequest
                );

            } catch (
            refreshError
            ) {
                clearAuthSession();

                redirectToLogin();

                return Promise.reject(
                    refreshError
                );
            }
        }


        /* EXPIRED/INVALID SESSION */

        if (
            status ===
            401 &&
            !publicAuthRequest
        ) {
            clearAuthSession();

            redirectToLogin();
        }


        return Promise.reject(
            error
        );
    }
);


export default api;