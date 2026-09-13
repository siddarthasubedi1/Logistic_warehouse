import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";


const ROLES = {
    administrator: {
        name: "Administrator",
        description:
            "Full administrative access to user management, training management and system records.",

        groups: [
            {
                title:
                    "User Management",

                permissions: [
                    "View Trainer and Trainee accounts",
                    "Create user accounts",
                    "Edit user information",
                    "Deactivate and reactivate users",
                    "Delete users",
                    "Reset passwords after user request",
                ],
            },

            {
                title:
                    "Training Management",

                permissions: [
                    "Create training programmes",
                    "Manage training programmes",
                    "Manage learning sections",
                    "Assign training programmes",
                ],
            },

            {
                title:
                    "Administration",

                permissions: [
                    "Access Admin Dashboard",
                    "View Roles & Permissions",
                    "View system Audit Logs",
                ],
            },
        ],
    },


    trainer: {
        name: "Trainer",

        description:
            "Manage authorised training programmes and learning content.",

        groups: [
            {
                title:
                    "Training Management",

                permissions: [
                    "Access Trainer Dashboard",
                    "View assigned training module",
                    "Create authorised programmes",
                    "Manage authorised programmes",
                    "Create and edit learning sections",
                    "View trainee training activity",
                ],
            },

            {
                title:
                    "Account",

                permissions: [
                    "View own profile",
                    "Change own password",
                ],
            },
        ],
    },


    trainee: {
        name: "Trainee",

        description:
            "Access workplace safety training and personal learning progress.",

        groups: [
            {
                title:
                    "Training",

                permissions: [
                    "Access Trainee Dashboard",
                    "View assigned training programmes",
                    "Complete Manual Handling training",
                    "Complete Working at Height training",
                    "Access panoramic scenarios",
                    "Complete quizzes",
                    "View personal progress",
                ],
            },

            {
                title:
                    "Account",

                permissions: [
                    "View notifications",
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


    if (!role) {
        return (
            <DashboardLayout
                role="admin"
                title="Role Not Found"
                subtitle="The requested role does not exist."
            >
                <div
                    className="
                        admin-page
                    "
                >
                    <section
                        className="
                            rounded-xl
                            border
                            border-[#dbe4ef]
                            bg-white
                            p-8
                            text-center
                            shadow-sm
                        "
                    >
                        <h2
                            className="
                                text-[14px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Role not found
                        </h2>

                        <p
                            className="
                                mt-2
                                text-[9px]
                                text-[#64748b]
                            "
                        >
                            The selected role could not be found.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/roles"
                                )
                            }
                            className="
                                mt-5
                                rounded-lg
                                bg-[#1769e8]
                                px-5
                                py-2.5
                                text-[9px]
                                font-semibold
                                text-white
                            "
                        >
                            Back to Roles
                        </button>
                    </section>
                </div>
            </DashboardLayout>
        );
    }


    const permissionCount =
        role.groups.reduce(
            (
                total,
                group
            ) =>
                total +
                group.permissions.length,
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
                    admin-page
                    space-y-5
                "
            >
                {/* =============================================
                    TOP CARD
                ============================================== */}

                <section
                    className="
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        p-5
                        shadow-sm
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-5
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
                                    bg-[#eef6ff]
                                    text-blue-600
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="
                                        h-6
                                        w-6
                                    "
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
                                <p
                                    className="
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.1em]
                                        text-blue-600
                                    "
                                >
                                    System Role
                                </p>


                                <h2
                                    className="
                                        mt-1
                                        text-[18px]
                                        font-bold
                                        text-[#172033]
                                    "
                                >
                                    {role.name}
                                </h2>


                                <p
                                    className="
                                        mt-2
                                        max-w-[600px]
                                        text-[9px]
                                        leading-5
                                        text-[#64748b]
                                    "
                                >
                                    {role.description}
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
                                    min-h-[40px]
                                    rounded-lg
                                    border
                                    border-[#cbd5e1]
                                    bg-white
                                    px-4
                                    text-[9px]
                                    font-semibold
                                    text-[#52627a]
                                    transition
                                    hover:bg-[#f8fafc]
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
                                    min-h-[40px]
                                    rounded-lg
                                    bg-[#1769e8]
                                    px-5
                                    text-[9px]
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-[#0b5ed7]
                                "
                            >
                                Edit Role
                            </button>
                        </div>
                    </div>
                </section>


                {/* =============================================
                    STATS
                ============================================== */}

                <section
                    className="
                        grid
                        gap-4
                        sm:grid-cols-2
                    "
                >
                    <StatCard
                        label="Permission Groups"
                        value={
                            role.groups.length
                        }
                    />

                    <StatCard
                        label="Total Permissions"
                        value={
                            permissionCount
                        }
                    />
                </section>


                {/* =============================================
                    PERMISSION GROUPS
                ============================================== */}

                <section
                    className="
                        grid
                        gap-4
                        xl:grid-cols-2
                    "
                >
                    {role.groups.map(
                        (
                            group
                        ) => (
                            <article
                                key={
                                    group.title
                                }
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
                                        border-b
                                        border-[#e8eef5]
                                        bg-[#f8fafc]
                                        px-5
                                        py-4
                                    "
                                >
                                    <div>
                                        <h3
                                            className="
                                                text-[12px]
                                                font-bold
                                                text-[#172033]
                                            "
                                        >
                                            {group.title}
                                        </h3>

                                        <p
                                            className="
                                                mt-1
                                                text-[8px]
                                                text-[#64748b]
                                            "
                                        >
                                            {group.permissions.length} permissions
                                        </p>
                                    </div>


                                    <div
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-emerald-50
                                            text-emerald-600
                                        "
                                    >
                                        ✓
                                    </div>
                                </div>


                                <div
                                    className="
                                        divide-y
                                        divide-[#edf1f6]
                                    "
                                >
                                    {group.permissions.map(
                                        (
                                            permission
                                        ) => (
                                            <div
                                                key={
                                                    permission
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    px-5
                                                    py-3.5
                                                "
                                            >
                                                <span
                                                    className="
                                                        flex
                                                        h-6
                                                        w-6
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
                                                        font-medium
                                                        text-[#334155]
                                                    "
                                                >
                                                    {permission}
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


function StatCard({
    label,
    value,
}) {
    return (
        <article
            className="
                rounded-xl
                border
                border-[#dbe4ef]
                bg-white
                p-5
                shadow-sm
            "
        >
            <p
                className="
                    text-[9px]
                    font-medium
                    text-[#64748b]
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-2
                    text-[24px]
                    font-bold
                    text-[#1769e8]
                "
            >
                {value}
            </p>
        </article>
    );
}


export default RoleDetailsPage;