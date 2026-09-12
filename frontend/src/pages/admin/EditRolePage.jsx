import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";


const ROLE_CONFIG = {
    administrator: {
        name:
            "Administrator",

        description:
            "Full administrative access and control.",

        editable:
            false,

        permissions: [
            {
                id:
                    "view-users",
                label:
                    "View Users",
                enabled:
                    true,
            },
            {
                id:
                    "create-users",
                label:
                    "Create Users",
                enabled:
                    true,
            },
            {
                id:
                    "manage-users",
                label:
                    "Manage User Accounts",
                enabled:
                    true,
            },
            {
                id:
                    "reset-password",
                label:
                    "Reset User Passwords",
                enabled:
                    true,
            },
            {
                id:
                    "training-programmes",
                label:
                    "Manage Training Programmes",
                enabled:
                    true,
            },
            {
                id:
                    "learning-sections",
                label:
                    "Manage Learning Sections",
                enabled:
                    true,
            },
            {
                id:
                    "training-assignment",
                label:
                    "Assign Training",
                enabled:
                    true,
            },
            {
                id:
                    "audit-logs",
                label:
                    "View Audit Logs",
                enabled:
                    true,
            },
        ],
    },

    trainer: {
        name:
            "Trainer",

        description:
            "Manage assigned training programmes and learning content.",

        editable:
            true,

        permissions: [
            {
                id:
                    "trainer-dashboard",
                label:
                    "Access Trainer Dashboard",
                enabled:
                    true,
            },
            {
                id:
                    "manage-programmes",
                label:
                    "Manage Training Programmes",
                enabled:
                    true,
            },
            {
                id:
                    "manage-sections",
                label:
                    "Manage Learning Sections",
                enabled:
                    true,
            },
            {
                id:
                    "view-profile",
                label:
                    "View Own Profile",
                enabled:
                    true,
            },
            {
                id:
                    "change-password",
                label:
                    "Change Own Password",
                enabled:
                    true,
            },
        ],
    },

    trainee: {
        name:
            "Trainee",

        description:
            "Access assigned training and personal account information.",

        editable:
            false,

        permissions: [
            {
                id:
                    "trainee-dashboard",
                label:
                    "Access Trainee Dashboard",
                enabled:
                    true,
            },
            {
                id:
                    "assigned-training",
                label:
                    "View Assigned Training",
                enabled:
                    true,
            },
            {
                id:
                    "learning-content",
                label:
                    "View Learning Content",
                enabled:
                    true,
            },
            {
                id:
                    "view-profile",
                label:
                    "View Own Profile",
                enabled:
                    true,
            },
            {
                id:
                    "change-password",
                label:
                    "Change Own Password",
                enabled:
                    true,
            },
        ],
    },
};


