import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";


function LearningSectionList({
    sections = [],
    currentSectionIndex = 0,
    onSelectSection,
}) {
    // ======================================================
    // EMPTY
    // ======================================================

    if (
        sections.length ===
        0
    ) {
        return (
            <div
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >
                <EmptyState
                    title="No learning sections available."
                    description="This programme does not currently contain active learning content."
                    icon="training"
                />
            </div>
        );
    }


    // ======================================================
    // POSITION
    // ======================================================

    const progressPercentage =
        Math.round(
            (
                (
                    currentSectionIndex +
                    1
                ) /
                sections.length
            ) *
            100
        );


    // ======================================================
    // UI
    // ======================================================

    return (
        <aside
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
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    border-b
                    border-slate-100
                    px-4
                    py-4
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
                        <h2
                            className="
                                text-[11px]
                                font-semibold
                                text-slate-800
                            "
                        >
                            Learning Sections
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                text-slate-400
                            "
                        >
                            Section {currentSectionIndex + 1} of{" "}
                            {sections.length}
                        </p>
                    </div>


                    <span
                        className="
                            text-[8px]
                            font-medium
                            text-blue-600
                        "
                    >
                        {progressPercentage}%
                    </span>
                </div>


                <div
                    className="
                        mt-3
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
                                `${progressPercentage}%`,
                        }}
                    />
                </div>
            </div>


            {/* ================================================= */}
            {/* MOBILE NAVIGATION */}
            {/* ================================================= */}

            <div
                className="
                    overflow-x-auto
                    border-b
                    border-slate-100
                    p-3
                    lg:hidden
                "
            >
                <div
                    className="
                        flex
                        min-w-max
                        gap-2
                    "
                >
                    {sections.map(
                        (
                            section,
                            index
                        ) => {
                            const selected =
                                index ===
                                currentSectionIndex;


                            return (
                                <button
                                    key={
                                        section._id ||
                                        index
                                    }
                                    type="button"
                                    onClick={() =>
                                        onSelectSection?.(
                                            index
                                        )
                                    }
                                    className={`
                                        flex
                                        max-w-[210px]
                                        items-center
                                        gap-2
                                        rounded-lg
                                        border
                                        px-3
                                        py-2.5
                                        text-left

                                        ${selected
                                            ? "border-blue-300 bg-blue-50"
                                            : "border-slate-200 bg-white"
                                        }
                                    `}
                                >
                                    <SectionNumber
                                        number={
                                            index +
                                            1
                                        }
                                        selected={
                                            selected
                                        }
                                    />


                                    <span
                                        className={`
                                            max-w-[150px]
                                            truncate
                                            text-[8px]
                                            font-medium

                                            ${selected
                                                ? "text-blue-700"
                                                : "text-slate-600"
                                            }
                                        `}
                                    >
                                        {
                                            section.title
                                        }
                                    </span>
                                </button>
                            );
                        }
                    )}
                </div>
            </div>


            {/* ================================================= */}
            {/* DESKTOP LIST */}
            {/* ================================================= */}

            <div
                className="
                    hidden
                    divide-y
                    divide-slate-100
                    lg:block
                "
            >
                {sections.map(
                    (
                        section,
                        index
                    ) => {
                        const selected =
                            index ===
                            currentSectionIndex;


                        return (
                            <button
                                key={
                                    section._id ||
                                    index
                                }
                                type="button"
                                onClick={() =>
                                    onSelectSection?.(
                                        index
                                    )
                                }
                                className={`
                                    w-full
                                    px-4
                                    py-3
                                    text-left
                                    transition

                                    ${selected
                                        ? "bg-blue-50"
                                        : "bg-white hover:bg-slate-50"
                                    }
                                `}
                            >
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3
                                    "
                                >
                                    <SectionNumber
                                        number={
                                            index +
                                            1
                                        }
                                        selected={
                                            selected
                                        }
                                    />


                                    <div
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-2
                                            "
                                        >
                                            <p
                                                className={`
                                                    truncate
                                                    text-[9px]
                                                    font-medium

                                                    ${selected
                                                        ? "text-blue-700"
                                                        : "text-slate-700"
                                                    }
                                                `}
                                            >
                                                {
                                                    section.title
                                                }
                                            </p>


                                            {section.status && (
                                                <StatusBadge
                                                    status={
                                                        section.status
                                                    }
                                                />
                                            )}
                                        </div>


                                        {section.content && (
                                            <p
                                                className="
                                                    mt-1
                                                    line-clamp-2
                                                    text-[7px]
                                                    leading-4
                                                    text-slate-400
                                                "
                                            >
                                                {
                                                    section.content
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    }
                )}
            </div>
        </aside>
    );
}


// ======================================================
// SECTION NUMBER
// ======================================================

function SectionNumber({
    number,
    selected,
}) {
    return (
        <span
            className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                text-[8px]
                font-semibold

                ${selected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }
            `}
        >
            {number}
        </span>
    );
}


export default LearningSectionList;