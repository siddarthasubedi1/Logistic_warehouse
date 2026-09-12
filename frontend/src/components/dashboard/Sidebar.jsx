import {
    NavLink,
} from "react-router-dom";

import Logo from "../layout/Logo";
import LogoutButton from "./LogoutButton";


function SidebarIcon({
    type,
}) {
    const props = {
        viewBox:
            "0 0 24 24",

        fill:
            "none",

        stroke:
            "currentColor",

        strokeWidth:
            "1.8",

        strokeLinecap:
            "round",

        strokeLinejoin:
            "round",

        className:
            "h-[18px] w-[18px] shrink-0",
    };


    switch (
    type
    ) {
        case "dashboard":
            return (
                <svg {...props}>
                    <path d="M3 11.5 12 4l9 7.5" />

                    <path d="M5.5 10v10h13V10" />
                </svg>
            );


        case "create":
            return (
                <svg {...props}>
                    <circle
                        cx="9"
                        cy="8"
                        r="3"
                    />

                    <path d="M3 20c.6-4 2.6-6 6-6" />

                    <path d="M18 13v8" />

                    <path d="M14 17h8" />
                </svg>
            );


        case "users":
            return (
                <svg {...props}>
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

                    <path d="M15 15c3 0 5 1.5 6 5" />
                </svg>
            );


        case "roles":
            return (
                <svg {...props}>
                    <circle
                        cx="8"
                        cy="7"
                        r="3"
                    />

                    <path d="M3 20c.5-4 2.3-6 5-6" />

                    <path d="m15 8 2 2 4-5" />

                    <path d="M14 16h7" />
                </svg>
            );


        case "training":
            return (
                <svg {...props}>
                    <rect
                        x="4"
                        y="5"
                        width="6"
                        height="14"
                        rx="1"
                    />

                    <rect
                        x="14"
                        y="5"
                        width="6"
                        height="14"
                        rx="1"
                    />
                </svg>
            );


        case "progress":
            return (
                <svg {...props}>
                    <path d="M5 20V11" />

                    <path d="M12 20V4" />

                    <path d="M19 20v-7" />
                </svg>
            );


        case "scenario":
            return (
                <svg {...props}>
                    <circle
                        cx="12"
                        cy="12"
                        r="7"
                    />

                    <circle
                        cx="12"
                        cy="12"
                        r="2"
                    />

                    <path d="M12 3v2" />

                    <path d="M12 19v2" />

                    <path d="M3 12h2" />

                    <path d="M19 12h2" />
                </svg>
            );


        case "quiz":
            return (
                <svg {...props}>
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                    />

                    <path d="M9.8 9.5a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.2.9-1.2 1.8" />

                    <path d="M12 17h.01" />
                </svg>
            );


        case "notification":
            return (
                <svg {...props}>
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

                    <path d="M10 21h4" />
                </svg>
            );


        case "profile":
            return (
                <svg {...props}>
                    <circle
                        cx="12"
                        cy="8"
                        r="3"
                    />

                    <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                </svg>
            );


        case "help":
            return (
                <svg {...props}>
                    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />

                    <path d="M4 14v4h3v-6H4" />

                    <path d="M20 14v4h-3v-6h3" />
                </svg>
            );


        case "audit":
            return (
                <svg {...props}>
                    <rect
                        x="6"
                        y="3"
                        width="12"
                        height="18"
                        rx="1"
                    />

                    <path d="M9 8h6" />

                    <path d="M9 12h6" />

                    <path d="M9 16h4" />
                </svg>
            );


        default:
            return (
                <svg {...props}>
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                    />
                </svg>
            );
    }
}


