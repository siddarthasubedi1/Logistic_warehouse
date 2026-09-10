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

    if (
        users.length ===
        0
    ) {
        return (
            <div className="p-5">
                <EmptyState
                    title="No users found."
                    description="No Trainer or Trainee accounts match the current filters."
                />
            </div>
        );
    }


    // ======================================================
    // TRAINING SECTIONS
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


        if (
            sections.length ===
            0
        ) {
            return [];
        }


        return sections.map(
            (
                section
            ) => ({
                id:
                    section,

                name:
                    formatProgrammeType(
                        section
                    ),
            })
        );
    };


    // ======================================================
    // CHECK INACTIVE
    // ======================================================

    const isInactiveUser = (
        user
    ) => {
        const status =
            String(
                user?.status ||
                ""
            ).toLowerCase();


        return (
            status ===
            "deactivated" ||
            status ===
            "inactive"
        );
    };


    // ======================================================
    // CHECK PASSWORD RESET REQUEST
    // ======================================================

    const hasPendingResetRequest = (
        user
    ) => {
        if (
            !user?._id
        ) {
            return false;
        }


        return pendingResetUserIds.includes(
            String(
                user._id
            )
        );
    };


    // ======================================================
    // CHECK SELECTED USER
    // ======================================================

    const isSelectedUser = (
        user
    ) => {
        if (
            !selectedUserId ||
            !user?._id
        ) {
            return false;
        }


        return (
            String(
                selectedUserId
            ) ===
            String(
                user._id
            )
        );
    };


    // ======================================================
    // USER INITIAL
    // ======================================================

    const getUserInitial = (
        user
    ) => {
        return getUserDisplayName(
            user,
            "U"
        )
            .charAt(
                0
            )
            .toUpperCase();
    };


    // ======================================================
    // MOBILE USER CARD
    // ======================================================

    const renderMobileCard = (
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
            isSelectedUser(
                user
            );


        const trainingSections =
            getTrainingSections(
                user
            );


        return (
            <article
                key={
                    user._id
                }
                id={
                    selected
                        ? "selected-admin-user"
                        : undefined
                }
                className={`
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-white
                    shadow-sm
                    transition

                    ${selected
                        ? "border-blue-400 ring-2 ring-blue-100"
                        : "border-slate-200"
                    }
                `}
            >

                {/* ================================================= */}
                {/* CARD TOP */}
                {/* ================================================= */}

                <div
                    className="
                        border-b
                        border-slate-100
                        bg-gradient-to-r
                        from-white
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

                            {/* AVATAR */}

                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-gradient-to-br
                                    from-blue-100
                                    to-blue-50
                                    text-sm
                                    font-bold
                                    text-blue-700
                                    ring-1
                                    ring-blue-200
                                "
                            >
                                {getUserInitial(
                                    user
                                )}
                            </div>


                            {/* USER */}

                            <div className="min-w-0">

                                <p
                                    className="
                                        truncate
                                        text-sm
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    {getUserDisplayName(
                                        user,
                                        "Unnamed user"
                                    )}
                                </p>


                                {user.email && (
                                    <p
                                        className="
                                            mt-1
                                            truncate
                                            text-[10px]
                                            text-slate-500
                                        "
                                    >
                                        {user.email}
                                    </p>
                                )}


                                {user.username && (
                                    <p
                                        className="
                                            mt-1
                                            truncate
                                            text-[10px]
                                            font-medium
                                            text-blue-600
                                        "
                                    >
                                        @{user.username}
                                    </p>
                                )}

                            </div>

                        </div>


                        <StatusBadge
                            status={
                                user.status
                            }
                        />

                    </div>

                </div>


                {/* ================================================= */}
                {/* INFORMATION */}
                {/* ================================================= */}

                <div className="p-4">

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-4
                        "
                    >

                        {/* ROLE */}

                        <div>

                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Role
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    font-semibold
                                    capitalize
                                    text-slate-700
                                "
                            >
                                {user.role ||
                                    "—"}
                            </p>

                        </div>


                        {/* ACCOUNT STATUS */}

                        <div>

                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Account
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    font-semibold
                                    capitalize
                                    text-slate-700
                                "
                            >
                                {user.accountStatus ||
                                    "created"}
                            </p>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* TRAINING */}
                    {/* ================================================= */}

                    <div
                        className="
                            mt-4
                            border-t
                            border-slate-100
                            pt-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-amber-50
                                    text-amber-600
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                >
                                    <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>


                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Assigned Safety Training
                            </p>

                        </div>


                        <div
                            className="
                                mt-3
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            {trainingSections.length >
                                0 ? (
                                trainingSections.map(
                                    (
                                        section
                                    ) => (
                                        <span
                                            key={
                                                section.id
                                            }
                                            className="
                                                rounded-full
                                                border
                                                border-blue-100
                                                bg-blue-50
                                                px-2.5
                                                py-1
                                                text-[9px]
                                                font-semibold
                                                text-blue-700
                                            "
                                        >
                                            {section.name}
                                        </span>
                                    )
                                )
                            ) : (
                                <span
                                    className="
                                        text-[10px]
                                        text-slate-400
                                    "
                                >
                                    No training assigned.
                                </span>
                            )}

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* RESET REQUEST NOTICE */}
                    {/* ================================================= */}

                    {pendingReset && (
                        <div
                            className="
                                mt-4
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-amber-200
                                bg-amber-50
                                p-3
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
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    />

                                    <path d="M12 7v6" />

                                    <path d="M12 17h.01" />
                                </svg>
                            </div>


                            <div>

                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        text-amber-800
                                    "
                                >
                                    Password Reset Requested
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        leading-4
                                        text-amber-700
                                    "
                                >
                                    This user has submitted a pending password reset request.
                                </p>

                            </div>

                        </div>
                    )}


                    {/* ================================================= */}
                    {/* MOBILE ACTIONS */}
                    {/* ================================================= */}

                    <div
                        className="
                            mt-5
                            grid
                            grid-cols-2
                            gap-2
                        "
                    >

                        {onEdit && (
                            <ActionButton
                                variant="secondary"
                                className="justify-center"
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


                        {onResetPassword &&
                            pendingReset && (
                                <ActionButton
                                    variant="secondary"
                                    className="justify-center"
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


                        {inactive ? (
                            <ActionButton
                                variant="success"
                                className="justify-center"
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
                                className="justify-center"
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


                        <ActionButton
                            variant="danger"
                            className="justify-center"
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

                </div>

            </article>
        );
    };


    // ======================================================
    // DESKTOP ROW
    // ======================================================

    const renderDesktopRow = (
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
            isSelectedUser(
                user
            );


        const trainingSections =
            getTrainingSections(
                user
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
                        ? "bg-blue-50/80"
                        : "hover:bg-slate-50/80"
                    }
                `}
            >

                {/* ================================================= */}
                {/* USER */}
                {/* ================================================= */}

                <td className="px-5 py-4">

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-gradient-to-br
                                from-blue-100
                                to-blue-50
                                text-xs
                                font-bold
                                text-blue-700
                                ring-1
                                ring-blue-200
                            "
                        >
                            {getUserInitial(
                                user
                            )}
                        </div>


                        <div className="min-w-0">

                            <p
                                className="
                                    max-w-[180px]
                                    truncate
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                {getUserDisplayName(
                                    user,
                                    "Unnamed user"
                                )}
                            </p>


                            {user.email && (
                                <p
                                    className="
                                        mt-1
                                        max-w-[220px]
                                        truncate
                                        text-[10px]
                                        text-slate-500
                                    "
                                >
                                    {user.email}
                                </p>
                            )}


                            {user.username && (
                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        font-medium
                                        text-blue-600
                                    "
                                >
                                    @{user.username}
                                </p>
                            )}

                        </div>

                    </div>

                </td>


                {/* ================================================= */}
                {/* ROLE */}
                {/* ================================================= */}

                <td
                    className="
                        whitespace-nowrap
                        px-5
                        py-4
                    "
                >
                    <span
                        className="
                            rounded-full
                            bg-slate-100
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            capitalize
                            text-slate-700
                        "
                    >
                        {user.role ||
                            "—"}
                    </span>
                </td>


                {/* ================================================= */}
                {/* TRAINING */}
                {/* ================================================= */}

                <td className="px-5 py-4">

                    <div
                        className="
                            flex
                            max-w-[280px]
                            flex-wrap
                            gap-1.5
                        "
                    >

                        {trainingSections.length >
                            0 ? (
                            trainingSections.map(
                                (
                                    section
                                ) => (
                                    <span
                                        key={
                                            section.id
                                        }
                                        className="
                                            rounded-full
                                            border
                                            border-blue-100
                                            bg-blue-50
                                            px-2
                                            py-1
                                            text-[9px]
                                            font-semibold
                                            text-blue-700
                                        "
                                    >
                                        {section.name}
                                    </span>
                                )
                            )
                        ) : (
                            <span
                                className="
                                    text-[10px]
                                    text-slate-400
                                "
                            >
                                —
                            </span>
                        )}

                    </div>

                </td>


                {/* ================================================= */}
                {/* STATUS */}
                {/* ================================================= */}

                <td
                    className="
                        whitespace-nowrap
                        px-5
                        py-4
                    "
                >
                    <StatusBadge
                        status={
                            user.status
                        }
                    />


                    {pendingReset && (
                        <p
                            className="
                                mt-2
                                text-[9px]
                                font-semibold
                                text-amber-600
                            "
                        >
                            Reset requested
                        </p>
                    )}

                </td>


                {/* ================================================= */}
                {/* ACTIONS */}
                {/* ================================================= */}

                <td className="px-5 py-4">

                    <div
                        className="
                            flex
                            flex-wrap
                            justify-end
                            gap-2
                        "
                    >

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
    };


    // ======================================================
    // UI
    // ======================================================

    return (
        <div>

            {/* ================================================= */}
            {/* MOBILE / TABLET CARDS */}
            {/* ================================================= */}

            <div
                className="
                    space-y-4
                    p-4
                    lg:hidden
                "
            >
                {users.map(
                    renderMobileCard
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
                        min-w-[1000px]
                        w-full
                        divide-y
                        divide-slate-200
                    "
                >

                    <thead
                        className="
                            bg-gradient-to-r
                            from-slate-50
                            to-blue-50/40
                        "
                    >

                        <tr
                            className="
                                text-left
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.08em]
                                text-slate-500
                            "
                        >

                            <th className="px-5 py-3.5">
                                User
                            </th>

                            <th className="px-5 py-3.5">
                                Role
                            </th>

                            <th className="px-5 py-3.5">
                                Safety Training
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
                            bg-white
                        "
                    >
                        {users.map(
                            renderDesktopRow
                        )}
                    </tbody>

                </table>

            </div>

        </div>
    );
}


export default UserTable;