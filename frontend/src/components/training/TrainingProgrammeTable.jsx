import ActionButton from "../ui/ActionButton";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";

import {
    formatProgrammeType,
    getUserDisplayName,
} from "../../utils/training";


function TrainingProgrammeTable({
    programmes = [],
    processingId = "",
    onEdit,
    onManageSections,
    onDeactivate,
    onReactivate,
}) {
    if (programmes.length === 0) {
        return (
            <EmptyState
                title="No training programmes found."
                description="Create a programme or change the current filters."
            />
        );
    }


    return (
        <div className="overflow-x-auto">

            <table className="min-w-[900px] w-full">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <thead className="bg-slate-50">

                    <tr className="text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">

                        <th className="px-5 py-3">
                            Programme
                        </th>

                        <th className="px-5 py-3">
                            Type
                        </th>

                        <th className="px-5 py-3">
                            Owner
                        </th>

                        <th className="px-5 py-3">
                            Pass Mark
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

                    {programmes.map(
                        (programme) => {
                            const processing =
                                processingId ===
                                programme._id;


                            const inactive =
                                programme.status ===
                                "inactive";


                            return (
                                <tr
                                    key={
                                        programme._id
                                    }
                                    className="bg-white text-xs text-slate-700 transition hover:bg-slate-50"
                                >

                                    {/* Programme */}
                                    <td className="px-5 py-4">

                                        <div className="max-w-[280px]">

                                            <p className="font-semibold text-slate-900">
                                                {programme.title}
                                            </p>


                                            {programme.description && (
                                                <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">
                                                    {programme.description}
                                                </p>
                                            )}

                                        </div>

                                    </td>


                                    {/* Type */}
                                    <td className="whitespace-nowrap px-5 py-4">

                                        {formatProgrammeType(
                                            programme.programmeType
                                        )}

                                    </td>


                                    {/* Owner */}
                                    <td className="px-5 py-4">

                                        <p className="text-xs font-semibold text-slate-700">
                                            {getUserDisplayName(
                                                programme.ownerTrainer ||
                                                programme.owner ||
                                                programme.trainer,
                                                "—"
                                            )}
                                        </p>

                                    </td>


                                    {/* Pass mark */}
                                    <td className="whitespace-nowrap px-5 py-4">

                                        {programme.passMark ?? 0}%

                                    </td>


                                    {/* Status */}
                                    <td className="whitespace-nowrap px-5 py-4">

                                        <StatusBadge
                                            status={
                                                programme.status
                                            }
                                        />

                                    </td>


                                    {/* Actions */}
                                    <td className="px-5 py-4">

                                        <div className="flex flex-wrap justify-end gap-2">

                                            <ActionButton
                                                variant="secondary"
                                                disabled={
                                                    processing
                                                }
                                                onClick={() =>
                                                    onManageSections(
                                                        programme
                                                    )
                                                }
                                            >
                                                Sections
                                            </ActionButton>


                                            <ActionButton
                                                variant="secondary"
                                                disabled={
                                                    processing
                                                }
                                                onClick={() =>
                                                    onEdit(
                                                        programme
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
                                                            programme
                                                        )
                                                    }
                                                >
                                                    {processing
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
                                                            programme
                                                        )
                                                    }
                                                >
                                                    {processing
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
    );
}


export default TrainingProgrammeTable;