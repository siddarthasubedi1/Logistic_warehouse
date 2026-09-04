import { useNavigate } from "react-router-dom";

import boxLift from "../../images/box-lift.jpg";


const TRAINING_MODULES = {
    "manual-handling": {
        id: "manual-handling",
        title: "Manual Handling",
        description:
            "Safe techniques for lifting, carrying, and moving loads in the workplace.",
        lessons: 10,
        image: boxLift,
    },

    "working-at-height": {
        id: "working-at-height",
        title: "Working at Height",
        description:
            "Safe working practices for elevated areas, ladders, platforms, and fall prevention.",
        lessons: 8,
        image: boxLift,
    },
};


function EmptyAssignment() {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                        />

                        <path d="M12 7v6" />

                        <path d="M12 17h.01" />
                    </svg>

                </div>


                <div>

                    <h2 className="text-sm font-bold text-slate-900">
                        No Training Section Assigned
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                        You have not been assigned to a training section yet.
                        Please contact the Administrator.
                    </p>

                </div>

            </div>

        </section>
    );
}


function ModuleCard({
    module,
}) {
    const navigate =
        useNavigate();


    const handleOpenModule = () => {
        navigate(
            `/trainer/training/${module.id}`
        );
    };


    return (
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">

            <div className="flex items-center justify-between gap-3">

                <h2 className="text-[13px] font-bold text-slate-900">
                    {module.title}
                </h2>


                <button
                    type="button"
                    onClick={
                        handleOpenModule
                    }
                    className="rounded border border-blue-200 px-3 py-1.5 text-[9px] font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                    View Module
                </button>

            </div>


            <div className="mt-4 flex gap-4">

                <img
                    src={module.image}
                    alt={module.title}
                    className="h-[82px] w-[105px] rounded-lg object-cover"
                />


                <div className="min-w-0 flex-1">

                    <p className="text-[9px] leading-4 text-slate-500">
                        {module.description}
                    </p>


                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">

                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-600">
                            Assigned
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


                            {module.lessons} Lessons

                        </div>

                    </div>

                </div>

            </div>

        </article>
    );
}


function TrainerModuleCard({
    assignedTrainingSections = [],
}) {
    const assignedModules =
        assignedTrainingSections
            .map(
                (sectionId) =>
                    TRAINING_MODULES[
                    sectionId
                    ]
            )
            .filter(Boolean);


    if (
        assignedModules.length ===
        0
    ) {
        return (
            <EmptyAssignment />
        );
    }


    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                <div>

                    <h2 className="text-[13px] font-bold text-slate-900">
                        My Training Sections
                    </h2>


                    <p className="mt-1 text-[9px] text-slate-500">
                        Training sections assigned by the Administrator.
                    </p>

                </div>


                <span className="rounded-full bg-blue-50 px-3 py-1 text-[9px] font-semibold text-blue-700">

                    {assignedModules.length}{" "}

                    {assignedModules.length === 1
                        ? "Section"
                        : "Sections"}

                </span>

            </div>


            <div
                className={`grid gap-4 ${assignedModules.length > 1
                    ? "lg:grid-cols-2"
                    : "grid-cols-1"
                    }`}
            >

                {assignedModules.map(
                    (module) => (
                        <ModuleCard
                            key={
                                module.id
                            }
                            module={
                                module
                            }
                        />
                    )
                )}

            </div>

        </section>
    );
}


export default TrainerModuleCard;