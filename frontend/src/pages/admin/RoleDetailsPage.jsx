import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import ActionButton from "../../components/ui/ActionButton";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";


const ROLES = {
    administrator: {
        name:
            "Administrator",

        type:
            "System Role",

        description:
            "Full system access and administrative control.",

        priority:
            1,

        theme:
            "blue",

        permissions: [
            {
                module:
                    "User Management",

                description:
                    "Manage Trainer and Trainee accounts.",

                icon:
                    "users",

                items: [
                    "View users",
                    "Create Trainer and Trainee accounts",
                    "Deactivate and reactivate users",
                    "Delete users",
                    "Reset temporary passwords",
                ],
            },

            {
                module:
                    "Training Management",

                description:
                    "Control workplace safety training content and assignments.",

                icon:
                    "training",

                items: [
                    "Create training programmes",
                    "Manage all training programmes",
                    "Manage learning sections",
                    "Assign programmes to Trainees",
                ],
            },

            {
                module:
                    "Administration",

                description:
                    "Access administrative security and monitoring tools.",

                icon:
                    "security",

                items: [
                    "Access Admin Dashboard",
                    "View Roles & Permissions",
                    "View Audit Logs",
                ],
            },
        ],
    },


    trainer: {
        name:
            "Trainer",

        type:
            "Custom Role",

        description:
            "Manage training programmes owned by or authorised for the Trainer.",

        priority:
            2,

        theme:
            "indigo",

        permissions: [
            {
                module:
                    "Training Management",

                description:
                    "Prepare and manage authorised workplace safety training.",

                icon:
                    "training",

                items: [
                    "Create training programmes for assigned training areas",
                    "Manage owned programmes",
                    "Manage authorised programmes",
                    "Create and edit learning sections",
                    "Deactivate or reactivate learning sections",
                ],
            },

            {
                module:
                    "Account",

                description:
                    "Manage the Trainer's own account access.",

                icon:
                    "account",

                items: [
                    "Access Trainer Dashboard",
                    "Change own password",
                    "View own account information",
                ],
            },
        ],
    },


    trainee: {
        name:
            "Trainee",

        type:
            "System Role",

        description:
            "Access training programmes assigned by an Administrator.",

        priority:
            3,

        theme:
            "emerald",

        permissions: [
            {
                module:
                    "Training",

                description:
                    "Access and navigate assigned workplace safety training.",

                icon:
                    "training",

                items: [
                    "Access Trainee Dashboard",
                    "View assigned programmes",
                    "Open learning sections",
                    "Navigate through available training content",
                ],
            },

            {
                module:
                    "Account",

                description:
                    "Manage the Trainee's own account access.",

                icon:
                    "account",

                items: [
                    "Change own password",
                    "View own account information",
                ],
            },
        ],
    },
};


