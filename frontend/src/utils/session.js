const ACCESS_TOKEN_KEY =
    "accessToken";

const USER_KEY =
    "user";

const FORCE_PASSWORD_CHANGE_KEY =
    "forcePasswordChange";


/* =========================================================
   NORMALIZE ROLE
========================================================= */

export function normalizeRole(
    role
) {
    const value =
        String(
            role || ""
        )
            .trim()
            .toLowerCase();


    if (
        value === "administrator" ||
        value === "admin"
    ) {
        return "admin";
    }


    if (
        value === "trainer"
    ) {
        return "trainer";
    }


    if (
        value === "trainee"
    ) {
        return "trainee";
    }


    return value;
}


/* =========================================================
   ACCESS TOKEN
========================================================= */

export function getAccessToken() {
    return (
        sessionStorage.getItem(
            ACCESS_TOKEN_KEY
        ) ||
        ""
    );
}


/* =========================================================
   SAVE ACCESS TOKEN

   Required by:
   frontend/src/services/api.js
========================================================= */

export function saveAccessToken(
    accessToken
) {
    if (
        !accessToken
    ) {
        sessionStorage.removeItem(
            ACCESS_TOKEN_KEY
        );

        return;
    }


    sessionStorage.setItem(
        ACCESS_TOKEN_KEY,
        accessToken
    );
}


/* =========================================================
   SESSION USER
========================================================= */

export function getSessionUser() {
    const storedUser =
        sessionStorage.getItem(
            USER_KEY
        );


    if (
        !storedUser
    ) {
        return null;
    }


    try {
        return JSON.parse(
            storedUser
        );

    } catch (
    error
    ) {
        console.error(
            "Unable to parse session user:",
            error
        );


        sessionStorage.removeItem(
            USER_KEY
        );


        return null;
    }
}


/* =========================================================
   USER INITIAL

   Required by:
   DashboardLayout.jsx
========================================================= */

export function getUserInitial(
    user
) {
    if (
        !user
    ) {
        return "U";
    }


    const firstName =
        String(
            user.firstName ||
            ""
        )
            .trim();


    const lastName =
        String(
            user.lastName ||
            ""
        )
            .trim();


    if (
        firstName &&
        lastName
    ) {
        return (
            firstName
                .charAt(0)
                .toUpperCase() +
            lastName
                .charAt(0)
                .toUpperCase()
        );
    }


    if (
        firstName
    ) {
        return firstName
            .charAt(0)
            .toUpperCase();
    }


    const username =
        String(
            user.username ||
            ""
        )
            .trim();


    if (
        username
    ) {
        return username
            .charAt(0)
            .toUpperCase();
    }


    return "U";
}


/* =========================================================
   SAVE COMPLETE AUTH SESSION
========================================================= */

export function saveAuthSession({
    accessToken,
    user,
}) {
    saveAccessToken(
        accessToken
    );


    if (
        user
    ) {
        sessionStorage.setItem(
            USER_KEY,
            JSON.stringify(
                user
            )
        );
    }


    const role =
        normalizeRole(
            user?.role
        );


    if (
        (
            role === "trainer" ||
            role === "trainee"
        ) &&
        user?.mustChangePassword === true
    ) {
        sessionStorage.setItem(
            FORCE_PASSWORD_CHANGE_KEY,
            "true"
        );

    } else {
        sessionStorage.removeItem(
            FORCE_PASSWORD_CHANGE_KEY
        );
    }
}


/* =========================================================
   UPDATE SESSION USER
========================================================= */

export function updateSessionUser(
    user
) {
    if (
        !user
    ) {
        return;
    }


    sessionStorage.setItem(
        USER_KEY,
        JSON.stringify(
            user
        )
    );


    const role =
        normalizeRole(
            user.role
        );


    if (
        (
            role === "trainer" ||
            role === "trainee"
        ) &&
        user.mustChangePassword === true
    ) {
        sessionStorage.setItem(
            FORCE_PASSWORD_CHANGE_KEY,
            "true"
        );

    } else {
        sessionStorage.removeItem(
            FORCE_PASSWORD_CHANGE_KEY
        );
    }
}


/* =========================================================
   BACKWARD COMPATIBILITY

   Some current files still use saveSessionUser().
========================================================= */

export function saveSessionUser(
    user
) {
    updateSessionUser(
        user
    );
}


/* =========================================================
   CLEAR AUTH SESSION
========================================================= */

export function clearAuthSession() {
    sessionStorage.removeItem(
        ACCESS_TOKEN_KEY
    );


    sessionStorage.removeItem(
        USER_KEY
    );


    sessionStorage.removeItem(
        FORCE_PASSWORD_CHANGE_KEY
    );
}


/* =========================================================
   AUTHENTICATED?
========================================================= */

export function isAuthenticated() {
    return Boolean(
        getAccessToken() &&
        getSessionUser()
    );
}


/* =========================================================
   FORCED PASSWORD CHANGE?
========================================================= */

export function needsForcedPasswordChange() {
    const user =
        getSessionUser();


    if (
        !user
    ) {
        return false;
    }


    const role =
        normalizeRole(
            user.role
        );


    if (
        role === "admin"
    ) {
        return false;
    }


    return (
        user.mustChangePassword === true ||
        sessionStorage.getItem(
            FORCE_PASSWORD_CHANGE_KEY
        ) === "true"
    );
}


/* =========================================================
   CLEAR FORCED PASSWORD CHANGE
========================================================= */

export function clearForcedPasswordChange() {
    sessionStorage.removeItem(
        FORCE_PASSWORD_CHANGE_KEY
    );


    const user =
        getSessionUser();


    if (
        user
    ) {
        updateSessionUser({
            ...user,

            mustChangePassword:
                false,
        });
    }
}


/* =========================================================
   DASHBOARD PATH
========================================================= */

export function getDashboardPath(
    role
) {
    const normalizedRole =
        normalizeRole(
            role
        );


    if (
        normalizedRole === "admin"
    ) {
        return "/admin";
    }


    if (
        normalizedRole === "trainer"
    ) {
        return "/trainer";
    }


    if (
        normalizedRole === "trainee"
    ) {
        return "/trainee";
    }


    return "/login";
}


/* =========================================================
   ROLE CHECK
========================================================= */

export function isRoleAllowed(
    allowedRoles = []
) {
    const user =
        getSessionUser();


    if (
        !user
    ) {
        return false;
    }


    const currentRole =
        normalizeRole(
            user.role
        );


    const roles =
        Array.isArray(
            allowedRoles
        )
            ? allowedRoles
            : [
                allowedRoles,
            ];


    const normalizedRoles =
        roles.map(
            (
                role
            ) =>
                normalizeRole(
                    role
                )
        );


    return normalizedRoles.includes(
        currentRole
    );
}


/* =========================================================
   STORAGE KEYS
========================================================= */

export {
    ACCESS_TOKEN_KEY,
    USER_KEY,
    FORCE_PASSWORD_CHANGE_KEY,
};