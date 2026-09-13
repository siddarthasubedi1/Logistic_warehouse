import {
    useState,
} from "react";

import api from "../../services/api";

import FeedbackAlert from "../ui/FeedbackAlert";


function ChangePasswordForm() {
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
        showPasswords,
        setShowPasswords,
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


    const resetFields =
        () => {
            setCurrentPassword(
                ""
            );

            setNewPassword(
                ""
            );

            setConfirmPassword(
                ""
            );
        };


    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            setError("");
            setSuccess("");


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
                currentPassword ===
                newPassword
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
                            currentPassword,
                            newPassword,
                        }
                    );


                if (
                    response.data
                        ?.user
                ) {
                    sessionStorage.setItem(
                        "user",
                        JSON.stringify(
                            response.data.user
                        )
                    );
                }


                sessionStorage.removeItem(
                    "forcePasswordChange"
                );


                setSuccess(
                    response.data
                        ?.message ||
                    "Password changed successfully."
                );


                resetFields();

            } catch (
            error
            ) {
                console.error(
                    "Change password error:",
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
        <form
            onSubmit={
                handleSubmit
            }
            className="
                p-5
            "
        >
            <div
                className="
                    max-w-[620px]
                "
            >

                <div
                    className="
                        space-y-3
                    "
                >

                    <FeedbackAlert
                        type="success"
                        message={
                            success
                        }
                        onClose={() =>
                            setSuccess("")
                        }
                    />


                    <FeedbackAlert
                        type="error"
                        message={
                            error
                        }
                        onClose={() =>
                            setError("")
                        }
                    />

                </div>


                <div
                    className="
                        mt-4
                        grid
                        gap-4
                    "
                >

                    <PasswordField
                        label="Current Password"
                        value={
                            currentPassword
                        }
                        onChange={
                            setCurrentPassword
                        }
                        show={
                            showPasswords
                        }
                        autoComplete="current-password"
                    />


                    <div
                        className="
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >

                        <PasswordField
                            label="New Password"
                            value={
                                newPassword
                            }
                            onChange={
                                setNewPassword
                            }
                            show={
                                showPasswords
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
                            show={
                                showPasswords
                            }
                            autoComplete="new-password"
                        />

                    </div>

                </div>


                <div
                    className="
                        mt-4
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <label
                        className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
                        "
                    >

                        <input
                            type="checkbox"
                            checked={
                                showPasswords
                            }
                            onChange={(
                                event
                            ) =>
                                setShowPasswords(
                                    event.target.checked
                                )
                            }
                            className="
                                h-4
                                w-4
                                accent-[#1769e8]
                            "
                        />


                        <span
                            className="
                                text-[8px]
                                font-medium
                                text-[#64748b]
                            "
                        >
                            Show passwords
                        </span>

                    </label>


                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="
                            min-h-[40px]
                            rounded-lg
                            bg-[#1769e8]
                            px-6
                            text-[9px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#0b5ed7]
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {loading
                            ? "Updating..."
                            : "Update Password"}
                    </button>

                </div>


                <div
                    className="
                        mt-5
                        rounded-lg
                        border
                        border-[#e2e8f0]
                        bg-[#f8fafc]
                        px-4
                        py-3
                    "
                >

                    <p
                        className="
                            text-[8px]
                            font-semibold
                            text-[#52627a]
                        "
                    >
                        Password requirements
                    </p>


                    <p
                        className="
                            mt-1
                            text-[8px]
                            leading-4
                            text-[#64748b]
                        "
                    >
                        Use at least 12 characters and choose a password
                        different from your current password.
                    </p>

                </div>

            </div>
        </form>
    );
}


function PasswordField({
    label,
    value,
    onChange,
    show,
    autoComplete,
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
                    text-[9px]
                    font-semibold
                    text-[#334155]
                "
            >
                {label}
            </span>


            <input
                type={
                    show
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
                autoComplete={
                    autoComplete
                }
                className="
                    min-h-[42px]
                    w-full
                    rounded-lg
                    border
                    border-[#cbd5e1]
                    bg-white
                    px-3
                    text-[10px]
                    text-[#172033]
                    outline-none
                    transition
                    focus:border-[#3b82f6]
                    focus:ring-2
                    focus:ring-blue-100
                "
            />

        </label>
    );
}


export default ChangePasswordForm;