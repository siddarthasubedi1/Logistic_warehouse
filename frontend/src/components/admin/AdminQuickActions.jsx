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
                    Common Sprint 1 administrator actions.
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