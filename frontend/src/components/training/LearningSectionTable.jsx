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
    if (
        !Array.isArray(
            sections
        ) ||
        sections.length === 0
    ) {
        return (
            <EmptyState
                title="No learning sections found."
                description="Add the first learning section to this programme."
                icon="training"
            />
        );
    }


    const reordering =
        processingId ===
        "reorder";


    return (
        <div className="w-full">

            {/* ================================================= */}
            {/* NOTICE */}
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
                                rounded-full
                                bg-white
                                text-amber-600
                            "
                        >
                            <span className="text-[10px] font-bold">
                                !
                            </span>
                        </div>


                        <div>
                            <p
                                className="
                                    text-[9px]
                                    font-medium
                                    text-amber-700
                                "
                            >
                                This programme is inactive.
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    leading-4
                                    text-amber-600
                                "
                            >
                                Sections cannot be edited or reordered until the programme is reactivated.
                            </p>
                        </div>
                    </div>
                </div>
            )}


            {reordering && (
                <div
                    className="
                        border-b
                        border-blue-100
                        bg-blue-50
                        px-4
                        py-2.5
                        text-[8px]
                        font-medium
                        text-blue-600
                        sm:px-5
                    "
                >
                    Updating section order...
                </div>
            )}


            {/* ================================================= */}
            {/* MOBILE */}
            {/* ================================================= */}

            <div
                className="
                    space-y-3
                    p-4
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
                            total={
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
                        min-w-[900px]
                        w-full
                        border-collapse
                    "
                >
                    <thead
                        className="
                            border-b
                            border-slate-200
                            bg-slate-50
                        "
                    >
                        <tr>
                            <TableHead>
                                Order
                            </TableHead>

                            <TableHead>
                                Section
                            </TableHead>

                            <TableHead>
                                Image
                            </TableHead>

                            <TableHead>
                                Status
                            </TableHead>

                            <TableHead right>
                                Actions
                            </TableHead>
                        </tr>
                    </thead>


                    <tbody>
                        {sections.map(
                            (
                                section,
                                index
                            ) => {
                                const processing =
                                    processingId ===
                                    section._id ||
                                    reordering;


                                const inactive =
                                    section.status ===
                                    "inactive";


                                return (
                                    <tr
                                        key={
                                            section._id
                                        }
                                        className="
                                            border-b
                                            border-slate-100
                                            bg-white
                                            last:border-0
                                            hover:bg-slate-50/60
                                        "
                                    >
                                        {/* ORDER */}

                                        <td
                                            className="
                                                px-5
                                                py-4
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
                                                        flex
                                                        h-7
                                                        w-7
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-blue-50
                                                        text-[8px]
                                                        font-semibold
                                                        text-blue-600
                                                    "
                                                >
                                                    {
                                                        section.order ??
                                                        index +
                                                        1
                                                    }
                                                </span>


                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        gap-1
                                                    "
                                                >
                                                    <OrderButton
                                                        direction="up"
                                                        disabled={
                                                            programmeInactive ||
                                                            processing ||
                                                            index ===
                                                            0
                                                        }
                                                        onClick={() =>
                                                            onMoveUp?.(
                                                                section,
                                                                index
                                                            )
                                                        }
                                                    />


                                                    <OrderButton
                                                        direction="down"
                                                        disabled={
                                                            programmeInactive ||
                                                            processing ||
                                                            index ===
                                                            sections.length -
                                                            1
                                                        }
                                                        onClick={() =>
                                                            onMoveDown?.(
                                                                section,
                                                                index
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </td>


                                        {/* SECTION */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <div
                                                className="
                                                    max-w-[330px]
                                                "
                                            >
                                                <p
                                                    className="
                                                        truncate
                                                        text-[9px]
                                                        font-semibold
                                                        text-slate-700
                                                    "
                                                >
                                                    {
                                                        section.title
                                                    }
                                                </p>


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
                                        </td>


                                        {/* IMAGE */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            {section.imageUrl ? (
                                                <img
                                                    src={
                                                        section.imageUrl
                                                    }
                                                    alt={
                                                        section.imageAltText ||
                                                        section.title
                                                    }
                                                    className="
                                                        h-10
                                                        w-14
                                                        rounded-md
                                                        border
                                                        border-slate-200
                                                        object-cover
                                                    "
                                                />
                                            ) : (
                                                <span
                                                    className="
                                                        text-[8px]
                                                        text-slate-400
                                                    "
                                                >
                                                    —
                                                </span>
                                            )}
                                        </td>


                                        {/* STATUS */}

                                        <td
                                            className="
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

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
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
                                                        programmeInactive ||
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onEdit?.(
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
                                                            programmeInactive ||
                                                            processing
                                                        }
                                                        onClick={() =>
                                                            onReactivate?.(
                                                                section
                                                            )
                                                        }
                                                    >
                                                        Reactivate
                                                    </ActionButton>
                                                ) : (
                                                    <ActionButton
                                                        variant="warning"
                                                        disabled={
                                                            programmeInactive ||
                                                            processing
                                                        }
                                                        onClick={() =>
                                                            onDeactivate?.(
                                                                section
                                                            )
                                                        }
                                                    >
                                                        Deactivate
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
        </div>
    );
}


// ======================================================
// MOBILE CARD
// ======================================================

function LearningSectionCard({
    section,
    index,
    total,
    processingId,
    programmeInactive,
    onEdit,
    onDeactivate,
    onReactivate,
    onMoveUp,
    onMoveDown,
}) {
    const processing =
        processingId ===
        section._id ||
        processingId ===
        "reorder";


    const inactive =
        section.status ===
        "inactive";


    return (
        <article
            className="
                rounded-lg
                border
                border-slate-200
                bg-white
                p-4
            "
        >
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
                        min-w-0
                        items-start
                        gap-3
                    "
                >
                    <span
                        className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-50
                            text-[8px]
                            font-semibold
                            text-blue-600
                        "
                    >
                        {
                            section.order ??
                            index +
                            1
                        }
                    </span>


                    <div
                        className="
                            min-w-0
                        "
                    >
                        <h3
                            className="
                                break-words
                                text-[10px]
                                font-semibold
                                text-slate-700
                            "
                        >
                            {section.title}
                        </h3>


                        <div
                            className="
                                mt-2
                            "
                        >
                            <StatusBadge
                                status={
                                    section.status
                                }
                            />
                        </div>
                    </div>
                </div>


                <div
                    className="
                        flex
                        gap-1
                    "
                >
                    <OrderButton
                        direction="up"
                        disabled={
                            programmeInactive ||
                            processing ||
                            index ===
                            0
                        }
                        onClick={() =>
                            onMoveUp?.(
                                section,
                                index
                            )
                        }
                    />


                    <OrderButton
                        direction="down"
                        disabled={
                            programmeInactive ||
                            processing ||
                            index ===
                            total -
                            1
                        }
                        onClick={() =>
                            onMoveDown?.(
                                section,
                                index
                            )
                        }
                    />
                </div>
            </div>


            {section.content && (
                <p
                    className="
                        mt-3
                        line-clamp-3
                        text-[8px]
                        leading-4
                        text-slate-500
                    "
                >
                    {section.content}
                </p>
            )}


            {section.imageUrl && (
                <img
                    src={
                        section.imageUrl
                    }
                    alt={
                        section.imageAltText ||
                        section.title
                    }
                    className="
                        mt-3
                        max-h-[170px]
                        w-full
                        rounded-lg
                        border
                        border-slate-200
                        object-cover
                    "
                />
            )}


            <div
                className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-2
                    border-t
                    border-slate-100
                    pt-4
                "
            >
                <ActionButton
                    variant="secondary"
                    disabled={
                        programmeInactive ||
                        processing
                    }
                    onClick={() =>
                        onEdit?.(
                            section
                        )
                    }
                    className="
                        w-full
                        justify-center
                    "
                >
                    Edit
                </ActionButton>


                {inactive ? (
                    <ActionButton
                        variant="success"
                        disabled={
                            programmeInactive ||
                            processing
                        }
                        onClick={() =>
                            onReactivate?.(
                                section
                            )
                        }
                        className="
                            w-full
                            justify-center
                        "
                    >
                        Reactivate
                    </ActionButton>
                ) : (
                    <ActionButton
                        variant="warning"
                        disabled={
                            programmeInactive ||
                            processing
                        }
                        onClick={() =>
                            onDeactivate?.(
                                section
                            )
                        }
                        className="
                            w-full
                            justify-center
                        "
                    >
                        Deactivate
                    </ActionButton>
                )}
            </div>
        </article>
    );
}


// ======================================================
// ORDER BUTTON
// ======================================================

function OrderButton({
    direction,
    disabled,
    onClick,
}) {
    return (
        <button
            type="button"
            disabled={
                disabled
            }
            onClick={
                onClick
            }
            className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-md
                border
                border-slate-200
                bg-white
                text-[9px]
                text-slate-500
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-30
            "
        >
            {direction ===
                "up"
                ? "↑"
                : "↓"}
        </button>
    );
}


// ======================================================
// TABLE HEAD
// ======================================================

function TableHead({
    children,
    right = false,
}) {
    return (
        <th
            className={`
                px-5
                py-3
                text-[7px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-400

                ${right
                    ? "text-right"
                    : "text-left"
                }
            `}
        >
            {children}
        </th>
    );
}


export default LearningSectionTable;