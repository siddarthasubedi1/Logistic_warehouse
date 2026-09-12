import {
    useState,
} from "react";

import api from "../../services/api";

import ActionButton from "../ui/ActionButton";
import FeedbackAlert from "../ui/FeedbackAlert";

import {
    clearAuthSession,
} from "../../utils/session";

import {
    getUserDisplayName,
} from "../../utils/training";


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


    // ======================================================
    // VALIDATION STATES
    // ======================================================

    const hasMinimumLength =
        newPassword.length >=
        12;


    const isDifferent =
        Boolean(
            currentPassword &&
            newPassword &&
            currentPassword !==
            newPassword
        );


    const passwordsMatch =
        Boolean(
            confirmPassword &&
            newPassword ===
            confirmPassword
        );


    // ======================================================
    // SUBMIT
    // ======================================================

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
                newPassword.length <
                12
            ) {
                setError(
                    "New password must contain at least 12 characters."
                );

                return;
            }


            if (
                newPassword !==
                confirmPassword
            ) {
                setError(
                    "New password and confirm password do not match."
                );

                return;
            }


            if (
                newPassword ===
                currentPassword
            ) {
                setError(
                    "Your new password must be different from the temporary password."
                );

                return;
            }


            try {
                setLoading(true);


                await api.post(
                    "/auth/change-password",
                    {
                        currentPassword,
                        newPassword,
                    }
                );


                clearAuthSession();


                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");


                setCompleted(true);

            } catch (error) {
                console.error(
                    "Forced password change error:",
                    error
                );


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to change password. Please try again."
                );

            } finally {
                setLoading(false);
            }
        };


    // ======================================================
    // SUCCESS
    // ======================================================

    if (completed) {
        return (
            <ModalWrapper>
                <div
                    className="
                        p-5
                        text-center
                        sm:p-6
                    "
                >
                    <div
                        className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-50
                            text-emerald-600
                        "
                    >
                        ✓
                    </div>


                    <h2
                        className="
                            mt-4
                            text-[16px]
                            font-semibold
                            text-slate-800
                        "
                    >
                        Password Changed
                    </h2>


                    <p
                        className="
                            mt-2
                            text-[9px]
                            leading-5
                            text-slate-500
                        "
                    >
                        Your temporary password has been replaced. Sign in again using your new password.
                    </p>


                    <div
                        className="
                            mt-6
                        "
                    >
                        <ActionButton
                            variant="primary"
                            onClick={
                                onCompleted
                            }
                            className="
                                w-full
                                justify-center
                            "
                        >
                            Return to Login
                        </ActionButton>
                    </div>
                </div>
            </ModalWrapper>
        );
    }


    // ======================================================
    // FORM
    // ======================================================

    return (
        <ModalWrapper>
            <div
                className="
                    border-b
                    border-slate-100
                    px-5
                    py-4
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
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-50
                            text-blue-600
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
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
                        <h2
                            className="
                                text-[13px]
                                font-semibold
                                text-slate-800
                            "
                        >
                            Password Change Required
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                text-slate-400
                            "
                        >
                            {getUserDisplayName(
                                user,
                                user?.username ||
                                "Account"
                            )}
                        </p>
                    </div>
                </div>
            </div>


            <form
                onSubmit={
                    handleSubmit
                }
                className="
                    space-y-4
                    p-5
                "
            >
                <p
                    className="
                        text-[9px]
                        leading-5
                        text-slate-500
                    "
                >
                    Your Administrator-generated password is temporary. Create a new password before continuing.
                </p>


                <FeedbackAlert
                    type="error"
                    message={error}
                    onClose={() =>
                        setError("")
                    }
                />


                <PasswordField
                    label="Temporary Password"
                    value={
                        currentPassword
                    }
                    onChange={
                        setCurrentPassword
                    }
                    disabled={
                        loading
                    }
                    autoComplete="current-password"
                />


                <PasswordField
                    label="New Password"
                    value={
                        newPassword
                    }
                    onChange={
                        setNewPassword
                    }
                    disabled={
                        loading
                    }
                    autoComplete="new-password"
                />


                <PasswordField
                    label="Confirm New Password"
                    value={
                        confirmPassword
                    }
                    onChange={
                        setConfirmPassword
                    }
                    disabled={
                        loading
                    }
                    autoComplete="new-password"
                />


                {/* RULES */}

                <div
                    className="
                        space-y-2
                        rounded-lg
                        bg-slate-50
                        p-3
                    "
                >
                    <PasswordRule
                        passed={
                            hasMinimumLength
                        }
                    >
                        At least 12 characters
                    </PasswordRule>


                    <PasswordRule
                        passed={
                            isDifferent
                        }
                    >
                        Different from temporary password
                    </PasswordRule>


                    <PasswordRule
                        passed={
                            passwordsMatch
                        }
                    >
                        New passwords match
                    </PasswordRule>
                </div>


                <ActionButton
                    type="submit"
                    variant="primary"
                    disabled={
                        loading
                    }
                    className="
                        w-full
                        justify-center
                    "
                >
                    {loading
                        ? "Changing Password..."
                        : "Change Password"}
                </ActionButton>
            </form>
        </ModalWrapper>
    );
}


// ======================================================
// MODAL
// ======================================================

function ModalWrapper({
    children,
}) {
    return (
        <div
            className="
                fixed
                inset-0
                z-[200]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-slate-950/60
                p-4
            "
        >
            <section
                role="dialog"
                aria-modal="true"
                className="
                    my-auto
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-xl
                "
            >
                {children}
            </section>
        </div>
    );
}


// ======================================================
// PASSWORD FIELD
// ======================================================

function PasswordField({
    label,
    value,
    onChange,
    disabled,
    autoComplete,
}) {
    const [
        visible,
        setVisible,
    ] = useState(false);


    return (
        <label
            className="
                block
            "
        >
            <span
                className="
                    mb-2
                    block
                    text-[8px]
                    font-medium
                    text-slate-500
                "
            >
                {label}
            </span>


            <div
                className="
                    relative
                "
            >
                <input
                    type={
                        visible
                            ? "text"
                            : "password"
                    }
                    value={value}
                    onChange={(
                        event
                    ) =>
                        onChange(
                            event.target.value
                        )
                    }
                    disabled={
                        disabled
                    }
                    autoComplete={
                        autoComplete
                    }
                    className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-3
                        pr-11
                        text-[10px]
                        text-slate-700
                        outline-none
                        focus:border-blue-500
                        disabled:bg-slate-50
                    "
                />


                <button
                    type="button"
                    onClick={() =>
                        setVisible(
                            (
                                current
                            ) =>
                                !current
                        )
                    }
                    disabled={
                        disabled
                    }
                    className="
                        absolute
                        inset-y-0
                        right-0
                        flex
                        w-10
                        items-center
                        justify-center
                        text-[8px]
                        font-medium
                        text-blue-600
                    "
                >
                    {visible
                        ? "Hide"
                        : "Show"}
                </button>
            </div>
        </label>
    );
}


// ======================================================
// RULE
// ======================================================

function PasswordRule({
    passed,
    children,
}) {
    return (
        <div
            className="
                flex
                items-center
                gap-2
            "
        >
            <span
                className={`
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                    rounded-full
                    text-[7px]
                    font-bold

                    ${passed
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-200 text-slate-400"
                    }
                `}
            >
                {passed
                    ? "✓"
                    : "•"}
            </span>


            <span
                className={`
                    text-[8px]

                    ${passed
                        ? "text-emerald-600"
                        : "text-slate-500"
                    }
                `}
            >
                {children}
            </span>
        </div>
    );
}


export default ForcePasswordChangeModal;