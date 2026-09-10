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
    // SECTION POSITION
    // ======================================================

    const percentage =
        calculateSectionPercentage(
            currentSection,
            totalSections
        );


    const sectionNumber =
        totalSections > 0
            ? Math.min(
                currentSection + 1,
                totalSections
            )
            : 0;


    const isWorkingAtHeight =
        programme.programmeType ===
        "working-at-height";


    return (
        <section
            className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            {/* ================================================= */}
            {/* TOP ACCENT */}
            {/* ================================================= */}

            <div
                className={`
                    h-1
                    w-full

                    ${isWorkingAtHeight
                        ? "bg-amber-500"
                        : "bg-blue-600"
                    }
                `}
            />


            {/* ================================================= */}
            {/* HEADER CONTENT */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    overflow-hidden
                    p-5
                    sm:p-6
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-20
                        -top-20
                        h-52
                        w-52
                        rounded-full
                        bg-blue-50
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        flex
                        flex-col
                        gap-5
                        lg:flex-row
                        lg:items-start
                        lg:justify-between
                    "
                >

                    {/* ================================================= */}
                    {/* PROGRAMME DETAILS */}
                    {/* ================================================= */}

                    <div
                        className="
                            min-w-0
                            max-w-3xl
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
                                    gap-2
                                    rounded-full
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]

                                    ${isWorkingAtHeight
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-blue-50 text-blue-700"
                                    }
                                `}
                            >

                                <ProgrammeIcon
                                    workingAtHeight={
                                        isWorkingAtHeight
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
                                mt-4
                                break-words
                                text-xl
                                font-bold
                                leading-tight
                                text-slate-900
                                sm:text-2xl
                                lg:text-[28px]
                            "
                        >
                            {programme.title}
                        </h1>


                        <p
                            className="
                                mt-3
                                max-w-3xl
                                text-[10px]
                                leading-5
                                text-slate-500
                                sm:text-[11px]
                            "
                        >
                            {programme.description ||
                                "No programme description has been added yet."}
                        </p>

                    </div>


                    {/* ================================================= */}
                    {/* PROGRAMME META */}
                    {/* ================================================= */}

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
                            type="trainer"
                        />


                        <InformationItem
                            label="Pass Mark"
                            value={`${programme.passMark ?? 0}%`}
                            type="pass"
                        />

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* LEARNING POSITION */}
            {/* ================================================= */}

            <div
                className="
                    border-t
                    border-slate-100
                    bg-slate-50/60
                    px-5
                    py-4
                    sm:px-6
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-white
                                text-blue-600
                                shadow-sm
                            "
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-4 w-4"
                            >
                                <path d="M4 5h7v14H4z" />

                                <path d="M13 5h7v14h-7z" />
                            </svg>

                        </div>


                        <div>

                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    text-slate-700
                                "
                            >
                                Learning Position
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-[9px]
                                    text-slate-400
                                "
                            >
                                {totalSections >
                                    0
                                    ? `Section ${sectionNumber} of ${totalSections}`
                                    : "No learning sections available"}
                            </p>

                        </div>

                    </div>


                    {totalSections >
                        0 && (
                            <span
                                className="
                                w-fit
                                rounded-full
                                bg-blue-50
                                px-3
                                py-1.5
                                text-[9px]
                                font-bold
                                text-blue-700
                            "
                            >
                                {percentage}% through sections
                            </span>
                        )}

                </div>


                {totalSections >
                    0 && (
                        <div
                            className="
                            mt-4
                            h-2
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


                <p
                    className="
                        mt-3
                        text-[8px]
                        leading-4
                        text-slate-400
                    "
                >
                    This shows your current section position only. It
                    does not save Sprint 2 completion or quiz progress.
                </p>

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
    type,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-3.5
                shadow-sm
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-2.5
                "
            >

                <div
                    className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg

                        ${type ===
                            "pass"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-blue-50 text-blue-600"
                        }
                    `}
                >

                    {type ===
                        "pass" ? (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />

                            <path d="m8 12 2.5 2.5L16 9" />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                        >
                            <circle
                                cx="12"
                                cy="8"
                                r="3"
                            />

                            <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                        </svg>
                    )}

                </div>


                <div className="min-w-0">

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


                    <p
                        className="
                            mt-1
                            truncate
                            text-[10px]
                            font-bold
                            text-slate-700
                        "
                    >
                        {value ||
                            "—"}
                    </p>

                </div>

            </div>

        </div>
    );
}


// ======================================================
// PROGRAMME ICON
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
                className="h-3.5 w-3.5"
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
            className="h-3.5 w-3.5"
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