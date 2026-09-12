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
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
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


    // ======================================================
    // CHANGE
    // ======================================================

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


        setError("");
        setSuccess("");
    };


    // ======================================================
    // SUBMIT
    // ======================================================

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
                setLoading(false);
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
            <div
                className="
                    border-b
                    border-slate-100
                    px-4
                    py-4
                    sm:px-5
                "
            >
                <h2
                    className="
                        text-[11px]
                        font-semibold
                        text-slate-800
                    "
                >
                    Change Password
                </h2>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-400
                    "
                >
                    Change your account password.
                </p>
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
                    message={success}
                />


                <FeedbackAlert
                    type="error"
                    message={error}
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


                <div
                    className="
                        grid
                        gap-4
                        md:grid-cols-2
                    "
                >
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
                            placeholder="Enter new password"
                        />
                    </FormField>


                    <FormField
                        label="Confirm Password"
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
                </div>


                {/* RULE */}

                <div
                    className="
                        rounded-lg
                        bg-slate-50
                        p-3
                    "
                >
                    <p
                        className="
                            text-[8px]
                            text-slate-500
                        "
                    >
                        New password must contain at least 12 characters and must be different from your current password.
                    </p>
                </div>


                <div
                    className="
                        flex
                        justify-end
                        border-t
                        border-slate-100
                        pt-4
                    "
                >
                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="
                            w-full
                            rounded-lg
                            bg-blue-600
                            px-5
                            py-2.5
                            text-[9px]
                            font-medium
                            text-white
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            sm:w-auto
                        "
                    >
                        {loading
                            ? "Changing..."
                            : "Change Password"}
                    </button>
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
                    font-medium
                    text-slate-500
                "
            >
                {label}
            </span>

            {children}
        </label>
    );
}


export default ChangePasswordForm;