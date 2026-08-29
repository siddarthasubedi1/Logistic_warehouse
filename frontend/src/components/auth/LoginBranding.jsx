import blueImage from "../../images/blueimage.png";

function LoginBranding() {
    return (
        <section className="relative hidden min-h-[680px] overflow-hidden lg:block">

            {/* =====================================================
                BACKGROUND IMAGE
                Same image used for normal + invalid login page
            ====================================================== */}

            <img
                src={blueImage}
                alt="UK LogiWare warehouse safety training"
                className="absolute inset-0 h-full w-full object-cover object-center"
            />


            {/* =====================================================
                CONTENT
            ====================================================== */}

            <div className="relative z-10 flex h-full min-h-[680px] flex-col px-8 py-7 xl:px-9 xl:py-8">

                {/* =================================================
                    LOGO
                ================================================= */}

                <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center text-white">

                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-7 w-7"
                        >
                            <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.8 3.8L12 12 5.2 8.1 12 4.3Zm-7 5.5 6 3.4v6.1l-6-3.4V9.8Zm8 9.5v-6.1l6-3.4v6.1l-6 3.4Z" />
                        </svg>

                    </div>


                    <div>

                        <p className="text-[16px] font-bold leading-none text-white">
                            UK Logi
                            <span className="text-[#3f8cff]">
                                Ware
                            </span>
                        </p>

                        <p className="mt-1 text-[6px] font-semibold uppercase tracking-[0.12em] text-white/80">
                            Warehousing & Logistics
                        </p>

                    </div>

                </div>


                {/* =================================================
                    MAIN TEXT
                ================================================= */}

                <div className="mt-[85px] max-w-[390px]">

                    <h1 className="text-[29px] font-bold leading-[1.12] text-white xl:text-[32px]">
                        Work Safe. Learn Safe
                    </h1>

                    <h2 className="mt-1 text-[29px] font-bold leading-[1.12] text-[#2f7df6] xl:text-[32px]">
                        Every Step Matters
                    </h2>


                    <p className="mt-6 max-w-[300px] text-[11px] leading-[1.55] text-white/90">
                        Interactive health & safety
                        training for a safer workplace
                        and a stronger team.
                    </p>

                </div>


                {/* =================================================
                    BOTTOM FEATURE PANEL
                ================================================= */}

                <div className="mt-auto">

                    <div className="grid grid-cols-3 overflow-hidden rounded-[12px] bg-[#05284b]/90 px-2 py-6 backdrop-blur-[2px]">

                        <Feature
                            type="shield"
                            title="Expert Content"
                            text="Industry approved safety training"
                        />

                        <Feature
                            type="award"
                            title="Track Progress"
                            text="Monitor your learning and performance"
                            bordered
                        />

                        <Feature
                            type="progress"
                            title="Stay Compliant"
                            text="Meet workplace safety standards"
                        />

                    </div>

                </div>

            </div>

        </section>
    );
}


function Feature({
    type,
    title,
    text,
    bordered = false,
}) {
    return (
        <div
            className={`px-5 ${bordered
                ? "border-x border-white/10"
                : ""
                }`}
        >

            {/* ICON */}

            <div className="mb-3 text-[#3887ff]">

                {type === "shield" && (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-7 w-7"
                    >
                        <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                        <path d="m9 12 2 2 4-4" />
                    </svg>
                )}


                {type === "award" && (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-7 w-7"
                    >
                        <circle
                            cx="12"
                            cy="9"
                            r="5"
                        />

                        <path d="m9 14-2 7 5-3 5 3-2-7" />

                        <path d="m10 9 1.3 1.3L14 7.5" />
                    </svg>
                )}


                {type === "progress" && (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-7 w-7"
                    >
                        <path d="M4 20V10" />

                        <path d="M10 20V5" />

                        <path d="M16 20v-7" />

                        <path d="M22 20V3" />

                        <path d="m4 10 5-4 6 4 7-6" />
                    </svg>
                )}

            </div>


            {/* TEXT */}

            <p className="text-[11px] font-semibold leading-tight text-white">
                {title}
            </p>


            <p className="mt-1 text-[8px] leading-[1.35] text-white/75">
                {text}
            </p>

        </div>
    );
}


export default LoginBranding;