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
import FeedbackAlert from "../../components/ui/FeedbackAlert";

import api from "../../services/api";

import {
    getApiErrorMessage,
    parseArrayResponse,
} from "../../utils/training";


// ======================================================
// ROLE DEFINITIONS
// ======================================================

const ROLE_DEFINITIONS = [
    {
        id: "administrator",
        name: "Administrator",
        backendRole: "admin",
        description:
            "Full administrative access to users, training and system records.",
        permissions: 10,
    },

    {
        id: "trainer",
        name: "Trainer",
        backendRole: "trainer",
        description:
            "Manage assigned training programmes and learning content.",
        permissions: 6,
    },

    {
        id: "trainee",
        name: "Trainee",
        backendRole: "trainee",
        description:
            "Access assigned training programmes and learning content.",
        permissions: 3,
    },
];


// ======================================================
// PERMISSION MATRIX
// ======================================================

const PERMISSION_MATRIX = [
    {
        permission: "View Users",
        administrator: true,
        trainer: false,
        trainee: false,
    },

    {
        permission: "Create User",
        administrator: true,
        trainer: false,
        trainee: false,
    },

    {
        permission: "Manage User Status",
        administrator: true,
        trainer: false,
        trainee: false,
    },

    {
        permission: "Reset User Password",
        administrator: true,
        trainer: false,
        trainee: false,
    },

    {
        permission: "Manage Training Programmes",
        administrator: true,
        trainer: true,
        trainee: false,
    },

    {
        permission: "Manage Learning Sections",
        administrator: true,
        trainer: true,
        trainee: false,
    },

    {
        permission: "Assign Training",
        administrator: true,
        trainer: false,
        trainee: false,
    },

    {
        permission: "View Assigned Training",
        administrator: true,
        trainer: true,
        trainee: true,
    },

    {
        permission: "View Own Profile",
        administrator: true,
        trainer: true,
        trainee: true,
    },

    {
        permission: "Access Own Dashboard",
        administrator: true,
        trainer: true,
        trainee: true,
    },
];


// ======================================================
// PAGE
// ======================================================

