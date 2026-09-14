import ActionButton from "../ui/ActionButton";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";


function LearningSectionTable({
    sections = [],
    processingId = "",
    onPreview,
    onEdit,
    onMoveUp,
    onMoveDown,
    onDelete,
}) {
    if (
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
                    title="No learning sections found."
                    description="Create the first learning section for this training programme."
                    icon="training"
                />
            </section>
        );
    }


    return (
        <section
            className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            {/* =================================================
                HEADER
            ================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-2
                    border-b
                    border-slate-100
                    px-4
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
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
                        Manage programme learning content and section order.
                    </p>
                </div>


                <span
                    className="
                        w-fit
                        rounded-full
                        bg-slate-100
                        px-3
                        py-1
                        text-[8px]
                        font-semibold
                        text-slate-600
                    "
                >
                    {sections.length} Section
                    {sections.length === 1
                        ? ""
                        : "s"}
                </span>
            </div>


            {/* =================================================
                MOBILE / TABLET CARDS
            ================================================== */}

            <div
                className="
                    grid
                    gap-3
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
                            onPreview={
                                onPreview
                            }
                            onEdit={
                                onEdit
                            }
                            onMoveUp={
                                onMoveUp
                            }
                            onMoveDown={
                                onMoveDown
                            }
                            onDelete={
                                onDelete
                            }
                        />
                    )
                )}
            </div>


            {/* =================================================
                DESKTOP TABLE
            ================================================== */}

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
                    <thead
                        className="
                            bg-slate-50
                        "
                    >
                        <tr>
                            <Head>
                                Order
                            </Head>

                            <Head>
                                Learning Section
                            </Head>

                            <Head>
                                Content
                            </Head>

                            <Head>
                                Status
                            </Head>

                            <Head>
                                Reorder
                            </Head>

                            <Head right>
                                Actions
                            </Head>
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
                                    section._id;


                                return (
                                    <tr
                                        key={
                                            section._id
                                        }
                                        className="
                                            border-t
                                            border-slate-100
                                            transition
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
                                                    h-8
                                                    w-8
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-blue-50
                                                    text-[9px]
                                                    font-bold
                                                    text-blue-700
                                                "
                                            >
                                                {section.order ||
                                                    index + 1}
                                            </div>
                                        </td>


                                        {/* TITLE */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <div
                                                className="
                                                    max-w-[230px]
                                                "
                                            >
                                                <p
                                                    className="
                                                        text-[9px]
                                                        font-bold
                                                        text-[#172033]
                                                    "
                                                >
                                                    {section.title}
                                                </p>


                                                {section.imageUrl && (
                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[7px]
                                                            font-medium
                                                            text-blue-600
                                                        "
                                                    >
                                                        Image attached
                                                    </p>
                                                )}
                                            </div>
                                        </td>


                                        {/* CONTENT */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <p
                                                className="
                                                    max-w-[280px]
                                                    line-clamp-3
                                                    text-[8px]
                                                    font-medium
                                                    leading-4
                                                    text-slate-500
                                                "
                                            >
                                                {section.content ||
                                                    "No learning content provided."}
                                            </p>
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
                                                    section.status ||
                                                    "active"
                                                }
                                            />
                                        </td>


                                        {/* REORDER */}

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
                                                    gap-1.5
                                                "
                                            >
                                                <OrderButton
                                                    label="Move section up"
                                                    disabled={
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
                                                >
                                                    ↑
                                                </OrderButton>


                                                <OrderButton
                                                    label="Move section down"
                                                    disabled={
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
                                                >
                                                    ↓
                                                </OrderButton>
                                            </div>
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
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onPreview?.(
                                                            section
                                                        )
                                                    }
                                                >
                                                    Preview
                                                </ActionButton>


                                                <ActionButton
                                                    variant="secondary"
                                                    disabled={
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


                                                <ActionButton
                                                    variant="danger"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onDelete?.(
                                                            section
                                                        )
                                                    }
                                                >
                                                    {processing
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </ActionButton>
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


/* =========================================================
   MOBILE SECTION CARD
========================================================= */

function LearningSectionCard({
    section,
    index,
    total,
    processingId,
    onPreview,
    onEdit,
    onMoveUp,
    onMoveDown,
    onDelete,
}) {
    const processing =
        processingId ===
        section._id;


    return (
        <article
            className="
                rounded-xl
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
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-50
                            text-[9px]
                            font-bold
                            text-blue-700
                        "
                    >
                        {section.order ||
                            index + 1}
                    </div>


                    <div
                        className="
                            min-w-0
                        "
                    >
                        <h3
                            className="
                                text-[10px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            {section.title}
                        </h3>


                        <p
                            className="
                                mt-1
                                text-[7px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Section{" "}
                            {section.order ||
                                index + 1}
                        </p>
                    </div>
                </div>


                <StatusBadge
                    status={
                        section.status ||
                        "active"
                    }
                />
            </div>


            <p
                className="
                    mt-3
                    line-clamp-4
                    text-[8px]
                    font-medium
                    leading-5
                    text-slate-600
                "
            >
                {section.content ||
                    "No learning content provided."}
            </p>


            {section.imageUrl && (
                <div
                    className="
                        mt-3
                        overflow-hidden
                        rounded-lg
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
                            "Learning section"
                        }
                        className="
                            h-32
                            w-full
                            object-cover
                        "
                    />
                </div>
            )}


            {/* ORDER CONTROLS */}

            <div
                className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    gap-3
                    border-t
                    border-slate-100
                    pt-3
                "
            >
                <p
                    className="
                        text-[7px]
                        font-semibold
                        text-slate-500
                    "
                >
                    Change order
                </p>


                <div
                    className="
                        flex
                        gap-2
                    "
                >
                    <OrderButton
                        label="Move section up"
                        disabled={
                            processing ||
                            index === 0
                        }
                        onClick={() =>
                            onMoveUp?.(
                                section,
                                index
                            )
                        }
                    >
                        ↑
                    </OrderButton>


                    <OrderButton
                        label="Move section down"
                        disabled={
                            processing ||
                            index ===
                            total - 1
                        }
                        onClick={() =>
                            onMoveDown?.(
                                section,
                                index
                            )
                        }
                    >
                        ↓
                    </OrderButton>
                </div>
            </div>


            {/* ACTIONS */}

            <div
                className="
                    mt-3
                    grid
                    gap-2
                    sm:grid-cols-3
                "
            >
                <ActionButton
                    variant="secondary"
                    disabled={
                        processing
                    }
                    onClick={() =>
                        onPreview?.(
                            section
                        )
                    }
                >
                    Preview
                </ActionButton>


                <ActionButton
                    variant="secondary"
                    disabled={
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


                <ActionButton
                    variant="danger"
                    disabled={
                        processing
                    }
                    onClick={() =>
                        onDelete?.(
                            section
                        )
                    }
                >
                    {processing
                        ? "Deleting..."
                        : "Delete"}
                </ActionButton>
            </div>
        </article>
    );
}


/* =========================================================
   ORDER BUTTON
========================================================= */

function OrderButton({
    children,
    label,
    disabled,
    onClick,
}) {
    return (
        <button
            type="button"
            aria-label={
                label
            }
            title={
                label
            }
            disabled={
                disabled
            }
            onClick={
                onClick
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
                text-[12px]
                font-bold
                text-slate-600
                transition

                hover:border-blue-300
                hover:bg-blue-50
                hover:text-blue-700

                disabled:cursor-not-allowed
                disabled:opacity-30
                disabled:hover:border-slate-200
                disabled:hover:bg-white
                disabled:hover:text-slate-600
            "
        >
            {children}
        </button>
    );
}


/* =========================================================
   TABLE HEADER
========================================================= */

function Head({
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