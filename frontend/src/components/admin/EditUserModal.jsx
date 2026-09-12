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
                        h-11
                        w-11
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
                        font-bold
                        text-slate-700
                    "
                >
                    No users found
                </p>

                <p
                    className="
                        mt-1
                        text-[8px]
                        font-medium
                        text-slate-500
                    "
                >
                    Try changing your search or filters.
                </p>
            </div>
        );
    }


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
                section
            ) =>
                TRAINING_SECTION_NAMES[
                section
                ] ||
                section
        );
    };


    return (
        <>
            {/* MOBILE */}

            <div
                className="
                    space-y-3
                    lg:hidden
                "
            >
                {users.map(
                    (
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
                                                        font-bold
                                                        text-slate-800
                                                    "
                                                >
                                                    {name}
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        truncate
                                                        text-[8px]
                                                        font-medium
                                                        text-slate-500
                                                    "
                                                >
                                                    {
                                                        user.email
                                                    }
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
                                            <StatusBadge
                                                status={
                                                    user.role
                                                }
                                            />

                                            <span
                                                className="
                                                    rounded-full
                                                    bg-slate-100
                                                    px-2.5
                                                    py-1
                                                    text-[7px]
                                                    font-semibold
                                                    text-slate-600
                                                "
                                            >
                                                @{user.username}
                                            </span>
                                        </div>


                                        <div
                                            className="
                                                mt-3
                                                flex
                                                flex-wrap
                                                gap-1.5
                                            "
                                        >
                                            {getTrainingSections(
                                                user
                                            ).map(
                                                (
                                                    section
                                                ) => (
                                                    <span
                                                        key={
                                                            section
                                                        }
                                                        className="
                                                            rounded-full
                                                            bg-blue-50
                                                            px-2.5
                                                            py-1
                                                            text-[7px]
                                                            font-semibold
                                                            text-blue-600
                                                        "
                                                    >
                                                        {section}
                                                    </span>
                                                )
                                            )}
                                        </div>


                                        <div
                                            className="
                                                mt-4
                                                grid
                                                grid-cols-2
                                                gap-2
                                            "
                                        >
                                            <ActionButton
                                                variant="secondary"
                                                disabled={
                                                    processing
                                                }
                                                onClick={() =>
                                                    onEdit?.(
                                                        user
                                                    )
                                                }
                                            >
                                                Edit
                                            </ActionButton>


                                            {pendingReset && (
                                                <ActionButton
                                                    variant="primary"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onResetPassword?.(
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
                                                        onReactivate?.(
                                                            user
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
                                                            user
                                                        )
                                                    }
                                                >
                                                    Deactivate
                                                </ActionButton>
                                            )}


                                            <ActionButton
                                                variant="danger"
                                                disabled={
                                                    processing
                                                }
                                                onClick={() =>
                                                    onDelete?.(
                                                        user
                                                    )
                                                }
                                            >
                                                Delete
                                            </ActionButton>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    }
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
                        min-w-[1050px]
                        w-full
                    "
                >
                    <thead
                        className="
                            border-y
                            border-slate-200
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
                                Training Access
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
                            (
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
                                            transition

                                            ${selected
                                                ? "bg-blue-50"
                                                : "bg-white hover:bg-slate-50/60"
                                            }
                                        `}
                                    >
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
                                                            max-w-[190px]
                                                            truncate
                                                            text-[9px]
                                                            font-bold
                                                            text-slate-800
                                                        "
                                                    >
                                                        {name}
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1
                                                            max-w-[200px]
                                                            truncate
                                                            text-[7px]
                                                            font-medium
                                                            text-slate-500
                                                        "
                                                    >
                                                        {
                                                            user.email
                                                        }
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[7px]
                                                            text-slate-400
                                                        "
                                                    >
                                                        @{user.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>


                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <StatusBadge
                                                status={
                                                    user.role
                                                }
                                            />
                                        </td>


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
                                                {getTrainingSections(
                                                    user
                                                ).length ===
                                                    0 ? (
                                                    <span
                                                        className="
                                                            text-[8px]
                                                            text-slate-400
                                                        "
                                                    >
                                                        —
                                                    </span>
                                                ) : (
                                                    getTrainingSections(
                                                        user
                                                    ).map(
                                                        (
                                                            section
                                                        ) => (
                                                            <span
                                                                key={
                                                                    section
                                                                }
                                                                className="
                                                                    rounded-full
                                                                    bg-blue-50
                                                                    px-2.5
                                                                    py-1
                                                                    text-[7px]
                                                                    font-semibold
                                                                    text-blue-600
                                                                "
                                                            >
                                                                {section}
                                                            </span>
                                                        )
                                                    )
                                                )}
                                            </div>
                                        </td>


                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <StatusBadge
                                                status={
                                                    user.status
                                                }
                                            />
                                        </td>


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
                                                <ActionButton
                                                    variant="secondary"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onEdit?.(
                                                            user
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </ActionButton>


                                                {pendingReset && (
                                                    <ActionButton
                                                        variant="primary"
                                                        disabled={
                                                            processing
                                                        }
                                                        onClick={() =>
                                                            onResetPassword?.(
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
                                                            onReactivate?.(
                                                                user
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
                                                                user
                                                            )
                                                        }
                                                    >
                                                        Deactivate
                                                    </ActionButton>
                                                )}


                                                <ActionButton
                                                    variant="danger"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onDelete?.(
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
        </>
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
                font-bold
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


export default UserTable;