import StatusBadge from "../ui/StatusBadge";

import {
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


    const workingAtHeight =
        programme.programmeType ===
        "working-at-height";

    const sectionNumber =
        totalSections > 0
            ? Math.min(
                currentSection + 1,
                totalSections
            )
            : 0;

    const percentage =
        totalSections > 0
            ? Math.round(
                (
                    sectionNumber /
                    totalSections
                ) *
                100
            )
            : 0;


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
                                text-[18px]
                                font-bold
                                leading-6
                                text-[#172033]
                                sm:text-[20px]
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
                                    font-medium
                                    leading-5
                                    text-slate-600
                                "
                            >
                                {programme.description}
                            </p>
                        )}
                    </div>


                    <div
                        className="
                            grid
                            w-full
                            gap-2
                            sm:grid-cols-2
                            lg:w-[330px]
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
                            value={`${programme.passMark ?? 0}%`}
                        />
                    </div>
                </div>
            </div>


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
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <div>
                        <p
                            className="
                                text-[8px]
                                font-bold
                                text-slate-700
                            "
                        >
                            Learning Position
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-[7px]
                                font-medium
                                text-slate-500
                            "
                        >
                            {totalSections > 0
                                ? `Section ${sectionNumber} of ${totalSections}`
                                : "No learning sections available"}
                        </p>
                    </div>


                    {totalSections > 0 && (
                        <span
                            className="
                                text-[8px]
                                font-bold
                                text-blue-600
                            "
                        >
                            {percentage}%
                        </span>
                    )}
                </div>


                {totalSections > 0 && (
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
                    text-[9px]
                    font-bold
                    text-slate-700
                "
            >
                {value || "—"}
            </p>
        </div>
    );
}


export default LearningProgrammeHeader;