function EditRolePage() {
    const navigate =
        useNavigate();

    const {
        roleName,
    } =
        useParams();

    const roleKey =
        String(
            roleName ||
            ""
        ).toLowerCase();

    const originalRole =
        ROLE_CONFIG[
        roleKey
        ];


    const initialPermissions =
        useMemo(
            () =>
                originalRole
                    ? originalRole.permissions.map(
                        (
                            permission
                        ) => ({
                            ...permission,
                        })
                    )
                    : [],
            [
                originalRole,
            ]
        );


    const [
        description,
        setDescription,
    ] = useState(
        originalRole?.description ||
        ""
    );

    const [
        permissions,
        setPermissions,
    ] = useState(
        initialPermissions
    );

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    if (
        !originalRole
    ) {
        return (
            <DashboardLayout
                role="admin"
                title="Role Not Found"
                subtitle="The requested role cannot be edited."
            >
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/roles"
                        )
                    }
                    className="
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-2
                        text-[9px]
                        font-semibold
                        text-white
                    "
                >
                    Back to Roles
                </button>
            </DashboardLayout>
        );
    }


    const handlePermissionChange = (
        permissionId
    ) => {
        if (
            !originalRole.editable
        ) {
            return;
        }

        setPermissions(
            (
                current
            ) =>
                current.map(
                    (
                        permission
                    ) =>
                        permission.id ===
                            permissionId
                            ? {
                                ...permission,

                                enabled:
                                    !permission.enabled,
                            }
                            : permission
                )
        );

        setSuccessMessage("");
    };


    const handleSubmit = (
        event
    ) => {
        event.preventDefault();

        /*
         * The current project uses the role definition as frontend
         * configuration. No backend permission-write route exists here,
         * so do not invent an API call.
         */

        setSuccessMessage(
            "Role settings updated in the current view."
        );
    };


    const enabledCount =
        permissions.filter(
            (
                permission
            ) =>
                permission.enabled
        ).length;


    return (
        <DashboardLayout
            role="admin"
            title={`Edit ${originalRole.name} Role`}
            subtitle="Review the role description and available permissions."
        >
            <form
                onSubmit={
                    handleSubmit
                }
                className="
                    space-y-4
                "
            >
                {successMessage && (
                    <div
                        className="
                            rounded-lg
                            border
                            border-emerald-200
                            bg-emerald-50
                            px-4
                            py-3
                            text-[9px]
                            font-medium
                            text-emerald-700
                        "
                    >
                        {successMessage}
                    </div>
                )}


                {!originalRole.editable && (
                    <div
                        className="
                            rounded-lg
                            border
                            border-amber-200
                            bg-amber-50
                            px-4
                            py-3
                        "
                    >
                        <p
                            className="
                                text-[8px]
                                font-medium
                                leading-5
                                text-amber-800
                            "
                        >
                            This role is fixed by the system and cannot be changed.
                        </p>
                    </div>
                )}


                {/* ROLE */}

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
                            Role Information
                        </h2>
                    </div>


                    <div
                        className="
                            p-4
                            sm:p-5
                        "
                    >
                        <label>
                            <span
                                className="
                                    mb-2
                                    block
                                    text-[8px]
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Role Name
                            </span>

                            <input
                                type="text"
                                value={
                                    originalRole.name
                                }
                                disabled
                                className="
                                    h-10
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-3
                                    text-[9px]
                                    font-semibold
                                    text-slate-600
                                "
                            />
                        </label>


                        <label
                            className="
                                mt-4
                                block
                            "
                        >
                            <span
                                className="
                                    mb-2
                                    block
                                    text-[8px]
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Description
                            </span>

                            <textarea
                                value={
                                    description
                                }
                                onChange={(
                                    event
                                ) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    !originalRole.editable
                                }
                                rows="4"
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-3
                                    text-[9px]
                                    font-medium
                                    leading-5
                                    text-slate-800
                                    outline-none
                                    focus:border-blue-500
                                    disabled:bg-slate-50
                                "
                            />
                        </label>
                    </div>
                </section>


                {/* PERMISSIONS */}

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
                            flex
                            items-center
                            justify-between
                            gap-3
                            border-b
                            border-slate-100
                            px-4
                            py-4
                            sm:px-5
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-[12px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                Permissions
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Select the actions available to this role.
                            </p>
                        </div>


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
                            {enabledCount}/
                            {permissions.length}
                        </span>
                    </div>


                    <div
                        className="
                            grid
                            gap-3
                            p-4
                            md:grid-cols-2
                            sm:p-5
                        "
                    >
                        {permissions.map(
                            (
                                permission
                            ) => (
                                <label
                                    key={
                                        permission.id
                                    }
                                    className={`
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        rounded-lg
                                        border
                                        p-4

                                        ${permission.enabled
                                            ? "border-blue-200 bg-blue-50"
                                            : "border-slate-200 bg-white"
                                        }

                                        ${originalRole.editable
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed"
                                        }
                                    `}
                                >
                                    <div>
                                        <p
                                            className="
                                                text-[9px]
                                                font-bold
                                                text-slate-800
                                            "
                                        >
                                            {permission.label}
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-[7px]
                                                font-medium
                                                text-slate-500
                                            "
                                        >
                                            {permission.enabled
                                                ? "Permission enabled"
                                                : "Permission disabled"}
                                        </p>
                                    </div>


                                    <input
                                        type="checkbox"
                                        checked={
                                            permission.enabled
                                        }
                                        disabled={
                                            !originalRole.editable
                                        }
                                        onChange={() =>
                                            handlePermissionChange(
                                                permission.id
                                            )
                                        }
                                        className="
                                            h-4
                                            w-4
                                            accent-blue-600
                                        "
                                    />
                                </label>
                            )
                        )}
                    </div>
                </section>


                {/* ACTIONS */}

                <div
                    className="
                        flex
                        flex-col-reverse
                        gap-2
                        sm:flex-row
                        sm:justify-end
                    "
                >
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/admin/roles/${roleKey}`
                            )
                        }
                        className="
                            min-h-[40px]
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-5
                            text-[9px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        Cancel
                    </button>


                    {originalRole.editable && (
                        <button
                            type="submit"
                            className="
                                min-h-[40px]
                                rounded-lg
                                bg-blue-600
                                px-5
                                text-[9px]
                                font-semibold
                                text-white
                                hover:bg-blue-700
                            "
                        >
                            Save Permissions
                        </button>
                    )}
                </div>
            </form>
        </DashboardLayout>
    );
}


export default EditRolePage;