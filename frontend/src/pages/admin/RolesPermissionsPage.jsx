import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import ActionButton from "../../components/ui/ActionButton";
import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";
import StatusBadge from "../../components/ui/StatusBadge";

import api from "../../services/api";

import {
    getApiErrorMessage,
    parseArrayResponse,
} from "../../utils/training";


// ======================================================
// SYSTEM ROLE DEFINITIONS
// ======================================================

const ROLE_DEFINITIONS = [
    {
        id:
            "administrator",

        name:
            "Administrator",

        type:
            "System Role",

        description:
            "Full system access and administrative control.",

        permissions:
            10,

        theme:
            "administrator",
    },

    {
        id:
            "trainer",

        name:
            "Trainer",

        type:
            "Custom Role",

        description:
            "Manage assigned training programmes and authorised learning content.",

        permissions:
            6,

        theme:
            "trainer",
    },

    {
        id:
            "trainee",

        name:
            "Trainee",

        type:
            "System Role",

        description:
            "Access assigned training programmes and learning content.",

        permissions:
            3,

        theme:
            "trainee",
    },
];


// ======================================================
// PERMISSION MATRIX
// ======================================================

const PERMISSION_MATRIX = [
    {
        permission:
            "View Users",

        description:
            "View Trainer and Trainee accounts.",

        administrator:
            true,

        trainer:
            false,

        trainee:
            false,
    },

    {
        permission:
            "Create User",

        description:
            "Create Trainer and Trainee accounts.",

        administrator:
            true,

        trainer:
            false,

        trainee:
            false,
    },

    {
        permission:
            "Manage User Status",

        description:
            "Deactivate, reactivate or delete users.",

        administrator:
            true,

        trainer:
            false,

        trainee:
            false,
    },

    {
        permission:
            "Reset User Password",

        description:
            "Generate a new temporary password.",

        administrator:
            true,

        trainer:
            false,

        trainee:
            false,
    },

    {
        permission:
            "Manage Training Programmes",

        description:
            "Create or update training programmes.",

        administrator:
            true,

        trainer:
            true,

        trainee:
            false,
    },

    {
        permission:
            "Manage Learning Sections",

        description:
            "Create and maintain programme learning content.",

        administrator:
            true,

        trainer:
            true,

        trainee:
            false,
    },

    {
        permission:
            "Assign Training",

        description:
            "Assign programmes to Trainees.",

        administrator:
            true,

        trainer:
            false,

        trainee:
            false,
    },

    {
        permission:
            "View Assigned Training",

        description:
            "Access available training programmes.",

        administrator:
            true,

        trainer:
            true,

        trainee:
            true,
    },

    {
        permission:
            "View Own Profile",

        description:
            "Access personal account information.",

        administrator:
            true,

        trainer:
            true,

        trainee:
            true,
    },

    {
        permission:
            "Access Own Dashboard",

        description:
            "Access the dashboard allowed for the current role.",

        administrator:
            true,

        trainer:
            true,

        trainee:
            true,
    },
];


// ======================================================
// PAGE
// ======================================================

