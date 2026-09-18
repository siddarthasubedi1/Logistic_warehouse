import {
    NavLink,
} from "react-router-dom";

import Logo from "../layout/Logo";
import LogoutButton from "./LogoutButton";
import singleTruck from "../../images/single-truck.jpg";


function Icon({
    type,
}) {
    const props = {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "sidebar-icon",
    };


    switch (type) {

        case "dashboard":
            return (
                <svg {...props}>
                    <path d="M3 11.5 12 4l9 7.5" />
                    <path d="M5.5 10v10h13V10" />
                </svg>
            );


        case "user-add":
            return (
                <svg {...props}>
                    <circle
                        cx="9"
                        cy="8"
                        r="3"
                    />

                    <path d="M3.5 19c.6-3.5 2.5-5.5 5.5-5.5" />
                    <path d="M17 8v6" />
                    <path d="M14 11h6" />
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

                    <path d="M3.5 19c.6-3.5 2.5-5.5 5.5-5.5s4.9 2 5.5 5.5" />
                    <path d="M15 14c2.8.2 4.5 1.8 5 5" />
                </svg>
            );


        case "roles":
            return (
                <svg {...props}>
                    <circle
                        cx="8"
                        cy="8"
                        r="3"
                    />

                    <path d="M3.5 19c.5-3.5 2-5.5 4.5-5.5" />
                    <path d="m15 6 2 2 4-4" />
                    <path d="M15 14h6" />
                    <path d="M18 11v6" />
                </svg>
            );


        case "training":
            return (
                <svg {...props}>
                    <rect
                        x="4"
                        y="4"
                        width="6"
                        height="16"
                        rx="1"
                    />

                    <rect
                        x="14"
                        y="4"
                        width="6"
                        height="16"
                        rx="1"
                    />
                </svg>
            );


        case "assignment":
            return (
                <svg {...props}>
                    <rect
                        x="5"
                        y="3"
                        width="14"
                        height="18"
                        rx="2"
                    />

                    <path d="M9 8h6" />
                    <path d="M9 12h6" />
                    <path d="M9 16h4" />
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
                        rx="2"
                    />

                    <path d="M9 8h6" />
                    <path d="M9 12h6" />
                    <path d="M9 16h6" />
                </svg>
            );


        case "progress":
            return (
                <svg {...props}>
                    <path d="M5 19V9" />
                    <path d="M12 19V5" />
                    <path d="M19 19v-7" />
                </svg>
            );


        case "scenario":
            return (
                <svg {...props}>
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

                    <path d="M9.8 9a2.3 2.3 0 1 1 3.9 1.7c-1 .8-1.7 1.2-1.7 2.3" />

                    <path d="M12 17h.01" />
                </svg>
            );


        case "bell":
            return (
                <svg {...props}>
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
                    <path d="M10 19h4" />
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

                    <path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6" />
                </svg>
            );


        case "support":
            return (
                <svg {...props}>
                    <path d="M5 13v-2a7 7 0 0 1 14 0v2" />
                    <path d="M5 13H3v5h4v-5z" />
                    <path d="M19 13h2v5h-4v-5z" />
                </svg>
            );


        default:
            return null;
    }
}


function SidebarLink({
    to,
    label,
    icon,
    end = false,
    onNavigate,
}) {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onNavigate}
            className={({
                isActive,
            }) =>
                [
                    "sidebar-link",
                    isActive
                        ? "sidebar-link--active"
                        : "",
                ]
                    .filter(Boolean)
                    .join(" ")
            }
        >
            <Icon
                type={icon}
            />

            <span>
                {label}
            </span>
        </NavLink>
    );
}


