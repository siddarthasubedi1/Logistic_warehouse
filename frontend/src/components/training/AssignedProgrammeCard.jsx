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


    if (
        !programme
    ) {
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
                flex-col
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            {/* ================================================= */}
            {/* ACCENT */}
            {/* ================================================= */}

            <div
                className={`
                    h-1
                    w-full

                    ${workingAtHeight
                        ? "bg-amber-500"
                        : "bg-blue-600"
                    }
                `}
            />


            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div
                className="
                    flex
                    flex-1
                    flex-col
                    p-4
                    sm:p-5
                "
            >
                {/* TOP */}

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


                {/* TYPE */}

                <div
                    className="
                        mt-4
                    "
                >
                    <span
                        className={`
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1
                            text-[7px]
                            font-medium

                            ${workingAtHeight
                                ? "bg-amber-50 text-amber-600"
                                : "bg-blue-50 text-blue-600"
                            }
                        `}
                    >
                        {formatProgrammeType(
                            programme.programmeType
                        )}
                    </span>
                </div>


                {/* TITLE */}

                <h2
                    className="
                        mt-3
                        break-words
                        text-[13px]
                        font-semibold
                        leading-5
                        text-slate-800
                    "
                >
                    {programme.title}
                </h2>


                {/* DESCRIPTION */}

                {programme.description && (
                    <p
                        className="
                            mt-2
                            line-clamp-3
                            text-[8px]
                            leading-4
                            text-slate-500
                        "
                    >
                        {
                            programme.description
                        }
                    </p>
                )}


                {/* INFO */}

                <div
                    className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-3
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
                        value={`${programme.passMark ??
                            0
                            }%`}
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


                {/* ACTION */}

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
                            ? "Unavailable"
                            : "Start Learning"}
                    </ActionButton>
                </div>
            </div>
        </article>
    );
}


// ======================================================
// ICON
// ======================================================

function ProgrammeIcon({
    workingAtHeight,
}) {
    return (
        <div
            className={`
                flex
                h-9
                w-9
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
                    className="h-4 w-4"
                >
                    <path d="M5 21V5" />
                    <path d="M19 21V5" />
                    <path d="M5 9h14" />
                    <path d="M5 14h14" />
                    <path d="M5 19h14" />
                </svg>
            ) : (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                >
                    <rect
                        x="3"
                        y="8"
                        width="18"
                        height="10"
                        rx="2"
                    />

                    <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />

                    <path d="M8 13h8" />
                </svg>
            )}
        </div>
    );
}


// ======================================================
// INFORMATION
// ======================================================

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
                    uppercase
                    tracking-wide
                    text-slate-400
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    break-words
                    text-[8px]
                    font-medium
                    text-slate-700
                "
            >
                {value ||
                    "—"}
            </p>
        </div>
    );
}


export default AssignedProgrammeCard;