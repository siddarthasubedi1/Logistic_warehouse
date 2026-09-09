import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";


function LearningSectionList({
    sections = [],
    currentSectionIndex = 0,
    onSelectSection,
}) {
    if (
        sections.length ===
        0
    ) {
        return (
            <EmptyState
                title="No learning sections available."
                description="This programme does not currently contain active learning content."
            />
        );
    }


    return (
        <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="border-b border-slate-200 p-4">

                <h2 className="text-sm font-bold text-slate-900">
                    Learning Sections
                </h2>


                <p className="mt-1 text-[10px] text-slate-500">
                    Select a section to read its learning content.
                </p>

            </div>


            {/* ================================================= */}
            {/* SECTION LIST */}
            {/* ================================================= */}

            <div className="divide-y divide-slate-100">

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
                                    onSelectSection(
                                        index
                                    )
                                }
                                className={`
                                    w-full
                                    px-4
                                    py-4
                                    text-left
                                    transition
                                    ${selected
                                        ? "bg-blue-50"
                                        : "bg-white hover:bg-slate-50"
                                    }
                                `}
                            >

                                <div className="flex items-start gap-3">

                                    {/* Number */}
                                    <div
                                        className={`
                                            flex
                                            h-7
                                            w-7
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            text-[10px]
                                            font-bold
                                            ${selected
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-500"
                                            }
                                        `}
                                    >
                                        {index + 1}
                                    </div>


                                    {/* Content */}
                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-center gap-2">

                                            <p
                                                className={`
                                                    text-xs
                                                    font-semibold
                                                    ${selected
                                                        ? "text-blue-700"
                                                        : "text-slate-800"
                                                    }
                                                `}
                                            >
                                                {section.title}
                                            </p>


                                            <StatusBadge
                                                status={
                                                    section.status ||
                                                    "active"
                                                }
                                            />

                                        </div>


                                        {section.content && (
                                            <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">
                                                {section.content}
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


export default LearningSectionList;