function RolesPermissionsPage() {
    const navigate =
        useNavigate();


    const [
        users,
        setUsers,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    // ======================================================
    // LOAD USERS
    // ======================================================

    const loadUsers =
        useCallback(async () => {
            try {
                setLoading(true);
                setErrorMessage("");


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
                setLoading(false);
            }
        }, []);


    useEffect(() => {
        loadUsers();
    }, [
        loadUsers,
    ]);


    // ======================================================
    // ROLE COUNTS
    // ======================================================

    const roles =
        useMemo(() => {
            return ROLE_DEFINITIONS.map(
                (
                    role
                ) => {
                    const count =
                        role.backendRole ===
                            "admin"
                            ? 1
                            : users.filter(
                                (
                                    user
                                ) =>
                                    user.role ===
                                    role.backendRole
                            ).length;


                    return {
                        ...role,
                        users: count,
                    };
                }
            );
        }, [
            users,
        ]);


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <DashboardLayout
            role="admin"
            title="Roles & Permissions"
            subtitle="View access levels for Administrator, Trainer and Trainee accounts."
        >
            <div className="space-y-4">

                <FeedbackAlert
                    type="error"
                    message={
                        errorMessage
                    }
                    onClose={() =>
                        setErrorMessage(
                            ""
                        )
                    }
                />


                {/* ================================================= */}
                {/* ROLE CARDS */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-4
                        md:grid-cols-2
                        xl:grid-cols-3
                    "
                >
                    {roles.map(
                        (
                            role
                        ) => (
                            <article
                                key={
                                    role.id
                                }
                                className="
                                    rounded-xl
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
                                        items-start
                                        justify-between
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
                                            rounded-full
                                            bg-blue-50
                                            text-blue-600
                                        "
                                    >
                                        <RoleIcon />
                                    </div>


                                    <span
                                        className="
                                            rounded-full
                                            bg-slate-100
                                            px-2.5
                                            py-1
                                            text-[8px]
                                            font-medium
                                            text-slate-500
                                        "
                                    >
                                        {loading
                                            ? "..."
                                            : `${role.users} ${role.users ===
                                                1
                                                ? "User"
                                                : "Users"
                                            }`}
                                    </span>
                                </div>


                                <h2
                                    className="
                                        mt-4
                                        text-[13px]
                                        font-semibold
                                        text-slate-800
                                    "
                                >
                                    {role.name}
                                </h2>


                                <p
                                    className="
                                        mt-2
                                        min-h-[40px]
                                        text-[9px]
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    {role.description}
                                </p>


                                <div
                                    className="
                                        mt-4
                                        flex
                                        items-center
                                        justify-between
                                        border-t
                                        border-slate-100
                                        pt-4
                                    "
                                >
                                    <span
                                        className="
                                            text-[8px]
                                            text-slate-400
                                        "
                                    >
                                        {role.permissions} permissions
                                    </span>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/admin/roles/${role.id}`
                                            )
                                        }
                                        className="
                                            text-[9px]
                                            font-medium
                                            text-blue-600
                                            hover:text-blue-700
                                        "
                                    >
                                        View Details
                                    </button>
                                </div>
                            </article>
                        )
                    )}
                </section>


                {/* ================================================= */}
                {/* PERMISSION MATRIX */}
                {/* ================================================= */}

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
                    <div
                        className="
                            border-b
                            border-slate-100
                            px-5
                            py-4
                        "
                    >
                        <h2
                            className="
                                text-[12px]
                                font-semibold
                                text-slate-800
                            "
                        >
                            Permission Matrix
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                text-slate-400
                            "
                        >
                            Compare access available to each role.
                        </p>
                    </div>


                    {/* MOBILE */}

                    <div
                        className="
                            space-y-3
                            p-4
                            md:hidden
                        "
                    >
                        {PERMISSION_MATRIX.map(
                            (
                                item
                            ) => (
                                <div
                                    key={
                                        item.permission
                                    }
                                    className="
                                        rounded-lg
                                        border
                                        border-slate-200
                                        p-4
                                    "
                                >
                                    <p
                                        className="
                                            text-[10px]
                                            font-medium
                                            text-slate-700
                                        "
                                    >
                                        {item.permission}
                                    </p>


                                    <div
                                        className="
                                            mt-3
                                            grid
                                            grid-cols-3
                                            gap-2
                                        "
                                    >
                                        <MobilePermission
                                            label="Admin"
                                            allowed={
                                                item.administrator
                                            }
                                        />

                                        <MobilePermission
                                            label="Trainer"
                                            allowed={
                                                item.trainer
                                            }
                                        />

                                        <MobilePermission
                                            label="Trainee"
                                            allowed={
                                                item.trainee
                                            }
                                        />
                                    </div>
                                </div>
                            )
                        )}
                    </div>


                    {/* DESKTOP */}

                    <div
                        className="
                            hidden
                            overflow-x-auto
                            md:block
                        "
                    >
                        <table
                            className="
                                min-w-[700px]
                                w-full
                                border-collapse
                            "
                        >
                            <thead>
                                <tr
                                    className="
                                        border-b
                                        border-slate-200
                                        bg-slate-50
                                    "
                                >
                                    <TableHead>
                                        Permission
                                    </TableHead>

                                    <TableHead center>
                                        Administrator
                                    </TableHead>

                                    <TableHead center>
                                        Trainer
                                    </TableHead>

                                    <TableHead center>
                                        Trainee
                                    </TableHead>
                                </tr>
                            </thead>


                            <tbody>
                                {PERMISSION_MATRIX.map(
                                    (
                                        item
                                    ) => (
                                        <tr
                                            key={
                                                item.permission
                                            }
                                            className="
                                                border-b
                                                border-slate-100
                                                last:border-0
                                            "
                                        >
                                            <td
                                                className="
                                                    px-5
                                                    py-3
                                                    text-[9px]
                                                    font-medium
                                                    text-slate-700
                                                "
                                            >
                                                {item.permission}
                                            </td>


                                            <PermissionCell
                                                allowed={
                                                    item.administrator
                                                }
                                            />


                                            <PermissionCell
                                                allowed={
                                                    item.trainer
                                                }
                                            />


                                            <PermissionCell
                                                allowed={
                                                    item.trainee
                                                }
                                            />
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </DashboardLayout>
    );
}


function TableHead({
    children,
    center = false,
}) {
    return (
        <th
            className={`
                px-5
                py-3
                text-[8px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-400

                ${center
                    ? "text-center"
                    : "text-left"
                }
            `}
        >
            {children}
        </th>
    );
}


function PermissionCell({
    allowed,
}) {
    return (
        <td
            className="
                px-5
                py-3
                text-center
            "
        >
            <PermissionMark
                allowed={
                    allowed
                }
            />
        </td>
    );
}


function MobilePermission({
    label,
    allowed,
}) {
    return (
        <div
            className="
                rounded-lg
                bg-slate-50
                p-2
                text-center
            "
        >
            <p
                className="
                    text-[7px]
                    text-slate-400
                "
            >
                {label}
            </p>


            <div
                className="
                    mt-1
                    flex
                    justify-center
                "
            >
                <PermissionMark
                    allowed={
                        allowed
                    }
                />
            </div>
        </div>
    );
}


function PermissionMark({
    allowed,
}) {
    return (
        <span
            className={`
                inline-flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                text-[10px]
                font-bold

                ${allowed
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-400"
                }
            `}
        >
            {allowed
                ? "✓"
                : "—"}
        </span>
    );
}


function RoleIcon() {
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

            <path d="M3 20c.5-4 2.5-6 6-6" />

            <path d="m16 8 2 2 3-4" />

            <path d="M15 15h6" />
        </svg>
    );
}


export default RolesPermissionsPage;