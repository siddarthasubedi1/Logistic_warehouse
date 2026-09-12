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

    const workingAtHeight =
        programme.programmeType ===
        "working-at-height";


    return (
        <article
            className="
                flex
                h-full
                min-w-0
                flex-col
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            {/* TOP ACCENT */}

            <div
                className={`
                    h-1.5
                    w-full

                    ${workingAtHeight
                        ? "bg-amber-500"
                        : "bg-blue-600"
                    }
                `}
            />


            <div
                className="
                    flex
                    flex-1
                    flex-col
                    p-4
                    sm:p-5
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
                    <ProgrammeIcon
                        workingAtHeight={
                            workingAtHeight
                        }
                    />

                    <StatusBadge
                        status={
                            unavailable
                                ? "inactive"
                                : assignment.status ||
                                "assigned"
                        }
                    />
                </div>


                <span
                    className={`
                        mt-4
                        w-fit
                        rounded-full
                        px-2.5
                        py-1
                        text-[7px]
                        font-bold

                        ${workingAtHeight
                            ? "bg-amber-50 text-amber-700"
                            : "bg-blue-50 text-blue-700"
                        }
                    `}
                >
                    {formatProgrammeType(
                        programme.programmeType
                    )}
                </span>


                <h2
                    className="
                        mt-3
                        break-words
                        text-[13px]
                        font-bold
                        leading-5
                        text-[#172033]
                    "
                >
                    {programme.title}
                </h2>


                {programme.description && (
                    <p
                        className="
                            mt-2
                            line-clamp-3
                            text-[8px]
                            font-medium
                            leading-5
                            text-slate-600
                        "
                    >
                        {programme.description}
                    </p>
                )}


                <div
                    className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-2
                    "
                >
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
                        label="Availability"
                        value={
                            unavailable
                                ? "Unavailable"
                                : "Available"
                        }
                    />
                </div>


                <div
                    className="
                        mt-auto
                        pt-5
                    "
                >
                    <ActionButton
                        variant={
                            unavailable
                                ? "secondary"
                                : "primary"
                        }
                        disabled={
                            unavailable
                        }
                        onClick={() =>
                            onStart?.(
                                assignment
                            )
                        }
                        className="
                            w-full
                            justify-center
                        "
                    >
                        {unavailable
                            ? "Currently Unavailable"
                            : "Start Learning"}
                    </ActionButton>
                </div>
            </div>
        </article>
    );
}


function InformationItem({
    label,
    value,
}) {
    return (
        <div
            className="
                min-w-0
                rounded-lg
                bg-slate-50
                p-3
            "
        >
            <p
                className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    truncate
                    text-[8px]
                    font-bold
                    text-slate-700
                "
            >
                {value || "—"}
            </p>
        </div>
    );
}


function ProgrammeIcon({
    workingAtHeight,
}) {
    return (
        <div
            className={`
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg

                ${workingAtHeight
                    ? "bg-amber-50 text-amber-600"
                    : "bg-blue-50 text-blue-600"
                }
            `}
        >
            {workingAtHeight ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                >
                    <path d="M5 21V4" />
                    <path d="M19 21V4" />
                    <path d="M5 8h14" />
                    <path d="M5 13h14" />
                    <path d="M5 18h14" />
                </svg>
            ) : (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                >
                    <rect
                        x="3"
                        y="8"
                        width="18"
                        height="10"
                        rx="2"
                    />

                    <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                </svg>
            )}
        </div>
    );
}


export default AssignedProgrammeCard;