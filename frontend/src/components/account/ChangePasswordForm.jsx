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


    const [
        formData,
        setFormData,
    ] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });


    const [
        showCurrent,
        setShowCurrent,
    ] = useState(false);

    const [
        showNew,
        setShowNew,
    ] = useState(false);

    const [
        showConfirm,
        setShowConfirm,
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
        success,
        setSuccess,
    ] = useState("");


    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } =
            event.target;


        setFormData(
            (
                previous
            ) => ({
                ...previous,

                [name]:
                    value,
            })
        );


        setError("");
        setSuccess("");
    };


    const handleSubmit =
        async (
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
                formData
                    .newPassword
                    .length <
                12
            ) {
                setError(
                    "New password must contain at least 12 characters."
                );

                return;
            }


            if (
                formData
                    .currentPassword ===
                formData
                    .newPassword
            ) {
                setError(
                    "New password must be different from your current password."
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
                    currentPassword:
                        "",

                    newPassword:
                        "",

                    confirmPassword:
                        "",
                });


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
                                replace:
                                    true,
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
                    error.response
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


    const newPasswordLength =
        formData
            .newPassword
            .length;


    const passwordsMatch =
        formData
            .confirmPassword &&
        formData.newPassword ===
        formData
            .confirmPassword;


    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


            {/* SECURITY HEADER */}

            <div className="border-b border-slate-100 bg-gradient-to-br from-white to-blue-50/60 p-6">

                <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">

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

                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-600">
                            Security
                        </p>

                        <h2 className="mt-1 text-[15px] font-bold text-slate-900">
                            Change Password
                        </h2>

                        <p className="mt-1 text-[10px] leading-4 text-slate-500">
                            Create a strong password to keep your account protected.
                        </p>

                    </div>

                </div>

            </div>


            <div className="p-6">


                {/* ERROR */}

                {error && (
                    <div className="mb-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[10px] text-red-600">

                        <span className="font-bold">
                            !
                        </span>

                        <span>
                            {error}
                        </span>

                    </div>
                )}


                {/* SUCCESS */}

                {success && (
                    <div className="mb-5 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[10px] text-emerald-700">

                        <span>
                            ✓
                        </span>

                        <span>
                            {success}
                        </span>

                    </div>
                )}


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-4"
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
                                (
                                    value
                                ) =>
                                    !value
                            )
                        }
                        disabled={
                            loading
                        }
                        autoComplete="current-password"
                        placeholder="Enter current password"
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
                                (
                                    value
                                ) =>
                                    !value
                            )
                        }
                        disabled={
                            loading
                        }
                        autoComplete="new-password"
                        placeholder="Create new password"
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
                                (
                                    value
                                ) =>
                                    !value
                            )
                        }
                        disabled={
                            loading
                        }
                        autoComplete="new-password"
                        placeholder="Confirm new password"
                    />


                    {/* PASSWORD RULES */}

                    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">

                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                            Password requirements
                        </p>


                        <div className="mt-3 space-y-2">

                            <Rule
                                valid={
                                    newPasswordLength >=
                                    12
                                }
                                text="At least 12 characters"
                            />


                            <Rule
                                valid={
                                    Boolean(
                                        formData.newPassword &&
                                        formData.currentPassword &&
                                        formData.newPassword !==
                                        formData.currentPassword
                                    )
                                }
                                text="Different from current password"
                            />


                            <Rule
                                valid={
                                    Boolean(
                                        passwordsMatch
                                    )
                                }
                                text="New passwords match"
                            />

                        </div>

                    </div>


                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1769e0] text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#0f5dc9] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {loading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                Changing Password...
                            </>
                        ) : (
                            <>
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                >
                                    <path d="M12 3 5 6v5c0 4.7 2.9 8.2 7 10 4.1-1.8 7-5.3 7-10V6l-7-3Z" />

                                    <path d="m9 12 2 2 4-4" />
                                </svg>

                                Change Password
                            </>
                        )}

                    </button>

                </form>


                <div className="mt-5 border-t border-slate-100 pt-4">

                    <p className="text-center text-[9px] leading-4 text-slate-400">
                        After changing your password you will be signed out and asked to log in again.
                    </p>

                </div>

            </div>

        </section>
    );
}


function Rule({
    valid,
    text,
}) {
    return (
        <div className="flex items-center gap-2">

            <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ${valid
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-500"
                    }`}
            >
                {valid
                    ? "✓"
                    : "•"}
            </span>


            <p
                className={`text-[9px] ${valid
                    ? "font-semibold text-emerald-700"
                    : "text-slate-500"
                    }`}
            >
                {text}
            </p>

        </div>
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
    placeholder,
}) {
    return (
        <div>

            <label
                htmlFor={
                    name
                }
                className="mb-2 block text-[10px] font-semibold text-slate-700"
            >
                {label}
            </label>


            <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">

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
                    id={
                        name
                    }
                    name={
                        name
                    }
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
                    disabled={
                        disabled
                    }
                    autoComplete={
                        autoComplete
                    }
                    placeholder={
                        placeholder
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-[11px] text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                />


                <button
                    type="button"
                    onClick={
                        toggle
                    }
                    disabled={
                        disabled
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-blue-600 disabled:opacity-50"
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