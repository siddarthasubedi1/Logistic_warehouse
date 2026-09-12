function TrainerScores({
    scores = [],
}) {
    const safeScores =
        Array.isArray(
            scores
        )
            ? scores
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
                    Trainee Scores
                </h2>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-400
                    "
                >
                    Training assessment scores will appear here when available.
                </p>
            </div>


            {safeScores.length ===
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
                            <path d="M5 4h14v16H5z" />
                            <path d="M8 9h8" />
                            <path d="M8 13h5" />
                        </svg>
                    </div>


                    <p
                        className="
                            mt-3
                            text-[9px]
                            text-slate-400
                        "
                    >
                        No score information available.
                    </p>
                </div>
            ) : (
                <>
                    {/* MOBILE */}

                    <div
                        className="
                            space-y-3
                            p-4
                            md:hidden
                        "
                    >
                        {safeScores.map(
                            (
                                score,
                                index
                            ) => (
                                <ScoreCard
                                    key={
                                        score._id ||
                                        score.id ||
                                        index
                                    }
                                    score={
                                        score
                                    }
                                />
                            )
                        )}
                    </div>


                    {/* DESKTOP */}

                    <div
                        className="
                            hidden
                            overflow-x-auto
                            md:block
                        "
                    >
                        <table
                            className="
                                min-w-[650px]
                                w-full
                            "
                        >
                            <thead
                                className="
                                    border-b
                                    border-slate-200
                                    bg-slate-50
                                "
                            >
                                <tr>
                                    <TableHead>
                                        Trainee
                                    </TableHead>

                                    <TableHead>
                                        Assessment
                                    </TableHead>

                                    <TableHead>
                                        Score
                                    </TableHead>

                                    <TableHead>
                                        Result
                                    </TableHead>
                                </tr>
                            </thead>


                            <tbody>
                                {safeScores.map(
                                    (
                                        score,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                score._id ||
                                                score.id ||
                                                index
                                            }
                                            className="
                                                border-b
                                                border-slate-100
                                                last:border-0
                                            "
                                        >
                                            <TableCell strong>
                                                {score.traineeName ||
                                                    score.name ||
                                                    "Trainee"}
                                            </TableCell>


                                            <TableCell>
                                                {score.assessmentTitle ||
                                                    score.quizTitle ||
                                                    score.title ||
                                                    "Assessment"}
                                            </TableCell>


                                            <TableCell>
                                                {formatScore(
                                                    score.score
                                                )}
                                            </TableCell>


                                            <TableCell>
                                                <ResultBadge
                                                    result={
                                                        score.result
                                                    }
                                                />
                                            </TableCell>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </section>
    );
}


function ScoreCard({
    score,
}) {
    return (
        <article
            className="
                rounded-lg
                border
                border-slate-200
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
                    <p
                        className="
                            text-[10px]
                            font-medium
                            text-slate-700
                        "
                    >
                        {score.traineeName ||
                            score.name ||
                            "Trainee"}
                    </p>


                    <p
                        className="
                            mt-1
                            text-[8px]
                            text-slate-400
                        "
                    >
                        {score.assessmentTitle ||
                            score.quizTitle ||
                            score.title ||
                            "Assessment"}
                    </p>
                </div>


                <ResultBadge
                    result={
                        score.result
                    }
                />
            </div>


            <p
                className="
                    mt-4
                    text-lg
                    font-bold
                    text-slate-800
                "
            >
                {formatScore(
                    score.score
                )}
            </p>
        </article>
    );
}


function ResultBadge({
    result,
}) {
    const normalized =
        String(
            result ||
            ""
        ).toLowerCase();


    const passed =
        [
            "pass",
            "passed",
            "complete",
            "completed",
        ].includes(
            normalized
        );


    if (!result) {
        return (
            <span
                className="
                    text-[8px]
                    text-slate-400
                "
            >
                —
            </span>
        );
    }


    return (
        <span
            className={`
                rounded-full
                px-2.5
                py-1
                text-[7px]
                font-medium

                ${passed
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }
            `}
        >
            {result}
        </span>
    );
}


function formatScore(
    score
) {
    if (
        score ===
        undefined ||
        score ===
        null ||
        score ===
        ""
    ) {
        return "—";
    }


    const value =
        String(
            score
        );


    return value.includes(
        "%"
    )
        ? value
        : `${value}%`;
}


function TableHead({
    children,
}) {
    return (
        <th
            className="
                px-5
                py-3
                text-left
                text-[7px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
            "
        >
            {children}
        </th>
    );
}


function TableCell({
    children,
    strong = false,
}) {
    return (
        <td
            className={`
                px-5
                py-4
                text-[8px]

                ${strong
                    ? "font-medium text-slate-700"
                    : "text-slate-500"
                }
            `}
        >
            {children}
        </td>
    );
}


export default TrainerScores;