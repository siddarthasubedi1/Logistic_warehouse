import {
    NavLink,
} from "react-router-dom";

import Logo from "../layout/Logo";
import LogoutButton from "./LogoutButton";


function Icon({
    type,
}) {
    const className =
        "h-[17px] w-[17px] shrink-0";


    const common = {
        viewBox:
            "0 0 24 24",

        fill:
            "none",

        stroke:
            "currentColor",

        strokeWidth:
            "1.8",

        className,
    };


    if (
        type ===
        "dashboard"
    ) {
        return (
            <svg {...common}>
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
            <svg {...common}>
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
            <svg {...common}>
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
    }


    if (
        type ===
        "roles"
    ) {
        return (
            <svg {...common}>
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
    }


    if (
        type ===
        "training"
    ) {
        return (
            <svg {...common}>
                <path d="M4 5h7v14H4z" />
                <path d="M13 5h7v14h-7z" />
            </svg>
        );
    }


    if (
        type ===
        "audit"
    ) {
        return (
            <svg {...common}>
                <path d="M6 3h12v18H6z" />
                <path d="M9 8h6" />
                <path d="M9 12h6" />
                <path d="M9 16h4" />
            </svg>
        );
    }


    if (
        type ===
        "profile"
    ) {
        return (
            <svg {...common}>
                <circle
                    cx="12"
                    cy="8"
                    r="3"
                />
                <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
            </svg>
        );
    }


    return (
        <svg {...common}>
            <circle
                cx="12"
                cy="12"
                r="9"
            />
        </svg>
    );
}


function Sidebar({
    role,
    onNavigate,
}) {
    const normalizedRole =
        String(
            role ||
            ""
        ).toLowerCase();


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
                "Training Programmes",
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
                ? "Trainer Access"
                : "Trainee Access";


    const footerText =
        normalizedRole ===
            "admin"
            ? "User account and access management."
            : normalizedRole ===
                "trainer"
                ? "Manage assigned safety training."
                : "Access your safety training.";


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
                <Logo light />
            </div>


            {/* LINKS */}

            <nav
                className="
                    flex-1
                    space-y-1
                    overflow-y-auto
                    px-3
                    py-5
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
                                flex
                                min-h-[42px]
                                items-center
                                gap-3
                                rounded-md
                                px-3
                                py-2.5
                                text-[9px]
                                font-semibold
                                transition

                                ${isActive
                                    ? "bg-[#1478d4] text-white"
                                    : "text-white/90 hover:bg-white/10 hover:text-white"
                                }
                            `}
                        >
                            <Icon
                                type={
                                    item.icon
                                }
                            />

                            <span>
                                {
                                    item.label
                                }
                            </span>
                        </NavLink>
                    )
                )}


                <div
                    className="
                        my-4
                        border-t
                        border-white/10
                    "
                />


                <LogoutButton />
            </nav>


            {/* FOOTER */}

            <div
                className="
                    p-3
                "
            >
                <div
                    className="
                        rounded-lg
                        border
                        border-white/15
                        bg-white/[0.05]
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
                            bg-[#1769aa]
                            text-white
                        "
                    >
                        <Icon
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
                            text-[9px]
                            font-bold
                            text-white
                        "
                    >
                        {footerTitle}
                    </p>


                    <p
                        className="
                            mt-1
                            text-[7px]
                            leading-4
                            text-white/75
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