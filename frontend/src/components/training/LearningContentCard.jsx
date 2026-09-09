import ActionButton from "../ui/ActionButton";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";


function LearningContentCard({
    section,
    currentIndex = 0,
    totalSections = 0,
    onPrevious,
    onNext,
    onFinish,
}) {
    if (!section) {
        return (
            <EmptyState
                title="Select a learning section."
                description="Choose one of the available sections to view its content."
            />
        );
    }


    const firstSection =
        currentIndex ===
        0;


    const lastSection =
        totalSections >
        0 &&
        currentIndex ===
        totalSections -
        1;


    return (
        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="border-b border-slate-200 p-5">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div>

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                            Section {currentIndex + 1}
                        </p>


                        <h2 className="mt-1 text-lg font-bold text-slate-900">
                            {section.title}
                        </h2>

                    </div>


                    <StatusBadge
                        status={
                            section.status ||
                            "active"
                        }
                    />

                </div>

            </div>


            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div className="p-5 sm:p-6">

                {/* Image */}
                {section.imageUrl && (
                    <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                        <img
                            src={
                                section.imageUrl
                            }
                            alt={
                                section.imageAltText ||
                                section.title ||
                                "Training learning content"
                            }
                            className="max-h-[420px] w-full object-cover"
                        />

                    </div>
                )}


                {/* Learning text */}
                <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {section.content}
                </div>

            </div>


            {/* ================================================= */}
            {/* NAVIGATION */}
            {/* ================================================= */}

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                <ActionButton
                    variant="secondary"
                    disabled={
                        firstSection
                    }
                    onClick={
                        onPrevious
                    }
                >
                    ← Previous
                </ActionButton>


                <p className="text-center text-[10px] font-medium text-slate-400">
                    {currentIndex + 1}
                    {" / "}
                    {totalSections}
                </p>


                {lastSection ? (
                    <ActionButton
                        variant="success"
                        onClick={
                            onFinish
                        }
                    >
                        Finish Reading
                    </ActionButton>
                ) : (
                    <ActionButton
                        variant="primary"
                        disabled={
                            currentIndex >=
                            totalSections -
                            1
                        }
                        onClick={
                            onNext
                        }
                    >
                        Next →
                    </ActionButton>
                )}

            </div>

        </article>
    );
}


export default LearningContentCard;