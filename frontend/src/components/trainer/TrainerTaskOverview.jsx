function TrainerTaskOverview({
    tasks = [],
}) {
    const safeTasks =
        Array.isArray(
            tasks
        )
            ? tasks
            : [];


    return (
        <section
            className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            {/* HEADER */}

            <div
                className="
                    border-b
                    border-slate-100
                    px-4
                    py-4
                    sm:px-5
                "
            >
                <h2
                    className="
                        text-[11px]
                        font-semibold
                        text-slate-800
                    "
                >
                    Training Tasks
                </h2>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-400
                    "
                >
                    Training tasks will appear here when available.
                </p>
            </div>


            {safeTasks.length ===
                0 ? (
                <div
                    className="
                        py-10
                        text-center
                    "
                >
                    <div
                        className="
                            mx-auto
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-100
                            text-slate-400
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <rect
                                x="5"
                                y="4"
                                width="14"
                                height="16"
                                rx="2"
                            />

                            <path d="m8 10 2 2 4-4" />

                            <path d="M8 16h8" />
                        </svg>
                    </div>


                    <p
                        className="
                            mt-3
                            text-[9px]
                            text-slate-400
                        "
                    >
                        No training tasks available.
                    </p>
                </div>
            ) : (
                <div
                    className="
                        grid
                        gap-3
                        p-4
                        md:grid-cols-2
                        sm:p-5
                    "
                >
                    {safeTasks.map(
                        (
                            task,
                            index
                        ) => (
                            <article
                                key={
                                    task._id ||
                                    task.id ||
                                    index
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    p-4
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
                                    <div>
                                        <h3
                                            className="
                                                text-[10px]
                                                font-medium
                                                text-slate-700
                                            "
                                        >
                                            {task.title ||
                                                "Training Task"}
                                        </h3>


                                        {task.description && (
                                            <p
                                                className="
                                                    mt-1
                                                    text-[8px]
                                                    leading-4
                                                    text-slate-500
                                                "
                                            >
                                                {
                                                    task.description
                                                }
                                            </p>
                                        )}
                                    </div>


                                    <TaskStatus
                                        status={
                                            task.status
                                        }
                                    />
                                </div>


                                {task.traineeName && (
                                    <p
                                        className="
                                            mt-3
                                            text-[7px]
                                            text-slate-400
                                        "
                                    >
                                        Trainee:{" "}

                                        <span
                                            className="
                                                font-medium
                                                text-slate-600
                                            "
                                        >
                                            {
                                                task.traineeName
                                            }
                                        </span>
                                    </p>
                                )}
                            </article>
                        )
                    )}
                </div>
            )}
        </section>
    );
}


function TaskStatus({
    status,
}) {
    if (!status) {
        return null;
    }


    const normalized =
        String(
            status
        ).toLowerCase();


    const completed =
        [
            "completed",
            "complete",
            "done",
        ].includes(
            normalized
        );


    return (
        <span
            className={`
                shrink-0
                rounded-full
                px-2.5
                py-1
                text-[7px]
                font-medium

                ${completed
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-blue-50 text-blue-600"
                }
            `}
        >
            {status}
        </span>
    );
}


export default TrainerTaskOverview;