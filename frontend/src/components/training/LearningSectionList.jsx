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
            <EmptyState
                title="No learning sections available."
                description="This programme does not currently contain active learning content."
            />
        );
    }


    // ======================================================
    // PROGRESS
    // ======================================================

    const progressPercentage =
        sections.length > 0
            ? Math.round(
                ((currentSectionIndex + 1) /
                    sections.length) *
                100
            )
            : 0;


    return (
        <aside
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
                    p-4
                    text-white
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-10
                        -top-10
                        h-28
                        w-28
                        rounded-full
                        bg-white/10
                    "
                />


                <div className="relative">

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
                                h-9
                                w-9
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
                                <path d="M4 5h7v14H4z" />
                                <path d="M13 5h7v14h-7z" />
                                <path d="M7 9h2" />
                                <path d="M16 9h2" />
                            </svg>
                        </div>


                        <div>

                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-blue-100
                                "
                            >
                                Learning Navigation
                            </p>


                            <h2
                                className="
                                    mt-1
                                    text-sm
                                    font-bold
                                    text-white
                                "
                            >
                                Learning Sections
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    leading-4
                                    text-blue-100
                                "
                            >
                                Select a section to read its training
                                content.
                            </p>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* PROGRESS */}
                    {/* ================================================= */}

                    <div className="mt-4">

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
                                Section {currentSectionIndex + 1} of{" "}
                                {sections.length}
                            </span>


                            <span
                                className="
                                    text-[9px]
                                    font-bold
                                    text-white
                                "
                            >
                                {progressPercentage}%
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
                                        `${progressPercentage}%`,
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* MOBILE LIST */}
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
                                        onSelectSection(
                                            index
                                        )
                                    }
                                    className={`
                                        flex
                                        max-w-[220px]
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        px-3
                                        py-2.5
                                        text-left
                                        transition

                                        ${selected
                                            ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50"
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
                                        className="
                                            max-w-[150px]
                                            truncate
                                            text-[10px]
                                            font-semibold
                                        "
                                    >
                                        {section.title}
                                    </span>

                                </button>
                            );
                        }
                    )}

                </div>

            </div>


            {/* ================================================= */}
            {/* DESKTOP SECTION LIST */}
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


                        const completed =
                            index <
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
                                    relative
                                    w-full
                                    px-4
                                    py-4
                                    text-left
                                    transition-all
                                    duration-200

                                    ${selected
                                        ? "bg-gradient-to-r from-blue-50 to-white"
                                        : "bg-white hover:bg-slate-50"
                                    }
                                `}
                            >

                                {/* ACTIVE LINE */}

                                {selected && (
                                    <span
                                        className="
                                            absolute
                                            bottom-0
                                            left-0
                                            top-0
                                            w-1
                                            bg-blue-500
                                        "
                                    />
                                )}


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
                                        completed={
                                            completed
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
                                                flex-wrap
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <p
                                                className={`
                                                    break-words
                                                    text-[11px]
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
                                            <p
                                                className="
                                                    mt-1.5
                                                    line-clamp-2
                                                    text-[9px]
                                                    leading-4
                                                    text-slate-500
                                                "
                                            >
                                                {section.content}
                                            </p>
                                        )}


                                        <div
                                            className="
                                                mt-2
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-2
                                            "
                                        >

                                            {selected && (
                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1
                                                        rounded-full
                                                        bg-blue-100
                                                        px-2
                                                        py-1
                                                        text-[8px]
                                                        font-semibold
                                                        text-blue-700
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            h-1.5
                                                            w-1.5
                                                            rounded-full
                                                            bg-blue-500
                                                        "
                                                    />

                                                    Currently Reading
                                                </span>
                                            )}


                                            {completed && (
                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1
                                                        text-[8px]
                                                        font-semibold
                                                        text-emerald-600
                                                    "
                                                >
                                                    ✓ Viewed
                                                </span>
                                            )}


                                            {section.imageUrl && (
                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1
                                                        text-[8px]
                                                        font-medium
                                                        text-slate-400
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

                                                    Image
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </button>
                        );
                    }
                )}

            </div>


            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div
                className="
                    hidden
                    border-t
                    border-slate-100
                    bg-slate-50/70
                    px-4
                    py-3
                    lg:block
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="
                            h-4
                            w-4
                            shrink-0
                            text-blue-500
                        "
                    >
                        <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>


                    <p
                        className="
                            text-[8px]
                            leading-4
                            text-slate-500
                        "
                    >
                        Complete each section carefully before moving
                        through the workplace safety programme.
                    </p>

                </div>

            </div>

        </aside>
    );
}


// ======================================================
// SECTION NUMBER
// ======================================================

function SectionNumber({
    number,
    selected = false,
    completed = false,
}) {

    let style =
        "bg-slate-100 text-slate-500";


    if (
        completed
    ) {
        style =
            "bg-emerald-100 text-emerald-700";
    }


    if (
        selected
    ) {
        style =
            "bg-blue-600 text-white shadow-sm";
    }


    return (
        <div
            className={`
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-[10px]
                font-bold
                transition

                ${style}
            `}
        >
            {completed && !selected
                ? "✓"
                : number}
        </div>
    );
}


export default LearningSectionList;