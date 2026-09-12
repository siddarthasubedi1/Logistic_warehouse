import {
    useNavigate,
} from "react-router-dom";


function AdminQuickActions({
    pendingCount = 0,
}) {
    const navigate =
        useNavigate();


    const actions = [
        {
            title:
                "Create User Account",

            description:
                `${pendingCount} pending ${pendingCount ===
                    1
                    ? "user"
                    : "users"
                }`,

            icon:
                "create",

            path:
                "/admin/create-user",
        },

        {
            title:
                "Manage Users",

            description:
                "Edit, activate, deactivate or remove accounts",

            icon:
                "users",

            path:
                "/admin/users",
        },

        {
            title:
                "View Audit Logs",

            description:
                "Review important account and system activity",

            icon:
                "audit",

            path:
                "/admin/audit-logs",
        },
    ];


    return (
        <section
            className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            <div
                className="
                    border-b
                    border-slate-100
                    px-4
                    py-4
                    sm:px-5
                "
            >
                <h2
                    className="
                        text-[12px]
                        font-bold
                        text-[#172033]
                    "
                >
                    Quick Actions
                </h2>


                <p
                    className="
                        mt-1
                        text-[8px]
                        font-medium
                        text-slate-500
                    "
                >
                    Common administrator tasks.
                </p>
            </div>


            <div
                className="
                    space-y-3
                    p-4
                    sm:p-5
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
                            onClick={() =>
                                navigate(
                                    action.path
                                )
                            }
                            className="
                                group
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                border
                                border-transparent
                                bg-white
                                px-3
                                py-3
                                text-left
                                transition
                                hover:border-blue-100
                                hover:bg-blue-50/50
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
                                        text-[9px]
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    {action.title}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[7px]
                                        font-medium
                                        leading-4
                                        text-slate-500
                                    "
                                >
                                    {
                                        action.description
                                    }
                                </p>
                            </div>


                            <span
                                className="
                                    shrink-0
                                    text-[15px]
                                    font-semibold
                                    text-blue-600
                                    transition
                                    group-hover:translate-x-0.5
                                "
                            >
                                ›
                            </span>
                        </button>
                    )
                )}
            </div>
        </section>
    );
}


function ActionIcon({
    type,
}) {
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
                className="h-4 w-4"
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
                className="h-4 w-4"
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

                <path d="M15 15c3 0 5 1.5 6 5" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
        >
            <path d="M6 3h12v18H6z" />

            <path d="M9 8h6" />

            <path d="M9 12h6" />

            <path d="M9 16h4" />
        </svg>
    );
}


export default AdminQuickActions;