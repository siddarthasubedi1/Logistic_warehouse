import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import ActionButton from "../../components/ui/ActionButton";
import EmptyState from "../../components/ui/EmptyState";
import FeedbackAlert from "../../components/ui/FeedbackAlert";


const ROLE_CONFIG = {
    administrator: {
        name:
            "Administrator",

        description:
            "Full system access and administrative control.",

        priority:
            1,

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
                    "manage-training",

                label:
                    "Manage Training",

                enabled:
                    true,
            },

            {
                id:
                    "assign-training",

                label:
                    "Assign Training",

                enabled:
                    true,
            },
        ],
    },


    trainer: {
        name:
            "Trainer",

        description:
            "Manage assigned and authorised training programmes.",

        priority:
            2,

        editable:
            true,

        permissions: [
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
                    "view-training",

                label:
                    "View Training",

                enabled:
                    true,
            },

            {
                id:
                    "manage-profile",

                label:
                    "Manage Own Profile",

                enabled:
                    true,
            },
        ],
    },


    trainee: {
        name:
            "Trainee",

        description:
            "Access assigned training programmes and learning content.",

        priority:
            3,

        editable:
            false,

        permissions: [
            {
                id:
                    "view-assigned-training",

                label:
                    "View Assigned Training",

                enabled:
                    true,
            },

            {
                id:
                    "view-learning-content",

                label:
                    "View Learning Content",

                enabled:
                    true,
            },

            {
                id:
                    "manage-profile",

                label:
                    "Manage Own Profile",

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
    } = useParams();


    const roleKey =
        String(
            roleName || ""
        ).toLowerCase();


    const originalRole =
        ROLE_CONFIG[roleKey];


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
        originalRole
            ?.description ||
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


    if (!originalRole) {
        return (
            <DashboardLayout
                role="admin"
                showHeader={false}
            >
                <EmptyState
                    title="Role not found."
                    description="The requested role cannot be edited."
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
            </DashboardLayout>
        );
    }


    // ======================================================
    // CHANGE PERMISSION
    // ======================================================

    const handlePermissionChange = (
        permissionId
    ) => {
        if (
            !originalRole.editable
        ) {
            return;
        }


        setSuccessMessage("");


        setPermissions(
            (current) =>
                current.map(
                    (permission) =>
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
    };


    // ======================================================
    // RESET
    // ======================================================

    const handleReset = () => {
        setDescription(
            originalRole.description
        );


        setPermissions(
            originalRole.permissions.map(
                (permission) => ({
                    ...permission,
                })
            )
        );


        setSuccessMessage("");
    };


    // ======================================================
    // SAVE
    // ======================================================
    //
    // Current project has no backend role-definition API.
    // Therefore this currently demonstrates the role UI only.
    // Do not call a fake API endpoint here.
    // ======================================================

    const handleSave = (
        event
    ) => {
        event.preventDefault();


        setSuccessMessage(
            "Role configuration updated in the current interface. Backend role-definition persistence has not been implemented yet."
        );
    };


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
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                            Edit Role
                        </p>


                        <h1 className="mt-1 text-2xl font-bold text-slate-900">
                            {originalRole.name}
                        </h1>


                        <p className="mt-1 text-xs text-slate-500">
                            Review the access configuration for this role.
                        </p>
                    </div>


                    <ActionButton
                        variant="secondary"
                        onClick={() =>
                            navigate(
                                `/admin/roles/${roleKey}`
                            )
                        }
                    >
                        ← Back
                    </ActionButton>

                </div>


                <FeedbackAlert
                    type="success"
                    message={
                        successMessage
                    }
                    onClose={() =>
                        setSuccessMessage(
                            ""
                        )
                    }
                />


                {!originalRole.editable && (
                    <FeedbackAlert
                        type="info"
                        message={`${originalRole.name} is treated as a fixed system role. Its access should be enforced by the backend rather than changed only from the frontend.`}
                    />
                )}


                {/* ================================================= */}
                {/* EDIT FORM */}
                {/* ================================================= */}

                <form
                    onSubmit={
                        handleSave
                    }
                    className="rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                    <div className="border-b border-slate-200 p-5">

                        <h2 className="text-base font-bold text-slate-900">
                            Role Information
                        </h2>

                    </div>


                    <div className="space-y-6 p-5">

                        {/* Role */}
                        <div className="grid gap-4 md:grid-cols-2">

                            <FormField
                                label="Role Name"
                            >
                                <input
                                    type="text"
                                    value={
                                        originalRole.name
                                    }
                                    readOnly
                                    className={`${inputClass} bg-slate-100`}
                                />
                            </FormField>


                            <FormField
                                label="Priority"
                            >
                                <input
                                    type="number"
                                    value={
                                        originalRole.priority
                                    }
                                    readOnly
                                    className={`${inputClass} bg-slate-100`}
                                />
                            </FormField>

                        </div>


                        <FormField
                            label="Description"
                        >
                            <textarea
                                rows="4"
                                value={
                                    description
                                }
                                disabled={
                                    !originalRole.editable
                                }
                                onChange={(
                                    event
                                ) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                className={inputClass}
                            />
                        </FormField>


                        {/* ================================================= */}
                        {/* PERMISSIONS */}
                        {/* ================================================= */}

                        <div className="border-t border-slate-100 pt-5">

                            <h3 className="text-sm font-bold text-slate-900">
                                Permissions
                            </h3>


                            <p className="mt-1 text-xs text-slate-500">
                                Enabled permissions for this role.
                            </p>


                            <div className="mt-4 grid gap-3 md:grid-cols-2">

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
                                                gap-3
                                                rounded-xl
                                                border
                                                p-4
                                                ${permission.enabled
                                                    ? "border-blue-300 bg-blue-50"
                                                    : "border-slate-200 bg-white"
                                                }
                                                ${originalRole.editable
                                                    ? "cursor-pointer"
                                                    : "cursor-not-allowed opacity-80"
                                                }
                                            `}
                                        >
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
                                                className="h-4 w-4 rounded border-slate-300 text-blue-600"
                                            />


                                            <span className="text-xs font-semibold text-slate-700">
                                                {permission.label}
                                            </span>

                                        </label>
                                    )
                                )}

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* ACTIONS */}
                        {/* ================================================= */}

                        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">

                            <ActionButton
                                variant="secondary"
                                type="button"
                                onClick={
                                    handleReset
                                }
                            >
                                Reset
                            </ActionButton>


                            <ActionButton
                                type="submit"
                                variant="primary"
                                disabled={
                                    !originalRole.editable
                                }
                            >
                                Save Changes
                            </ActionButton>

                        </div>

                    </div>

                </form>

            </div>
        </DashboardLayout>
    );
}


function FormField({
    label,
    children,
}) {
    return (
        <label className="block">

            <span className="text-xs font-semibold text-slate-700">
                {label}
            </span>


            <div className="mt-2">
                {children}
            </div>

        </label>
    );
}


const inputClass = `
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    py-2.5
    text-sm
    text-slate-800
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
    disabled:cursor-not-allowed
    disabled:bg-slate-100
`;


export default EditRolePage;