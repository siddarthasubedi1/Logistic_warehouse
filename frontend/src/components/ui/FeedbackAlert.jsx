// ======================================================
// FEEDBACK ALERT
// ======================================================

function FeedbackAlert({
    type = "error",
    message = "",
    onClose,
}) {
    if (!message) {
        return null;
    }


    // ======================================================
    // CONFIG
    // ======================================================

    const config = {
        success: {
            wrapper:
                "border-emerald-200 bg-emerald-50/90 text-emerald-800",

            icon:
                "bg-emerald-100 text-emerald-700",

            title:
                "Success",
        },

        error: {
            wrapper:
                "border-red-200 bg-red-50/90 text-red-800",

            icon:
                "bg-red-100 text-red-700",

            title:
                "Action Required",
        },

        warning: {
            wrapper:
                "border-amber-200 bg-amber-50/90 text-amber-800",

            icon:
                "bg-amber-100 text-amber-700",

            title:
                "Attention",
        },

        info: {
            wrapper:
                "border-blue-200 bg-blue-50/90 text-blue-800",

            icon:
                "bg-blue-100 text-blue-700",

            title:
                "Information",
        },
    };


    const current =
        config[type] ||
        config.info;


    // ======================================================
    // ICON
    // ======================================================

    const renderIcon = () => {
        if (
            type ===
            "success"
        ) {
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                    />

                    <path d="m8 12 2.5 2.5L16 9" />
                </svg>
            );
        }


        if (
            type ===
            "error"
        ) {
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                    />

                    <path d="M12 7v6" />

                    <path d="M12 17h.01" />
                </svg>
            );
        }


        if (
            type ===
            "warning"
        ) {
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                >
                    <path d="M12 3 2.5 20h19L12 3Z" />

                    <path d="M12 9v5" />

                    <path d="M12 17h.01" />
                </svg>
            );
        }


        return (
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

                <path d="M12 11v6" />

                <path d="M12 7h.01" />
            </svg>
        );
    };


    // ======================================================
    // UI
    // ======================================================

    return (
        <div
            role="alert"
            className={`
                relative
                overflow-hidden
                rounded-xl
                border
                px-3
                py-3
                sm:px-4
                ${current.wrapper}
            `}
        >

            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div
                className="
                    flex
                    items-start
                    gap-3
                "
            >

                <span
                    className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        ${current.icon}
                    `}
                >
                    {renderIcon()}
                </span>


                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <p
                        className="
                            text-[9px]
                            font-bold
                        "
                    >
                        {current.title}
                    </p>


                    <p
                        className="
                            mt-0.5
                            break-words
                            text-[9px]
                            font-medium
                            leading-5
                            opacity-90
                            sm:text-[10px]
                        "
                    >
                        {message}
                    </p>

                </div>


                {/* ================================================= */}
                {/* CLOSE */}
                {/* ================================================= */}

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close message"
                        className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-base
                            leading-none
                            opacity-50
                            transition
                            hover:bg-white/50
                            hover:opacity-100
                        "
                    >
                        ×
                    </button>
                )}

            </div>

        </div>
    );
}


export default FeedbackAlert;