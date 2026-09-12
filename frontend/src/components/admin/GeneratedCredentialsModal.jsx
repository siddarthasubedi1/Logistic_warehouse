import {
    useState,
} from "react";


// ======================================================
// GENERATED CREDENTIALS
// ======================================================

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
        "";


    // ======================================================
    // COPY
    // ======================================================

    const copyValue =
        async (
            type,
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


                setCopied(
                    type
                );


                window.setTimeout(
                    () => {
                        setCopied(
                            ""
                        );
                    },
                    1500
                );

            } catch (error) {
                console.error(
                    "Copy credentials error:",
                    error
                );
            }
        };


    // ======================================================
    // GMAIL
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

Your UK LogiWare password has been reset.

Username: ${username}
Temporary Password: ${password}

Login here:
http://localhost:5173/login

Please change your temporary password after logging in.

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
                fixed
                inset-0
                z-[120]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-slate-950/45
                p-4
            "
        >
            <div
                role="dialog"
                aria-modal="true"
                className="
                    my-auto
                    w-full
                    max-w-lg
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-xl
                "
            >

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-slate-200
                        px-5
                        py-4
                    "
                >
                    <div>
                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <span
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-emerald-50
                                    text-[10px]
                                    font-bold
                                    text-emerald-600
                                "
                            >
                                ✓
                            </span>


                            <h2
                                className="
                                    text-[13px]
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                Password Reset Complete
                            </h2>
                        </div>


                        <p
                            className="
                                mt-2
                                text-[8px]
                                text-slate-400
                            "
                        >
                            Save or send these temporary credentials.
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        aria-label="Close"
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-md
                            text-lg
                            text-slate-400
                            hover:bg-slate-100
                            hover:text-slate-700
                        "
                    >
                        ×
                    </button>
                </div>


                {/* ================================================= */}
                {/* BODY */}
                {/* ================================================= */}

                <div
                    className="
                        p-5
                    "
                >

                    {/* USER */}

                    {user && (
                        <div
                            className="
                                rounded-lg
                                bg-slate-50
                                p-4
                            "
                        >
                            <p
                                className="
                                    text-[7px]
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
                                    text-[10px]
                                    font-semibold
                                    text-slate-700
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
                                        text-slate-400
                                    "
                                >
                                    {email}
                                </p>
                            )}
                        </div>
                    )}


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


                    {/* INFO */}

                    <div
                        className="
                            mt-4
                            rounded-lg
                            border
                            border-amber-200
                            bg-amber-50
                            px-4
                            py-3
                        "
                    >
                        <p
                            className="
                                text-[8px]
                                leading-5
                                text-amber-700
                            "
                        >
                            The Trainer or Trainee should use this
                            temporary password to log in and then
                            create a new password.
                        </p>
                    </div>


                    {/* ACTIONS */}

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
                        {email && (
                            <button
                                type="button"
                                onClick={
                                    handleSendEmail
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-[9px]
                                    font-medium
                                    text-slate-600
                                    hover:bg-slate-50
                                "
                            >
                                Send by Gmail
                            </button>
                        )}


                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            className="
                                rounded-lg
                                bg-blue-600
                                px-5
                                py-2.5
                                text-[9px]
                                font-medium
                                text-white
                                hover:bg-blue-700
                            "
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


// ======================================================
// CREDENTIAL
// ======================================================

function CredentialItem({
    label,
    value,
    copied,
    onCopy,
}) {
    return (
        <div
            className="
                rounded-lg
                border
                border-slate-200
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
                        text-[8px]
                        font-medium
                        text-blue-600
                        hover:text-blue-700
                    "
                >
                    {copied
                        ? "Copied"
                        : "Copy"}
                </button>
            </div>


            <p
                className="
                    mt-3
                    break-all
                    rounded-md
                    bg-slate-50
                    px-3
                    py-2.5
                    font-mono
                    text-[10px]
                    font-semibold
                    text-slate-800
                "
            >
                {value ||
                    "—"}
            </p>
        </div>
    );
}


export default GeneratedCredentialsModal;