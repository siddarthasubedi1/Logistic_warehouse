import {
    Navigate,
    useLocation,
} from "react-router-dom";

import {
    clearAuthSession,
    getAccessToken,
    getSessionUser,
} from "../utils/session";


// ======================================================
// PROTECTED ROUTE
// ======================================================

function ProtectedRoute({
    children,
    allowedRoles = [],
}) {
    const location =
        useLocation();


    // ======================================================
    // SESSION
    // ======================================================

    const accessToken =
        getAccessToken();


    const user =
        getSessionUser();


    // ======================================================
    // NOT AUTHENTICATED
    // ======================================================

    if (
        !accessToken ||
        !user
    ) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from:
                        location,
                }}
            />
        );
    }


    // ======================================================
    // ROLE
    // ======================================================

    const role =
        String(
            user.role ||
            ""
        )
            .trim()
            .toLowerCase();


    if (!role) {
        clearAuthSession();


        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ======================================================
    // ACCOUNT STATUS
    // ======================================================

    const status =
        String(
            user.status ||
            ""
        )
            .trim()
            .toLowerCase();


    if (
        [
            "deactivated",
            "inactive",
        ].includes(
            status
        )
    ) {
        clearAuthSession();


        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ======================================================
    // FIRST LOGIN PASSWORD CHANGE
    // ======================================================
    //
    // TRAINER AND TRAINEE ONLY.
    // ADMIN MUST NOT BE FORCED THROUGH THIS FLOW.
    //
    // ======================================================

    const requiresPasswordChange =
        [
            "trainer",
            "trainee",
        ].includes(
            role
        ) &&
        user.mustChangePassword ===
        true;


    if (
        requiresPasswordChange
    ) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    passwordChangeRequired:
                        true,

                    from:
                        location,
                }}
            />
        );
    }


    // ======================================================
    // ALLOWED ROLES
    // ======================================================

    const normalizedAllowedRoles =
        Array.isArray(
            allowedRoles
        )
            ? allowedRoles
                .map(
                    (
                        allowedRole
                    ) =>
                        String(
                            allowedRole
                        )
                            .trim()
                            .toLowerCase()
                )
                .filter(Boolean)
            : [];


    // ======================================================
    // ROLE ACCESS
    // ======================================================

    if (
        normalizedAllowedRoles.length >
        0 &&
        !normalizedAllowedRoles.includes(
            role
        )
    ) {
        return (
            <Navigate
                to="/unauthorized"
                replace
                state={{
                    from:
                        location,
                }}
            />
        );
    }


    // ======================================================
    // ACCESS GRANTED
    // ======================================================

    return children;
}


export default ProtectedRoute;