function Sidebar({
    role,
    onNavigate,
}) {
    const normalizedRole =
        String(
            role ||
            ""
        )
            .trim()
            .toLowerCase();


    const adminLinks = [
        {
            to:
                "/admin",

            label:
                "Dashboard",

            icon:
                "dashboard",

            end:
                true,
        },

        {
            to:
                "/admin/create-user",

            label:
                "Create User",

            icon:
                "create",
        },

        {
            to:
                "/admin/users",

            label:
                "Manage Users",

            icon:
                "users",
        },

        {
            to:
                "/admin/roles",

            label:
                "Roles & Permissions",

            icon:
                "roles",
        },

        {
            to:
                "/training-programmes",

            label:
                "Training Programmes",

            icon:
                "training",
        },

        {
            to:
                "/training-assignments",

            label:
                "Training Assignments",

            icon:
                "training",
        },

        {
            to:
                "/admin/audit-logs",

            label:
                "Audit Logs",

            icon:
                "audit",
        },
    ];


    const trainerLinks = [
        {
            to:
                "/trainer",

            label:
                "Dashboard",

            icon:
                "dashboard",

            end:
                true,
        },

        {
            to:
                "/training-programmes",

            label:
                "Training Programme",

            icon:
                "training",
        },

        {
            to:
                "/trainer/profile",

            label:
                "Profile",

            icon:
                "profile",
        },
    ];


    const traineeLinks = [
        {
            to:
                "/trainee",

            label:
                "Dashboard",

            icon:
                "dashboard",

            end:
                true,
        },

        {
            to:
                "/my-training",

            label:
                "My Training",

            icon:
                "training",
        },

        {
            to:
                "/trainee/profile",

            label:
                "Profile",

            icon:
                "profile",
        },
    ];


    const links =
        normalizedRole ===
            "admin"
            ? adminLinks
            : normalizedRole ===
                "trainer"
                ? trainerLinks
                : traineeLinks;


    const footerTitle =
        normalizedRole ===
            "admin"
            ? "Administrator"
            : normalizedRole ===
                "trainer"
                ? "Trainer"
                : "Trainee";


    const footerText =
        normalizedRole ===
            "admin"
            ? "User account and access management."
            : normalizedRole ===
                "trainer"
                ? "Training and trainee management."
                : "Workplace safety training access.";


    return (
        <aside
            className="
                flex
                h-full
                min-h-screen
                flex-col
                bg-[#073763]
                text-white
            "
        >
            {/* LOGO */}

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


            {/* NAVIGATION */}

            <nav
                className="
                    flex-1
                    overflow-y-auto
                    px-3
                    py-5
                "
            >
                <div
                    className="
                        space-y-1
                    "
                >
                    {links.map(
                        (
                            item
                        ) => (
                            <NavLink
                                key={
                                    item.to
                                }
                                to={
                                    item.to
                                }
                                end={
                                    item.end
                                }
                                onClick={
                                    onNavigate
                                }
                                className={({
                                    isActive,
                                }) => `
                                    group
                                    flex
                                    min-h-[46px]
                                    items-center
                                    gap-3
                                    rounded-md
                                    px-3
                                    py-2.5
                                    text-[13px]
                                    font-medium
                                    transition-all
                                    duration-150

                                    ${isActive
                                        ? "bg-[#1677df] text-white shadow-sm"
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
                                    "
                                >
                                    {item.label}
                                </span>
                            </NavLink>
                        )
                    )}
                </div>


                <div
                    className="
                        my-5
                        border-t
                        border-white/10
                    "
                />


                <LogoutButton />
            </nav>


            {/* BOTTOM ROLE CARD */}

            <div
                className="
                    mt-auto
                    p-3
                "
            >
                <div
                    className="
                        rounded-lg
                        border
                        border-[#2c6b9e]
                        bg-[#0b4f87]
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
                            rounded-lg
                            bg-[#1769aa]
                            text-[#9fd2ff]
                        "
                    >
                        <SidebarIcon
                            type={
                                normalizedRole ===
                                    "admin"
                                    ? "users"
                                    : "profile"
                            }
                        />
                    </div>


                    <p
                        className="
                            mt-3
                            text-[12px]
                            font-bold
                            text-white
                        "
                    >
                        {footerTitle}
                    </p>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            leading-4
                            text-slate-200
                        "
                    >
                        {footerText}
                    </p>
                </div>
            </div>
        </aside>
    );
}


export default Sidebar;