import ActionButton from "../ui/ActionButton";


function LearningContentCard({
    section,
    currentIndex = 0,
    totalSections = 0,
    onPrevious,
    onNext,
    onFinish,
}) {
    // ======================================================
    // EMPTY
    // ======================================================

    if (!section) {
        return (
            <section
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-6
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
                        bg-slate-100
                        text-slate-400
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
                        font-semibold
                        text-slate-700
                    "
                >
                    No learning content available
                </h2>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-400
                    "
                >
                    Select a learning section to continue.
                </p>
            </section>
        );
    }


    // ======================================================
    // POSITION
    // ======================================================

    const isFirst =
        currentIndex <= 0;


    const isLast =
        totalSections > 0 &&
        currentIndex >= totalSections - 1;


    const sectionNumber =
        currentIndex + 1;


    const progress =
        totalSections > 0
            ? Math.round(
                (sectionNumber / totalSections) *
                100
            )
            : 0;


    // ======================================================
    // CONTENT PARAGRAPHS
    // ======================================================

    const contentParagraphs =
        String(
            section.content || ""
        )
            .split(/\n+/)
            .map((paragraph) =>
                paragraph.trim()
            )
            .filter(Boolean);


    // ======================================================
    // UI
    // ======================================================

    return (
        <article
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
            {/* TOP */}
            {/* ================================================= */}

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
                                className="
                                    inline-flex
                                    items-center
                                    rounded-full
                                    bg-blue-50
                                    px-2.5
                                    py-1
                                    text-[7px]
                                    font-medium
                                    text-blue-600
                                "
                            >
                                Section {sectionNumber}
                            </span>


                            {totalSections > 0 && (
                                <span
                                    className="
                                        text-[7px]
                                        text-slate-400
                                    "
                                >
                                    of {totalSections}
                                </span>
                            )}
                        </div>


                        <h1
                            className="
                                mt-3
                                break-words
                                text-[16px]
                                font-semibold
                                leading-6
                                text-slate-800
                                sm:text-[18px]
                            "
                        >
                            {section.title}
                        </h1>
                    </div>


                    {totalSections > 0 && (
                        <div
                            className="
                                shrink-0
                                rounded-lg
                                bg-slate-50
                                px-3
                                py-2
                            "
                        >
                            <p
                                className="
                                    text-[7px]
                                    text-slate-400
                                "
                            >
                                Position
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-[10px]
                                    font-semibold
                                    text-blue-600
                                "
                            >
                                {progress}%
                            </p>
                        </div>
                    )}
                </div>
            </div>


            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div
                className="
                    p-4
                    sm:p-5
                    md:p-6
                "
            >
                {/* IMAGE */}

                {section.imageUrl && (
                    <div
                        className="
                            mb-5
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                        "
                    >
                        <img
                            src={
                                section.imageUrl
                            }
                            alt={
                                section.imageAltText ||
                                section.title ||
                                "Learning content"
                            }
                            className="
                                max-h-[420px]
                                w-full
                                object-cover
                            "
                        />
                    </div>
                )}


                {/* TEXT */}

                {contentParagraphs.length >
                    0 ? (
                    <div
                        className="
                            space-y-4
                        "
                    >
                        {contentParagraphs.map(
                            (
                                paragraph,
                                index
                            ) => (
                                <p
                                    key={
                                        `${section._id || "section"}-${index}`
                                    }
                                    className="
                                        whitespace-pre-wrap
                                        break-words
                                        text-[10px]
                                        leading-6
                                        text-slate-600
                                    "
                                >
                                    {paragraph}
                                </p>
                            )
                        )}
                    </div>
                ) : (
                    <div
                        className="
                            rounded-lg
                            border
                            border-dashed
                            border-slate-200
                            bg-slate-50
                            p-5
                            text-center
                        "
                    >
                        <p
                            className="
                                text-[9px]
                                text-slate-400
                            "
                        >
                            This section does not contain text content.
                        </p>
                    </div>
                )}
            </div>


            {/* ================================================= */}
            {/* NAVIGATION */}
            {/* ================================================= */}

            <div
                className="
                    border-t
                    border-slate-100
                    bg-slate-50
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
                        sm:items-center
                        sm:justify-between
                    "
                >
                    {/* PREVIOUS */}

                    <ActionButton
                        type="button"
                        variant="secondary"
                        disabled={
                            isFirst
                        }
                        onClick={
                            onPrevious
                        }
                        className="
                            w-full
                            justify-center
                            sm:w-auto
                        "
                    >
                        ← Previous
                    </ActionButton>


                    {/* POSITION */}

                    <div
                        className="
                            order-first
                            text-center
                            sm:order-none
                        "
                    >
                        <p
                            className="
                                text-[8px]
                                font-medium
                                text-slate-600
                            "
                        >
                            Section {sectionNumber} of{" "}
                            {totalSections}
                        </p>


                        <div
                            className="
                                mx-auto
                                mt-2
                                h-1.5
                                w-28
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
                                        `${progress}%`,
                                }}
                            />
                        </div>
                    </div>


                    {/* NEXT / FINISH */}

                    {isLast ? (
                        <ActionButton
                            type="button"
                            variant="primary"
                            onClick={
                                onFinish
                            }
                            className="
                                w-full
                                justify-center
                                sm:w-auto
                            "
                        >
                            Finish
                        </ActionButton>
                    ) : (
                        <ActionButton
                            type="button"
                            variant="primary"
                            onClick={
                                onNext
                            }
                            className="
                                w-full
                                justify-center
                                sm:w-auto
                            "
                        >
                            Next →
                        </ActionButton>
                    )}
                </div>
            </div>
        </article>
    );
}


export default LearningContentCard;