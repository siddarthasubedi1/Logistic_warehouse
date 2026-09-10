function AdminStats({
    loading,
    totalUsers,
    activeUsers,
    pendingUsers,
    deactivatedUsers,
}) {
    return (
        <section
            className="
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            "
        >

            <StatCard
                title="Total Users"
                value={
                    loading
                        ? "..."
                        : totalUsers
                }
                description="Generated Trainer and Trainee accounts"
                type="users"
                tone="blue"
            />


            <StatCard
                title="Active Accounts"
                value={
                    loading
                        ? "..."
                        : activeUsers
                }
                description="Users currently allowed to login"
                type="active"
                tone="green"
            />


            <StatCard
                title="Pending Users"
                value={
                    loading
                        ? "..."
                        : pendingUsers
                }
                description="Waiting for credentials"
                type="pending"
                tone="orange"
            />


            <StatCard
                title="Deactivated"
                value={
                    loading
                        ? "..."
                        : deactivatedUsers
                }
                description="Accounts with login access disabled"
                type="disabled"
                tone="slate"
            />

        </section>
    );
}


function StatCard({
    title,
    value,
    description,
    type,
    tone,
}) {
    const styles = {
        blue: {
            card:
                "from-blue-50/80 to-white border-blue-100",

            icon:
                "bg-blue-100 text-blue-700",

            value:
                "text-blue-700",

            accent:
                "bg-blue-500",
        },

        green: {
            card:
                "from-emerald-50/80 to-white border-emerald-100",

            icon:
                "bg-emerald-100 text-emerald-700",

            value:
                "text-emerald-700",

            accent:
                "bg-emerald-500",
        },

        orange: {
            card:
                "from-amber-50/80 to-white border-amber-100",

            icon:
                "bg-amber-100 text-amber-700",

            value:
                "text-amber-700",

            accent:
                "bg-amber-500",
        },

        slate: {
            card:
                "from-slate-50 to-white border-slate-200",

            icon:
                "bg-slate-100 text-slate-600",

            value:
                "text-slate-700",

            accent:
                "bg-slate-400",
        },
    };


    const style =
        styles[tone];


    return (
        <div
            className={`
                relative
                overflow-hidden
                rounded-2xl
                border
                bg-gradient-to-br
                p-5
                shadow-sm
                transition
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                ${style.card}
            `}
        >

            {/* ACCENT */}

            <div
                className={`
                    absolute
                    left-0
                    top-0
                    h-full
                    w-1
                    ${style.accent}
                `}
            />


            {/* HEADER */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >

                <div
                    className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${style.icon}
                    `}
                >
                    <StatIcon
                        type={
                            type
                        }
                    />
                </div>


                <span
                    className="
                        rounded-full
                        border
                        border-slate-200
                        bg-white/70
                        px-2.5
                        py-1
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                    "
                >
                    Sprint 1
                </span>

            </div>


            {/* TEXT */}

            <div className="mt-5">

                <p
                    className="
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-500
                    "
                >
                    {title}
                </p>


                <p
                    className={`
                        mt-2
                        text-3xl
                        font-bold
                        tracking-tight
                        ${style.value}
                    `}
                >
                    {value}
                </p>


                <p
                    className="
                        mt-2
                        text-[10px]
                        leading-4
                        text-slate-500
                    "
                >
                    {description}
                </p>

            </div>

        </div>
    );
}


function StatIcon({
    type,
}) {

    if (
        type ===
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

                <path d="M15 15c3 0 5 1.6 5.5 5" />
            </svg>
        );
    }


    if (
        type ===
        "active"
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
                    cx="12"
                    cy="12"
                    r="9"
                />

                <path d="m8 12 2.5 2.5L16 9" />
            </svg>
        );
    }


    if (
        type ===
        "pending"
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
                    cx="12"
                    cy="12"
                    r="9"
                />

                <path d="M12 7v5l3 2" />
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
            <circle
                cx="12"
                cy="12"
                r="9"
            />

            <path d="m8 8 8 8" />

            <path d="m16 8-8 8" />
        </svg>
    );
}


export default AdminStats;