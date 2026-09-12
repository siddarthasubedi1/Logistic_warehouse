import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import api from "../../services/api";

import PasswordInput from "./PasswordInput";
import FeedbackAlert from "../ui/FeedbackAlert";

import {
    clearAuthSession,
} from "../../utils/session";


function getDashboardPath(
    role
) {
    if (
        role === "admin"
    ) {
        return "/admin";
    }


    if (
        role === "trainer"
    ) {
        return "/trainer";
    }


    if (
        role === "trainee"
    ) {
        return "/trainee";
    }


    return null;
}


function LoginForm({
    onForgotPassword,
    onPasswordChangeRequired,
}) {
    const navigate =
        useNavigate();


    const [
        username,
        setUsername,
    ] = useState("");


    const [
        password,
        setPassword,
    ] = useState("");


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    // ======================================================
    // LOGIN
    // ======================================================

    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();


            const cleanUsername =
                username.trim();


            if (
                !cleanUsername ||
                !password
            ) {
                setError(
                    "Please enter your username and password."
                );

                return;
            }


            try {
                setLoading(true);
                setError("");


                clearAuthSession();


                const response =
                    await api.post(
                        "/auth/login",
                        {
                            username:
                                cleanUsername,

                            password,
                        }
                    );


                const {
                    accessToken,
                    user,
                } =
                    response.data;


                if (
                    !accessToken ||
                    !user
                ) {
                    setError(
                        "Login response is incomplete. Please try again."
                    );

                    return;
                }


                if (
                    !user.role
                ) {
                    setError(
                        "Your account does not have a valid role."
                    );

                    return;
                }


                sessionStorage.setItem(
                    "accessToken",
                    accessToken
                );


                sessionStorage.setItem(
                    "user",
                    JSON.stringify(
                        user
                    )
                );


                // ==================================================
                // FORCE FIRST LOGIN CHANGE
                // TRAINER + TRAINEE ONLY
                // ==================================================

                const requiresPasswordChange =
                    [
                        "trainer",
                        "trainee",
                    ].includes(
                        user.role
                    ) &&
                    user.mustChangePassword ===
                    true;


                if (
                    requiresPasswordChange
                ) {
                    if (
                        typeof onPasswordChangeRequired ===
                        "function"
                    ) {
                        onPasswordChangeRequired(
                            user
                        );
                    }


                    return;
                }


                const dashboardPath =
                    getDashboardPath(
                        user.role
                    );


                if (
                    !dashboardPath
                ) {
                    clearAuthSession();


                    setError(
                        "Your account role is not authorised."
                    );

                    return;
                }


                navigate(
                    dashboardPath,
                    {
                        replace:
                            true,
                    }
                );

            } catch (error) {
                console.error(
                    "Login error:",
                    error
                );


                clearAuthSession();


                if (
                    error.response
                        ?.status ===
                    403 &&
                    error.response
                        ?.data
                        ?.code ===
                    "ACCOUNT_DEACTIVATED"
                ) {
                    setError(
                        "Your account has been deactivated. Please contact the administrator."
                    );

                    return;
                }


                if (
                    error.response
                        ?.status ===
                    401
                ) {
                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Invalid username or password."
                    );

                    return;
                }


                if (
                    error.response
                        ?.status ===
                    429
                ) {
                    setError(
                        "Too many login attempts. Please wait and try again."
                    );

                    return;
                }


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to login. Please try again."
                );

            } finally {
                setLoading(false);
            }
        };


    // ======================================================
    // UI
    // ======================================================

    return (
        <div
            className="
                w-full
                max-w-md
            "
        >
            <div
                className="
                    lg:hidden
                "
            >
                <p
                    className="
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-wide
                        text-blue-600
                    "
                >
                    UK LogiWare
                </p>
            </div>


            <h1
                className="
                    mt-2
                    text-[24px]
                    font-semibold
                    text-slate-800
                    sm:text-[28px]
                "
            >
                Welcome back
            </h1>


            <p
                className="
                    mt-2
                    text-[10px]
                    leading-5
                    text-slate-500
                "
            >
                Sign in to access your workplace safety training account.
            </p>


            <form
                onSubmit={
                    handleSubmit
                }
                className="
                    mt-7
                    space-y-4
                "
            >
                <FeedbackAlert
                    type="error"
                    message={error}
                    onClose={() =>
                        setError("")
                    }
                />


                {/* USERNAME */}

                <label
                    className="
                        block
                    "
                >
                    <span
                        className="
                            mb-2
                            block
                            text-[9px]
                            font-medium
                            text-slate-600
                        "
                    >
                        Username
                    </span>


                    <div
                        className="
                            relative
                        "
                    >
                        <span
                            className="
                                pointer-events-none
                                absolute
                                inset-y-0
                                left-0
                                flex
                                items-center
                                pl-3
                                text-slate-400
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-4 w-4"
                            >
                                <circle
                                    cx="12"
                                    cy="8"
                                    r="3"
                                />

                                <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                            </svg>
                        </span>


                        <input
                            type="text"
                            value={username}
                            onChange={(
                                event
                            ) => {
                                setUsername(
                                    event.target.value
                                );

                                if (error) {
                                    setError("");
                                }
                            }}
                            disabled={
                                loading
                            }
                            autoComplete="username"
                            placeholder="Enter username"
                            className="
                                h-11
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                pl-9
                                pr-3
                                text-[10px]
                                text-slate-700
                                outline-none
                                placeholder:text-slate-400
                                focus:border-blue-500
                                disabled:bg-slate-50
                            "
                        />
                    </div>
                </label>


                {/* PASSWORD */}

                <label
                    className="
                        block
                    "
                >
                    <span
                        className="
                            mb-2
                            block
                            text-[9px]
                            font-medium
                            text-slate-600
                        "
                    >
                        Password
                    </span>


                    <PasswordInput
                        id="login-password"
                        value={password}
                        onChange={(
                            event
                        ) => {
                            setPassword(
                                event.target.value
                            );

                            if (error) {
                                setError("");
                            }
                        }}
                        disabled={
                            loading
                        }
                    />
                </label>


                {/* FORGOT */}

                <div
                    className="
                        flex
                        justify-end
                    "
                >
                    {onForgotPassword && (
                        <button
                            type="button"
                            onClick={
                                onForgotPassword
                            }
                            disabled={
                                loading
                            }
                            className="
                                text-[9px]
                                font-medium
                                text-blue-600
                                hover:text-blue-700
                                disabled:opacity-50
                            "
                        >
                            Forgot password?
                        </button>
                    )}
                </div>


                {/* LOGIN */}

                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className="
                        flex
                        h-11
                        w-full
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-600
                        px-4
                        text-[10px]
                        font-medium
                        text-white
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {loading
                        ? "Signing in..."
                        : "Sign In"}
                </button>
            </form>


            <div
                className="
                    mt-7
                    border-t
                    border-slate-100
                    pt-4
                "
            >
                <p
                    className="
                        text-center
                        text-[8px]
                        leading-4
                        text-slate-400
                    "
                >
                    Use the username and password provided by your Administrator.
                </p>
            </div>
        </div>
    );
}


export default LoginForm;