import { getActiveTrainingModules, getTrainingModuleLabel } from "../../utils/trainingModules";
function UserTable({
    users = [],
    pendingResetUserIds = [],
    processingId = "",
    selectedUserId = null,
    selectedRowRef = null,
    onEdit,
    onResetPassword,
    onDeactivate,
    onReactivate,
    onDelete,
}) {
    /* =========================================================
       EMPTY
    ========================================================= */

    if (
        !Array.isArray(
            users
        ) ||
        users.length ===
        0
    ) {
        return (
            <div
                className="
                    flex
                    min-h-[240px]
                    items-center
                    justify-center
                    px-5
                    py-8
                    text-center
                "
            >
                <div
                    className="
                        max-w-[300px]
                    "
                >
                    <div
                        className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-50
                            text-blue-600
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="
                                h-5
                                w-5
                            "
                        >
                            <circle
                                cx="9"
                                cy="8"
                                r="3"
                            />

                            <circle
                                cx="17"
                                cy="9"
                                r="2"
                            />

                            <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                            <path d="M15 15c3 0 5 1.5 6 5" />
                        </svg>
                    </div>


                    <p
                        className="
                            mt-3
                            text-[11px]
                            font-semibold
                            text-[#172033]
                        "
                    >
                        No users found
                    </p>


                    <p
                        className="
                            mt-1
                            text-[9px]
                            leading-4
                            text-[#64748b]
                        "
                    >
                        Try changing your search or filter settings.
                    </p>
                </div>
            </div>
        );
    }


    /* =========================================================
       HELPERS
    ========================================================= */

    const getId = (
        user
    ) =>
        user?._id ||
        user?.id ||
        "";


    const getName = (
        user
    ) =>
        `${user?.firstName || ""} ${user?.lastName || ""}`
            .trim() ||
        user?.username ||
        "User";


    const hasResetRequest = (
        user
    ) =>
        pendingResetUserIds.some(
            (
                id
            ) =>
                String(
                    id
                ) ===
                String(
                    getId(
                        user
                    )
                )
        );


    return (
        <div
            className="
                overflow-x-auto
            "
        >
            <table
                className="
                    min-w-[980px]
                    w-full
                "
            >
                {/* =================================================
                    HEAD
                ================================================= */}

                <thead
                    className="
                        bg-[#f8fafc]
                    "
                >
                    <tr
                        className="
                            border-b
                            border-[#e8eef5]
                        "
                    >
                        <TableHead>
                            User
                        </TableHead>

                        <TableHead>
                            Username
                        </TableHead>

                        <TableHead>
                            Role
                        </TableHead>

                        <TableHead>
                            Training
                        </TableHead>

                        <TableHead>
                            Status
                        </TableHead>

                        <TableHead>
                            Password Reset
                        </TableHead>

                        <TableHead
                            right
                        >
                            Actions
                        </TableHead>
                    </tr>
                </thead>


                {/* =================================================
                    BODY
                ================================================= */}

                <tbody>
                    {users.map(
                        (
                            user
                        ) => {
                            const userId =
                                getId(
                                    user
                                );

                            const name =
                                getName(
                                    user
                                );

                            const status =
                                String(
                                    user.status ||
                                    ""
                                ).toLowerCase();

                            const inactive =
                                status ===
                                "inactive" ||
                                status ===
                                "deactivated";

                            const processing =
                                String(
                                    processingId
                                ) ===
                                String(
                                    userId
                                );

                            const pendingReset =
                                hasResetRequest(
                                    user
                                );

                            const highlighted =
                                selectedUserId &&
                                String(
                                    selectedUserId
                                ) ===
                                String(
                                    userId
                                );


                            return (
                                <tr
                                    key={
                                        userId ||
                                        user.username
                                    }
                                    ref={
                                        highlighted
                                            ? selectedRowRef
                                            : null
                                    }
                                    className={`
                                        border-b
                                        border-[#edf1f6]
                                        transition
                                        last:border-0

                                        ${highlighted
                                            ? "bg-blue-50/80"
                                            : "bg-white hover:bg-[#f8fafc]"
                                        }
                                    `}
                                >
                                    {/* USER */}

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
                                            <div
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-[#eef6ff]
                                                    text-[10px]
                                                    font-bold
                                                    text-blue-600
                                                "
                                            >
                                                {name
                                                    .charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>


                                            <div
                                                className="
                                                    min-w-0
                                                "
                                            >
                                                <p
                                                    className="
                                                        max-w-[180px]
                                                        truncate
                                                        text-[10px]
                                                        font-semibold
                                                        text-[#172033]
                                                    "
                                                >
                                                    {name}
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        max-w-[190px]
                                                        truncate
                                                        text-[8px]
                                                        text-[#64748b]
                                                    "
                                                >
                                                    {user.email ||
                                                        "No email"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>


                                    {/* USERNAME */}

                                    <td
                                        className="
                                            px-5
                                            py-4
                                            text-[9px]
                                            text-[#52627a]
                                        "
                                    >
                                        {user.username ||
                                            "—"}
                                    </td>


                                    {/* ROLE */}

                                    <td
                                        className="
                                            px-5
                                            py-4
                                        "
                                    >
                                        <RoleBadge
                                            role={
                                                user.role
                                            }
                                        />
                                    </td>


                                    {/* TRAINING */}

                                    <td
                                        className="
                                            px-5
                                            py-4
                                        "
                                    >
                                        <TrainingBadges
                                            user={
                                                user
                                            }
                                        />
                                    </td>


                                    {/* STATUS */}

                                    <td
                                        className="
                                            px-5
                                            py-4
                                        "
                                    >
                                        <StatusBadge
                                            inactive={
                                                inactive
                                            }
                                        />
                                    </td>


                                    {/* PASSWORD RESET */}

                                    <td
                                        className="
                                            px-5
                                            py-4
                                        "
                                    >
                                        {pendingReset ? (
                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-1.5
                                                    rounded-full
                                                    bg-amber-50
                                                    px-2.5
                                                    py-1.5
                                                    text-[8px]
                                                    font-semibold
                                                    text-amber-600
                                                "
                                            >
                                                <span
                                                    className="
                                                        h-1.5
                                                        w-1.5
                                                        rounded-full
                                                        bg-amber-500
                                                    "
                                                />

                                                Pending
                                            </span>
                                        ) : (
                                            <span
                                                className="
                                                    text-[8px]
                                                    text-[#94a3b8]
                                                "
                                            >
                                                None
                                            </span>
                                        )}
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
                                                items-center
                                                justify-end
                                                gap-2
                                            "
                                        >
                                            <ActionButton
                                                label="Edit"
                                                variant="secondary"
                                                disabled={
                                                    processing
                                                }
                                                onClick={() =>
                                                    onEdit?.(
                                                        user
                                                    )
                                                }
                                            />


                                            {pendingReset && (
                                                <ActionButton
                                                    label="Reset Password"
                                                    variant="primary"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onResetPassword?.(
                                                            user
                                                        )
                                                    }
                                                />
                                            )}


                                            {inactive ? (
                                                <ActionButton
                                                    label="Reactivate"
                                                    variant="success"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onReactivate?.(
                                                            user
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <ActionButton
                                                    label="Deactivate"
                                                    variant="warning"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onDeactivate?.(
                                                            user
                                                        )
                                                    }
                                                />
                                            )}


                                            <ActionButton
                                                label="Delete"
                                                variant="danger"
                                                disabled={
                                                    processing
                                                }
                                                onClick={() =>
                                                    onDelete?.(
                                                        user
                                                    )
                                                }
                                            />
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


/* =========================================================
   TABLE HEAD
========================================================= */

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
                tracking-[0.05em]
                text-[#64748b]

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


/* =========================================================
   ROLE
========================================================= */

function RoleBadge({
    role,
}) {
    const trainer =
        String(
            role ||
            ""
        ).toLowerCase() ===
        "trainer";

    return (
        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1.5
                text-[8px]
                font-semibold

                ${trainer
                    ? "bg-purple-50 text-purple-600"
                    : "bg-blue-50 text-blue-600"
                }
            `}
        >
            {trainer
                ? "Trainer"
                : "Trainee"}
        </span>
    );
}


/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
    inactive,
}) {
    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-2.5
                py-1.5
                text-[8px]
                font-semibold

                ${inactive
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }
            `}
        >
            <span
                className={`
                    h-1.5
                    w-1.5
                    rounded-full

                    ${inactive
                        ? "bg-red-500"
                        : "bg-emerald-500"
                    }
                `}
            />

            {inactive
                ? "Deactivated"
                : "Active"}
        </span>
    );
}


/* =========================================================
   TRAINING
========================================================= */

function TrainingBadges({
    user,
}) {
    let sections =
        Array.isArray(
            user?.assignedTrainingSections
        )
            ? user.assignedTrainingSections
            : [];


    if (
        user?.role ===
        "trainee"
    ) {
        sections = getActiveTrainingModules().map((module) => module.id);
    }


    if (
        sections.length ===
        0
    ) {
        return (
            <span
                className="
                    text-[8px]
                    text-[#94a3b8]
                "
            >
                Not assigned
            </span>
        );
    }


    return (
        <div
            className="
                flex
                max-w-[180px]
                flex-wrap
                gap-1
            "
        >
            {sections.map(
                (
                    section
                ) => (
                    <span
                        key={
                            section
                        }
                        className="
                            rounded-full
                            bg-slate-100
                            px-2
                            py-1
                            text-[7px]
                            font-medium
                            text-[#52627a]
                        "
                    >
                        {getTrainingModuleLabel(section)}
                    </span>
                )
            )}
        </div>
    );
}


/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({
    label,
    variant,
    disabled,
    onClick,
}) {
    const variants = {
        primary:
            "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",

        secondary:
            "border-[#cbd5e1] bg-white text-[#52627a] hover:bg-[#f8fafc]",

        warning:
            "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",

        success:
            "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",

        danger:
            "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
    };


    return (
        <button
            type="button"
            disabled={
                disabled
            }
            onClick={
                onClick
            }
            className={`
                min-h-[32px]
                whitespace-nowrap
                rounded-lg
                border
                px-3
                text-[8px]
                font-semibold
                transition
                disabled:cursor-not-allowed
                disabled:opacity-45

                ${variants[
                variant
                ] ||
                variants.secondary
                }
            `}
        >
            {disabled
                ? "Please wait..."
                : label}
        </button>
    );
}


export default UserTable;