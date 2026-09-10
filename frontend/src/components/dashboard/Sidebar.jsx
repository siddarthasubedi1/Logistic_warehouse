import {
    NavLink,
    useLocation,
} from "react-router-dom";

import Logo from "../layout/Logo";
import LogoutButton from "./LogoutButton";

import singleTruck from "../../images/single-truck.jpg";


// ======================================================
// ICON
// ======================================================

function SidebarIcon({
    type,
}) {
    const className =
        "h-[18px] w-[18px] shrink-0";


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
        "progress"
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
                <path d="M4 20V10" />
                <path d="M10 20V4" />
                <path d="M16 20v-7" />
                <path d="M22 20V8" />
            </svg>
        );
    }


    if (
        type ===
        "scenario"
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
                    r="8"
                />

                <circle
                    cx="12"
                    cy="12"
                    r="3"
                />

                <path d="M12 2v3" />
                <path d="M12 19v3" />
                <path d="M2 12h3" />
                <path d="M19 12h3" />
            </svg>
        );
    }


    if (
        type ===
        "quiz"
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

                <path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1.2-1.5 2.5" />

                <circle
                    cx="12"
                    cy="17"
                    r=".8"
                    fill="currentColor"
                />
            </svg>
        );
    }


    if (
        type ===
        "notification"
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
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

                <path d="M10 21h4" />
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
                <path d="M4 13a8 8 0 0 1 16 0" />
                <path d="M4 13v5h4v-6H4" />
                <path d="M20 13v5h-4v-6h4" />
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
// MENU DATA
// ======================================================

const ADMIN_ITEMS = [
    {
        label:
            "Dashboard",

        path:
            "/admin",

        icon:
            "dashboard",

        enabled:
            true,
    },

    {
        label:
            "Create User",

        path:
            "/admin/create-user",

        icon:
            "create",

        enabled:
            true,
    },

    {
        label:
            "Manage Users",

        path:
            "/admin/users",

        icon:
            "users",

        enabled:
            true,
    },

    {
        label:
            "Roles & Permissions",

        path:
            "/admin/roles",

        icon:
            "roles",

        enabled:
            true,
    },

    {
        label:
            "Training Programmes",

        path:
            "/training-programmes",

        icon:
            "training",

        enabled:
            true,
    },

    {
        label:
            "Training Assignments",

        path:
            "/training-assignments",

        icon:
            "training",

        enabled:
            true,
    },
];


const TRAINER_ITEMS = [
    {
        label:
            "Dashboard",

        path:
            "/trainer",

        icon:
            "dashboard",

        enabled:
            true,
    },

    {
        label:
            "Training Programmes",

        path:
            "/training-programmes",

        icon:
            "training",

        enabled:
            true,
    },

    {
        label:
            "Profile",

        path:
            "/trainer/profile",

        icon:
            "profile",

        enabled:
            true,
    },
];


const TRAINEE_ITEMS = [
    {
        label:
            "Dashboard",

        path:
            "/trainee",

        icon:
            "dashboard",

        enabled:
            true,
    },

    {
        label:
            "My Training",

        path:
            "/my-training",

        icon:
            "training",

        enabled:
            true,
    },

    {
        label:
            "My Progress",

        path:
            "/trainee/progress",

        icon:
            "progress",

        enabled:
            false,
    },

    {
        label:
            "Panoramic Scenarios",

        path:
            "/trainee/scenarios",

        icon:
            "scenario",

        enabled:
            false,
    },

    {
        label:
            "Quizzes",

        path:
            "/trainee/quizzes",

        icon:
            "quiz",

        enabled:
            false,
    },

    {
        label:
            "Notifications",

        path:
            "/trainee/notifications",

        icon:
            "notification",

        enabled:
            false,
    },

    {
        label:
            "Profile",

        path:
            "/trainee/profile",

        icon:
            "profile",

        enabled:
            true,
    },

    {
        label:
            "Help Support",

        path:
            "/trainee/help",

        icon:
            "help",

        enabled:
            false,
    },
];


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


    // ======================================================
    // ACTIVE ROUTE
    // ======================================================

    const isItemActive = (
        item
    ) => {

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
    // ROLE INFORMATION
    // ======================================================

    const roleInformation = {
        admin: {
            title:
                "Administrator",

            description:
                "User, programme, role and assignment management.",
        },

        trainer: {
            title:
                "Trainer",

            description:
                "Manage authorised safety training and learning content.",
        },

        trainee: {
            title:
                "Safety Learner",

            description:
                "Learn safely, follow procedures and track your training.",
        },
    };


    const currentRoleInfo =
        roleInformation[
        role
        ] ||
        {
            title:
                "UK LogiWare",

            description:
                "Workplace safety training.",
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
                bg-gradient-to-b
                from-[#073763]
                via-[#083d6b]
                to-[#052b4f]
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


                <div
                    className="
                        mt-4
                        h-[3px]
                        overflow-hidden
                        rounded-full
                        bg-white/10
                    "
                >
                    <div
                        className="
                            h-full
                            w-2/3
                            rounded-full
                            bg-gradient-to-r
                            from-blue-400
                            to-cyan-300
                        "
                    />
                </div>

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
                        px-3
                        pb-3
                    "
                >

                    <p
                        className="
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            text-blue-200/80
                        "
                    >
                        Safety Workspace
                    </p>

                </div>


                {/* ================================================= */}
                {/* MENU */}
                {/* ================================================= */}

                <div className="space-y-1.5">

                    {items.map(
                        (
                            item
                        ) => {

                            const active =
                                isItemActive(
                                    item
                                );


                            if (
                                !item.enabled
                            ) {
                                return (
                                    <button
                                        key={
                                            `${role}-${item.path}-${item.label}`
                                        }
                                        type="button"
                                        disabled
                                        title="Available in a later sprint"
                                        className="
                                            flex
                                            w-full
                                            cursor-default
                                            items-center
                                            gap-3
                                            rounded-lg
                                            px-3
                                            py-[10px]
                                            text-left
                                            text-[12px]
                                            font-medium
                                            text-slate-300
                                            opacity-45
                                        "
                                    >

                                        <SidebarIcon
                                            type={
                                                item.icon
                                            }
                                        />


                                        <span>
                                            {item.label}
                                        </span>

                                    </button>
                                );
                            }


                            return (
                                <NavLink
                                    key={
                                        `${role}-${item.path}-${item.label}`
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
                                        group
                                        flex
                                        items-center
                                        gap-3
                                        rounded-lg
                                        px-3
                                        py-[11px]
                                        text-[12px]
                                        font-medium
                                        transition-all
                                        duration-200

                                        ${active
                                            ? "bg-[#1976e9] text-white shadow-[0_6px_18px_rgba(25,118,233,0.3)]"
                                            : "text-slate-200 hover:bg-white/10 hover:text-white"
                                        }
                                    `}
                                >

                                    <span
                                        className={`
                                            flex
                                            h-7
                                            w-7
                                            items-center
                                            justify-center
                                            rounded-md
                                            transition

                                            ${active
                                                ? "bg-white/15"
                                                : "bg-white/5 group-hover:bg-white/10"
                                            }
                                        `}
                                    >
                                        <SidebarIcon
                                            type={
                                                item.icon
                                            }
                                        />
                                    </span>


                                    <span
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >
                                        {item.label}
                                    </span>


                                    {active && (
                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                bg-white
                                            "
                                        />
                                    )}

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
                        mt-5
                        border-t
                        border-white/10
                        pt-4
                    "
                >
                    <LogoutButton />
                </div>


                {/* ================================================= */}
                {/* SAFETY INFORMATION CARD */}
                {/* ================================================= */}

                <div
                    className="
                        mt-auto
                        pt-8
                    "
                >

                    {role ===
                        "trainee" ? (
                        <div
                            className="
                                overflow-hidden
                                rounded-xl
                                border
                                border-white/10
                                bg-white/[0.06]
                                shadow-lg
                            "
                        >

                            <img
                                src={
                                    singleTruck
                                }
                                alt="UK LogiWare truck"
                                className="
                                    h-[110px]
                                    w-full
                                    object-cover
                                "
                            />


                            <div
                                className="
                                    p-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-blue-400/15
                                            text-blue-200
                                        "
                                    >

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-4 w-4"
                                        >
                                            <path d="M12 3 5 6v5c0 4.8 2.8 8 7 10 4.2-2 7-5.2 7-10V6l-7-3z" />

                                            <path d="m9 12 2 2 4-4" />
                                        </svg>

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-[11px]
                                                font-semibold
                                                text-white
                                            "
                                        >
                                            Safety First
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-[9px]
                                                leading-4
                                                text-slate-300
                                            "
                                        >
                                            Learn the correct procedure before starting work.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>
                    ) : (
                        <div
                            className="
                                rounded-xl
                                border
                                border-white/10
                                bg-white/[0.06]
                                p-4
                                shadow-lg
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-400/15
                                    text-blue-200
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


                            <p
                                className="
                                    mt-3
                                    text-[11px]
                                    font-semibold
                                    text-white
                                "
                            >
                                {currentRoleInfo.title}
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    leading-4
                                    text-slate-300
                                "
                            >
                                {currentRoleInfo.description}
                            </p>

                        </div>
                    )}

                </div>

            </nav>

        </aside>
    );
}


export default Sidebar;