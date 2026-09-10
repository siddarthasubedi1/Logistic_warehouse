function TrainerRecentActivity() {
    // ======================================================
    // CURRENT ACTIVITY DATA
    // ======================================================

    const activities = [
        {
            type: "complete",
            text: "Sakar Gurung completed Quiz 5: Safe Lifting Techniques",
            time: "19 May 2024, 10:12 AM",
        },
        {
            type: "edit",
            text: "You updated Lesson 6: Team Lifting Techniques",
            time: "19 May 2024, 09:45 AM",
        },
        {
            type: "user",
            text: "Priya Sharma submitted Assignment 1",
            time: "19 May 2024, 09:10 AM",
        },
        {
            type: "assignment",
            text: "New trainee Ramesh Adhikari assigned to Manual Handling",
            time: "18 May 2024, 04:30 PM",
        },
        {
            type: "complete",
            text: "Kiran Tamang completed Scenario: Warehouse Lifting",
            time: "18 May 2024, 02:15 PM",
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
                    px-4
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
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
                            bg-violet-50
                            text-violet-600
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <path d="M12 8v4l3 2" />

                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />
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
                            Recent Activity
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Latest activity from your Manual Handling
                            training area.
                        </p>

                    </div>

                </div>


                <span
                    className="
                        w-fit
                        rounded-full
                        bg-violet-50
                        px-3
                        py-1.5
                        text-[9px]
                        font-semibold
                        text-violet-700
                    "
                >
                    {activities.length} Recent
                </span>

            </div>


            {/* ================================================= */}
            {/* ACTIVITY TIMELINE */}
            {/* ================================================= */}

            <div
                className="
                    px-4
                    sm:px-5
                "
            >

                {activities.map(
                    (
                        activity,
                        index
                    ) => (
                        <ActivityRow
                            key={
                                `${activity.text}-${index}`
                            }
                            activity={
                                activity
                            }
                            last={
                                index ===
                                activities.length -
                                1
                            }
                        />
                    )
                )}

            </div>


            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div
                className="
                    border-t
                    border-slate-100
                    bg-slate-50/70
                    p-4
                "
            >

                <button
                    type="button"
                    className="
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        gap-1.5
                        rounded-xl
                        border
                        border-blue-100
                        bg-white
                        px-4
                        py-2.5
                        text-[9px]
                        font-semibold
                        text-blue-700
                        shadow-sm
                        transition
                        hover:border-blue-200
                        hover:bg-blue-50
                    "
                >
                    View All Activity

                    <span>
                        →
                    </span>
                </button>

            </div>

        </section>
    );
}


// ======================================================
// ACTIVITY ROW
// ======================================================

function ActivityRow({
    activity,
    last,
}) {
    return (
        <div
            className="
                relative
                flex
                gap-3
                py-4
            "
        >

            {/* TIMELINE LINE */}

            {!last && (
                <span
                    className="
                        absolute
                        bottom-0
                        left-[17px]
                        top-[48px]
                        w-px
                        bg-slate-200
                    "
                />
            )}


            {/* ICON */}

            <ActivityIcon
                type={
                    activity.type
                }
            />


            {/* TEXT */}

            <div
                className="
                    min-w-0
                    flex-1
                "
            >

                <p
                    className="
                        break-words
                        text-[10px]
                        leading-5
                        text-slate-700
                    "
                >
                    {activity.text}
                </p>


                <div
                    className="
                        mt-2
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    "
                >

                    <ActivityTypeBadge
                        type={
                            activity.type
                        }
                    />


                    <span
                        className="
                            text-[8px]
                            text-slate-400
                        "
                    >
                        {activity.time}
                    </span>

                </div>

            </div>

        </div>
    );
}


// ======================================================
// ACTIVITY ICON
// ======================================================

function ActivityIcon({
    type,
}) {
    const styles = {
        complete:
            "bg-emerald-50 text-emerald-600 ring-emerald-100",

        edit:
            "bg-violet-50 text-violet-600 ring-violet-100",

        assignment:
            "bg-orange-50 text-orange-600 ring-orange-100",

        user:
            "bg-blue-50 text-blue-600 ring-blue-100",
    };


    const style =
        styles[type] ||
        styles.user;


    return (
        <div
            className={`
                relative
                z-10
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                ring-1
                ring-inset

                ${style}
            `}
        >

            {type ===
                "complete" ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                    />

                    <path d="m8 12 2.5 2.5L16 9" />
                </svg>
            ) : type ===
                "edit" ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                >
                    <path d="m4 16 10-10 4 4L8 20H4v-4Z" />

                    <path d="m12 8 4 4" />
                </svg>
            ) : type ===
                "assignment" ? (
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

                    <path d="M3 20c.5-4 2.5-6 6-6" />

                    <path d="M16 8h5" />

                    <path d="M18.5 5.5v5" />
                </svg>
            ) : (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                >
                    <circle
                        cx="12"
                        cy="8"
                        r="3"
                    />

                    <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                </svg>
            )}

        </div>
    );
}


// ======================================================
// ACTIVITY TYPE BADGE
// ======================================================

function ActivityTypeBadge({
    type,
}) {
    const values = {
        complete: {
            label:
                "Completed",

            style:
                "bg-emerald-50 text-emerald-700",
        },

        edit: {
            label:
                "Updated",

            style:
                "bg-violet-50 text-violet-700",
        },

        assignment: {
            label:
                "Assigned",

            style:
                "bg-orange-50 text-orange-700",
        },

        user: {
            label:
                "Trainee Activity",

            style:
                "bg-blue-50 text-blue-700",
        },
    };


    const current =
        values[type] ||
        values.user;


    return (
        <span
            className={`
                rounded-full
                px-2
                py-1
                text-[8px]
                font-semibold

                ${current.style}
            `}
        >
            {current.label}
        </span>
    );
}


export default TrainerRecentActivity;