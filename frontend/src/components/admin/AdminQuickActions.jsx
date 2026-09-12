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
                `${pendingUsers} pending ${pendingUsers ===
                    1
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
                "Edit, activate, deactivate or remove accounts",

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
                "View Audit Logs",

            description:
                "Review important account and system activity",

            action:
                () =>
                    navigate(
                        "/admin/audit-logs"
                    ),

            icon:
                "audit",
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
                shadow-[0_1px_3px_rgba(15,23,42,0.08)]
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
                    Common administrator tasks.
                </p>
            </div>


            <div
                className="
                    space-y-2
                    p-5
                "
            >
                {actions.map(
                    (
                        action
                    ) => (
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
                                min-h-[73px]
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                border
                                border-[#e2e8f0]
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
                                    bg-blue-50
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
                                    text-[20px]
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
                        mt-3
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        border
                        border-blue-100
                        bg-[#eef6ff]
                        px-4
                        py-4
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
                            Administrative routes are protected by role-based access control.
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

        className:
            "h-5 w-5",
    };


    if (
        type ===
        "audit"
    ) {
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
    }


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