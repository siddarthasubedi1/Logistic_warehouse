import {
    useState,
} from "react";

import api from "../../services/api";


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
                setLoading(
                    true
                );


                const response =
                    await api.post(
                        "/auth/forgot-password",
                        {
                            username:
                                cleanUsername,
                        }
                    );


                setSuccess(
                    response.data?.message ||
                    "If this username belongs to an active Trainer or Trainee account, a password reset request has been sent to the administrator."
                );


                setUsername(
                    ""
                );

            } catch (error) {
                console.error(
                    "Forgot password error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to submit password reset request."
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
                w-full
            "
        >
            <div
                className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-blue-100
                    bg-blue-50
                    text-blue-600
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
                        x="6"
                        y="10"
                        width="12"
                        height="10"
                        rx="2"
                    />

                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
            </div>


            <p
                className="
                    mt-6
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-blue-600
                "
            >
                Account Recovery
            </p>


            <h1
                className="
                    mt-3
                    text-[29px]
                    font-bold
                    tracking-[-0.025em]
                    text-[#111827]
                "
            >
                Forgot Password?
            </h1>


            <p
                className="
                    mt-3
                    max-w-[390px]
                    text-[13px]
                    leading-6
                    text-slate-600
                "
            >
                Enter your username and we will send a password reset request to the administrator.
            </p>


            <div
                className="
                    mt-6
                    rounded-xl
                    border
                    border-blue-200
                    bg-blue-50/70
                    p-4
                "
            >
                <div
                    className="
                        flex
                        gap-3
                    "
                >
                    <div
                        className="
                            mt-0.5
                            shrink-0
                            text-blue-600
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
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />

                            <path d="M12 11v5" />

                            <path d="M12 8h.01" />
                        </svg>
                    </div>


                    <p
                        className="
                            text-[11px]
                            leading-5
                            text-slate-700
                        "
                    >
                        The administrator will generate a new temporary password. Your username will remain the same.
                    </p>
                </div>
            </div>


            {success && (
                <div
                    className="
                        mt-5
                        rounded-xl
                        border
                        border-emerald-300
                        bg-emerald-50
                        p-4
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
                                mt-0.5
                                flex
                                h-5
                                w-5
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-emerald-500
                                text-[10px]
                                font-bold
                                text-emerald-600
                            "
                        >
                            ✓
                        </div>


                        <div>
                            <p
                                className="
                                    text-[11px]
                                    font-bold
                                    text-emerald-700
                                "
                            >
                                Request Submitted
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[10px]
                                    leading-5
                                    text-emerald-700
                                "
                            >
                                {success}
                            </p>
                        </div>
                    </div>
                </div>
            )}


            {error && (
                <div
                    className="
                        mt-5
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-[11px]
                        font-medium
                        text-red-700
                    "
                >
                    {error}
                </div>
            )}


            <form
                onSubmit={
                    handleSubmit
                }
                className="
                    mt-7
                "
            >
                <label>
                    <span
                        className="
                            mb-2
                            block
                            text-[11px]
                            font-semibold
                            text-[#172033]
                        "
                    >
                        Username
                    </span>


                    <div
                        className="
                            relative
                        "
                    >
                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-y-0
                                left-0
                                flex
                                w-11
                                items-center
                                justify-center
                                text-[#8da2bd]
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="
                                    h-4
                                    w-4
                                "
                            >
                                <circle
                                    cx="12"
                                    cy="8"
                                    r="3"
                                />

                                <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                            </svg>
                        </div>


                        <input
                            type="text"
                            value={
                                username
                            }
                            onChange={(
                                event
                            ) => {
                                setUsername(
                                    event.target.value
                                );

                                setError(
                                    ""
                                );
                            }}
                            disabled={
                                loading
                            }
                            autoComplete="username"
                            placeholder="Enter your username"
                            className="
                                h-[49px]
                                w-full
                                rounded-lg
                                border
                                border-[#d4deeb]
                                bg-white
                                pl-11
                                pr-4
                                text-[14px]
                                text-[#172033]
                                outline-none
                                transition
                                placeholder:text-[#9aabc1]
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />
                    </div>
                </label>


                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className="
                        mt-5
                        flex
                        h-[49px]
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-[#1769e8]
                        px-5
                        text-[14px]
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#0b5ed7]
                        disabled:opacity-50
                    "
                >
                    <span>
                        →
                    </span>

                    <span>
                        {loading
                            ? "Submitting Request..."
                            : "Request Password Reset"}
                    </span>
                </button>
            </form>


            <div
                className="
                    mt-7
                    border-t
                    border-slate-100
                    pt-6
                    text-center
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
                        text-[13px]
                        font-medium
                        text-[#1769e8]
                        transition
                        hover:text-[#0b5ed7]
                    "
                >
                    <span>
                        ‹
                    </span>

                    <span>
                        Back to Login
                    </span>
                </button>
            </div>
        </div>
    );
}


export default ForgotPasswordForm;