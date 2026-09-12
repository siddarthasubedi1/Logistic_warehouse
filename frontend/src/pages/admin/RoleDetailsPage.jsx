import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";


const ROLES = {
    administrator: {
        name:
            "Administrator",

        description:
            "Full administrative access to user management, training management and audit information.",

        permissions: [
            {
                module:
                    "User Management",

                items: [
                    "View users",
                    "Create Trainer and Trainee accounts",
                    "Edit user information",
                    "Deactivate and reactivate users",
                    "Delete users",
                    "Reset passwords after a reset request",
                ],
            },
            {
                module:
                    "Training Management",

                items: [
                    "Create training programmes",
                    "Manage training programmes",
                    "Manage learning sections",
                    "Assign programmes to Trainees",
                ],
            },
            {
                module:
                    "Administration",

                items: [
                    "Access Admin Dashboard",
                    "View Roles & Permissions",
                    "View Audit Logs",
                ],
            },
        ],
    },

    trainer: {
        name:
            "Trainer",

        description:
            "Manage training programmes and learning content available to the Trainer.",

        permissions: [
            {
                module:
                    "Training Management",

                items: [
                    "Access Trainer Dashboard",
                    "Create programmes for assigned training area",
                    "Manage owned programmes",
                    "Manage authorised programmes",
                    "Create and edit learning sections",
                    "Deactivate or reactivate learning sections",
                ],
            },
            {
                module:
                    "Account",

                items: [
                    "View own profile",
                    "Change own password",
                ],
            },
        ],
    },

    trainee: {
        name:
            "Trainee",

        description:
            "Access training programmes and learning content assigned to the Trainee.",

        permissions: [
            {
                module:
                    "Training",

                items: [
                    "Access Trainee Dashboard",
                    "View assigned programmes",
                    "Open learning sections",
                    "Navigate available learning content",
                ],
            },
            {
                module:
                    "Account",

                items: [
                    "View own profile",
                    "Change own password",
                ],
            },
        ],
    },
};


function RoleDetailsPage() {
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
        ROLES[
        roleKey
        ];


    if (
        !role
    ) {
        return (
            <DashboardLayout
                role="admin"
                title="Role Not Found"
                subtitle="The requested role does not exist."
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
                    <p
                        className="
                            text-[10px]
                            font-medium
                            text-slate-600
                        "
                    >
                        The requested role could not be found.
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
                            bg-blue-600
                            px-4
                            py-2.5
                            text-[9px]
                            font-semibold
                            text-white
                        "
                    >
                        Back to Roles
                    </button>
                </section>
            </DashboardLayout>
        );
    }


    const totalPermissions =
        role.permissions.reduce(
            (
                total,
                group
            ) =>
                total +
                group.items.length,
            0
        );


    return (
        <DashboardLayout
            role="admin"
            title={`${role.name} Role`}
            subtitle={
                role.description
            }
        >
            <div
                className="
                    space-y-4
                "
            >
                {/* SUMMARY */}

                <section
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
                            flex-col
                            gap-4
                            md:flex-row
                            md:items-center
                            md:justify-between
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
                                    bg-blue-50
                                    text-blue-600
                                "
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

                                    <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                                </svg>
                            </div>


                            <div>
                                <h2
                                    className="
                                        text-[16px]
                                        font-bold
                                        text-[#172033]
                                    "
                                >
                                    {role.name}
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        max-w-2xl
                                        text-[9px]
                                        font-medium
                                        leading-5
                                        text-slate-600
                                    "
                                >
                                    {
                                        role.description
                                    }
                                </p>
                            </div>
                        </div>


                        <div
                            className="
                                flex
                                flex-col
                                gap-2
                                sm:flex-row
                            "
                        >
                            {roleKey ===
                                "trainer" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/admin/roles/${roleKey}/edit`
                                            )
                                        }
                                        className="
                                        min-h-[40px]
                                        rounded-lg
                                        bg-blue-600
                                        px-4
                                        text-[9px]
                                        font-semibold
                                        text-white
                                    "
                                    >
                                        Edit Permissions
                                    </button>
                                )}


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/admin/roles"
                                    )
                                }
                                className="
                                    min-h-[40px]
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    text-[9px]
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Back
                            </button>
                        </div>
                    </div>


                    <div
                        className="
                            mt-5
                            grid
                            gap-3
                            sm:grid-cols-2
                        "
                    >
                        <Summary
                            label="Permission Groups"
                            value={
                                role.permissions.length
                            }
                        />

                        <Summary
                            label="Total Permissions"
                            value={
                                totalPermissions
                            }
                        />
                    </div>
                </section>


                {/* PERMISSIONS */}

                <section
                    className="
                        grid
                        gap-4
                        md:grid-cols-2
                    "
                >
                    {role.permissions.map(
                        (
                            group
                        ) => (
                            <article
                                key={
                                    group.module
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
                                        bg-slate-50
                                        px-4
                                        py-3
                                    "
                                >
                                    <h3
                                        className="
                                            text-[10px]
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        {group.module}
                                    </h3>
                                </div>


                                <div
                                    className="
                                        space-y-3
                                        p-4
                                    "
                                >
                                    {group.items.map(
                                        (
                                            item
                                        ) => (
                                            <div
                                                key={
                                                    item
                                                }
                                                className="
                                                    flex
                                                    items-start
                                                    gap-3
                                                "
                                            >
                                                <span
                                                    className="
                                                        mt-0.5
                                                        flex
                                                        h-5
                                                        w-5
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-emerald-100
                                                        text-[7px]
                                                        font-bold
                                                        text-emerald-600
                                                    "
                                                >
                                                    ✓
                                                </span>

                                                <p
                                                    className="
                                                        text-[8px]
                                                        font-medium
                                                        leading-5
                                                        text-slate-600
                                                    "
                                                >
                                                    {item}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </article>
                        )
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}


function Summary({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-lg
                bg-slate-50
                p-4
            "
        >
            <p
                className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    text-[20px]
                    font-bold
                    text-[#172033]
                "
            >
                {value}
            </p>
        </div>
    );
}


export default RoleDetailsPage;