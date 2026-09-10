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


// ======================================================
// FORCE PASSWORD CHANGE MODAL
// ======================================================

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


    const [
        completed,
        setCompleted,
    ] = useState(false);


    // ======================================================
    // PASSWORD CONDITIONS
    // ======================================================

    const hasMinimumLength =
        newPassword.length >=
        12;


    const isDifferent =
        Boolean(
            newPassword &&
            currentPassword &&
            newPassword !==
            currentPassword
        );


    const passwordsMatch =
        Boolean(
            confirmPassword &&
            newPassword ===
            confirmPassword
        );


    // ======================================================
    // CHANGE PASSWORD
    // ======================================================

    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();


            setError(
                ""
            );


            // ==================================================
            // REQUIRED
            // ==================================================

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


            // ==================================================
            // LENGTH
            // ==================================================

            if (
                newPassword.length <
                12
            ) {
                setError(
                    "New password must contain at least 12 characters."
                );

                return;
            }


            // ==================================================
            // MATCH
            // ==================================================

            if (
                newPassword !==
                confirmPassword
            ) {
                setError(
                    "New password and confirm password do not match."
                );

                return;
            }


            // ==================================================
            // DIFFERENT FROM TEMPORARY
            // ==================================================

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
                setLoading(
                    true
                );


                // ==================================================
                // BACKEND CHANGE PASSWORD
                // ==================================================

                await api.post(
                    "/auth/change-password",
                    {
                        currentPassword,
                        newPassword,
                    }
                );


                // ==================================================
                // CLEAR SESSION
                // ==================================================
                //
                // The user must authenticate again with the new
                // password after the temporary password is replaced.
                // ==================================================

                clearAuthSession();


                setCurrentPassword(
                    ""
                );

                setNewPassword(
                    ""
                );

                setConfirmPassword(
                    ""
                );


                setCompleted(
                    true
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
                    "Unable to change password. Please try again."
                );

            } finally {
                setLoading(
                    false
                );
            }
        };


    // ======================================================
    // SUCCESS SCREEN
    // ======================================================

    if (
        completed
    ) {
        return (
            <div
                className="
                    fixed
                    inset-0
                    z-[100]
                    flex
                    items-center
                    justify-center
                    overflow-y-auto
                    bg-slate-950/60
                    px-4
                    py-8
                    backdrop-blur-sm
                "
            >

                <div
                    className="
                        relative
                        w-full
                        max-w-md
                        overflow-hidden
                        rounded-2xl
                        bg-white
                        shadow-2xl
                    "
                >

                    <div
                        className="
                            h-1
                            bg-emerald-500
                        "
                    />


                    <div
                        className="
                            p-6
                            text-center
                            sm:p-7
                        "
                    >

                        <div
                            className="
                                mx-auto
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-2xl
                                bg-emerald-100
                                text-emerald-600
                            "
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-8 w-8"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                />

                                <path d="m8 12 2.5 2.5L16 9" />
                            </svg>

                        </div>


                        <p
                            className="
                                mt-5
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.16em]
                                text-emerald-600
                            "
                        >
                            Security Update Complete
                        </p>


                        <h2
                            className="
                                mt-2
                                text-xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Password Changed Successfully
                        </h2>


                        <p
                            className="
                                mx-auto
                                mt-3
                                max-w-sm
                                text-[11px]
                                leading-6
                                text-slate-500
                            "
                        >
                            Your temporary password is no longer valid.
                            Please log in again using your new password.
                        </p>


                        <div
                            className="
                                mt-6
                                rounded-xl
                                border
                                border-emerald-100
                                bg-emerald-50
                                p-3
                            "
                        >

                            <p
                                className="
                                    text-[9px]
                                    leading-5
                                    text-emerald-700
                                "
                            >
                                Your account is now ready to use with
                                the new password.
                            </p>

                        </div>


                        <ActionButton
                            variant="primary"
                            className="
                                mt-6
                                w-full
                                justify-center
                            "
                            onClick={
                                onCompleted
                            }
                        >
                            Back to Login
                        </ActionButton>

                    </div>

                </div>

            </div>
        );
    }


    // ======================================================
    // REQUIRED PASSWORD CHANGE
    // ======================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-slate-950/60
                px-4
                py-6
                backdrop-blur-sm
            "
        >

            <div
                className="
                    my-auto
                    w-full
                    max-w-lg
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-2xl
                "
            >

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div
                    className="
                        relative
                        overflow-hidden
                        bg-gradient-to-r
                        from-[#073763]
                        via-[#0b4f87]
                        to-[#1769aa]
                        px-5
                        py-5
                        text-white
                        sm:px-6
                    "
                >

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-10
                            -top-12
                            h-32
                            w-32
                            rounded-full
                            bg-white/10
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            flex
                            items-start
                            gap-4
                        "
                    >

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-white/15
                                bg-white/10
                            "
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-6 w-6"
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

                            <p
                                className="
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-blue-100
                                "
                            >
                                First Login Security
                            </p>


                            <h2
                                className="
                                    mt-1
                                    text-lg
                                    font-bold
                                "
                            >
                                Password Change Required
                            </h2>


                            <p
                                className="
                                    mt-2
                                    text-[10px]
                                    leading-5
                                    text-blue-100
                                "
                            >
                                You are using a temporary password
                                generated by the Administrator. Create
                                your own password before accessing your
                                dashboard.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        space-y-4
                        p-5
                        sm:p-6
                    "
                >

                    {/* ================================================= */}
                    {/* ACCOUNT */}
                    {/* ================================================= */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-blue-100
                            bg-blue-50
                            p-4
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
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-blue-600
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
                                    <circle
                                        cx="12"
                                        cy="8"
                                        r="3"
                                    />

                                    <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                                </svg>

                            </div>


                            <div className="min-w-0">

                                <p
                                    className="
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-blue-500
                                    "
                                >
                                    Account
                                </p>


                                <p
                                    className="
                                        mt-1
                                        truncate
                                        text-[11px]
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    {getUserDisplayName(
                                        user,
                                        user?.username ||
                                        "User"
                                    )}
                                </p>


                                <p
                                    className="
                                        mt-0.5
                                        text-[9px]
                                        capitalize
                                        text-slate-500
                                    "
                                >
                                    {user?.username ||
                                        "No username"}
                                    {" · "}
                                    {user?.role ||
                                        "User"}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

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


                    {/* ================================================= */}
                    {/* TEMPORARY PASSWORD */}
                    {/* ================================================= */}

                    <ModalPasswordField
                        label="Current Temporary Password"
                        value={
                            currentPassword
                        }
                        onChange={(
                            event
                        ) => {
                            setCurrentPassword(
                                event.target.value
                            );

                            setError(
                                ""
                            );
                        }}
                        visible={
                            showCurrentPassword
                        }
                        onToggle={() =>
                            setShowCurrentPassword(
                                (
                                    current
                                ) =>
                                    !current
                            )
                        }
                        autoComplete="current-password"
                        disabled={
                            loading
                        }
                        placeholder="Enter temporary password"
                    />


                    {/* ================================================= */}
                    {/* NEW PASSWORD */}
                    {/* ================================================= */}

                    <ModalPasswordField
                        label="New Password"
                        value={
                            newPassword
                        }
                        onChange={(
                            event
                        ) => {
                            setNewPassword(
                                event.target.value
                            );

                            setError(
                                ""
                            );
                        }}
                        visible={
                            showNewPassword
                        }
                        onToggle={() =>
                            setShowNewPassword(
                                (
                                    current
                                ) =>
                                    !current
                            )
                        }
                        autoComplete="new-password"
                        disabled={
                            loading
                        }
                        placeholder="Create new password"
                    />


                    {/* ================================================= */}
                    {/* CONFIRM */}
                    {/* ================================================= */}

                    <ModalPasswordField
                        label="Confirm New Password"
                        value={
                            confirmPassword
                        }
                        onChange={(
                            event
                        ) => {
                            setConfirmPassword(
                                event.target.value
                            );

                            setError(
                                ""
                            );
                        }}
                        visible={
                            showConfirmPassword
                        }
                        onToggle={() =>
                            setShowConfirmPassword(
                                (
                                    current
                                ) =>
                                    !current
                            )
                        }
                        autoComplete="new-password"
                        disabled={
                            loading
                        }
                        placeholder="Confirm new password"
                    />


                    {/* ================================================= */}
                    {/* REQUIREMENTS */}
                    {/* ================================================= */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                        "
                    >

                        <p
                            className="
                                text-[8px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-slate-500
                            "
                        >
                            Password Requirements
                        </p>


                        <div
                            className="
                                mt-3
                                space-y-2
                            "
                        >

                            <PasswordRule
                                valid={
                                    hasMinimumLength
                                }
                                label="At least 12 characters"
                            />


                            <PasswordRule
                                valid={
                                    isDifferent
                                }
                                label="Different from temporary password"
                            />


                            <PasswordRule
                                valid={
                                    passwordsMatch
                                }
                                label="New passwords match"
                            />

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* SUBMIT */}
                    {/* ================================================= */}

                    <ActionButton
                        type="submit"
                        variant="primary"
                        disabled={
                            loading
                        }
                        className="
                            w-full
                            justify-center
                            py-3
                        "
                    >
                        {loading
                            ? "Changing Password..."
                            : "Change Password"}
                    </ActionButton>


                    {/* ================================================= */}
                    {/* NOTICE */}
                    {/* ================================================= */}

                    <div
                        className="
                            flex
                            items-start
                            gap-2
                            rounded-xl
                            bg-amber-50
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
                                text-amber-600
                            "
                        >
                            <path d="M12 3 2.5 20h19L12 3Z" />

                            <path d="M12 9v5" />

                            <path d="M12 17h.01" />
                        </svg>


                        <p
                            className="
                                text-[9px]
                                leading-5
                                text-amber-700
                            "
                        >
                            This step cannot be skipped. Trainer and
                            Trainee dashboard access remains blocked
                            until the temporary password is changed.
                        </p>

                    </div>

                </form>

            </div>

        </div>
    );
}


// ======================================================
// PASSWORD RULE
// ======================================================

function PasswordRule({
    valid,
    label,
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
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-[8px]
                    font-bold

                    ${valid
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-500"
                    }
                `}
            >
                {valid
                    ? "✓"
                    : "•"}
            </span>


            <span
                className={`
                    text-[9px]

                    ${valid
                        ? "font-semibold text-emerald-700"
                        : "text-slate-500"
                    }
                `}
            >
                {label}
            </span>

        </div>
    );
}


// ======================================================
// MODAL PASSWORD FIELD
// ======================================================

function ModalPasswordField({
    label,
    value,
    onChange,
    visible,
    onToggle,
    autoComplete,
    disabled,
    placeholder,
}) {
    return (
        <div>

            <label
                className="
                    mb-2
                    block
                    text-[10px]
                    font-semibold
                    text-slate-700
                "
            >
                {label}
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
                        pl-3.5
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


                <input
                    type={
                        visible
                            ? "text"
                            : "password"
                    }
                    value={
                        value
                    }
                    onChange={
                        onChange
                    }
                    autoComplete={
                        autoComplete
                    }
                    disabled={
                        disabled
                    }
                    placeholder={
                        placeholder
                    }
                    className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        pl-10
                        pr-11
                        text-[11px]
                        text-slate-800
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:cursor-not-allowed
                        disabled:bg-slate-100
                    "
                />


                <button
                    type="button"
                    disabled={
                        disabled
                    }
                    onClick={
                        onToggle
                    }
                    aria-label={
                        visible
                            ? "Hide password"
                            : "Show password"
                    }
                    className="
                        absolute
                        inset-y-0
                        right-0
                        flex
                        w-11
                        items-center
                        justify-center
                        text-slate-400
                        transition
                        hover:text-blue-600
                        disabled:opacity-50
                    "
                >

                    {visible ? (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                        >
                            <path d="M3 3l18 18" />

                            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />

                            <path d="M9.8 4.2A10.5 10.5 0 0 1 12 4c5.5 0 9 5 9 8a10.8 10.8 0 0 1-2.2 3.8" />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                        >
                            <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />

                            <circle
                                cx="12"
                                cy="12"
                                r="2.5"
                            />
                        </svg>
                    )}

                </button>

            </div>

        </div>
    );
}


export default ForcePasswordChangeModal;