function RoleDetailsPage() {
    const navigate =
        useNavigate();


    const {
        roleName,
    } = useParams();


    const roleKey =
        String(
            roleName ||
            ""
        ).toLowerCase();


    const role =
        ROLES[
        roleKey
        ];


    // ======================================================
    // ROLE NOT FOUND
    // ======================================================

    if (
        !role
    ) {
        return (
            <DashboardLayout
                role="admin"
                showHeader={
                    false
                }
            >

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <EmptyState
                        title="Role not found."
                        description="The requested role does not exist."
                        action={
                            <ActionButton
                                variant="primary"
                                onClick={() =>
                                    navigate(
                                        "/admin/roles"
                                    )
                                }
                            >
                                Back to Roles
                            </ActionButton>
                        }
                    />

                </div>

            </DashboardLayout>
        );
    }


    // ======================================================
    // TOTAL PERMISSIONS
    // ======================================================

    const totalPermissions =
        role.permissions.reduce(
            (
                total,
                group
            ) =>
                total +
                group.items.length,
            0
        );


    // ======================================================
    // UI
    // ======================================================

    return (
        <DashboardLayout
            role="admin"
            showHeader={
                false
            }
        >

            <div className="space-y-6">

                {/* ================================================= */}
                {/* HERO */}
                {/* ================================================= */}

                <section
                    className={`
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        px-5
                        py-6
                        text-white
                        shadow-sm
                        sm:px-6
                        lg:px-7

                        ${role.theme ===
                            "emerald"
                            ? "border-emerald-200 bg-gradient-to-r from-[#075b52] via-[#087f6f] to-[#0f9b87]"
                            : role.theme ===
                                "indigo"
                                ? "border-indigo-200 bg-gradient-to-r from-[#263c7a] via-[#394fa4] to-[#4f63c2]"
                                : "border-blue-200 bg-gradient-to-r from-[#073763] via-[#0b4f87] to-[#1769aa]"
                        }
                    `}
                >

                    {/* DECORATION */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-16
                            h-48
                            w-48
                            rounded-full
                            bg-white/10
                        "
                    />


                    <div
                        className="
                            pointer-events-none
                            absolute
                            right-20
                            top-9
                            hidden
                            h-24
                            w-24
                            rotate-12
                            rounded-2xl
                            border
                            border-white/10
                            lg:block
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            flex
                            flex-col
                            gap-5
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        {/* LEFT */}

                        <div
                            className="
                                flex
                                min-w-0
                                items-start
                                gap-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-white/15
                                    bg-white/10
                                    backdrop-blur
                                "
                            >
                                <RoleHeroIcon
                                    roleKey={
                                        roleKey
                                    }
                                />
                            </div>


                            <div className="min-w-0">

                                <p
                                    className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.18em]
                                        text-white/75
                                    "
                                >
                                    Access Control
                                </p>


                                <h1
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        sm:text-2xl
                                    "
                                >
                                    {role.name}
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-[11px]
                                        leading-5
                                        text-white/80
                                        sm:text-xs
                                    "
                                >
                                    {role.description}
                                </p>

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div
                            className="
                                flex
                                w-full
                                flex-col
                                gap-2
                                sm:w-auto
                                sm:flex-row
                            "
                        >

                            <ActionButton
                                variant="light"
                                className="
                                    w-full
                                    justify-center
                                    sm:w-auto
                                "
                                onClick={() =>
                                    navigate(
                                        "/admin/roles"
                                    )
                                }
                            >
                                ← Back
                            </ActionButton>


                            <ActionButton
                                variant="light"
                                className="
                                    w-full
                                    justify-center
                                    sm:w-auto
                                "
                                onClick={() =>
                                    navigate(
                                        `/admin/roles/${roleKey}/edit`
                                    )
                                }
                            >
                                Edit Role
                            </ActionButton>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* SUMMARY */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-4
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    <SummaryCard
                        label="Role Name"
                        value={
                            role.name
                        }
                        icon="role"
                    />


                    <SummaryCard
                        label="Role Type"
                        value={
                            role.type
                        }
                        icon="type"
                    />


                    <SummaryCard
                        label="Priority"
                        value={
                            role.priority
                        }
                        icon="priority"
                    />


                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
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
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-emerald-50
                                    text-emerald-600
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
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    />

                                    <path d="m8 12 2.5 2.5L16 9" />
                                </svg>
                            </div>


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
                                    Status
                                </p>


                                <div className="mt-2">

                                    <StatusBadge
                                        status="active"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* ROLE OVERVIEW */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-4
                        lg:grid-cols-[1fr_280px]
                    "
                >

                    {/* PERMISSIONS */}

                    <div
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                        "
                    >

                        <div
                            className="
                                border-b
                                border-slate-200
                                bg-gradient-to-r
                                from-white
                                to-blue-50/40
                                px-5
                                py-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <div>

                                    <h2
                                        className="
                                            text-base
                                            font-bold
                                            text-slate-900
                                        "
                                    >
                                        Role Permissions
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            leading-5
                                            text-slate-500
                                        "
                                    >
                                        Access currently associated with the{" "}
                                        {role.name} role.
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
                                    {totalPermissions} Permissions
                                </span>

                            </div>

                        </div>


                        <div
                            className="
                                divide-y
                                divide-slate-100
                            "
                        >

                            {role.permissions.map(
                                (
                                    group
                                ) => (
                                    <PermissionGroup
                                        key={
                                            group.module
                                        }
                                        group={
                                            group
                                        }
                                    />
                                )
                            )}

                        </div>

                    </div>


                    {/* SAFETY ACCESS CARD */}

                    <aside
                        className="
                            h-fit
                            overflow-hidden
                            rounded-2xl
                            border
                            border-blue-100
                            bg-gradient-to-b
                            from-blue-50
                            to-white
                            shadow-sm
                        "
                    >

                        <div
                            className="
                                border-b
                                border-blue-100
                                p-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-blue-600
                                    shadow-sm
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-6 w-6"
                                >
                                    <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>


                            <h3
                                className="
                                    mt-4
                                    text-sm
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Workplace Safety Access
                            </h3>


                            <p
                                className="
                                    mt-2
                                    text-[10px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                Role-based access ensures each person only sees
                                the training and administrative functions
                                required for their responsibilities.
                            </p>

                        </div>


                        <div className="p-5">

                            <SafetyDetail
                                label="Role"
                                value={
                                    role.name
                                }
                            />


                            <SafetyDetail
                                label="Permission Groups"
                                value={
                                    role.permissions.length
                                }
                            />


                            <SafetyDetail
                                label="Total Permissions"
                                value={
                                    totalPermissions
                                }
                            />

                        </div>

                    </aside>

                </section>

            </div>

        </DashboardLayout>
    );
}


// ======================================================
// PERMISSION GROUP
// ======================================================

function PermissionGroup({
    group,
}) {
    return (
        <div
            className="
                p-4
                sm:p-5
            "
        >

            <div
                className="
                    flex
                    items-start
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
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                    "
                >
                    <PermissionIcon
                        type={
                            group.icon
                        }
                    />
                </div>


                <div>

                    <h3
                        className="
                            text-sm
                            font-bold
                            text-slate-800
                        "
                    >
                        {group.module}
                    </h3>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            leading-5
                            text-slate-500
                        "
                    >
                        {group.description}
                    </p>

                </div>

            </div>


            <div
                className="
                    mt-4
                    grid
                    gap-3
                    md:grid-cols-2
                "
            >

                {group.items.map(
                    (
                        item
                    ) => (
                        <div
                            key={
                                item
                            }
                            className="
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-slate-100
                                bg-slate-50/70
                                p-3
                            "
                        >

                            <span
                                className="
                                    mt-[1px]
                                    flex
                                    h-5
                                    w-5
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-emerald-100
                                    text-[10px]
                                    font-bold
                                    text-emerald-700
                                "
                            >
                                ✓
                            </span>


                            <p
                                className="
                                    text-[10px]
                                    leading-5
                                    text-slate-700
                                "
                            >
                                {item}
                            </p>

                        </div>
                    )
                )}

            </div>

        </div>
    );
}


// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
    label,
    value,
    icon,
}) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
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
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                    "
                >
                    <SummaryIcon
                        type={
                            icon
                        }
                    />
                </div>


                <div className="min-w-0">

                    <p
                        className="
                            text-[9px]
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
                            truncate
                            text-sm
                            font-bold
                            text-slate-800
                        "
                    >
                        {value}
                    </p>

                </div>

            </div>

        </div>
    );
}