function Sidebar({
    role,
    onNavigate,
}) {
    const normalizedRole =
        String(role || "")
            .trim()
            .toLowerCase();


    const adminLinks = [
        {
            to: "/admin",
            label: "Dashboard",
            icon: "dashboard",
            end: true,
        },

        {
            to: "/admin/create-user",
            label: "Create User",
            icon: "user-add",
        },

        {
            to: "/admin/users",
            label: "Manage Users",
            icon: "users",
        },

        {
            to: "/admin/roles",
            label: "Roles & Permissions",
            icon: "roles",
        },

        {
            to: "/training-programmes",
            label: "Training Programmes",
            icon: "training",
        },

        {
            to: "/training-assignments",
            label: "Training Assignments",
            icon: "assignment",
        },

        {
            to: "/admin/panoramas",
            label: "Panorama & Scenes",
            icon: "training",
        },

        {
            to: "/admin/audit-logs",
            label: "Audit Logs",
            icon: "audit",
        },
    ];


    const trainerLinks = [
        {
            to: "/trainer",
            label: "Dashboard",
            icon: "dashboard",
            end: true,
        },

        {
            to: "/trainer/profile",
            label: "Profile",
            icon: "profile",
        },
    ];


    const traineeLinks = [
        {
            to: "/trainee",
            label: "Dashboard",
            icon: "dashboard",
            end: true,
        },

        {
            to: "/my-training",
            label: "My Training",
            icon: "training",
        },

        {
            to: "/trainee/progress",
            label: "My Progress",
            icon: "progress",
        },


        {
            to: "/trainee/quizzes",
            label: "Quizzes",
            icon: "quiz",
        },

        {
            to: "/trainee/notifications",
            label: "Notifications",
            icon: "bell",
        },

        {
            to: "/trainee/profile",
            label: "Profile",
            icon: "profile",
        },

        {
            to: "/trainee/help",
            label: "Help Support",
            icon: "support",
        },
    ];


    let links =
        traineeLinks;

    if (
        normalizedRole ===
        "admin"
    ) {
        links =
            adminLinks;
    }

    if (
        normalizedRole ===
        "trainer"
    ) {
        links =
            trainerLinks;
    }


    const roleTitle =
        normalizedRole ===
            "admin"
            ? "Administrator"
            : normalizedRole ===
                "trainer"
                ? "Trainer"
                : "Trainee";


    const roleDescription =
        normalizedRole ===
            "admin"
            ? "User account and access management."
            : normalizedRole ===
                "trainer"
                ? "Training and trainee management."
                : "Safety training and learning.";


    return (
        <aside className="sidebar">

            {/* LOGO */}

            <div className="sidebar__logo">
                <Logo light />
            </div>


            {/* LINKS */}

            <nav className="sidebar__nav">

                <div className="sidebar__links">

                    {links.map(
                        (link) => (
                            <SidebarLink
                                key={
                                    link.to
                                }
                                {...link}
                                onNavigate={
                                    onNavigate
                                }
                            />
                        )
                    )}

                </div>


                <div className="sidebar__divider" />


                <LogoutButton />

            </nav>


            {/* ROLE INFORMATION */}

            <div className="sidebar__footer">
                {normalizedRole === "trainee" ? (
                    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.055]">
                        <img
                            src={singleTruck}
                            alt="UK LogiWare warehouse truck"
                            className="h-[148px] w-full object-cover"
                        />
                        <div className="flex items-start gap-2 px-3 py-3">
                            <div className="mt-0.5 text-[#8fc5ff]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                >
                                    <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>
                            <div>
                                <p className="m-0 text-[9px] font-bold text-white">
                                    Our priority.
                                </p>

                                <p className="m-0 mt-0.5 text-[8px] text-blue-100">
                                    Your safety.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="sidebar-role-card">
                        <div className="sidebar-role-card__icon">
                            <Icon
                                type={
                                    normalizedRole === "admin"
                                        ? "users"
                                        : "profile"
                                }
                            />
                        </div>

                        <p className="sidebar-role-card__title">
                            {roleTitle}
                        </p>

                        <p className="sidebar-role-card__description">
                            {roleDescription}
                        </p>
                    </div>
                )}
            </div>

        </aside>
    );
}


export default Sidebar;