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


// ======================================================
// LOGIN PAGE
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
    // FIRST LOGIN PASSWORD CHANGE
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
    // PASSWORD CHANGE COMPLETED
    // ======================================================

    const handlePasswordChangeCompleted =
        () => {
            /*
                ForcePasswordChangeModal already clears
                the temporary authenticated session.

                After that we simply return the user to
                the normal login form.
            */

            setForcedPasswordUser(
                null
            );


            setShowForgotPassword(
                false
            );
        };


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <main
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-slate-100
                p-0
                sm:p-4
                lg:p-5
            "
        >

            {/* ================================================= */}
            {/* BACKGROUND */}
            {/* ================================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-32
                    -top-32
                    h-80
                    w-80
                    rounded-full
                    bg-blue-100/70
                    blur-3xl
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-32
                    -right-32
                    h-80
                    w-80
                    rounded-full
                    bg-emerald-100/60
                    blur-3xl
                "
            />


            {/* ================================================= */}
            {/* LOGIN CONTAINER */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    grid
                    min-h-screen
                    w-full
                    max-w-[1450px]
                    overflow-hidden
                    bg-white
                    shadow-2xl
                    shadow-slate-300/40
                    sm:min-h-[calc(100vh-32px)]
                    sm:rounded-3xl
                    lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
                "
            >

                {/* ================================================= */}
                {/* LEFT BRANDING */}
                {/* ================================================= */}

                <LoginBranding />


                {/* ================================================= */}
                {/* RIGHT FORM AREA */}
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
            {/* REQUIRED FIRST-LOGIN PASSWORD CHANGE */}
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

        </main>
    );
}


export default Login;