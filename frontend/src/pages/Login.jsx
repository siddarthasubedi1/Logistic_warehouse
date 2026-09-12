import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

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


function getForcedPasswordUser() {
    const user =
        getSessionUser();


    if (
        !user
    ) {
        return null;
    }


    const role =
        normalizeRole(
            user.role
        );


    if (
        [
            "trainer",
            "trainee",
        ].includes(
            role
        ) &&
        user.mustChangePassword ===
        true
    ) {
        return user;
    }


    return null;
}


function Login() {
    const navigate =
        useNavigate();


    const [
        showForgotPassword,
        setShowForgotPassword,
    ] = useState(false);


    const [
        forcedPasswordUser,
        setForcedPasswordUser,
    ] = useState(
        getForcedPasswordUser
    );


    // ======================================================
    // ALREADY LOGGED IN
    // ======================================================

    useEffect(() => {
        const token =
            getAccessToken();


        const user =
            getSessionUser();


        if (
            !token ||
            !user
        ) {
            return;
        }


        const role =
            normalizeRole(
                user.role
            );


        const requiresPasswordChange =
            [
                "trainer",
                "trainee",
            ].includes(
                role
            ) &&
            user.mustChangePassword ===
            true;


        if (
            requiresPasswordChange
        ) {
            setForcedPasswordUser(
                user
            );

            return;
        }


        const dashboardPath =
            getDashboardPath(
                role
            );


        if (
            dashboardPath !==
            "/login"
        ) {
            navigate(
                dashboardPath,
                {
                    replace:
                        true,
                }
            );
        }

    }, [
        navigate,
    ]);


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


    const handlePasswordChangeCompleted =
        () => {
            setForcedPasswordUser(
                null
            );


            setShowForgotPassword(
                false
            );


            navigate(
                "/login",
                {
                    replace:
                        true,
                }
            );
        };


    return (
        <main
            className="
                min-h-screen
                bg-[#f5f7fb]
                px-3
                py-3
                sm:px-5
                lg:flex
                lg:items-center
                lg:justify-center
                lg:px-8
            "
        >
            <div
                className="
                    mx-auto
                    grid
                    w-full
                    max-w-[1500px]
                    overflow-hidden
                    bg-white
                    lg:min-h-[820px]
                    lg:grid-cols-2
                "
            >
                <LoginBranding />


                <section
                    className="
                        flex
                        min-h-[650px]
                        items-center
                        justify-center
                        bg-white
                        px-5
                        py-10
                        sm:px-10
                        lg:min-h-[820px]
                        lg:px-14
                    "
                >
                    <div
                        className="
                            w-full
                            max-w-[430px]
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
                    </div>
                </section>
            </div>


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