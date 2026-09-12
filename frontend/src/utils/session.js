const ACCESS_TOKEN_KEY =
    "accessToken";


const USER_KEY =
    "user";


function canUseSessionStorage() {
    return (
        typeof window !==
        "undefined" &&
        typeof window.sessionStorage !==
        "undefined"
    );
}


export function normalizeRole(
    role
) {
    return String(
        role ||
        ""
    )
        .trim()
        .toLowerCase();
}


export function getSessionUser() {
    if (
        !canUseSessionStorage()
    ) {
        return null;
    }


    try {
        const stored =
            window.sessionStorage.getItem(
                USER_KEY
            );


        if (
            !stored
        ) {
            return null;
        }


        const user =
            JSON.parse(
                stored
            );


        if (
            !user ||
            typeof user !==
            "object" ||
            Array.isArray(
                user
            )
        ) {
            return null;
        }


        return user;

    } catch (
    error
    ) {
        console.error(
            "Unable to read user session:",
            error
        );


        return null;
    }
}


export function saveSessionUser(
    user
) {
    if (
        !canUseSessionStorage() ||
        !user ||
        typeof user !==
        "object" ||
        Array.isArray(
            user
        )
    ) {
        return;
    }


    try {
        window.sessionStorage.setItem(
            USER_KEY,
            JSON.stringify(
                user
            )
        );

    } catch (
    error
    ) {
        console.error(
            "Unable to save session user:",
            error
        );
    }
}


export function updateSessionUser(
    updates
) {
    const currentUser =
        getSessionUser();


    if (
        !currentUser ||
        !updates ||
        typeof updates !==
        "object"
    ) {
        return null;
    }


    const updatedUser = {
        ...currentUser,
        ...updates,
    };


    saveSessionUser(
        updatedUser
    );


    return updatedUser;
}


export function getAccessToken() {
    if (
        !canUseSessionStorage()
    ) {
        return "";
    }


    return (
        window.sessionStorage.getItem(
            ACCESS_TOKEN_KEY
        ) ||
        ""
    );
}


export function saveAccessToken(
    accessToken
) {
    if (
        !canUseSessionStorage() ||
        !accessToken ||
        typeof accessToken !==
        "string"
    ) {
        return;
    }


    window.sessionStorage.setItem(
        ACCESS_TOKEN_KEY,
        accessToken
    );
}


export function saveAuthSession({
    accessToken,
    user,
}) {
    if (
        accessToken
    ) {
        saveAccessToken(
            accessToken
        );
    }


    if (
        user
    ) {
        saveSessionUser(
            user
        );
    }
}


export function clearAuthSession() {
    if (
        !canUseSessionStorage()
    ) {
        return;
    }


    window.sessionStorage.removeItem(
        ACCESS_TOKEN_KEY
    );


    window.sessionStorage.removeItem(
        USER_KEY
    );
}


export function hasAuthSession() {
    return Boolean(
        getAccessToken() &&
        getSessionUser()
    );
}


export function isUserRole(
    role
) {
    const user =
        getSessionUser();


    return (
        Boolean(
            user
        ) &&
        normalizeRole(
            user.role
        ) ===
        normalizeRole(
            role
        )
    );
}


export function getDashboardPath(
    role
) {
    const normalizedRole =
        normalizeRole(
            role
        );


    if (
        normalizedRole ===
        "admin"
    ) {
        return "/admin";
    }


    if (
        normalizedRole ===
        "trainer"
    ) {
        return "/trainer";
    }


    if (
        normalizedRole ===
        "trainee"
    ) {
        return "/trainee";
    }


    return "/login";
}


export function sessionRequiresPasswordChange() {
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


    return (
        [
            "trainer",
            "trainee",
        ].includes(
            role
        ) &&
        user.mustChangePassword ===
        true
    );
}