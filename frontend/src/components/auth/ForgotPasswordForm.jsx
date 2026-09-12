import {
    useState,
} from "react";

import api from "../../services/api";

import FeedbackAlert from "../ui/FeedbackAlert";


function ForgotPasswordForm({
    onBackToLogin,
}) {
    const [
        username,
        setUsername,
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
        success,
        setSuccess,
    ] = useState("");


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


            const cleanUsername =
                username.trim();


            if (
                !cleanUsername
            ) {
                setError(
                    "Please enter your username."
                );

                return;
            }


            try {
                setLoading(true);


                const response =
                    await api.post(
                        "/auth/forgot-password",
                        {
                            username:
                                cleanUsername,
                        }
                    );


                setSuccess(
                    response.data
                        ?.message ||
                    "Your password reset request has been submitted."
                );


                setUsername("");

            } catch (error) {
                console.error(
                    "Forgot password error:",
                    error
                );


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to submit password reset request."
                );

            } finally {
                setLoading(false);
            }
        };


    // ======================================================
    // UI
    // ======================================================

    return (
        <div
            className="
                w-full
                max-w-md
            "
        >
            <button
                type="button"
                onClick={
                    onBackToLogin
                }
                disabled={
                    loading
                }
                className="
                    inline-flex
                    items-center
                    gap-2
                    text-[9px]
                    font-medium
                    text-slate-500
                    transition
                    hover:text-blue-600
                "
            >
                ← Back to Login
            </button>


            <div
                className="
                    mt-6
                "
            >
                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
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
                            cx="8"
                            cy="12"
                            r="4"
                        />

                        <path d="M12 12h9" />
                        <path d="M17 12v3" />
                        <path d="M20 12v2" />
                    </svg>
                </div>


                <h1
                    className="
                        mt-4
                        text-[22px]
                        font-semibold
                        text-slate-800
                    "
                >
                    Forgot Password
                </h1>


                <p
                    className="
                        mt-2
                        text-[9px]
                        leading-5
                        text-slate-500
                    "
                >
                    Enter your username to send a password reset request to the Administrator.
                </p>
            </div>


            <form
                onSubmit={
                    handleSubmit
                }
                className="
                    mt-6
                    space-y-4
                "
            >
                <FeedbackAlert
                    type="success"
                    message={success}
                    onClose={() =>
                        setSuccess("")
                    }
                />


                <FeedbackAlert
                    type="error"
                    message={error}
                    onClose={() =>
                        setError("")
                    }
                />


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
                            font-medium
                            text-slate-600
                        "
                    >
                        Username
                    </span>


                    <input
                        type="text"
                        value={username}
                        onChange={(
                            event
                        ) => {
                            setUsername(
                                event.target.value
                            );

                            setError("");
                            setSuccess("");
                        }}
                        disabled={
                            loading
                        }
                        autoComplete="username"
                        placeholder="Enter your username"
                        className="
                            h-11
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-3
                            text-[10px]
                            text-slate-700
                            outline-none
                            placeholder:text-slate-400
                            focus:border-blue-500
                            disabled:bg-slate-50
                        "
                    />
                </label>


                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className="
                        h-11
                        w-full
                        rounded-lg
                        bg-blue-600
                        px-4
                        text-[10px]
                        font-medium
                        text-white
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {loading
                        ? "Submitting..."
                        : "Submit Reset Request"}
                </button>
            </form>


            <div
                className="
                    mt-5
                    rounded-lg
                    bg-slate-50
                    p-3
                "
            >
                <p
                    className="
                        text-[8px]
                        leading-4
                        text-slate-500
                    "
                >
                    Reset Password will become available to the Administrator only after your request is submitted.
                </p>
            </div>
        </div>
    );
}


export default ForgotPasswordForm;