// ======================================================
// SAFETY DETAIL
// ======================================================

function SafetyDetail({
    label,
    value,
}) {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                gap-3
                border-b
                border-slate-100
                py-3
                last:border-b-0
            "
        >

            <span
                className="
                    text-[10px]
                    text-slate-500
                "
            >
                {label}
            </span>


            <span
                className="
                    text-[10px]
                    font-bold
                    text-slate-800
                "
            >
                {value}
            </span>

        </div>
    );
}


// ======================================================
// HERO ICON
// ======================================================

function RoleHeroIcon({
    roleKey,
}) {

    if (
        roleKey ===
        "trainer"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
            >
                <circle
                    cx="9"
                    cy="8"
                    r="3"
                />

                <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                <path d="M16 5h5v5" />

                <path d="M16 10l5-5" />
            </svg>
        );
    }


    if (
        roleKey ===
        "trainee"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
            >
                <circle
                    cx="12"
                    cy="8"
                    r="3"
                />

                <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />

                <path d="m17 8 2 2 3-4" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
        >
            <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

            <path d="M12 8v8" />

            <path d="M8 12h8" />
        </svg>
    );
}


// ======================================================
// PERMISSION ICON
// ======================================================

function PermissionIcon({
    type,
}) {

    if (
        type ===
        "users"
    ) {
        return (
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

                <path d="M15 15c3 0 5 1.6 5.5 5" />
            </svg>
        );
    }


    if (
        type ===
        "account"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <circle
                    cx="12"
                    cy="8"
                    r="3"
                />

                <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
            </svg>
        );
    }


    if (
        type ===
        "security"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                <path d="m9 12 2 2 4-4" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path d="M4 5h6v14H4z" />

            <path d="M14 5h6v14h-6z" />

            <path d="M10 8h4" />

            <path d="M10 16h4" />
        </svg>
    );
}


// ======================================================
// SUMMARY ICON
// ======================================================

function SummaryIcon({
    type,
}) {

    if (
        type ===
        "priority"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <path d="M5 19V9" />

                <path d="M12 19V5" />

                <path d="M19 19v-7" />
            </svg>
        );
    }


    if (
        type ===
        "type"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="3"
                />

                <path d="M8 9h8" />

                <path d="M8 13h6" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <circle
                cx="9"
                cy="7"
                r="3"
            />

            <path d="M3 20c.5-4 2.5-6 6-6" />

            <path d="M16 8l2 2 3-4" />
        </svg>
    );
}


export default RoleDetailsPage;