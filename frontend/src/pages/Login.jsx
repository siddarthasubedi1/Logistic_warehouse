import {
    useState,
} from "react";

import LoginBranding from "../components/auth/LoginBranding";

import LoginForm from "../components/auth/LoginForm";

import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

import ForcePasswordChangeModal from "../components/auth/ForcePasswordChangeModal";


const getStoredForcedPasswordUser =
    () => {
        try {
            const storedUser =
                sessionStorage.getItem(
                    "user"
                );


            if (
                !storedUser
            ) {
                return null;
            }


            const user =
                JSON.parse(
                    storedUser
                );


            return (
                user
                    ?.mustChangePassword ===
                    true
                    ? user
                    : null
            );

        } catch {
            return null;
        }
    };


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
    // FIRST LOGIN PASSWORD CHANGE
    // ======================================================

    const handlePasswordChangeRequired =
        (user) => {
            setShowForgotPassword(
                false
            );


            setForcedPasswordUser(
                user
            );
        };


    const handlePasswordChangeCompleted =
        () => {
            setForcedPasswordUser(
                null
            );


            setShowForgotPassword(
                false
            );
        };


    return (
        <div className="min-h-screen bg-[#f5f5f5] p-3 sm:p-5">

            <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1450px] overflow-hidden bg-white lg:grid-cols-[1fr_1fr]">

                <LoginBranding />


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

            </div>


            {/* MANDATORY POPUP */}

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

        </div>
    );
}


export default Login;