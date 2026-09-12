import axios from "axios";

import {
    clearAuthSession,
    getAccessToken,
    saveAccessToken,
} from "../utils/session";


// ======================================================
// API CONFIGURATION
// ======================================================

const API_BASE_URL =
    "http://localhost:5000/api";


// ======================================================
// MAIN API CLIENT
// ======================================================

const api =
    axios.create({
        baseURL:
            API_BASE_URL,

        withCredentials:
            true,
    });


// ======================================================
// REFRESH CLIENT
// ======================================================
//
// IMPORTANT:
//
// The refresh client must NOT use the main API response
// interceptor.
//
// Otherwise:
//
// access token expires
//      ↓
// interceptor calls refresh
//      ↓
// refresh also hits interceptor
//      ↓
// possible infinite refresh loop
//
// ======================================================

const refreshClient =
    axios.create({
        baseURL:
            API_BASE_URL,

        withCredentials:
            true,
    });


// ======================================================
// REDIRECT TO LOGIN
// ======================================================

const redirectToLogin =
    () => {
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
    };


// ======================================================
// REFRESH PROMISE
// ======================================================
//
// Multiple API requests can fail at the same time when
// an access token expires.
//
// Only ONE refresh request should be sent.
//
// Every other failed request waits for this promise.
//
// ======================================================

let refreshPromise =
    null;


// ======================================================
// REFRESH ACCESS TOKEN
// ======================================================

const refreshAccessToken =
    async () => {
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


                        // ==========================================
                        // STORE NEW ACCESS TOKEN
                        // ==========================================

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
    };


// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(
    (
        config
    ) => {
        const accessToken =
            getAccessToken();


        // ==================================================
        // AUTHORIZATION
        // ==================================================

        if (
            accessToken
        ) {
            config.headers =
                config.headers ||
                {};


            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }


        // ==================================================
        // FILE UPLOAD / FORM DATA
        // ==================================================
        //
        // When FormData is used, do NOT manually set:
        //
        // Content-Type: multipart/form-data
        //
        // The browser automatically includes the required
        // boundary.
        //
        // ==================================================

        if (
            typeof FormData !==
            "undefined" &&
            config.data instanceof
            FormData
        ) {
            if (
                config.headers
            ) {
                delete config
                    .headers[
                    "Content-Type"
                ];
            }
        }


        return config;
    },

    (
        error
    ) => {
        return Promise.reject(
            error
        );
    }
);


// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(
    (
        response
    ) => {
        return response;
    },

    async (
        error
    ) => {
        const status =
            error.response
                ?.status;


        const code =
            error.response
                ?.data
                ?.code;


        const originalRequest =
            error.config;


        // ==================================================
        // ACCOUNT DEACTIVATED
        // ==================================================
        //
        // Admin may deactivate Trainer/Trainee.
        //
        // Their current frontend session must immediately
        // become unusable.
        //
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
        // PASSWORD CHANGE REQUIRED
        // ==================================================
        //
        // IMPORTANT:
        //
        // Do NOT clear the authentication session here.
        //
        // A Trainer/Trainee using a temporary password
        // needs the authenticated temporary session to call:
        //
        // POST /api/auth/change-password
        //
        // Admin is not part of this forced-first-login rule.
        //
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
                window.location
                    .pathname !==
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
        //
        // Can happen after:
        //
        // - user changes password
        // - Admin resets password
        // - session invalidation
        //
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
        //
        // An invalid token must NOT be refreshed.
        //
        // ==================================================

        if (
            status ===
            401 &&
            code ===
            "INVALID_ACCESS_TOKEN"
        ) {
            clearAuthSession();


            redirectToLogin();


            return Promise.reject(
                error
            );
        }


        // ==================================================
        // ACCESS TOKEN EXPIRED
        // ==================================================
        //
        // Backend access tokens are short lived.
        //
        // Flow:
        //
        // 1. API returns ACCESS_TOKEN_EXPIRED
        // 2. Call /auth/refresh
        // 3. Browser sends refresh cookie
        // 4. Receive new access token
        // 5. Save token
        // 6. Retry original request
        //
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


                // ==========================================
                // UPDATE FAILED REQUEST
                // ==========================================

                originalRequest.headers =
                    originalRequest.headers ||
                    {};


                originalRequest
                    .headers
                    .Authorization =
                    `Bearer ${newAccessToken}`;


                // ==========================================
                // RETRY
                // ==========================================

                return api(
                    originalRequest
                );

            } catch (
            refreshError
            ) {
                // ==========================================
                // REFRESH FAILED
                // ==========================================
                //
                // Refresh token may be:
                //
                // - expired
                // - missing
                // - revoked
                // - invalid
                // - attached to a deactivated account
                //
                // ==========================================

                clearAuthSession();


                redirectToLogin();


                return Promise.reject(
                    refreshError
                );
            }
        }


        // ==================================================
        // OTHER 401 ERRORS
        // ==================================================
        //
        // Do not redirect failed public login or password
        // reset requests.
        //
        // ==================================================

        if (
            status ===
            401 &&
            originalRequest
                ?.url !==
            "/auth/login" &&
            originalRequest
                ?.url !==
            "/auth/forgot-password"
        ) {
            const accessToken =
                getAccessToken();


            if (
                accessToken
            ) {
                clearAuthSession();


                redirectToLogin();
            }
        }


        // ==================================================
        // DEFAULT ERROR
        // ==================================================

        return Promise.reject(
            error
        );
    }
);


// ======================================================
// EXPORT API BASE URL
// ======================================================
//
// Useful for profile-image paths if needed.
//
// ======================================================

export {
    API_BASE_URL,
};


// ======================================================
// EXPORT
// ======================================================

export default api;