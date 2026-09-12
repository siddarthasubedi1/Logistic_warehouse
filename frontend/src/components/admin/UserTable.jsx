import ActionButton from "../ui/ActionButton";
import StatusBadge from "../ui/StatusBadge";

import {
    getUserDisplayName,
} from "../../utils/training";


const TRAINING_SECTION_NAMES = {
    "manual-handling":
        "Manual Handling",

    "working-at-height":
        "Working at Height",
};


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
    // EMPTY
    // ======================================================

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
                    py-12
                    text-center
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-50
                        text-blue-500
                    "
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
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
                    </svg>
                </div>


                <p
                    className="
                        mt-3
                        text-[10px]
                        font-medium
                        text-slate-600
                    "
                >
                    No users found
                </p>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-400
                    "
                >
                    Try changing your search or filters.
                </p>
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
                user.assignedTrainingSections
            )
                ? user.assignedTrainingSections
                : [];


        return sections.map(
            (
                sectionId
            ) => ({
                id:
                    sectionId,

                name:
                    TRAINING_SECTION_NAMES[
                    sectionId
                    ] ||
                    sectionId,
            })
        );
    };


    // ======================================================
    // MOBILE CARD
    // ======================================================

    const renderMobileCard = (
        user
    ) => {
        const processing =
            processingId ===
            user._id;


        const inactive =
            [
                "inactive",
                "deactivated",
            ].includes(
                String(
                    user.status ||
                    ""
                ).toLowerCase()
            );


        const pendingReset =
            pendingResetUserIds.includes(
                String(
                    user._id
                )
            );


        const selected =
            String(
                selectedUserId ||
                ""
            ) ===
            String(
                user._id
            );


        const name =
            getUserDisplayName(
                user,
                user.username ||
                "User"
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
                    rounded-xl
                    border
                    bg-white
                    p-4

                    ${selected
                        ? "border-blue-400 ring-2 ring-blue-100"
                        : "border-slate-200"
                    }
                `}
            >
                <div
                    className="
                        flex
                        items-start
                        gap-3
                    "
                >
                    <Avatar
                        name={
                            name
                        }
                    />


                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >
                        <div
                            className="
                                flex
                                flex-wrap
                                items-start
                                justify-between
                                gap-2
                            "
                        >
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
                                    {name}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        truncate
                                        text-[8px]
                                        text-slate-400
                                    "
                                >
                                    {user.email ||
                                        "—"}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        text-slate-400
                                    "
                                >
                                    @{user.username ||
                                        "—"}
                                </p>
                            </div>


                            <StatusBadge
                                status={
                                    user.status
                                }
                            />
                        </div>


                        <div
                            className="
                                mt-3
                                flex
                                flex-wrap
                                gap-2
                            "
                        >
                            <RoleBadge
                                role={
                                    user.role
                                }
                            />


                            {pendingReset && (
                                <span
                                    className="
                                        rounded-full
                                        bg-amber-50
                                        px-2.5
                                        py-1
                                        text-[7px]
                                        font-medium
                                        text-amber-600
                                    "
                                >
                                    Reset Requested
                                </span>
                            )}
                        </div>
                    </div>
                </div>


                {/* TRAINING */}

                <div
                    className="
                        mt-4
                        border-t
                        border-slate-100
                        pt-4
                    "
                >
                    <p
                        className="
                            text-[7px]
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        Training Access
                    </p>


                    <div
                        className="
                            mt-2
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
                                            bg-blue-50
                                            px-2.5
                                            py-1
                                            text-[7px]
                                            text-blue-600
                                        "
                                    >
                                        {section.name}
                                    </span>
                                )
                            )
                        ) : (
                            <span
                                className="
                                    text-[8px]
                                    text-slate-400
                                "
                            >
                                No training assigned
                            </span>
                        )}
                    </div>
                </div>


                {/* ACTIONS */}

                <div
                    className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-2
                        border-t
                        border-slate-100
                        pt-4
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
                            className="
                                w-full
                                justify-center
                            "
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
                                className="
                                    w-full
                                    justify-center
                                "
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
                                onDeactivate(
                                    user
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
                        className="
                            w-full
                            justify-center
                        "
                    >
                        Delete
                    </ActionButton>
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
            [
                "inactive",
                "deactivated",
            ].includes(
                String(
                    user.status ||
                    ""
                ).toLowerCase()
            );


        const pendingReset =
            pendingResetUserIds.includes(
                String(
                    user._id
                )
            );


        const selected =
            String(
                selectedUserId ||
                ""
            ) ===
            String(
                user._id
            );


        const name =
            getUserDisplayName(
                user,
                user.username ||
                "User"
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
                    border-b
                    border-slate-100
                    last:border-0

                    ${selected
                        ? "bg-blue-50/60"
                        : "hover:bg-slate-50/60"
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
                        <Avatar
                            name={
                                name
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
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                {name}
                            </p>


                            <p
                                className="
                                    mt-1
                                    max-w-[190px]
                                    truncate
                                    text-[7px]
                                    text-slate-400
                                "
                            >
                                {user.email ||
                                    "—"}
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-[7px]
                                    text-slate-400
                                "
                            >
                                @{user.username ||
                                    "—"}
                            </p>
                        </div>
                    </div>
                </td>


                {/* ROLE */}

                <td
                    className="
                        whitespace-nowrap
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
                    <div
                        className="
                            flex
                            max-w-[240px]
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
                                            bg-blue-50
                                            px-2
                                            py-1
                                            text-[7px]
                                            text-blue-600
                                        "
                                    >
                                        {section.name}
                                    </span>
                                )
                            )
                        ) : (
                            <span
                                className="
                                    text-[8px]
                                    text-slate-400
                                "
                            >
                                —
                            </span>
                        )}
                    </div>
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
                            user.status
                        }
                    />


                    {pendingReset && (
                        <p
                            className="
                                mt-2
                                text-[7px]
                                font-medium
                                text-amber-600
                            "
                        >
                            Reset requested
                        </p>
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


    return (
        <div>

            {/* ================================================= */}
            {/* MOBILE + TABLET */}
            {/* ================================================= */}

            <div
                className="
                    space-y-3
                    p-4
                    lg:hidden
                "
            >
                {users.map(
                    renderMobileCard
                )}
            </div>


            {/* ================================================= */}
            {/* DESKTOP */}
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
                            bg-slate-50
                        "
                    >
                        <tr>
                            <TableHead>
                                User
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

                            <TableHead right>
                                Actions
                            </TableHead>
                        </tr>
                    </thead>


                    <tbody>
                        {users.map(
                            renderDesktopRow
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}


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
                "U"
            )
                .charAt(0)
                .toUpperCase()}
        </div>
    );
}


function RoleBadge({
    role,
}) {
    const trainer =
        role ===
        "trainer";


    return (
        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-[7px]
                font-medium
                capitalize

                ${trainer
                    ? "bg-purple-50 text-purple-600"
                    : "bg-blue-50 text-blue-600"
                }
            `}
        >
            {role ||
                "User"}
        </span>
    );
}


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


export default UserTable;