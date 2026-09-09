import axios from "axios";


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
// This separate Axios instance is used only for
// refreshing the access token.
//
// It does NOT use the main response interceptor,
// preventing an infinite refresh loop.
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
// SESSION HELPERS
// ======================================================

const getAccessToken =
    () => {
        return sessionStorage.getItem(
            "accessToken"
        );
    };


const saveAccessToken =
    (
        accessToken
    ) => {
        if (
            !accessToken
        ) {
            return;
        }


        sessionStorage.setItem(
            "accessToken",
            accessToken
        );
    };


const clearSession =
    () => {
        sessionStorage.removeItem(
            "accessToken"
        );


        sessionStorage.removeItem(
            "user"
        );
    };


// ======================================================
// REDIRECT TO LOGIN
// ======================================================

const redirectToLogin =
    () => {
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
// REFRESH STATE
// ======================================================
//
// If multiple API requests fail at the same time because
// the access token expired, we should send ONLY ONE
// refresh request.
//
// Other failed requests wait for that refresh.
//
// ======================================================

let refreshPromise =
    null;


// ======================================================
// REFRESH ACCESS TOKEN
// ======================================================

const refreshAccessToken =
    async () => {

        // --------------------------------------------------
        // Reuse current refresh request if one is already
        // running.
        // --------------------------------------------------

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
                        const newAccessToken =
                            response.data
                                ?.accessToken;


                        if (
                            !newAccessToken
                        ) {
                            throw new Error(
                                "Refresh response did not contain an access token."
                            );
                        }


                        saveAccessToken(
                            newAccessToken
                        );


                        return newAccessToken;
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
        // ATTACH ACCESS TOKEN
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
        // FORMDATA
        // ==================================================
        //
        // Do not manually force application/json when
        // uploading files.
        //
        // Axios/browser will automatically create the
        // multipart boundary.
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
        // DEACTIVATED ACCOUNT
        // ==================================================

        if (
            status === 403 &&
            code ===
            "ACCOUNT_DEACTIVATED"
        ) {
            clearSession();

            redirectToLogin();


            return Promise.reject(
                error
            );
        }


        // ==================================================
        // FIRST LOGIN PASSWORD CHANGE REQUIRED
        // ==================================================
        //
        // Keep authentication state.
        //
        // Trainer/Trainee still needs the authenticated
        // temporary session to call:
        //
        // POST /auth/change-password
        //
        // ==================================================

        if (
            status === 403 &&
            code ===
            "PASSWORD_CHANGE_REQUIRED"
        ) {
            if (
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
        //
        // Happens after:
        //
        // - Password change
        // - Admin password reset
        // - Session invalidation
        //
        // ==================================================

        if (
            status === 401 &&
            code ===
            "SESSION_REVOKED"
        ) {
            clearSession();

            redirectToLogin();


            return Promise.reject(
                error
            );
        }


        // ==================================================
        // INVALID ACCESS TOKEN
        // ==================================================
        //
        // Invalid tokens should NOT be refreshed.
        //
        // ==================================================

        if (
            status === 401 &&
            code ===
            "INVALID_ACCESS_TOKEN"
        ) {
            clearSession();

            redirectToLogin();


            return Promise.reject(
                error
            );
        }


        // ==================================================
        // ACCESS TOKEN EXPIRED
        // ==================================================
        //
        // Backend access tokens are short-lived.
        //
        // If the refresh-token cookie is still valid:
        //
        // 1. Call /auth/refresh
        // 2. Receive new access token
        // 3. Store new token
        // 4. Retry original request
        //
        // ==================================================

        if (
            status === 401 &&
            code ===
            "ACCESS_TOKEN_EXPIRED" &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry =
                true;


            try {

                // ==========================================
                // GET NEW ACCESS TOKEN
                // ==========================================

                const newAccessToken =
                    await refreshAccessToken();


                // ==========================================
                // UPDATE ORIGINAL REQUEST
                // ==========================================

                originalRequest.headers =
                    originalRequest.headers ||
                    {};


                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;


                // ==========================================
                // RETRY ORIGINAL REQUEST
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
                // - Missing
                // - Expired
                // - Invalid
                // - Revoked
                // - Associated account deactivated
                //
                // ==========================================

                clearSession();

                redirectToLogin();


                return Promise.reject(
                    refreshError
                );
            }
        }


        // ==================================================
        // OTHER 401 RESPONSES
        // ==================================================
        //
        // If there is no usable authentication session,
        // clear local authentication state.
        //
        // Do not interfere with public login requests.
        //
        // ==================================================

        if (
            status === 401 &&
            originalRequest?.url !==
            "/auth/login" &&
            originalRequest?.url !==
            "/auth/forgot-password"
        ) {
            const accessToken =
                getAccessToken();


            if (
                accessToken
            ) {
                clearSession();

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
// EXPORT
// ======================================================

export default api;