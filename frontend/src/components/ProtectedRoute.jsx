import {
    Navigate,
    useLocation,
} from "react-router-dom";

import {
    clearAuthSession,
    getAccessToken,
    getSessionUser,
    normalizeRole,
} from "../utils/session";

function ProtectedRoute({
    allowedRoles = [],
    children,
}) {
    const location =
        useLocation();

    const token =
        getAccessToken();

    const user =
        getSessionUser();

    if (
        !token ||
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

    const role =
        normalizeRole(
            user.role
        );

    const normalizedAllowedRoles =
        allowedRoles.map(
            normalizeRole
        );

    if (
        normalizedAllowedRoles.length >
        0 &&
        !normalizedAllowedRoles.includes(
            role
        )
    ) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        [
            "trainer",
            "trainee",
        ].includes(
            role
        ) &&
        user.mustChangePassword ===
        true
    ) {
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