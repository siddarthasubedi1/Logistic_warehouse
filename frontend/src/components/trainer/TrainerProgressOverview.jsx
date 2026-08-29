function TrainerProgressOverview() {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-[13px] font-bold text-slate-900">
                        Trainee Progress Overview
                    </h2>

                    <p className="mt-1 text-[9px] text-slate-500">
                        Overall progress in the Manual Handling module.
                    </p>

                </div>


                <select className="rounded border border-slate-200 px-3 py-1.5 text-[9px] text-slate-600 outline-none">
                    <option>This Week</option>
                </select>

            </div>


            <div className="mt-5 grid gap-5 sm:grid-cols-[170px_1fr]">

                {/* DONUT */}

                <div className="flex items-center justify-center">

                    <div
                        className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full"
                        style={{
                            background:
                                "conic-gradient(#22c55e 0 57%, #f59e0b 57% 89%, #cbd5e1 89% 100%)",
                        }}
                    >

                        <div className="flex h-[78px] w-[78px] flex-col items-center justify-center rounded-full bg-white">

                            <span className="text-[20px] font-bold text-slate-800">
                                57%
                            </span>

                            <span className="text-[7px] text-slate-400">
                                Average
                            </span>

                            <span className="text-[7px] text-slate-400">
                                Completion
                            </span>

                        </div>

                    </div>

                </div>


                {/* SUMMARY */}

                <div className="space-y-4">

                    <ProgressItem
                        label="Completed"
                        value="16 (57%)"
                        dot="bg-emerald-500"
                    />

                    <ProgressItem
                        label="In Progress"
                        value="9 (32%)"
                        dot="bg-orange-400"
                    />

                    <ProgressItem
                        label="Not Started"
                        value="3 (11%)"
                        dot="bg-slate-300"
                    />


                    <div className="pt-2">

                        <div className="flex items-end gap-2">

                            {[42, 45, 48, 52, 55, 56, 57].map(
                                (value, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-1 flex-col items-center gap-1"
                                    >

                                        <span className="text-[7px] text-slate-400">
                                            {value}%
                                        </span>

                                        <div className="relative h-[70px] w-full bg-slate-50">

                                            <div
                                                className="absolute bottom-0 left-1/2 w-2 -translate-x-1/2 rounded-t bg-emerald-400"
                                                style={{
                                                    height: `${value}%`,
                                                }}
                                            />

                                        </div>

                                        <span className="text-[7px] text-slate-400">
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


function ProgressItem({
    label,
    value,
    dot,
}) {
    return (
        <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

                <span className={`h-2 w-2 rounded-full ${dot}`} />

                <span className="text-[8px] text-slate-600">
                    {label}
                </span>

            </div>

            <span className="text-[8px] font-semibold text-slate-700">
                {value}
            </span>

        </div>
    );
}


export default TrainerProgressOverview;