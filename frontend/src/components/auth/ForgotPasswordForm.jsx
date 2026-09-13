import {
    useState,
} from "react";

import api from "../../services/api";

function ForgotPasswordForm({
    onBackToLogin,
}) {
    const [
        username,
        setUsername,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");

    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            const cleanUsername =
                username.trim();

            setError("");

            setSuccess("");

            if (
                !cleanUsername
            ) {
                setError(
                    "Please enter your username."
                );

                return;
            }

            try {
                setLoading(
                    true
                );

                const response =
                    await api.post(
                        "/auth/forgot-password",
                        {
                            username:
                                cleanUsername,
                        }
                    );

                setSuccess(
                    response.data
                        ?.message ||
                    "If this username belongs to an active Trainer or Trainee account, a password reset request has been sent to the administrator."
                );
            } catch (
            requestError
            ) {
                setError(
                    requestError.response
                        ?.data
                        ?.message ||
                    "Unable to submit the password reset request."
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    return (
        <div className="auth-form-card auth-recovery-card">
            <div
                className="auth-lock-badge"
                aria-hidden="true"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <rect
                        x="5.5"
                        y="10"
                        width="13"
                        height="10"
                        rx="2"
                    />

                    <path d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3" />
                </svg>
            </div>

            <div className="auth-form-heading">
                <span className="auth-kicker">
                    ACCOUNT RECOVERY
                </span>

                <h1>
                    Forgot Password?
                </h1>

                <p>
                    Enter your username and we will send a
                    password reset request to the administrator.
                </p>
            </div>

            <div className="auth-info-panel">
                <span aria-hidden="true">
                    i
                </span>

                <p>
                    The administrator will generate a new
                    temporary password. Your username will
                    remain the same.
                </p>
            </div>

            {success && (
                <div
                    className="auth-alert auth-alert-success"
                    role="status"
                >
                    <span aria-hidden="true">
                        ✓
                    </span>

                    <p>
                        {success}
                    </p>
                </div>
            )}

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
                className="auth-form"
                onSubmit={
                    handleSubmit
                }
            >
                <div className="auth-field">
                    <label htmlFor="recovery-username">
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
                            id="recovery-username"
                            type="text"
                            className="auth-input auth-input-with-left-icon"
                            placeholder="Enter your username"
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
                            disabled={
                                loading
                            }
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="auth-primary-button"
                    disabled={
                        loading
                    }
                >
                    {loading
                        ? "Submitting..."
                        : "Request Password Reset"}
                </button>
            </form>

            <div className="auth-back-row">
                <button
                    type="button"
                    className="auth-text-link"
                    onClick={
                        onBackToLogin
                    }
                >
                    ← Back to Login
                </button>
            </div>
        </div>
    );
}

export default ForgotPasswordForm;