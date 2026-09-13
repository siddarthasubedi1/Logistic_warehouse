import {
    useState,
} from "react";

import api from "../../services/api";

import PasswordInput from "./PasswordInput";

import {
    clearAuthSession,
} from "../../utils/session";

function Requirement({
    passed,
    children,
}) {
    return (
        <li
            className={
                passed
                    ? "password-rule password-rule-ok"
                    : "password-rule"
            }
        >
            <span>
                {passed
                    ? "✓"
                    : "•"}
            </span>

            {children}
        </li>
    );
}

function ForcePasswordChangeModal({
    user,
    onCompleted,
}) {
    const [
        currentPassword,
        setCurrentPassword,
    ] = useState("");

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
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
        completed,
        setCompleted,
    ] = useState(false);

    const lengthValid =
        newPassword.length >=
        12;

    const different =
        Boolean(
            currentPassword &&
            newPassword &&
            currentPassword !==
            newPassword
        );

    const matches =
        Boolean(
            newPassword &&
            newPassword ===
            confirmPassword
        );

    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            setError("");

            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            ) {
                setError(
                    "Please complete all password fields."
                );

                return;
            }

            if (
                !lengthValid
            ) {
                setError(
                    "New password must contain at least 12 characters."
                );

                return;
            }

            if (
                !different
            ) {
                setError(
                    "The new password must be different from the temporary password."
                );

                return;
            }

            if (
                !matches
            ) {
                setError(
                    "New password and confirmation do not match."
                );

                return;
            }

            try {
                setLoading(
                    true
                );

                await api.post(
                    "/auth/change-password",
                    {
                        currentPassword,
                        newPassword,
                    }
                );

                clearAuthSession();

                setCompleted(
                    true
                );
            } catch (
            requestError
            ) {
                setError(
                    requestError.response
                        ?.data
                        ?.message ||
                    "Unable to change password."
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    return (
        <div
            className="password-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-change-title"
        >
            <div className="password-modal-card">
                {completed ? (
                    <div className="password-modal-success">
                        <div className="password-success-icon">
                            ✓
                        </div>

                        <h2 id="password-change-title">
                            Password Changed Successfully
                        </h2>

                        <p>
                            Your temporary password is no longer
                            valid. Sign in again using your new
                            password.
                        </p>

                        <button
                            type="button"
                            className="auth-primary-button"
                            onClick={
                                onCompleted
                            }
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="password-modal-header">
                            <div className="auth-lock-badge">
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

                            <div>
                                <span className="auth-kicker">
                                    PASSWORD CHANGE REQUIRED
                                </span>

                                <h2 id="password-change-title">
                                    Secure your account
                                </h2>

                                <p>
                                    {user?.username
                                        ? `${user.username}, `
                                        : ""}

                                    your temporary password can only
                                    be used once.
                                </p>
                            </div>
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
                            className="auth-form"
                            onSubmit={
                                handleSubmit
                            }
                        >
                            <div className="auth-field">
                                <label htmlFor="current-password">
                                    Current Password
                                </label>

                                <PasswordInput
                                    id="current-password"
                                    value={
                                        currentPassword
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setCurrentPassword(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Enter temporary password"
                                    disabled={
                                        loading
                                    }
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="new-password">
                                    New Password
                                </label>

                                <PasswordInput
                                    id="new-password"
                                    value={
                                        newPassword
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNewPassword(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Create new password"
                                    autoComplete="new-password"
                                    disabled={
                                        loading
                                    }
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="confirm-password">
                                    Confirm New Password
                                </label>

                                <PasswordInput
                                    id="confirm-password"
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setConfirmPassword(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                    disabled={
                                        loading
                                    }
                                />
                            </div>

                            <div className="password-rules-panel">
                                <strong>
                                    PASSWORD REQUIREMENTS
                                </strong>

                                <ul>
                                    <Requirement
                                        passed={
                                            lengthValid
                                        }
                                    >
                                        At least 12 characters
                                    </Requirement>

                                    <Requirement
                                        passed={
                                            different
                                        }
                                    >
                                        Different from temporary password
                                    </Requirement>

                                    <Requirement
                                        passed={
                                            matches
                                        }
                                    >
                                        New passwords match
                                    </Requirement>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                className="auth-primary-button"
                                disabled={
                                    loading
                                }
                            >
                                {loading
                                    ? "Changing Password..."
                                    : "Change Password"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForcePasswordChangeModal;