function AdminStats({
    loading,
    totalUsers,
    activeUsers,
    pendingUsers,
    deactivatedUsers,
}) {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
                title="Total Users"
                value={
                    loading
                        ? "..."
                        : totalUsers
                }
                description="Generated accounts"
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
                description="Users allowed to login"
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
                description="Login access disabled"
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
            icon:
                "bg-blue-50 text-blue-600",

            value:
                "text-blue-700",
        },

        green: {
            icon:
                "bg-emerald-50 text-emerald-600",

            value:
                "text-emerald-700",
        },

        orange: {
            icon:
                "bg-orange-50 text-orange-500",

            value:
                "text-orange-600",
        },

        slate: {
            icon:
                "bg-slate-100 text-slate-500",

            value:
                "text-slate-700",
        },
    };


    const style =
        styles[tone];


    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-start justify-between">

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${style.icon}`}
                >
                    <StatIcon
                        type={type}
                    />
                </div>


                <span className="rounded-full bg-slate-50 px-2 py-1 text-[8px] font-semibold text-slate-400">
                    Sprint 1
                </span>

            </div>


            <p className="mt-4 text-[10px] font-medium text-slate-500">
                {title}
            </p>


            <p
                className={`mt-1 text-2xl font-bold ${style.value}`}
            >
                {value}
            </p>


            <p className="mt-1 text-[9px] text-slate-400">
                {description}
            </p>

        </div>
    );
}


function StatIcon({
    type,
}) {
    if (type === "users") {
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


    if (type === "active") {
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


    if (type === "pending") {
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