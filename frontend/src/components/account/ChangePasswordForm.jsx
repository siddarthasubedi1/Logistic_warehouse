import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import api from "../../services/api";


function ChangePasswordForm() {
    const navigate =
        useNavigate();


    const [formData, setFormData] =
        useState({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });


    const [showCurrent, setShowCurrent] =
        useState(false);

    const [showNew, setShowNew] =
        useState(false);

    const [showConfirm, setShowConfirm] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;


        setFormData(
            (previous) => ({
                ...previous,

                [name]: value,
            })
        );


        setError("");
        setSuccess("");
    };


    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");


        if (
            !formData.currentPassword ||
            !formData.newPassword ||
            !formData.confirmPassword
        ) {
            setError(
                "Please complete all password fields."
            );

            return;
        }


        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {
            setError(
                "New password and confirmation do not match."
            );

            return;
        }


        if (
            formData.newPassword.length <
            12
        ) {
            setError(
                "New password must contain at least 12 characters."
            );

            return;
        }


        if (
            formData.currentPassword ===
            formData.newPassword
        ) {
            setError(
                "New password must be different from your current password."
            );

            return;
        }


        try {
            setLoading(true);


            const response =
                await api.post(
                    "/auth/change-password",
                    {
                        currentPassword:
                            formData.currentPassword,

                        newPassword:
                            formData.newPassword,
                    }
                );


            setSuccess(
                response.data
                    ?.message ||
                "Password changed successfully."
            );


            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });


            /*
                Backend invalidates the refresh
                session after password change.
            */

            sessionStorage.removeItem(
                "accessToken"
            );

            sessionStorage.removeItem(
                "user"
            );


            setTimeout(
                () => {
                    navigate(
                        "/login",
                        {
                            replace: true,
                        }
                    );
                },
                1500
            );

        } catch (error) {
            console.error(
                "Change password error:",
                error
            );


            setError(
                error.response?.data
                    ?.message ||
                "Unable to change password."
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* HEADING */}

            <div>

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
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

                        <h2 className="text-sm font-bold text-slate-900">
                            Change Password
                        </h2>

                        <p className="mt-1 text-[10px] text-slate-500">
                            Update your account password securely.
                        </p>

                    </div>

                </div>

            </div>


            {/* ERROR */}

            {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[10px] text-red-600">
                    {error}
                </div>
            )}


            {/* SUCCESS */}

            {success && (
                <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-[10px] text-emerald-600">
                    {success}
                </div>
            )}


            <form
                onSubmit={
                    handleSubmit
                }
                className="mt-6 space-y-4"
            >

                <PasswordField
                    label="Current Password"
                    name="currentPassword"
                    value={
                        formData.currentPassword
                    }
                    onChange={
                        handleChange
                    }
                    visible={
                        showCurrent
                    }
                    toggle={() =>
                        setShowCurrent(
                            (value) =>
                                !value
                        )
                    }
                    disabled={
                        loading
                    }
                    autoComplete="current-password"
                />


                <PasswordField
                    label="New Password"
                    name="newPassword"
                    value={
                        formData.newPassword
                    }
                    onChange={
                        handleChange
                    }
                    visible={
                        showNew
                    }
                    toggle={() =>
                        setShowNew(
                            (value) =>
                                !value
                        )
                    }
                    disabled={
                        loading
                    }
                    autoComplete="new-password"
                />


                <PasswordField
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={
                        formData.confirmPassword
                    }
                    onChange={
                        handleChange
                    }
                    visible={
                        showConfirm
                    }
                    toggle={() =>
                        setShowConfirm(
                            (value) =>
                                !value
                        )
                    }
                    disabled={
                        loading
                    }
                    autoComplete="new-password"
                />


                {/* PASSWORD INFO */}

                <div className="rounded-lg bg-slate-50 p-4">

                    <div className="flex gap-2">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="mt-[1px] h-4 w-4 shrink-0 text-blue-500"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />

                            <path d="M12 11v5" />

                            <circle
                                cx="12"
                                cy="8"
                                r=".7"
                                fill="currentColor"
                            />
                        </svg>


                        <p className="text-[9px] leading-4 text-slate-500">
                            Your new password must contain at least
                            12 characters and must be different from
                            your current password.
                        </p>

                    </div>

                </div>


                <button
                    type="submit"
                    disabled={loading}
                    className="flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 text-[11px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Changing Password..."
                        : "Change Password"}
                </button>

            </form>

        </section>
    );
}


function PasswordField({
    label,
    name,
    value,
    onChange,
    visible,
    toggle,
    disabled,
    autoComplete,
}) {
    return (
        <div>

            <label
                htmlFor={name}
                className="mb-2 block text-[10px] font-semibold text-slate-700"
            >
                {label}
            </label>


            <div className="relative">

                <input
                    id={name}
                    name={name}
                    type={
                        visible
                            ? "text"
                            : "password"
                    }
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    autoComplete={
                        autoComplete
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 pr-11 text-[11px] text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                />


                <button
                    type="button"
                    onClick={toggle}
                    disabled={disabled}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-blue-600"
                    aria-label={
                        visible
                            ? "Hide password"
                            : "Show password"
                    }
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

                            <path d="M6.6 6.6C4.4 8 3 10.2 3 12c0 3 3.5 8 9 8a10 10 0 0 0 4.2-.9" />
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


export default ChangePasswordForm;