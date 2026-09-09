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


// ======================================================
// DASHBOARD BY ROLE
// ======================================================

function getDashboardPath(
    role
) {
    if (
        role ===
        "admin"
    ) {
        return "/admin";
    }


    if (
        role ===
        "trainer"
    ) {
        return "/trainer";
    }


    if (
        role ===
        "trainee"
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
    // CLEAR ERROR
    // ======================================================

    const clearError = () => {
        if (error) {
            setError("");
        }
    };


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


                // Remove an old broken session before a new login.
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


                // ==================================================
                // VALIDATE LOGIN RESPONSE
                // ==================================================

                if (
                    !accessToken ||
                    !user
                ) {
                    setError(
                        "Login response is incomplete. Please try again."
                    );

                    return;
                }


                if (!user.role) {
                    setError(
                        "Your account does not have a valid role."
                    );

                    return;
                }


                // ==================================================
                // SAVE SESSION
                // ==================================================

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
                // FIRST LOGIN PASSWORD CHANGE
                // ==================================================
                //
                // Only Trainer and Trainee.
                //
                // Admin goes directly to Admin Dashboard.
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


                // ==================================================
                // NORMAL LOGIN
                // ==================================================

                const dashboardPath =
                    getDashboardPath(
                        user.role
                    );


                if (!dashboardPath) {
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


                // ==================================================
                // DEACTIVATED
                // ==================================================

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


                // ==================================================
                // INVALID LOGIN
                // ==================================================

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


                // ==================================================
                // RATE LIMIT
                // ==================================================

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


                // ==================================================
                // GENERAL ERROR
                // ==================================================

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


    return (
        <section className="flex min-h-[680px] items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-14">

            <div className="w-full max-w-[410px]">

                {/* ================================================= */}
                {/* MOBILE BRAND */}
                {/* ================================================= */}

                <div className="mb-10 lg:hidden">

                    <p className="text-xl font-bold text-[#073763]">
                        UK Logi
                        <span className="text-blue-600">
                            Ware
                        </span>
                    </p>


                    <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Warehousing & Logistics
                    </p>

                </div>


                {/* ================================================= */}
                {/* TITLE */}
                {/* ================================================= */}

                <div>

                    <h1 className="text-[27px] font-bold text-[#172033]">
                        Welcome Back
                    </h1>


                    <p className="mt-2 text-[12px] leading-5 text-slate-500">
                        Sign in to continue to UK LogiWare Safety Training.
                    </p>

                </div>


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                <div className="mt-6">

                    <FeedbackAlert
                        type="error"
                        message={
                            error
                        }
                    />

                </div>


                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="mt-7"
                >

                    {/* Username */}
                    <div>

                        <label
                            htmlFor="username"
                            className="text-[11px] font-semibold text-slate-700"
                        >
                            Username
                        </label>


                        <div className="relative mt-2">

                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">

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
                                        r="4"
                                    />

                                    <path d="M4 21c.7-5 3.4-7 8-7s7.3 2 8 7" />
                                </svg>

                            </div>


                            <input
                                id="username"
                                type="text"
                                value={
                                    username
                                }
                                onChange={(
                                    event
                                ) => {
                                    setUsername(
                                        event.target.value
                                    );

                                    clearError();
                                }}
                                autoComplete="username"
                                disabled={
                                    loading
                                }
                                placeholder="Enter your username"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-300
                                    py-3
                                    pl-11
                                    pr-4
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                    disabled:bg-slate-100
                                "
                            />

                        </div>

                    </div>


                    {/* Password */}
                    <div className="mt-5">

                        <div className="flex items-center justify-between">

                            <label
                                htmlFor="password"
                                className="text-[11px] font-semibold text-slate-700"
                            >

                            </label>


                            {onForgotPassword && (
                                <button
                                    type="button"
                                    onClick={
                                        onForgotPassword
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="text-[10px] font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Forgot password?
                                </button>
                            )}

                        </div>


                        <PasswordInput
                            id="password"
                            value={
                                password
                            }
                            onChange={(
                                event
                            ) => {
                                setPassword(
                                    event.target.value
                                );

                                clearError();
                            }}
                            disabled={
                                loading
                            }
                            autoComplete="current-password"
                            placeholder="Enter your password"
                        />

                    </div>


                    {/* Login button */}
                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="
                            mt-7
                            w-full
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "Signing In..."
                            : "Sign In"}
                    </button>

                </form>


                {/* ================================================= */}
                {/* SECURITY MESSAGE */}
                {/* ================================================= */}

                <div className="mt-7 rounded-xl bg-slate-50 px-4 py-3">

                    <p className="text-center text-[10px] leading-5 text-slate-500">
                        Trainer and Trainee accounts using a temporary
                        administrator-generated password must change it
                        before accessing their dashboard.
                    </p>

                </div>

            </div>

        </section>
    );
}


export default LoginForm;