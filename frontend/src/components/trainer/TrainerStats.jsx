function TrainerStats() {
    // ======================================================
    // CURRENT DASHBOARD DISPLAY DATA
    // ======================================================
    //
    // Keeping the same existing values and labels.
    //
    // ======================================================

    const stats = [
        {
            title:
                "Total Trainees",

            value:
                "28",

            subtitle:
                "Assigned to you",

            action:
                "View Trainees",

            type:
                "users",
        },

        {
            title:
                "Completed",

            value:
                "16",

            subtitle:
                "57% Completion",

            action:
                "View Progress",

            type:
                "complete",
        },

        {
            title:
                "In Progress",

            value:
                "9",

            subtitle:
                "32% In Progress",

            action:
                "View Progress",

            type:
                "progress",
        },

        {
            title:
                "Not Started",

            value:
                "3",

            subtitle:
                "11% Not Started",

            action:
                "View Trainees",

            type:
                "notstarted",
        },
    ];


    return (
        <section
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-slate-100
                    bg-gradient-to-r
                    from-white
                    to-blue-50/40
                    px-5
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div
                    className="
                        flex
                        items-start
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-50
                            text-blue-600
                        "
                    >

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <path d="M4 19V9" />

                            <path d="M10 19V5" />

                            <path d="M16 19v-7" />

                            <path d="M22 19H2" />
                        </svg>

                    </div>


                    <div>

                        <h2
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Training Overview
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                text-slate-500
                            "
                        >
                            Overview of Trainee training activity.
                        </p>

                    </div>

                </div>


                <span
                    className="
                        w-fit
                        rounded-full
                        bg-blue-50
                        px-3
                        py-1.5
                        text-[9px]
                        font-semibold
                        text-blue-700
                    "
                >
                    Trainer Statistics
                </span>

            </div>


            {/* ================================================= */}
            {/* CARDS */}
            {/* ================================================= */}

            <div className="p-4 sm:p-5">

                <div
                    className="
                        grid
                        gap-4
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    {stats.map(
                        (
                            stat
                        ) => (
                            <StatCard
                                key={
                                    stat.title
                                }
                                {...stat}
                            />
                        )
                    )}

                </div>

            </div>

        </section>
    );
}


// ======================================================
// CARD
// ======================================================

function StatCard({
    title,
    value,
    subtitle,
    action,
    type,
}) {
    const themes = {
        users: {
            card:
                "from-blue-50 to-white",

            icon:
                "bg-blue-100 text-blue-700",

            badge:
                "bg-blue-50 text-blue-700",
        },

        complete: {
            card:
                "from-emerald-50 to-white",

            icon:
                "bg-emerald-100 text-emerald-700",

            badge:
                "bg-emerald-50 text-emerald-700",
        },

        progress: {
            card:
                "from-orange-50 to-white",

            icon:
                "bg-orange-100 text-orange-600",

            badge:
                "bg-orange-50 text-orange-600",
        },

        notstarted: {
            card:
                "from-slate-100 to-white",

            icon:
                "bg-slate-200 text-slate-600",

            badge:
                "bg-slate-100 text-slate-600",
        },
    };


    const theme =
        themes[type] ||
        themes.users;


    return (
        <article
            className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-gradient-to-br
                p-4
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md

                ${theme.card}
            `}
        >

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-8
                    -top-8
                    h-24
                    w-24
                    rounded-full
                    bg-white/60
                "
            />


            <div
                className="
                    relative
                    z-10
                "
            >

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >

                    <StatIcon
                        type={
                            type
                        }
                        className={
                            theme.icon
                        }
                    />


                    <span
                        className={`
                            rounded-full
                            px-2.5
                            py-1
                            text-[8px]
                            font-semibold

                            ${theme.badge}
                        `}
                    >
                        {title}
                    </span>

                </div>


                <p
                    className="
                        mt-5
                        text-2xl
                        font-bold
                        text-slate-900
                    "
                >
                    {value}
                </p>


                <p
                    className="
                        mt-1
                        text-[9px]
                        text-slate-500
                    "
                >
                    {subtitle}
                </p>


                <button
                    type="button"
                    className="
                        mt-5
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        gap-1
                        rounded-lg
                        border
                        border-slate-200
                        bg-white/80
                        px-3
                        py-2
                        text-[9px]
                        font-semibold
                        text-blue-600
                        transition
                        hover:border-blue-200
                        hover:bg-blue-50
                    "
                >
                    {action}

                    <span>
                        →
                    </span>
                </button>

            </div>

        </article>
    );
}


// ======================================================
// ICON
// ======================================================

function StatIcon({
    type,
    className = "",
}) {
    return (
        <div
            className={`
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl

                ${className}
            `}
        >

            {type ===
                "users" && (
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

                        <path d="M15 15c3 0 5 1.6 5.5 5" />
                    </svg>
                )}


            {type ===
                "complete" && (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                        />

                        <path d="m8 12 2.5 2.5L16 9" />
                    </svg>
                )}


            {type ===
                "progress" && (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                        />

                        <path d="M12 7v5l3 2" />
                    </svg>
                )}


            {type ===
                "notstarted" && (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                        />

                        <path d="M8 12h8" />
                    </svg>
                )}

        </div>
    );
}


export default TrainerStats;