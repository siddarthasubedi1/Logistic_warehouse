import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import api from "../../services/api";

import PasswordInput from "./PasswordInput";

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
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {
        const remembered =
            localStorage.getItem(
                "rememberUsername"
            );

        if (remembered) {
            setUsername(
                remembered
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

                const normalizedUser = {
                    ...user,
                    role,
                };

                saveAuthSession({
                    accessToken,

                    user:
                        normalizedUser,
                });

                localStorage.setItem(
                    "rememberUsername",
                    cleanUsername
                );

                const mustChangePassword =
                    [
                        "trainer",
                        "trainee",
                    ].includes(
                        role
                    ) &&
                    user.mustChangePassword ===
                    true;

                if (
                    mustChangePassword
                ) {
                    onPasswordChangeRequired?.(
                        normalizedUser
                    );

                    return;
                }

                navigate(
                    getDashboardPath(
                        role
                    ),
                    {
                        replace:
                            true,
                    }
                );
            } catch (
            requestError
            ) {
                clearAuthSession();

                setError(
                    requestError.response
                        ?.data
                        ?.message ||
                    "Login failed. Please check your username and password."
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    return (
        <div className="auth-form-card">
            <div className="auth-form-heading">
                <span className="auth-kicker">
                    SECURE LOGIN
                </span>

                <h1>
                    Welcome Back
                </h1>

                <p>
                    Sign in to continue to UK LogiWare Safety
                    Training.
                </p>
            </div>

            {error && (
                <div
                    className="auth-alert auth-alert-error"
                    role="alert"
                >
                    <span aria-hidden="true">
                        !
                    </span>

                    <p>
                        {error}
                    </p>
                </div>
            )}

            <form
                onSubmit={
                    handleSubmit
                }
                className="auth-form"
                noValidate
            >
                <div className="auth-field">
                    <label htmlFor="username">
                        Username
                    </label>

                    <div className="auth-input-shell">
                        <span
                            className="auth-input-icon"
                            aria-hidden="true"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <circle
                                    cx="12"
                                    cy="8"
                                    r="3.2"
                                />

                                <path d="M5.5 19c.8-4 3-6 6.5-6s5.7 2 6.5 6" />
                            </svg>
                        </span>

                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={
                                username
                            }
                            onChange={(
                                event
                            ) =>
                                setUsername(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Enter your username"
                            autoComplete="username"
                            className="auth-input auth-input-with-left-icon"
                            disabled={
                                loading
                            }
                        />

                        {username.trim() && (
                            <span
                                className="auth-valid-mark"
                                aria-hidden="true"
                            >
                                ✓
                            </span>
                        )}
                    </div>
                </div>

                <div className="auth-field">
                    <label htmlFor="password">
                        Password
                    </label>

                    <PasswordInput
                        id="password"
                        value={
                            password
                        }
                        onChange={(
                            event
                        ) =>
                            setPassword(
                                event.target
                                    .value
                            )
                        }
                        placeholder="Enter your password"
                        disabled={
                            loading
                        }
                    />
                </div>

                <div className="auth-forgot-row">
                    <button
                        type="button"
                        className="auth-text-link"
                        onClick={
                            onForgotPassword
                        }
                    >
                        Forgot Password?
                    </button>
                </div>

                <button
                    type="submit"
                    className="auth-primary-button"
                    disabled={
                        loading
                    }
                >
                    {loading
                        ? "Signing in..."
                        : "Login"}
                </button>
            </form>

            <div className="auth-help-block">
                <span>
                    Having trouble signing in?
                </span>

                <button
                    type="button"
                    className="auth-text-link auth-help-link"
                >
                    Contact your Administrator
                </button>
            </div>
        </div>
    );
}

export default LoginForm;