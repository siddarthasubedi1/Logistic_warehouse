// ======================================================
// SESSION UTILITIES
// ======================================================
//
// This file contains reusable helper functions related
// to the logged-in user stored inside sessionStorage.
//
// Instead of repeating JSON.parse(sessionStorage...)
// in multiple pages, we keep the logic in one place.
//
// ======================================================


// ======================================================
// GET SESSION USER
// ======================================================
//
// Returns the logged-in user object.
//
// If no user exists or invalid JSON is stored,
// this function safely returns null.
// ======================================================

export const getSessionUser = () => {

    try {

        const storedUser =
            sessionStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        return JSON.parse(storedUser);

    } catch (error) {

        console.error(
            "Unable to read session user:",
            error
        );

        return null;

    }

};


// ======================================================
// GET ACCESS TOKEN
// ======================================================
//
// Returns the access token stored during login.
// ======================================================

export const getAccessToken = () => {

    return (
        sessionStorage.getItem("accessToken") ||
        ""
    );

};


// ======================================================
// CLEAR AUTH SESSION
// ======================================================
//
// Removes authentication information.
//
// This can be reused during logout or when the session
// becomes invalid.
// ======================================================

export const clearAuthSession = () => {

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");

};


// ======================================================
// CHECK USER ROLE
// ======================================================
//
// Example:
//
// isUserRole("admin")
// isUserRole("trainer")
// isUserRole("trainee")
//
// ======================================================

export const isUserRole = (role) => {

    const user = getSessionUser();

    return user?.role === role;

};