function RolesPermissionsPage() {
    const navigate =
        useNavigate();


    // ======================================================
    // USERS
    // ======================================================

    const [
        users,
        setUsers,
    ] = useState([]);


    // ======================================================
    // PAGE STATE
    // ======================================================

    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    // ======================================================
    // LOAD CREATED USERS
    // ======================================================

    const loadUsers =
        useCallback(async () => {
            try {
                setLoading(
                    true
                );


                setErrorMessage(
                    ""
                );


                const response =
                    await api.get(
                        "/admin/users"
                    );


                setUsers(
                    parseArrayResponse(
                        response.data,
                        "users"
                    )
                );

            } catch (error) {
                console.error(
                    "Load role users error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to load role information."
                    )
                );

            } finally {
                setLoading(
                    false
                );
            }
        }, []);


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        loadUsers();
    }, [
        loadUsers,
    ]);


    // ======================================================
    // ROLE CARDS WITH CURRENT USER COUNTS
    // ======================================================

    const roles =
        useMemo(() => {
            return ROLE_DEFINITIONS.map(
                (role) => {
                    const actualRole =
                        role.id ===
                            "administrator"
                            ? "admin"
                            : role.id;


                    const count =
                        actualRole ===
                            "admin"
                            ? 1
                            : users.filter(
                                (user) =>
                                    user.role ===
                                    actualRole
                            ).length;


                    return {
                        ...role,

                        users:
                            count,
                    };
                }
            );
        }, [
            users,
        ]);


    // ======================================================
    // TOTAL PERMISSIONS
    // ======================================================

    const totalPermissions =
        PERMISSION_MATRIX.length;


    // ======================================================
    // UI
    // ======================================================

    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >

            <div
                className="
                    space-y-6
                "
            >

                {/* ================================================= */}
                {/* HERO HEADER */}
                {/* ================================================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-200/60
                        bg-gradient-to-r
                        from-[#073763]
                        via-[#0b4f87]
                        to-[#1769aa]
                        px-5
                        py-6
                        text-white
                        shadow-sm
                        sm:px-6
                        lg:px-7
                    "
                >

                    {/* BACKGROUND CIRCLE */}

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


                    {/* BACKGROUND GRID */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            opacity-[0.08]
                        "
                        style={{
                            backgroundImage:
                                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",

                            backgroundSize:
                                "28px 28px",
                        }}
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
                                    text-white
                                    backdrop-blur
                                "
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-6 w-6"
                                >
                                    <circle
                                        cx="9"
                                        cy="7"
                                        r="3"
                                    />

                                    <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                                    <path d="M16 8l2 2 3-4" />

                                    <path d="M15 15h6" />

                                    <path d="M18 12v6" />
                                </svg>

                            </div>


                            <div>

                                <p
                                    className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.18em]
                                        text-blue-100
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
                                    Roles & Permissions
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-[11px]
                                        leading-5
                                        text-blue-100
                                        sm:text-xs
                                    "
                                >
                                    Review how Administrator, Trainer
                                    and Trainee accounts access the
                                    workplace safety training system.
                                </p>

                            </div>

                        </div>


                        {/* RIGHT BUTTON */}

                        <ActionButton
                            variant="secondary"
                            className="
                                w-full
                                justify-center
                                bg-white
                                text-blue-700
                                sm:w-auto
                            "
                            onClick={() =>
                                navigate(
                                    "/admin/users"
                                )
                            }
                        >
                            ← Manage Users
                        </ActionButton>

                    </div>

                </section>


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                <FeedbackAlert
                    type="error"
                    message={
                        errorMessage
                    }
                />


                {/* ================================================= */}
                {/* LOADING */}
                {/* ================================================= */}

                {loading ? (
                    <LoadingCard
                        message="Loading role information..."
                    />
                ) : (
                    <>

                        {/* ================================================= */}
                        {/* OVERVIEW STATS */}
                        {/* ================================================= */}

                        <section
                            className="
                                grid
                                gap-4
                                sm:grid-cols-2
                                lg:grid-cols-3
                            "
                        >

                            <OverviewCard
                                title="System Roles"
                                value={
                                    roles.length
                                }
                                description="Administrator, Trainer and Trainee"
                                type="roles"
                            />


                            <OverviewCard
                                title="Permission Rules"
                                value={
                                    totalPermissions
                                }
                                description="High-level role access controls"
                                type="permission"
                            />


                            <OverviewCard
                                title="Managed Accounts"
                                value={
                                    users.length
                                }
                                description="Current Trainer and Trainee accounts"
                                type="users"
                            />

                        </section>


                        {/* ================================================= */}
                        {/* SYSTEM ROLES */}
                        {/* ================================================= */}

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

                            {/* HEADER */}

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
                                    px-5
                                    py-5
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <div>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <span
                                            className="
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-blue-500
                                            "
                                        />


                                        <h2
                                            className="
                                                text-base
                                                font-bold
                                                text-slate-900
                                            "
                                        >
                                            System Roles
                                        </h2>

                                    </div>


                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            leading-5
                                            text-slate-500
                                        "
                                    >
                                        Select a role to review its permissions
                                        or open the role configuration page.
                                    </p>

                                </div>


                                <div
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
                                    {roles.length} Roles
                                </div>

                            </div>


                            {/* ROLE CARDS */}

                            <div
                                className="
                                    grid
                                    gap-4
                                    p-4
                                    sm:p-5
                                    md:grid-cols-2
                                    xl:grid-cols-3
                                "
                            >

                                {roles.map(
                                    (
                                        role
                                    ) => (
                                        <RoleCard
                                            key={
                                                role.id
                                            }
                                            role={
                                                role
                                            }
                                            onView={() =>
                                                navigate(
                                                    `/admin/roles/${role.id}`
                                                )
                                            }
                                            onEdit={() =>
                                                navigate(
                                                    `/admin/roles/${role.id}/edit`
                                                )
                                            }
                                        />
                                    )
                                )}

                            </div>

                        </section>


                        {/* ================================================= */}
                        {/* PERMISSION OVERVIEW */}
                        {/* ================================================= */}

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

                            {/* HEADER */}

                            <div
                                className="
                                    border-b
                                    border-slate-200
                                    bg-gradient-to-r
                                    from-white
                                    to-slate-50
                                    px-5
                                    py-5
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
                                            <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                            <path d="m9 12 2 2 4-4" />
                                        </svg>
                                    </div>


                                    <div>

                                        <h2
                                            className="
                                                text-base
                                                font-bold
                                                text-slate-900
                                            "
                                        >
                                            Permission Overview
                                        </h2>


                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                text-slate-500
                                            "
                                        >
                                            Current high-level access rules
                                            for every system role.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* MOBILE PERMISSION CARDS */}
                            {/* ================================================= */}

                            <div
                                className="
                                    space-y-3
                                    p-4
                                    md:hidden
                                "
                            >

                                {PERMISSION_MATRIX.map(
                                    (
                                        permission
                                    ) => (
                                        <MobilePermissionCard
                                            key={
                                                permission.permission
                                            }
                                            permission={
                                                permission
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
                                    md:block
                                "
                            >

                                <table
                                    className="
                                        min-w-[760px]
                                        w-full
                                    "
                                >

                                    <thead
                                        className="
                                            bg-gradient-to-r
                                            from-slate-50
                                            to-blue-50/30
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
                                                Permission
                                            </th>


                                            <th className="px-5 py-3.5 text-center">
                                                Administrator
                                            </th>


                                            <th className="px-5 py-3.5 text-center">
                                                Trainer
                                            </th>


                                            <th className="px-5 py-3.5 text-center">
                                                Trainee
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody
                                        className="
                                            divide-y
                                            divide-slate-100
                                        "
                                    >

                                        {PERMISSION_MATRIX.map(
                                            (
                                                permission
                                            ) => (
                                                <tr
                                                    key={
                                                        permission.permission
                                                    }
                                                    className="
                                                        transition
                                                        hover:bg-slate-50/70
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
                                                                text-xs
                                                                font-semibold
                                                                text-slate-800
                                                            "
                                                        >
                                                            {permission.permission}
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1
                                                                max-w-md
                                                                text-[10px]
                                                                leading-4
                                                                text-slate-500
                                                            "
                                                        >
                                                            {permission.description}
                                                        </p>

                                                    </td>


                                                    <PermissionCell
                                                        allowed={
                                                            permission.administrator
                                                        }
                                                    />


                                                    <PermissionCell
                                                        allowed={
                                                            permission.trainer
                                                        }
                                                    />


                                                    <PermissionCell
                                                        allowed={
                                                            permission.trainee
                                                        }
                                                    />

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </section>


                        {/* ================================================= */}
                        {/* SAFETY INFORMATION */}
                        {/* ================================================= */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-blue-100
                                bg-gradient-to-r
                                from-blue-50
                                via-white
                                to-emerald-50
                                p-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-center
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
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


                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        Role-Based Access Control
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            max-w-4xl
                                            text-[10px]
                                            leading-5
                                            text-slate-500
                                        "
                                    >
                                        Access is separated by role so each
                                        user only sees the workplace safety
                                        functions required for their
                                        responsibilities.
                                    </p>

                                </div>

                            </div>

                        </section>

                    </>
                )}

            </div>

        </DashboardLayout>
    );
}


// ======================================================
// ROLE CARD
// ======================================================

function RoleCard({
    role,
    onView,
    onEdit,
}) {

    const themeStyles = {
        administrator: {
            icon:
                "bg-blue-100 text-blue-700",

            border:
                "hover:border-blue-300",

            top:
                "bg-blue-500",

            badge:
                "bg-blue-50 text-blue-700",
        },

        trainer: {
            icon:
                "bg-indigo-100 text-indigo-700",

            border:
                "hover:border-indigo-300",

            top:
                "bg-indigo-500",

            badge:
                "bg-indigo-50 text-indigo-700",
        },

        trainee: {
            icon:
                "bg-emerald-100 text-emerald-700",

            border:
                "hover:border-emerald-300",

            top:
                "bg-emerald-500",

            badge:
                "bg-emerald-50 text-emerald-700",
        },
    };


    const theme =
        themeStyles[
        role.theme
        ] ||
        themeStyles.administrator;


    return (
        <article
            className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                ${theme.border}
            `}
        >

            {/* TOP ACCENT */}

            <div
                className={`
                    h-1
                    w-full
                    ${theme.top}
                `}
            />


            <div className="p-5">

                {/* ROLE HEADER */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >

                    <div
                        className={`
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            ${theme.icon}
                        `}
                    >
                        <RoleIcon
                            role={
                                role.id
                            }
                        />
                    </div>


                    <StatusBadge
                        status="active"
                    />

                </div>


                {/* ROLE NAME */}

                <div className="mt-4">

                    <p
                        className="
                            text-base
                            font-bold
                            text-slate-900
                        "
                    >
                        {role.name}
                    </p>


                    <span
                        className={`
                            mt-2
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1
                            text-[9px]
                            font-semibold
                            ${theme.badge}
                        `}
                    >
                        {role.type}
                    </span>


                    <p
                        className="
                            mt-3
                            min-h-[42px]
                            text-[10px]
                            leading-5
                            text-slate-500
                        "
                    >
                        {role.description}
                    </p>

                </div>


                {/* STATISTICS */}

                <div
                    className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-3
                        border-t
                        border-slate-100
                        pt-4
                    "
                >

                    <RoleStatistic
                        label="Users"
                        value={
                            role.users
                        }
                    />


                    <RoleStatistic
                        label="Permissions"
                        value={
                            role.permissions
                        }
                    />

                </div>


                {/* ACTIONS */}

                <div
                    className="
                        mt-5
                        grid
                        gap-2
                        sm:grid-cols-2
                    "
                >

                    <ActionButton
                        variant="secondary"
                        className="justify-center"
                        onClick={
                            onView
                        }
                    >
                        View Details
                    </ActionButton>


                    <ActionButton
                        variant="primary"
                        className="justify-center"
                        onClick={
                            onEdit
                        }
                    >
                        Edit
                    </ActionButton>

                </div>

            </div>

        </article>
    );
}


// ======================================================
// ROLE ICON
// ======================================================

function RoleIcon({
    role,
}) {

    if (
        role ===
        "trainer"
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

                <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                <path d="M16 5h5v5" />

                <path d="M16 10l5-5" />
            </svg>
        );
    }


    if (
        role ===
        "trainee"
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
            className="h-5 w-5"
        >
            <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

            <path d="M12 8v8" />

            <path d="M8 12h8" />
        </svg>
    );
}


// ======================================================
// ROLE STATISTIC
// ======================================================

function RoleStatistic({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-xl
                bg-slate-50
                px-3
                py-3
            "
        >

            <p
                className="
                    text-lg
                    font-bold
                    text-slate-800
                "
            >
                {value}
            </p>


            <p
                className="
                    mt-0.5
                    text-[9px]
                    font-medium
                    text-slate-500
                "
            >
                {label}
            </p>

        </div>
    );
}


// ======================================================
// OVERVIEW CARD
// ======================================================

function OverviewCard({
    title,
    value,
    description,
    type,
}) {
    return (
        <div
            className="
                relative
                overflow-hidden
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
                    absolute
                    -right-7
                    -top-7
                    h-24
                    w-24
                    rounded-full
                    bg-blue-50
                "
            />


            <div
                className="
                    relative
                    flex
                    items-start
                    gap-4
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
                    <OverviewIcon
                        type={
                            type
                        }
                    />
                </div>


                <div>

                    <p
                        className="
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {value}
                    </p>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        {title}
                    </p>


                    <p
                        className="
                            mt-1
                            text-[9px]
                            leading-4
                            text-slate-500
                        "
                    >
                        {description}
                    </p>

                </div>

            </div>

        </div>
    );
}


// ======================================================
// OVERVIEW ICON
// ======================================================

function OverviewIcon({
    type,
}) {

    if (
        type ===
        "permission"
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


// ======================================================
// MOBILE PERMISSION CARD
// ======================================================

function MobilePermissionCard({
    permission,
}) {
    return (
        <article
            className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50/60
                p-4
            "
        >

            <p
                className="
                    text-xs
                    font-bold
                    text-slate-800
                "
            >
                {permission.permission}
            </p>


            <p
                className="
                    mt-1
                    text-[10px]
                    leading-5
                    text-slate-500
                "
            >
                {permission.description}
            </p>


            <div
                className="
                    mt-4
                    grid
                    grid-cols-3
                    gap-2
                    border-t
                    border-slate-200
                    pt-4
                "
            >

                <MobilePermissionStatus
                    label="Admin"
                    allowed={
                        permission.administrator
                    }
                />


                <MobilePermissionStatus
                    label="Trainer"
                    allowed={
                        permission.trainer
                    }
                />


                <MobilePermissionStatus
                    label="Trainee"
                    allowed={
                        permission.trainee
                    }
                />

            </div>

        </article>
    );
}


// ======================================================
// MOBILE PERMISSION STATUS
// ======================================================

function MobilePermissionStatus({
    label,
    allowed,
}) {
    return (
        <div
            className="
                text-center
            "
        >

            <PermissionIndicator
                allowed={
                    allowed
                }
            />


            <p
                className="
                    mt-2
                    text-[8px]
                    font-semibold
                    text-slate-500
                "
            >
                {label}
            </p>

        </div>
    );
}


// ======================================================
// DESKTOP PERMISSION CELL
// ======================================================

function PermissionCell({
    allowed,
}) {
    return (
        <td
            className="
                px-5
                py-4
                text-center
            "
        >
            <PermissionIndicator
                allowed={
                    allowed
                }
            />
        </td>
    );
}


// ======================================================
// PERMISSION INDICATOR
// ======================================================

function PermissionIndicator({
    allowed,
}) {
    return (
        <span
            className={`
                inline-flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                text-xs
                font-bold
                ring-1

                ${allowed
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-red-50 text-red-500 ring-red-100"
                }
            `}
        >
            {allowed
                ? "✓"
                : "×"}
        </span>
    );
}


export default RolesPermissionsPage;