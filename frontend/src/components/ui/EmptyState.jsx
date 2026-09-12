function EmptyState({
    title = "No data found.",
    description = "",
    action = null,
    icon = "empty",
}) {
    return (
        <div
            className="
                flex
                min-h-[190px]
                w-full
                items-center
                justify-center
                px-4
                py-8
                text-center
            "
        >
            <div
                className="
                    w-full
                    max-w-sm
                "
            >
                {/* ICON */}

                <div
                    className="
                        mx-auto
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-50
                        text-[#0b4f87]
                    "
                >
                    <EmptyIcon
                        icon={icon}
                    />
                </div>


                {/* TITLE */}

                <h3
                    className="
                        mt-3
                        text-[11px]
                        font-semibold
                        text-slate-800
                    "
                >
                    {title}
                </h3>


                {/* DESCRIPTION */}

                {description && (
                    <p
                        className="
                            mx-auto
                            mt-1.5
                            max-w-xs
                            text-[8px]
                            font-medium
                            leading-4
                            text-slate-500
                        "
                    >
                        {description}
                    </p>
                )}


                {/* ACTION */}

                {action && (
                    <div
                        className="
                            mt-4
                            flex
                            justify-center
                        "
                    >
                        {action}
                    </div>
                )}

            </div>
        </div>
    );
}


// ======================================================
// EMPTY ICON
// ======================================================

function EmptyIcon({
    icon,
}) {
    if (
        icon ===
        "users"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <circle
                    cx="9"
                    cy="8"
                    r="3"
                />

                <circle
                    cx="17"
                    cy="9"
                    r="2"
                />

                <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                <path d="M15 15c3 0 5 1.5 6 5" />
            </svg>
        );
    }


    if (
        icon ===
        "training"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <path d="M4 5h16v14H4z" />

                <path d="M8 9h8" />

                <path d="M8 13h5" />

                <path d="M8 17h3" />
            </svg>
        );
    }


    if (
        icon ===
        "audit"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <path d="M6 3h12v18H6z" />

                <path d="M9 8h6" />

                <path d="M9 12h6" />

                <path d="M9 16h4" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path d="M5 6h14v13H5z" />

            <path d="M8 10h8" />

            <path d="M8 14h5" />
        </svg>
    );
}


export default EmptyState;