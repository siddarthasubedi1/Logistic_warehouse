import {
    useEffect,
    useState,
} from "react";

import api from "../../services/api";

function ManageUsersTable() {
    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [actionUserId, setActionUserId] =
        useState(null);

    // ======================================================
    // LOAD USERS
    // ======================================================

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/admin/users"
            );

            setUsers(response.data);
        } catch (error) {
            console.error(
                "Users error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // ======================================================
    // DEACTIVATE
    // ======================================================

    const deactivateUser = async (
        userId
    ) => {
        try {
            setActionUserId(userId);
            setError("");
            setMessage("");

            await api.patch(
                `/admin/users/${userId}/deactivate`
            );

            setMessage(
                "User deactivated successfully."
            );

            await loadUsers();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to deactivate user."
            );
        } finally {
            setActionUserId(null);
        }
    };

    // ======================================================
    // REACTIVATE
    // ======================================================

    const reactivateUser = async (
        userId
    ) => {
        try {
            setActionUserId(userId);
            setError("");
            setMessage("");

            await api.patch(
                `/admin/users/${userId}/reactivate`
            );

            setMessage(
                "User reactivated successfully."
            );

            await loadUsers();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to reactivate user."
            );
        } finally {
            setActionUserId(null);
        }
    };

    // ======================================================
    // DELETE
    // ======================================================

    const deleteUser = async (
        userId,
        userName
    ) => {
        const confirmed =
            window.confirm(
                `Delete ${userName}? This action cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        try {
            setActionUserId(userId);
            setError("");
            setMessage("");

            await api.delete(
                `/admin/users/${userId}`
            );

            setMessage(
                "User deleted successfully."
            );

            await loadUsers();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to delete user."
            );
        } finally {
            setActionUserId(null);
        }
    };

    return (
        <div className="space-y-5">
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Trainer & Trainee Accounts
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage system access
                            status.
                        </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
                        {users.length} Users
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                        Loading users...
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                        No Trainer or Trainee
                        accounts found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px]">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <th className="px-6 py-4">
                                        User
                                    </th>

                                    <th className="px-6 py-4">
                                        Username
                                    </th>

                                    <th className="px-6 py-4">
                                        Role
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {users.map(
                                    (user) => (
                                        <tr
                                            key={
                                                user._id
                                            }
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {
                                                        user.firstName
                                                    }{" "}
                                                    {
                                                        user.lastName
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {
                                                        user.email
                                                    }
                                                </p>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {
                                                    user.username
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-600">
                                                    {
                                                        user.role
                                                    }
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    status={
                                                        user.status
                                                    }
                                                />
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    {user.status ===
                                                        "active" ? (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                actionUserId ===
                                                                user._id
                                                            }
                                                            onClick={() =>
                                                                deactivateUser(
                                                                    user._id
                                                                )
                                                            }
                                                            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                                                        >
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                actionUserId ===
                                                                user._id
                                                            }
                                                            onClick={() =>
                                                                reactivateUser(
                                                                    user._id
                                                                )
                                                            }
                                                            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                                                        >
                                                            Reactivate
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            actionUserId ===
                                                            user._id
                                                        }
                                                        onClick={() =>
                                                            deleteUser(
                                                                user._id,
                                                                `${user.firstName} ${user.lastName}`
                                                            )
                                                        }
                                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const active =
        status === "active";

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${active
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
                }`}
        >
            <span
                className={`h-2 w-2 rounded-full ${active
                    ? "bg-emerald-500"
                    : "bg-slate-400"
                    }`}
            />

            {active
                ? "Active"
                : "Deactivated"}
        </span>
    );
}

export default ManageUsersTable;