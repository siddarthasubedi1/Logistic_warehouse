import {
    useNavigate,
} from "react-router-dom";


function AdminQuickActions({
    pendingCount = 0,
}) {
    const navigate =
        useNavigate();


    return (
        <section
            className="
                overflow-hidden
                rounded-2xl
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
                    border-slate-200
                    bg-gradient-to-r
                    from-slate-50
                    to-blue-50/40
                    px-5
                    py-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-100
                            text-blue-700
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


                    <div>

                        <h2
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Quick Actions
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                text-slate-500
                            "
                        >
                            Common administrator tasks.
                        </p>

                    </div>

                </div>

            </div>


            {/* ACTIONS */}

            <div
                className="
                    grid
                    gap-3
                    p-5
                    sm:grid-cols-2
                    lg:grid-cols-1
                "
            >

                <ActionButton
                    type="create"
                    title="Create User Account"
                    description={`${pendingCount} pending user${pendingCount ===
                        1
                        ? ""
                        : "s"
                        } waiting for credentials`}
                    onClick={() =>
                        navigate(
                            "/admin/create-user"
                        )
                    }
                />


                <ActionButton
                    type="users"
                    title="Manage Users"
                    description="Edit, activate, deactivate or remove accounts"
                    onClick={() =>
                        navigate(
                            "/admin/users"
                        )
                    }
                />


                <ActionButton
                    type="audit"
                    title="View Audit Logs"
                    description="Review important account and system activity"
                    onClick={() =>
                        navigate(
                            "/admin/audit-logs"
                        )
                    }
                />


                {/* ACCESS CONTROL */}

                <div
                    className="
                        rounded-xl
                        border
                        border-blue-100
                        bg-gradient-to-r
                        from-blue-50
                        to-cyan-50
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
                                h-9
                                w-9
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
                                className="h-4 w-4"
                            >
                                <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                <path d="m9 12 2 2 4-4" />
                            </svg>

                        </div>


                        <div>

                            <p
                                className="
                                    text-[11px]
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Protected Administration
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    leading-4
                                    text-slate-500
                                "
                            >
                                Administrative routes use role-based access control to protect user and training management.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}


// ======================================================
// QUICK ACTION BUTTON
// ======================================================

function ActionButton({
    type,
    title,
    description,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className="
                group
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                text-left
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-blue-200
                hover:bg-blue-50/40
                hover:shadow-sm
            "
        >

            <div
                className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    transition
                    group-hover:bg-blue-100
                "
            >

                {type ===
                    "create" ? (

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <circle
                            cx="9"
                            cy="8"
                            r="4"
                        />

                        <path d="M3 21c.5-4 2.7-6 6-6" />

                        <path d="M18 13v8" />

                        <path d="M14 17h8" />
                    </svg>

                ) : type ===
                    "audit" ? (

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <path d="M7 3h10v4H7z" />

                        <path d="M5 5h14v16H5z" />

                        <path d="M8 11h8" />

                        <path d="M8 15h8" />

                        <path d="M8 19h5" />
                    </svg>

                ) : (

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
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
                )}

            </div>


            <div
                className="
                    min-w-0
                    flex-1
                "
            >

                <p
                    className="
                        text-[11px]
                        font-semibold
                        text-slate-800
                    "
                >
                    {title}
                </p>


                <p
                    className="
                        mt-1
                        text-[9px]
                        leading-4
                        text-slate-500
                    "
                >
                    {description}
                </p>

            </div>


            <span
                className="
                    text-xl
                    text-blue-500
                    transition-transform
                    group-hover:translate-x-1
                "
            >
                ›
            </span>

        </button>
    );
}


export default AdminQuickActions;