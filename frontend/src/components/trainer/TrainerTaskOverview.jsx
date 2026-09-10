function TrainerTaskOverview() {
    // ======================================================
    // CURRENT TASK DATA
    // ======================================================

    const tasks = [
        {
            name: "Lessons",
            total: 10,
            completed: "16 (57%)",
            progress: "9 (32%)",
            notStarted: "3 (11%)",
            type: "lesson",
        },
        {
            name: "Scenario Activities",
            total: 5,
            completed: "17 (61%)",
            progress: "7 (25%)",
            notStarted: "4 (14%)",
            type: "scenario",
        },
        {
            name: "Quizzes",
            total: 5,
            completed: "18 (64%)",
            progress: "6 (21%)",
            notStarted: "4 (14%)",
            type: "quiz",
        },
        {
            name: "Assignments",
            total: 2,
            completed: "12 (43%)",
            progress: "8 (29%)",
            notStarted: "8 (28%)",
            type: "assignment",
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
                            bg-blue-50
                            text-blue-600
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <path d="M5 4h14v16H5z" />

                            <path d="M8 8h8" />

                            <path d="M8 12h8" />

                            <path d="M8 16h5" />
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
                            Trainee Task Overview
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                leading-5
                                text-slate-500
                            "
                        >
                            View Trainee activity within Manual Handling.
                        </p>

                    </div>

                </div>


                <span
                    className="
                        w-fit
                        rounded-full
                        bg-blue-50
                        px-3
                        py-1.5
                        text-[9px]
                        font-semibold
                        text-blue-700
                    "
                >
                    Manual Handling
                </span>

            </div>


            {/* ================================================= */}
            {/* MOBILE CARDS */}
            {/* ================================================= */}

            <div
                className="
                    grid
                    gap-3
                    p-4
                    md:grid-cols-2
                    lg:hidden
                "
            >

                {tasks.map(
                    (
                        task
                    ) => (
                        <TaskCard
                            key={
                                task.name
                            }
                            task={
                                task
                            }
                        />
                    )
                )}

            </div>


            {/* ================================================= */}
            {/* DESKTOP TABLE */}
            {/* ================================================= */}

            <div
                className="
                    hidden
                    overflow-x-auto
                    lg:block
                "
            >

                <table
                    className="
                        w-full
                        min-w-[620px]
                    "
                >

                    <thead className="bg-slate-50">

                        <tr
                            className="
                                text-left
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >

                            <Heading>
                                Task Type
                            </Heading>

                            <Heading>
                                Total
                            </Heading>

                            <Heading>
                                Completed
                            </Heading>

                            <Heading>
                                In Progress
                            </Heading>

                            <Heading>
                                Not Started
                            </Heading>

                        </tr>

                    </thead>


                    <tbody
                        className="
                            divide-y
                            divide-slate-100
                        "
                    >

                        {tasks.map(
                            (
                                task
                            ) => (
                                <tr
                                    key={
                                        task.name
                                    }
                                    className="
                                        bg-white
                                        transition
                                        hover:bg-slate-50
                                    "
                                >

                                    <td className="px-5 py-4">

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >

                                            <TaskIcon
                                                type={
                                                    task.type
                                                }
                                            />


                                            <span
                                                className="
                                                    text-[10px]
                                                    font-semibold
                                                    text-slate-800
                                                "
                                            >
                                                {task.name}
                                            </span>

                                        </div>

                                    </td>


                                    <td
                                        className="
                                            px-5
                                            py-4
                                            text-[10px]
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        {task.total}
                                    </td>


                                    <td className="px-5 py-4">

                                        <StatusValue
                                            value={
                                                task.completed
                                            }
                                            type="completed"
                                        />

                                    </td>


                                    <td className="px-5 py-4">

                                        <StatusValue
                                            value={
                                                task.progress
                                            }
                                            type="progress"
                                        />

                                    </td>


                                    <td className="px-5 py-4">

                                        <StatusValue
                                            value={
                                                task.notStarted
                                            }
                                            type="notStarted"
                                        />

                                    </td>

                                </tr>
                            )
                        )}

                    </tbody>

                </table>

            </div>

        </section>
    );
}


// ======================================================
// MOBILE TASK CARD
// ======================================================

function TaskCard({
    task,
}) {
    return (
        <article
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
                    items-start
                    justify-between
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <TaskIcon
                        type={
                            task.type
                        }
                    />


                    <div>

                        <p
                            className="
                                text-[11px]
                                font-bold
                                text-slate-900
                            "
                        >
                            {task.name}
                        </p>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-slate-500
                            "
                        >
                            {task.total} task
                            {task.total === 1
                                ? ""
                                : "s"}
                        </p>

                    </div>

                </div>


                <span
                    className="
                        rounded-full
                        bg-slate-100
                        px-2.5
                        py-1
                        text-[9px]
                        font-semibold
                        text-slate-600
                    "
                >
                    Total {task.total}
                </span>

            </div>


            <div
                className="
                    mt-4
                    grid
                    gap-2
                    sm:grid-cols-3
                "
            >

                <MobileMetric
                    label="Completed"
                    value={
                        task.completed
                    }
                    type="completed"
                />


                <MobileMetric
                    label="In Progress"
                    value={
                        task.progress
                    }
                    type="progress"
                />


                <MobileMetric
                    label="Not Started"
                    value={
                        task.notStarted
                    }
                    type="notStarted"
                />

            </div>

        </article>
    );
}


// ======================================================
// MOBILE METRIC
// ======================================================

function MobileMetric({
    label,
    value,
    type,
}) {
    const styles = {
        completed:
            "bg-emerald-50 text-emerald-700",

        progress:
            "bg-orange-50 text-orange-600",

        notStarted:
            "bg-slate-100 text-slate-600",
    };


    return (
        <div
            className={`
                rounded-xl
                p-3
                ${styles[type]}
            `}
        >

            <p
                className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-wide
                    opacity-70
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    text-[10px]
                    font-bold
                "
            >
                {value}
            </p>

        </div>
    );
}


// ======================================================
// STATUS VALUE
// ======================================================

function StatusValue({
    value,
    type,
}) {
    const styles = {
        completed:
            "bg-emerald-50 text-emerald-700 ring-emerald-100",

        progress:
            "bg-orange-50 text-orange-600 ring-orange-100",

        notStarted:
            "bg-slate-100 text-slate-600 ring-slate-200",
    };


    return (
        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-[9px]
                font-semibold
                ring-1
                ring-inset

                ${styles[type]}
            `}
        >
            {value}
        </span>
    );
}


// ======================================================
// TASK ICON
// ======================================================

function TaskIcon({
    type,
}) {
    let style =
        "bg-blue-50 text-blue-600";


    if (
        type ===
        "scenario"
    ) {
        style =
            "bg-violet-50 text-violet-600";
    }


    if (
        type ===
        "quiz"
    ) {
        style =
            "bg-emerald-50 text-emerald-600";
    }


    if (
        type ===
        "assignment"
    ) {
        style =
            "bg-amber-50 text-amber-600";
    }


    return (
        <div
            className={`
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl

                ${style}
            `}
        >

            {type ===
                "scenario" ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                >
                    <path d="M4 18 10 6l4 8 2-4 4 8H4Z" />
                </svg>
            ) : type ===
                "quiz" ? (
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

                    <path d="M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-.9.6-1.5 1-1.5 2.2" />

                    <path d="M12 17h.01" />
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
                    <path d="M6 4h12v16H6z" />

                    <path d="M9 8h6" />

                    <path d="M9 12h6" />

                    <path d="M9 16h4" />
                </svg>
            ) : (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                >
                    <path d="M4 5h7v14H4z" />

                    <path d="M13 5h7v14h-7z" />
                </svg>
            )}

        </div>
    );
}


// ======================================================
// TABLE HEADING
// ======================================================

function Heading({
    children,
}) {
    return (
        <th
            className="
                px-5
                py-3.5
            "
        >
            {children}
        </th>
    );
}


export default TrainerTaskOverview;