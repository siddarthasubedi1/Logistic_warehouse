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

                <div>

                    <h2
                        className="
                            text-sm
                            font-bold
                            text-slate-900
                        "
                    >
                        Assigned Training
                    </h2>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            text-slate-500
                        "
                    >
                        Current programme-to-Trainee access records.
                    </p>

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
                    {assignments.length} Assignment
                    {assignments.length ===
                        1
                        ? ""
                        : "s"}
                </span>

            </div>


            {/* ================================================= */}
            {/* MOBILE CARDS */}
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
                        min-w-[950px]
                        w-full
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
                                Trainee
                            </th>

                            <th className="px-5 py-3.5">
                                Programme
                            </th>

                            <th className="px-5 py-3.5">
                                Type
                            </th>

                            <th className="px-5 py-3.5">
                                Assigned
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
                                            bg-white
                                            text-xs
                                            text-slate-700
                                            transition
                                            hover:bg-slate-50
                                        "
                                    >

                                        {/* TRAINEE */}

                                        <td className="px-5 py-4">

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <UserAvatar
                                                    user={
                                                        trainee
                                                    }
                                                />


                                                <div
                                                    className="
                                                        min-w-0
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            max-w-[190px]
                                                            truncate
                                                            font-semibold
                                                            text-slate-900
                                                        "
                                                    >
                                                        {getUserDisplayName(
                                                            trainee,
                                                            "Unknown Trainee"
                                                        )}
                                                    </p>


                                                    {trainee?.username && (
                                                        <p
                                                            className="
                                                                mt-1
                                                                max-w-[190px]
                                                                truncate
                                                                text-[9px]
                                                                text-slate-400
                                                            "
                                                        >
                                                            @{trainee.username}
                                                        </p>
                                                    )}

                                                </div>

                                            </div>

                                        </td>


                                        {/* PROGRAMME */}

                                        <td className="px-5 py-4">

                                            <div className="max-w-[260px]">

                                                <p
                                                    className="
                                                        break-words
                                                        font-semibold
                                                        text-slate-900
                                                    "
                                                >
                                                    {programme?.title ||
                                                        "Unknown Programme"}
                                                </p>


                                                {programme?.description && (
                                                    <p
                                                        className="
                                                            mt-1
                                                            line-clamp-1
                                                            text-[9px]
                                                            leading-4
                                                            text-slate-500
                                                        "
                                                    >
                                                        {programme.description}
                                                    </p>
                                                )}

                                            </div>

                                        </td>


                                        {/* TYPE */}

                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                            "
                                        >
                                            <ProgrammeTypeBadge
                                                type={
                                                    programme?.programmeType
                                                }
                                            />
                                        </td>


                                        {/* DATE */}

                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                                text-[10px]
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
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                            "
                                        >
                                            <StatusBadge
                                                status={
                                                    assignment.status
                                                }
                                            />
                                        </td>


                                        {/* ACTION */}

                                        <td className="px-5 py-4">

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
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            <div
                className="
                    border-b
                    border-slate-100
                    bg-gradient-to-r
                    from-slate-50
                    to-blue-50/40
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

                        <UserAvatar
                            user={
                                trainee
                            }
                        />


                        <div className="min-w-0">

                            <p
                                className="
                                    truncate
                                    text-xs
                                    font-bold
                                    text-slate-900
                                "
                            >
                                {getUserDisplayName(
                                    trainee,
                                    "Unknown Trainee"
                                )}
                            </p>


                            {trainee?.username && (
                                <p
                                    className="
                                        mt-1
                                        truncate
                                        text-[9px]
                                        text-slate-400
                                    "
                                >
                                    @{trainee.username}
                                </p>
                            )}

                        </div>

                    </div>


                    <StatusBadge
                        status={
                            assignment.status
                        }
                    />

                </div>

            </div>


            <div className="p-4">

                <div
                    className="
                        rounded-xl
                        border
                        border-blue-100
                        bg-blue-50/50
                        p-3
                    "
                >

                    <p
                        className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        Assigned Programme
                    </p>


                    <p
                        className="
                            mt-1
                            break-words
                            text-[11px]
                            font-bold
                            text-slate-800
                        "
                    >
                        {programme?.title ||
                            "Unknown Programme"}
                    </p>


                    <div
                        className="
                            mt-2
                            flex
                            flex-wrap
                            gap-2
                        "
                    >
                        <ProgrammeTypeBadge
                            type={
                                programme?.programmeType
                            }
                        />
                    </div>

                </div>


                <div
                    className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-3
                    "
                >

                    <Detail
                        label="Assigned"
                        value={
                            formatTrainingDate(
                                assignment.assignedAt ||
                                assignment.createdAt
                            )
                        }
                    />


                    <Detail
                        label="Status"
                        value={
                            assignment.status ||
                            "—"
                        }
                    />

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
                                onReactivate(
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
                                : "Reactivate Assignment"}
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
                            className="
                                w-full
                                justify-center
                            "
                        >
                            {processing
                                ? "Processing..."
                                : "Deactivate Assignment"}
                        </ActionButton>
                    )}

                </div>

            </div>

        </article>
    );
}


// ======================================================
// AVATAR
// ======================================================

function UserAvatar({
    user,
}) {
    const name =
        getUserDisplayName(
            user,
            "T"
        );


    return (
        <div
            className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-100
                text-[11px]
                font-bold
                text-blue-700
            "
        >
            {name
                .charAt(
                    0
                )
                .toUpperCase()}
        </div>
    );
}


// ======================================================
// DETAIL
// ======================================================

function Detail({
    label,
    value,
}) {
    return (
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
                {label}
            </p>


            <p
                className="
                    mt-1
                    break-words
                    text-[10px]
                    font-medium
                    capitalize
                    text-slate-700
                "
            >
                {value ||
                    "—"}
            </p>

        </div>
    );
}


// ======================================================
// PROGRAMME TYPE
// ======================================================

function ProgrammeTypeBadge({
    type,
}) {
    const workingAtHeight =
        type ===
        "working-at-height";


    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-full
                px-2.5
                py-1
                text-[9px]
                font-semibold
                ring-1
                ring-inset

                ${workingAtHeight
                    ? "bg-amber-50 text-amber-700 ring-amber-200"
                    : "bg-blue-50 text-blue-700 ring-blue-200"
                }
            `}
        >
            {formatProgrammeType(
                type
            )}
        </span>
    );
}


export default TrainingAssignmentTable;