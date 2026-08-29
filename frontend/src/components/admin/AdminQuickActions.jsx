import {
    useNavigate,
} from "react-router-dom";


function AdminQuickActions({
    pendingCount = 0,
}) {
    const navigate =
        useNavigate();


    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div>

                <h2 className="text-sm font-bold text-slate-900">
                    Quick Actions
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                    Common Sprint 1 administrator actions.
                </p>

            </div>


            <div className="mt-5 space-y-3">

                <ActionButton
                    type="create"
                    title="Create User Account"
                    description={`${pendingCount} pending user${pendingCount === 1
                        ? ""
                        : "s"
                        }`}
                    onClick={() =>
                        navigate(
                            "/admin/create-user"
                        )
                    }
                />


                <ActionButton
                    type="users"
                    title="Manage Users"
                    description="Activate, deactivate or remove accounts"
                    onClick={() =>
                        navigate(
                            "/admin/users"
                        )
                    }
                />


                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">

                    <div className="flex gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-blue-600">

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

                            <p className="text-[10px] font-semibold text-slate-700">
                                Access Control
                            </p>

                            <p className="mt-1 text-[9px] leading-4 text-slate-500">
                                Admin routes are
                                protected by role-based
                                access control.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}


function ActionButton({
    type,
    title,
    description,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/40"
        >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                {type === "create" ? (
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


            <div className="min-w-0 flex-1">

                <p className="text-[11px] font-semibold text-slate-800">
                    {title}
                </p>

                <p className="mt-1 text-[9px] leading-4 text-slate-500">
                    {description}
                </p>

            </div>


            <span className="text-xl text-blue-600">
                ›
            </span>

        </button>
    );
}


export default AdminQuickActions;