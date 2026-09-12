import {
    useState,
} from "react";

import api from "../../services/api";

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


    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();


            setError(
                ""
            );


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
                    "New password and confirmation do not match."
                );

                return;
            }


            if (
                newPassword ===
                currentPassword
            ) {
                setError(
                    "The new password must be different from the temporary password."
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

            } catch (error) {
                console.error(
                    "Forced password change error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to change password."
                );

            } finally {
                setLoading(
                    false
                );
            }
        };


    if (
        completed
    ) {
        return (
            <ModalWrapper>
                <div
                    className="
                        p-6
                        text-center
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
                            bg-emerald-100
                            text-[18px]
                            font-bold
                            text-emerald-600
                        "
                    >
                        ✓
                    </div>


                    <h2
                        className="
                            mt-4
                            text-[15px]
                            font-bold
                            text-[#172033]
                        "
                    >
                        Password Changed Successfully.
                    </h2>


                    <p
                        className="
                            mt-2
                            text-[8px]
                            font-medium
                            leading-5
                            text-slate-600
                        "
                    >
                        Your temporary password is no longer valid. Please sign in again using your new password.
                    </p>


                    <button
                        type="button"
                        onClick={
                            onCompleted
                        }
                        className="
                            mt-6
                            h-10
                            w-full
                            rounded-md
                            bg-[#1769e8]
                            text-[9px]
                            font-semibold
                            text-white
                            hover:bg-[#0f5dce]
                        "
                    >
                        Back to Login
                    </button>
                </div>
            </ModalWrapper>
        );
    }


    const accountName =
        getUserDisplayName(
            user,
            user?.username ||
            "Account"
        );


    return (
        <ModalWrapper>
            {/* HEADER */}

            <div
                className="
                    border-b
                    border-slate-200
                    px-5
                    py-4
                "
            >
                <div
                    className="
                        flex
                        items-start
                        gap-3
                    "
                >
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-amber-50
                            text-amber-600
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
                                text-[12px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Password Change Required
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                font-medium
                                leading-4
                                text-slate-600
                            "
                        >
                            You are using a temporary password generated by the Administrator. Create a new password before accessing your account.
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
                {/* ACCOUNT */}

                <div
                    className="
                        rounded-lg
                        border
                        border-blue-100
                        bg-blue-50
                        p-3
                    "
                >
                    <p
                        className="
                            text-[7px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-blue-600
                        "
                    >
                        Account
                    </p>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            font-bold
                            text-slate-800
                        "
                    >
                        {accountName}
                    </p>


                    <p
                        className="
                            mt-1
                            text-[8px]
                            capitalize
                            text-slate-600
                        "
                    >
                        {user?.username || ""}
                        {user?.role
                            ? ` · ${user.role}`
                            : ""}
                    </p>
                </div>


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


                <PasswordField
                    label="Current Temporary Password"
                    value={
                        currentPassword
                    }
                    onChange={
                        setCurrentPassword
                    }
                    disabled={
                        loading
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
                    disabled={
                        loading
                    }
                />


                <p
                    className="
                        -mt-2
                        text-[7px]
                        font-medium
                        text-slate-500
                    "
                >
                    Use at least 12 characters and do not reuse the temporary password.
                </p>


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
                />


                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className="
                        h-10
                        w-full
                        rounded-md
                        bg-[#1769e8]
                        text-[9px]
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#0f5dce]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {loading
                        ? "Changing Password..."
                        : "Change Password"}
                </button>


                <p
                    className="
                        text-center
                        text-[7px]
                        font-medium
                        leading-4
                        text-slate-500
                    "
                >
                    This window cannot be skipped. Dashboard access remains blocked until the password is changed.
                </p>
            </form>
        </ModalWrapper>
    );
}


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
                p-3
                backdrop-blur-[2px]
                sm:p-4
            "
        >
            <section
                role="dialog"
                aria-modal="true"
                className="
                    my-auto
                    w-full
                    max-w-[470px]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                "
            >
                {children}
            </section>
        </div>
    );
}


function PasswordField({
    label,
    value,
    onChange,
    disabled,
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
                    font-semibold
                    text-slate-700
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
                    disabled={
                        disabled
                    }
                    className="
                        h-10
                        w-full
                        rounded-md
                        border
                        border-slate-300
                        bg-white
                        px-3
                        pr-11
                        text-[9px]
                        text-slate-800
                        outline-none
                        focus:border-blue-500
                        focus:ring-1
                        focus:ring-blue-100
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
                        text-[7px]
                        font-semibold
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


export default ForcePasswordChangeModal;