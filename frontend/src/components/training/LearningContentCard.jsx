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

    // ======================================================
    // EMPTY
    // ======================================================

    if (!section) {
        return (
            <EmptyState
                title="Select a learning section."
                description="Choose one of the available sections to view its content."
            />
        );
    }


    // ======================================================
    // NAVIGATION
    // ======================================================

    const firstSection =
        currentIndex ===
        0;


    const lastSection =
        totalSections >
        0 &&
        currentIndex ===
        totalSections -
        1;


    // ======================================================
    // PROGRESS
    // ======================================================

    const progress =
        totalSections >
            0
            ? Math.round(
                ((currentIndex +
                    1) /
                    totalSections) *
                100
            )
            : 0;


    return (
        <article
            className="
                overflow-hidden
                rounded-2xl
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
                    relative
                    overflow-hidden
                    border-b
                    border-blue-200
                    bg-gradient-to-r
                    from-[#073763]
                    via-[#0b4f87]
                    to-[#1769aa]
                    px-5
                    py-5
                    text-white
                    sm:px-6
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-14
                        -top-14
                        h-40
                        w-40
                        rounded-full
                        bg-white/10
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-white/15
                                bg-white/10
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <path d="M5 4h14v16H5z" />

                                <path d="M8 8h8" />

                                <path d="M8 12h8" />

                                <path d="M8 16h5" />
                            </svg>
                        </div>


                        <div className="min-w-0">

                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-blue-100
                                "
                            >
                                Learning Section{" "}
                                {currentIndex +
                                    1}
                            </p>


                            <h2
                                className="
                                    mt-1
                                    break-words
                                    text-lg
                                    font-bold
                                    leading-7
                                    text-white
                                    sm:text-xl
                                "
                            >
                                {section.title}
                            </h2>

                        </div>

                    </div>


                    <StatusBadge
                        status={
                            section.status ||
                            "active"
                        }
                    />

                </div>


                {/* ================================================= */}
                {/* PROGRESS */}
                {/* ================================================= */}

                <div
                    className="
                        relative
                        z-10
                        mt-5
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
                                text-blue-100
                            "
                        >
                            Programme learning progress
                        </span>


                        <span
                            className="
                                text-[9px]
                                font-bold
                                text-white
                            "
                        >
                            {progress}%
                        </span>

                    </div>


                    <div
                        className="
                            mt-2
                            h-1.5
                            overflow-hidden
                            rounded-full
                            bg-white/20
                        "
                    >
                        <div
                            className="
                                h-full
                                rounded-full
                                bg-white
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

            </div>


            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div
                className="
                    p-4
                    sm:p-5
                    lg:p-6
                "
            >

                {/* ================================================= */}
                {/* SECTION NUMBER */}
                {/* ================================================= */}

                <div
                    className="
                        mb-5
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
                            gap-1.5
                            rounded-full
                            bg-blue-50
                            px-3
                            py-1.5
                            text-[9px]
                            font-semibold
                            text-blue-700
                        "
                    >
                        <span
                            className="
                                flex
                                h-4
                                w-4
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-600
                                text-[7px]
                                text-white
                            "
                        >
                            {currentIndex +
                                1}
                        </span>

                        Section {currentIndex + 1} of {totalSections}
                    </span>


                    {section.imageUrl && (
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-emerald-50
                                px-3
                                py-1.5
                                text-[9px]
                                font-semibold
                                text-emerald-700
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-3 w-3"
                            >
                                <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="16"
                                    rx="2"
                                />

                                <circle
                                    cx="8"
                                    cy="9"
                                    r="2"
                                />

                                <path d="m4 18 5-5 3 3 3-4 5 6" />
                            </svg>

                            Safety Visual
                        </span>
                    )}

                </div>


                {/* ================================================= */}
                {/* IMAGE */}
                {/* ================================================= */}

                {section.imageUrl && (
                    <figure
                        className="
                            mb-6
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-50
                        "
                    >

                        <div
                            className="
                                flex
                                min-h-[180px]
                                items-center
                                justify-center
                                overflow-hidden
                                bg-slate-100
                            "
                        >

                            <img
                                src={
                                    section.imageUrl
                                }
                                alt={
                                    section.imageAltText ||
                                    section.title ||
                                    "Training learning content"
                                }
                                className="
                                    max-h-[480px]
                                    w-full
                                    object-contain
                                "
                            />

                        </div>


                        {section.imageAltText && (
                            <figcaption
                                className="
                                    border-t
                                    border-slate-200
                                    bg-white
                                    px-4
                                    py-3
                                    text-[9px]
                                    leading-4
                                    text-slate-500
                                "
                            >
                                <span
                                    className="
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Image description:
                                </span>{" "}
                                {section.imageAltText}
                            </figcaption>
                        )}

                    </figure>
                )}


                {/* ================================================= */}
                {/* LEARNING CONTENT HEADER */}
                {/* ================================================= */}

                <div
                    className="
                        mb-4
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
                            <path d="M4 6h16" />

                            <path d="M4 11h16" />

                            <path d="M4 16h10" />
                        </svg>
                    </div>


                    <div>

                        <h3
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Learning Content
                        </h3>


                        <p
                            className="
                                mt-0.5
                                text-[9px]
                                text-slate-500
                            "
                        >
                            Read the information carefully before moving
                            to the next section.
                        </p>

                    </div>

                </div>


                {/* ================================================= */}
                {/* TEXT */}
                {/* ================================================= */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-100
                        bg-gradient-to-br
                        from-white
                        to-slate-50/70
                        p-4
                        sm:p-5
                    "
                >

                    <div
                        className="
                            whitespace-pre-wrap
                            break-words
                            text-[12px]
                            leading-7
                            text-slate-700
                            sm:text-[13px]
                        "
                    >
                        {section.content}
                    </div>

                </div>


                {/* ================================================= */}
                {/* SAFETY REMINDER */}
                {/* ================================================= */}

                <div
                    className="
                        mt-5
                        rounded-xl
                        border
                        border-amber-200
                        bg-gradient-to-r
                        from-amber-50
                        to-white
                        p-4
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                text-amber-600
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
                                <path d="M12 3 3 20h18L12 3Z" />

                                <path d="M12 9v4" />

                                <path d="M12 17h.01" />
                            </svg>
                        </div>


                        <div>

                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    text-amber-800
                                "
                            >
                                Safety Reminder
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    leading-5
                                    text-amber-700
                                "
                            >
                                Workplace safety instructions should be
                                followed carefully and applied according
                                to your organisation's approved
                                procedures.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* NAVIGATION */}
            {/* ================================================= */}

            <div
                className="
                    border-t
                    border-slate-200
                    bg-slate-50/80
                    p-4
                    sm:p-5
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    {/* PREVIOUS */}

                    <ActionButton
                        variant="secondary"
                        disabled={
                            firstSection
                        }
                        onClick={
                            onPrevious
                        }
                        className="
                            order-2
                            w-full
                            justify-center
                            sm:order-1
                            sm:w-auto
                        "
                    >
                        ← Previous
                    </ActionButton>


                    {/* SECTION COUNTER */}

                    <div
                        className="
                            order-1
                            text-center
                            sm:order-2
                        "
                    >

                        <p
                            className="
                                text-[9px]
                                font-semibold
                                text-slate-600
                            "
                        >
                            Section {currentIndex + 1} of {totalSections}
                        </p>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                text-slate-400
                            "
                        >
                            {lastSection
                                ? "Final learning section"
                                : "Continue when ready"}
                        </p>

                    </div>


                    {/* NEXT / FINISH */}

                    <div
                        className="
                            order-3
                            w-full
                            sm:w-auto
                        "
                    >

                        {lastSection ? (
                            <ActionButton
                                variant="success"
                                onClick={
                                    onFinish
                                }
                                className="
                                    w-full
                                    justify-center
                                    sm:w-auto
                                "
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
                                className="
                                    w-full
                                    justify-center
                                    sm:w-auto
                                "
                            >
                                Next Section →
                            </ActionButton>
                        )}

                    </div>

                </div>

            </div>

        </article>
    );
}


export default LearningContentCard;