import blueImage from "../../images/blueimage.png";


function BrandIcon({
    type,
}) {
    const common = {
        viewBox:
            "0 0 24 24",

        fill:
            "none",

        stroke:
            "currentColor",

        strokeWidth:
            "1.8",

        className:
            "h-6 w-6",
    };


    if (
        type ===
        "shield"
    ) {
        return (
            <svg {...common}>
                <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z" />

                <path d="m9 12 2 2 4-4" />
            </svg>
        );
    }


    if (
        type ===
        "award"
    ) {
        return (
            <svg {...common}>
                <circle
                    cx="12"
                    cy="8"
                    r="4"
                />

                <path d="m9.5 12-1 8 3.5-2 3.5 2-1-8" />
            </svg>
        );
    }


    return (
        <svg {...common}>
            <path d="M4 19V9" />

            <path d="M10 19V5" />

            <path d="M16 19v-7" />

            <path d="M22 19V3" />
        </svg>
    );
}


function LoginBranding() {
    return (
        <section
            className="
                relative
                hidden
                min-h-[700px]
                overflow-hidden
                bg-[#031a33]
                lg:block
            "
        >
            <img
                src={
                    blueImage
                }
                alt="Warehouse worker handling a package safely"
                className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                "
            />


            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-[#001a36]/90
                    via-[#06284c]/50
                    to-[#04192e]/20
                "
            />


            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#02172c]/65
                    via-transparent
                    to-[#03172c]/15
                "
            />


            <div
                className="
                    relative
                    z-10
                    flex
                    h-full
                    min-h-[700px]
                    flex-col
                    px-9
                    py-7
                    xl:px-11
                "
            >
                {/* LOGO */}

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
                            h-8
                            w-8
                            items-center
                            justify-center
                            text-white
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="
                                h-7
                                w-7
                            "
                        >
                            <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />

                            <path d="m4 7.5 8 4.5 8-4.5" />

                            <path d="M12 12v9" />
                        </svg>
                    </div>


                    <div>
                        <div
                            className="
                                flex
                                items-center
                                gap-1
                                leading-none
                            "
                        >
                            <span
                                className="
                                    text-[18px]
                                    font-extrabold
                                    text-white
                                "
                            >
                                UK
                            </span>


                            <span
                                className="
                                    text-[18px]
                                    font-extrabold
                                    text-white
                                "
                            >
                                Logi
                            </span>


                            <span
                                className="
                                    text-[18px]
                                    font-extrabold
                                    text-[#448cff]
                                "
                            >
                                Ware
                            </span>
                        </div>


                        <p
                            className="
                                mt-1
                                text-[6px]
                                font-semibold
                                uppercase
                                tracking-[0.14em]
                                text-white
                            "
                        >
                            Warehousing & Logistics
                        </p>
                    </div>
                </div>


                {/* HERO TEXT */}

                <div
                    className="
                        mt-[95px]
                        max-w-[410px]
                    "
                >
                    <h1
                        className="
                            text-[38px]
                            font-extrabold
                            leading-[1.08]
                            tracking-[-0.025em]
                            text-white
                            xl:text-[42px]
                        "
                    >
                        Work Safe. Learn Safe
                    </h1>


                    <h2
                        className="
                            mt-2
                            text-[38px]
                            font-extrabold
                            leading-[1.08]
                            tracking-[-0.025em]
                            text-[#2f7dff]
                            xl:text-[42px]
                        "
                    >
                        Every Step Matters
                    </h2>


                    <p
                        className="
                            mt-7
                            max-w-[350px]
                            text-[12px]
                            font-medium
                            leading-5
                            text-white
                        "
                    >
                        Interactive health & safety training for a safer workplace and a stronger team.
                    </p>
                </div>


                {/* BOTTOM FEATURE PANEL */}

                <div
                    className="
                        mt-auto
                        mb-1
                        grid
                        grid-cols-3
                        divide-x
                        divide-white/15
                        rounded-lg
                        border
                        border-white/5
                        bg-[#06345d]/95
                        px-2
                        py-5
                        shadow-lg
                    "
                >
                    <Feature
                        icon="shield"
                        title="Expert Content"
                        text="Industry approved safety training"
                    />


                    <Feature
                        icon="award"
                        title="Track Progress"
                        text="Monitor your learning and performance"
                    />


                    <Feature
                        icon="progress"
                        title="Stay Compliant"
                        text="Meet workplace safety standards"
                    />
                </div>
            </div>
        </section>
    );
}


function Feature({
    icon,
    title,
    text,
}) {
    return (
        <div
            className="
                px-5
            "
        >
            <div
                className="
                    text-[#2f8cff]
                "
            >
                <BrandIcon
                    type={
                        icon
                    }
                />
            </div>


            <p
                className="
                    mt-3
                    text-[11px]
                    font-bold
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
                    text-slate-200
                "
            >
                {text}
            </p>
        </div>
    );
}


export default LoginBranding;