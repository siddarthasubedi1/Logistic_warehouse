import {
    useNavigate,
} from "react-router-dom";


function AdminQuickActions({
    pendingUsers = 0,
}) {
    const navigate =
        useNavigate();


    const actions = [
        {
            title:
                "Create User Account",

            description:
                `${pendingUsers} pending ${pendingUsers === 1
                    ? "user"
                    : "users"
                }`,

            action:
                () =>
                    navigate(
                        "/admin/create-user"
                    ),

            icon:
                "create",
        },

        {
            title:
                "Manage Users",

            description:
                "Activate, deactivate or remove accounts",

            action:
                () =>
                    navigate(
                        "/admin/users"
                    ),

            icon:
                "users",
        },

        {
            title:
                "Training Programmes",

            description:
                "Create programmes and manage ordered learning content",

            action:
                () =>
                    navigate(
                        "/training-programmes"
                    ),

            icon:
                "training",
        },

        {
            title:
                "Training Assignments",

            description:
                "Manage required trainee programme assignments",

            action:
                () =>
                    navigate(
                        "/training-assignments"
                    ),

            icon:
                "assignment",
        },

        {
            title:
                "Panorama & Scenes",

            description:
                "Manage 360° scenes, images and navigation hotspots",

            action:
                () =>
                    navigate(
                        "/admin/panoramas"
                    ),

            icon:
                "panorama",
        },
    ];


    return (
        <section
            className="
                overflow-hidden
                rounded-xl
                border
                border-[#dbe4ef]
                bg-white
                shadow-[0_1px_3px_rgba(15,23,42,0.07)]
            "
        >
            <div
                className="
                    px-5
                    pb-2
                    pt-5
                "
            >
                <h2
                    className="
                        text-[14px]
                        font-bold
                        text-[#172033]
                    "
                >
                    Quick Actions
                </h2>


                <p
                    className="
                        mt-1
                        text-[9px]
                        text-[#7c8da6]
                    "
                >
                    Sprint 1 account controls and Sprint 2 training management.
                </p>
            </div>


            <div
                className="
                    space-y-3
                    p-5
                    pt-3
                "
            >
                {actions.map(
                    (action) => (
                        <button
                            key={
                                action.title
                            }
                            type="button"
                            onClick={
                                action.action
                            }
                            className="
                                flex
                                min-h-[74px]
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                border
                                border-[#dbe4ef]
                                bg-white
                                px-4
                                py-3
                                text-left
                                transition
                                hover:border-blue-200
                                hover:bg-blue-50/30
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-[#eef6ff]
                                    text-blue-600
                                "
                            >
                                <ActionIcon
                                    type={
                                        action.icon
                                    }
                                />
                            </div>


                            <div
                                className="
                                    min-w-0
                                    flex-1
                                "
                            >
                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        text-[#172033]
                                    "
                                >
                                    {action.title}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        leading-4
                                        text-[#7c8da6]
                                    "
                                >
                                    {action.description}
                                </p>
                            </div>


                            <span
                                className="
                                    text-[19px]
                                    font-light
                                    text-blue-600
                                "
                            >
                                ›
                            </span>
                        </button>
                    )
                )}


                <div
                    className="
                        flex
                        min-h-[74px]
                        items-center
                        gap-3
                        rounded-lg
                        border
                        border-blue-100
                        bg-[#eef6ff]
                        px-4
                        py-3
                    "
                >
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-white
                            text-blue-600
                            shadow-sm
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="
                                h-5
                                w-5
                            "
                        >
                            <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z" />

                            <path d="m9 12 2 2 4-4" />
                        </svg>
                    </div>


                    <div>
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                text-[#172033]
                            "
                        >
                            Access Control
                        </p>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                leading-4
                                text-[#64748b]
                            "
                        >
                            Admin routes are protected by role-based access control.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}


function ActionIcon({
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
            "h-5 w-5",
    };


    if (
        type ===
        "users"
    ) {
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
    }


    if (type === "training") {
        return (
            <svg {...props}>
                <rect x="4" y="4" width="6" height="16" rx="1" />
                <rect x="14" y="4" width="6" height="16" rx="1" />
                <path d="M7 8h0M17 8h0" />
            </svg>
        );
    }

    if (type === "assignment") {
        return (
            <svg {...props}>
                <path d="M9 5h6" />
                <path d="M9 3h6v4H9z" />
                <path d="M6 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1" />
                <path d="m8 14 2 2 5-5" />
            </svg>
        );
    }

    if (type === "panorama") {
        return (
            <svg {...props}>
                <path d="M3 12c0-4 4-7 9-7s9 3 9 7-4 7-9 7-9-3-9-7Z" />
                <path d="M12 5c2 2 3 4.3 3 7s-1 5-3 7c-2-2-3-4.3-3-7s1-5 3-7Z" />
                <path d="M3.5 12h17" />
            </svg>
        );
    }


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
}


export default AdminQuickActions;