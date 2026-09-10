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


    // ======================================================
    // STATUS
    // ======================================================

    const assignmentInactive =
        assignment?.status ===
        "inactive";


    const programmeInactive =
        programme?.status ===
        "inactive";


    const unavailable =
        assignmentInactive ||
        programmeInactive;


    // ======================================================
    // TYPE
    // ======================================================

    const workingAtHeight =
        programme.programmeType ===
        "working-at-height";


    return (
        <article
            className="
                group
                relative
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-lg
            "
        >

            {/* ================================================= */}
            {/* TOP ACCENT */}
            {/* ================================================= */}

            <div
                className={`
                    h-1.5
                    w-full

                    ${workingAtHeight
                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : "bg-gradient-to-r from-blue-500 to-cyan-500"
                    }
                `}
            />


            {/* ================================================= */}
            {/* BODY */}
            {/* ================================================= */}

            <div
                className="
                    flex
                    flex-1
                    flex-col
                    p-5
                "
            >

                {/* ================================================= */}
                {/* TOP */}
                {/* ================================================= */}

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


                {/* ================================================= */}
                {/* TYPE */}
                {/* ================================================= */}

                <div className="mt-4">

                    <span
                        className={`
                            inline-flex
                            items-center
                            rounded-full
                            px-2.5
                            py-1
                            text-[9px]
                            font-semibold
                            ring-1
                            ring-inset

                            ${workingAtHeight
                                ? "bg-amber-50 text-amber-700 ring-amber-200"
                                : "bg-blue-50 text-blue-700 ring-blue-200"
                            }
                        `}
                    >
                        {formatProgrammeType(
                            programme.programmeType
                        )}
                    </span>

                </div>


                {/* ================================================= */}
                {/* TITLE */}
                {/* ================================================= */}

                <h2
                    className="
                        mt-3
                        break-words
                        text-base
                        font-bold
                        leading-6
                        text-slate-900
                        transition
                        group-hover:text-blue-700
                    "
                >
                    {programme.title}
                </h2>


                {/* ================================================= */}
                {/* DESCRIPTION */}
                {/* ================================================= */}

                <p
                    className="
                        mt-3
                        line-clamp-3
                        text-[10px]
                        leading-5
                        text-slate-500
                    "
                >
                    {programme.description ||
                        "No programme description available."}
                </p>


                {/* ================================================= */}
                {/* INFO */}
                {/* ================================================= */}

                <div
                    className="
                        mt-5
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
                        icon="trainer"
                    />


                    <InformationItem
                        label="Pass Mark"
                        value={`${programme.passMark ?? 0}%`}
                        icon="pass"
                    />


                    <InformationItem
                        label="Assigned"
                        value={
                            formatTrainingDate(
                                assignment.assignedAt ||
                                assignment.createdAt
                            )
                        }
                        icon="date"
                    />


                    <InformationItem
                        label="Availability"
                        value={
                            unavailable
                                ? "Unavailable"
                                : "Available"
                        }
                        icon="status"
                    />

                </div>


                {/* ================================================= */}
                {/* PASS REQUIREMENT */}
                {/* ================================================= */}

                <div
                    className="
                        mt-4
                        rounded-xl
                        border
                        border-slate-100
                        bg-slate-50
                        p-3
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >

                        <span
                            className="
                                text-[9px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Programme Pass Mark
                        </span>


                        <span
                            className="
                                text-[9px]
                                font-bold
                                text-slate-700
                            "
                        >
                            {programme.passMark ??
                                0}%
                        </span>

                    </div>


                    <div
                        className="
                            mt-2
                            h-1.5
                            overflow-hidden
                            rounded-full
                            bg-slate-200
                        "
                    >
                        <div
                            className={`
                                h-full
                                rounded-full

                                ${workingAtHeight
                                    ? "bg-amber-500"
                                    : "bg-blue-500"
                                }
                            `}
                            style={{
                                width:
                                    `${Math.min(
                                        Math.max(
                                            Number(
                                                programme.passMark ??
                                                0
                                            ),
                                            0
                                        ),
                                        100
                                    )}%`,
                            }}
                        />
                    </div>

                </div>


                {/* ================================================= */}
                {/* AVAILABILITY WARNING */}
                {/* ================================================= */}

                {unavailable && (
                    <div
                        className="
                            mt-4
                            rounded-xl
                            border
                            border-amber-200
                            bg-amber-50
                            p-3
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                gap-2
                            "
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="
                                    mt-0.5
                                    h-4
                                    w-4
                                    shrink-0
                                    text-amber-600
                                "
                            >
                                <path d="M12 3 3 20h18L12 3Z" />

                                <path d="M12 9v4" />

                                <path d="M12 17h.01" />
                            </svg>


                            <p
                                className="
                                    text-[9px]
                                    leading-4
                                    text-amber-700
                                "
                            >
                                This programme is currently unavailable.
                                Contact your Administrator or Trainer if
                                you believe you should have access.
                            </p>

                        </div>

                    </div>
                )}


                {/* ================================================= */}
                {/* ACTION */}
                {/* ================================================= */}

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
                        className="
                            w-full
                            justify-center
                        "
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

            </div>

        </article>
    );
}


// ======================================================
// PROGRAMME ICON
// ======================================================

function ProgrammeIcon({
    workingAtHeight,
}) {
    return (
        <div
            className={`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl

                ${workingAtHeight
                    ? "bg-amber-50 text-amber-700"
                    : "bg-blue-50 text-blue-700"
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

                    <path d="M8 13h8" />
                </svg>
            )}

        </div>
    );
}


// ======================================================
// INFO ITEM
// ======================================================

function InformationItem({
    label,
    value,
    icon,
}) {
    return (
        <div
            className="
                min-w-0
                rounded-xl
                border
                border-slate-100
                bg-slate-50/80
                p-3
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-1.5
                "
            >

                <InformationIcon
                    type={
                        icon
                    }
                />


                <p
                    className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                    "
                >
                    {label}
                </p>

            </div>


            <p
                className="
                    mt-2
                    break-words
                    text-[10px]
                    font-semibold
                    leading-4
                    text-slate-700
                "
            >
                {value ||
                    "—"}
            </p>

        </div>
    );
}


// ======================================================
// INFO ICON
// ======================================================

function InformationIcon({
    type,
}) {
    if (
        type ===
        "trainer"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-3 w-3 text-slate-400"
            >
                <circle
                    cx="12"
                    cy="8"
                    r="3"
                />

                <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
            </svg>
        );
    }


    if (
        type ===
        "pass"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-3 w-3 text-slate-400"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />

                <path d="m8 12 2.5 2.5L16 9" />
            </svg>
        );
    }


    if (
        type ===
        "date"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-3 w-3 text-slate-400"
            >
                <rect
                    x="4"
                    y="5"
                    width="16"
                    height="15"
                    rx="2"
                />

                <path d="M8 3v4" />

                <path d="M16 3v4" />

                <path d="M4 10h16" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-3 w-3 text-slate-400"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
            />

            <path d="M8 12h8" />
        </svg>
    );
}


export default AssignedProgrammeCard;