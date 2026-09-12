import Logo from "../layout/Logo";
import blueImage from "../../images/blueimage.png";


function LoginBranding() {
    return (
        <section
            className="
                relative
                hidden
                min-h-full
                overflow-hidden
                bg-[#061c38]
                text-white
                lg:block
            "
        >
            {/* WAREHOUSE IMAGE */}
            <img
                src={blueImage}
                alt="Warehouse safety training"
                className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                "
            />

            {/* DARK OVERLAY */}
            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-[#031b36]/90
                    via-[#052a52]/46
                    to-[#03182d]/12
                "
            />

            <div
                className="
                    relative
                    z-10
                    flex
                    h-full
                    min-h-[620px]
                    flex-col
                    px-8
                    py-7
                    xl:px-10
                    xl:py-9
                "
            >
                {/* LOGO */}
                <div>
                    <Logo light />
                </div>

                {/* MAIN MESSAGE */}
                <div
                    className="
                        mt-auto
                        mb-[190px]
                        max-w-[470px]
                        sm:mb-[200px]
                        xl:mb-[215px]
                    "
                >
                    <h1
                        className="
                            text-[31px]
                            font-bold
                            leading-[1.18]
                            tracking-[-0.02em]
                            text-white
                            xl:text-[38px]
                        "
                    >
                        Work Safe. Learn Safe
                        <span
                            className="
                                mt-1
                                block
                                text-[#55a0ff]
                            "
                        >
                            Every Step Matters
                        </span>
                    </h1>

                    <p
                        className="
                            mt-5
                            max-w-[360px]
                            text-[12px]
                            font-medium
                            leading-5
                            text-slate-100
                        "
                    >
                        Interactive health &amp; safety training for a safer workplace and a stronger team.
                    </p>
                </div>

                {/* FEATURE BAR */}
                <div
                    className="
                        absolute
                        bottom-7
                        left-8
                        right-8
                        grid
                        grid-cols-3
                        overflow-hidden
                        rounded-xl
                        border
                        border-white/10
                        bg-[#073763]/95
                        shadow-xl
                        xl:left-10
                        xl:right-10
                        xl:bottom-9
                    "
                >
                    <Feature
                        icon="shield"
                        title="Expert Content"
                        description="Industry approved safety training"
                    />

                    <Feature
                        icon="award"
                        title="Track Progress"
                        description="Monitor your learning and performance"
                    />

                    <Feature
                        icon="chart"
                        title="Stay Compliant"
                        description="Meet workplace safety standards"
                    />
                </div>
            </div>
        </section>
    );
}


function Feature({
    icon,
    title,
    description,
}) {
    return (
        <div
            className="
                border-r
                border-white/10
                px-4
                py-5
                last:border-r-0
                xl:px-5
            "
        >
            <FeatureIcon type={icon} />

            <p
                className="
                    mt-3
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
                    text-[7px]
                    font-medium
                    leading-3
                    text-slate-200
                "
            >
                {description}
            </p>
        </div>
    );
}


function FeatureIcon({
    type,
}) {
    const common =
        "h-5 w-5 text-[#55a0ff]";

    if (type === "award") {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={common}
            >
                <circle cx="12" cy="8" r="4" />
                <path d="m9 12-1 8 4-2 4 2-1-8" />
            </svg>
        );
    }

    if (type === "chart") {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={common}
            >
                <path d="M4 20V10" />
                <path d="M10 20V5" />
                <path d="M16 20v-8" />
                <path d="M22 20V3" />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={common}
        >
            <path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}


export default LoginBranding;
