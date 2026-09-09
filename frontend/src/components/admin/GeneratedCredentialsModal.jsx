function GeneratedCredentialsModal({
    open = false,
    credentials = null,
    user = null,
    onClose,
}) {

    // ======================================================
    // DO NOT SHOW UNTIL CREDENTIALS ARE GENERATED
    // ======================================================

    if (
        !open ||
        !credentials
    ) {
        return null;
    }


    // ======================================================
    // CREDENTIAL INFORMATION
    // ======================================================

    const username =
        credentials.username ||
        "";


    const password =
        credentials.password ||
        "";


    const email =
        user?.email ||
        "";


    const fullName =
        [
            user?.firstName,
            user?.lastName,
        ]
            .filter(Boolean)
            .join(" ")
            .trim();


    // ======================================================
    // SEND RESET CREDENTIALS BY GMAIL
    // ======================================================

    const handleSendEmail =
        () => {

            if (
                !email ||
                !username ||
                !password
            ) {
                return;
            }


            const subject =
                "UK LogiWare - Password Reset Credentials";


            const body =
                `Hello ${fullName || username},

Your UK LogiWare password has been reset successfully.

Username: ${username}
Temporary Password: ${password}

Login here:
http://localhost:5173/login

For security, please change your temporary password after logging in.

You must create a new password before accessing your account.

Regards,
UK LogiWare Administrator`;


            const gmailUrl =
                "https://mail.google.com/mail/?view=cm&fs=1" +
                `&to=${encodeURIComponent(
                    email
                )}` +
                `&su=${encodeURIComponent(
                    subject
                )}` +
                `&body=${encodeURIComponent(
                    body
                )}`;


            window.open(
                gmailUrl,
                "_blank",
                "noopener,noreferrer"
            );
        };


    // ======================================================
    // UI
    // ======================================================

    return (
        <div
            className="
                m-5
                rounded-xl
                border
                border-emerald-300
                bg-emerald-50
                p-5
            "
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div>

                <p
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-emerald-600
                    "
                >
                    Password Reset
                </p>


                <h3
                    className="
                        mt-2
                        text-lg
                        font-bold
                        text-slate-900
                    "
                >
                    Credentials Generated Successfully
                </h3>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-600
                    "
                >
                    These credentials are shown only once.
                </p>

            </div>


            {/* ================================================= */}
            {/* USER DETAILS */}
            {/* ================================================= */}

            {user && (
                <div
                    className="
                        mt-5
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                        rounded-xl
                        border
                        border-emerald-200
                        bg-white/70
                        px-4
                        py-3
                    "
                >

                    <div>

                        <p
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-400
                            "
                        >
                            Account
                        </p>


                        <p
                            className="
                                mt-1
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            {fullName ||
                                username}
                        </p>


                        {email && (
                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {email}
                            </p>
                        )}

                    </div>


                    {user?.role && (
                        <span
                            className="
                                rounded-full
                                bg-blue-100
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                capitalize
                                text-blue-700
                            "
                        >
                            {user.role}
                        </span>
                    )}

                </div>
            )}


            {/* ================================================= */}
            {/* CREDENTIALS */}
            {/* ================================================= */}

            <div
                className="
                    mt-5
                    grid
                    gap-4
                    md:grid-cols-2
                "
            >

                {/* USERNAME */}

                <div
                    className="
                        rounded-xl
                        bg-white
                        p-4
                    "
                >

                    <p
                        className="
                            text-xs
                            font-semibold
                            text-slate-400
                        "
                    >
                        Username
                    </p>


                    <p
                        className="
                            mt-2
                            break-all
                            font-mono
                            text-sm
                            font-bold
                            text-slate-900
                        "
                    >
                        {username}
                    </p>

                </div>


                {/* TEMPORARY PASSWORD */}

                <div
                    className="
                        rounded-xl
                        bg-white
                        p-4
                    "
                >

                    <p
                        className="
                            text-xs
                            font-semibold
                            text-slate-400
                        "
                    >
                        Temporary Password
                    </p>


                    <p
                        className="
                            mt-2
                            break-all
                            font-mono
                            text-sm
                            font-bold
                            text-slate-900
                        "
                    >
                        {password}
                    </p>

                </div>

            </div>


            {/* ================================================= */}
            {/* SECURITY INFORMATION */}
            {/* ================================================= */}

            <div
                className="
                    mt-5
                    rounded-xl
                    border
                    border-amber-200
                    bg-amber-50
                    px-4
                    py-3
                "
            >

                <p
                    className="
                        text-xs
                        leading-5
                        text-amber-700
                    "
                >
                    This is a temporary password.
                    The Trainer or Trainee must
                    change it after logging in before
                    accessing the dashboard.
                </p>

            </div>


            {/* ================================================= */}
            {/* BUTTONS */}
            {/* ================================================= */}

            <div
                className="
                    mt-5
                    flex
                    flex-wrap
                    justify-end
                    gap-3
                "
            >

                {/* SEND GMAIL */}

                <button
                    type="button"
                    onClick={
                        handleSendEmail
                    }
                    disabled={
                        !email
                    }
                    className="
                        rounded-xl
                        border
                        border-emerald-300
                        bg-white
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-emerald-700
                        transition
                        hover:bg-emerald-100
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    Send Credentials by Gmail
                </button>


                {/* DONE */}

                <button
                    type="button"
                    onClick={
                        onClose
                    }
                    className="
                        rounded-xl
                        bg-emerald-600
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-emerald-700
                    "
                >
                    Done
                </button>

            </div>

        </div>
    );
}


export default GeneratedCredentialsModal;