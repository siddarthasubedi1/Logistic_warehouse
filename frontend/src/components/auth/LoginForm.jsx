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

    const clearError =
        () => {
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
                setLoading(
                    true
                );

                setError(
                    ""
                );


                // Remove any previous invalid session before login.
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


                if (
                    !user.role
                ) {
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
                // Trainer and Trainee only.
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
                setLoading(
                    false
                );
            }
        };


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <section
            className="
                relative
                flex
                min-h-[620px]
                items-center
                justify-center
                overflow-hidden
                bg-white
                px-5
                py-10
                sm:px-8
                lg:min-h-[680px]
                lg:px-12
                xl:px-14
            "
        >

            {/* ================================================= */}
            {/* BACKGROUND DECORATION */}
            {/* ================================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-64
                    w-64
                    rounded-full
                    bg-blue-50
                    blur-2xl
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-28
                    -left-20
                    h-64
                    w-64
                    rounded-full
                    bg-emerald-50
                    blur-2xl
                "
            />


            <div
                className="
                    relative
                    z-10
                    w-full
                    max-w-[420px]
                "
            >

                {/* ================================================= */}
                {/* MOBILE BRAND */}
                {/* ================================================= */}

                <div
                    className="
                        mb-8
                        lg:hidden
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#073763]
                                text-white
                                shadow-sm
                            "
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                <path d="m9 12 2 2 4-4" />
                            </svg>

                        </div>


                        <div>

                            <p
                                className="
                                    text-lg
                                    font-bold
                                    text-[#073763]
                                "
                            >
                                UK Logi
                                <span className="text-blue-600">
                                    Ware
                                </span>
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-400
                                "
                            >
                                Workplace Safety Training
                            </p>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* LOGIN CARD */}
                {/* ================================================= */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-lg
                        shadow-slate-200/50
                        sm:p-7
                    "
                >

                    {/* ================================================= */}
                    {/* TITLE */}
                    {/* ================================================= */}

                    <div>

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-blue-50
                                px-3
                                py-1.5
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.12em]
                                text-blue-700
                            "
                        >

                            <span
                                className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-emerald-500
                                "
                            />

                            Secure Login

                        </span>


                        <h1
                            className="
                                mt-4
                                text-2xl
                                font-bold
                                text-[#172033]
                                sm:text-[27px]
                            "
                        >
                            Welcome Back
                        </h1>


                        <p
                            className="
                                mt-2
                                text-[11px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Sign in to continue to UK LogiWare Safety
                            Training.
                        </p>

                    </div>


                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

                    <div className="mt-5">

                        <FeedbackAlert
                            type="error"
                            message={
                                error
                            }
                            onClose={() =>
                                setError(
                                    ""
                                )
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
                        className="
                            mt-6
                            space-y-5
                        "
                    >

                        {/* ================================================= */}
                        {/* USERNAME */}
                        {/* ================================================= */}

                        <div>

                            <label
                                htmlFor="username"
                                className="
                                    mb-2
                                    block
                                    text-[10px]
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Username
                            </label>


                            <div className="relative">

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-y-0
                                        left-0
                                        flex
                                        items-center
                                        pl-4
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
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-white
                                        pl-11
                                        pr-4
                                        text-[11px]
                                        text-slate-800
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        disabled:cursor-not-allowed
                                        disabled:bg-slate-50
                                    "
                                />

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* PASSWORD */}
                        {/* ================================================= */}

                        <div>

                            <div
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >

                                <label
                                    htmlFor="password"
                                    className="
                                        text-[10px]
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Password
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
                                        className="
                                            text-[9px]
                                            font-semibold
                                            text-blue-600
                                            transition
                                            hover:text-blue-700
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
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
                                error={
                                    Boolean(
                                        error
                                    )
                                }
                                disabled={
                                    loading
                                }
                                autoComplete="current-password"
                                placeholder="Enter your password"
                            />

                        </div>


                        {/* ================================================= */}
                        {/* LOGIN BUTTON */}
                        {/* ================================================= */}

                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="
                                flex
                                min-h-[46px]
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-blue-600
                                px-5
                                py-3
                                text-[11px]
                                font-bold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-blue-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-300
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {loading ? (
                                <>
                                    <span
                                        className="
                                            h-4
                                            w-4
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-white/40
                                            border-t-white
                                        "
                                    />

                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-4 w-4"
                                    >
                                        <path d="M5 12h14" />

                                        <path d="m14 7 5 5-5 5" />
                                    </svg>
                                </>
                            )}

                        </button>

                    </form>


                    {/* ================================================= */}
                    {/* SECURITY NOTICE */}
                    {/* ================================================= */}

                    <div
                        className="
                            mt-6
                            flex
                            items-start
                            gap-2.5
                            rounded-xl
                            border
                            border-blue-100
                            bg-blue-50/60
                            p-3
                        "
                    >

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="
                                mt-0.5
                                h-4
                                w-4
                                shrink-0
                                text-blue-600
                            "
                        >
                            <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                            <path d="m9 12 2 2 4-4" />
                        </svg>


                        <p
                            className="
                                text-[9px]
                                leading-5
                                text-blue-700
                            "
                        >
                            Trainer and Trainee accounts using an
                            administrator-generated temporary password
                            must change it before accessing the
                            dashboard.
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
}


export default LoginForm;