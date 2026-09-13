import {
    useState,
} from "react";

import api from "../../services/api";

import FeedbackAlert from "../ui/FeedbackAlert";


function ForgotPasswordForm({
    onBack,
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
        success,
        setSuccess,
    ] = useState("");


    const [
        error,
        setError,
    ] = useState("");


    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            setError("");
            setSuccess("");


            if (
                !username.trim()
            ) {
                setError(
                    "Please enter your username."
                );

                return;
            }


            try {
                setLoading(
                    true
                );


                /*
                 * Use the password-reset request route already
                 * provided by the backend. The Administrator
                 * performs the actual account password reset.
                 */
                const response =
                    await api.post(
                        "/auth/forgot-password",
                        {
                            username:
                                username.trim(),
                        }
                    );


                setSuccess(
                    response.data
                        ?.message ||
                    "Your password reset request has been submitted."
                );

            } catch (
            error
            ) {
                console.error(
                    "Forgot password error:",
                    error
                );


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to submit your password reset request."
                );

            } finally {
                setLoading(
                    false
                );
            }
        };


    return (
        <div
            className="
                rounded-2xl
                border
                border-[#dbe4ef]
                bg-white
                p-6
                shadow-[0_12px_40px_rgba(15,23,42,0.08)]
                sm:p-8
            "
        >
            <button
                type="button"
                onClick={
                    onBack
                }
                className="
                    mb-5
                    inline-flex
                    items-center
                    gap-2
                    text-[9px]
                    font-semibold
                    text-[#52627a]
                    transition
                    hover:text-[#1769e8]
                "
            >
                ← Back to login
            </button>


            <div>
                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-[#1769e8]
                    "
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="
                            h-5
                            w-5
                        "
                    >
                        <rect
                            x="5"
                            y="10"
                            width="14"
                            height="10"
                            rx="2"
                        />

                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />

                        <path d="M12 14v2" />
                    </svg>
                </div>


                <h2
                    className="
                        mt-4
                        text-[23px]
                        font-bold
                        tracking-[-0.03em]
                        text-[#172033]
                    "
                >
                    Forgot password?
                </h2>


                <p
                    className="
                        mt-2
                        text-[9px]
                        leading-5
                        text-[#64748b]
                    "
                >
                    Enter your username to request a password reset.
                    Your Administrator can then issue new login
                    credentials.
                </p>
            </div>


            <div
                className="
                    mt-5
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


            <form
                onSubmit={
                    handleSubmit
                }
                className="
                    mt-5
                "
            >
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
                        Username
                    </span>


                    <input
                        type="text"
                        value={
                            username
                        }
                        onChange={(
                            event
                        ) =>
                            setUsername(
                                event.target.value
                            )
                        }
                        placeholder="Enter your username"
                        className="
                            min-h-[44px]
                            w-full
                            rounded-lg
                            border
                            border-[#cbd5e1]
                            bg-white
                            px-3
                            text-[10px]
                            text-[#172033]
                            outline-none
                            placeholder:text-[#94a3b8]
                            focus:border-[#3b82f6]
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    />
                </label>


                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className="
                        mt-4
                        min-h-[44px]
                        w-full
                        rounded-lg
                        bg-gradient-to-r
                        from-[#073763]
                        to-[#1769aa]
                        px-5
                        text-[10px]
                        font-semibold
                        text-white
                        transition
                        hover:opacity-95
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >
                    {loading
                        ? "Submitting..."
                        : "Request Password Reset"}
                </button>
            </form>
        </div>
    );
}


export default ForgotPasswordForm;