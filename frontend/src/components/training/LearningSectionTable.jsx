import ActionButton from "../ui/ActionButton";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";


function LearningSectionTable({
    sections = [],
    processingId = "",
    programmeInactive = false,
    onEdit,
    onDeactivate,
    onReactivate,
    onMoveUp,
    onMoveDown,
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
                title="No learning sections found."
                description="Add the first learning section to this programme."
            />
        );
    }


    // ======================================================
    // REORDERING
    // ======================================================

    const reordering =
        processingId ===
        "reorder";


    return (
        <section
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
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-slate-200
                    bg-gradient-to-r
                    from-white
                    to-blue-50/40
                    px-4
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
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
                            <path d="M5 4h14v16H5z" />
                            <path d="M8 8h8" />
                            <path d="M8 12h8" />
                            <path d="M8 16h5" />
                        </svg>
                    </div>


                    <div>

                        <h2
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Learning Sections
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Manage content, status and learning order.
                        </p>

                    </div>

                </div>


                <span
                    className="
                        w-fit
                        rounded-full
                        bg-blue-50
                        px-3
                        py-1.5
                        text-[9px]
                        font-semibold
                        text-blue-700
                    "
                >
                    {sections.length} Section
                    {sections.length === 1 ? "" : "s"}
                </span>

            </div>


            {/* ================================================= */}
            {/* INACTIVE PROGRAMME NOTICE */}
            {/* ================================================= */}

            {programmeInactive && (
                <div
                    className="
                        border-b
                        border-amber-200
                        bg-amber-50
                        px-4
                        py-3
                        sm:px-5
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
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                text-amber-600
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
                                Programme Inactive
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    leading-4
                                    text-amber-700
                                "
                            >
                                Learning sections cannot be edited or
                                reordered until this programme is
                                reactivated.
                            </p>

                        </div>

                    </div>

                </div>
            )}


            {/* ================================================= */}
            {/* REORDERING */}
            {/* ================================================= */}

            {reordering && (
                <div
                    className="
                        border-b
                        border-blue-100
                        bg-blue-50
                        px-4
                        py-3
                        sm:px-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className="
                                h-4
                                w-4
                                animate-spin
                                rounded-full
                                border-2
                                border-blue-200
                                border-t-blue-600
                            "
                        />


                        <p
                            className="
                                text-[10px]
                                font-semibold
                                text-blue-700
                            "
                        >
                            Updating section order...
                        </p>

                    </div>

                </div>
            )}


            {/* ================================================= */}
            {/* MOBILE / TABLET CARDS */}
            {/* ================================================= */}

            <div
                className="
                    grid
                    gap-4
                    p-4
                    md:grid-cols-2
                    lg:hidden
                "
            >

                {sections.map(
                    (
                        section,
                        index
                    ) => (
                        <LearningSectionCard
                            key={
                                section._id
                            }
                            section={
                                section
                            }
                            index={
                                index
                            }
                            totalSections={
                                sections.length
                            }
                            processingId={
                                processingId
                            }
                            programmeInactive={
                                programmeInactive
                            }
                            onEdit={
                                onEdit
                            }
                            onDeactivate={
                                onDeactivate
                            }
                            onReactivate={
                                onReactivate
                            }
                            onMoveUp={
                                onMoveUp
                            }
                            onMoveDown={
                                onMoveDown
                            }
                        />
                    )
                )}

            </div>


            {/* ================================================= */}
            {/* DESKTOP TABLE */}
            {/* ================================================= */}

            <div
                className="
                    hidden
                    overflow-x-auto
                    lg:block
                "
            >

                <table
                    className="
                        w-full
                        min-w-[900px]
                    "
                >

                    <thead className="bg-slate-50">

                        <tr
                            className="
                                text-left
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >

                            <th className="px-5 py-3.5">
                                Order
                            </th>

                            <th className="px-5 py-3.5">
                                Section
                            </th>

                            <th className="px-5 py-3.5">
                                Visual
                            </th>

                            <th className="px-5 py-3.5">
                                Status
                            </th>

                            <th className="px-5 py-3.5 text-right">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody
                        className="
                            divide-y
                            divide-slate-100
                        "
                    >

                        {sections.map(
                            (
                                section,
                                index
                            ) => {

                                const sectionProcessing =
                                    processingId ===
                                    section._id;


                                const processing =
                                    sectionProcessing ||
                                    reordering;


                                const inactive =
                                    section.status ===
                                    "inactive";


                                const firstSection =
                                    index ===
                                    0;


                                const lastSection =
                                    index ===
                                    sections.length -
                                    1;


                                return (
                                    <tr
                                        key={
                                            section._id
                                        }
                                        className="
                                            bg-white
                                            text-xs
                                            text-slate-700
                                            transition
                                            hover:bg-slate-50
                                        "
                                    >

                                        {/* ORDER */}

                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <OrderNumber
                                                    value={
                                                        section.order ??
                                                        index + 1
                                                    }
                                                />


                                                <OrderButtons
                                                    firstSection={
                                                        firstSection
                                                    }
                                                    lastSection={
                                                        lastSection
                                                    }
                                                    processing={
                                                        processing
                                                    }
                                                    programmeInactive={
                                                        programmeInactive
                                                    }
                                                    onMoveUp={() =>
                                                        onMoveUp(
                                                            section,
                                                            index
                                                        )
                                                    }
                                                    onMoveDown={() =>
                                                        onMoveDown(
                                                            section,
                                                            index
                                                        )
                                                    }
                                                />

                                            </div>

                                        </td>


                                        {/* SECTION */}

                                        <td className="px-5 py-4">

                                            <div
                                                className="
                                                    max-w-[420px]
                                                "
                                            >

                                                <p
                                                    className="
                                                        break-words
                                                        font-semibold
                                                        text-slate-900
                                                    "
                                                >
                                                    {section.title}
                                                </p>


                                                {section.content && (
                                                    <p
                                                        className="
                                                            mt-1
                                                            line-clamp-2
                                                            text-[10px]
                                                            leading-5
                                                            text-slate-500
                                                        "
                                                    >
                                                        {section.content}
                                                    </p>
                                                )}

                                            </div>

                                        </td>


                                        {/* IMAGE */}

                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                            "
                                        >

                                            {section.imageUrl ? (
                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        bg-blue-50
                                                        px-2.5
                                                        py-1
                                                        text-[9px]
                                                        font-semibold
                                                        text-blue-700
                                                        ring-1
                                                        ring-inset
                                                        ring-blue-200
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
                                            ) : (
                                                <span
                                                    className="
                                                        text-[9px]
                                                        text-slate-400
                                                    "
                                                >
                                                    No image
                                                </span>
                                            )}

                                        </td>


                                        {/* STATUS */}

                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                            "
                                        >
                                            <StatusBadge
                                                status={
                                                    section.status
                                                }
                                            />
                                        </td>


                                        {/* ACTIONS */}

                                        <td className="px-5 py-4">

                                            <div
                                                className="
                                                    flex
                                                    flex-wrap
                                                    justify-end
                                                    gap-2
                                                "
                                            >

                                                <ActionButton
                                                    variant="secondary"
                                                    disabled={
                                                        processing ||
                                                        programmeInactive
                                                    }
                                                    onClick={() =>
                                                        onEdit(
                                                            section
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </ActionButton>


                                                {inactive ? (
                                                    <ActionButton
                                                        variant="success"
                                                        disabled={
                                                            processing
                                                        }
                                                        onClick={() =>
                                                            onReactivate(
                                                                section
                                                            )
                                                        }
                                                    >
                                                        {sectionProcessing
                                                            ? "Processing..."
                                                            : "Reactivate"}
                                                    </ActionButton>
                                                ) : (
                                                    <ActionButton
                                                        variant="warning"
                                                        disabled={
                                                            processing
                                                        }
                                                        onClick={() =>
                                                            onDeactivate(
                                                                section
                                                            )
                                                        }
                                                    >
                                                        {sectionProcessing
                                                            ? "Processing..."
                                                            : "Deactivate"}
                                                    </ActionButton>
                                                )}

                                            </div>

                                        </td>

                                    </tr>
                                );
                            }
                        )}

                    </tbody>

                </table>

            </div>

        </section>
    );
}


// ======================================================
// MOBILE CARD
// ======================================================

function LearningSectionCard({
    section,
    index,
    totalSections,
    processingId,
    programmeInactive,
    onEdit,
    onDeactivate,
    onReactivate,
    onMoveUp,
    onMoveDown,
}) {

    const sectionProcessing =
        processingId ===
        section._id;


    const reordering =
        processingId ===
        "reorder";


    const processing =
        sectionProcessing ||
        reordering;


    const inactive =
        section.status ===
        "inactive";


    const firstSection =
        index ===
        0;


    const lastSection =
        index ===
        totalSections -
        1;


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

            <div
                className="
                    h-1
                    w-full
                    bg-blue-500
                "
            />


            <div className="p-4">

                {/* TOP */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <OrderNumber
                            value={
                                section.order ??
                                index + 1
                            }
                        />


                        <div>

                            <p
                                className="
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Learning Section
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-slate-500
                                "
                            >
                                Position {index + 1} of {totalSections}
                            </p>

                        </div>

                    </div>


                    <StatusBadge
                        status={
                            section.status
                        }
                    />

                </div>


                {/* TITLE */}

                <h3
                    className="
                        mt-4
                        break-words
                        text-sm
                        font-bold
                        text-slate-900
                    "
                >
                    {section.title}
                </h3>


                {section.content && (
                    <p
                        className="
                            mt-2
                            line-clamp-3
                            text-[10px]
                            leading-5
                            text-slate-500
                        "
                    >
                        {section.content}
                    </p>
                )}


                {/* IMAGE */}

                {section.imageUrl && (
                    <div
                        className="
                            mt-3
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-blue-50
                            px-2.5
                            py-1.5
                            text-[9px]
                            font-semibold
                            text-blue-700
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-3.5 w-3.5"
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

                        Supporting Image Included
                    </div>
                )}


                {/* REORDER */}

                <div
                    className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        gap-3
                        rounded-xl
                        bg-slate-50
                        p-3
                    "
                >

                    <span
                        className="
                            text-[9px]
                            font-semibold
                            text-slate-500
                        "
                    >
                        Learning Order
                    </span>


                    <OrderButtons
                        firstSection={
                            firstSection
                        }
                        lastSection={
                            lastSection
                        }
                        processing={
                            processing
                        }
                        programmeInactive={
                            programmeInactive
                        }
                        onMoveUp={() =>
                            onMoveUp(
                                section,
                                index
                            )
                        }
                        onMoveDown={() =>
                            onMoveDown(
                                section,
                                index
                            )
                        }
                    />

                </div>


                {/* ACTIONS */}

                <div
                    className="
                        mt-4
                        grid
                        gap-2
                        sm:grid-cols-2
                    "
                >

                    <ActionButton
                        variant="secondary"
                        disabled={
                            processing ||
                            programmeInactive
                        }
                        onClick={() =>
                            onEdit(
                                section
                            )
                        }
                        className="justify-center"
                    >
                        Edit Section
                    </ActionButton>


                    {inactive ? (
                        <ActionButton
                            variant="success"
                            disabled={
                                processing
                            }
                            onClick={() =>
                                onReactivate(
                                    section
                                )
                            }
                            className="justify-center"
                        >
                            {sectionProcessing
                                ? "Processing..."
                                : "Reactivate"}
                        </ActionButton>
                    ) : (
                        <ActionButton
                            variant="warning"
                            disabled={
                                processing
                            }
                            onClick={() =>
                                onDeactivate(
                                    section
                                )
                            }
                            className="justify-center"
                        >
                            {sectionProcessing
                                ? "Processing..."
                                : "Deactivate"}
                        </ActionButton>
                    )}

                </div>

            </div>

        </article>
    );
}


// ======================================================
// ORDER NUMBER
// ======================================================

function OrderNumber({
    value,
}) {
    return (
        <span
            className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-[11px]
                font-bold
                text-blue-700
                ring-1
                ring-blue-100
            "
        >
            {value}
        </span>
    );
}


// ======================================================
// ORDER BUTTONS
// ======================================================

function OrderButtons({
    firstSection,
    lastSection,
    processing,
    programmeInactive,
    onMoveUp,
    onMoveDown,
}) {
    return (
        <div
            className="
                flex
                gap-1.5
            "
        >

            <button
                type="button"
                title="Move section up"
                disabled={
                    processing ||
                    firstSection ||
                    programmeInactive
                }
                onClick={
                    onMoveUp
                }
                className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    text-sm
                    font-bold
                    text-slate-600
                    shadow-sm
                    transition
                    hover:border-blue-300
                    hover:bg-blue-50
                    hover:text-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-35
                "
            >
                ↑
            </button>


            <button
                type="button"
                title="Move section down"
                disabled={
                    processing ||
                    lastSection ||
                    programmeInactive
                }
                onClick={
                    onMoveDown
                }
                className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    text-sm
                    font-bold
                    text-slate-600
                    shadow-sm
                    transition
                    hover:border-blue-300
                    hover:bg-blue-50
                    hover:text-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-35
                "
            >
                ↓
            </button>

        </div>
    );
}


export default LearningSectionTable;