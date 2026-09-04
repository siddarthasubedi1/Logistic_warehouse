import {
    Fragment,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";


const roleData = {
    administrator: {
        name: "Administrator",
        type: "System Role",
        description:
            "Full system access and administrative control.",
        users: 1,
        priority: 1,
        status: "Active",
        createdOn: "System Default",

        history: [
            {
                id: 1,
                date: "3 Sep 2026, 8:30 PM",
                user: "System Administrator",
                action:
                    "Administrator role permissions reviewed.",
            },

            {
                id: 2,
                date: "1 Sep 2026, 10:15 AM",
                user: "System",
                action:
                    "Administrator role created.",
            },
        ],
    },


    trainer: {
        name: "Trainer",
        type: "Custom Role",
        description:
            "Manage assigned training modules and view trainee progress and performance.",
        users: 1,
        priority: 2,
        status: "Active",
        createdOn: "System Default",

        history: [
            {
                id: 1,
                date: "3 Sep 2026, 8:45 PM",
                user: "System Administrator",
                action:
                    "Trainer permissions updated.",
            },

            {
                id: 2,
                date: "2 Sep 2026, 6:20 PM",
                user: "System Administrator",
                action:
                    "Trainer access control reviewed.",
            },

            {
                id: 3,
                date: "1 Sep 2026, 10:15 AM",
                user: "System",
                action:
                    "Trainer role created.",
            },
        ],
    },


    trainee: {
        name: "Trainee",
        type: "System Role",
        description:
            "Access assigned training modules, complete activities and view personal progress.",
        users: 0,
        priority: 3,
        status: "Active",
        createdOn: "System Default",

        history: [
            {
                id: 1,
                date: "3 Sep 2026, 9:00 PM",
                user: "System Administrator",
                action:
                    "Trainee permissions reviewed.",
            },

            {
                id: 2,
                date: "1 Sep 2026, 10:15 AM",
                user: "System",
                action:
                    "Trainee role created.",
            },
        ],
    },
};


const rolePermissions = {
    administrator: [
        {
            module: "User Management",

            permissions: [
                {
                    name: "View Users",
                    description:
                        "View list of all users",
                    view: true,
                    create: false,
                    edit: false,
                    delete: false,
                },

                {
                    name: "Create User",
                    description:
                        "Create Trainer or Trainee account",
                    view: false,
                    create: true,
                    edit: false,
                    delete: false,
                },

                {
                    name: "Edit User",
                    description:
                        "Edit user information",
                    view: false,
                    create: false,
                    edit: true,
                    delete: false,
                },

                {
                    name: "Delete/Deactivate User",
                    description:
                        "Remove or deactivate users",
                    view: false,
                    create: false,
                    edit: false,
                    delete: true,
                },

                {
                    name: "Reset Password",
                    description:
                        "Reset user passwords",
                    view: false,
                    create: false,
                    edit: true,
                    delete: false,
                },
            ],
        },


        {
            module: "Training Management",

            permissions: [
                {
                    name: "Manage Training",
                    description:
                        "Create and manage training modules",
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
            ],
        },


        {
            module: "Profile",

            permissions: [
                {
                    name: "Manage Own Profile",
                    description:
                        "View and update own profile",
                    view: true,
                    create: false,
                    edit: true,
                    delete: false,
                },
            ],
        },
    ],


    trainer: [
        {
            module: "User Management",

            permissions: [
                {
                    name: "View Trainees",
                    description:
                        "View assigned trainee information",
                    view: true,
                    create: false,
                    edit: false,
                    delete: false,
                },

                {
                    name: "Create User",
                    description:
                        "Create Trainer or Trainee account",
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                },

                {
                    name: "Edit User",
                    description:
                        "Edit trainee task and score information",
                    view: false,
                    create: false,
                    edit: true,
                    delete: false,
                },

                {
                    name: "Delete/Deactivate User",
                    description:
                        "Remove or deactivate users",
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                },

                {
                    name: "Reset Password",
                    description:
                        "Reset user passwords",
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                },
            ],
        },


        {
            module: "Training Management",

            permissions: [
                {
                    name: "Manage Own Module",
                    description:
                        "Manage assigned training module",
                    view: true,
                    create: true,
                    edit: true,
                    delete: false,
                },

                {
                    name: "View Trainee Progress",
                    description:
                        "View trainee progress and scores",
                    view: true,
                    create: false,
                    edit: true,
                    delete: false,
                },
            ],
        },


        {
            module: "Profile",

            permissions: [
                {
                    name: "Manage Own Profile",
                    description:
                        "View and update own profile",
                    view: true,
                    create: false,
                    edit: true,
                    delete: false,
                },
            ],
        },
    ],


    trainee: [
        {
            module: "Training",

            permissions: [
                {
                    name: "View Assigned Training",
                    description:
                        "Access assigned training modules",
                    view: true,
                    create: false,
                    edit: false,
                    delete: false,
                },

                {
                    name: "Complete Training",
                    description:
                        "Complete quizzes and scenarios",
                    view: true,
                    create: false,
                    edit: true,
                    delete: false,
                },

                {
                    name: "View Own Progress",
                    description:
                        "View personal progress and scores",
                    view: true,
                    create: false,
                    edit: false,
                    delete: false,
                },
            ],
        },


        {
            module: "Profile",

            permissions: [
                {
                    name: "Manage Own Profile",
                    description:
                        "View and update own profile",
                    view: true,
                    create: false,
                    edit: true,
                    delete: false,
                },
            ],
        },
    ],
};


function PermissionStatus({
    allowed,
}) {
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


function RoleIcon({
    roleName,
}) {
    const styles = {
        Administrator:
            "bg-purple-500/20 text-purple-300",

        Trainer:
            "bg-blue-500/20 text-blue-300",

        Trainee:
            "bg-emerald-500/20 text-emerald-300",
    };


    return (
        <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${styles[roleName]
                }`}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-8 w-8"
            >
                <circle
                    cx="12"
                    cy="8"
                    r="3"
                />

                <path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6" />
            </svg>
        </div>
    );
}


function RoleDetailsPage() {
    const navigate =
        useNavigate();


    const {
        roleName,
    } = useParams();


    const roleKey =
        roleName?.toLowerCase();


    const role =
        roleData[roleKey];


    const groups =
        rolePermissions[
        roleKey
        ] || [];


    const [
        search,
        setSearch,
    ] = useState("");


    const [
        expandedModules,
        setExpandedModules,
    ] = useState(() =>
        groups.reduce(
            (
                result,
                group
            ) => ({
                ...result,
                [group.module]:
                    true,
            }),
            {}
        )
    );


    const permissionCount =
        useMemo(() => {

            return groups.reduce(
                (
                    total,
                    group
                ) =>
                    total +
                    group.permissions
                        .length,
                0
            );

        }, [
            groups,
        ]);


    const toggleModule = (
        moduleName
    ) => {

        setExpandedModules(
            (current) => ({
                ...current,

                [moduleName]:
                    !current[
                    moduleName
                    ],
            })
        );
    };


    if (!role) {
        return (
            <DashboardLayout
                role="admin"
                showHeader={false}
            >
                <main className="min-h-screen bg-[#071523] p-8 text-white">

                    <h1 className="text-2xl font-bold">
                        Role not found
                    </h1>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/roles"
                            )
                        }
                        className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold"
                    >
                        Back to Roles
                    </button>

                </main>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >
            <main className="min-h-screen bg-[#071523] px-6 py-6 text-white">

                {/* HEADER */}

                <div className="mb-6">

                    <h1 className="text-2xl font-bold">
                        View Role Details –{" "}
                        {role.name}
                    </h1>


                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin"
                                )
                            }
                            className="text-blue-400 hover:text-blue-300"
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
                            className="text-blue-400 hover:text-blue-300"
                        >
                            User Management
                        </button>


                        <span>
                            ›
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/roles"
                                )
                            }
                            className="text-blue-400 hover:text-blue-300"
                        >
                            Roles & Permissions
                        </button>


                        <span>
                            ›
                        </span>


                        <span>
                            {role.name}
                        </span>

                    </div>

                </div>


                {/* ROLE INFORMATION */}

                <section className="rounded-xl border border-white/10 bg-[#0b1d2d] p-5 shadow-xl">

                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

                        <h2 className="font-semibold">
                            Role Information
                        </h2>


                        <div className="flex flex-wrap gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/admin/roles"
                                    )
                                }
                                className="rounded-lg border border-white/10 bg-[#071523] px-4 py-2 text-xs text-slate-300 hover:bg-white/5"
                            >
                                Back to Roles
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/admin/roles/${roleKey}/edit`
                                    )
                                }
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                            >
                                ✎ Edit Role
                            </button>

                        </div>

                    </div>


                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                        <RoleIcon
                            roleName={
                                role.name
                            }
                        />


                        <div className="flex-1">

                            <div className="flex flex-wrap items-center gap-3">

                                <h3 className="text-lg font-semibold">
                                    {
                                        role.name
                                    }
                                </h3>


                                <span className="rounded bg-blue-500/20 px-2 py-1 text-[10px] text-blue-300">
                                    {
                                        role.type
                                    }
                                </span>

                            </div>


                            <p className="mt-2 text-sm text-slate-400">
                                {
                                    role.description
                                }
                            </p>


                            <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">

                                <div>
                                    <p className="text-[10px] uppercase tracking-wide text-slate-500">
                                        Status
                                    </p>

                                    <span className="mt-2 inline-block rounded bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
                                        {
                                            role.status
                                        }
                                    </span>
                                </div>


                                <div>
                                    <p className="text-[10px] uppercase tracking-wide text-slate-500">
                                        Users
                                    </p>

                                    <p className="mt-2 text-sm font-semibold">
                                        {
                                            role.users
                                        }
                                    </p>
                                </div>


                                <div>
                                    <p className="text-[10px] uppercase tracking-wide text-slate-500">
                                        Permissions
                                    </p>

                                    <p className="mt-2 text-sm font-semibold">
                                        {
                                            permissionCount
                                        }
                                    </p>
                                </div>


                                <div>
                                    <p className="text-[10px] uppercase tracking-wide text-slate-500">
                                        Priority
                                    </p>

                                    <p className="mt-2 text-sm font-semibold">
                                        {
                                            role.priority
                                        }
                                    </p>
                                </div>


                                <div>
                                    <p className="text-[10px] uppercase tracking-wide text-slate-500">
                                        Created On
                                    </p>

                                    <p className="mt-2 text-sm font-semibold">
                                        {
                                            role.createdOn
                                        }
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* MAIN CONTENT */}

                <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_280px]">

                    {/* PERMISSIONS */}

                    <section className="rounded-xl border border-white/10 bg-[#0b1d2d] p-5 shadow-xl">

                        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

                            <div>

                                <h2 className="font-semibold">
                                    Permissions (
                                    {
                                        permissionCount
                                    }
                                    )
                                </h2>


                                <p className="mt-1 text-xs text-slate-400">
                                    View what this role can access and modify.
                                </p>

                            </div>


                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search permission..."
                                className="w-full rounded-lg border border-white/10 bg-[#071523] px-4 py-2.5 text-xs text-white outline-none placeholder:text-slate-500 focus:border-blue-500 sm:w-[250px]"
                            />

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
                                            View
                                        </th>

                                        <th className="px-4 py-3 text-center font-medium">
                                            Create
                                        </th>

                                        <th className="px-4 py-3 text-center font-medium">
                                            Edit
                                        </th>

                                        <th className="px-4 py-3 text-center font-medium">
                                            Delete
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {groups.map(
                                        (
                                            group
                                        ) => {

                                            const filteredPermissions =
                                                group.permissions.filter(
                                                    (
                                                        permission
                                                    ) => {

                                                        const value =
                                                            `${permission.name} ${permission.description}`
                                                                .toLowerCase();


                                                        return value.includes(
                                                            search.toLowerCase()
                                                        );
                                                    }
                                                );


                                            if (
                                                filteredPermissions.length ===
                                                0
                                            ) {
                                                return null;
                                            }


                                            return (
                                                <Fragment
                                                    key={
                                                        group.module
                                                    }
                                                >

                                                    {/* MODULE */}

                                                    <tr className="border-t border-white/10 bg-[#13283a]">

                                                        <td
                                                            colSpan="6"
                                                            className="px-4 py-3"
                                                        >

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleModule(
                                                                        group.module
                                                                    )
                                                                }
                                                                className="flex w-full items-center justify-between"
                                                            >

                                                                <span className="font-semibold text-blue-300">
                                                                    {
                                                                        group.module
                                                                    }
                                                                </span>


                                                                <span className="text-slate-400">
                                                                    {expandedModules[
                                                                        group
                                                                            .module
                                                                    ]
                                                                        ? "⌃"
                                                                        : "⌄"}
                                                                </span>

                                                            </button>

                                                        </td>

                                                    </tr>


                                                    {/* PERMISSIONS */}

                                                    {expandedModules[
                                                        group
                                                            .module
                                                    ] &&
                                                        filteredPermissions.map(
                                                            (
                                                                permission
                                                            ) => (
                                                                <tr
                                                                    key={
                                                                        permission.name
                                                                    }
                                                                    className="border-t border-white/10 bg-[#0b1d2d] transition hover:bg-white/[0.02]"
                                                                >

                                                                    <td className="px-4 py-3 font-medium">
                                                                        {
                                                                            permission.name
                                                                        }
                                                                    </td>


                                                                    <td className="px-4 py-3 text-slate-400">
                                                                        {
                                                                            permission.description
                                                                        }
                                                                    </td>


                                                                    <td className="px-4 py-3">
                                                                        <PermissionStatus
                                                                            allowed={
                                                                                permission.view
                                                                            }
                                                                        />
                                                                    </td>


                                                                    <td className="px-4 py-3">
                                                                        <PermissionStatus
                                                                            allowed={
                                                                                permission.create
                                                                            }
                                                                        />
                                                                    </td>


                                                                    <td className="px-4 py-3">
                                                                        <PermissionStatus
                                                                            allowed={
                                                                                permission.edit
                                                                            }
                                                                        />
                                                                    </td>


                                                                    <td className="px-4 py-3">
                                                                        <PermissionStatus
                                                                            allowed={
                                                                                permission.delete
                                                                            }
                                                                        />
                                                                    </td>

                                                                </tr>
                                                            )
                                                        )}

                                                </Fragment>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </section>


                    {/* CHANGE HISTORY */}

                    <aside className="rounded-xl border border-white/10 bg-[#0b1d2d] p-5 shadow-xl">

                        <div className="mb-5 flex items-center gap-2">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5 text-slate-300"
                            >
                                <path d="M3 12a9 9 0 1 0 3-6.7" />

                                <path d="M3 4v6h6" />

                                <path d="M12 7v5l3 2" />
                            </svg>


                            <h2 className="font-semibold">
                                Change History
                            </h2>

                        </div>


                        <div className="space-y-0">

                            {role.history.map(
                                (
                                    history,
                                    index
                                ) => (
                                    <div
                                        key={
                                            history.id
                                        }
                                        className="relative flex gap-3 pb-6"
                                    >

                                        {/* LINE */}

                                        {index !==
                                            role
                                                .history
                                                .length -
                                            1 && (
                                                <div className="absolute left-[5px] top-3 h-full w-px bg-slate-700" />
                                            )}


                                        {/* DOT */}

                                        <div className="relative z-10 mt-1 h-[11px] w-[11px] shrink-0 rounded-full bg-blue-500" />


                                        <div>

                                            <p className="text-[10px] text-blue-400">
                                                {
                                                    history.date
                                                }
                                            </p>


                                            <p className="mt-2 text-xs font-medium text-white">
                                                {
                                                    history.user
                                                }
                                            </p>


                                            <p className="mt-1 text-xs leading-5 text-slate-400">
                                                {
                                                    history.action
                                                }
                                            </p>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    </aside>

                </div>

            </main>
        </DashboardLayout>
    );
}


export default RoleDetailsPage;