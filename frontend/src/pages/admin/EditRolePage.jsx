import {
    useEffect,
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
            "Full administrative access and system control.",

        editable:
            false,

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
                id: "password-reset",
                label: "Reset User Passwords",
                enabled: true,
            },
            {
                id: "training-programmes",
                label: "Manage Training Programmes",
                enabled: true,
            },
            {
                id: "learning-content",
                label: "Manage Learning Content",
                enabled: true,
            },
            {
                id: "assign-training",
                label: "Assign Training",
                enabled: true,
            },
            {
                id: "audit-log",
                label: "View Audit Logs",
                enabled: true,
            },
        ],
    },


    trainer: {
        name:
            "Trainer",

        description:
            "Manage authorised training programmes and learning content.",

        editable:
            true,

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
                id: "manage-content",
                label: "Manage Learning Content",
                enabled: true,
            },
            {
                id: "view-trainees",
                label: "View Trainee Progress",
                enabled: true,
            },
            {
                id: "profile",
                label: "View Own Profile",
                enabled: true,
            },
            {
                id: "password",
                label: "Change Own Password",
                enabled: true,
            },
        ],
    },


    trainee: {
        name:
            "Trainee",

        description:
            "Access assigned workplace safety training and personal progress.",

        editable:
            false,

        permissions: [
            {
                id: "dashboard",
                label: "Access Trainee Dashboard",
                enabled: true,
            },
            {
                id: "training",
                label: "View Assigned Training",
                enabled: true,
            },
            {
                id: "scenarios",
                label: "Access Panoramic Scenarios",
                enabled: true,
            },
            {
                id: "quizzes",
                label: "Complete Quizzes",
                enabled: true,
            },
            {
                id: "progress",
                label: "View Own Progress",
                enabled: true,
            },
            {
                id: "profile",
                label: "View Own Profile",
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
    } =
        useParams();


    const roleKey =
        String(
            roleName ||
            ""
        ).toLowerCase();


    const role =
        ROLE_CONFIG[
        roleKey
        ];


    const initialPermissions =
        useMemo(
            () =>
                role
                    ? role.permissions.map(
                        (
                            permission
                        ) => ({
                            ...permission,
                        })
                    )
                    : [],
            [
                role,
            ]
        );


    const [
        description,
        setDescription,
    ] = useState(
        role?.description ||
        ""
    );


    const [
        permissions,
        setPermissions,
    ] = useState(
        initialPermissions
    );


    const [
        success,
        setSuccess,
    ] = useState("");


    useEffect(() => {
        setDescription(
            role?.description ||
            ""
        );

        setPermissions(
            role
                ? role.permissions.map(
                    (
                        permission
                    ) => ({
                        ...permission,
                    })
                )
                : []
        );

        setSuccess("");

    }, [
        role,
    ]);


    if (!role) {
        return (
            <DashboardLayout
                role="admin"
                title="Role Not Found"
            >
                <div
                    className="
                        admin-page
                    "
                >
                    <div
                        className="
                            rounded-xl
                            border
                            border-[#dbe4ef]
                            bg-white
                            p-8
                            text-center
                        "
                    >
                        <p
                            className="
                                text-[11px]
                                font-semibold
                                text-[#172033]
                            "
                        >
                            Role not found.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/roles"
                                )
                            }
                            className="
                                mt-4
                                rounded-lg
                                bg-[#1769e8]
                                px-5
                                py-2.5
                                text-[9px]
                                font-semibold
                                text-white
                            "
                        >
                            Back
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }


    const togglePermission =
        (
            id
        ) => {
            if (
                !role.editable
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
                                id
                                ? {
                                    ...permission,
                                    enabled:
                                        !permission.enabled,
                                }
                                : permission
                    )
            );

            setSuccess("");
        };


    const enabledCount =
        permissions.filter(
            (
                permission
            ) =>
                permission.enabled
        ).length;


    const handleSubmit =
        (
            event
        ) => {
            event.preventDefault();

            /*
             * This project currently has no backend endpoint
             * for changing system role permission definitions.
             * Keep this frontend-only rather than inventing an API.
             */

            setSuccess(
                "Role settings updated in the current view."
            );
        };


    return (
        <DashboardLayout
            role="admin"
            title={`Edit ${role.name} Role`}
            subtitle="Review role information and permissions."
        >
            <form
                onSubmit={
                    handleSubmit
                }
                className="
                    admin-page
                    space-y-5
                "
            >
                {success && (
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
                        {success}
                    </div>
                )}


                {!role.editable && (
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
                                text-[9px]
                                leading-4
                                text-amber-700
                            "
                        >
                            The {role.name} role is controlled by the
                            system and cannot be changed.
                        </p>
                    </div>
                )}


                {/* =============================================
                    ROLE INFORMATION
                ============================================== */}

                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        shadow-sm
                    "
                >
                    <div
                        className="
                            border-b
                            border-[#e8eef5]
                            px-5
                            py-4
                        "
                    >
                        <h2
                            className="
                                text-[13px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Role Information
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-[#64748b]
                            "
                        >
                            Basic information for this system role.
                        </p>
                    </div>


                    <div
                        className="
                            p-5
                        "
                    >
                        <div
                            className="
                                grid
                                gap-4
                                md:grid-cols-2
                            "
                        >
                            <label>
                                <span
                                    className="
                                        mb-2
                                        block
                                        text-[9px]
                                        font-semibold
                                        text-[#334155]
                                    "
                                >
                                    Role Name
                                </span>

                                <input
                                    type="text"
                                    value={
                                        role.name
                                    }
                                    disabled
                                    className="
                                        min-h-[42px]
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#dbe4ef]
                                        bg-[#f8fafc]
                                        px-3
                                        text-[10px]
                                        font-semibold
                                        text-[#64748b]
                                    "
                                />
                            </label>


                            <label>
                                <span
                                    className="
                                        mb-2
                                        block
                                        text-[9px]
                                        font-semibold
                                        text-[#334155]
                                    "
                                >
                                    Access Type
                                </span>

                                <input
                                    type="text"
                                    value={
                                        role.editable
                                            ? "Configurable"
                                            : "System Controlled"
                                    }
                                    disabled
                                    className="
                                        min-h-[42px]
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#dbe4ef]
                                        bg-[#f8fafc]
                                        px-3
                                        text-[10px]
                                        font-semibold
                                        text-[#64748b]
                                    "
                                />
                            </label>
                        </div>


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
                                    text-[9px]
                                    font-semibold
                                    text-[#334155]
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
                                        event.target.value
                                    )
                                }
                                disabled={
                                    !role.editable
                                }
                                className="
                                    w-full
                                    resize-none
                                    rounded-lg
                                    border
                                    border-[#cbd5e1]
                                    bg-white
                                    px-3
                                    py-3
                                    text-[10px]
                                    leading-5
                                    text-[#172033]
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                    disabled:bg-[#f8fafc]
                                    disabled:text-[#64748b]
                                "
                            />
                        </label>
                    </div>
                </section>


                {/* =============================================
                    PERMISSIONS
                ============================================== */}

                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        shadow-sm
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            border-b
                            border-[#e8eef5]
                            px-5
                            py-4
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-[13px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                Permissions
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-[#64748b]
                                "
                            >
                                Select actions available to this role.
                            </p>
                        </div>


                        <span
                            className="
                                rounded-full
                                bg-blue-50
                                px-3
                                py-1.5
                                text-[8px]
                                font-semibold
                                text-blue-600
                            "
                        >
                            {enabledCount}/{permissions.length} Enabled
                        </span>
                    </div>


                    <div
                        className="
                            grid
                            gap-3
                            p-5
                            md:grid-cols-2
                        "
                    >
                        {permissions.map(
                            (
                                permission
                            ) => (
                                <button
                                    key={
                                        permission.id
                                    }
                                    type="button"
                                    disabled={
                                        !role.editable
                                    }
                                    onClick={() =>
                                        togglePermission(
                                            permission.id
                                        )
                                    }
                                    className={`
                                        flex
                                        min-h-[68px]
                                        items-center
                                        justify-between
                                        gap-4
                                        rounded-xl
                                        border
                                        px-4
                                        py-3
                                        text-left
                                        transition

                                        ${permission.enabled
                                            ? "border-blue-200 bg-blue-50/60"
                                            : "border-[#dbe4ef] bg-white"
                                        }

                                        ${role.editable
                                            ? "hover:border-blue-300"
                                            : "cursor-default"
                                        }
                                    `}
                                >
                                    <span
                                        className="
                                            text-[9px]
                                            font-semibold
                                            text-[#334155]
                                        "
                                    >
                                        {permission.label}
                                    </span>


                                    <span
                                        className={`
                                            relative
                                            h-5
                                            w-9
                                            shrink-0
                                            rounded-full
                                            transition

                                            ${permission.enabled
                                                ? "bg-[#1769e8]"
                                                : "bg-[#cbd5e1]"
                                            }
                                        `}
                                    >
                                        <span
                                            className={`
                                                absolute
                                                top-0.5
                                                h-4
                                                w-4
                                                rounded-full
                                                bg-white
                                                shadow-sm
                                                transition

                                                ${permission.enabled
                                                    ? "left-[18px]"
                                                    : "left-0.5"
                                                }
                                            `}
                                        />
                                    </span>
                                </button>
                            )
                        )}
                    </div>
                </section>


                {/* =============================================
                    ACTIONS
                ============================================== */}

                <div
                    className="
                        flex
                        flex-col-reverse
                        gap-2
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        p-4
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
                            border-[#cbd5e1]
                            bg-white
                            px-5
                            text-[9px]
                            font-semibold
                            text-[#52627a]
                            transition
                            hover:bg-[#f8fafc]
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={
                            !role.editable
                        }
                        className="
                            min-h-[40px]
                            rounded-lg
                            bg-[#1769e8]
                            px-6
                            text-[9px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#0b5ed7]
                            disabled:cursor-not-allowed
                            disabled:bg-[#94a3b8]
                        "
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}


export default EditRolePage;