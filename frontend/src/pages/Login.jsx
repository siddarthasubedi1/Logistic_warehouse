import { useState } from "react";

import LoginBranding from "../components/auth/LoginBranding";
import LoginForm from "../components/auth/LoginForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";


function Login() {
    const [showForgotPassword, setShowForgotPassword] =
        useState(false);


    // ======================================================
    // SHOW FORGOT PASSWORD FORM
    // ======================================================

    const handleForgotPassword = () => {
        setShowForgotPassword(true);
    };


    // ======================================================
    // RETURN TO LOGIN FORM
    // ======================================================

    const handleBackToLogin = () => {
        setShowForgotPassword(false);
    };


    return (
        <div className="min-h-screen bg-[#f5f5f5] p-3 sm:p-5">

            <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1450px] overflow-hidden bg-white lg:grid-cols-[1fr_1fr]">

                {/* LEFT SIDE */}

                <LoginBranding />


                {/* RIGHT SIDE */}

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
                    />
                )}

            </div>

        </div>
    );
}


export default Login;