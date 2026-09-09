import {
    NavLink,
    useLocation,
} from "react-router-dom";

import Logo from "../layout/Logo";
import LogoutButton from "./LogoutButton";

import singleTruck from "../../images/single-truck.jpg";


// ======================================================
// SIDEBAR ICON
// ======================================================

function SidebarIcon({
    type,
}) {

    const iconClass =
        "h-[18px] w-[18px] shrink-0";


    // ==================================================
    // DASHBOARD
    // ==================================================

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
                    iconClass
                }
            >
                <path d="M3 12 12 4l9 8" />

                <path d="M5 10v10h14V10" />
            </svg>
        );
    }


    // ==================================================
    // CREATE USER
    // ==================================================

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
                    iconClass
                }
            >
                <circle
                    cx="10"
                    cy="8"
                    r="4"
                />

                <path d="M3 21c.6-4 3-6 7-6" />

                <path d="M18 13v8" />

                <path d="M14 17h8" />
            </svg>
        );
    }


    // ==================================================
    // USERS
    // ==================================================

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
                    iconClass
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


    // ==================================================
    // ROLES
    // ==================================================

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
                    iconClass
                }
            >
                <circle
                    cx="9"
                    cy="7"
                    r="3"
                />

                <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                <path d="M17 8l2 2 3-4" />

                <path d="M16 14h5" />

                <path d="M18.5 11.5v5" />
            </svg>
        );
    }


    // ==================================================
    // TRAINING
    // ==================================================

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
                    iconClass
                }
            >
                <path d="M4 5h6v14H4z" />

                <path d="M14 5h6v14h-6z" />

                <path d="M10 8h4" />

                <path d="M10 16h4" />
            </svg>
        );
    }


    // ==================================================
    // PROGRESS
    // ==================================================

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
                    iconClass
                }
            >
                <path d="M4 20V10" />

                <path d="M10 20V4" />

                <path d="M16 20v-7" />

                <path d="M22 20V8" />
            </svg>
        );
    }


    // ==================================================
    // SCENARIO
    // ==================================================

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
                    iconClass
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


    // ==================================================
    // QUIZ
    // ==================================================

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
                    iconClass
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


    // ==================================================
    // NOTIFICATION
    // ==================================================

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
                    iconClass
                }
            >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

                <path d="M10 21h4" />
            </svg>
        );
    }


    // ==================================================
    // PROFILE
    // ==================================================

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
                    iconClass
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


    // ==================================================
    // HELP
    // ==================================================

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
                    iconClass
                }
            >
                <path d="M4 13a8 8 0 0 1 16 0" />

                <path d="M4 13v4a2 2 0 0 0 2 2h2v-6H4z" />

                <path d="M20 13v4a2 2 0 0 1-2 2h-2v-6h4z" />
            </svg>
        );
    }


    // ==================================================
    // FALLBACK
    // ==================================================

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
// ADMIN MENU
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


// ======================================================
// TRAINER MENU
// ======================================================

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


