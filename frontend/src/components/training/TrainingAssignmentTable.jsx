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
        !Array.isArray(
            assignments
        ) ||
        assignments.length ===
        0
    ) {
        return (
            <EmptyState
                title="No training assignments found."
                description="Assign a training programme to a Trainee to see it here."
                icon="training"
            />
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
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

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
                            font-semibold
                            text-slate-800
                        "
                    >
                        Assigned Training
                    </h2>


                    <p
                        className="
                            mt-1
                            text-[8px]
                            text-slate-400
                        "
                    >
                        Current programme-to-Trainee access records.
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
                        text-slate-500
                    "
                >
                    {assignments.length} Assignment
                    {assignments.length ===
                        1
                        ? ""
                        : "s"}
                </span>
            </div>


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
                                Trainee
                            </TableHead>

                            <TableHead>
                                Programme
                            </TableHead>

                            <TableHead>
                                Type
                            </TableHead>

                            <TableHead>
                                Assigned
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
                                        className="
                                            border-b
                                            border-slate-100
                                            bg-white
                                            last:border-0
                                            hover:bg-slate-50/60
                                        "
                                    >
                                        {/* TRAINEE */}

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
                                                    gap-3
                                                "
                                            >
                                                <Avatar
                                                    name={
                                                        getUserDisplayName(
                                                            trainee,
                                                            "T"
                                                        )
                                                    }
                                                />


                                                <div
                                                    className="
                                                        min-w-0
                                                    "
                                                >
                                                    <p
                                                        className="
                                                            max-w-[170px]
                                                            truncate
                                                            text-[9px]
                                                            font-medium
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
                                                            max-w-[170px]
                                                            truncate
                                                            text-[7px]
                                                            text-slate-400
                                                        "
                                                    >
                                                        {trainee?.email ||
                                                            "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>


                                        {/* PROGRAMME */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <p
                                                className="
                                                    max-w-[220px]
                                                    truncate
                                                    text-[9px]
                                                    font-medium
                                                    text-slate-700
                                                "
                                            >
                                                {programme?.title ||
                                                    "—"}
                                            </p>
                                        </td>


                                        {/* TYPE */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <span
                                                className="
                                                    inline-flex
                                                    rounded-full
                                                    bg-blue-50
                                                    px-2.5
                                                    py-1
                                                    text-[7px]
                                                    text-blue-600
                                                "
                                            >
                                                {formatProgrammeType(
                                                    programme?.programmeType
                                                )}
                                            </span>
                                        </td>


                                        {/* DATE */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                                text-[8px]
                                                text-slate-500
                                            "
                                        >
                                            {formatTrainingDate(
                                                assignment.assignedAt ||
                                                assignment.createdAt
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
                                                    assignment.status ||
                                                    "active"
                                                }
                                            />
                                        </td>


                                        {/* ACTION */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    justify-end
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
                                                            onDeactivate?.(
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
        </section>
    );
}


// ======================================================
// MOBILE CARD
// ======================================================

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


    const inactive =
        assignment.status ===
        "inactive";


    const processing =
        actionLoadingId ===
        assignment._id;


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
                        items-center
                        gap-3
                    "
                >
                    <Avatar
                        name={
                            getUserDisplayName(
                                trainee,
                                "T"
                            )
                        }
                    />


                    <div
                        className="
                            min-w-0
                        "
                    >
                        <p
                            className="
                                truncate
                                text-[10px]
                                font-semibold
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
                                truncate
                                text-[8px]
                                text-slate-400
                            "
                        >
                            {trainee?.email ||
                                "—"}
                        </p>
                    </div>
                </div>


                <StatusBadge
                    status={
                        assignment.status ||
                        "active"
                    }
                />
            </div>


            <div
                className="
                    mt-4
                    rounded-lg
                    bg-slate-50
                    p-3
                "
            >
                <p
                    className="
                        text-[9px]
                        font-medium
                        text-slate-700
                    "
                >
                    {programme?.title ||
                        "Programme unavailable"}
                </p>


                <div
                    className="
                        mt-2
                        flex
                        flex-wrap
                        gap-2
                    "
                >
                    <span
                        className="
                            rounded-full
                            bg-blue-50
                            px-2.5
                            py-1
                            text-[7px]
                            text-blue-600
                        "
                    >
                        {formatProgrammeType(
                            programme?.programmeType
                        )}
                    </span>


                    <span
                        className="
                            rounded-full
                            bg-white
                            px-2.5
                            py-1
                            text-[7px]
                            text-slate-500
                        "
                    >
                        {formatTrainingDate(
                            assignment.assignedAt ||
                            assignment.createdAt
                        )}
                    </span>
                </div>
            </div>


            <div
                className="
                    mt-4
                    border-t
                    border-slate-100
                    pt-4
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
                            justify-center
                        "
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
                            onDeactivate?.(
                                assignment
                            )
                        }
                        className="
                            w-full
                            justify-center
                        "
                    >
                        {processing
                            ? "Processing..."
                            : "Deactivate"}
                    </ActionButton>
                )}
            </div>
        </article>
    );
}


// ======================================================
// AVATAR
// ======================================================

function Avatar({
    name,
}) {
    return (
        <div
            className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-blue-50
                text-[10px]
                font-semibold
                text-blue-600
            "
        >
            {String(
                name ||
                "T"
            )
                .charAt(0)
                .toUpperCase()}
        </div>
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


export default TrainingAssignmentTable;