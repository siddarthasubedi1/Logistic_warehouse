import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import api from "../../services/api";

import {
    getDashboardPath,
    saveAuthSession,
} from "../../utils/session";


function LoginForm({
    onForgotPassword,
    onForcePasswordChange,
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
        showPassword,
        setShowPassword,
    ] = useState(false);


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            setError("");


            if (
                !username.trim() ||
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


                const response =
                    await api.post(
                        "/auth/login",
                        {
                            username:
                                username
                                    .trim()
                                    .toLowerCase(),

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
                    console.error(
                        "Unexpected login response:",
                        response.data
                    );

                    setError(
                        "Unable to complete login."
                    );

                    return;
                }


                saveAuthSession({
                    accessToken,
                    user,
                });


                const role =
                    String(
                        user.role ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                /*
                 * Trainer/Trainee first login:
                 * stay on login page and show
                 * password-change modal.
                 */
                if (
                    (
                        role === "trainer" ||
                        role === "trainee"
                    ) &&
                    user.mustChangePassword === true
                ) {
                    onForcePasswordChange?.({
                        user,
                        currentPassword:
                            password,
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
                        replace: true,
                    }
                );

            } catch (error) {
                console.error(
                    "Login error:",
                    error
                );


                if (
                    !error.response
                ) {
                    setError(
                        "Cannot connect to the server. Make sure the backend is running."
                    );

                    return;
                }


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Invalid username or password."
                );

            } finally {
                setLoading(
                    false
                );
            }
        };


    return (
        <div className="figma-login-form">

            <div className="figma-login-heading">

                <h1>
                    Welcome Back
                </h1>

                <p>
                    Sign in to continue to UK LogiWare Safety Training.
                </p>

            </div>


            {error && (
                <div className="figma-login-error">

                    <span>
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
            >

                <div className="figma-login-field">

                    <label htmlFor="login-username">
                        Username
                    </label>


                    <div
                        className={
                            username.trim()
                                ? "figma-login-input figma-login-input-valid"
                                : "figma-login-input"
                        }
                    >

                        <span className="figma-login-input-icon">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
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
                            id="login-username"
                            type="text"
                            value={
                                username
                            }
                            onChange={(
                                event
                            ) =>
                                setUsername(
                                    event
                                        .target
                                        .value
                                )
                            }
                            autoComplete="username"
                        />


                        {username.trim() && (
                            <span className="figma-login-check">
                                ✓
                            </span>
                        )}

                    </div>

                </div>


                <div className="figma-login-field figma-password-field">

                    <label htmlFor="login-password">
                        Password
                    </label>


                    <div className="figma-login-input">

                        <span className="figma-login-input-icon">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    x="5"
                                    y="10"
                                    width="14"
                                    height="10"
                                    rx="2"
                                />

                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            </svg>

                        </span>


                        <input
                            id="login-password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={
                                password
                            }
                            onChange={(
                                event
                            ) =>
                                setPassword(
                                    event
                                        .target
                                        .value
                                )
                            }
                            autoComplete="current-password"
                        />


                        <button
                            type="button"
                            className="figma-login-eye"
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                            onClick={() =>
                                setShowPassword(
                                    (
                                        current
                                    ) =>
                                        !current
                                )
                            }
                        >

                            {showPassword ? (

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="2.5"
                                    />
                                </svg>

                            ) : (

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 3l18 18" />

                                    <path d="M10.6 6.2A9.6 9.6 0 0 1 12 6c6.5 0 10 6 10 6a16.9 16.9 0 0 1-3 3.7" />

                                    <path d="M6.2 6.2C3.5 8 2 12 2 12s3.5 6 10 6c1.5 0 2.8-.3 4-.8" />
                                </svg>

                            )}

                        </button>

                    </div>

                </div>


                <div className="figma-forgot-row">

                    <button
                        type="button"
                        onClick={
                            onForgotPassword
                        }
                    >
                        Forgot Password?
                    </button>

                </div>


                <button
                    type="submit"
                    className="figma-login-button"
                    disabled={
                        loading
                    }
                >
                    {loading
                        ? "Signing in..."
                        : "Login"}
                </button>

            </form>


            <div className="figma-login-divider" />


            <div className="figma-login-help">

                <p>
                    Having trouble signing in?
                </p>

                <span>
                    Contact your Administrator
                </span>

            </div>

        </div>
    );
}


export default LoginForm;