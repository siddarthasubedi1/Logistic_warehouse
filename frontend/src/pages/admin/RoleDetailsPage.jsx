import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";


const ROLES = {
    administrator: {
        name: "Administrator",

        description:
            "Full administrative access to user management, training management and audit information.",

        permissions: [
            {
                module: "User Management",

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
                module: "Training Management",

                items: [
                    "Create training programmes",
                    "Manage training programmes",
                    "Manage learning sections",
                    "Assign programmes to Trainees",
                ],
            },

            {
                module: "Administration",

                items: [
                    "Access Admin Dashboard",
                    "View Roles & Permissions",
                    "View Audit Logs",
                ],
            },
        ],
    },


    trainer: {
        name: "Trainer",

        description:
            "Manage training programmes and learning content available to the Trainer.",

        permissions: [
            {
                module: "Training Management",

                items: [
                    "Access Trainer Dashboard",
                    "Create programmes for assigned training areas",
                    "Manage owned programmes",
                    "Manage authorised programmes",
                    "Create and edit learning sections",
                    "Deactivate or reactivate learning sections",
                ],
            },

            {
                module: "Account",

                items: [
                    "View own profile",
                    "Change own password",
                ],
            },
        ],
    },


    trainee: {
        name: "Trainee",

        description:
            "Access training programmes and learning content assigned to the Trainee.",

        permissions: [
            {
                module: "Training",

                items: [
                    "Access Trainee Dashboard",
                    "View assigned programmes",
                    "Open learning sections",
                    "Navigate available learning content",
                ],
            },

            {
                module: "Account",

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
    } = useParams();


    const roleKey =
        String(
            roleName ||
            ""
        ).toLowerCase();


    const role =
        ROLES[
        roleKey
        ];


    if (!role) {
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
                            text-[11px]
                            text-slate-500
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
                            font-medium
                            text-white
                            hover:bg-blue-700
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
            subtitle={role.description}
        >
            <div className="space-y-4">

                {/* ================================================= */}
                {/* SUMMARY */}
                {/* ================================================= */}

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
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-50
                                    text-blue-600
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                >
                                    <circle
                                        cx="9"
                                        cy="8"
                                        r="3"
                                    />

                                    <path d="M3 20c.5-4 2.5-6 6-6" />

                                    <path d="m16 8 2 2 3-4" />
                                </svg>
                            </div>


                            <div>
                                <h2
                                    className="
                                        text-[13px]
                                        font-semibold
                                        text-slate-800
                                    "
                                >
                                    {role.name}
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        text-slate-400
                                    "
                                >
                                    {totalPermissions} permissions
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
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/admin/roles"
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
                                    font-medium
                                    text-slate-600
                                    hover:bg-slate-50
                                "
                            >
                                Back
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/admin/roles/${roleKey}/edit`
                                    )
                                }
                                className="
                                    rounded-lg
                                    bg-blue-600
                                    px-4
                                    py-2.5
                                    text-[9px]
                                    font-medium
                                    text-white
                                    hover:bg-blue-700
                                "
                            >
                                Edit Role
                            </button>
                        </div>
                    </div>
                </section>


                {/* ================================================= */}
                {/* PERMISSION GROUPS */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-4
                        lg:grid-cols-2
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
                                        items-center
                                        justify-between
                                        gap-3
                                        border-b
                                        border-slate-100
                                        pb-4
                                    "
                                >
                                    <h3
                                        className="
                                            text-[11px]
                                            font-semibold
                                            text-slate-800
                                        "
                                    >
                                        {group.module}
                                    </h3>


                                    <span
                                        className="
                                            rounded-full
                                            bg-blue-50
                                            px-2.5
                                            py-1
                                            text-[8px]
                                            text-blue-600
                                        "
                                    >
                                        {group.items.length}
                                    </span>
                                </div>


                                <div
                                    className="
                                        mt-4
                                        space-y-3
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
                                                        mt-[1px]
                                                        flex
                                                        h-5
                                                        w-5
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-emerald-50
                                                        text-[8px]
                                                        font-bold
                                                        text-emerald-600
                                                    "
                                                >
                                                    ✓
                                                </span>


                                                <p
                                                    className="
                                                        text-[9px]
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


export default RoleDetailsPage;