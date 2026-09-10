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

                description:
                    "View Trainer and Trainee accounts.",

                enabled:
                    true,
            },

            {
                id:
                    "create-users",

                label:
                    "Create Users",

                description:
                    "Create Trainer and Trainee user accounts.",

                enabled:
                    true,
            },

            {
                id:
                    "manage-users",

                label:
                    "Manage User Accounts",

                description:
                    "Edit, deactivate, reactivate and remove accounts.",

                enabled:
                    true,
            },

            {
                id:
                    "manage-training",

                label:
                    "Manage Training",

                description:
                    "Manage workplace safety training programmes and content.",

                enabled:
                    true,
            },

            {
                id:
                    "assign-training",

                label:
                    "Assign Training",

                description:
                    "Assign appropriate programmes to Trainees.",

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

                description:
                    "Manage owned or authorised safety training programmes.",

                enabled:
                    true,
            },

            {
                id:
                    "manage-sections",

                label:
                    "Manage Learning Sections",

                description:
                    "Create and update programme learning content.",

                enabled:
                    true,
            },

            {
                id:
                    "view-training",

                label:
                    "View Training",

                description:
                    "View workplace safety training available to the Trainer.",

                enabled:
                    true,
            },

            {
                id:
                    "manage-profile",

                label:
                    "Manage Own Profile",

                description:
                    "Access personal Trainer account information.",

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

                description:
                    "View workplace safety programmes assigned by an Administrator.",

                enabled:
                    true,
            },

            {
                id:
                    "view-learning-content",

                label:
                    "View Learning Content",

                description:
                    "Open learning sections within assigned programmes.",

                enabled:
                    true,
            },

            {
                id:
                    "manage-profile",

                label:
                    "Manage Own Profile",

                description:
                    "Access personal Trainee account information.",

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


    // ======================================================
    // ROLE NOT FOUND
    // ======================================================

    if (
        !originalRole
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

                </div>

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


        setSuccessMessage(
            ""
        );


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
                (
                    permission
                ) => ({
                    ...permission,
                })
            )
        );


        setSuccessMessage(
            ""
        );
    };


    // ======================================================
    // SAVE
    //
    // No backend role-definition API currently exists.
    // Keep this frontend-only.
    // ======================================================

    const handleSave = (
        event
    ) => {
        event.preventDefault();


        setSuccessMessage(
            "Role configuration updated in the current interface. Backend role-definition persistence has not been implemented yet."
        );
    };


    // ======================================================
    // ENABLED COUNT
    // ======================================================

    const enabledPermissions =
        permissions.filter(
            (
                permission
            ) =>
                permission.enabled
        ).length;


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
                    className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-200
                        bg-gradient-to-r
                        from-[#073763]
                        via-[#0b4f87]
                        to-[#1769aa]
                        px-5
                        py-6
                        text-white
                        shadow-sm
                        sm:px-6
                    "
                >

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-14
                            -top-14
                            h-44
                            w-44
                            rounded-full
                            bg-white/10
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

                                    <path d="M9 12h6" />

                                    <path d="M12 9v6" />
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
                                    Role Configuration
                                </p>


                                <h1
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        sm:text-2xl
                                    "
                                >
                                    Edit {originalRole.name}
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-[11px]
                                        leading-5
                                        text-blue-100
                                    "
                                >
                                    Review the workplace safety access
                                    configuration associated with this role.
                                </p>

                            </div>

                        </div>


                        <ActionButton
                            variant="light"
                            className="
                                w-full
                                justify-center
                                sm:w-auto
                            "
                            onClick={() =>
                                navigate(
                                    `/admin/roles/${roleKey}`
                                )
                            }
                        >
                            ← Back
                        </ActionButton>

                    </div>

                </section>


                {/* ================================================= */}
                {/* FEEDBACK */}
                {/* ================================================= */}

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
                {/* MAIN CONTENT */}
                {/* ================================================= */}

                <div
                    className="
                        grid
                        gap-6
                        xl:grid-cols-[minmax(0,1fr)_300px]
                    "
                >

                    {/* ================================================= */}
                    {/* EDIT FORM */}
                    {/* ================================================= */}

                    <form
                        onSubmit={
                            handleSave
                        }
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
                                        Role Information
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            leading-5
                                            text-slate-500
                                        "
                                    >
                                        Basic configuration and permission access.
                                    </p>

                                </div>


                                <span
                                    className={`
                                        w-fit
                                        rounded-full
                                        px-3
                                        py-1.5
                                        text-[9px]
                                        font-semibold

                                        ${originalRole.editable
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-slate-100 text-slate-600"
                                        }
                                    `}
                                >
                                    {originalRole.editable
                                        ? "Editable Role"
                                        : "Fixed System Role"}
                                </span>

                            </div>

                        </div>


                        {/* BODY */}

                        <div
                            className="
                                space-y-6
                                p-4
                                sm:p-5
                                lg:p-6
                            "
                        >

                            {/* ================================================= */}
                            {/* ROLE INFORMATION */}
                            {/* ================================================= */}

                            <div
                                className="
                                    grid
                                    gap-4
                                    md:grid-cols-2
                                "
                            >

                                <FormField
                                    label="Role Name"
                                    hint="System role identifier"
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
                                    hint="Lower number means higher system priority"
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
                                hint="Description displayed for this role"
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
                                    className={`${inputClass} min-h-[110px] resize-y`}
                                />
                            </FormField>


                            {/* ================================================= */}
                            {/* PERMISSIONS */}
                            {/* ================================================= */}

                            <div
                                className="
                                    border-t
                                    border-slate-100
                                    pt-5
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

                                        <h3
                                            className="
                                                text-sm
                                                font-bold
                                                text-slate-900
                                            "
                                        >
                                            Permissions
                                        </h3>


                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                leading-5
                                                text-slate-500
                                            "
                                        >
                                            Enabled access for this system role.
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
                                        {enabledPermissions} of{" "}
                                        {permissions.length} Enabled
                                    </span>

                                </div>


                                {/* PERMISSION CARDS */}

                                <div
                                    className="
                                        mt-5
                                        grid
                                        gap-3
                                        md:grid-cols-2
                                    "
                                >

                                    {permissions.map(
                                        (
                                            permission
                                        ) => (
                                            <PermissionOption
                                                key={
                                                    permission.id
                                                }
                                                permission={
                                                    permission
                                                }
                                                editable={
                                                    originalRole.editable
                                                }
                                                onChange={() =>
                                                    handlePermissionChange(
                                                        permission.id
                                                    )
                                                }
                                            />
                                        )
                                    )}

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* ACTIONS */}
                            {/* ================================================= */}

                            <div
                                className="
                                    flex
                                    flex-col-reverse
                                    gap-3
                                    border-t
                                    border-slate-100
                                    pt-5
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >

                                <ActionButton
                                    variant="secondary"
                                    type="button"
                                    className="
                                        w-full
                                        justify-center
                                        sm:w-auto
                                    "
                                    onClick={
                                        handleReset
                                    }
                                >
                                    Reset
                                </ActionButton>


                                <ActionButton
                                    type="submit"
                                    variant="primary"
                                    className="
                                        w-full
                                        justify-center
                                        sm:w-auto
                                    "
                                    disabled={
                                        !originalRole.editable
                                    }
                                >
                                    Save Changes
                                </ActionButton>

                            </div>

                        </div>

                    </form>


                    {/* ================================================= */}
                    {/* RIGHT INFORMATION PANEL */}
                    {/* ================================================= */}

                    <aside className="space-y-4">

                        {/* SECURITY */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-blue-100
                                bg-gradient-to-b
                                from-blue-50
                                to-white
                                p-5
                                shadow-sm
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
                                    className="h-5 w-5"
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
                                Security Note
                            </h3>


                            <p
                                className="
                                    mt-2
                                    text-[10px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                Frontend controls do not replace backend
                                authorisation. Protected routes and API
                                permission checks must continue enforcing the
                                actual role rules.
                            </p>

                        </div>


                        {/* CURRENT CONFIGURATION */}

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

                            <h3
                                className="
                                    text-sm
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Current Configuration
                            </h3>


                            <div className="mt-4">

                                <InfoRow
                                    label="Role"
                                    value={
                                        originalRole.name
                                    }
                                />


                                <InfoRow
                                    label="Priority"
                                    value={
                                        originalRole.priority
                                    }
                                />


                                <InfoRow
                                    label="Permissions"
                                    value={`${enabledPermissions}/${permissions.length}`}
                                />


                                <InfoRow
                                    label="Editable"
                                    value={
                                        originalRole.editable
                                            ? "Yes"
                                            : "No"
                                    }
                                />

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        </DashboardLayout>
    );
}


// ======================================================
// PERMISSION OPTION
// ======================================================

function PermissionOption({
    permission,
    editable,
    onChange,
}) {
    return (
        <label
            className={`
                relative
                overflow-hidden
                rounded-xl
                border
                p-4
                transition-all
                duration-200

                ${permission.enabled
                    ? "border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-sm"
                    : "border-slate-200 bg-white"
                }

                ${editable
                    ? "cursor-pointer hover:border-blue-400 hover:shadow-sm"
                    : "cursor-not-allowed opacity-80"
                }
            `}
        >

            {permission.enabled && (
                <div
                    className="
                        absolute
                        left-0
                        top-0
                        h-full
                        w-1
                        bg-blue-500
                    "
                />
            )}


            <div
                className="
                    flex
                    items-start
                    gap-3
                "
            >

                <input
                    type="checkbox"
                    checked={
                        permission.enabled
                    }
                    disabled={
                        !editable
                    }
                    onChange={
                        onChange
                    }
                    className="
                        mt-0.5
                        h-4
                        w-4
                        shrink-0
                        rounded
                        border-slate-300
                        text-blue-600
                        focus:ring-blue-500
                    "
                />


                <div className="min-w-0">

                    <p
                        className="
                            text-xs
                            font-semibold
                            text-slate-800
                        "
                    >
                        {permission.label}
                    </p>


                    <p
                        className="
                            mt-1
                            text-[9px]
                            leading-4
                            text-slate-500
                        "
                    >
                        {permission.description}
                    </p>

                </div>

            </div>

        </label>
    );
}


// ======================================================
// FORM FIELD
// ======================================================

function FormField({
    label,
    hint,
    children,
}) {
    return (
        <label className="block">

            <span
                className="
                    text-[11px]
                    font-semibold
                    text-slate-700
                "
            >
                {label}
            </span>


            {hint && (
                <span
                    className="
                        mt-1
                        block
                        text-[9px]
                        text-slate-400
                    "
                >
                    {hint}
                </span>
            )}


            <div className="mt-2">
                {children}
            </div>

        </label>
    );
}


// ======================================================
// INFORMATION ROW
// ======================================================

function InfoRow({
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
// INPUT STYLE
// ======================================================

const inputClass = `
    w-full
    rounded-xl
    border
    border-slate-300
    bg-white
    px-3.5
    py-3
    text-xs
    text-slate-800
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
    disabled:cursor-not-allowed
    disabled:bg-slate-100
    disabled:text-slate-500
`;


export default EditRolePage;