import {
    Navigate,
    useLocation,
} from "react-router-dom";

import {
    clearAuthSession,
    getAccessToken,
    getSessionUser,
} from "../utils/session";


function ProtectedRoute({
    children,
    allowedRoles = [],
}) {
    const location =
        useLocation();


    const accessToken =
        getAccessToken();


    const user =
        getSessionUser();


    // ======================================================
    // NOT LOGGED IN
    // ======================================================

    if (
        !accessToken ||
        !user
    ) {
        clearAuthSession();

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from:
                        location.pathname,
                }}
            />
        );
    }


    // ======================================================
    // NORMALISE ROLE
    // ======================================================

    const role =
        String(
            user.role ||
            ""
        )
            .trim()
            .toLowerCase();


    if (
        ![
            "admin",
            "trainer",
            "trainee",
        ].includes(
            role
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
            "disabled",
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
    // FORCED PASSWORD CHANGE
    // TRAINER + TRAINEE ONLY
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
        requiresPasswordChange &&
        location.pathname !==
        "/login"
    ) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    passwordChangeRequired:
                        true,
                }}
            />
        );
    }


    // ======================================================
    // ROLE VALIDATION
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
                            allowedRole ||
                            ""
                        )
                            .trim()
                            .toLowerCase()
                )
                .filter(
                    Boolean
                )
            : [];


    // ======================================================
    // WRONG ROLE
    //
    // IMPORTANT:
    // Do NOT send to /unauthorized.
    // User requested redirect directly to login.
    // ======================================================

    if (
        normalizedAllowedRoles.length >
        0 &&
        !normalizedAllowedRoles.includes(
            role
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


    return children;
}


export default ProtectedRoute;