import {
    useState,
} from "react";

import api from "../../services/api";


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
        async (event) => {
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


                /*
                    Password change increments authVersion on
                    the backend, so the old access token must
                    now be discarded.
                */

                sessionStorage.removeItem(
                    "accessToken"
                );


                sessionStorage.removeItem(
                    "user"
                );


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
                        Your temporary password is no longer valid. Please log in again using your new password.
                    </p>


                    <button
                        type="button"
                        onClick={
                            onCompleted
                        }
                        className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                        Back to Login
                    </button>

                </div>

            </div>
        );
    }


    // ======================================================
    // REQUIRED PASSWORD MODAL
    // ======================================================

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

                {/* HEADER */}

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
                                You are using a temporary password generated by the administrator. You must create a new password before accessing your account.
                            </p>

                        </div>

                    </div>

                </div>


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-5 p-6"
                >

                    {/* USER INFO */}

                    <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                            Account
                        </p>


                        <p className="mt-1 text-sm font-bold text-slate-900">
                            {user?.firstName}{" "}
                            {user?.lastName}
                        </p>


                        <p className="mt-1 text-xs capitalize text-slate-500">
                            {user?.username}
                            {" · "}
                            {user?.role}
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}


                    {/* CURRENT PASSWORD */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Current Temporary Password
                        </label>


                        <input
                            type="password"
                            value={
                                currentPassword
                            }
                            onChange={(
                                event
                            ) => {
                                setCurrentPassword(
                                    event.target
                                        .value
                                );

                                setError("");
                            }}
                            autoComplete="current-password"
                            disabled={
                                loading
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />

                    </div>


                    {/* NEW PASSWORD */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            New Password
                        </label>


                        <input
                            type="password"
                            value={
                                newPassword
                            }
                            onChange={(
                                event
                            ) => {
                                setNewPassword(
                                    event.target
                                        .value
                                );

                                setError("");
                            }}
                            autoComplete="new-password"
                            disabled={
                                loading
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />


                        <p className="mt-2 text-xs text-slate-500">
                            Use at least 12 characters and do not reuse the temporary password.
                        </p>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Confirm New Password
                        </label>


                        <input
                            type="password"
                            value={
                                confirmPassword
                            }
                            onChange={(
                                event
                            ) => {
                                setConfirmPassword(
                                    event.target
                                        .value
                                );

                                setError("");
                            }}
                            autoComplete="new-password"
                            disabled={
                                loading
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Changing Password..."
                            : "Change Password"}
                    </button>


                    <p className="text-center text-xs leading-5 text-slate-400">
                        This window cannot be skipped. Dashboard access remains blocked until the password is changed.
                    </p>

                </form>

            </div>

        </div>
    );
}


export default ForcePasswordChangeModal;