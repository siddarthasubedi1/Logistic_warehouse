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
        id: "administrator",
        name: "Administrator",
        type: "System Role",

        description:
            "Full system access and administrative control.",

        permissions: 10,
    },

    {
        id: "trainer",
        name: "Trainer",
        type: "Custom Role",

        description:
            "Manage assigned training programmes and authorised learning content.",

        permissions: 6,
    },

    {
        id: "trainee",
        name: "Trainee",
        type: "System Role",

        description:
            "Access assigned training programmes and learning content.",

        permissions: 3,
    },
];


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
    // LOAD CREATED USERS
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
                        users: count,
                    };
                }
            );
        }, [
            users,
        ]);


    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >
            <div className="space-y-6">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Roles & Permissions
                        </h1>


                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Review access permissions for Administrator,
                            Trainer and Trainee roles.
                        </p>
                    </div>


                    <ActionButton
                        variant="secondary"
                        onClick={() =>
                            navigate(
                                "/admin/users"
                            )
                        }
                    >
                        ← Manage Users
                    </ActionButton>

                </div>


                <FeedbackAlert
                    type="error"
                    message={
                        errorMessage
                    }
                />


                {loading ? (
                    <LoadingCard
                        message="Loading role information..."
                    />
                ) : (
                    <>
                        {/* ================================================= */}
                        {/* ROLE CARDS */}
                        {/* ================================================= */}

                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    System Roles
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Select a role to view its permission details.
                                </p>
                            </div>


                            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                                {roles.map(
                                    (role) => (
                                        <article
                                            key={
                                                role.id
                                            }
                                            className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                                        >
                                            <div className="flex items-start justify-between gap-3">

                                                <div>
                                                    <p className="text-base font-bold text-slate-900">
                                                        {role.name}
                                                    </p>

                                                    <p className="mt-1 text-[11px] font-semibold text-blue-600">
                                                        {role.type}
                                                    </p>
                                                </div>


                                                <StatusBadge
                                                    status="active"
                                                />

                                            </div>


                                            <p className="mt-4 min-h-[40px] text-xs leading-5 text-slate-500">
                                                {role.description}
                                            </p>


                                            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">

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


                                            <div className="mt-5 flex gap-2">

                                                <ActionButton
                                                    variant="secondary"
                                                    className="flex-1 justify-center"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/roles/${role.id}`
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </ActionButton>


                                                <ActionButton
                                                    variant="primary"
                                                    className="flex-1 justify-center"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/roles/${role.id}/edit`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </ActionButton>

                                            </div>

                                        </article>
                                    )
                                )}

                            </div>

                        </section>


                        {/* ================================================= */}
                        {/* PERMISSION MATRIX */}
                        {/* ================================================= */}

                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 p-5">
                                <h2 className="text-base font-bold text-slate-900">
                                    Permission Overview
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Current high-level access rules for each role.
                                </p>
                            </div>


                            <div className="overflow-x-auto">

                                <table className="min-w-[760px] w-full">

                                    <thead className="bg-slate-50">
                                        <tr className="text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">

                                            <th className="px-5 py-3">
                                                Permission
                                            </th>

                                            <th className="px-5 py-3 text-center">
                                                Administrator
                                            </th>

                                            <th className="px-5 py-3 text-center">
                                                Trainer
                                            </th>

                                            <th className="px-5 py-3 text-center">
                                                Trainee
                                            </th>

                                        </tr>
                                    </thead>


                                    <tbody className="divide-y divide-slate-100">

                                        {PERMISSION_MATRIX.map(
                                            (
                                                permission
                                            ) => (
                                                <tr
                                                    key={
                                                        permission.permission
                                                    }
                                                >
                                                    <td className="px-5 py-4">

                                                        <p className="text-xs font-semibold text-slate-800">
                                                            {permission.permission}
                                                        </p>


                                                        <p className="mt-1 text-[11px] text-slate-500">
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
                    </>
                )}

            </div>
        </DashboardLayout>
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
        <div>
            <p className="text-lg font-bold text-slate-800">
                {value}
            </p>

            <p className="text-[10px] text-slate-500">
                {label}
            </p>
        </div>
    );
}


// ======================================================
// PERMISSION CHECK
// ======================================================

function PermissionCell({
    allowed,
}) {
    return (
        <td className="px-5 py-4 text-center">

            <span
                className={`
                    inline-flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    text-xs
                    font-bold
                    ${allowed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }
                `}
            >
                {allowed
                    ? "✓"
                    : "×"}
            </span>

        </td>
    );
}


export default RolesPermissionsPage;