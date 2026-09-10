function GeneratedCredentialsModal({
    open = false,
    credentials = null,
    user = null,
    onClose,
}) {
    // ======================================================
    // HIDDEN
    // ======================================================

    if (
        !open ||
        !credentials
    ) {
        return null;
    }


    // ======================================================
    // CREDENTIAL DATA
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
            .filter(
                Boolean
            )
            .join(" ")
            .trim();


    // ======================================================
    // OPEN GMAIL
    // ======================================================

    const handleSendEmail = () => {
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

For security, this temporary password must be changed after logging in.

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
    // COPY
    // ======================================================

    const copyText = async (
        value
    ) => {
        if (!value) {
            return;
        }


        try {
            await navigator
                .clipboard
                .writeText(
                    value
                );

        } catch (error) {
            console.error(
                "Copy credential error:",
                error
            );
        }
    };


    // ======================================================
    // UI
    // ======================================================

    return (
        <div
            className="
                m-4
                overflow-hidden
                rounded-2xl
                border
                border-emerald-300
                bg-emerald-50
                shadow-sm
                sm:m-5
            "
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    border-b
                    border-emerald-200
                    bg-gradient-to-r
                    from-emerald-50
                    via-white
                    to-emerald-50
                    p-5
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
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-emerald-100
                            text-emerald-700
                        "
                    >

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />

                            <path d="m8 12 2.5 2.5L16 9" />
                        </svg>

                    </div>


                    <div>

                        <p
                            className="
                                text-[8px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-emerald-600
                            "
                        >
                            Password Reset Complete
                        </p>


                        <h3
                            className="
                                mt-1
                                text-base
                                font-bold
                                text-slate-900
                                sm:text-lg
                            "
                        >
                            Credentials Generated Successfully
                        </h3>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Save or send these credentials now. The
                            temporary password is intended to be shown
                            only during this reset flow.
                        </p>

                    </div>

                </div>

            </div>


            <div className="p-4 sm:p-5">

                {/* ================================================= */}
                {/* USER */}
                {/* ================================================= */}

                {user && (
                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            rounded-xl
                            border
                            border-emerald-200
                            bg-white
                            p-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <div className="min-w-0">

                            <p
                                className="
                                    text-[8px]
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
                                    truncate
                                    text-[11px]
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
                                        break-all
                                        text-[9px]
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
                                    w-fit
                                    rounded-full
                                    bg-blue-50
                                    px-3
                                    py-1.5
                                    text-[9px]
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
                        mt-4
                        grid
                        gap-3
                        md:grid-cols-2
                    "
                >

                    <CredentialBox
                        label="Username"
                        value={
                            username
                        }
                        onCopy={() =>
                            copyText(
                                username
                            )
                        }
                    />


                    <CredentialBox
                        label="Temporary Password"
                        value={
                            password
                        }
                        onCopy={() =>
                            copyText(
                                password
                            )
                        }
                        warning
                    />

                </div>


                {/* ================================================= */}
                {/* IMPORTANT */}
                {/* ================================================= */}

                <div
                    className="
                        mt-4
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-amber-200
                        bg-amber-50
                        p-4
                    "
                >

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="
                            mt-0.5
                            h-4
                            w-4
                            shrink-0
                            text-amber-600
                        "
                    >
                        <path d="M12 3 2.5 20h19L12 3Z" />

                        <path d="M12 9v5" />

                        <path d="M12 17h.01" />
                    </svg>


                    <div>

                        <p
                            className="
                                text-[9px]
                                font-bold
                                text-amber-800
                            "
                        >
                            Temporary password
                        </p>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                leading-5
                                text-amber-700
                            "
                        >
                            The Trainer or Trainee must log in with this
                            temporary password and create a new password
                            before entering the dashboard.
                        </p>

                    </div>

                </div>


                {/* ================================================= */}
                {/* ACTIONS */}
                {/* ================================================= */}

                <div
                    className="
                        mt-5
                        flex
                        flex-col
                        gap-2
                        sm:flex-row
                        sm:justify-end
                    "
                >

                    <button
                        type="button"
                        onClick={
                            handleSendEmail
                        }
                        disabled={
                            !email ||
                            !username ||
                            !password
                        }
                        className="
                            inline-flex
                            min-h-[42px]
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-emerald-300
                            bg-white
                            px-4
                            py-2.5
                            text-[10px]
                            font-semibold
                            text-emerald-700
                            transition
                            hover:bg-emerald-100
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            sm:w-auto
                        "
                    >

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                        >
                            <path d="M3 6h18v12H3z" />

                            <path d="m3 7 9 6 9-6" />
                        </svg>

                        Send Credentials by Gmail
                    </button>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="
                            min-h-[42px]
                            w-full
                            rounded-xl
                            bg-emerald-600
                            px-5
                            py-2.5
                            text-[10px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-emerald-700
                            sm:w-auto
                        "
                    >
                        Done
                    </button>

                </div>

            </div>

        </div>
    );
}


// ======================================================
// CREDENTIAL BOX
// ======================================================

function CredentialBox({
    label,
    value,
    onCopy,
    warning = false,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-emerald-200
                bg-white
                p-4
            "
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >

                <p
                    className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                    "
                >
                    {label}
                </p>


                <button
                    type="button"
                    onClick={
                        onCopy
                    }
                    className="
                        rounded-md
                        bg-slate-100
                        px-2
                        py-1
                        text-[8px]
                        font-semibold
                        text-slate-600
                        transition
                        hover:bg-slate-200
                    "
                >
                    Copy
                </button>

            </div>


            <p
                className={`
                    mt-3
                    break-all
                    rounded-lg
                    px-3
                    py-2.5
                    font-mono
                    text-[11px]
                    font-bold

                    ${warning
                        ? "bg-amber-50 text-amber-800"
                        : "bg-slate-50 text-slate-900"
                    }
                `}
            >
                {value ||
                    "—"}
            </p>

        </div>
    );
}


export default GeneratedCredentialsModal;