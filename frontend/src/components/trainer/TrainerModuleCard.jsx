import boxLift from "../../images/box-lift.jpg";


function TrainerModuleCard() {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-center justify-between">

                <h2 className="text-[13px] font-bold text-slate-900">
                    My Module
                </h2>

                <button
                    type="button"
                    className="rounded border border-blue-200 px-2 py-1 text-[8px] font-medium text-blue-600"
                >
                    View Module
                </button>

            </div>


            <div className="mt-4 flex gap-4">

                <img
                    src={boxLift}
                    alt="Manual Handling"
                    className="h-[82px] w-[105px] rounded-lg object-cover"
                />


                <div className="min-w-0 flex-1">

                    <h3 className="text-[11px] font-bold text-slate-800">
                        Manual Handling
                    </h3>


                    <p className="mt-2 text-[9px] leading-4 text-slate-500">
                        Safe techniques for lifting, carrying,
                        and moving loads in the workplace.
                    </p>


                    <div className="mt-3 flex items-center justify-between">

                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-600">
                            Active
                        </span>


                        <div className="flex items-center gap-1 text-[8px] text-slate-500">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                className="h-3.5 w-3.5"
                            >
                                <path d="M4 5h6v14H4z" />
                                <path d="M14 5h6v14h-6z" />
                            </svg>

                            10 Lessons

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}


export default TrainerModuleCard;