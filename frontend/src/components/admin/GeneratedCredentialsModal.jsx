import {
    useEffect,
    useState,
} from "react";


function GeneratedCredentialsModal({
    open = false,
    credentials = null,
    user = null,
    onClose,
}) {
    const [
        copied,
        setCopied,
    ] = useState("");


    useEffect(() => {
        if (!open) {
            setCopied("");
        }
    }, [
        open,
    ]);


    if (
        !open ||
        !credentials
    ) {
        return null;
    }


    const username =
        credentials.username ||
        "";

    const password =
        credentials.password ||
        "";

    const fullName =
        [
            user?.firstName,
            user?.lastName,
        ]
            .filter(Boolean)
            .join(" ")
            .trim();

    const email =
        user?.email ||
        credentials?.email ||
        "";

    const role =
        user?.role ||
        "";


    const copyValue =
        async (
            type,
            value
        ) => {
            if (!value) {
                return;
            }

            try {
                await navigator.clipboard.writeText(
                    value
                );

                setCopied(
                    type
                );

                window.setTimeout(
                    () => {
                        setCopied("");
                    },
                    1500
                );

            } catch (
            error
            ) {
                console.error(
                    "Copy credentials error:",
                    error
                );
            }
        };


    const copyAll =
        async () => {
            if (
                !username ||
                !password
            ) {
                return;
            }

            try {
                await navigator.clipboard.writeText(
                    `Username: ${username}\nTemporary Password: ${password}`
                );

                setCopied(
                    "all"
                );

                window.setTimeout(
                    () => {
                        setCopied("");
                    },
                    1500
                );

            } catch (
            error
            ) {
                console.error(
                    "Copy all credentials error:",
                    error
                );
            }
        };


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
                "UK LogiWare - Temporary Login Credentials";


            const body =
                `Hello ${fullName || username},

Your UK LogiWare temporary login credentials are:

Username: ${username}
Temporary Password: ${password}

Please sign in using these credentials.

For security, you will be required to create a new password after your first login before accessing your account.

UK LogiWare Safety Training`;


            const gmailUrl =
                `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    email
                )}&su=${encodeURIComponent(
                    subject
                )}&body=${encodeURIComponent(
                    body
                )}`;


            window.open(
                gmailUrl,
                "_blank",
                "noopener,noreferrer"
            );
        };


    return (
        <div
            className="
                fixed
                inset-0
                z-[500]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-slate-950/55
                p-3
                backdrop-blur-[2px]
                sm:p-5
            "
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="credential-modal-title"
                className="
                    my-auto
                    w-full
                    max-w-[575px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#dbe4ef]
                    bg-white
                    shadow-[0_24px_70px_rgba(15,23,42,0.28)]
                "
            >
                {/* =============================================
                    SUCCESS HEADER
                ============================================== */}

                <div
                    className="
                        relative
                        overflow-hidden
                        bg-gradient-to-r
                        from-[#073763]
                        via-[#0b4f87]
                        to-[#1769aa]
                        px-5
                        py-5
                        text-white
                        sm:px-6
                    "
                >
                    <div
                        className="
                            absolute
                            -right-12
                            -top-16
                            h-40
                            w-40
                            rounded-full
                            bg-white/10
                        "
                    />

                    <div
                        className="
                            relative
                            z-10
                            flex
                            items-start
                            justify-between
                            gap-4
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
                                    rounded-full
                                    bg-white/15
                                    text-white
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
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

                                    <path d="m8 12 2.5 2.5L16 9" />
                                </svg>
                            </div>


                            <div>
                                <p
                                    className="
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.12em]
                                        text-blue-100
                                    "
                                >
                                    Account Created
                                </p>

                                <h2
                                    id="credential-modal-title"
                                    className="
                                        mt-1
                                        text-[16px]
                                        font-bold
                                        text-white
                                    "
                                >
                                    Credentials Generated Successfully
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        leading-4
                                        text-blue-100
                                    "
                                >
                                    Save or send these credentials now.
                                    The temporary password is displayed
                                    only at this stage.
                                </p>
                            </div>
                        </div>


                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            aria-label="Close credentials modal"
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-white/10
                                text-[18px]
                                text-white
                                transition
                                hover:bg-white/20
                            "
                        >
                            ×
                        </button>
                    </div>
                </div>


                {/* =============================================
                    BODY
                ============================================== */}

                <div
                    className="
                        p-5
                        sm:p-6
                    "
                >
                    {/* ACCOUNT */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-[#dbe4ef]
                            bg-[#f8fafc]
                            p-4
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >
                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
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
                                        rounded-full
                                        bg-[#1769e8]
                                        text-[11px]
                                        font-bold
                                        text-white
                                    "
                                >
                                    {(fullName ||
                                        username)
                                        .charAt(
                                            0
                                        )
                                        .toUpperCase()}
                                </div>


                                <div
                                    className="
                                        min-w-0
                                    "
                                >
                                    <p
                                        className="
                                            truncate
                                            text-[11px]
                                            font-bold
                                            text-[#172033]
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
                                                text-[8px]
                                                text-[#64748b]
                                            "
                                        >
                                            {email}
                                        </p>
                                    )}
                                </div>
                            </div>


                            {role && (
                                <span
                                    className="
                                        self-start
                                        rounded-full
                                        bg-blue-50
                                        px-3
                                        py-1.5
                                        text-[8px]
                                        font-semibold
                                        capitalize
                                        text-blue-600
                                        sm:self-auto
                                    "
                                >
                                    {role}
                                </span>
                            )}
                        </div>
                    </div>


                    {/* CREDENTIALS */}

                    <div
                        className="
                            mt-4
                            grid
                            gap-3
                            sm:grid-cols-2
                        "
                    >
                        <CredentialItem
                            label="Username"
                            value={
                                username
                            }
                            copied={
                                copied ===
                                "username"
                            }
                            onCopy={() =>
                                copyValue(
                                    "username",
                                    username
                                )
                            }
                        />


                        <CredentialItem
                            label="Temporary Password"
                            value={
                                password
                            }
                            copied={
                                copied ===
                                "password"
                            }
                            onCopy={() =>
                                copyValue(
                                    "password",
                                    password
                                )
                            }
                        />
                    </div>


                    {/* COPY ALL */}

                    <button
                        type="button"
                        onClick={
                            copyAll
                        }
                        className="
                            mt-3
                            flex
                            min-h-[38px]
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-[#dbe4ef]
                            bg-white
                            px-4
                            text-[9px]
                            font-semibold
                            text-[#52627a]
                            transition
                            hover:bg-[#f8fafc]
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
                            <rect
                                x="8"
                                y="8"
                                width="11"
                                height="11"
                                rx="2"
                            />

                            <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                        </svg>

                        {copied ===
                            "all"
                            ? "Credentials Copied"
                            : "Copy Both Credentials"}
                    </button>


                    {/* WARNING */}

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
                            px-4
                            py-3
                        "
                    >
                        <div
                            className="
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-amber-100
                                text-[11px]
                                font-bold
                                text-amber-700
                            "
                        >
                            !
                        </div>


                        <div>
                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    text-amber-800
                                "
                            >
                                Temporary password
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    leading-4
                                    text-amber-700
                                "
                            >
                                The Trainer or Trainee must change this
                                generated password after their first
                                login. The Admin account is not affected
                                by this requirement.
                            </p>
                        </div>
                    </div>


                    {/* ACTIONS */}

                    <div
                        className="
                            mt-5
                            flex
                            flex-col
                            gap-2
                            border-t
                            border-[#e8eef5]
                            pt-5
                            sm:flex-row
                            sm:items-center
                            sm:justify-end
                        "
                    >
                        {email && (
                            <button
                                type="button"
                                onClick={
                                    handleSendEmail
                                }
                                className="
                                    min-h-[40px]
                                    rounded-lg
                                    border
                                    border-[#cbd5e1]
                                    bg-white
                                    px-4
                                    text-[9px]
                                    font-semibold
                                    text-[#52627a]
                                    transition
                                    hover:border-blue-200
                                    hover:bg-blue-50
                                    hover:text-blue-600
                                "
                            >
                                Send Credentials by Gmail
                            </button>
                        )}


                        <button
                            type="button"
                            onClick={
                                onClose
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
                            "
                        >
                            Done
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}


function CredentialItem({
    label,
    value,
    copied,
    onCopy,
}) {
    return (
        <div
            className="
                min-w-0
                rounded-xl
                border
                border-[#dbe4ef]
                bg-white
                p-4
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-2
                "
            >
                <p
                    className="
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        text-[#64748b]
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
                        text-[8px]
                        font-semibold
                        text-blue-600
                        transition
                        hover:text-blue-700
                    "
                >
                    {copied
                        ? "Copied ✓"
                        : "Copy"}
                </button>
            </div>


            <div
                className="
                    mt-3
                    rounded-lg
                    bg-[#f8fafc]
                    px-3
                    py-3
                "
            >
                <p
                    className="
                        break-all
                        font-mono
                        text-[10px]
                        font-bold
                        text-[#172033]
                    "
                >
                    {value ||
                        "—"}
                </p>
            </div>
        </div>
    );
}


export default GeneratedCredentialsModal;