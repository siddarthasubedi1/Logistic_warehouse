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
        !Array.isArray(assignments) ||
        assignments.length === 0
    ) {
        return (
            <EmptyState
                title="No training assignments found."
                description="Assign an active training programme to a Trainee."
                icon="training"
            />
        );
    }


    return (
        <>
            {/* MOBILE */}

            <div
                className="
                    grid
                    gap-3
                    p-4
                    md:grid-cols-2
                    lg:hidden
                "
            >
                {assignments.map(
                    (
                        assignment
                    ) => (
                        <AssignmentCard
                            key={
                                assignment._id
                            }
                            assignment={
                                assignment
                            }
                            actionLoadingId={
                                actionLoadingId
                            }
                            onDeactivate={
                                onDeactivate
                            }
                            onReactivate={
                                onReactivate
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
                        min-w-[950px]
                        w-full
                    "
                >
                    <thead
                        className="
                            bg-slate-50
                        "
                    >
                        <tr>
                            <Head>
                                Programme
                            </Head>

                            <Head>
                                Trainee
                            </Head>

                            <Head>
                                Assigned
                            </Head>

                            <Head>
                                Status
                            </Head>

                            <Head right>
                                Action
                            </Head>
                        </tr>
                    </thead>


                    <tbody>
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

                                const processing =
                                    actionLoadingId ===
                                    assignment._id;

                                const inactive =
                                    assignment.status ===
                                    "inactive";

                                return (
                                    <tr
                                        key={
                                            assignment._id
                                        }
                                        className="
                                            border-t
                                            border-slate-100
                                            hover:bg-slate-50/60
                                        "
                                    >
                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <p
                                                className="
                                                    max-w-[230px]
                                                    truncate
                                                    text-[9px]
                                                    font-bold
                                                    text-slate-800
                                                "
                                            >
                                                {programme?.title ||
                                                    "Programme unavailable"}
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-[7px]
                                                    font-medium
                                                    text-blue-600
                                                "
                                            >
                                                {formatProgrammeType(
                                                    programme?.programmeType
                                                )}
                                            </p>
                                        </td>


                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <p
                                                className="
                                                    text-[9px]
                                                    font-bold
                                                    text-slate-700
                                                "
                                            >
                                                {getUserDisplayName(
                                                    trainee,
                                                    trainee?.username ||
                                                    "Trainee"
                                                )}
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-[7px]
                                                    text-slate-500
                                                "
                                            >
                                                @{trainee?.username ||
                                                    "—"}
                                            </p>
                                        </td>


                                        <td
                                            className="
                                                px-5
                                                py-4
                                                text-[8px]
                                                font-medium
                                                text-slate-600
                                            "
                                        >
                                            {formatTrainingDate(
                                                assignment.assignedAt ||
                                                assignment.createdAt
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
                                                    assignment.status ||
                                                    "active"
                                                }
                                            />
                                        </td>


                                        <td
                                            className="
                                                px-5
                                                py-4
                                                text-right
                                            "
                                        >
                                            {inactive ? (
                                                <ActionButton
                                                    variant="success"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onReactivate?.(
                                                            assignment
                                                        )
                                                    }
                                                >
                                                    Reactivate
                                                </ActionButton>
                                            ) : (
                                                <ActionButton
                                                    variant="warning"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onDeactivate?.(
                                                            assignment
                                                        )
                                                    }
                                                >
                                                    Deactivate
                                                </ActionButton>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}


function AssignmentCard({
    assignment,
    actionLoadingId,
    onDeactivate,
    onReactivate,
}) {
    const programme =
        getAssignmentProgramme(
            assignment
        );

    const trainee =
        getAssignmentTrainee(
            assignment
        );

    const processing =
        actionLoadingId ===
        assignment._id;

    const inactive =
        assignment.status ===
        "inactive";


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
                <span
                    className="
                        rounded-full
                        bg-blue-50
                        px-2.5
                        py-1
                        text-[7px]
                        font-bold
                        text-blue-600
                    "
                >
                    {formatProgrammeType(
                        programme?.programmeType
                    )}
                </span>

                <StatusBadge
                    status={
                        assignment.status ||
                        "active"
                    }
                />
            </div>


            <h3
                className="
                    mt-3
                    text-[11px]
                    font-bold
                    text-slate-800
                "
            >
                {programme?.title ||
                    "Programme unavailable"}
            </h3>


            <div
                className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-2
                "
            >
                <Info
                    label="Trainee"
                    value={
                        getUserDisplayName(
                            trainee,
                            trainee?.username ||
                            "—"
                        )
                    }
                />

                <Info
                    label="Assigned"
                    value={
                        formatTrainingDate(
                            assignment.assignedAt ||
                            assignment.createdAt
                        )
                    }
                />
            </div>


            <div
                className="
                    mt-4
                "
            >
                {inactive ? (
                    <ActionButton
                        variant="success"
                        disabled={
                            processing
                        }
                        onClick={() =>
                            onReactivate?.(
                                assignment
                            )
                        }
                        className="
                            w-full
                        "
                    >
                        Reactivate Assignment
                    </ActionButton>
                ) : (
                    <ActionButton
                        variant="warning"
                        disabled={
                            processing
                        }
                        onClick={() =>
                            onDeactivate?.(
                                assignment
                            )
                        }
                        className="
                            w-full
                        "
                    >
                        Deactivate Assignment
                    </ActionButton>
                )}
            </div>
        </article>
    );
}


function Info({
    label,
    value,
}) {
    return (
        <div
            className="
                min-w-0
                rounded-lg
                bg-slate-50
                p-3
            "
        >
            <p
                className="
                    text-[7px]
                    font-semibold
                    text-slate-500
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    truncate
                    text-[8px]
                    font-bold
                    text-slate-700
                "
            >
                {value}
            </p>
        </div>
    );
}


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


export default TrainingAssignmentTable;