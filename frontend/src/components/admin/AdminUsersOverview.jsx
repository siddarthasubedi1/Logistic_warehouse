import {
    useNavigate,
} from "react-router-dom";

import ActionButton from "../ui/ActionButton";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";

import {
    getUserDisplayName,
} from "../../utils/training";


function AdminUsersOverview({
    loading = false,
    users = [],
    trainers = 0,
    trainees = 0,
}) {
    const navigate =
        useNavigate();


    // ======================================================
    // MOST RECENT USERS
    // ======================================================

    const recentUsers =
        [...users]
            .sort(
                (
                    first,
                    second
                ) =>
                    new Date(
                        second.createdAt ||
                        0
                    ) -
                    new Date(
                        first.createdAt ||
                        0
                    )
            )
            .slice(
                0,
                5
            );


    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex items-start justify-between gap-4">

                <div>
                    <h2 className="text-sm font-bold text-slate-900">
                        User Overview
                    </h2>


                    <p className="mt-1 text-[11px] text-slate-500">
                        Recently generated Trainer and Trainee accounts.
                    </p>
                </div>


                <ActionButton
                    variant="secondary"
                    className="px-3 py-2"
                    onClick={() =>
                        navigate(
                            "/admin/users"
                        )
                    }
                >
                    View All
                </ActionButton>

            </div>


            {/* ================================================= */}
            {/* COUNTS */}
            {/* ================================================= */}

            <div className="mt-5 grid grid-cols-2 gap-3">

                <RoleSummary
                    title="Trainees"
                    value={
                        trainees
                    }
                />


                <RoleSummary
                    title="Trainers"
                    value={
                        trainers
                    }
                />

            </div>


            {/* ================================================= */}
            {/* USERS */}
            {/* ================================================= */}

            <div className="mt-5">

                {loading ? (
                    <p className="py-8 text-center text-xs text-slate-400">
                        Loading users...
                    </p>
                ) : recentUsers.length ===
                    0 ? (
                    <EmptyState
                        title="No users found."
                        description="Generated Trainer and Trainee accounts will appear here."
                    />
                ) : (
                    <div className="overflow-x-auto">

                        <table className="min-w-[600px] w-full">

                            <thead>
                                <tr className="border-b border-slate-200 text-left text-[9px] font-semibold uppercase tracking-wide text-slate-400">

                                    <th className="px-2 py-3">
                                        User
                                    </th>

                                    <th className="px-2 py-3">
                                        Role
                                    </th>

                                    <th className="px-2 py-3">
                                        Username
                                    </th>

                                    <th className="px-2 py-3">
                                        Status
                                    </th>

                                </tr>
                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {recentUsers.map(
                                    (
                                        user
                                    ) => (
                                        <tr
                                            key={
                                                user._id ||
                                                user.email
                                            }
                                        >
                                            <td className="px-2 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                                                        {getUserDisplayName(
                                                            user,
                                                            "U"
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>


                                                    <div>
                                                        <p className="text-[10px] font-semibold text-slate-700">
                                                            {getUserDisplayName(
                                                                user,
                                                                "User"
                                                            )}
                                                        </p>


                                                        <p className="mt-[2px] text-[8px] text-slate-400">
                                                            {user.email ||
                                                                "—"}
                                                        </p>
                                                    </div>

                                                </div>

                                            </td>


                                            <td className="px-2 py-4">
                                                <StatusBadge
                                                    status={
                                                        user.role
                                                    }
                                                />
                                            </td>


                                            <td className="px-2 py-4 text-[9px] text-slate-500">
                                                {user.username ||
                                                    "—"}
                                            </td>


                                            <td className="px-2 py-4">
                                                <StatusBadge
                                                    status={
                                                        user.status
                                                    }
                                                />
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </section>
    );
}


function RoleSummary({
    title,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xl font-bold text-slate-800">
                {value}
            </p>


            <p className="mt-1 text-[10px] font-medium text-slate-500">
                {title}
            </p>

        </div>
    );
}


export default AdminUsersOverview;