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


    const percentage =
        calculateSectionPercentage(
            currentSection,
            totalSections
        );


    const sectionNumber =
        totalSections >
            0
            ? Math.min(
                currentSection +
                1,
                totalSections
            )
            : 0;


    const workingAtHeight =
        programme.programmeType ===
        "working-at-height";


    return (
        <section
            className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <div
                className="
                    p-4
                    sm:p-5
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        lg:flex-row
                        lg:items-start
                        lg:justify-between
                    "
                >
                    {/* PROGRAMME */}

                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >
                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >
                            <span
                                className={`
                                    inline-flex
                                    items-center
                                    gap-1.5
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
                                <ProgrammeIcon
                                    workingAtHeight={
                                        workingAtHeight
                                    }
                                />


                                {formatProgrammeType(
                                    programme.programmeType
                                )}
                            </span>


                            <StatusBadge
                                status={
                                    programme.status ||
                                    "active"
                                }
                            />
                        </div>


                        <h1
                            className="
                                mt-3
                                break-words
                                text-[17px]
                                font-semibold
                                text-slate-800
                                sm:text-[19px]
                            "
                        >
                            {programme.title}
                        </h1>


                        {programme.description && (
                            <p
                                className="
                                    mt-2
                                    max-w-3xl
                                    text-[9px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                {
                                    programme.description
                                }
                            </p>
                        )}
                    </div>


                    {/* META */}

                    <div
                        className="
                            grid
                            w-full
                            gap-3
                            sm:grid-cols-2
                            lg:w-[320px]
                            lg:shrink-0
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
                    </div>
                </div>
            </div>


            {/* ================================================= */}
            {/* SECTION POSITION */}
            {/* ================================================= */}

            <div
                className="
                    border-t
                    border-slate-100
                    bg-slate-50
                    px-4
                    py-3
                    sm:px-5
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-2
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div>
                        <p
                            className="
                                text-[8px]
                                font-medium
                                text-slate-600
                            "
                        >
                            Learning Position
                        </p>


                        <p
                            className="
                                mt-0.5
                                text-[7px]
                                text-slate-400
                            "
                        >
                            {totalSections >
                                0
                                ? `Section ${sectionNumber} of ${totalSections}`
                                : "No learning sections available"}
                        </p>
                    </div>


                    {totalSections >
                        0 && (
                            <span
                                className="
                                text-[8px]
                                font-medium
                                text-blue-600
                            "
                            >
                                {percentage}%
                            </span>
                        )}
                </div>


                {totalSections >
                    0 && (
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
                                className="
                                h-full
                                rounded-full
                                bg-blue-600
                                transition-all
                                duration-300
                            "
                                style={{
                                    width:
                                        `${percentage}%`,
                                }}
                            />
                        </div>
                    )}
            </div>
        </section>
    );
}


// ======================================================
// META ITEM
// ======================================================

function InformationItem({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-lg
                bg-slate-50
                px-3
                py-3
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
                    truncate
                    text-[9px]
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


// ======================================================
// ICON
// ======================================================

function ProgrammeIcon({
    workingAtHeight,
}) {
    if (
        workingAtHeight
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-3 w-3"
            >
                <path d="M5 21V5" />
                <path d="M19 21V5" />
                <path d="M5 9h14" />
                <path d="M5 14h14" />
                <path d="M5 19h14" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-3 w-3"
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
    );
}


export default LearningProgrammeHeader;