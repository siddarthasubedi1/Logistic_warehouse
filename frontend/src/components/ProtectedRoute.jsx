import {
    Navigate,
    useLocation,
} from "react-router-dom";

import {
    clearAuthSession,
    getAccessToken,
    getDashboardPath,
    getSessionUser,
    normalizeRole,
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


    /* =====================================================
       NOT LOGGED IN
    ===================================================== */

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


    /* =====================================================
       NORMALIZE ROLE
    ===================================================== */

    const role =
        normalizeRole(
            user.role
        );


    /* =====================================================
       INVALID ROLE
    ===================================================== */

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


    /* =====================================================
       FIRST LOGIN PASSWORD CHANGE

       Trainer/Trainee should NOT access protected
       dashboard pages until password has changed.

       Admin is excluded.
    ===================================================== */

    if (
        (
            role ===
            "trainer" ||
            role ===
            "trainee"
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


    /* =====================================================
       ROLE PERMISSION
    ===================================================== */

    const normalizedAllowedRoles =
        (
            Array.isArray(
                allowedRoles
            )
                ? allowedRoles
                : [
                    allowedRoles,
                ]
        )
            .map(
                (
                    allowedRole
                ) =>
                    normalizeRole(
                        allowedRole
                    )
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
                to={
                    getDashboardPath(
                        role
                    )
                }
                replace
            />
        );
    }


    /* =====================================================
       ACCESS ALLOWED
    ===================================================== */

    return children;
}


export default ProtectedRoute;