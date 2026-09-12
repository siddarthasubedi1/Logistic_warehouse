function Logo({
    light = false,
    compact = false,
}) {
    return (
        <div
            className="
                flex
                items-center
                gap-3
            "
        >
            <div
                className={`
                    flex
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg

                    ${compact
                        ? "h-9 w-9"
                        : "h-11 w-11"
                    }

                    ${light
                        ? "bg-[#1769e8] text-white"
                        : "bg-[#1769e8] text-white"
                    }
                `}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className={
                        compact
                            ? "h-5 w-5"
                            : "h-6 w-6"
                    }
                >
                    <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />

                    <path d="m4 7.5 8 4.5 8-4.5" />

                    <path d="M12 12v9" />
                </svg>
            </div>


            <div
                className="
                    min-w-0
                "
            >
                <div
                    className="
                        flex
                        items-baseline
                        gap-1
                        leading-none
                    "
                >
                    <span
                        className={`
                            font-extrabold
                            tracking-tight

                            ${compact
                                ? "text-[15px]"
                                : "text-[19px]"
                            }

                            ${light
                                ? "text-white"
                                : "text-[#172033]"
                            }
                        `}
                    >
                        UK
                    </span>


                    <span
                        className={`
                            font-extrabold
                            tracking-tight

                            ${compact
                                ? "text-[15px]"
                                : "text-[19px]"
                            }

                            ${light
                                ? "text-white"
                                : "text-[#172033]"
                            }
                        `}
                    >
                        LogiWare
                    </span>
                </div>


                <p
                    className={`
                        mt-1
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]

                        ${light
                            ? "text-[#79c4ff]"
                            : "text-blue-600"
                        }
                    `}
                >
                    Safety Training
                </p>
            </div>
        </div>
    );
}


export default Logo;