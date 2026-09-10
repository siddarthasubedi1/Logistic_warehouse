import {
    useState,
} from "react";

import api from "../../services/api";

import FeedbackAlert from "../ui/FeedbackAlert";


function ForgotPasswordForm({
    onBackToLogin,
}) {
    // ======================================================
    // STATE
    // ======================================================

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
    // SUBMIT RESET REQUEST
    // ======================================================

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
                    response.data
                        ?.message ||
                    "Your password reset request has been submitted."
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
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to submit password reset request."
                );

            } finally {
                setLoading(
                    false
                );
            }
        };


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <section
            className="
                relative
                flex
                min-h-[620px]
                items-center
                justify-center
                overflow-hidden
                bg-white
                px-5
                py-10
                sm:px-8
                lg:min-h-[680px]
                lg:px-12
                xl:px-14
            "
        >

            {/* ================================================= */}
            {/* BACKGROUND */}
            {/* ================================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-64
                    w-64
                    rounded-full
                    bg-blue-50
                    blur-2xl
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -left-24
                    h-64
                    w-64
                    rounded-full
                    bg-emerald-50
                    blur-2xl
                "
            />


            <div
                className="
                    relative
                    z-10
                    w-full
                    max-w-[430px]
                "
            >

                {/* ================================================= */}
                {/* MOBILE BRAND */}
                {/* ================================================= */}

                <div
                    className="
                        mb-8
                        lg:hidden
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#073763]
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
                                <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />
                            </svg>

                        </div>


                        <div>

                            <p
                                className="
                                    text-lg
                                    font-bold
                                    text-[#073763]
                                "
                            >
                                UK Logi
                                <span className="text-blue-600">
                                    Ware
                                </span>
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-400
                                "
                            >
                                Workplace Safety Training
                            </p>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* CARD */}
                {/* ================================================= */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-lg
                        shadow-slate-200/50
                        sm:p-7
                    "
                >

                    {/* ================================================= */}
                    {/* ICON */}
                    {/* ================================================= */}

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-blue-50
                            text-blue-600
                            ring-1
                            ring-blue-100
                        "
                    >

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-6 w-6"
                        >
                            <path d="M7 10V8a5 5 0 0 1 10 0v2" />

                            <rect
                                x="5"
                                y="10"
                                width="14"
                                height="10"
                                rx="2"
                            />

                            <path d="M12 14v2.5" />
                        </svg>

                    </div>


                    {/* ================================================= */}
                    {/* HEADING */}
                    {/* ================================================= */}

                    <div className="mt-5">

                        <p
                            className="
                                text-[9px]
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
                                mt-2
                                text-2xl
                                font-bold
                                text-[#172033]
                            "
                        >
                            Forgot Password?
                        </h1>


                        <p
                            className="
                                mt-2
                                text-[11px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Enter your username and the system will send
                            a password-reset request to the Administrator.
                        </p>

                    </div>


                    {/* ================================================= */}
                    {/* PROCESS INFO */}
                    {/* ================================================= */}

                    <div
                        className="
                            mt-5
                            rounded-xl
                            border
                            border-blue-100
                            bg-blue-50/70
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
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-white
                                    text-blue-600
                                    shadow-sm
                                "
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
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


                            <div>

                                <p
                                    className="
                                        text-[9px]
                                        font-bold
                                        text-blue-800
                                    "
                                >
                                    How password reset works
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        leading-5
                                        text-blue-700
                                    "
                                >
                                    The Administrator will see your
                                    pending request and can generate a new
                                    temporary password. Your username will
                                    remain unchanged.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* FEEDBACK */}
                    {/* ================================================= */}

                    <div className="mt-5 space-y-3">

                        <FeedbackAlert
                            type="success"
                            message={
                                success
                            }
                            onClose={() =>
                                setSuccess(
                                    ""
                                )
                            }
                        />


                        <FeedbackAlert
                            type="error"
                            message={
                                error
                            }
                            onClose={() =>
                                setError(
                                    ""
                                )
                            }
                        />

                    </div>


                    {/* ================================================= */}
                    {/* FORM */}
                    {/* ================================================= */}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="
                            mt-6
                        "
                    >

                        <label
                            htmlFor="resetUsername"
                            className="
                                mb-2
                                block
                                text-[10px]
                                font-semibold
                                text-slate-700
                            "
                        >
                            Username
                        </label>


                        <div className="relative">

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-y-0
                                    left-0
                                    flex
                                    items-center
                                    pl-4
                                    text-slate-400
                                "
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-[18px] w-[18px]"
                                >
                                    <circle
                                        cx="12"
                                        cy="8"
                                        r="4"
                                    />

                                    <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
                                </svg>

                            </div>


                            <input
                                id="resetUsername"
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


                                    setSuccess(
                                        ""
                                    );
                                }}
                                placeholder="Enter your username"
                                autoComplete="username"
                                disabled={
                                    loading
                                }
                                className="
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-300
                                    bg-white
                                    pl-11
                                    pr-4
                                    text-[11px]
                                    text-slate-800
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                    disabled:cursor-not-allowed
                                    disabled:bg-slate-50
                                "
                            />

                        </div>


                        {/* ================================================= */}
                        {/* SUBMIT */}
                        {/* ================================================= */}

                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="
                                mt-5
                                flex
                                min-h-[46px]
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-blue-600
                                px-4
                                py-3
                                text-[10px]
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-blue-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-300
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {loading ? (
                                <>
                                    <span
                                        className="
                                            h-4
                                            w-4
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-white/40
                                            border-t-white
                                        "
                                    />

                                    Submitting Request...
                                </>
                            ) : (
                                <>
                                    Request Password Reset

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-4 w-4"
                                    >
                                        <path d="M4 12h15" />

                                        <path d="m14 7 5 5-5 5" />
                                    </svg>
                                </>
                            )}

                        </button>

                    </form>


                    {/* ================================================= */}
                    {/* BACK TO LOGIN */}
                    {/* ================================================= */}

                    <div
                        className="
                            mt-6
                            border-t
                            border-slate-100
                            pt-5
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
                                justify-center
                                gap-2
                                rounded-lg
                                px-3
                                py-2
                                text-[10px]
                                font-semibold
                                text-blue-600
                                transition
                                hover:bg-blue-50
                                hover:text-blue-700
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
                                <path d="m15 18-6-6 6-6" />
                            </svg>

                            Back to Login

                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}


export default ForgotPasswordForm;