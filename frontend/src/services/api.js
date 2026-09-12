import axios from "axios";

import {
    clearAuthSession,
    getAccessToken,
    saveAccessToken,
} from "../utils/session";


export const API_BASE_URL =
    "http://localhost:5000/api";


const api =
    axios.create({
        baseURL:
            API_BASE_URL,

        withCredentials:
            true,
    });


const refreshClient =
    axios.create({
        baseURL:
            API_BASE_URL,

        withCredentials:
            true,
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
                    const accessToken =
                        response.data
                            ?.accessToken;


                    if (
                        !accessToken
                    ) {
                        throw new Error(
                            "Refresh response did not contain an access token."
                        );
                    }


                    saveAccessToken(
                        accessToken
                    );


                    return accessToken;
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


api.interceptors.request.use(
    (
        config
    ) => {
        const accessToken =
            getAccessToken();


        if (
            accessToken
        ) {
            config.headers =
                config.headers ||
                {};


            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }


        if (
            typeof FormData !==
            "undefined" &&
            config.data instanceof
            FormData
        ) {
            if (
                config.headers
            ) {
                delete config.headers[
                    "Content-Type"
                ];
            }
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


api.interceptors.response.use(
    (
        response
    ) =>
        response,

    async (
        error
    ) => {
        const status =
            error.response
                ?.status;


        const code =
            String(
                error.response
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


        const isPublicAuthRequest =
            [
                "/auth/login",
                "/auth/forgot-password",
            ].some(
                (
                    endpoint
                ) =>
                    requestUrl.includes(
                        endpoint
                    )
            );


        // ==================================================
        // ACCOUNT DEACTIVATED
        // ==================================================

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


        // ==================================================
        // FIRST LOGIN PASSWORD CHANGE
        // Do NOT clear session.
        // The temporary authenticated session is required
        // to call /auth/change-password.
        // ==================================================

        if (
            status ===
            403 &&
            code ===
            "PASSWORD_CHANGE_REQUIRED"
        ) {
            if (
                typeof window !==
                "undefined" &&
                window.location.pathname !==
                "/login"
            ) {
                window.location.replace(
                    "/login"
                );
            }


            return Promise.reject(
                error
            );
        }


        // ==================================================
        // SESSION REVOKED
        // ==================================================

        if (
            status ===
            401 &&
            code ===
            "SESSION_REVOKED"
        ) {
            clearAuthSession();

            redirectToLogin();

            return Promise.reject(
                error
            );
        }


        // ==================================================
        // INVALID ACCESS TOKEN
        // ==================================================

        if (
            status ===
            401 &&
            [
                "INVALID_ACCESS_TOKEN",
                "AUTHENTICATION_REQUIRED",
                "TOKEN_INVALID",
            ].includes(
                code
            )
        ) {
            if (
                !isPublicAuthRequest
            ) {
                clearAuthSession();

                redirectToLogin();
            }


            return Promise.reject(
                error
            );
        }


        // ==================================================
        // ACCESS TOKEN EXPIRED
        // ==================================================

        if (
            status ===
            401 &&
            code ===
            "ACCESS_TOKEN_EXPIRED" &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry =
                true;


            try {
                const newAccessToken =
                    await refreshAccessToken();


                originalRequest.headers =
                    originalRequest.headers ||
                    {};


                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;


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


        // ==================================================
        // ROLE / AUTHORIZATION DENIED
        //
        // THIS IS THE IMPORTANT FIX FOR YOUR SCREENSHOT.
        // Instead of showing /unauthorized,
        // clear session and return to login.
        // ==================================================

        if (
            status ===
            403 &&
            [
                "FORBIDDEN",
                "ACCESS_DENIED",
                "UNAUTHORIZED",
                "ROLE_NOT_ALLOWED",
                "INSUFFICIENT_PERMISSION",
                "INSUFFICIENT_PERMISSIONS",
            ].includes(
                code
            )
        ) {
            clearAuthSession();

            redirectToLogin();

            return Promise.reject(
                error
            );
        }


        // ==================================================
        // OTHER 401
        // ==================================================

        if (
            status ===
            401 &&
            !isPublicAuthRequest
        ) {
            clearAuthSession();

            redirectToLogin();

            return Promise.reject(
                error
            );
        }


        return Promise.reject(
            error
        );
    }
);


export default api;