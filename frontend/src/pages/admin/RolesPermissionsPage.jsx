import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import FeedbackAlert from "../../components/ui/FeedbackAlert";

import api from "../../services/api";

import {
    getApiErrorMessage,
    parseArrayResponse,
} from "../../utils/training";


const ROLES = [
    {
        id: "administrator",
        name: "Administrator",
        backendRole: "admin",
        description:
            "Full control over users, training programmes, assignments and system records.",
        icon: "admin",
    },
    {
        id: "trainer",
        name: "Trainer",
        backendRole: "trainer",
        description:
            "Manage authorised training programmes, learning content and trainee activity.",
        icon: "trainer",
    },
    {
        id: "trainee",
        name: "Trainee",
        backendRole: "trainee",
        description:
            "Complete assigned workplace safety training and monitor personal progress.",
        icon: "trainee",
    },
];


const PERMISSIONS = [
    {
        name: "View Users",
        administrator: true,
        trainer: false,
        trainee: false,
    },
    {
        name: "Create Users",
        administrator: true,
        trainer: false,
        trainee: false,
    },
    {
        name: "Edit User Accounts",
        administrator: true,
        trainer: false,
        trainee: false,
    },
    {
        name: "Deactivate / Reactivate Users",
        administrator: true,
        trainer: false,
        trainee: false,
    },
    {
        name: "Reset User Passwords",
        administrator: true,
        trainer: false,
        trainee: false,
    },
    {
        name: "Manage Training Programmes",
        administrator: true,
        trainer: true,
        trainee: false,
    },
    {
        name: "Manage Learning Content",
        administrator: true,
        trainer: true,
        trainee: false,
    },
    {
        name: "Assign Training",
        administrator: true,
        trainer: false,
        trainee: false,
    },
    {
        name: "View Assigned Training",
        administrator: true,
        trainer: true,
        trainee: true,
    },
    {
        name: "Complete Training",
        administrator: false,
        trainer: false,
        trainee: true,
    },
    {
        name: "View Own Profile",
        administrator: true,
        trainer: true,
        trainee: true,
    },
    {
        name: "Access Dashboard",
        administrator: true,
        trainer: true,
        trainee: true,
    },
];


