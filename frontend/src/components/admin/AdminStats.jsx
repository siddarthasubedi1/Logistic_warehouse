function StatIcon({
    type,
}) {
    const props = {
        viewBox:
            "0 0 24 24",

        fill:
            "none",

        stroke:
            "currentColor",

        strokeWidth:
            "1.8",

        className:
            "h-5 w-5",
    };


    if (
        type ===
        "active"
    ) {
        return (
            <svg {...props}>
                <circle
                    cx="12"
                    cy="12"
                    r="8"
                />

                <path d="m8.5 12 2.3 2.3 4.7-5" />
            </svg>
        );
    }


    if (
        type ===
        "pending"
    ) {
        return (
            <svg {...props}>
                <circle
                    cx="12"
                    cy="12"
                    r="8"
                />

                <path d="M12 7v5l3 2" />
            </svg>
        );
    }


    if (
        type ===
        "disabled"
    ) {
        return (
            <svg {...props}>
                <circle
                    cx="12"
                    cy="12"
                    r="8"
                />

                <path d="m9 9 6 6" />

                <path d="m15 9-6 6" />
            </svg>
        );
    }


    return (
        <svg {...props}>
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

            <path d="M15 15c3 0 5 1.5 6 5" />
        </svg>
    );
}


function AdminStats({
    totalUsers,
    activeUsers,
    pendingUsers,
    deactivatedUsers,
    loading = false,
}) {
    const cards = [
        {
            label:
                "Total Users",

            value:
                totalUsers,

            description:
                "Generated accounts",

            type:
                "users",

            iconClass:
                "bg-blue-50 text-blue-600",

            valueClass:
                "text-blue-600",
        },

        {
            label:
                "Active Accounts",

            value:
                activeUsers,

            description:
                "Users allowed to login",

            type:
                "active",

            iconClass:
                "bg-emerald-50 text-emerald-600",

            valueClass:
                "text-emerald-600",
        },

        {
            label:
                "Pending Users",

            value:
                pendingUsers,

            description:
                "Waiting for credentials",

            type:
                "pending",

            iconClass:
                "bg-orange-50 text-orange-500",

            valueClass:
                "text-orange-600",
        },

        {
            label:
                "Deactivated",

            value:
                deactivatedUsers,

            description:
                "Login access disabled",

            type:
                "disabled",

            iconClass:
                "bg-slate-100 text-slate-500",

            valueClass:
                "text-slate-700",
        },
    ];


    return (
        <section
            className="
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            "
        >
            {cards.map(
                (
                    card
                ) => (
                    <article
                        key={
                            card.label
                        }
                        className="
                            min-h-[150px]
                            rounded-xl
                            border
                            border-[#dbe4ef]
                            bg-white
                            p-5
                            shadow-[0_1px_3px_rgba(15,23,42,0.08)]
                        "
                    >
                        <div
                            className={`
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                ${card.iconClass}
                            `}
                        >
                            <StatIcon
                                type={
                                    card.type
                                }
                            />
                        </div>


                        <p
                            className="
                                mt-5
                                text-[10px]
                                font-medium
                                text-[#52627a]
                            "
                        >
                            {card.label}
                        </p>


                        <p
                            className={`
                                mt-1
                                text-[26px]
                                font-bold
                                leading-none
                                ${card.valueClass}
                            `}
                        >
                            {loading
                                ? "—"
                                : card.value}
                        </p>


                        <p
                            className="
                                mt-2
                                text-[9px]
                                text-[#7c8da6]
                            "
                        >
                            {card.description}
                        </p>
                    </article>
                )
            )}
        </section>
    );
}


export default AdminStats;