function TrainerProgressOverview({
    progress = [],
}) {
    const safeProgress =
        Array.isArray(
            progress
        )
            ? progress
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
                    Trainee Progress
                </h2>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-400
                    "
                >
                    Overview of Trainee training progress.
                </p>
            </div>


            {/* EMPTY */}

            {safeProgress.length ===
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
                            <path d="M4 18h16" />
                            <path d="M6 15V9" />
                            <path d="M12 15V5" />
                            <path d="M18 15v-3" />
                        </svg>
                    </div>


                    <p
                        className="
                            mt-3
                            text-[9px]
                            text-slate-400
                        "
                    >
                        No progress information available.
                    </p>
                </div>
            ) : (
                <div
                    className="
                        divide-y
                        divide-slate-100
                    "
                >
                    {safeProgress.map(
                        (
                            item,
                            index
                        ) => {
                            const percentage =
                                Math.max(
                                    0,
                                    Math.min(
                                        100,
                                        Number(
                                            item.percentage ??
                                            item.progress ??
                                            0
                                        )
                                    )
                                );


                            return (
                                <article
                                    key={
                                        item._id ||
                                        item.id ||
                                        index
                                    }
                                    className="
                                        px-4
                                        py-4
                                        sm:px-5
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            flex-col
                                            gap-2
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                        "
                                    >
                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >
                                            <p
                                                className="
                                                    truncate
                                                    text-[9px]
                                                    font-medium
                                                    text-slate-700
                                                "
                                            >
                                                {item.name ||
                                                    item.traineeName ||
                                                    "Trainee"}
                                            </p>


                                            {item.programmeTitle && (
                                                <p
                                                    className="
                                                        mt-1
                                                        truncate
                                                        text-[7px]
                                                        text-slate-400
                                                    "
                                                >
                                                    {
                                                        item.programmeTitle
                                                    }
                                                </p>
                                            )}
                                        </div>


                                        <span
                                            className="
                                                text-[8px]
                                                font-semibold
                                                text-blue-600
                                            "
                                        >
                                            {percentage}%
                                        </span>
                                    </div>


                                    <div
                                        className="
                                            mt-3
                                            h-1.5
                                            overflow-hidden
                                            rounded-full
                                            bg-slate-100
                                        "
                                    >
                                        <div
                                            className="
                                                h-full
                                                rounded-full
                                                bg-blue-600
                                            "
                                            style={{
                                                width:
                                                    `${percentage}%`,
                                            }}
                                        />
                                    </div>
                                </article>
                            );
                        }
                    )}
                </div>
            )}
        </section>
    );
}


export default TrainerProgressOverview;