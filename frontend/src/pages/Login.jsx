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
// CHECK EXISTING FORCED-PASSWORD SESSION
// ======================================================

function getStoredForcedPasswordUser() {
    const user =
        getSessionUser();


    if (!user) {
        return null;
    }


    const requiresChange =
        [
            "trainer",
            "trainee",
        ].includes(
            user.role
        ) &&
        user.mustChangePassword ===
        true;


    return requiresChange
        ? user
        : null;
}


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
            /*
                ForcePasswordChangeModal clears the old
                authentication session.

                We return to the normal login form so the
                user can login again with the new password.
            */

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

                {/* ================================================= */}
                {/* LEFT BRANDING */}
                {/* ================================================= */}

                <LoginBranding />


                {/* ================================================= */}
                {/* RIGHT SIDE */}
                {/* ================================================= */}

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


            {/* ================================================= */}
            {/* REQUIRED FIRST LOGIN PASSWORD CHANGE */}
            {/* ================================================= */}

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