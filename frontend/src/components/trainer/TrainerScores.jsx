function TrainerScores() {
    // ======================================================
    // CURRENT SCORE DATA
    // ======================================================

    const trainees = [
        {
            name: "Sakar Gurung",
            quiz: "Quiz 5: Safe Lifting Techniques",
            score: 92,
            date: "19 May 2024",
        },
        {
            name: "Priya Sharma",
            quiz: "Quiz 5: Safe Lifting Techniques",
            score: 84,
            date: "19 May 2024",
        },
        {
            name: "Kiran Tamang",
            quiz: "Quiz 4: Risk Awareness",
            score: 75,
            date: "18 May 2024",
        },
        {
            name: "Deepa Bista",
            quiz: "Quiz 4: Risk Awareness",
            score: 68,
            date: "18 May 2024",
        },
        {
            name: "Ramesh Adhikari",
            quiz: "Quiz 3: Manual Handling Hazards",
            score: 55,
            date: "17 May 2024",
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
                            <path d="M5 4h14v16H5z" />

                            <path d="M8 9h8" />

                            <path d="m8 14 2 2 5-5" />
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
                            Trainee Scores
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Latest quiz scores in Manual Handling.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="
                        inline-flex
                        w-fit
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-blue-100
                        bg-blue-50
                        px-3
                        py-2
                        text-[9px]
                        font-semibold
                        text-blue-700
                        transition
                        hover:border-blue-200
                        hover:bg-blue-100
                    "
                >
                    View All Scores

                    <span>
                        →
                    </span>
                </button>

            </div>


            {/* ================================================= */}
            {/* MOBILE CARDS */}
            {/* ================================================= */}

            <div
                className="
                    space-y-3
                    p-4
                    lg:hidden
                "
            >

                {trainees.map(
                    (
                        trainee
                    ) => (
                        <ScoreCard
                            key={
                                trainee.name
                            }
                            trainee={
                                trainee
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
                        min-w-[650px]
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
                                Trainee
                            </Heading>

                            <Heading>
                                Latest Quiz
                            </Heading>

                            <Heading>
                                Score
                            </Heading>

                            <Heading>
                                Date
                            </Heading>

                        </tr>

                    </thead>


                    <tbody
                        className="
                            divide-y
                            divide-slate-100
                        "
                    >

                        {trainees.map(
                            (
                                trainee
                            ) => (
                                <tr
                                    key={
                                        trainee.name
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

                                            <Avatar
                                                name={
                                                    trainee.name
                                                }
                                            />


                                            <span
                                                className="
                                                    text-[10px]
                                                    font-semibold
                                                    text-slate-800
                                                "
                                            >
                                                {trainee.name}
                                            </span>

                                        </div>

                                    </td>


                                    <td className="px-5 py-4">

                                        <p
                                            className="
                                                max-w-[230px]
                                                text-[9px]
                                                leading-4
                                                text-slate-600
                                            "
                                        >
                                            {trainee.quiz}
                                        </p>

                                    </td>


                                    <td className="px-5 py-4">

                                        <ScoreBadge
                                            score={
                                                trainee.score
                                            }
                                        />

                                    </td>


                                    <td
                                        className="
                                            whitespace-nowrap
                                            px-5
                                            py-4
                                            text-[9px]
                                            text-slate-500
                                        "
                                    >
                                        {trainee.date}
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
// MOBILE SCORE CARD
// ======================================================

function ScoreCard({
    trainee,
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
                        min-w-0
                        items-center
                        gap-3
                    "
                >

                    <Avatar
                        name={
                            trainee.name
                        }
                    />


                    <div className="min-w-0">

                        <p
                            className="
                                truncate
                                text-[11px]
                                font-bold
                                text-slate-900
                            "
                        >
                            {trainee.name}
                        </p>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-slate-400
                            "
                        >
                            {trainee.date}
                        </p>

                    </div>

                </div>


                <ScoreBadge
                    score={
                        trainee.score
                    }
                />

            </div>


            <div
                className="
                    mt-4
                    rounded-xl
                    bg-slate-50
                    p-3
                "
            >

                <p
                    className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                    "
                >
                    Latest Quiz
                </p>


                <p
                    className="
                        mt-1
                        text-[10px]
                        leading-5
                        text-slate-700
                    "
                >
                    {trainee.quiz}
                </p>

            </div>

        </article>
    );
}


// ======================================================
// AVATAR
// ======================================================

function Avatar({
    name,
}) {
    return (
        <div
            className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-100
                text-[10px]
                font-bold
                text-blue-700
            "
        >
            {name
                .charAt(
                    0
                )
                .toUpperCase()}
        </div>
    );
}


// ======================================================
// SCORE BADGE
// ======================================================

function ScoreBadge({
    score,
}) {
    let style =
        "bg-red-50 text-red-600 ring-red-100";


    if (
        score >=
        80
    ) {
        style =
            "bg-emerald-50 text-emerald-700 ring-emerald-100";

    } else if (
        score >=
        70
    ) {
        style =
            "bg-orange-50 text-orange-600 ring-orange-100";
    }


    return (
        <span
            className={`
                inline-flex
                min-w-[48px]
                items-center
                justify-center
                rounded-full
                px-2.5
                py-1
                text-[9px]
                font-bold
                ring-1
                ring-inset

                ${style}
            `}
        >
            {score}%
        </span>
    );
}


// ======================================================
// HEADING
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


export default TrainerScores;