// ======================================================
// TRAINEE MENU
// ======================================================

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
}) {

    const location =
        useLocation();


    // ==================================================
    // SELECT MENU
    // ==================================================

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


    // ==================================================
    // ACTIVE MENU CHECK
    // ==================================================

    const isItemActive = (
        item
    ) => {

        // ----------------------------------------------
        // ADMIN ROLE CHILD PAGES
        // ----------------------------------------------

        if (
            item.path ===
            "/admin/roles"
        ) {
            return location.pathname.startsWith(
                "/admin/roles"
            );
        }


        // ----------------------------------------------
        // TRAINING PROGRAMMES
        // ----------------------------------------------

        if (
            item.path ===
            "/training-programmes"
        ) {
            return location.pathname.startsWith(
                "/training-programmes"
            );
        }


        // ----------------------------------------------
        // MY TRAINING
        // ----------------------------------------------

        if (
            item.path ===
            "/my-training"
        ) {
            return location.pathname.startsWith(
                "/my-training"
            );
        }


        // ----------------------------------------------
        // EXACT ROUTE
        // ----------------------------------------------

        return (
            location.pathname ===
            item.path
        );
    };


    // ==================================================
    // UI
    // ==================================================

    return (
        <aside
            className="
                flex
                h-full
                min-h-screen
                w-[190px]
                flex-col
                bg-[#073763]
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

                {/* MENU ITEMS */}

                <div className="space-y-2">

                    {items.map(
                        (
                            item
                        ) => {

                            const active =
                                isItemActive(
                                    item
                                );


                            // ==================================
                            // DISABLED FUTURE FEATURE
                            // ==================================

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
                                            rounded-md
                                            px-3
                                            py-[10px]
                                            text-left
                                            text-[12px]
                                            font-medium
                                            text-slate-300
                                            opacity-60
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


                            // ==================================
                            // ACTIVE LINK
                            // ==================================

                            return (
                                <NavLink
                                    key={
                                        `${role}-${item.path}-${item.label}`
                                    }
                                    to={
                                        item.path
                                    }
                                    className={`
                                        flex
                                        items-center
                                        gap-3
                                        rounded-md
                                        px-3
                                        py-[10px]
                                        text-[12px]
                                        font-medium
                                        transition

                                        ${active
                                            ? "bg-[#1976e9] text-white shadow-sm"
                                            : "text-slate-200 hover:bg-white/10 hover:text-white"
                                        }
                                    `}
                                >

                                    <SidebarIcon
                                        type={
                                            item.icon
                                        }
                                    />


                                    <span>
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
                {/* TRAINEE INFORMATION CARD */}
                {/* ================================================= */}

                {role ===
                    "trainee" && (
                        <div
                            className="
                                mt-auto
                                pt-8
                            "
                        >

                            <div
                                className="
                                    overflow-hidden
                                    rounded-lg
                                    border
                                    border-white/10
                                    bg-[#0b416f]
                                "
                            >

                                <img
                                    src={
                                        singleTruck
                                    }
                                    alt="UK LogiWare truck"
                                    className="
                                        h-[145px]
                                        w-full
                                        object-cover
                                    "
                                />


                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-2
                                        px-3
                                        py-3
                                    "
                                >

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="
                                            mt-[1px]
                                            h-5
                                            w-5
                                            text-white
                                        "
                                    >
                                        <path d="M12 3 5 6v5c0 4.8 2.8 8 7 10 4.2-2 7-5.2 7-10V6l-7-3z" />

                                        <path d="m9 12 2 2 4-4" />
                                    </svg>


                                    <div>

                                        <p
                                            className="
                                                text-[11px]
                                                font-semibold
                                                text-white
                                            "
                                        >
                                            Our priority.
                                        </p>


                                        <p
                                            className="
                                                text-[10px]
                                                leading-4
                                                text-slate-200
                                            "
                                        >
                                            Your safety.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>
                    )}


                {/* ================================================= */}
                {/* TRAINER INFORMATION CARD */}
                {/* ================================================= */}

                {role ===
                    "trainer" && (
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
                                    border-white/10
                                    bg-[#0b416f]
                                    p-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-blue-500/20
                                        text-blue-300
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
                                    Trainer
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[10px]
                                        leading-4
                                        text-slate-300
                                    "
                                >
                                    Manage authorised training programmes
                                    and learning content.
                                </p>

                            </div>

                        </div>
                    )}


                {/* ================================================= */}
                {/* ADMIN INFORMATION CARD */}
                {/* ================================================= */}

                {role ===
                    "admin" && (
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
                                    border-white/10
                                    bg-[#0b416f]
                                    p-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-blue-500/20
                                        text-blue-300
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

                                        <path d="M12 8v8" />

                                        <path d="M8 12h8" />
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
                                    Administrator
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[10px]
                                        leading-4
                                        text-slate-300
                                    "
                                >
                                    User, programme, role, and training
                                    assignment management.
                                </p>

                            </div>

                        </div>
                    )}

            </nav>

        </aside>
    );
}


export default Sidebar;