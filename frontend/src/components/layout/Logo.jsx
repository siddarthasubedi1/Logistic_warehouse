function Logo({
    light = false,
    compact = false,
}) {
    return (
        <div
            className="
                flex
                min-w-0
                items-center
                gap-3
            "
        >

            {/* ================================================= */}
            {/* LOGO ICON */}
            {/* ================================================= */}

            <div
                className={`
                    flex
                    shrink-0
                    items-center
                    justify-center
                    rounded-md

                    ${compact
                        ? "h-8 w-8"
                        : "h-9 w-9"
                    }

                    ${light
                        ? "text-white"
                        : "text-[#0a4371]"
                    }
                `}
            >

                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={
                        compact
                            ? "h-6 w-6"
                            : "h-7 w-7"
                    }
                >
                    <path d="M12 2.5 3.5 7.2v9.6L12 21.5l8.5-4.7V7.2L12 2.5Zm0 2.1 6.4 3.5L12 11.6 5.6 8.1 12 4.6Zm-6.7 5.1 5.7 3.1v6L5.3 15.7v-6Zm7.7 9.1v-6l5.7-3.1v6L13 18.8Z" />
                </svg>

            </div>


            {/* ================================================= */}
            {/* LOGO TEXT */}
            {/* ================================================= */}

            <div
                className="
                    min-w-0
                "
            >

                <p
                    className={`
                        truncate
                        font-bold
                        leading-none

                        ${compact
                            ? "text-[14px]"
                            : "text-[17px]"
                        }

                        ${light
                            ? "text-white"
                            : "text-[#172033]"
                        }
                    `}
                >
                    UK{" "}

                    <span
                        className={
                            light
                                ? "text-[#4f94e8]"
                                : "text-[#176dc1]"
                        }
                    >
                        LogiWare
                    </span>
                </p>


                <p
                    className={`
                        mt-1
                        truncate
                        text-[6px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]

                        ${light
                            ? "text-blue-100"
                            : "text-slate-500"
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