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


    const accessToken =
        sessionStorage.getItem(
            "accessToken"
        );


    const storedUser =
        sessionStorage.getItem(
            "user"
        );


    let user = null;


    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch {
        user = null;
    }


    /*
        ========================================
        1. USER NOT LOGGED IN
        ========================================

        No token or no saved user means the
        protected page cannot be accessed.
    */

    if (!accessToken || !user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }


    /*
        ========================================
        2. INVALID USER ROLE
        ========================================

        If the user's role is missing, we do
        not allow access to a protected route.
    */

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


    /*
        ========================================
        3. ROLE-BASED ACCESS CONTROL
        ========================================

        Example:

        allowedRoles={["admin"]}

        means only an Admin can access the
        protected page.
    */

    if (
        allowedRoles.length > 0 &&
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


    /*
        ========================================
        4. ACCOUNT STATUS CHECK
        ========================================

        The backend already performs the real
        security check on protected API calls.

        This frontend check improves the user
        experience if the status is available
        in sessionStorage.
    */

    if (
        user.status &&
        user.status === "deactivated"
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


    /*
        ========================================
        ACCESS GRANTED
        ========================================
    */

    return children;
}


export default ProtectedRoute;