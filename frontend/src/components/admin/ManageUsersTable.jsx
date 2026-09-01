import {
    useEffect,
    useRef,
    useState,
} from "react";

import api from "../../services/api";


function ManageUsersTable({
    selectedUserId = null,
    passwordResetRequest = null,
}) {
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

    const [resetCredentials, setResetCredentials] =
        useState(null);

    const selectedRowRef =
        useRef(null);


    // ======================================================
    // LOAD USERS
    // ======================================================

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");


            const response =
                await api.get(
                    "/admin/users"
                );


            const usersData =
                Array.isArray(
                    response.data
                )
                    ? response.data
                    : response.data
                        ?.users || [];


            setUsers(
                usersData
            );

        } catch (error) {
            console.error(
                "Users error:",
                error
            );


            setError(
                error.response?.data
                    ?.message ||
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
    // SCROLL TO SELECTED USER
    // ======================================================

    useEffect(() => {
        if (
            !loading &&
            selectedUserId &&
            selectedRowRef.current
        ) {
            selectedRowRef.current
                .scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
        }
    }, [
        loading,
        selectedUserId,
    ]);


    // ======================================================
    // DEACTIVATE
    // ======================================================

    const deactivateUser = async (
        userId
    ) => {
        try {
            setActionUserId(
                userId
            );

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
                error.response?.data
                    ?.message ||
                "Unable to deactivate user."
            );

        } finally {
            setActionUserId(
                null
            );
        }
    };


    // ======================================================
    // REACTIVATE
    // ======================================================

    const reactivateUser = async (
        userId
    ) => {
        try {
            setActionUserId(
                userId
            );

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
                error.response?.data
                    ?.message ||
                "Unable to reactivate user."
            );

        } finally {
            setActionUserId(
                null
            );
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
            setActionUserId(
                userId
            );

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
                error.response?.data
                    ?.message ||
                "Unable to delete user."
            );

        } finally {
            setActionUserId(
                null
            );
        }
    };


    // ======================================================
    // CHECK PENDING RESET REQUEST
    // ======================================================

    const hasPendingResetRequest = (
        user
    ) => {
        if (
            !selectedUserId ||
            !passwordResetRequest
        ) {
            return false;
        }


        return (
            String(user._id) ===
            String(selectedUserId) &&
            passwordResetRequest.status ===
            "pending"
        );
    };


    // ======================================================
    // RESET PASSWORD
    // ======================================================

    const resetPassword = async (
        user
    ) => {
        const fullName =
            `${user.firstName || ""} ${user.lastName || ""}`.trim();


        const confirmed =
            window.confirm(
                `Reset the password for ${fullName || user.username}? A new temporary password will be generated.`
            );


        if (!confirmed) {
            return;
        }


        try {
            setActionUserId(
                user._id
            );

            setError("");
            setMessage("");

            setResetCredentials(
                null
            );


            const response =
                await api.post(
                    `/admin/users/${user._id}/reset-password`
                );


            const credentials =
                response.data
                    ?.credentials;


            if (
                !credentials?.username ||
                !credentials?.password
            ) {
                setError(
                    "Password was reset, but the temporary credentials were not returned correctly."
                );

                return;
            }


            // ==================================================
            // STORE ONE-TIME CREDENTIALS
            // ==================================================

            setResetCredentials({
                userId:
                    user._id,

                name:
                    fullName ||
                    user.username,

                /*
                    Prefer the user email returned
                    by the backend/database.

                    Fallback to the email from the
                    users list.
                */
                email:
                    response.data
                        ?.user
                        ?.email ||
                    user.email ||
                    "",

                username:
                    credentials.username,

                password:
                    credentials.password,
            });


            setMessage(
                "Password reset successfully. Copy or send the temporary credentials now because the password will not be shown again."
            );


            await loadUsers();

        } catch (error) {
            console.error(
                "Reset password error:",
                error
            );


            setError(
                error.response?.data
                    ?.message ||
                "Unable to reset the user's password."
            );

        } finally {
            setActionUserId(
                null
            );
        }
    };


    // ======================================================
    // COPY CREDENTIALS
    // ======================================================

    const copyCredentials =
        async () => {
            if (
                !resetCredentials
            ) {
                return;
            }


            const text =
                `Username: ${resetCredentials.username}\nTemporary Password: ${resetCredentials.password}`;


            try {
                await navigator.clipboard
                    .writeText(
                        text
                    );


                setMessage(
                    "Temporary credentials copied to clipboard."
                );

            } catch {
                setError(
                    "Unable to copy automatically. Please copy the credentials manually."
                );
            }
        };


    // ======================================================
    // SEND RESET CREDENTIALS USING GMAIL
    // ======================================================

    const handleSendEmail = () => {
        if (
            !resetCredentials
        ) {
            return;
        }


        const email =
            resetCredentials.email
                ?.trim();


        // ==================================================
        // EMAIL REQUIRED
        // ==================================================

        if (!email) {
            setError(
                "No valid email address is available for this user."
            );

            return;
        }


        // ==================================================
        // BASIC EMAIL VALIDATION
        // ==================================================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(
                email
            )
        ) {
            setError(
                "The email address stored for this user is invalid."
            );

            return;
        }


        setError("");


        // ==================================================
        // GMAIL RECIPIENT
        // ==================================================

        const to =
            encodeURIComponent(
                email
            );


        // ==================================================
        // EMAIL SUBJECT
        // ==================================================

        const subject =
            encodeURIComponent(
                "UK LogiWare - Password Reset Credentials"
            );


        // ==================================================
        // EMAIL BODY
        // ==================================================

        const body =
            encodeURIComponent(
                `Hello ${resetCredentials.name},

Your UK LogiWare Safety Training account password has been reset by the administrator.

Please use the following temporary credentials:

Username: ${resetCredentials.username}
Temporary Password: ${resetCredentials.password}

Login here:
http://localhost:5173/login

For security, you will be required to change your password after signing in.

Please do not share your login credentials with anyone.

Regards,
UK LogiWare Administrator`
            );


        // ==================================================
        // OPEN GMAIL COMPOSE
        // ==================================================

        const gmailUrl =
            `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;


        window.open(
            gmailUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    // ======================================================
    // CLOSE CREDENTIALS
    // ======================================================

    const closeCredentials =
        () => {
            setResetCredentials(
                null
            );

            setMessage("");
            setError("");
        };


    // ======================================================
    // UI
    // ======================================================

    return (
        <div className="space-y-5">

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}


            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                </div>
            )}


            {/* ==================================================
                NEW TEMPORARY CREDENTIALS
            ================================================== */}

            {resetCredentials && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">

                    {/* TOP */}

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                            <div className="flex items-center gap-3">

                                {/* ICON */}

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                    >
                                        <circle
                                            cx="8"
                                            cy="15"
                                            r="4"
                                        />

                                        <path d="m11 12 8-8" />
                                        <path d="m16 7 2 2" />
                                        <path d="m14 9 2 2" />
                                    </svg>

                                </div>


                                {/* USER */}

                                <div>

                                    <h3 className="text-sm font-bold text-slate-900">
                                        New Temporary Credentials
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {resetCredentials.name}
                                    </p>

                                    {resetCredentials.email && (
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            {resetCredentials.email}
                                        </p>
                                    )}

                                </div>

                            </div>


                            <p className="mt-4 text-xs leading-5 text-amber-700">
                                Save or send these credentials now. The temporary password is shown only once.
                            </p>

                        </div>


                        {/* CLOSE */}

                        <button
                            type="button"
                            onClick={
                                closeCredentials
                            }
                            className="text-xs font-semibold text-slate-500 transition hover:text-slate-800"
                        >
                            Close
                        </button>

                    </div>


                    {/* ==================================================
                        CREDENTIAL BOXES
                    ================================================== */}

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">

                        {/* USERNAME */}

                        <div className="rounded-xl border border-blue-100 bg-white p-4">

                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Username
                            </p>

                            <p className="mt-2 break-all text-sm font-bold text-slate-800">
                                {resetCredentials.username}
                            </p>

                        </div>


                        {/* PASSWORD */}

                        <div className="rounded-xl border border-blue-100 bg-white p-4">

                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Temporary Password
                            </p>

                            <p className="mt-2 break-all font-mono text-sm font-bold text-slate-800">
                                {resetCredentials.password}
                            </p>

                        </div>

                    </div>


                    {/* ==================================================
                        CREDENTIAL ACTION BUTTONS
                    ================================================== */}

                    <div className="mt-4 flex flex-wrap gap-3">

                        {/* COPY CREDENTIALS */}

                        <button
                            type="button"
                            onClick={
                                copyCredentials
                            }
                            className="flex items-center gap-2 rounded-lg bg-[#1769e0] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0f5dc9]"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-4 w-4"
                            >
                                <rect
                                    x="8"
                                    y="8"
                                    width="11"
                                    height="11"
                                    rx="2"
                                />

                                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                            </svg>

                            Copy Credentials

                        </button>


                        {/* SEND EMAIL */}

                        <button
                            type="button"
                            onClick={
                                handleSendEmail
                            }
                            disabled={
                                !resetCredentials.email
                            }
                            className="flex items-center gap-2 rounded-lg bg-[#1769e0] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0f5dc9] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-4 w-4"
                            >
                                <rect
                                    x="3"
                                    y="5"
                                    width="18"
                                    height="14"
                                    rx="2"
                                />

                                <path d="m4 7 8 6 8-6" />
                            </svg>

                            Send Email

                        </button>

                    </div>

                </div>
            )}


            {/* ==================================================
                USER TABLE
            ================================================== */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* ==================================================
                    TABLE HEADER
                ================================================== */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Trainer & Trainee Accounts
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage system access status.
                        </p>

                    </div>


                    <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
                        {users.length} Users
                    </div>

                </div>


                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                        Loading users...
                    </div>

                ) : users.length ===
                    0 ? (

                    /* ==============================================
                        EMPTY
                    ============================================== */

                    <div className="p-8 text-center text-sm text-slate-500">
                        No Trainer or Trainee accounts found.
                    </div>

                ) : (

                    /* ==============================================
                        TABLE
                    ============================================== */

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[950px]">

                            {/* TABLE HEAD */}

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


                            {/* TABLE BODY */}

                            <tbody className="divide-y divide-slate-100">

                                {users.map(
                                    (
                                        user
                                    ) => {
                                        const selected =
                                            String(
                                                user._id
                                            ) ===
                                            String(
                                                selectedUserId
                                            );


                                        const pendingReset =
                                            hasPendingResetRequest(
                                                user
                                            );


                                        const actionLoading =
                                            actionUserId ===
                                            user._id;


                                        return (
                                            <tr
                                                key={
                                                    user._id
                                                }
                                                ref={
                                                    selected
                                                        ? selectedRowRef
                                                        : null
                                                }
                                                className={
                                                    selected
                                                        ? "bg-blue-50/70 ring-1 ring-inset ring-blue-200"
                                                        : "hover:bg-slate-50"
                                                }
                                            >

                                                {/* ==========================================
                                                    USER
                                                ========================================== */}

                                                <td className="px-6 py-4">

                                                    <div>

                                                        <div className="flex flex-wrap items-center gap-2">

                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {user.firstName}{" "}
                                                                {user.lastName}
                                                            </p>


                                                            {pendingReset && (
                                                                <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                                                                    Reset Requested
                                                                </span>
                                                            )}

                                                        </div>


                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {user.email}
                                                        </p>

                                                    </div>

                                                </td>


                                                {/* ==========================================
                                                    USERNAME
                                                ========================================== */}

                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {user.username}
                                                </td>


                                                {/* ==========================================
                                                    ROLE
                                                ========================================== */}

                                                <td className="px-6 py-4">

                                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-600">
                                                        {user.role}
                                                    </span>

                                                </td>


                                                {/* ==========================================
                                                    STATUS
                                                ========================================== */}

                                                <td className="px-6 py-4">

                                                    <StatusBadge
                                                        status={
                                                            user.status
                                                        }
                                                    />

                                                </td>


                                                {/* ==========================================
                                                    ACTIONS
                                                ========================================== */}

                                                <td className="px-6 py-4">

                                                    <div className="flex flex-wrap justify-end gap-2">

                                                        {/* RESET PASSWORD */}

                                                        {pendingReset &&
                                                            user.status ===
                                                            "active" && (
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        actionLoading
                                                                    }
                                                                    onClick={() =>
                                                                        resetPassword(
                                                                            user
                                                                        )
                                                                    }
                                                                    className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    {actionLoading
                                                                        ? "Resetting..."
                                                                        : "Reset Password"}
                                                                </button>
                                                            )}


                                                        {/* DEACTIVATE / REACTIVATE */}

                                                        {user.status ===
                                                            "active" ? (
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    actionLoading
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
                                                                    actionLoading
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


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                actionLoading
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
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}


// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({
    status,
}) {
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