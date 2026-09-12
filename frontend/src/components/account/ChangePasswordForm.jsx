import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import api from "../../services/api";

import PasswordInput from "../auth/PasswordInput";
import FeedbackAlert from "../ui/FeedbackAlert";


function ChangePasswordForm() {
    const navigate =
        useNavigate();


    const [
        formData,
        setFormData,
    ] = useState({
        currentPassword:
            "",

        newPassword:
            "",

        confirmPassword:
            "",
    });


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
                current
            ) => ({
                ...current,

                [name]:
                    value,
            })
        );


        setError(
            ""
        );

        setSuccess(
            ""
        );
    };


    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();


            setError(
                ""
            );

            setSuccess(
                ""
            );


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
                formData.newPassword.length <
                12
            ) {
                setError(
                    "New password must contain at least 12 characters."
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
                formData.currentPassword ===
                formData.newPassword
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


                window.setTimeout(
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


    return (
        <section
            className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            {/* HEADER */}

            <div
                className="
                    border-b
                    border-slate-100
                    bg-slate-50/50
                    px-4
                    py-4
                    sm:px-5
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
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-600
                            text-white
                        "
                    >
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
                        <p
                            className="
                                text-[7px]
                                font-semibold
                                uppercase
                                tracking-[0.12em]
                                text-blue-600
                            "
                        >
                            Security
                        </p>


                        <h2
                            className="
                                mt-1
                                text-[12px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Change Password
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Create a strong password to keep your account protected.
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
                    p-4
                    sm:p-5
                "
            >
                <FeedbackAlert
                    type="success"
                    message={
                        success
                    }
                />


                <FeedbackAlert
                    type="error"
                    message={
                        error
                    }
                />


                <FormField
                    label="Current Password"
                >
                    <PasswordInput
                        id="current-password"
                        name="currentPassword"
                        value={
                            formData.currentPassword
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            loading
                        }
                        autoComplete="current-password"
                        placeholder="Enter current password"
                    />
                </FormField>


                <FormField
                    label="New Password"
                >
                    <PasswordInput
                        id="new-password"
                        name="newPassword"
                        value={
                            formData.newPassword
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            loading
                        }
                        autoComplete="new-password"
                        placeholder="Create new password"
                    />
                </FormField>


                <FormField
                    label="Confirm New Password"
                >
                    <PasswordInput
                        id="confirm-password"
                        name="confirmPassword"
                        value={
                            formData.confirmPassword
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            loading
                        }
                        autoComplete="new-password"
                        placeholder="Confirm new password"
                    />
                </FormField>


                {/* REQUIREMENTS */}

                <div
                    className="
                        rounded-lg
                        border
                        border-slate-200
                        bg-slate-50
                        p-3
                    "
                >
                    <p
                        className="
                            text-[7px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-600
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
                        <Requirement
                            passed={
                                formData.newPassword.length >=
                                12
                            }
                        >
                            At least 12 characters
                        </Requirement>


                        <Requirement
                            passed={
                                Boolean(
                                    formData.currentPassword &&
                                    formData.newPassword &&
                                    formData.currentPassword !==
                                    formData.newPassword
                                )
                            }
                        >
                            Different from current password
                        </Requirement>


                        <Requirement
                            passed={
                                Boolean(
                                    formData.confirmPassword &&
                                    formData.newPassword ===
                                    formData.confirmPassword
                                )
                            }
                        >
                            New passwords match
                        </Requirement>
                    </div>
                </div>


                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className="
                        flex
                        min-h-[42px]
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-blue-600
                        px-5
                        text-[9px]
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                    >
                        <path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />

                        <path d="m8.5 12 2 2 5-5" />
                    </svg>


                    {loading
                        ? "Changing Password..."
                        : "Change Password"}
                </button>


                <div
                    className="
                        border-t
                        border-slate-100
                        pt-4
                        text-center
                    "
                >
                    <p
                        className="
                            text-[7px]
                            font-medium
                            leading-4
                            text-slate-500
                        "
                    >
                        For your security, you will be signed out after changing your password and must sign in again.
                    </p>
                </div>
            </form>
        </section>
    );
}


function FormField({
    label,
    children,
}) {
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


            {children}
        </label>
    );
}


function Requirement({
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
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-[7px]
                    font-bold

                    ${passed
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-200 text-slate-500"
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
                    font-medium

                    ${passed
                        ? "text-emerald-700"
                        : "text-slate-600"
                    }
                `}
            >
                {children}
            </span>
        </div>
    );
}


export default ChangePasswordForm;