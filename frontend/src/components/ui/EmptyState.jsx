// ======================================================
// EMPTY STATE
// ======================================================

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
                min-h-[220px]
                items-center
                justify-center
                px-4
                py-8
                text-center
                sm:px-6
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                "
            >

                {/* ================================================= */}
                {/* ICON */}
                {/* ================================================= */}

                <div
                    className="
                        relative
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                    "
                >

                    <div
                        className="
                            absolute
                            inset-0
                            rounded-2xl
                            bg-blue-50
                            rotate-6
                        "
                    />


                    <div
                        className="
                            relative
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-blue-100
                            bg-white
                            text-blue-500
                            shadow-sm
                        "
                    >

                        {icon ===
                            "users" ? (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                className="h-6 w-6"
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

                                <path d="M15 15c3 0 5 1.6 5.5 5" />
                            </svg>
                        ) : icon ===
                            "training" ? (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                className="h-6 w-6"
                            >
                                <path d="M4 5h16v14H4z" />

                                <path d="M8 9h8" />

                                <path d="M8 13h5" />
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                className="h-6 w-6"
                            >
                                <path d="M4 6h16v13H4z" />

                                <path d="M8 3v3" />

                                <path d="M16 3v3" />

                                <path d="M8 11h8" />

                                <path d="M8 15h5" />
                            </svg>
                        )}

                    </div>

                </div>


                {/* ================================================= */}
                {/* TEXT */}
                {/* ================================================= */}

                <p
                    className="
                        mt-5
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-blue-500
                    "
                >
                    UK LogiWare
                </p>


                <h3
                    className="
                        mt-1
                        break-words
                        text-sm
                        font-bold
                        text-slate-800
                    "
                >
                    {title}
                </h3>


                {description && (
                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-sm
                            text-[10px]
                            leading-5
                            text-slate-500
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
                            mt-5
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


export default EmptyState;