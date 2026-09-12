function AdminStats({
    loading = false,
    totalUsers = 0,
    activeUsers = 0,
    pendingUsers = 0,
    deactivatedUsers = 0,
}) {
    const cards = [
        {
            title: "Total Users",
            value: totalUsers,
            description: "Generated accounts",
            type: "users",
            iconBox: "bg-blue-50 text-blue-600",
            valueColor: "text-blue-600",
        },
        {
            title: "Active Accounts",
            value: activeUsers,
            description: "Users allowed to login",
            type: "active",
            iconBox: "bg-emerald-50 text-emerald-600",
            valueColor: "text-emerald-600",
        },
        {
            title: "Pending Users",
            value: pendingUsers,
            description: "Waiting for credentials",
            type: "pending",
            iconBox: "bg-orange-50 text-orange-500",
            valueColor: "text-orange-500",
        },
        {
            title: "Deactivated",
            value: deactivatedUsers,
            description: "Login access disabled",
            type: "deactivated",
            iconBox: "bg-slate-100 text-slate-500",
            valueColor: "text-slate-800",
        },
    ];


    return (
        <section
            className="
                grid
                gap-3
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
                            card.title
                        }
                        className="
                            min-w-0
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            shadow-sm
                            sm:p-5
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
                            <div
                                className={`
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full

                                    ${card.iconBox}
                                `}
                            >
                                <StatIcon
                                    type={
                                        card.type
                                    }
                                />
                            </div>
                        </div>


                        <div
                            className="
                                mt-4
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    text-slate-600
                                "
                            >
                                {card.title}
                            </p>


                            <p
                                className={`
                                    mt-1
                                    text-[26px]
                                    font-bold
                                    leading-none

                                    ${card.valueColor}
                                `}
                            >
                                {loading
                                    ? "..."
                                    : card.value}
                            </p>


                            <p
                                className="
                                    mt-2
                                    text-[8px]
                                    font-medium
                                    text-slate-500
                                "
                            >
                                {card.description}
                            </p>
                        </div>
                    </article>
                )
            )}
        </section>
    );
}


function StatIcon({
    type,
}) {
    const iconClass =
        "h-[17px] w-[17px]";


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
                className={
                    iconClass
                }
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
                className={
                    iconClass
                }
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
                className={
                    iconClass
                }
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
            className={
                iconClass
            }
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