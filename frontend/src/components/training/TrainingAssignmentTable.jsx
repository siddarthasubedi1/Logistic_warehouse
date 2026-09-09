import ActionButton from "../ui/ActionButton";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";

import {
    formatProgrammeType,
    formatTrainingDate,
    getAssignmentProgramme,
    getAssignmentTrainee,
    getUserDisplayName,
} from "../../utils/training";


function TrainingAssignmentTable({
    assignments = [],
    actionLoadingId = "",
    onDeactivate,
    onReactivate,
}) {
    if (
        assignments.length ===
        0
    ) {
        return (
            <EmptyState
                title="No training assignments found."
                description="Assign a training programme to a Trainee to see it here."
            />
        );
    }


    return (
        <div className="overflow-x-auto">

            <table className="min-w-[950px] w-full">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <thead className="bg-slate-50">

                    <tr className="text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">

                        <th className="px-5 py-3">
                            Trainee
                        </th>

                        <th className="px-5 py-3">
                            Programme
                        </th>

                        <th className="px-5 py-3">
                            Type
                        </th>

                        <th className="px-5 py-3">
                            Assigned
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

                    {assignments.map(
                        (
                            assignment
                        ) => {
                            const programme =
                                getAssignmentProgramme(
                                    assignment
                                );


                            const trainee =
                                getAssignmentTrainee(
                                    assignment
                                );


                            const inactive =
                                assignment.status ===
                                "inactive";


                            const processing =
                                actionLoadingId ===
                                assignment._id;


                            return (
                                <tr
                                    key={
                                        assignment._id
                                    }
                                    className="bg-white text-xs text-slate-700 transition hover:bg-slate-50"
                                >

                                    {/* Trainee */}
                                    <td className="px-5 py-4">

                                        <p className="font-semibold text-slate-900">
                                            {getUserDisplayName(
                                                trainee,
                                                "Unknown Trainee"
                                            )}
                                        </p>


                                        {trainee?.username && (
                                            <p className="mt-1 text-[11px] text-slate-500">
                                                @{trainee.username}
                                            </p>
                                        )}

                                    </td>


                                    {/* Programme */}
                                    <td className="px-5 py-4">

                                        <p className="max-w-[250px] font-semibold text-slate-900">
                                            {programme?.title ||
                                                "Programme unavailable"}
                                        </p>

                                    </td>


                                    {/* Type */}
                                    <td className="whitespace-nowrap px-5 py-4">

                                        {formatProgrammeType(
                                            programme?.programmeType
                                        )}

                                    </td>


                                    {/* Assigned */}
                                    <td className="whitespace-nowrap px-5 py-4">

                                        {formatTrainingDate(
                                            assignment.assignedAt ||
                                            assignment.createdAt
                                        )}

                                    </td>


                                    {/* Status */}
                                    <td className="whitespace-nowrap px-5 py-4">

                                        <StatusBadge
                                            status={
                                                assignment.status
                                            }
                                        />

                                    </td>


                                    {/* Actions */}
                                    <td className="px-5 py-4">

                                        <div className="flex justify-end">

                                            {inactive ? (
                                                <ActionButton
                                                    variant="success"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onReactivate(
                                                            assignment
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
                                                            assignment
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


export default TrainingAssignmentTable;