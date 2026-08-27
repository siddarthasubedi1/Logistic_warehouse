import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
    const token =
        sessionStorage.getItem("accessToken");

    const storedUser =
        sessionStorage.getItem("user");

    // Not logged in
    if (!token || !storedUser) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    let user;

    try {
        user = JSON.parse(storedUser);
    } catch (error) {
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

    // Role not allowed
    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;