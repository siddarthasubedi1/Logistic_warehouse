import {
    useState,
} from "react";

import LoginBranding from "../components/auth/LoginBranding";
import LoginForm from "../components/auth/LoginForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import ForcePasswordChangeModal from "../components/auth/ForcePasswordChangeModal";

import {
    getSessionUser,
} from "../utils/session";


// ======================================================
// FORCED PASSWORD USER
// ======================================================

function getStoredForcedPasswordUser() {
    const user =
        getSessionUser();


    if (!user) {
        return null;
    }


    const role =
        String(
            user.role ||
            ""
        ).toLowerCase();


    const requiresChange =
        [
            "trainer",
            "trainee",
        ].includes(
            role
        ) &&
        user.mustChangePassword ===
        true;


    return requiresChange
        ? user
        : null;
}


// ======================================================
// LOGIN
// ======================================================

function Login() {
    const [
        showForgotPassword,
        setShowForgotPassword,
    ] = useState(false);


    const [
        forcedPasswordUser,
        setForcedPasswordUser,
    ] = useState(
        getStoredForcedPasswordUser
    );


    // ======================================================
    // FORGOT PASSWORD
    // ======================================================

    const handleForgotPassword =
        () => {
            setShowForgotPassword(
                true
            );
        };


    const handleBackToLogin =
        () => {
            setShowForgotPassword(
                false
            );
        };


    // ======================================================
    // REQUIRED PASSWORD CHANGE
    // ======================================================

    const handlePasswordChangeRequired =
        (
            user
        ) => {
            setShowForgotPassword(
                false
            );


            setForcedPasswordUser(
                user
            );
        };


    // ======================================================
    // PASSWORD CHANGED
    // ======================================================

    const handlePasswordChangeCompleted =
        () => {
            setForcedPasswordUser(
                null
            );


            setShowForgotPassword(
                false
            );
        };


    // ======================================================
    // UI
    // ======================================================

    return (
        <main
            className="
                min-h-screen
                bg-[#f3f6fa]
                p-0
                sm:p-4
                lg:p-5
            "
        >
            <div
                className="
                    mx-auto
                    grid
                    min-h-screen
                    w-full
                    max-w-[1400px]
                    overflow-hidden
                    bg-white
                    sm:min-h-[calc(100vh-32px)]
                    sm:rounded-2xl
                    sm:border
                    sm:border-slate-200
                    sm:shadow-xl
                    lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]
                "
            >
                {/* BRANDING */}

                <LoginBranding />


                {/* FORM SIDE */}

                <section
                    className="
                        flex
                        min-h-screen
                        items-center
                        justify-center
                        px-5
                        py-8
                        sm:min-h-0
                        sm:px-8
                        lg:px-12
                        xl:px-16
                    "
                >
                    {showForgotPassword ? (
                        <ForgotPasswordForm
                            onBackToLogin={
                                handleBackToLogin
                            }
                        />
                    ) : (
                        <LoginForm
                            onForgotPassword={
                                handleForgotPassword
                            }
                            onPasswordChangeRequired={
                                handlePasswordChangeRequired
                            }
                        />
                    )}
                </section>
            </div>


            {/* FIRST LOGIN PASSWORD CHANGE */}

            {forcedPasswordUser && (
                <ForcePasswordChangeModal
                    user={
                        forcedPasswordUser
                    }
                    onCompleted={
                        handlePasswordChangeCompleted
                    }
                />
            )}
        </main>
    );
}


export default Login;