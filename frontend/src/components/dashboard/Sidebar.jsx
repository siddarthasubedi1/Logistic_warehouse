import {
    NavLink,
    useLocation,
} from "react-router-dom";

import Logo from "../layout/Logo";
import LogoutButton from "./LogoutButton";


// ======================================================
// SIDEBAR ICON
// ======================================================

function SidebarIcon({
    type,
}) {
    const className =
        "h-[17px] w-[17px] shrink-0";


    if (
        type ===
        "dashboard"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    className
                }
            >
                <path d="M3 12 12 4l9 8" />
                <path d="M5 10v10h14V10" />
            </svg>
        );
    }


    if (
        type ===
        "create"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    className
                }
            >
                <circle
                    cx="9"
                    cy="8"
                    r="3"
                />

                <path d="M3 20c.5-4 2.5-6 6-6" />

                <path d="M18 13v8" />

                <path d="M14 17h8" />
            </svg>
        );
    }


    if (
        type ===
        "users"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    className
                }
            >
                <circle
                    cx="9"
                    cy="8"
                    r="3"
                />

                <circle
                    cx="17"
                    cy="9"
                    r="2"
                />

                <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                <path d="M15 15c3 0 5 1.6 5.5 5" />
            </svg>
        );
    }


    if (
        type ===
        "roles"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    className
                }
            >
                <circle
                    cx="9"
                    cy="7"
                    r="3"
                />

                <path d="M3 20c.5-4 2.5-6 6-6" />

                <path d="M16 7l2 2 3-4" />

                <path d="M15 15h6" />
            </svg>
        );
    }


    if (
        type ===
        "training"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    className
                }
            >
                <path d="M4 5h6v14H4z" />

                <path d="M14 5h6v14h-6z" />

                <path d="M10 8h4" />

                <path d="M10 16h4" />
            </svg>
        );
    }


    if (
        type ===
        "profile"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    className
                }
            >
                <circle
                    cx="12"
                    cy="8"
                    r="4"
                />

                <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
            </svg>
        );
    }


    if (
        type ===
        "audit"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    className
                }
            >
                <path d="M6 3h12v18H6z" />

                <path d="M9 8h6" />

                <path d="M9 12h6" />

                <path d="M9 16h4" />
            </svg>
        );
    }


    if (
        type ===
        "help"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    className
                }
            >
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />

                <path d="M9.8 9a2.4 2.4 0 1 1 3.8 2c-1 .7-1.6 1.2-1.6 2.5" />

                <path d="M12 17h.01" />
            </svg>
        );
    }


    return (
        <span
            className="
                h-2
                w-2
                rounded-full
                bg-current
            "
        />
    );
}


// ======================================================
// ADMIN NAVIGATION
// ======================================================

const ADMIN_ITEMS = [
    {
        label:
            "Dashboard",

        path:
            "/admin",

        icon:
            "dashboard",
    },

    {
        label:
            "Create User",

        path:
            "/admin/create-user",

        icon:
            "create",
    },

    {
        label:
            "Manage Users",

        path:
            "/admin/users",

        icon:
            "users",
    },

    {
        label:
            "Roles & Permissions",

        path:
            "/admin/roles",

        icon:
            "roles",
    },

    {
        label:
            "Training Programmes",

        path:
            "/training-programmes",

        icon:
            "training",
    },

    {
        label:
            "Training Assignments",

        path:
            "/training-assignments",

        icon:
            "training",
    },

    {
        label:
            "Audit Logs",

        path:
            "/admin/audit-logs",

        icon:
            "audit",
    },
];


// ======================================================
// TRAINER NAVIGATION
// ======================================================

const TRAINER_ITEMS = [
    {
        label:
            "Dashboard",

        path:
            "/trainer",

        icon:
            "dashboard",
    },

    {
        label:
            "Training Programmes",

        path:
            "/training-programmes",

        icon:
            "training",
    },

    {
        label:
            "Profile",

        path:
            "/trainer/profile",

        icon:
            "profile",
    },
];


// ======================================================
// TRAINEE NAVIGATION
// ======================================================

const TRAINEE_ITEMS = [
    {
        label:
            "Dashboard",

        path:
            "/trainee",

        icon:
            "dashboard",
    },

    {
        label:
            "My Training",

        path:
            "/my-training",

        icon:
            "training",
    },

    {
        label:
            "Profile",

        path:
            "/trainee/profile",

        icon:
            "profile",
    },
];


// ======================================================
// ROLE INFORMATION
// ======================================================

