import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";


function LearningSectionList({
    sections = [],
    currentSectionIndex = 0,
    onSelectSection,
}) {
    if (
        !Array.isArray(
            sections
        ) ||
        sections.length ===
        0
    ) {
        return (
            <section
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
            </section>
        );
    }


    const safeIndex =
        Math.min(
            Math.max(
                currentSectionIndex,
                0
            ),
            sections.length -
            1
        );


    const progressPercentage =
        Math.round(
            (
                (
                    safeIndex +
                    1
                ) /
                sections.length
            ) *
            100
        );


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
            {/* HEADER */}

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
                                font-bold
                                text-[#172033]
                            "
                        >
                            Learning Sections
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[8px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Section{" "}
                            {
                                safeIndex +
                                1
                            }{" "}
                            of{" "}
                            {
                                sections.length
                            }
                        </p>
                    </div>


                    <span
                        className="
                            text-[8px]
                            font-bold
                            text-blue-600
                        "
                    >
                        {
                            progressPercentage
                        }
                        %
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


            {/* MOBILE / TABLET */}

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
                                safeIndex;

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
                                        max-w-[220px]
                                        items-center
                                        gap-2
                                        rounded-lg
                                        border
                                        px-3
                                        py-2.5
                                        text-left
                                        transition

                                        ${selected
                                            ? "border-blue-300 bg-blue-50"
                                            : "border-slate-200 bg-white hover:bg-slate-50"
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
                                            font-semibold

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


            {/* DESKTOP */}

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
                            safeIndex;

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
                                    py-3.5
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
                                                    break-words
                                                    text-[9px]
                                                    font-bold
                                                    leading-4

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


                                        <p
                                            className="
                                                mt-1
                                                text-[7px]
                                                font-medium
                                                text-slate-500
                                            "
                                        >
                                            Section{" "}
                                            {index +
                                                1}
                                        </p>
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
                font-bold

                ${selected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }
            `}
        >
            {number}
        </span>
    );
}


export default LearningSectionList;