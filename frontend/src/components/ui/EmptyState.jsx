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
                min-h-[180px]
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

                {/* ================================================= */}
                {/* ICON */}
                {/* ================================================= */}

                <div
                    className="
                        mx-auto
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-50
                        text-blue-500
                    "
                >
                    <EmptyIcon
                        icon={
                            icon
                        }
                    />
                </div>


                {/* ================================================= */}
                {/* TITLE */}
                {/* ================================================= */}

                <h3
                    className="
                        mt-3
                        text-[11px]
                        font-medium
                        text-slate-700
                    "
                >
                    {title}
                </h3>


                {/* ================================================= */}
                {/* DESCRIPTION */}
                {/* ================================================= */}

                {description && (
                    <p
                        className="
                            mx-auto
                            mt-1
                            max-w-xs
                            text-[8px]
                            leading-4
                            text-slate-400
                        "
                    >
                        {description}
                    </p>
                )}


                {/* ================================================= */}
                {/* ACTION */}
                {/* ================================================= */}

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
// ICON
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