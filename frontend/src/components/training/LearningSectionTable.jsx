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


    const reordering =
        processingId ===
        "reorder";


    return (
        <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <thead className="bg-slate-50">

                    <tr
                        className="
                            text-left
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-500
                        "
                    >
                        <th className="px-5 py-3">
                            Order
                        </th>

                        <th className="px-5 py-3">
                            Section
                        </th>

                        <th className="px-5 py-3">
                            Status
                        </th>

                        <th className="px-5 py-3 text-right">
                            Actions
                        </th>
                    </tr>

                </thead>


                {/* ================================================= */}
                {/* BODY */}
                {/* ================================================= */}

                <tbody className="divide-y divide-slate-100">

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

                                    {/* ================================= */}
                                    {/* ORDER */}
                                    {/* ================================= */}

                                    <td className="whitespace-nowrap px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            <span
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-slate-100
                                                    text-xs
                                                    font-bold
                                                    text-slate-700
                                                "
                                            >
                                                {section.order ??
                                                    index +
                                                    1}
                                            </span>


                                            <div className="flex gap-1">

                                                <button
                                                    type="button"
                                                    title="Move section up"
                                                    disabled={
                                                        processing ||
                                                        firstSection ||
                                                        programmeInactive
                                                    }
                                                    onClick={() =>
                                                        onMoveUp(
                                                            section,
                                                            index
                                                        )
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
                                                    onClick={() =>
                                                        onMoveDown(
                                                            section,
                                                            index
                                                        )
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

                                        </div>

                                    </td>


                                    {/* ================================= */}
                                    {/* SECTION */}
                                    {/* ================================= */}

                                    <td className="px-5 py-4">

                                        <div className="max-w-[450px]">

                                            <p className="font-semibold text-slate-900">
                                                {section.title}
                                            </p>


                                            {section.content && (
                                                <p
                                                    className="
                                                        mt-1
                                                        line-clamp-2
                                                        text-[11px]
                                                        leading-5
                                                        text-slate-500
                                                    "
                                                >
                                                    {section.content}
                                                </p>
                                            )}


                                            {section.imageUrl && (
                                                <p
                                                    className="
                                                        mt-2
                                                        text-[10px]
                                                        font-semibold
                                                        text-blue-600
                                                    "
                                                >
                                                    Image included
                                                </p>
                                            )}

                                        </div>

                                    </td>


                                    {/* ================================= */}
                                    {/* STATUS */}
                                    {/* ================================= */}

                                    <td className="whitespace-nowrap px-5 py-4">

                                        <StatusBadge
                                            status={
                                                section.status
                                            }
                                        />

                                    </td>


                                    {/* ================================= */}
                                    {/* ACTIONS */}
                                    {/* ================================= */}

                                    <td className="px-5 py-4">

                                        <div
                                            className="
                                                flex
                                                flex-wrap
                                                justify-end
                                                gap-2
                                            "
                                        >

                                            {/* ========================= */}
                                            {/* EDIT */}
                                            {/* ========================= */}

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


                                            {/* ========================= */}
                                            {/* ACTIVE / INACTIVE */}
                                            {/* ========================= */}

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


            {/* ================================================= */}
            {/* INACTIVE PROGRAMME NOTICE */}
            {/* ================================================= */}

            {programmeInactive && (
                <div
                    className="
                        border-t
                        border-amber-100
                        bg-amber-50
                        px-5
                        py-3
                    "
                >
                    <p className="text-xs leading-5 text-amber-700">
                        This programme is inactive. Learning sections
                        cannot be edited or reordered until the
                        programme is reactivated.
                    </p>
                </div>
            )}


            {/* ================================================= */}
            {/* REORDER STATUS */}
            {/* ================================================= */}

            {reordering && (
                <div
                    className="
                        border-t
                        border-blue-100
                        bg-blue-50
                        px-5
                        py-3
                    "
                >
                    <p className="text-xs font-medium text-blue-700">
                        Updating section order...
                    </p>
                </div>
            )}

        </div>
    );
}


export default LearningSectionTable;