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


const ROLE_DEFINITIONS = [
    {
        id: "administrator",
        name: "Administrator",
        backendRole: "admin",
        description:
            "Full administrative access to users, training and system records.",
    },
    {
        id: "trainer",
        name: "Trainer",
        backendRole: "trainer",
        description:
            "Manage assigned training programmes and learning content.",
    },
    {
        id: "trainee",
        name: "Trainee",
        backendRole: "trainee",
        description:
            "Access assigned training programmes and learning content.",
    },
];


const PERMISSION_MATRIX = [
    {
        permission:
            "View Users",
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
        administrator:
            true,
        trainer:
            true,
        trainee:
            true,
    },
];


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


    const loadUsers =
        useCallback(
            async () => {
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
            },
            []
        );


    useEffect(() => {
        loadUsers();
    }, [
        loadUsers,
    ]);


    const roleCounts =
        useMemo(
            () => {
                const counts = {
                    admin: 0,
                    trainer: 0,
                    trainee: 0,
                };

                users.forEach(
                    (
                        user
                    ) => {
                        if (
                            Object.prototype
                                .hasOwnProperty
                                .call(
                                    counts,
                                    user.role
                                )
                        ) {
                            counts[
                                user.role
                            ] += 1;
                        }
                    }
                );

                return counts;
            },
            [
                users,
            ]
        );


    return (
        <DashboardLayout
            role="admin"
            title="Roles & Permissions"
            subtitle="Review role access and system permissions."
        >
            <div
                className="
                    space-y-4
                "
            >
                <FeedbackAlert
                    type="error"
                    message={
                        errorMessage
                    }
                    onClose={() =>
                        setErrorMessage("")
                    }
                />


                {/* ROLE CARDS */}

                <section
                    className="
                        grid
                        gap-4
                        md:grid-cols-3
                    "
                >
                    {ROLE_DEFINITIONS.map(
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
                                    <RoleIcon />

                                    <span
                                        className="
                                            rounded-full
                                            bg-blue-50
                                            px-3
                                            py-1
                                            text-[8px]
                                            font-bold
                                            text-blue-600
                                        "
                                    >
                                        {loading
                                            ? "..."
                                            : roleCounts[
                                            role.backendRole
                                            ]}{" "}
                                        Users
                                    </span>
                                </div>


                                <h2
                                    className="
                                        mt-4
                                        text-[13px]
                                        font-bold
                                        text-[#172033]
                                    "
                                >
                                    {role.name}
                                </h2>

                                <p
                                    className="
                                        mt-2
                                        min-h-[40px]
                                        text-[8px]
                                        font-medium
                                        leading-5
                                        text-slate-600
                                    "
                                >
                                    {
                                        role.description
                                    }
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/admin/roles/${role.id}`
                                        )
                                    }
                                    className="
                                        mt-4
                                        min-h-[38px]
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        text-[9px]
                                        font-semibold
                                        text-blue-600
                                        hover:bg-blue-50
                                    "
                                >
                                    View Role
                                </button>
                            </article>
                        )
                    )}
                </section>


                {/* MATRIX */}

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
                            px-4
                            py-4
                            sm:px-5
                        "
                    >
                        <h2
                            className="
                                text-[12px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Permission Matrix
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[8px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Current access available to each system role.
                        </p>
                    </div>


                    {/* MOBILE */}

                    <div
                        className="
                            space-y-3
                            p-4
                            lg:hidden
                        "
                    >
                        {PERMISSION_MATRIX.map(
                            (
                                permission
                            ) => (
                                <article
                                    key={
                                        permission.permission
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
                                            text-[9px]
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        {
                                            permission.permission
                                        }
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
                                            enabled={
                                                permission.administrator
                                            }
                                        />

                                        <MobilePermission
                                            label="Trainer"
                                            enabled={
                                                permission.trainer
                                            }
                                        />

                                        <MobilePermission
                                            label="Trainee"
                                            enabled={
                                                permission.trainee
                                            }
                                        />
                                    </div>
                                </article>
                            )
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
                                min-w-[750px]
                                w-full
                            "
                        >
                            <thead
                                className="
                                    bg-slate-50
                                "
                            >
                                <tr>
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
                                        permission
                                    ) => (
                                        <tr
                                            key={
                                                permission.permission
                                            }
                                            className="
                                                border-t
                                                border-slate-100
                                            "
                                        >
                                            <td
                                                className="
                                                    px-5
                                                    py-4
                                                    text-[9px]
                                                    font-semibold
                                                    text-slate-700
                                                "
                                            >
                                                {
                                                    permission.permission
                                                }
                                            </td>

                                            <PermissionCell
                                                enabled={
                                                    permission.administrator
                                                }
                                            />

                                            <PermissionCell
                                                enabled={
                                                    permission.trainer
                                                }
                                            />

                                            <PermissionCell
                                                enabled={
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
                text-[7px]
                font-bold
                uppercase
                tracking-wide
                text-slate-500

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
    enabled,
}) {
    return (
        <td
            className="
                px-5
                py-4
                text-center
            "
        >
            <PermissionMark
                enabled={
                    enabled
                }
            />
        </td>
    );
}


function MobilePermission({
    label,
    enabled,
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
            <PermissionMark
                enabled={
                    enabled
                }
            />

            <p
                className="
                    mt-1
                    text-[7px]
                    font-medium
                    text-slate-500
                "
            >
                {label}
            </p>
        </div>
    );
}


function PermissionMark({
    enabled,
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
                text-[9px]
                font-bold

                ${enabled
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-400"
                }
            `}
        >
            {enabled
                ? "✓"
                : "—"}
        </span>
    );
}


function RoleIcon() {
    return (
        <div
            className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
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
                    cx="12"
                    cy="8"
                    r="3"
                />

                <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
            </svg>
        </div>
    );
}


export default RolesPermissionsPage;