function TrainerTaskOverview() {
    const tasks = [
        {
            name: "Lessons",
            total: 10,
            completed: "16 (57%)",
            progress: "9 (32%)",
            notStarted: "3 (11%)",
        },
        {
            name: "Scenario Activities",
            total: 5,
            completed: "17 (61%)",
            progress: "7 (25%)",
            notStarted: "4 (14%)",
        },
        {
            name: "Quizzes",
            total: 5,
            completed: "18 (64%)",
            progress: "6 (21%)",
            notStarted: "4 (14%)",
        },
        {
            name: "Assignments",
            total: 2,
            completed: "12 (43%)",
            progress: "8 (29%)",
            notStarted: "8 (28%)",
        },
    ];


    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-start justify-between">

                <div>

                    <h2 className="text-[13px] font-bold text-slate-900">
                        Trainee Task Overview
                    </h2>

                    <p className="mt-1 text-[9px] text-slate-500">
                        View trainee activity within Manual Handling.
                    </p>

                </div>

            </div>


            <div className="mt-4 overflow-x-auto">

                <table className="w-full min-w-[560px]">

                    <thead>

                        <tr className="border-b border-slate-200 text-left">

                            <Heading>Task Type</Heading>
                            <Heading>Total</Heading>
                            <Heading>Completed</Heading>
                            <Heading>In Progress</Heading>
                            <Heading>Not Started</Heading>

                        </tr>

                    </thead>


                    <tbody>

                        {tasks.map((task) => (
                            <tr
                                key={task.name}
                                className="border-b border-slate-100 last:border-0"
                            >

                                <td className="py-3 text-[9px] font-medium text-slate-700">
                                    {task.name}
                                </td>

                                <td className="py-3 text-[9px] text-slate-600">
                                    {task.total}
                                </td>

                                <td className="py-3 text-[9px] font-medium text-emerald-600">
                                    {task.completed}
                                </td>

                                <td className="py-3 text-[9px] font-medium text-orange-500">
                                    {task.progress}
                                </td>

                                <td className="py-3 text-[9px] text-slate-500">
                                    {task.notStarted}
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


export default TrainerTaskOverview;