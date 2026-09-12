function TrainerRecentActivity({
    activities = [],
}) {
    const safeActivities =
        Array.isArray(
            activities
        )
            ? activities
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
                    Recent Activity
                </h2>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-400
                    "
                >
                    Recent training activity.
                </p>
            </div>


            {/* EMPTY */}

            {safeActivities.length ===
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
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />

                            <path d="M12 7v5l3 2" />
                        </svg>
                    </div>


                    <p
                        className="
                            mt-3
                            text-[9px]
                            text-slate-400
                        "
                    >
                        No recent activity available.
                    </p>
                </div>
            ) : (
                <div
                    className="
                        divide-y
                        divide-slate-100
                    "
                >
                    {safeActivities.map(
                        (
                            activity,
                            index
                        ) => (
                            <article
                                key={
                                    activity._id ||
                                    activity.id ||
                                    index
                                }
                                className="
                                    flex
                                    items-start
                                    gap-3
                                    px-4
                                    py-4
                                    sm:px-5
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-blue-50
                                        text-blue-600
                                    "
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-4 w-4"
                                    >
                                        <path d="M4 5h16v14H4z" />
                                        <path d="M8 9h8" />
                                        <path d="M8 13h5" />
                                    </svg>
                                </div>


                                <div
                                    className="
                                        min-w-0
                                        flex-1
                                    "
                                >
                                    <p
                                        className="
                                            text-[9px]
                                            font-medium
                                            text-slate-700
                                        "
                                    >
                                        {activity.title ||
                                            activity.action ||
                                            "Training activity"}
                                    </p>


                                    {activity.description && (
                                        <p
                                            className="
                                                mt-1
                                                text-[8px]
                                                leading-4
                                                text-slate-500
                                            "
                                        >
                                            {
                                                activity.description
                                            }
                                        </p>
                                    )}


                                    {(activity.createdAt ||
                                        activity.date) && (
                                            <p
                                                className="
                                                mt-1.5
                                                text-[7px]
                                                text-slate-400
                                            "
                                            >
                                                {formatDate(
                                                    activity.createdAt ||
                                                    activity.date
                                                )}
                                            </p>
                                        )}
                                </div>
                            </article>
                        )
                    )}
                </div>
            )}
        </section>
    );
}


function formatDate(
    value
) {
    if (!value) {
        return "";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(
            value
        );
    }


    return date.toLocaleString();
}


export default TrainerRecentActivity;