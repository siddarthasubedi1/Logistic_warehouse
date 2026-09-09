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


    // ======================================================
    // AUTH SESSION
    // ======================================================

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
    // INVALID ROLE
    // ======================================================

    if (!user.role) {
        clearAuthSession();


        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ======================================================
    // DEACTIVATED ACCOUNT
    // ======================================================

    if (
        [
            "deactivated",
            "inactive",
        ].includes(
            String(
                user.status ||
                ""
            ).toLowerCase()
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
    // ======================================================
    //
    // Only Trainer and Trainee use the temporary-password
    // first-login policy.
    //
    // Admin is never blocked by this condition.
    // ======================================================

    const requiresPasswordChange =
        [
            "trainer",
            "trainee",
        ].includes(
            user.role
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
                }}
            />
        );
    }


    // ======================================================
    // ROLE ACCESS
    // ======================================================

    if (
        allowedRoles.length >
        0 &&
        !allowedRoles.includes(
            user.role
        )
    ) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }


    // ======================================================
    // ACCESS GRANTED
    // ======================================================

    return children;
}


export default ProtectedRoute;