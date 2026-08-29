function TrainerRecentActivity() {
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
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

            <h2 className="text-[13px] font-bold text-slate-900">
                Recent Activity
            </h2>


            <div className="mt-4">

                {activities.map((activity, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0"
                    >

                        <ActivityIcon type={activity.type} />


                        <p className="min-w-0 flex-1 text-[8px] text-slate-600">
                            {activity.text}
                        </p>


                        <span className="whitespace-nowrap text-[7px] text-slate-400">
                            {activity.time}
                        </span>

                    </div>
                ))}

            </div>


            <button
                type="button"
                className="mt-3 w-full text-center text-[8px] font-semibold text-blue-600"
            >
                View all activity →
            </button>

        </section>
    );
}


function ActivityIcon({ type }) {
    const style =
        type === "complete"
            ? "bg-emerald-50 text-emerald-600"
            : type === "edit"
                ? "bg-violet-50 text-violet-600"
                : type === "assignment"
                    ? "bg-orange-50 text-orange-500"
                    : "bg-blue-50 text-blue-600";


    return (
        <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${style}`}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5"
            >
                {type === "complete" ? (
                    <path d="m7 12 3 3 7-7" />
                ) : (
                    <>
                        <circle cx="12" cy="8" r="3" />
                        <path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" />
                    </>
                )}
            </svg>
        </div>
    );
}


export default TrainerRecentActivity;