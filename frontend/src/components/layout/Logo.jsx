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
            {/* ICON */}
            {/* ================================================= */}

            <div
                className={`
                    flex
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    shadow-md

                    ${compact
                        ? "h-9 w-9"
                        : "h-11 w-11"
                    }

                    ${light
                        ? "border border-white/15 bg-white/10 text-white"
                        : "bg-blue-600 text-white"
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

                    {/* WAREHOUSE */}

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10.5 12 4l9 6.5v8.25A1.25 1.25 0 0 1 19.75 20H4.25A1.25 1.25 0 0 1 3 18.75V10.5Z"
                    />


                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 20v-6h8v6"
                    />


                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 10h10"
                    />

                </svg>

            </div>


            {/* ================================================= */}
            {/* TEXT */}
            {/* ================================================= */}

            <div className="min-w-0">

                <h1
                    className={`
                        truncate
                        font-bold
                        leading-none

                        ${compact
                            ? "text-[15px]"
                            : "text-[18px]"
                        }

                        ${light
                            ? "text-white"
                            : "text-slate-900"
                        }
                    `}
                >
                    UK Logi
                    <span
                        className={
                            light
                                ? "text-blue-300"
                                : "text-blue-600"
                        }
                    >
                        Ware
                    </span>
                </h1>


                <div
                    className="
                        mt-1.5
                        flex
                        items-center
                        gap-1.5
                    "
                >

                    <span
                        className={`
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full

                            ${light
                                ? "bg-emerald-400"
                                : "bg-emerald-500"
                            }
                        `}
                    />


                    <p
                        className={`
                            truncate
                            font-semibold
                            uppercase
                            tracking-[0.13em]

                            ${compact
                                ? "text-[6px]"
                                : "text-[7px]"
                            }

                            ${light
                                ? "text-blue-200"
                                : "text-slate-500"
                            }
                        `}
                    >
                        Safety Training
                    </p>

                </div>

            </div>

        </div>
    );
}


export default Logo;