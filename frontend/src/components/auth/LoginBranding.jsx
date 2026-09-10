import blueImage from "../../images/blueimage.png";


function LoginBranding() {
    return (
        <section
            className="
                relative
                hidden
                min-h-[680px]
                overflow-hidden
                bg-[#05294b]
                lg:block
            "
        >

            {/* ================================================= */}
            {/* BACKGROUND IMAGE */}
            {/* ================================================= */}

            <img
                src={
                    blueImage
                }
                alt="UK LogiWare warehouse safety training"
                className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                "
            />


            {/* ================================================= */}
            {/* DARK OVERLAY */}
            {/* ================================================= */}

            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-[#031d36]/95
                    via-[#073763]/75
                    to-[#0c5b9d]/45
                "
            />


            {/* ================================================= */}
            {/* DECORATION */}
            {/* ================================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-20
                    -top-20
                    h-72
                    w-72
                    rounded-full
                    border
                    border-white/10
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    right-16
                    h-72
                    w-72
                    rounded-full
                    border
                    border-white/10
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    right-14
                    top-24
                    h-28
                    w-28
                    rotate-12
                    rounded-3xl
                    border
                    border-white/10
                "
            />


            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    z-10
                    flex
                    h-full
                    min-h-[680px]
                    flex-col
                    px-8
                    py-8
                    xl:px-10
                    xl:py-9
                    2xl:px-12
                "
            >

                {/* ================================================= */}
                {/* BRAND */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/15
                            bg-white/10
                            text-white
                            backdrop-blur-sm
                        "
                    >

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-6 w-6"
                        >
                            <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" />

                            <path d="m4.5 7.8 7.5 4.3 7.5-4.3" />

                            <path d="M12 12v10" />
                        </svg>

                    </div>


                    <div>

                        <p
                            className="
                                text-lg
                                font-bold
                                leading-none
                                text-white
                            "
                        >
                            UK Logi
                            <span className="text-[#55a0ff]">
                                Ware
                            </span>
                        </p>


                        <p
                            className="
                                mt-1.5
                                text-[7px]
                                font-semibold
                                uppercase
                                tracking-[0.18em]
                                text-blue-100
                            "
                        >
                            Workplace Safety Training
                        </p>

                    </div>

                </div>


                {/* ================================================= */}
                {/* MAIN MESSAGE */}
                {/* ================================================= */}

                <div
                    className="
                        mt-20
                        max-w-[500px]
                        xl:mt-24
                    "
                >

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-white/15
                            bg-white/10
                            px-3
                            py-1.5
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-blue-100
                            backdrop-blur-sm
                        "
                    >

                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-400
                            "
                        />

                        Safe Workplace Learning

                    </span>


                    <h1
                        className="
                            mt-6
                            text-[34px]
                            font-bold
                            leading-[1.1]
                            text-white
                            xl:text-[40px]
                            2xl:text-[44px]
                        "
                    >
                        Work Safe.
                        <br />

                        <span className="text-[#55a0ff]">
                            Learn Safe.
                        </span>
                    </h1>


                    <p
                        className="
                            mt-5
                            max-w-[420px]
                            text-[12px]
                            leading-6
                            text-blue-50/90
                        "
                    >
                        Interactive workplace health and safety training
                        designed to help employees understand hazards,
                        follow safer procedures and build stronger safety
                        awareness.
                    </p>


                    {/* ================================================= */}
                    {/* SAFETY TAGS */}
                    {/* ================================================= */}

                    <div
                        className="
                            mt-6
                            flex
                            flex-wrap
                            gap-2
                        "
                    >

                        <SafetyTag>
                            Manual Handling
                        </SafetyTag>


                        <SafetyTag>
                            Working at Height
                        </SafetyTag>


                        <SafetyTag>
                            Role-Based Access
                        </SafetyTag>

                    </div>

                </div>


                {/* ================================================= */}
                {/* BOTTOM FEATURE PANEL */}
                {/* ================================================= */}

                <div className="mt-auto">

                    <div
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#031e38]/80
                            p-2
                            backdrop-blur-md
                        "
                    >

                        <div
                            className="
                                grid
                                grid-cols-3
                            "
                        >

                            <Feature
                                type="shield"
                                title="Safety Content"
                                text="Structured workplace learning"
                            />


                            <Feature
                                type="training"
                                title="Interactive Learning"
                                text="Lessons and safety activities"
                                bordered
                            />


                            <Feature
                                type="access"
                                title="Secure Access"
                                text="Role-based account protection"
                            />

                        </div>

                    </div>


                    <div
                        className="
                            mt-4
                            flex
                            items-center
                            justify-between
                            text-[8px]
                            text-blue-100/60
                        "
                    >

                        <span>
                            UK LogiWare Safety Training
                        </span>


                        <span>
                            Secure Learning Portal
                        </span>

                    </div>

                </div>

            </div>

        </section>
    );
}


// ======================================================
// SAFETY TAG
// ======================================================

function SafetyTag({
    children,
}) {
    return (
        <span
            className="
                rounded-lg
                border
                border-white/10
                bg-white/10
                px-3
                py-2
                text-[8px]
                font-semibold
                text-white/90
                backdrop-blur-sm
            "
        >
            {children}
        </span>
    );
}


// ======================================================
// FEATURE
// ======================================================

function Feature({
    type,
    title,
    text,
    bordered = false,
}) {
    return (
        <div
            className={`
                min-w-0
                px-4
                py-4
                xl:px-5

                ${bordered
                    ? "border-x border-white/10"
                    : ""
                }
            `}
        >

            <div
                className="
                    mb-3
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-500/15
                    text-[#55a0ff]
                "
            >

                {type ===
                    "shield" && (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                            <path d="m9 12 2 2 4-4" />
                        </svg>
                    )}


                {type ===
                    "training" && (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <path d="M4 5h7v14H4z" />

                            <path d="M13 5h7v14h-7z" />

                            <path d="M7 9h1" />

                            <path d="M16 9h1" />
                        </svg>
                    )}


                {type ===
                    "access" && (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <rect
                                x="5"
                                y="10"
                                width="14"
                                height="10"
                                rx="2"
                            />

                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                    )}

            </div>


            <p
                className="
                    truncate
                    text-[10px]
                    font-semibold
                    text-white
                "
            >
                {title}
            </p>


            <p
                className="
                    mt-1
                    text-[8px]
                    leading-4
                    text-blue-100/70
                "
            >
                {text}
            </p>

        </div>
    );
}


export default LoginBranding;