function TrainerStats() {
    const stats = [
        {
            title: "Total Trainees",
            value: "28",
            subtitle: "Assigned to you",
            action: "View Trainees",
            type: "users",
        },
        {
            title: "Completed",
            value: "16",
            subtitle: "57% Completion",
            action: "View Progress",
            type: "complete",
        },
        {
            title: "In Progress",
            value: "9",
            subtitle: "32% In Progress",
            action: "View Progress",
            type: "progress",
        },
        {
            title: "Not Started",
            value: "3",
            subtitle: "11% Not Started",
            action: "View Trainees",
            type: "notstarted",
        },
    ];


    return (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => (
                <StatCard
                    key={stat.title}
                    {...stat}
                />
            ))}

        </section>
    );
}


function StatCard({
    title,
    value,
    subtitle,
    action,
    type,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-start gap-3">

                <StatIcon type={type} />


                <div>

                    <p className="text-[8px] text-slate-500">
                        {title}
                    </p>

                    <p className="mt-1 text-[22px] font-bold text-slate-900">
                        {value}
                    </p>

                    <p className="text-[8px] text-slate-400">
                        {subtitle}
                    </p>

                </div>

            </div>


            <button
                type="button"
                className="mt-5 w-full text-center text-[8px] font-semibold text-blue-600"
            >
                {action} →
            </button>

        </div>
    );
}


function StatIcon({ type }) {
    const styles = {
        users: "bg-blue-50 text-blue-600",
        complete: "bg-emerald-50 text-emerald-600",
        progress: "bg-orange-50 text-orange-500",
        notstarted: "bg-slate-100 text-slate-500",
    };


    return (
        <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles[type]}`}
        >
            {type === "users" && (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                >
                    <circle cx="9" cy="8" r="3" />
                    <circle cx="17" cy="9" r="2" />
                    <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />
                    <path d="M15 15c3 0 5 1.6 5.5 5" />
                </svg>
            )}


            {type === "complete" && (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                >
                    <circle cx="12" cy="12" r="9" />
                    <path d="m8 12 2.5 2.5L16 9" />
                </svg>
            )}


            {type === "progress" && (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </svg>
            )}


            {type === "notstarted" && (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12h8" />
                </svg>
            )}

        </div>
    );
}


export default TrainerStats;