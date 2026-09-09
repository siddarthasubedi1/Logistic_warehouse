import ActionButton from "../ui/ActionButton";
import StatusBadge from "../ui/StatusBadge";

import {
    formatProgrammeType,
    formatTrainingDate,
    getAssignmentProgramme,
    getProgrammeTrainerName,
} from "../../utils/training";


function AssignedProgrammeCard({
    assignment,
    onStart,
}) {
    const programme =
        getAssignmentProgramme(
            assignment
        );


    if (!programme) {
        return null;
    }


    const assignmentInactive =
        assignment?.status ===
        "inactive";


    const programmeInactive =
        programme?.status ===
        "inactive";


    const unavailable =
        assignmentInactive ||
        programmeInactive;


    return (
        <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            {/* ================================================= */}
            {/* TOP */}
            {/* ================================================= */}

            <div className="flex items-start justify-between gap-3">

                <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-600">
                        {formatProgrammeType(
                            programme.programmeType
                        )}
                    </p>


                    <h2 className="mt-2 text-base font-bold text-slate-900">
                        {programme.title}
                    </h2>

                </div>


                <StatusBadge
                    status={
                        unavailable
                            ? "inactive"
                            : assignment.status ||
                            "assigned"
                    }
                />

            </div>


            {/* ================================================= */}
            {/* DESCRIPTION */}
            {/* ================================================= */}

            <p className="mt-4 line-clamp-3 text-xs leading-5 text-slate-500">
                {programme.description ||
                    "No programme description available."}
            </p>


            {/* ================================================= */}
            {/* INFORMATION */}
            {/* ================================================= */}

            <div className="mt-5 grid grid-cols-2 gap-3">

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


                <InformationItem
                    label="Assigned"
                    value={
                        formatTrainingDate(
                            assignment.assignedAt ||
                            assignment.createdAt
                        )
                    }
                />


                <InformationItem
                    label="Status"
                    value={
                        unavailable
                            ? "Unavailable"
                            : "Available"
                    }
                />

            </div>


            {/* ================================================= */}
            {/* ACTION */}
            {/* ================================================= */}

            <div className="mt-auto pt-6">

                <ActionButton
                    variant="primary"
                    disabled={
                        unavailable
                    }
                    className="w-full justify-center"
                    onClick={() =>
                        onStart(
                            programme
                        )
                    }
                >
                    {unavailable
                        ? "Currently Unavailable"
                        : "Start Learning"}
                </ActionButton>

            </div>

        </article>
    );
}


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
                {value ||
                    "—"}
            </p>

        </div>
    );
}


export default AssignedProgrammeCard;