import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";


const roles = [
    {
        id: "administrator",
        name: "Administrator",
        type: "System Role",
        description:
            "Full system access and administrative control.",
        users: 1,
        permissions: 10,
        iconStyle:
            "bg-purple-500/20 text-purple-300",
    },

    {
        id: "trainer",
        name: "Trainer",
        type: "Custom Role",
        description:
            "Manage assigned training modules and trainee progress.",
        users: 1,
        permissions: 6,
        iconStyle:
            "bg-blue-500/20 text-blue-300",
    },

    {
        id: "trainee",
        name: "Trainee",
        type: "System Role",
        description:
            "Access assigned training and complete tasks.",
        users: 1,
        permissions: 3,
        iconStyle:
            "bg-emerald-500/20 text-emerald-300",
    },
];


const permissions = [
    {
        category: "User Management",
        permission: "View Users",
        description: "View list of users",
        admin: true,
        trainer: false,
        trainee: false,
    },

    {
        category: "User Management",
        permission: "Create User",
        description:
            "Create Trainer or Trainee accounts",
        admin: true,
        trainer: false,
        trainee: false,
    },

    {
        category: "User Management",
        permission: "Edit User",
        description: "Edit user information",
        admin: true,
        trainer: false,
        trainee: false,
    },

    {
        category: "User Management",
        permission: "Deactivate User",
        description:
            "Deactivate or reactivate user accounts",
        admin: true,
        trainer: false,
        trainee: false,
    },

    {
        category: "User Management",
        permission: "Delete User",
        description:
            "Permanently remove user accounts",
        admin: true,
        trainer: false,
        trainee: false,
    },

    {
        category: "User Management",
        permission: "Reset Password",
        description:
            "Reset Trainer or Trainee passwords",
        admin: true,
        trainer: false,
        trainee: false,
    },

    {
        category: "Training Management",
        permission: "Manage Training",
        description:
            "Create and manage training modules",
        admin: true,
        trainer: true,
        trainee: false,
    },

    {
        category: "Training Management",
        permission: "View Training",
        description:
            "View assigned training modules",
        admin: true,
        trainer: true,
        trainee: true,
    },

    {
        category: "Progress",
        permission: "View Trainee Progress",
        description:
            "View trainee progress and scores",
        admin: true,
        trainer: true,
        trainee: false,
    },

    {
        category: "Profile",
        permission: "Manage Own Profile",
        description:
            "View and update own profile",
        admin: true,
        trainer: true,
        trainee: true,
    },
];


