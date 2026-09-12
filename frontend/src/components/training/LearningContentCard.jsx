import ActionButton from "../ui/ActionButton";


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
            <section
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-50
                        text-blue-600
                    "
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <path d="M4 5h16v14H4z" />
                        <path d="M8 9h8" />
                        <path d="M8 13h6" />
                    </svg>
                </div>

                <h2
                    className="
                        mt-3
                        text-[12px]
                        font-bold
                        text-slate-800
                    "
                >
                    No learning content available
                </h2>
            </section>
        );
    }


    const isFirst =
        currentIndex <= 0;

    const isLast =
        totalSections > 0 &&
        currentIndex >=
        totalSections - 1;

    const sectionNumber =
        currentIndex + 1;

    const progress =
        totalSections > 0
            ? Math.round(
                (
                    sectionNumber /
                    totalSections
                ) *
                100
            )
            : 0;


    const paragraphs =
        String(
            section.content ||
            ""
        )
            .split(/\n+/)
            .map(
                (
                    paragraph
                ) =>
                    paragraph.trim()
            )
            .filter(Boolean);


    return (
        <article
            className="
                min-w-0
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
                    sm:px-5
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >
                    <div>
                        <p
                            className="
                                text-[7px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-blue-600
                            "
                        >
                            Learning Section {sectionNumber}
                        </p>

                        <h2
                            className="
                                mt-1
                                text-[16px]
                                font-bold
                                leading-6
                                text-[#172033]
                            "
                        >
                            {section.title}
                        </h2>
                    </div>


                    <span
                        className="
                            w-fit
                            rounded-full
                            bg-blue-50
                            px-3
                            py-1
                            text-[8px]
                            font-bold
                            text-blue-600
                        "
                    >
                        {progress}%
                    </span>
                </div>


                <div
                    className="
                        mt-4
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
                        "
                        style={{
                            width:
                                `${progress}%`,
                        }}
                    />
                </div>
            </div>


            {/* IMAGE */}

            {section.imageUrl && (
                <div
                    className="
                        border-b
                        border-slate-100
                        bg-slate-50
                        p-4
                        sm:p-5
                    "
                >
                    <img
                        src={
                            section.imageUrl
                        }
                        alt={
                            section.imageAltText ||
                            section.title
                        }
                        className="
                            mx-auto
                            max-h-[420px]
                            w-full
                            rounded-xl
                            object-cover
                        "
                    />

                    {section.imageAltText && (
                        <p
                            className="
                                mt-2
                                text-center
                                text-[7px]
                                font-medium
                                text-slate-500
                            "
                        >
                            {section.imageAltText}
                        </p>
                    )}
                </div>
            )}


            {/* CONTENT */}

            <div
                className="
                    p-4
                    sm:p-6
                "
            >
                {paragraphs.length > 0 ? (
                    <div
                        className="
                            space-y-4
                        "
                    >
                        {paragraphs.map(
                            (
                                paragraph,
                                index
                            ) => (
                                <p
                                    key={
                                        index
                                    }
                                    className="
                                        text-[10px]
                                        font-medium
                                        leading-6
                                        text-slate-700
                                        sm:text-[11px]
                                    "
                                >
                                    {paragraph}
                                </p>
                            )
                        )}
                    </div>
                ) : (
                    <p
                        className="
                            text-[9px]
                            font-medium
                            text-slate-500
                        "
                    >
                        No text content has been added to this section.
                    </p>
                )}
            </div>


            {/* NAVIGATION */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    border-t
                    border-slate-100
                    bg-slate-50/50
                    px-4
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
                "
            >
                <ActionButton
                    variant="secondary"
                    disabled={
                        isFirst
                    }
                    onClick={
                        onPrevious
                    }
                    className="
                        w-full
                        sm:w-auto
                    "
                >
                    ← Previous
                </ActionButton>


                <p
                    className="
                        text-center
                        text-[8px]
                        font-semibold
                        text-slate-600
                    "
                >
                    Section {sectionNumber} of {totalSections}
                </p>


                {isLast ? (
                    <ActionButton
                        variant="primary"
                        onClick={
                            onFinish
                        }
                        className="
                            w-full
                            sm:w-auto
                        "
                    >
                        Finish Learning
                    </ActionButton>
                ) : (
                    <ActionButton
                        variant="primary"
                        onClick={
                            onNext
                        }
                        className="
                            w-full
                            sm:w-auto
                        "
                    >
                        Next Section →
                    </ActionButton>
                )}
            </div>
        </article>
    );
}


export default LearningContentCard;