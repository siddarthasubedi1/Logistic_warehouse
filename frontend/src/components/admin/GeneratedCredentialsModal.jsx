import {
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


    const role =
        user?.role ||
        "";


    const copyValue =
        async (
            type,
            value
        ) => {
            if (
                !value
            ) {
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

Please sign in using these credentials. You will be required to create a new password before accessing your account.

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
                z-[260]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-slate-950/60
                p-3
                backdrop-blur-[2px]
                sm:p-4
            "
        >
            <section
                role="dialog"
                aria-modal="true"
                className="
                    my-auto
                    w-full
                    max-w-[550px]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                "
            >
                {/* HEADER */}

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
                        <p
                            className="
                                text-[7px]
                                font-semibold
                                uppercase
                                tracking-[0.12em]
                                text-emerald-600
                            "
                        >
                            Account Created
                        </p>


                        <h2
                            className="
                                mt-1
                                text-[15px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Credentials Generated Successfully
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                font-medium
                                text-slate-500
                            "
                        >
                            These temporary credentials are shown only once.
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
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            text-lg
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700
                        "
                    >
                        ×
                    </button>
                </div>


                {/* BODY */}

                <div
                    className="
                        p-4
                        sm:p-5
                    "
                >
                    {user && (
                        <div
                            className="
                                rounded-lg
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
                            "
                        >
                            <p
                                className="
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                "
                            >
                                Account
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[10px]
                                    font-bold
                                    text-slate-800
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
                                        font-medium
                                        text-slate-500
                                    "
                                >
                                    {email}
                                </p>
                            )}


                            {role && (
                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        font-medium
                                        capitalize
                                        text-slate-500
                                    "
                                >
                                    Role: {role}
                                </p>
                            )}
                        </div>
                    )}


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
                                font-medium
                                leading-5
                                text-amber-800
                            "
                        >
                            The Trainer or Trainee must change this temporary password after signing in before accessing the dashboard.
                        </p>
                    </div>


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
                                    min-h-[40px]
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    text-[9px]
                                    font-semibold
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
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
                                bg-blue-600
                                px-5
                                text-[9px]
                                font-semibold
                                text-white
                                transition
                                hover:bg-blue-700
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
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-500
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
                        shrink-0
                        text-[8px]
                        font-semibold
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
                    font-bold
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