function RolesPermissionsPage() {
    const navigate =
        useNavigate();

    const [
        users,
        setUsers,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    const loadUsers =
        useCallback(
            async () => {
                try {
                    setLoading(true);
                    setErrorMessage("");

                    const response =
                        await api.get(
                            "/admin/users"
                        );

                    setUsers(
                        parseArrayResponse(
                            response.data,
                            "users"
                        )
                    );

                } catch (error) {
                    console.error(
                        "Roles users error:",
                        error
                    );

                    setErrorMessage(
                        getApiErrorMessage(
                            error,
                            "Unable to load role information."
                        )
                    );

                } finally {
                    setLoading(false);
                }
            },
            []
        );


    useEffect(() => {
        loadUsers();
    }, [
        loadUsers,
    ]);


    const counts =
        useMemo(
            () => {
                const result = {
                    admin: 0,
                    trainer: 0,
                    trainee: 0,
                };

                users.forEach(
                    (
                        user
                    ) => {
                        const role =
                            String(
                                user.role ||
                                ""
                            ).toLowerCase();

                        if (
                            Object.prototype.hasOwnProperty.call(
                                result,
                                role
                            )
                        ) {
                            result[
                                role
                            ] += 1;
                        }
                    }
                );

                return result;
            },
            [
                users,
            ]
        );


    return (
        <DashboardLayout
            role="admin"
            title="Roles & Permissions"
            subtitle="View system roles and the permissions available to each role."
        >
            <div
                className="
                    admin-page
                    space-y-5
                "
            >
                <FeedbackAlert
                    type="error"
                    message={
                        errorMessage
                    }
                    onClose={() =>
                        setErrorMessage("")
                    }
                />


                {/* =============================================
                    SUMMARY
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
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-[14px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                System Roles
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-[#64748b]
                                "
                            >
                                UK LogiWare uses three access levels.
                            </p>
                        </div>


                        <div
                            className="
                                flex
                                flex-wrap
                                gap-2
                            "
                        >
                            <CountBadge
                                label="Administrator"
                                value={
                                    counts.admin
                                }
                            />

                            <CountBadge
                                label="Trainer"
                                value={
                                    counts.trainer
                                }
                            />

                            <CountBadge
                                label="Trainee"
                                value={
                                    counts.trainee
                                }
                            />
                        </div>
                    </div>
                </section>


                {/* =============================================
                    ROLE CARDS
                ============================================== */}

                <section
                    className="
                        grid
                        gap-4
                        md:grid-cols-3
                    "
                >
                    {ROLES.map(
                        (
                            role
                        ) => (
                            <article
                                key={
                                    role.id
                                }
                                className="
                                    flex
                                    min-h-[235px]
                                    flex-col
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
                                        items-start
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <RoleIcon
                                        type={
                                            role.icon
                                        }
                                    />


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
                                        {loading
                                            ? "..."
                                            : counts[
                                            role.backendRole
                                            ]}{" "}
                                        Users
                                    </span>
                                </div>


                                <h3
                                    className="
                                        mt-4
                                        text-[13px]
                                        font-bold
                                        text-[#172033]
                                    "
                                >
                                    {role.name}
                                </h3>


                                <p
                                    className="
                                        mt-2
                                        text-[9px]
                                        leading-5
                                        text-[#64748b]
                                    "
                                >
                                    {role.description}
                                </p>


                                <div
                                    className="
                                        mt-auto
                                        flex
                                        gap-2
                                        pt-5
                                    "
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/admin/roles/${role.id}`
                                            )
                                        }
                                        className="
                                            min-h-[38px]
                                            flex-1
                                            rounded-lg
                                            border
                                            border-[#cbd5e1]
                                            bg-white
                                            px-3
                                            text-[9px]
                                            font-semibold
                                            text-[#52627a]
                                            transition
                                            hover:bg-[#f8fafc]
                                        "
                                    >
                                        View Role
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/admin/roles/${role.id}/edit`
                                            )
                                        }
                                        className="
                                            min-h-[38px]
                                            flex-1
                                            rounded-lg
                                            bg-[#1769e8]
                                            px-3
                                            text-[9px]
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-[#0b5ed7]
                                        "
                                    >
                                        Edit
                                    </button>
                                </div>
                            </article>
                        )
                    )}
                </section>


                {/* =============================================
                    PERMISSION MATRIX
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
                            Permission Matrix
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-[#64748b]
                            "
                        >
                            Compare access available to Administrator,
                            Trainer and Trainee roles.
                        </p>
                    </div>


                    <div
                        className="
                            overflow-x-auto
                        "
                    >
                        <table
                            className="
                                min-w-[650px]
                                w-full
                            "
                        >
                            <thead
                                className="
                                    bg-[#f8fafc]
                                "
                            >
                                <tr>
                                    <th
                                        className="
                                            px-5
                                            py-3
                                            text-left
                                            text-[8px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-[#64748b]
                                        "
                                    >
                                        Permission
                                    </th>

                                    <PermissionHead>
                                        Administrator
                                    </PermissionHead>

                                    <PermissionHead>
                                        Trainer
                                    </PermissionHead>

                                    <PermissionHead>
                                        Trainee
                                    </PermissionHead>
                                </tr>
                            </thead>


                            <tbody>
                                {PERMISSIONS.map(
                                    (
                                        permission
                                    ) => (
                                        <tr
                                            key={
                                                permission.name
                                            }
                                            className="
                                                border-t
                                                border-[#edf1f6]
                                            "
                                        >
                                            <td
                                                className="
                                                    px-5
                                                    py-3.5
                                                    text-[9px]
                                                    font-medium
                                                    text-[#334155]
                                                "
                                            >
                                                {permission.name}
                                            </td>

                                            <PermissionCell
                                                enabled={
                                                    permission.administrator
                                                }
                                            />

                                            <PermissionCell
                                                enabled={
                                                    permission.trainer
                                                }
                                            />

                                            <PermissionCell
                                                enabled={
                                                    permission.trainee
                                                }
                                            />
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}


function CountBadge({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-lg
                border
                border-[#e1e8f0]
                bg-[#f8fafc]
                px-3
                py-2
            "
        >
            <span
                className="
                    text-[8px]
                    text-[#64748b]
                "
            >
                {label}
            </span>

            <span
                className="
                    ml-2
                    text-[10px]
                    font-bold
                    text-[#172033]
                "
            >
                {value}
            </span>
        </div>
    );
}


function PermissionHead({
    children,
}) {
    return (
        <th
            className="
                px-5
                py-3
                text-center
                text-[8px]
                font-bold
                uppercase
                tracking-wide
                text-[#64748b]
            "
        >
            {children}
        </th>
    );
}


function PermissionCell({
    enabled,
}) {
    return (
        <td
            className="
                px-5
                py-3
                text-center
            "
        >
            <span
                className={`
                    mx-auto
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    text-[9px]
                    font-bold

                    ${enabled
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }
                `}
            >
                {enabled
                    ? "✓"
                    : "—"}
            </span>
        </td>
    );
}


function RoleIcon({
    type,
}) {
    return (
        <div
            className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[#eef6ff]
                text-blue-600
            "
        >
            {type ===
                "admin" ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="
                        h-5
                        w-5
                    "
                >
                    <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
            ) : (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="
                        h-5
                        w-5
                    "
                >
                    <circle
                        cx="12"
                        cy="8"
                        r="3"
                    />
                    <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                </svg>
            )}
        </div>
    );
}


export default RolesPermissionsPage;