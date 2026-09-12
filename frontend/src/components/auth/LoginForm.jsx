import {
    useEffect,
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
    getDashboardPath,
    normalizeRole,
    saveAuthSession,
} from "../../utils/session";


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
        rememberMe,
        setRememberMe,
    ] = useState(true);


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    useEffect(() => {
        const rememberedUsername =
            localStorage.getItem(
                "rememberUsername"
            );


        if (
            rememberedUsername
        ) {
            setUsername(
                rememberedUsername
            );

            setRememberMe(
                true
            );
        }
    }, []);


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


                const accessToken =
                    response.data
                        ?.accessToken;


                const user =
                    response.data
                        ?.user;


                if (
                    !accessToken ||
                    !user
                ) {
                    throw new Error(
                        "Login response is incomplete."
                    );
                }


                const role =
                    normalizeRole(
                        user.role
                    );


                if (
                    ![
                        "admin",
                        "trainer",
                        "trainee",
                    ].includes(
                        role
                    )
                ) {
                    clearAuthSession();

                    setError(
                        "Your account does not have a valid role."
                    );

                    return;
                }


                saveAuthSession({
                    accessToken,

                    user: {
                        ...user,
                        role,
                    },
                });


                if (
                    rememberMe
                ) {
                    localStorage.setItem(
                        "rememberUsername",
                        cleanUsername
                    );
                } else {
                    localStorage.removeItem(
                        "rememberUsername"
                    );
                }


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
                    onPasswordChangeRequired?.({
                        ...user,
                        role,
                    });

                    return;
                }


                const dashboardPath =
                    getDashboardPath(
                        role
                    );


                navigate(
                    dashboardPath,
                    {
                        replace:
                            true,
                    }
                );

            } catch (
            error
            ) {
                console.error(
                    "Login error:",
                    error
                );


                clearAuthSession();


                const status =
                    error.response
                        ?.status;


                const code =
                    error.response
                        ?.data
                        ?.code;


                if (
                    status ===
                    403 &&
                    code ===
                    "ACCOUNT_DEACTIVATED"
                ) {
                    setError(
                        "Your account has been deactivated. Please contact the Administrator."
                    );

                    return;
                }


                if (
                    status ===
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
                    status ===
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
                    error.message ||
                    "Unable to login. Please try again."
                );

            } finally {
                setLoading(
                    false
                );
            }
        };


    return (
        <div
            className="
                w-full
            "
        >
            <div
                className="
                    mb-8
                "
            >
                <h1
                    className="
                        text-[30px]
                        font-bold
                        tracking-[-0.02em]
                        text-[#172033]
                    "
                >
                    Welcome Back
                </h1>


                <p
                    className="
                        mt-3
                        text-[12px]
                        text-[#64748b]
                    "
                >
                    Sign in to continue to UK LogiWare Safety Training.
                </p>
            </div>


            <form
                onSubmit={
                    handleSubmit
                }
            >
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


                <label
                    className="
                        mt-5
                        block
                    "
                >
                    <span
                        className="
                            mb-2
                            block
                            text-[10px]
                            font-semibold
                            text-[#172033]
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
                                pl-4
                                text-slate-400
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="
                                    h-4
                                    w-4
                                "
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
                            value={
                                username
                            }
                            disabled={
                                loading
                            }
                            autoComplete="username"
                            onChange={(
                                event
                            ) => {
                                setUsername(
                                    event.target.value
                                );

                                setError(
                                    ""
                                );
                            }}
                            className="
                                h-[50px]
                                w-full
                                rounded-lg
                                border
                                border-[#cbd5e1]
                                bg-[#edf4ff]
                                pl-11
                                pr-10
                                text-[13px]
                                text-[#172033]
                                outline-none
                                transition
                                focus:border-[#3b82f6]
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />


                        {username.trim() && (
                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-y-0
                                    right-0
                                    flex
                                    items-center
                                    pr-4
                                    font-bold
                                    text-emerald-500
                                "
                            >
                                ✓
                            </span>
                        )}
                    </div>
                </label>


                <label
                    className="
                        mt-5
                        block
                    "
                >
                    <span
                        className="
                            mb-2
                            block
                            text-[10px]
                            font-semibold
                            text-[#172033]
                        "
                    >
                        Password
                    </span>


                    <PasswordInput
                        id="password"
                        name="password"
                        value={
                            password
                        }
                        onChange={(
                            event
                        ) => {
                            setPassword(
                                event.target.value
                            );

                            setError(
                                ""
                            );
                        }}
                        disabled={
                            loading
                        }
                    />
                </label>


                <div
                    className="
                        mt-3
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <label
                        className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
                            text-[9px]
                            text-[#52627a]
                        "
                    >
                        <input
                            type="checkbox"
                            checked={
                                rememberMe
                            }
                            onChange={(
                                event
                            ) =>
                                setRememberMe(
                                    event.target.checked
                                )
                            }
                        />

                        Remember me
                    </label>


                    <button
                        type="button"
                        onClick={
                            onForgotPassword
                        }
                        className="
                            text-[10px]
                            font-medium
                            text-[#1769e8]
                            hover:underline
                        "
                    >
                        Forgot Password?
                    </button>
                </div>


                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className="
                        mt-6
                        flex
                        h-[50px]
                        w-full
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#1769e8]
                        text-[13px]
                        font-medium
                        text-white
                        transition
                        hover:bg-[#0b5ed7]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {loading
                        ? "Signing in..."
                        : "Login"}
                </button>


                <div
                    className="
                        mt-8
                        border-t
                        border-[#e2e8f0]
                        pt-6
                        text-center
                    "
                >
                    <p
                        className="
                            text-[9px]
                            text-[#94a3b8]
                        "
                    >
                        Having trouble signing in?
                    </p>


                    <p
                        className="
                            mt-1
                            text-[9px]
                            font-medium
                            text-[#1769e8]
                        "
                    >
                        Contact your Administrator
                    </p>
                </div>
            </form>
        </div>
    );
}


export default LoginForm;