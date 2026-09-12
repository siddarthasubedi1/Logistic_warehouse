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
        name: "Administrator",

        description:
            "Full administrative access and control.",

        editable: false,

        permissions: [
            {
                id: "view-users",
                label: "View Users",
                enabled: true,
            },

            {
                id: "create-users",
                label: "Create Users",
                enabled: true,
            },

            {
                id: "manage-users",
                label: "Manage User Accounts",
                enabled: true,
            },

            {
                id: "reset-password",
                label: "Reset User Passwords",
                enabled: true,
            },

            {
                id: "training-programmes",
                label: "Manage Training Programmes",
                enabled: true,
            },

            {
                id: "learning-sections",
                label: "Manage Learning Sections",
                enabled: true,
            },

            {
                id: "training-assignment",
                label: "Assign Training",
                enabled: true,
            },

            {
                id: "audit-logs",
                label: "View Audit Logs",
                enabled: true,
            },
        ],
    },


    trainer: {
        name: "Trainer",

        description:
            "Manage assigned training programmes and learning content.",

        editable: true,

        permissions: [
            {
                id: "trainer-dashboard",
                label: "Access Trainer Dashboard",
                enabled: true,
            },

            {
                id: "manage-programmes",
                label: "Manage Training Programmes",
                enabled: true,
            },

            {
                id: "manage-sections",
                label: "Manage Learning Sections",
                enabled: true,
            },

            {
                id: "view-profile",
                label: "View Own Profile",
                enabled: true,
            },

            {
                id: "change-password",
                label: "Change Own Password",
                enabled: true,
            },
        ],
    },


    trainee: {
        name: "Trainee",

        description:
            "Access assigned training and personal account information.",

        editable: false,

        permissions: [
            {
                id: "trainee-dashboard",
                label: "Access Trainee Dashboard",
                enabled: true,
            },

            {
                id: "assigned-training",
                label: "View Assigned Training",
                enabled: true,
            },

            {
                id: "learning-content",
                label: "View Learning Content",
                enabled: true,
            },

            {
                id: "view-profile",
                label: "View Own Profile",
                enabled: true,
            },

            {
                id: "change-password",
                label: "Change Own Password",
                enabled: true,
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


    if (!originalRole) {
        return (
            <DashboardLayout
                role="admin"
                title="Role Not Found"
                subtitle="The requested role cannot be edited."
            >
                <section
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-8
                        text-center
                        shadow-sm
                    "
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
                            py-2.5
                            text-[9px]
                            text-white
                        "
                    >
                        Back to Roles
                    </button>
                </section>
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


        setSuccessMessage("");


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


    const handleReset =
        () => {
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


            setSuccessMessage("");
        };


    // ======================================================
    // CURRENT PROJECT HAS NO BACKEND ROLE UPDATE API
    // ======================================================

    const handleSave = (
        event
    ) => {
        event.preventDefault();


        if (
            !originalRole.editable
        ) {
            return;
        }


        setSuccessMessage(
            "Role settings updated."
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
            title={`Edit ${originalRole.name}`}
            subtitle="Review role description and available permissions."
        >
            <div
                className="
                    grid
                    gap-4
                    xl:grid-cols-[minmax(0,1fr)_280px]
                "
            >

                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <form
                    onSubmit={
                        handleSave
                    }
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
                            Role Information
                        </h2>
                    </div>


                    <div
                        className="
                            space-y-5
                            p-5
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
                                    text-emerald-700
                                "
                            >
                                {successMessage}
                            </div>
                        )}


                        <label className="block">
                            <span
                                className="
                                    text-[9px]
                                    font-medium
                                    text-slate-600
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
                                    mt-2
                                    h-11
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-3
                                    text-[10px]
                                    text-slate-500
                                "
                            />
                        </label>


                        <label className="block">
                            <span
                                className="
                                    text-[9px]
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Description
                            </span>


                            <textarea
                                rows="4"
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
                                disabled={
                                    !originalRole.editable
                                }
                                className="
                                    mt-2
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-3
                                    text-[10px]
                                    text-slate-700
                                    outline-none
                                    focus:border-blue-500
                                    disabled:bg-slate-50
                                "
                            />
                        </label>


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
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >
                                <div>
                                    <h3
                                        className="
                                            text-[11px]
                                            font-semibold
                                            text-slate-800
                                        "
                                    >
                                        Permissions
                                    </h3>


                                    <p
                                        className="
                                            mt-1
                                            text-[8px]
                                            text-slate-400
                                        "
                                    >
                                        {enabledCount} enabled
                                    </p>
                                </div>
                            </div>


                            <div
                                className="
                                    mt-4
                                    grid
                                    gap-3
                                    sm:grid-cols-2
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
                                                gap-3
                                                rounded-lg
                                                border
                                                p-4

                                                ${permission.enabled
                                                    ? "border-blue-200 bg-blue-50"
                                                    : "border-slate-200 bg-white"
                                                }

                                                ${originalRole.editable
                                                    ? "cursor-pointer"
                                                    : "cursor-default"
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
                                            />


                                            <span
                                                className="
                                                    text-[9px]
                                                    font-medium
                                                    text-slate-700
                                                "
                                            >
                                                {permission.label}
                                            </span>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>


                        <div
                            className="
                                flex
                                flex-col-reverse
                                gap-2
                                border-t
                                border-slate-100
                                pt-5
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
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-[9px]
                                    text-slate-600
                                    hover:bg-slate-50
                                "
                            >
                                Cancel
                            </button>


                            {originalRole.editable && (
                                <>
                                    <button
                                        type="button"
                                        onClick={
                                            handleReset
                                        }
                                        className="
                                            rounded-lg
                                            border
                                            border-slate-300
                                            bg-white
                                            px-4
                                            py-2.5
                                            text-[9px]
                                            text-slate-600
                                            hover:bg-slate-50
                                        "
                                    >
                                        Reset
                                    </button>


                                    <button
                                        type="submit"
                                        className="
                                            rounded-lg
                                            bg-blue-600
                                            px-5
                                            py-2.5
                                            text-[9px]
                                            font-medium
                                            text-white
                                            hover:bg-blue-700
                                        "
                                    >
                                        Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </form>


                {/* ================================================= */}
                {/* SUMMARY */}
                {/* ================================================= */}

                <aside
                    className="
                        h-fit
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                    "
                >
                    <h3
                        className="
                            text-[11px]
                            font-semibold
                            text-slate-800
                        "
                    >
                        Role Summary
                    </h3>


                    <div
                        className="
                            mt-4
                            space-y-3
                        "
                    >
                        <SummaryItem
                            label="Role"
                            value={
                                originalRole.name
                            }
                        />


                        <SummaryItem
                            label="Permissions"
                            value={
                                `${enabledCount} enabled`
                            }
                        />


                        <SummaryItem
                            label="Editable"
                            value={
                                originalRole.editable
                                    ? "Yes"
                                    : "No"
                            }
                        />
                    </div>
                </aside>

            </div>
        </DashboardLayout>
    );
}


function SummaryItem({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-lg
                bg-slate-50
                px-3
                py-3
            "
        >
            <p
                className="
                    text-[7px]
                    uppercase
                    tracking-wide
                    text-slate-400
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    text-[9px]
                    font-medium
                    text-slate-700
                "
            >
                {value}
            </p>
        </div>
    );
}


export default EditRolePage;