function PermissionIcon({ allowed }) {
    if (allowed) {
        return (
            <div className="flex justify-center">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">
                    ✓
                </span>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                ×
            </span>
        </div>
    );
}


function RoleIcon({ role }) {
    return (
        <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${role.iconStyle}`}
        >
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

                <path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6" />

                <path d="M18 4v5" />

                <path d="M15.5 6.5h5" />
            </svg>
        </div>
    );
}


function RolesPermissionsPage() {
    const navigate = useNavigate();


    const handleViewDetails = (
        roleId
    ) => {
        navigate(
            `/admin/roles/${roleId}`
        );
    };


    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >
            <main className="min-h-screen bg-[#071523] px-6 py-6 text-white">

                {/* PAGE HEADER */}

                <div className="mb-6">

                    <h1 className="text-2xl font-bold">
                        Roles & Permissions
                    </h1>


                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin"
                                )
                            }
                            className="text-blue-400 transition hover:text-blue-300"
                        >
                            Dashboard
                        </button>


                        <span>
                            ›
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/users"
                                )
                            }
                            className="text-blue-400 transition hover:text-blue-300"
                        >
                            User Management
                        </button>


                        <span>
                            ›
                        </span>


                        <span>
                            Roles & Permissions
                        </span>

                    </div>

                </div>


                {/* SYSTEM ROLES */}

                <section className="rounded-xl border border-white/10 bg-[#0b1d2d] p-5 shadow-xl">

                    <div className="mb-5">

                        <h2 className="text-base font-semibold">
                            System Roles
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Manage user roles and their permissions.
                        </p>

                    </div>


                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                        {roles.map(
                            (role) => (
                                <article
                                    key={
                                        role.id
                                    }
                                    className="rounded-xl border border-white/10 bg-[#102536] p-4 transition duration-200 hover:-translate-y-[1px] hover:border-blue-500/40"
                                >

                                    {/* ROLE TOP */}

                                    <div className="flex items-start gap-3">

                                        <RoleIcon
                                            role={
                                                role
                                            }
                                        />


                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <h3 className="font-semibold text-white">
                                                    {
                                                        role.name
                                                    }
                                                </h3>


                                                <span className="rounded bg-blue-500/20 px-2 py-[2px] text-[10px] text-blue-300">
                                                    {
                                                        role.type
                                                    }
                                                </span>

                                            </div>


                                            <p className="mt-2 min-h-[40px] text-xs leading-5 text-slate-400">
                                                {
                                                    role.description
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* ROLE INFORMATION */}

                                    <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-xs">

                                        <div className="flex items-center justify-between">

                                            <span className="text-slate-400">
                                                Users
                                            </span>

                                            <span className="font-semibold text-white">
                                                {
                                                    role.users
                                                }
                                            </span>

                                        </div>


                                        <div className="flex items-center justify-between">

                                            <span className="text-slate-400">
                                                Permissions
                                            </span>

                                            <span className="font-semibold text-white">
                                                {
                                                    role.permissions
                                                }
                                            </span>

                                        </div>


                                        <div className="flex items-center justify-between">

                                            <span className="text-slate-400">
                                                Status
                                            </span>

                                            <span className="rounded bg-emerald-500/20 px-2 py-[2px] text-emerald-300">
                                                Active
                                            </span>

                                        </div>

                                    </div>


                                    {/* VIEW DETAILS */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewDetails(
                                                role.id
                                            )
                                        }
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-500/30 px-4 py-2.5 text-xs font-semibold text-blue-300 transition hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-200"
                                    >
                                        View Details

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="h-4 w-4"
                                        >
                                            <path d="m9 18 6-6-6-6" />
                                        </svg>

                                    </button>

                                </article>
                            )
                        )}

                    </div>

                </section>


                {/* PERMISSIONS OVERVIEW */}

                <section className="mt-6 rounded-xl border border-white/10 bg-[#0b1d2d] p-5 shadow-xl">

                    <div className="mb-5">

                        <h2 className="text-base font-semibold">
                            Permissions Overview
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            View what each role can access and modify.
                        </p>

                    </div>


                    <div className="overflow-x-auto rounded-lg border border-white/10">

                        <table className="min-w-full text-left text-xs">

                            <thead className="bg-[#102536] text-slate-300">

                                <tr>

                                    <th className="px-4 py-3 font-medium">
                                        Permission
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Description
                                    </th>

                                    <th className="px-4 py-3 text-center font-medium">
                                        Administrator
                                    </th>

                                    <th className="px-4 py-3 text-center font-medium">
                                        Trainer
                                    </th>

                                    <th className="px-4 py-3 text-center font-medium">
                                        Trainee
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {permissions.map(
                                    (
                                        permission,
                                        index
                                    ) => (
                                        <tr
                                            key={`${permission.category}-${permission.permission}`}
                                            className={`border-t border-white/10 ${index %
                                                    2 ===
                                                    0
                                                    ? "bg-[#0b1d2d]"
                                                    : "bg-[#0d2132]"
                                                }`}
                                        >

                                            <td className="px-4 py-3">

                                                <p className="font-medium text-white">
                                                    {
                                                        permission.permission
                                                    }
                                                </p>


                                                <p className="mt-1 text-[10px] text-blue-300">
                                                    {
                                                        permission.category
                                                    }
                                                </p>

                                            </td>


                                            <td className="px-4 py-3 text-slate-400">
                                                {
                                                    permission.description
                                                }
                                            </td>


                                            <td className="px-4 py-3">

                                                <PermissionIcon
                                                    allowed={
                                                        permission.admin
                                                    }
                                                />

                                            </td>


                                            <td className="px-4 py-3">

                                                <PermissionIcon
                                                    allowed={
                                                        permission.trainer
                                                    }
                                                />

                                            </td>


                                            <td className="px-4 py-3">

                                                <PermissionIcon
                                                    allowed={
                                                        permission.trainee
                                                    }
                                                />

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </main>
        </DashboardLayout>
    );
}


export default RolesPermissionsPage;