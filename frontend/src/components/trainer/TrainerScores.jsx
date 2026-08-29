function TrainerScores() {
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
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-start justify-between">

                <div>

                    <h2 className="text-[13px] font-bold text-slate-900">
                        Trainee Scores
                    </h2>

                    <p className="mt-1 text-[9px] text-slate-500">
                        Latest quiz scores in Manual Handling.
                    </p>

                </div>

                <button
                    type="button"
                    className="text-[8px] font-semibold text-blue-600"
                >
                    View All Scores →
                </button>

            </div>


            <div className="mt-4 overflow-x-auto">

                <table className="w-full min-w-[560px]">

                    <thead>

                        <tr className="border-b border-slate-200 text-left">

                            <Heading>Trainee</Heading>
                            <Heading>Latest Quiz</Heading>
                            <Heading>Score</Heading>
                            <Heading>Date</Heading>

                        </tr>

                    </thead>


                    <tbody>

                        {trainees.map((trainee) => (
                            <tr
                                key={trainee.name}
                                className="border-b border-slate-100 last:border-0"
                            >

                                <td className="py-2.5">

                                    <div className="flex items-center gap-2">

                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[8px] font-bold text-blue-600">
                                            {trainee.name.charAt(0)}
                                        </div>

                                        <span className="text-[9px] text-slate-700">
                                            {trainee.name}
                                        </span>

                                    </div>

                                </td>


                                <td className="max-w-[150px] py-2.5 text-[8px] text-slate-600">
                                    {trainee.quiz}
                                </td>


                                <td className="py-2.5">

                                    <span
                                        className={`rounded px-2 py-1 text-[8px] font-semibold ${trainee.score >= 80
                                            ? "bg-emerald-50 text-emerald-600"
                                            : trainee.score >= 70
                                                ? "bg-orange-50 text-orange-500"
                                                : "bg-red-50 text-red-500"
                                            }`}
                                    >
                                        {trainee.score}%
                                    </span>

                                </td>


                                <td className="py-2.5 text-[8px] text-slate-500">
                                    {trainee.date}
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </section>
    );
}


function Heading({ children }) {
    return (
        <th className="pb-3 text-[8px] font-medium text-slate-500">
            {children}
        </th>
    );
}


export default TrainerScores;