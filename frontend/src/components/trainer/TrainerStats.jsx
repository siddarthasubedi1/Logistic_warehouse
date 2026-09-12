function TrainerStats({
    totalTrainees = 0,
    completed = 0,
    inProgress = 0,
    notStarted = 0,
}) {
    const stats = [
        {
            title: "Total Trainees",
            value: totalTrainees,
            type: "users",
        },

        {
            title: "Completed",
            value: completed,
            type: "completed",
        },

        {
            title: "In Progress",
            value: inProgress,
            type: "progress",
        },

        {
            title: "Not Started",
            value: notStarted,
            type: "not-started",
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
            {stats.map(
                (
                    stat
                ) => (
                    <article
                        key={
                            stat.title
                        }
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-[8px]
                                        text-slate-400
                                    "
                                >
                                    {stat.title}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    {stat.value}
                                </p>
                            </div>


                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-50
                                    text-blue-600
                                "
                            >
                                <StatIcon
                                    type={
                                        stat.type
                                    }
                                />
                            </div>
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
                className="h-4 w-4"
            >
                <circle
                    cx="9"
                    cy="8"
                    r="3"
                />

                <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                <path d="M16 7a3 3 0 0 1 0 6" />
            </svg>
        );
    }


    if (
        type ===
        "completed"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
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
        "progress"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
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
            className="h-4 w-4"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
            />

            <path d="M8 12h8" />
        </svg>
    );
}


export default TrainerStats;