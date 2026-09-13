import {
    useState,
} from "react";

import api from "../../services/api";

import {
    clearForcedPasswordChange,
    getDashboardPath,
    updateSessionUser,
} from "../../utils/session";


function ForcePasswordChangeModal({
    user,
    currentPassword: initialCurrentPassword = "",
    onComplete,
}) {
    const [
        currentPassword,
        setCurrentPassword,
    ] = useState(
        initialCurrentPassword
    );


    const [
        newPassword,
        setNewPassword,
    ] = useState("");


    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");


    const [
        showCurrentPassword,
        setShowCurrentPassword,
    ] = useState(false);


    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);


    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const validate =
        () => {
            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            ) {
                return "Please complete all password fields.";
            }


            if (
                newPassword.length <
                12
            ) {
                return "New password must contain at least 12 characters.";
            }


            if (
                newPassword ===
                currentPassword
            ) {
                return "New password must be different from the current password.";
            }


            if (
                newPassword !==
                confirmPassword
            ) {
                return "New passwords do not match.";
            }


            return "";
        };


    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            setError("");


            const validationMessage =
                validate();


            if (
                validationMessage
            ) {
                setError(
                    validationMessage
                );

                return;
            }


            try {
                setLoading(
                    true
                );


                const response =
                    await api.post(
                        "/auth/change-password",
                        {
                            currentPassword,
                            newPassword,
                        }
                    );


                const updatedUser =
                    response.data
                        ?.user ||
                    {
                        ...user,
                        mustChangePassword:
                            false,
                    };


                updateSessionUser({
                    ...updatedUser,
                    mustChangePassword:
                        false,
                });


                clearForcedPasswordChange();


                const path =
                    getDashboardPath(
                        updatedUser.role ||
                        user?.role
                    );


                onComplete?.(
                    path
                );

            } catch (error) {
                console.error(
                    "Forced password change error:",
                    error
                );


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to change your password."
                );

            } finally {
                setLoading(
                    false
                );
            }
        };


    return (
        <div className="forced-password-overlay">

            <div className="forced-password-modal">

                <div className="forced-password-header">

                    <div className="forced-password-header-icon">

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

                    </div>


                    <div>

                        <p>
                            SECURITY
                        </p>

                        <h2>
                            Password Change Required
                        </h2>

                        <span>
                            Create a secure password before continuing.
                        </span>

                    </div>

                </div>


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="forced-password-body"
                >

                    {error && (
                        <div className="forced-password-error">
                            {error}
                        </div>
                    )}


                    <PasswordField
                        label="Current Password"
                        value={
                            currentPassword
                        }
                        onChange={
                            setCurrentPassword
                        }
                        visible={
                            showCurrentPassword
                        }
                        onToggle={() =>
                            setShowCurrentPassword(
                                (
                                    value
                                ) =>
                                    !value
                            )
                        }
                    />


                    <PasswordField
                        label="New Password"
                        value={
                            newPassword
                        }
                        onChange={
                            setNewPassword
                        }
                        visible={
                            showNewPassword
                        }
                        onToggle={() =>
                            setShowNewPassword(
                                (
                                    value
                                ) =>
                                    !value
                            )
                        }
                    />


                    <PasswordField
                        label="Confirm New Password"
                        value={
                            confirmPassword
                        }
                        onChange={
                            setConfirmPassword
                        }
                        visible={
                            showConfirmPassword
                        }
                        onToggle={() =>
                            setShowConfirmPassword(
                                (
                                    value
                                ) =>
                                    !value
                            )
                        }
                    />


                    <div className="forced-password-requirements">

                        <p>
                            PASSWORD REQUIREMENTS
                        </p>


                        <Requirement
                            passed={
                                newPassword.length >=
                                12
                            }
                        >
                            At least 12 characters
                        </Requirement>


                        <Requirement
                            passed={
                                Boolean(
                                    newPassword &&
                                    currentPassword &&
                                    newPassword !==
                                    currentPassword
                                )
                            }
                        >
                            Different from current password
                        </Requirement>


                        <Requirement
                            passed={
                                Boolean(
                                    newPassword &&
                                    confirmPassword &&
                                    newPassword ===
                                    confirmPassword
                                )
                            }
                        >
                            New passwords match
                        </Requirement>

                    </div>


                    <button
                        type="submit"
                        className="forced-password-submit"
                        disabled={
                            loading
                        }
                    >
                        {loading
                            ? "Changing Password..."
                            : "Change Password"}
                    </button>

                </form>

            </div>

        </div>
    );
}


function PasswordField({
    label,
    value,
    onChange,
    visible,
    onToggle,
}) {
    return (
        <label className="forced-password-field">

            <span>
                {label}
            </span>


            <div>

                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="forced-password-lock"
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


                <input
                    type={
                        visible
                            ? "text"
                            : "password"
                    }
                    value={
                        value
                    }
                    onChange={(
                        event
                    ) =>
                        onChange(
                            event.target.value
                        )
                    }
                />


                <button
                    type="button"
                    onClick={
                        onToggle
                    }
                >
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
                </button>

            </div>

        </label>
    );
}


function Requirement({
    passed,
    children,
}) {
    return (
        <div
            className={
                passed
                    ? "forced-requirement forced-requirement-passed"
                    : "forced-requirement"
            }
        >

            <span>
                {passed
                    ? "✓"
                    : "•"}
            </span>

            {children}

        </div>
    );
}


export default ForcePasswordChangeModal;