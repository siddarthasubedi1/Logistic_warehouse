function TrainerProgressOverview() {
    // ======================================================
    // CURRENT DISPLAY VALUES
    // ======================================================

    const chartValues = [
        42,
        45,
        48,
        52,
        55,
        56,
        57,
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
                    to-emerald-50/40
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
                            bg-emerald-50
                            text-emerald-600
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <path d="M4 19V9" />

                            <path d="M10 19V5" />

                            <path d="M16 19v-7" />

                            <path d="M22 19H2" />
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
                            Trainee Progress Overview
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Overall progress in the Manual Handling
                            module.
                        </p>

                    </div>

                </div>


                <div className="relative">

                    <select
                        className="
                            h-9
                            appearance-none
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            pl-3
                            pr-8
                            text-[9px]
                            font-semibold
                            text-slate-600
                            outline-none
                            transition
                            focus:border-blue-400
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >
                        <option>
                            This Week
                        </option>
                    </select>


                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="
                            pointer-events-none
                            absolute
                            right-2.5
                            top-1/2
                            h-3.5
                            w-3.5
                            -translate-y-1/2
                            text-slate-400
                        "
                    >
                        <path d="m7 10 5 5 5-5" />
                    </svg>

                </div>

            </div>


            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <div
                className="
                    grid
                    gap-6
                    p-4
                    sm:p-5
                    lg:grid-cols-[180px_minmax(0,1fr)]
                "
            >

                {/* ================================================= */}
                {/* DONUT */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        justify-center
                    "
                >

                    <div
                        className="
                            relative
                            flex
                            h-[138px]
                            w-[138px]
                            items-center
                            justify-center
                            rounded-full
                            shadow-inner
                        "
                        style={{
                            background:
                                "conic-gradient(#22c55e 0 57%, #f59e0b 57% 89%, #cbd5e1 89% 100%)",
                        }}
                    >

                        <div
                            className="
                                flex
                                h-[90px]
                                w-[90px]
                                flex-col
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                shadow-sm
                            "
                        >

                            <span
                                className="
                                    text-2xl
                                    font-bold
                                    text-slate-900
                                "
                            >
                                57%
                            </span>


                            <span
                                className="
                                    mt-0.5
                                    text-center
                                    text-[8px]
                                    leading-3
                                    text-slate-400
                                "
                            >
                                Average
                                <br />
                                Completion
                            </span>

                        </div>

                    </div>


                    <span
                        className="
                            mt-4
                            rounded-full
                            bg-emerald-50
                            px-3
                            py-1.5
                            text-[9px]
                            font-semibold
                            text-emerald-700
                        "
                    >
                        28 Trainees
                    </span>

                </div>


                {/* ================================================= */}
                {/* SUMMARY */}
                {/* ================================================= */}

                <div className="min-w-0">

                    <div
                        className="
                            grid
                            gap-3
                            sm:grid-cols-3
                            lg:grid-cols-1
                            xl:grid-cols-3
                        "
                    >

                        <ProgressItem
                            label="Completed"
                            value="16 (57%)"
                            type="completed"
                        />


                        <ProgressItem
                            label="In Progress"
                            value="9 (32%)"
                            type="progress"
                        />


                        <ProgressItem
                            label="Not Started"
                            value="3 (11%)"
                            type="notStarted"
                        />

                    </div>


                    {/* ================================================= */}
                    {/* CHART */}
                    {/* ================================================= */}

                    <div
                        className="
                            mt-5
                            rounded-xl
                            border
                            border-slate-100
                            bg-slate-50/70
                            p-3
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
                                        text-[10px]
                                        font-bold
                                        text-slate-700
                                    "
                                >
                                    Weekly Completion Trend
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        text-slate-400
                                    "
                                >
                                    13 May – 19 May
                                </p>

                            </div>


                            <span
                                className="
                                    rounded-full
                                    bg-white
                                    px-2.5
                                    py-1
                                    text-[8px]
                                    font-semibold
                                    text-emerald-600
                                    shadow-sm
                                "
                            >
                                +15%
                            </span>

                        </div>


                        <div
                            className="
                                mt-5
                                flex
                                h-[120px]
                                items-end
                                gap-2
                                sm:gap-3
                            "
                        >

                            {chartValues.map(
                                (
                                    value,
                                    index
                                ) => (
                                    <div
                                        key={
                                            `${value}-${index}`
                                        }
                                        className="
                                            flex
                                            h-full
                                            min-w-0
                                            flex-1
                                            flex-col
                                            items-center
                                            justify-end
                                        "
                                    >

                                        <span
                                            className="
                                                mb-1
                                                text-[7px]
                                                font-semibold
                                                text-slate-500
                                            "
                                        >
                                            {value}%
                                        </span>


                                        <div
                                            className="
                                                flex
                                                h-[80px]
                                                w-full
                                                max-w-[30px]
                                                items-end
                                                overflow-hidden
                                                rounded-t-lg
                                                bg-slate-200/70
                                            "
                                        >

                                            <div
                                                className="
                                                    w-full
                                                    rounded-t-lg
                                                    bg-emerald-400
                                                    transition-all
                                                "
                                                style={{
                                                    height:
                                                        `${value}%`,
                                                }}
                                            />

                                        </div>


                                        <span
                                            className="
                                                mt-2
                                                whitespace-nowrap
                                                text-[7px]
                                                text-slate-400
                                            "
                                        >
                                            {13 + index} May
                                        </span>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}


// ======================================================
// PROGRESS ITEM
// ======================================================

function ProgressItem({
    label,
    value,
    type,
}) {
    const styles = {
        completed: {
            wrapper:
                "border-emerald-100 bg-emerald-50/70",

            dot:
                "bg-emerald-500",

            value:
                "text-emerald-700",
        },

        progress: {
            wrapper:
                "border-orange-100 bg-orange-50/70",

            dot:
                "bg-orange-400",

            value:
                "text-orange-600",
        },

        notStarted: {
            wrapper:
                "border-slate-200 bg-slate-50",

            dot:
                "bg-slate-400",

            value:
                "text-slate-600",
        },
    };


    const style =
        styles[type];


    return (
        <div
            className={`
                rounded-xl
                border
                p-3

                ${style.wrapper}
            `}
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <span
                    className={`
                        h-2
                        w-2
                        rounded-full

                        ${style.dot}
                    `}
                />


                <span
                    className="
                        text-[9px]
                        font-semibold
                        text-slate-600
                    "
                >
                    {label}
                </span>

            </div>


            <p
                className={`
                    mt-2
                    text-[11px]
                    font-bold

                    ${style.value}
                `}
            >
                {value}
            </p>

        </div>
    );
}


export default TrainerProgressOverview;