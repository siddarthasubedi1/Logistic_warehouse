import {
    Navigate,
    useLocation,
} from "react-router-dom";


function ProtectedRoute({
    children,
    allowedRoles = [],
}) {
    const location =
        useLocation();


    // ======================================================
    // AUTH DATA
    // ======================================================

    const accessToken =
        sessionStorage.getItem(
            "accessToken"
        );


    const storedUser =
        sessionStorage.getItem(
            "user"
        );


    // ======================================================
    // PARSE USER
    // ======================================================

    const user = (() => {
        try {
            return storedUser
                ? JSON.parse(
                    storedUser
                )
                : null;

        } catch {
            return null;
        }
    })();


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
    // INVALID USER ROLE
    // ======================================================

    if (!user.role) {
        sessionStorage.removeItem(
            "accessToken"
        );


        sessionStorage.removeItem(
            "user"
        );


        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ======================================================
    // MANDATORY PASSWORD CHANGE
    //
    // IMPORTANT:
    //
    // ONLY TRAINER + TRAINEE.
    //
    // ADMIN DOES NOT ENTER THIS CONDITION.
    // ======================================================

    const requiresForcedPasswordChange =
        [
            "trainer",
            "trainee",
        ].includes(
            user.role
        ) &&
        user.mustChangePassword ===
        true;


    if (
        requiresForcedPasswordChange
    ) {
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
        user.status ===
        "deactivated"
    ) {
        sessionStorage.removeItem(
            "accessToken"
        );


        sessionStorage.removeItem(
            "user"
        );


        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ======================================================
    // ROLE BASED ACCESS
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