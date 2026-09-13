import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginBranding from "../components/auth/LoginBranding";
import LoginForm from "../components/auth/LoginForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import ForcePasswordChangeModal from "../components/auth/ForcePasswordChangeModal";

import {
    getAccessToken,
    getDashboardPath,
    getSessionUser,
    normalizeRole,
} from "../utils/session";

function getPasswordChangeUser() {
    const user = getSessionUser();

    if (!user) {
        return null;
    }

    const role = normalizeRole(user.role);

    const requiresPasswordChange =
        ["trainer", "trainee"].includes(role) &&
        user.mustChangePassword === true;

    if (!requiresPasswordChange) {
        return null;
    }

    return {
        ...user,
        role,
    };
}

function Login() {
    const navigate = useNavigate();

    const [showForgotPassword, setShowForgotPassword] =
        useState(false);

    const [forcedPasswordUser, setForcedPasswordUser] =
        useState(() => getPasswordChangeUser());

    useEffect(() => {
        const token = getAccessToken();
        const user = getSessionUser();

        if (!token || !user) {
            return;
        }

        const role = normalizeRole(user.role);

        const requiresPasswordChange =
            ["trainer", "trainee"].includes(role) &&
            user.mustChangePassword === true;

        if (requiresPasswordChange) {
            setForcedPasswordUser({
                ...user,
                role,
            });

            return;
        }

        const destination =
            getDashboardPath(role);

        if (destination !== "/login") {
            navigate(destination, {
                replace: true,
            });
        }
    }, [navigate]);

    const handlePasswordChangeRequired = (user) => {
        setShowForgotPassword(false);

        setForcedPasswordUser({
            ...user,
            role: normalizeRole(user?.role),
        });
    };

    const handlePasswordChangeCompleted = () => {
        setForcedPasswordUser(null);
        setShowForgotPassword(false);

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <main className="login-page">
            <div className="login-shell">
                <LoginBranding />

                <section
                    className="login-panel"
                    aria-label="Account login"
                >
                    <div className="login-panel-inner">
                        {showForgotPassword ? (
                            <ForgotPasswordForm
                                onBackToLogin={() =>
                                    setShowForgotPassword(false)
                                }
                            />
                        ) : (
                            <LoginForm
                                onForgotPassword={() =>
                                    setShowForgotPassword(true)
                                }
                                onPasswordChangeRequired={
                                    handlePasswordChangeRequired
                                }
                            />
                        )}
                    </div>
                </section>
            </div>

            {forcedPasswordUser && (
                <ForcePasswordChangeModal
                    user={forcedPasswordUser}
                    onCompleted={
                        handlePasswordChangeCompleted
                    }
                />
            )}
        </main>
    );
}

export default Login;