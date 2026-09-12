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
                "Review account and system activity",

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

            {/* HEADER */}

            <div
                className="
                    border-b
                    border-slate-100
                    px-5
                    py-4
                "
            >
                <h2
                    className="
                        text-[12px]
                        font-semibold
                        text-slate-800
                    "
                >
                    Quick Actions
                </h2>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-400
                    "
                >
                    Common administrator tasks.
                </p>
            </div>


            {/* ACTIONS */}

            <div
                className="
                    space-y-3
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
                                border-slate-200
                                bg-white
                                px-4
                                py-3
                                text-left
                                transition
                                hover:border-blue-200
                                hover:bg-slate-50
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-50
                                    text-blue-600
                                "
                            >
                                <QuickIcon
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
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    {action.title}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        truncate
                                        text-[7px]
                                        text-slate-400
                                    "
                                >
                                    {action.description}
                                </p>
                            </div>


                            <span
                                className="
                                    text-[17px]
                                    text-blue-500
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


function QuickIcon({
    type,
}) {
    const className =
        "h-[17px] w-[17px]";


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
        </svg>
    );
}


export default AdminQuickActions;