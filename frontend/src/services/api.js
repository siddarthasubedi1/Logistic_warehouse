import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:5000/api",

    /*
        Required because the backend stores the
        refresh token in an httpOnly cookie.
    */
    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },
});


/*
    ============================================
    REQUEST INTERCEPTOR
    ============================================

    Add the current access token to protected
    backend requests.

    Example:

    Authorization: Bearer eyJ...
*/

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


        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


/*
    ============================================
    RESPONSE INTERCEPTOR
    ============================================
*/

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        const status =
            error.response?.status;

        const code =
            error.response?.data?.code;


        /*
            ====================================
            DEACTIVATED ACCOUNT
            ====================================

            Your backend returns:

            code: ACCOUNT_DEACTIVATED

            when a deactivated user attempts to
            use a protected API.
        */

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


            /*
                Avoid redirect loop if the user
                is already on the login page.
            */

            if (
                window.location.pathname !==
                "/login"
            ) {
                window.location.replace(
                    "/login"
                );
            }
        }


        /*
            IMPORTANT FOR SPRINT 1:

            We do NOT automatically redirect every
            401 response here.

            Login itself can return 401 for an
            incorrect username/password, and
            LoginForm.jsx needs that response so it
            can display:

            "Invalid username or password."

            Therefore normal 401 handling remains
            with the component that made the request.
        */


        return Promise.reject(error);
    }
);


export default api;