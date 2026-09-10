// ======================================================
// STORAGE KEYS
// ======================================================

const ACCESS_TOKEN_KEY =
    "accessToken";


const USER_KEY =
    "user";


// ======================================================
// CHECK BROWSER STORAGE
// ======================================================

const canUseSessionStorage = () => {
    return (
        typeof window !==
        "undefined" &&
        typeof window.sessionStorage !==
        "undefined"
    );
};


// ======================================================
// GET SESSION USER
// ======================================================

export const getSessionUser = () => {
    if (
        !canUseSessionStorage()
    ) {
        return null;
    }


    try {
        const storedUser =
            sessionStorage.getItem(
                USER_KEY
            );


        if (!storedUser) {
            return null;
        }


        const user =
            JSON.parse(
                storedUser
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

    } catch (error) {
        console.error(
            "Unable to read session user:",
            error
        );


        return null;
    }
};


// ======================================================
// SAVE SESSION USER
// ======================================================

export const saveSessionUser = (
    user
) => {
    if (
        !canUseSessionStorage()
    ) {
        return;
    }


    if (
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
        sessionStorage.setItem(
            USER_KEY,
            JSON.stringify(
                user
            )
        );

    } catch (error) {
        console.error(
            "Unable to save session user:",
            error
        );
    }
};


// ======================================================
// UPDATE SESSION USER
// ======================================================

export const updateSessionUser = (
    updates
) => {
    if (
        !updates ||
        typeof updates !==
        "object"
    ) {
        return null;
    }


    const currentUser =
        getSessionUser();


    if (!currentUser) {
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
};


// ======================================================
// GET ACCESS TOKEN
// ======================================================

export const getAccessToken = () => {
    if (
        !canUseSessionStorage()
    ) {
        return "";
    }


    return (
        sessionStorage.getItem(
            ACCESS_TOKEN_KEY
        ) ||
        ""
    );
};


// ======================================================
// SAVE ACCESS TOKEN
// ======================================================

export const saveAccessToken = (
    accessToken
) => {
    if (
        !canUseSessionStorage()
    ) {
        return;
    }


    if (
        !accessToken ||
        typeof accessToken !==
        "string"
    ) {
        return;
    }


    sessionStorage.setItem(
        ACCESS_TOKEN_KEY,
        accessToken
    );
};


// ======================================================
// SAVE AUTH SESSION
// ======================================================

export const saveAuthSession = ({
    accessToken,
    user,
}) => {
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
};


// ======================================================
// CLEAR AUTH SESSION
// ======================================================

export const clearAuthSession = () => {
    if (
        !canUseSessionStorage()
    ) {
        return;
    }


    sessionStorage.removeItem(
        ACCESS_TOKEN_KEY
    );


    sessionStorage.removeItem(
        USER_KEY
    );
};


// ======================================================
// AUTHENTICATED
// ======================================================

export const hasAuthSession = () => {
    return Boolean(
        getAccessToken() &&
        getSessionUser()
    );
};


// ======================================================
// CHECK USER ROLE
// ======================================================

export const isUserRole = (
    role
) => {
    const user =
        getSessionUser();


    if (
        !user?.role ||
        !role
    ) {
        return false;
    }


    return (
        String(
            user.role
        )
            .trim()
            .toLowerCase() ===
        String(
            role
        )
            .trim()
            .toLowerCase()
    );
};


// ======================================================
// TEMPORARY PASSWORD RULE
// ======================================================

export const sessionRequiresPasswordChange =
    () => {
        const user =
            getSessionUser();


        if (!user) {
            return false;
        }


        return (
            [
                "trainer",
                "trainee",
            ].includes(
                String(
                    user.role ||
                    ""
                )
                    .trim()
                    .toLowerCase()
            ) &&
            user.mustChangePassword ===
            true
        );
    };