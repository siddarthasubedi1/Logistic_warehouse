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


const roleConfig = {
    administrator: {
        name: "Administrator",
        type: "System Role",
        description:
            "Full system access and administrative control.",
        status: true,
        priority: 1,
    },

    trainer: {
        name: "Trainer",
        type: "Custom Role",
        description:
            "Manage assigned training modules and view trainee progress and performance.",
        status: true,
        priority: 2,
    },

    trainee: {
        name: "Trainee",
        type: "System Role",
        description:
            "Access assigned training modules, complete activities, and view personal progress.",
        status: true,
        priority: 3,
    },
};


const defaultPermissions = {
    administrator: [
        {
            module: "User Management",
            permissions: [
                {
                    id: "view-users",
                    name: "View Users",
                    description:
                        "View list of all users",
                    view: true,
                    create: false,
                    edit: false,
                    delete: false,
                },

                {
                    id: "create-user",
                    name: "Create User",
                    description:
                        "Add new Trainer or Trainee",
                    view: false,
                    create: true,
                    edit: false,
                    delete: false,
                },

                {
                    id: "edit-user",
                    name: "Edit User",
                    description:
                        "Edit user information",
                    view: false,
                    create: false,
                    edit: true,
                    delete: false,
                },

                {
                    id: "delete-user",
                    name: "Delete/Deactivate User",
                    description:
                        "Remove or deactivate users",
                    view: false,
                    create: false,
                    edit: false,
                    delete: true,
                },

                {
                    id: "reset-password",
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
                    id: "manage-training",
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
                    id: "manage-profile",
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
                    id: "view-users",
                    name: "View Users",
                    description:
                        "View assigned trainee information",
                    view: true,
                    create: false,
                    edit: false,
                    delete: false,
                },

                {
                    id: "create-user",
                    name: "Create User",
                    description:
                        "Add new Trainer or Trainee",
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                },

                {
                    id: "edit-user",
                    name: "Edit User",
                    description:
                        "Edit trainee task and score information",
                    view: false,
                    create: false,
                    edit: true,
                    delete: false,
                },

                {
                    id: "delete-user",
                    name: "Delete/Deactivate User",
                    description:
                        "Remove or deactivate users",
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                },

                {
                    id: "reset-password",
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
                    id: "manage-own-module",
                    name: "Manage Own Module",
                    description:
                        "Manage assigned training module",
                    view: true,
                    create: true,
                    edit: true,
                    delete: false,
                },

                {
                    id: "view-trainee-progress",
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
                    id: "manage-profile",
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
                    id: "view-training",
                    name: "View Assigned Training",
                    description:
                        "Access assigned training modules",
                    view: true,
                    create: false,
                    edit: false,
                    delete: false,
                },

                {
                    id: "complete-training",
                    name: "Complete Training",
                    description:
                        "Complete quizzes and scenarios",
                    view: true,
                    create: false,
                    edit: true,
                    delete: false,
                },

                {
                    id: "view-progress",
                    name: "View Own Progress",
                    description:
                        "View personal training progress and scores",
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
                    id: "manage-profile",
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


function EditRolePage() {
    const navigate = useNavigate();

    const {
        roleName,
    } = useParams();


    const roleKey =
        roleName?.toLowerCase();


    const originalRole =
        roleConfig[roleKey];


    const initialPermissions =
        useMemo(
            () =>
                JSON.parse(
                    JSON.stringify(
                        defaultPermissions[
                        roleKey
                        ] || []
                    )
                ),
            [roleKey]
        );


    const [
        roleNameValue,
        setRoleNameValue,
    ] = useState(
        originalRole?.name || ""
    );


    const [
        description,
        setDescription,
    ] = useState(
        originalRole?.description || ""
    );


    const [
        status,
        setStatus,
    ] = useState(
        originalRole?.status ?? true
    );


    const [
        priority,
        setPriority,
    ] = useState(
        originalRole?.priority || 1
    );


    const [
        permissions,
        setPermissions,
    ] = useState(
        initialPermissions
    );


    const [
        search,
        setSearch,
    ] = useState("");


    const [
        message,
        setMessage,
    ] = useState("");


    if (!originalRole) {
        return (
            <DashboardLayout
                role="admin"
                showHeader={false}
            >
                <div className="min-h-screen bg-[#071523] p-8 text-white">

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
                        className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                    >
                        Back to Roles
                    </button>

                </div>
            </DashboardLayout>
        );
    }


    const handlePermissionChange = (
        moduleIndex,
        permissionIndex,
        field
    ) => {

        setPermissions(
            (currentPermissions) =>
                currentPermissions.map(
                    (
                        module,
                        currentModuleIndex
                    ) => {

                        if (
                            currentModuleIndex !==
                            moduleIndex
                        ) {
                            return module;
                        }


                        return {
                            ...module,

                            permissions:
                                module.permissions.map(
                                    (
                                        permission,
                                        currentPermissionIndex
                                    ) => {

                                        if (
                                            currentPermissionIndex !==
                                            permissionIndex
                                        ) {
                                            return permission;
                                        }


                                        return {
                                            ...permission,

                                            [field]:
                                                !permission[
                                                field
                                                ],
                                        };
                                    }
                                ),
                        };
                    }
                )
        );
    };


    const handleReset = () => {

        setRoleNameValue(
            originalRole.name
        );

        setDescription(
            originalRole.description
        );

        setStatus(
            originalRole.status
        );

        setPriority(
            originalRole.priority
        );

        setPermissions(
            JSON.parse(
                JSON.stringify(
                    defaultPermissions[
                    roleKey
                    ]
                )
            )
        );

        setMessage("");
    };


    const handleSave = () => {

        setMessage(
            "Role changes saved successfully."
        );


        setTimeout(
            () => {
                navigate(
                    `/admin/roles/${roleKey}`
                );
            },
            800
        );
    };


    const filteredPermissions =
        permissions.map(
            (module) => {

                const filtered =
                    module.permissions.filter(
                        (permission) => {

                            const value =
                                `${permission.name} ${permission.description}`
                                    .toLowerCase();


                            return value.includes(
                                search.toLowerCase()
                            );
                        }
                    );


                return {
                    ...module,

                    permissions:
                        filtered,
                };
            }
        );


    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >
            <main className="min-h-screen bg-[#071523] px-6 py-6 text-white">

                {/* HEADER */}

                <div className="mb-6">

                    <h1 className="text-2xl font-bold">
                        Edit Role
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
                            Edit Role
                        </span>

                    </div>

                </div>


                {/* ROLE INFORMATION */}

                <section className="rounded-xl border border-white/10 bg-[#0b1d2d] p-5 shadow-xl">

                    <h2 className="mb-5 font-semibold">
                        Role Information
                    </h2>


                    <div className="grid gap-6 lg:grid-cols-2">

                        {/* LEFT */}

                        <div>

                            <label className="mb-2 block text-xs font-medium text-slate-300">
                                Role Name
                                <span className="ml-1 text-red-400">
                                    *
                                </span>
                            </label>


                            <input
                                type="text"
                                value={
                                    roleNameValue
                                }
                                onChange={(
                                    event
                                ) =>
                                    setRoleNameValue(
                                        event.target
                                            .value
                                    )
                                }
                                disabled={
                                    roleKey ===
                                    "administrator"
                                }
                                className="w-full rounded-lg border border-white/10 bg-[#071523] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                            />


                            <label className="mb-2 mt-5 block text-xs font-medium text-slate-300">
                                Description
                            </label>


                            <textarea
                                value={
                                    description
                                }
                                onChange={(
                                    event
                                ) =>
                                    setDescription(
                                        event.target
                                            .value
                                    )
                                }
                                rows="4"
                                className="w-full resize-none rounded-lg border border-white/10 bg-[#071523] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                            />

                        </div>


                        {/* RIGHT */}

                        <div>

                            <label className="mb-2 block text-xs font-medium text-slate-300">
                                Role Type
                            </label>


                            <div className="flex h-[46px] items-center rounded-lg border border-white/10 bg-[#071523] px-4">

                                <span className="rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
                                    {
                                        originalRole.type
                                    }
                                </span>

                            </div>


                            <label className="mb-2 mt-5 block text-xs font-medium text-slate-300">
                                Status
                            </label>


                            <button
                                type="button"
                                onClick={() =>
                                    setStatus(
                                        (current) =>
                                            !current
                                    )
                                }
                                className="flex h-[46px] w-full items-center justify-between rounded-lg border border-white/10 bg-[#071523] px-4"
                            >

                                <div className="flex items-center gap-3">

                                    <span
                                        className={`relative h-5 w-9 rounded-full transition ${status
                                            ? "bg-emerald-500"
                                            : "bg-slate-600"
                                            }`}
                                    >

                                        <span
                                            className={`absolute top-[2px] h-4 w-4 rounded-full bg-white transition ${status
                                                ? "left-[18px]"
                                                : "left-[2px]"
                                                }`}
                                        />

                                    </span>


                                    <span className="text-sm text-slate-300">
                                        {status
                                            ? "Active"
                                            : "Inactive"}
                                    </span>

                                </div>

                            </button>


                            <label className="mb-2 mt-5 block text-xs font-medium text-slate-300">
                                Priority
                            </label>


                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={
                                    priority
                                }
                                onChange={(
                                    event
                                ) =>
                                    setPriority(
                                        event.target
                                            .value
                                    )
                                }
                                className="w-full rounded-lg border border-white/10 bg-[#071523] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                            />

                        </div>

                    </div>

                </section>


                {/* PERMISSIONS */}

                <section className="mt-6 rounded-xl border border-white/10 bg-[#0b1d2d] p-5 shadow-xl">

                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

                        <div>

                            <h2 className="font-semibold">
                                Permissions
                            </h2>


                            <p className="mt-1 text-xs text-slate-400">
                                Select the permissions this role should have.
                            </p>

                        </div>


                        <input
                            type="text"
                            value={search}
                            onChange={(
                                event
                            ) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search permission..."
                            className="w-full rounded-lg border border-white/10 bg-[#071523] px-4 py-2.5 text-xs text-white outline-none placeholder:text-slate-500 focus:border-blue-500 sm:w-[260px]"
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

                                {filteredPermissions.map(
                                    (
                                        module,
                                        moduleIndex
                                    ) => {

                                        if (
                                            module
                                                .permissions
                                                .length === 0
                                        ) {
                                            return null;
                                        }


                                        return (
                                            <Fragment
                                                key={
                                                    module.module
                                                }
                                            >

                                                <tr className="border-t border-white/10 bg-[#13283a]">

                                                    <td
                                                        colSpan="6"
                                                        className="px-4 py-3 font-semibold text-blue-300"
                                                    >
                                                        {
                                                            module.module
                                                        }
                                                    </td>

                                                </tr>


                                                {module.permissions.map(
                                                    (
                                                        permission
                                                    ) => {

                                                        const originalPermissionIndex =
                                                            permissions[
                                                                moduleIndex
                                                            ].permissions.findIndex(
                                                                (
                                                                    item
                                                                ) =>
                                                                    item.id ===
                                                                    permission.id
                                                            );


                                                        return (
                                                            <tr
                                                                key={
                                                                    permission.id
                                                                }
                                                                className="border-t border-white/10 bg-[#0b1d2d]"
                                                            >

                                                                <td className="px-4 py-3 font-medium text-white">
                                                                    {
                                                                        permission.name
                                                                    }
                                                                </td>


                                                                <td className="px-4 py-3 text-slate-400">
                                                                    {
                                                                        permission.description
                                                                    }
                                                                </td>


                                                                {[
                                                                    "view",
                                                                    "create",
                                                                    "edit",
                                                                    "delete",
                                                                ].map(
                                                                    (
                                                                        field
                                                                    ) => (
                                                                        <td
                                                                            key={
                                                                                field
                                                                            }
                                                                            className="px-4 py-3"
                                                                        >

                                                                            <div className="flex justify-center">

                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        permission[
                                                                                        field
                                                                                        ]
                                                                                    }
                                                                                    onChange={() =>
                                                                                        handlePermissionChange(
                                                                                            moduleIndex,
                                                                                            originalPermissionIndex,
                                                                                            field
                                                                                        )
                                                                                    }
                                                                                    className="h-4 w-4 cursor-pointer accent-blue-600"
                                                                                />

                                                                            </div>

                                                                        </td>
                                                                    )
                                                                )}

                                                            </tr>
                                                        );
                                                    }
                                                )}

                                            </Fragment>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>


                {/* SUCCESS MESSAGE */}

                {message && (
                    <div className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                        {message}
                    </div>
                )}


                {/* ACTION BUTTONS */}

                <div className="mt-6 flex flex-wrap justify-end gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/admin/roles/${roleKey}`
                            )
                        }
                        className="rounded-lg border border-white/10 bg-[#102536] px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        onClick={
                            handleReset
                        }
                        className="rounded-lg border border-white/10 bg-[#102536] px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
                    >
                        Reset Changes
                    </button>


                    <button
                        type="button"
                        onClick={
                            handleSave
                        }
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                        <span>
                            ✓
                        </span>

                        Save Changes
                    </button>

                </div>

            </main>
        </DashboardLayout>
    );
}


export default EditRolePage;