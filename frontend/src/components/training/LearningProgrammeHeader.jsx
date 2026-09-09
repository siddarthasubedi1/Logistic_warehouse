import StatusBadge from "../ui/StatusBadge";

import {
    calculateSectionPercentage,
    formatProgrammeType,
    getProgrammeTrainerName,
} from "../../utils/training";


function LearningProgrammeHeader({
    programme,
    currentSection = 0,
    totalSections = 0,
}) {
    if (!programme) {
        return null;
    }


    // ======================================================
    // READING PROGRESS
    // ======================================================

    const percentage =
        calculateSectionPercentage(
            currentSection,
            totalSections
        );


    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* ================================================= */}
            {/* PROGRAMME INFORMATION */}
            {/* ================================================= */}

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div className="max-w-3xl">

                    <div className="flex flex-wrap items-center gap-2">

                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-600">
                            {formatProgrammeType(
                                programme.programmeType
                            )}
                        </p>


                        <StatusBadge
                            status={
                                programme.status ||
                                "active"
                            }
                        />

                    </div>


                    <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                        {programme.title}
                    </h1>


                    {programme.description && (
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            {programme.description}
                        </p>
                    )}

                </div>


                {/* ================================================= */}
                {/* PROGRAMME META */}
                {/* ================================================= */}

                <div className="grid min-w-[240px] grid-cols-2 gap-3">

                    <InformationItem
                        label="Trainer"
                        value={
                            getProgrammeTrainerName(
                                programme
                            )
                        }
                    />


                    <InformationItem
                        label="Pass Mark"
                        value={`${programme.passMark ?? 0}%`}
                    />

                </div>

            </div>


            {/* ================================================= */}
            {/* READING PROGRESS */}
            {/* ================================================= */}

            <div className="mt-6 border-t border-slate-100 pt-5">

                <div className="flex items-center justify-between gap-3">

                    <div>
                        <p className="text-xs font-semibold text-slate-700">
                            Reading Progress
                        </p>


                        <p className="mt-1 text-[10px] text-slate-400">
                            {totalSections > 0
                                ? `Section ${Math.min(
                                    currentSection + 1,
                                    totalSections
                                )} of ${totalSections}`
                                : "No learning sections available"}
                        </p>
                    </div>


                    <p className="text-xs font-bold text-blue-600">
                        {percentage}%
                    </p>

                </div>


                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-300"
                        style={{
                            width:
                                `${percentage}%`,
                        }}
                    />

                </div>

            </div>

        </section>
    );
}


// ======================================================
// INFORMATION ITEM
// ======================================================

function InformationItem({
    label,
    value,
}) {
    return (
        <div className="rounded-lg bg-slate-50 p-3">

            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>


            <p className="mt-1 text-[11px] font-semibold text-slate-700">
                {value || "—"}
            </p>

        </div>
    );
}


export default LearningProgrammeHeader;