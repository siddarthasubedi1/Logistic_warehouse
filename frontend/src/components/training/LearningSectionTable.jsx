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
        !Array.isArray(sections) ||
        sections.length === 0
    ) {
        return (
            <EmptyState
                title="No learning sections found."
                description="Add the first learning section to this training programme."
                icon="training"
            />
        );
    }


    const reordering =
        processingId === "reorder";


    return (
        <div className="w-full min-w-0">

            {/* PROGRAMME INACTIVE */}

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
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-[11px]
                                font-bold
                                text-amber-600
                            "
                        >
                            !
                        </div>


                        <div>
                            <p
                                className="
                                    text-[9px]
                                    font-bold
                                    text-amber-800
                                "
                            >
                                Programme inactive
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    font-medium
                                    leading-4
                                    text-amber-700
                                "
                            >
                                Reactivate the programme before editing or reordering its learning sections.
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
                        font-semibold
                        text-blue-700
                        sm:px-5
                    "
                >
                    Updating learning section order...
                </div>
            )}


            {/* MOBILE / TABLET */}

            <div
                className="
                    grid
                    gap-3
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
                        <SectionCard
                            key={
                                section._id ||
                                index
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


            {/* DESKTOP */}

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
                    "
                >
                    <thead
                        className="
                            bg-slate-50
                        "
                    >
                        <tr>
                            <TableHead>
                                Order
                            </TableHead>

                            <TableHead>
                                Learning Section
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
                                            section._id ||
                                            index
                                        }
                                        className="
                                            border-t
                                            border-slate-100
                                            transition
                                            hover:bg-slate-50/60
                                        "
                                    >
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
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-blue-50
                                                        text-[8px]
                                                        font-bold
                                                        text-blue-600
                                                    "
                                                >
                                                    {index + 1}
                                                </span>


                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        gap-1
                                                    "
                                                >
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            programmeInactive ||
                                                            processing ||
                                                            index ===
                                                            0
                                                        }
                                                        onClick={() =>
                                                            onMoveUp?.(
                                                                section
                                                            )
                                                        }
                                                        className="
                                                            text-[9px]
                                                            font-bold
                                                            text-slate-500
                                                            hover:text-blue-600
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-30
                                                        "
                                                    >
                                                        ↑
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            programmeInactive ||
                                                            processing ||
                                                            index ===
                                                            sections.length -
                                                            1
                                                        }
                                                        onClick={() =>
                                                            onMoveDown?.(
                                                                section
                                                            )
                                                        }
                                                        className="
                                                            text-[9px]
                                                            font-bold
                                                            text-slate-500
                                                            hover:text-blue-600
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-30
                                                        "
                                                    >
                                                        ↓
                                                    </button>
                                                </div>
                                            </div>
                                        </td>


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
                                                        text-[9px]
                                                        font-bold
                                                        text-slate-800
                                                    "
                                                >
                                                    {section.title}
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        line-clamp-2
                                                        text-[7px]
                                                        font-medium
                                                        leading-4
                                                        text-slate-500
                                                    "
                                                >
                                                    {section.content ||
                                                        "No content"}
                                                </p>
                                            </div>
                                        </td>


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
                                                        h-12
                                                        w-16
                                                        rounded-lg
                                                        border
                                                        border-slate-200
                                                        object-cover
                                                    "
                                                />
                                            ) : (
                                                <span
                                                    className="
                                                        text-[8px]
                                                        font-medium
                                                        text-slate-400
                                                    "
                                                >
                                                    No image
                                                </span>
                                            )}
                                        </td>


                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <StatusBadge
                                                status={
                                                    section.status ||
                                                    "active"
                                                }
                                            />
                                        </td>


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


function SectionCard({
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
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
            "
        >
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
                        h-36
                        w-full
                        object-cover
                    "
                />
            )}


            <div
                className="
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
                            font-bold
                            text-blue-600
                        "
                    >
                        {index + 1}
                    </span>

                    <StatusBadge
                        status={
                            section.status ||
                            "active"
                        }
                    />
                </div>


                <h3
                    className="
                        mt-3
                        text-[10px]
                        font-bold
                        text-slate-800
                    "
                >
                    {section.title}
                </h3>


                <p
                    className="
                        mt-2
                        line-clamp-3
                        text-[8px]
                        font-medium
                        leading-5
                        text-slate-600
                    "
                >
                    {section.content ||
                        "No learning content."}
                </p>


                <div
                    className="
                        mt-4
                        flex
                        gap-2
                    "
                >
                    <button
                        type="button"
                        disabled={
                            programmeInactive ||
                            processing ||
                            index === 0
                        }
                        onClick={() =>
                            onMoveUp?.(
                                section
                            )
                        }
                        className="
                            min-h-[36px]
                            flex-1
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            text-[8px]
                            font-semibold
                            text-slate-600
                            disabled:opacity-40
                        "
                    >
                        ↑ Up
                    </button>

                    <button
                        type="button"
                        disabled={
                            programmeInactive ||
                            processing ||
                            index ===
                            total - 1
                        }
                        onClick={() =>
                            onMoveDown?.(
                                section
                            )
                        }
                        className="
                            min-h-[36px]
                            flex-1
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            text-[8px]
                            font-semibold
                            text-slate-600
                            disabled:opacity-40
                        "
                    >
                        ↓ Down
                    </button>
                </div>


                <div
                    className="
                        mt-3
                        grid
                        grid-cols-2
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
            </div>
        </article>
    );
}


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
                font-bold
                uppercase
                tracking-wide
                text-slate-500

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