const ROLE_INFORMATION = {
    admin: {
        title:
            "Administrator",

        description:
            "User account and access management.",
    },

    trainer: {
        title:
            "Trainer",

        description:
            "Training and learner management.",
    },

    trainee: {
        title:
            "Trainee",

        description:
            "Workplace safety training.",
    },
};


// ======================================================
// SIDEBAR
// ======================================================

function Sidebar({
    role,
    onNavigate = null,
}) {
    const location =
        useLocation();


    const menuByRole = {
        admin:
            ADMIN_ITEMS,

        trainer:
            TRAINER_ITEMS,

        trainee:
            TRAINEE_ITEMS,
    };


    const items =
        menuByRole[
        role
        ] ||
        [];


    const roleInformation =
        ROLE_INFORMATION[
        role
        ] ||
        {
            title:
                "User",

            description:
                "Workplace safety training.",
        };


    // ======================================================
    // ACTIVE ROUTE
    // ======================================================

    const isActive = (
        item
    ) => {
        if (
            item.path ===
            "/admin"
        ) {
            return (
                location.pathname ===
                "/admin"
            );
        }


        if (
            item.path ===
            "/admin/roles"
        ) {
            return location.pathname.startsWith(
                "/admin/roles"
            );
        }


        if (
            item.path ===
            "/training-programmes"
        ) {
            return location.pathname.startsWith(
                "/training-programmes"
            );
        }


        if (
            item.path ===
            "/training-assignments"
        ) {
            return location.pathname.startsWith(
                "/training-assignments"
            );
        }


        if (
            item.path ===
            "/my-training"
        ) {
            return location.pathname.startsWith(
                "/my-training"
            );
        }


        return (
            location.pathname ===
            item.path
        );
    };


    // ======================================================
    // UI
    // ======================================================

    return (
        <aside
            className="
                flex
                h-full
                min-h-screen
                w-full
                flex-col
                bg-[#0a4371]
                text-white
            "
        >

            {/* ================================================= */}
            {/* LOGO */}
            {/* ================================================= */}

            <div
                className="
                    border-b
                    border-white/10
                    px-5
                    py-5
                "
            >
                <Logo
                    light
                />
            </div>


            {/* ================================================= */}
            {/* NAVIGATION */}
            {/* ================================================= */}

            <nav
                className="
                    flex
                    min-h-0
                    flex-1
                    flex-col
                    px-3
                    py-5
                "
            >

                <div
                    className="
                        space-y-1
                    "
                >

                    {items.map(
                        (
                            item
                        ) => {
                            const active =
                                isActive(
                                    item
                                );


                            return (
                                <NavLink
                                    key={
                                        item.path
                                    }
                                    to={
                                        item.path
                                    }
                                    onClick={() => {
                                        if (
                                            onNavigate
                                        ) {
                                            onNavigate();
                                        }
                                    }}
                                    className={`
                                        flex
                                        min-h-[42px]
                                        items-center
                                        gap-3
                                        rounded-md
                                        px-3
                                        py-2.5
                                        text-[11px]
                                        font-medium
                                        transition

                                        ${active
                                            ? "bg-[#1478d4] text-white"
                                            : "text-slate-100 hover:bg-white/10 hover:text-white"
                                        }
                                    `}
                                >

                                    <SidebarIcon
                                        type={
                                            item.icon
                                        }
                                    />


                                    <span
                                        className="
                                            min-w-0
                                            flex-1
                                            truncate
                                        "
                                    >
                                        {item.label}
                                    </span>

                                </NavLink>
                            );
                        }
                    )}

                </div>


                {/* ================================================= */}
                {/* LOGOUT */}
                {/* ================================================= */}

                <div
                    className="
                        mt-4
                        border-t
                        border-white/10
                        pt-4
                    "
                >
                    <LogoutButton />
                </div>


                {/* ================================================= */}
                {/* ROLE CARD */}
                {/* ================================================= */}

                <div
                    className="
                        mt-auto
                        pt-8
                    "
                >

                    <div
                        className="
                            rounded-lg
                            border
                            border-white/15
                            bg-white/[0.06]
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-md
                                bg-[#176aa5]
                                text-blue-100
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-4 w-4"
                            >
                                <circle
                                    cx="12"
                                    cy="8"
                                    r="3"
                                />

                                <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                            </svg>
                        </div>


                        <p
                            className="
                                mt-3
                                text-[11px]
                                font-semibold
                                text-white
                            "
                        >
                            {roleInformation.title}
                        </p>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                leading-4
                                text-blue-100
                            "
                        >
                            {roleInformation.description}
                        </p>

                    </div>

                </div>

            </nav>

        </aside>
    );
}


export default Sidebar;