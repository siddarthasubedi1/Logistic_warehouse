import ActionButton from "../ui/ActionButton";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";

import {
    formatProgrammeType,
    getUserDisplayName,
} from "../../utils/training";


function UserTable({
    users = [],
    pendingResetUserIds = [],
    processingId = "",
    selectedUserId = null,
    onEdit,
    onResetPassword,
    onDeactivate,
    onReactivate,
    onDelete,
}) {
    // ======================================================
    // EMPTY TABLE
    // ======================================================

    if (users.length === 0) {
        return (
            <EmptyState
                title="No users found."
                description="No Trainer or Trainee accounts match the current filters."
            />
        );
    }


    // ======================================================
    // TRAINING SECTION TEXT
    // ======================================================

    const getTrainingSections = (
        user
    ) => {
        const sections =
            Array.isArray(
                user?.assignedTrainingSections
            )
                ? user.assignedTrainingSections
                : [];


        if (sections.length === 0) {
            return "—";
        }


        return sections
            .map(
                (section) =>
                    formatProgrammeType(
                        section
                    )
            )
            .join(", ");
    };


    // ======================================================
    // CHECK INACTIVE
    // ======================================================

    const isInactiveUser = (
        user
    ) => {
        const status =
            String(
                user?.status || ""
            ).toLowerCase();


        return (
            status === "deactivated" ||
            status === "inactive"
        );
    };


    // ======================================================
    // CHECK PENDING PASSWORD RESET REQUEST
    // ======================================================

    const hasPendingResetRequest = (
        user
    ) => {
        if (!user?._id) {
            return false;
        }


        return pendingResetUserIds.includes(
            String(
                user._id
            )
        );
    };


    return (
        <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full divide-y divide-slate-200">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <thead className="bg-slate-50">
                    <tr className="text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">

                        <th className="px-5 py-3">
                            User
                        </th>

                        <th className="px-5 py-3">
                            Role
                        </th>

                        <th className="px-5 py-3">
                            Training
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

                <tbody className="divide-y divide-slate-100 bg-white">

                    {users.map(
                        (
                            user
                        ) => {

                            const processing =
                                processingId ===
                                user._id;


                            const inactive =
                                isInactiveUser(
                                    user
                                );


                            const pendingReset =
                                hasPendingResetRequest(
                                    user
                                );


                            const selected =
                                selectedUserId &&
                                String(
                                    selectedUserId
                                ) ===
                                String(
                                    user._id
                                );


                            return (
                                <tr
                                    key={
                                        user._id
                                    }
                                    id={
                                        selected
                                            ? "selected-admin-user"
                                            : undefined
                                    }
                                    className={`
                                        text-xs
                                        text-slate-700
                                        transition

                                        ${selected
                                            ? "bg-blue-50"
                                            : "hover:bg-slate-50"
                                        }
                                    `}
                                >

                                    {/* ================================= */}
                                    {/* USER */}
                                    {/* ================================= */}

                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            <div
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-slate-100
                                                    text-xs
                                                    font-bold
                                                    text-slate-600
                                                "
                                            >
                                                {getUserDisplayName(
                                                    user,
                                                    "U"
                                                )
                                                    .charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>


                                            <div>

                                                <p className="font-semibold text-slate-900">
                                                    {getUserDisplayName(
                                                        user,
                                                        "Unnamed user"
                                                    )}
                                                </p>


                                                {user.email && (
                                                    <p className="mt-1 text-[11px] text-slate-500">
                                                        {
                                                            user.email
                                                        }
                                                    </p>
                                                )}


                                                {user.username && (
                                                    <p className="mt-1 text-[10px] text-slate-400">
                                                        @
                                                        {
                                                            user.username
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                        </div>

                                    </td>


                                    {/* ================================= */}
                                    {/* ROLE */}
                                    {/* ================================= */}

                                    <td className="whitespace-nowrap px-5 py-4">
                                        <span className="capitalize">
                                            {
                                                user.role ||
                                                "—"
                                            }
                                        </span>
                                    </td>


                                    {/* ================================= */}
                                    {/* TRAINING */}
                                    {/* ================================= */}

                                    <td className="px-5 py-4">
                                        <div className="max-w-[240px] text-[11px] leading-5 text-slate-600">
                                            {getTrainingSections(
                                                user
                                            )}
                                        </div>
                                    </td>


                                    {/* ================================= */}
                                    {/* STATUS */}
                                    {/* ================================= */}

                                    <td className="whitespace-nowrap px-5 py-4">
                                        <StatusBadge
                                            status={
                                                user.status
                                            }
                                        />
                                    </td>


                                    {/* ================================= */}
                                    {/* ACTIONS */}
                                    {/* ================================= */}

                                    <td className="px-5 py-4">

                                        <div className="flex flex-wrap justify-end gap-2">

                                            {/* Edit */}
                                            {onEdit && (
                                                <ActionButton
                                                    variant="secondary"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onEdit(
                                                            user
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </ActionButton>
                                            )}


                                            {/* Password reset */}
                                            {onResetPassword &&
                                                pendingReset && (
                                                    <ActionButton
                                                        variant="secondary"
                                                        disabled={
                                                            processing ||
                                                            inactive
                                                        }
                                                        onClick={() =>
                                                            onResetPassword(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        Reset Password
                                                    </ActionButton>
                                                )}


                                            {/* Activate / Deactivate */}
                                            {inactive ? (
                                                <ActionButton
                                                    variant="success"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onReactivate(
                                                            user
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
                                                            user
                                                        )
                                                    }
                                                >
                                                    {processing
                                                        ? "Processing..."
                                                        : "Deactivate"}
                                                </ActionButton>
                                            )}


                                            {/* Delete */}
                                            <ActionButton
                                                variant="danger"
                                                disabled={
                                                    processing
                                                }
                                                onClick={() =>
                                                    onDelete(
                                                        user
                                                    )
                                                }
                                            >
                                                Delete
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
    );
}


export default UserTable;