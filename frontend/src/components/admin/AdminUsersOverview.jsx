import {
    useNavigate,
} from "react-router-dom";


function AdminUsersOverview({
    loading,
    users,
    trainers,
    trainees,
}) {
    const navigate =
        useNavigate();


    const recentUsers =
        [...users]
            .sort((first, second) => {
                return (
                    new Date(
                        second.createdAt || 0
                    ) -
                    new Date(
                        first.createdAt || 0
                    )
                );
            })
            .slice(0, 5);


    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* HEADER */}

            <div className="flex items-center justify-between gap-4">

                <div>

                    <h2 className="text-sm font-bold text-slate-900">
                        User Overview
                    </h2>

                    <p className="mt-1 text-[10px] text-slate-500">
                        Recently generated Trainer
                        and Trainee accounts.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/users"
                        )
                    }
                    className="text-[10px] font-semibold text-blue-600 hover:underline"
                >
                    View All
                </button>

            </div>


            {/* ROLE SUMMARY */}

            <div className="mt-5 grid grid-cols-2 gap-3">

                <RoleCard
                    title="Trainees"
                    value={trainees}
                    type="trainee"
                />


                <RoleCard
                    title="Trainers"
                    value={trainers}
                    type="trainer"
                />

            </div>


            {/* TABLE */}

            <div className="mt-5 overflow-x-auto">

                <table className="w-full min-w-[600px] border-collapse">

                    <thead>

                        <tr className="border-b border-slate-200 text-left">

                            <TableHeading>
                                User
                            </TableHeading>

                            <TableHeading>
                                Role
                            </TableHeading>

                            <TableHeading>
                                Username
                            </TableHeading>

                            <TableHeading>
                                Status
                            </TableHeading>

                        </tr>

                    </thead>


                    <tbody>

                        {loading ? (
                            <tr>

                                <td
                                    colSpan="4"
                                    className="px-2 py-8 text-center text-xs text-slate-400"
                                >
                                    Loading users...
                                </td>

                            </tr>
                        ) : recentUsers.length ===
                            0 ? (
                            <tr>

                                <td
                                    colSpan="4"
                                    className="px-2 py-8 text-center text-xs text-slate-400"
                                >
                                    No generated users
                                    found.
                                </td>

                            </tr>
                        ) : (
                            recentUsers.map(
                                (user) => (
                                    <UserRow
                                        key={
                                            user._id ||
                                            user.id ||
                                            user.email
                                        }
                                        user={
                                            user
                                        }
                                    />
                                )
                            )
                        )}

                    </tbody>

                </table>

            </div>

        </section>
    );
}


function RoleCard({
    title,
    value,
    type,
}) {
    return (
        <div className="flex items-center gap-3 rounded-lg bg-[#f7f9fc] p-3">

            <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${type === "trainer"
                    ? "bg-violet-100 text-violet-600"
                    : "bg-blue-100 text-blue-600"
                    }`}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                >
                    <circle
                        cx="12"
                        cy="8"
                        r="4"
                    />

                    <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
                </svg>
            </div>


            <div>

                <p className="text-lg font-bold text-slate-800">
                    {value}
                </p>

                <p className="text-[9px] text-slate-500">
                    {title}
                </p>

            </div>

        </div>
    );
}


function TableHeading({
    children,
}) {
    return (
        <th className="px-2 py-3 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
            {children}
        </th>
    );
}


function UserRow({
    user,
}) {
    const fullName =
        `${user.firstName || ""} ${user.lastName || ""
            }`.trim() || "User";


    const initial =
        user.firstName
            ?.charAt(0)
            ?.toUpperCase() || "U";


    return (
        <tr className="border-b border-slate-100 last:border-b-0">

            <td className="px-2 py-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                        {initial}
                    </div>


                    <div>

                        <p className="text-[10px] font-semibold text-slate-700">
                            {fullName}
                        </p>

                        <p className="mt-[2px] text-[8px] text-slate-400">
                            {user.email}
                        </p>

                    </div>

                </div>

            </td>


            <td className="px-2 py-4">

                <span
                    className={`rounded-full px-2 py-1 text-[8px] font-semibold capitalize ${user.role ===
                        "trainer"
                        ? "bg-violet-50 text-violet-600"
                        : user.role ===
                            "admin"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                >
                    {user.role}
                </span>

            </td>


            <td className="px-2 py-4 text-[9px] text-slate-500">
                {user.username ||
                    "—"}
            </td>


            <td className="px-2 py-4">

                <span
                    className={`rounded-full px-2 py-1 text-[8px] font-semibold ${user.status ===
                        "active"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                        }`}
                >
                    {user.status ===
                        "active"
                        ? "Active"
                        : "Deactivated"}
                </span>

            </td>

        </tr>
    );
}


export default AdminUsersOverview;