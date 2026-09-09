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
    // CHANGE PASSWORD
    // ======================================================

    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();


            setError("");


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
            // PASSWORD LENGTH
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
            // MUST BE DIFFERENT
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
                setLoading(true);


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
                // REMOVE OLD SESSION
                // ==================================================
                //
                // Backend invalidates the old authenticated session
                // when the password changes.
                //
                // User must login again using the new password.
                // ==================================================

                clearAuthSession();


                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");


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
                setLoading(false);
            }
        };


    // ======================================================
    // SUCCESS SCREEN
    // ======================================================

    if (completed) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">

                <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-7 w-7"
                        >
                            <path d="m5 12 4 4L19 6" />
                        </svg>

                    </div>


                    <h2 className="mt-5 text-center text-xl font-bold text-slate-900">
                        Password Changed Successfully
                    </h2>


                    <p className="mt-2 text-center text-sm leading-6 text-slate-500">
                        Your temporary password is no longer valid.
                        Please log in again using your new password.
                    </p>


                    <div className="mt-6 flex justify-center">

                        <ActionButton
                            variant="primary"
                            className="w-full justify-center"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="border-b border-slate-200 px-6 py-5">

                    <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">

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

                            <h2 className="text-lg font-bold text-slate-900">
                                Password Change Required
                            </h2>


                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                You are using a temporary password
                                generated by the administrator. Create
                                a new password before accessing your
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
                    className="space-y-5 p-6"
                >

                    {/* User */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                            Account
                        </p>


                        <p className="mt-1 text-sm font-bold text-slate-900">
                            {getUserDisplayName(
                                user,
                                user?.username ||
                                "User"
                            )}
                        </p>


                        <p className="mt-1 text-xs capitalize text-slate-500">
                            {user?.username}
                            {" · "}
                            {user?.role}
                        </p>

                    </div>


                    {/* Error */}
                    <FeedbackAlert
                        type="error"
                        message={
                            error
                        }
                    />


                    {/* Current password */}
                    <PasswordField
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

                            setError("");
                        }}
                        autoComplete="current-password"
                        disabled={
                            loading
                        }
                    />


                    {/* New password */}
                    <PasswordField
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

                            setError("");
                        }}
                        autoComplete="new-password"
                        disabled={
                            loading
                        }
                    />


                    <p className="-mt-3 text-[11px] leading-5 text-slate-500">
                        Use at least 12 characters and do not reuse
                        your temporary password.
                    </p>


                    {/* Confirm */}
                    <PasswordField
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

                            setError("");
                        }}
                        autoComplete="new-password"
                        disabled={
                            loading
                        }
                    />


                    {/* Submit */}
                    <ActionButton
                        type="submit"
                        variant="primary"
                        disabled={
                            loading
                        }
                        className="w-full justify-center py-3"
                    >
                        {loading
                            ? "Changing Password..."
                            : "Change Password"}
                    </ActionButton>


                    <p className="text-center text-[11px] leading-5 text-slate-400">
                        This step cannot be skipped. Trainer and
                        Trainee dashboard access stays blocked until
                        the temporary password is changed.
                    </p>

                </form>

            </div>

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
    autoComplete,
    disabled,
}) {
    return (
        <label className="block">

            <span className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </span>


            <input
                type="password"
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
                className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                    disabled:bg-slate-100
                "
            />

        </label>
    );
}


export default ForcePasswordChangeModal;