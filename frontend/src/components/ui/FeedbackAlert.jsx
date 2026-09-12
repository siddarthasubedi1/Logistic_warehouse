function FeedbackAlert({
    type = "error",
    message = "",
    onClose,
}) {
    if (!message) {
        return null;
    }


    // ======================================================
    // ALERT STYLES
    // ======================================================

    const config = {
        success: {
            wrapper:
                "border-emerald-200 bg-emerald-50",

            icon:
                "bg-emerald-100 text-emerald-600",

            text:
                "text-emerald-700",
        },

        error: {
            wrapper:
                "border-red-200 bg-red-50",

            icon:
                "bg-red-100 text-red-600",

            text:
                "text-red-700",
        },

        warning: {
            wrapper:
                "border-amber-200 bg-amber-50",

            icon:
                "bg-amber-100 text-amber-600",

            text:
                "text-amber-700",
        },

        info: {
            wrapper:
                "border-blue-200 bg-blue-50",

            icon:
                "bg-blue-100 text-blue-600",

            text:
                "text-blue-700",
        },
    };


    const current =
        config[type] ||
        config.info;


    // ======================================================
    // ICON
    // ======================================================

    const renderIcon =
        () => {
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


            if (
                type ===
                "info"
            ) {
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

                    <path d="M12 7v6" />

                    <path d="M12 17h.01" />
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
                flex
                items-start
                gap-3
                rounded-lg
                border
                px-4
                py-3

                ${current.wrapper}
            `}
        >
            <span
                className={`
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full

                    ${current.icon}
                `}
            >
                {renderIcon()}
            </span>


            <p
                className={`
                    min-w-0
                    flex-1
                    break-words
                    pt-1
                    text-[9px]
                    leading-5

                    ${current.text}
                `}
            >
                {message}
            </p>


            {onClose && (
                <button
                    type="button"
                    onClick={
                        onClose
                    }
                    aria-label="Close message"
                    className={`
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        text-sm
                        transition
                        hover:bg-white/60

                        ${current.text}
                    `}
                >
                    ×
                </button>
            )}
        </div>
    );
}


export default FeedbackAlert;