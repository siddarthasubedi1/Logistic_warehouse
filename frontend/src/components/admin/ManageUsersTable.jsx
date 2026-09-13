import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import api from "../../services/api";

import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import EditUserModal from "./EditUserModal";


function ManageUsersTable({
    selectedUserId = null,
    passwordResetRequest = null,
}) {
    const [
        users,
        setUsers,
    ] = useState([]);

    const [
        resetRequests,
        setResetRequests,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");

    const [
        processingId,
        setProcessingId,
    ] = useState("");

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        roleFilter,
        setRoleFilter,
    ] = useState("all");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");

    const [
        editUser,
        setEditUser,
    ] = useState(null);

    const [
        savingEdit,
        setSavingEdit,
    ] = useState(false);

    const [
        resetCredentials,
        setResetCredentials,
    ] = useState(null);

    const selectedRowRef =
        useRef(null);


    /* =========================================================
       HELPERS
    ========================================================= */

    const getUserId = (
        user
    ) =>
        user?._id ||
        user?.id ||
        "";


    const getUserName = (
        user
    ) =>
        `${user?.firstName || ""} ${user?.lastName || ""}`
            .trim() ||
        user?.username ||
        "User";


    const getRequestUserId = (
        request
    ) => {
        if (
            typeof request?.user ===
            "string"
        ) {
            return request.user;
        }

        return (
            request?.user?._id ||
            request?.user?.id ||
            request?.userId ||
            ""
        );
    };


    /* =========================================================
       LOAD USERS
    ========================================================= */

    const loadUsers =
        useCallback(
            async () => {
                const response =
                    await api.get(
                        "/admin/users"
                    );

                const data =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : response.data?.users ||
                        [];

                setUsers(
                    data
                );

                return data;
            },
            []
        );


    /* =========================================================
       LOAD RESET REQUESTS
    ========================================================= */

    const loadResetRequests =
        useCallback(
            async () => {
                try {
                    const response =
                        await api.get(
                            "/admin/password-reset-requests"
                        );

                    const data =
                        Array.isArray(
                            response.data
                        )
                            ? response.data
                            : response.data?.requests ||
                            [];

                    const pending =
                        data.filter(
                            (
                                request
                            ) =>
                                !request.status ||
                                request.status ===
                                "pending"
                        );

                    setResetRequests(
                        pending
                    );

                    return pending;

                } catch (
                error
                ) {
                    console.error(
                        "Load reset requests error:",
                        error
                    );

                    setResetRequests(
                        []
                    );

                    return [];
                }
            },
            []
        );


    /* =========================================================
       LOAD PAGE
    ========================================================= */

    const loadPage =
        useCallback(
            async () => {
                try {
                    setLoading(
                        true
                    );

                    setError(
                        ""
                    );

                    await Promise.all([
                        loadUsers(),
                        loadResetRequests(),
                    ]);

                } catch (
                error
                ) {
                    console.error(
                        "Manage users load error:",
                        error
                    );

                    setError(
                        error.response?.data?.message ||
                        "Unable to load users."
                    );

                } finally {
                    setLoading(
                        false
                    );
                }
            },
            [
                loadUsers,
                loadResetRequests,
            ]
        );


    useEffect(() => {
        loadPage();
    }, [
        loadPage,
    ]);


    /* =========================================================
       SCROLL TO SELECTED USER
    ========================================================= */

    useEffect(() => {
        if (
            !loading &&
            selectedUserId &&
            selectedRowRef.current
        ) {
            window.setTimeout(
                () => {
                    selectedRowRef.current?.scrollIntoView({
                        behavior:
                            "smooth",

                        block:
                            "center",
                    });
                },
                200
            );
        }
    }, [
        loading,
        selectedUserId,
    ]);


    /* =========================================================
       FILTER USERS
    ========================================================= */

    const filteredUsers =
        useMemo(
            () => {
                const query =
                    searchTerm
                        .trim()
                        .toLowerCase();

                return users.filter(
                    (
                        user
                    ) => {
                        const role =
                            String(
                                user.role ||
                                ""
                            ).toLowerCase();

                        const status =
                            String(
                                user.status ||
                                ""
                            ).toLowerCase();

                        const text =
                            [
                                user.firstName,
                                user.lastName,
                                user.username,
                                user.email,
                                user.phoneNumber,
                            ]
                                .filter(
                                    Boolean
                                )
                                .join(" ")
                                .toLowerCase();


                        const matchesSearch =
                            !query ||
                            text.includes(
                                query
                            );


                        const matchesRole =
                            roleFilter ===
                            "all" ||
                            role ===
                            roleFilter;


                        const matchesStatus =
                            statusFilter ===
                            "all" ||
                            status ===
                            statusFilter;


                        return (
                            matchesSearch &&
                            matchesRole &&
                            matchesStatus
                        );
                    }
                );
            },
            [
                users,
                searchTerm,
                roleFilter,
                statusFilter,
            ]
        );


    /* =========================================================
       PENDING RESET IDS
    ========================================================= */

    const pendingResetUserIds =
        useMemo(
            () =>
                resetRequests
                    .map(
                        (
                            request
                        ) =>
                            getRequestUserId(
                                request
                            )
                    )
                    .filter(
                        Boolean
                    ),
            [
                resetRequests,
            ]
        );


    /* =========================================================
       EDIT USER
    ========================================================= */

    const handleEditSave =
        async (
            values
        ) => {
            if (
                !editUser
            ) {
                return;
            }

            const userId =
                getUserId(
                    editUser
                );

            try {
                setSavingEdit(
                    true
                );

                setError(
                    ""
                );

                setSuccess(
                    ""
                );


                const response =
                    await api.patch(
                        `/admin/users/${userId}`,
                        values
                    );


                setSuccess(
                    response.data?.message ||
                    "User updated successfully."
                );


                setEditUser(
                    null
                );


                await loadUsers();

            } catch (
            error
            ) {
                console.error(
                    "Edit user error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to update user."
                );

            } finally {
                setSavingEdit(
                    false
                );
            }
        };


    /* =========================================================
       DEACTIVATE
    ========================================================= */

    const deactivateUser =
        async (
            user
        ) => {
            const name =
                getUserName(
                    user
                );

            const confirmed =
                window.confirm(
                    `Deactivate ${name}? The user will not be able to log in until reactivated.`
                );

            if (
                !confirmed
            ) {
                return;
            }

            const userId =
                getUserId(
                    user
                );

            try {
                setProcessingId(
                    userId
                );

                setError(
                    ""
                );

                setSuccess(
                    ""
                );


                const response =
                    await api.patch(
                        `/admin/users/${userId}/deactivate`
                    );


                setSuccess(
                    response.data?.message ||
                    "User deactivated successfully."
                );


                await loadUsers();

            } catch (
            error
            ) {
                console.error(
                    "Deactivate user error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to deactivate user."
                );

            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    /* =========================================================
       REACTIVATE
    ========================================================= */

    const reactivateUser =
        async (
            user
        ) => {
            const userId =
                getUserId(
                    user
                );

            try {
                setProcessingId(
                    userId
                );

                setError(
                    ""
                );

                setSuccess(
                    ""
                );


                const response =
                    await api.patch(
                        `/admin/users/${userId}/reactivate`
                    );


                setSuccess(
                    response.data?.message ||
                    "User reactivated successfully."
                );


                await loadUsers();

            } catch (
            error
            ) {
                console.error(
                    "Reactivate user error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to reactivate user."
                );

            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    /* =========================================================
       DELETE USER
    ========================================================= */

    const deleteUser =
        async (
            user
        ) => {
            const name =
                getUserName(
                    user
                );

            const confirmed =
                window.confirm(
                    `Delete ${name}? This action cannot be undone.`
                );

            if (
                !confirmed
            ) {
                return;
            }

            const userId =
                getUserId(
                    user
                );

            try {
                setProcessingId(
                    userId
                );

                setError(
                    ""
                );

                setSuccess(
                    ""
                );


                const response =
                    await api.delete(
                        `/admin/users/${userId}`
                    );


                setSuccess(
                    response.data?.message ||
                    "User deleted successfully."
                );


                await Promise.all([
                    loadUsers(),
                    loadResetRequests(),
                ]);

            } catch (
            error
            ) {
                console.error(
                    "Delete user error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to delete user."
                );

            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    /* =========================================================
       RESET PASSWORD
    ========================================================= */

    const resetPassword =
        async (
            user
        ) => {
            const userId =
                getUserId(
                    user
                );

            const hasRequest =
                pendingResetUserIds.some(
                    (
                        id
                    ) =>
                        String(
                            id
                        ) ===
                        String(
                            userId
                        )
                );


            if (
                !hasRequest
            ) {
                setError(
                    "This user does not have a pending password reset request."
                );

                return;
            }


            const name =
                getUserName(
                    user
                );


            const confirmed =
                window.confirm(
                    `Generate a new temporary password for ${name}?`
                );


            if (
                !confirmed
            ) {
                return;
            }


            try {
                setProcessingId(
                    userId
                );

                setError(
                    ""
                );

                setSuccess(
                    ""
                );

                setResetCredentials(
                    null
                );


                const response =
                    await api.post(
                        `/admin/users/${userId}/reset-password`
                    );


                const credentials =
                    response.data?.credentials;


                if (
                    !credentials?.username ||
                    !credentials?.password
                ) {
                    setError(
                        "Password was reset but the temporary credentials were not returned."
                    );

                    return;
                }


                setResetCredentials({
                    name,

                    email:
                        response.data?.user?.email ||
                        user.email ||
                        "",

                    username:
                        credentials.username,

                    password:
                        credentials.password,
                });


                setSuccess(
                    response.data?.message ||
                    "Temporary password generated successfully."
                );


                await Promise.all([
                    loadUsers(),
                    loadResetRequests(),
                ]);

            } catch (
            error
            ) {
                console.error(
                    "Reset password error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to reset password."
                );

            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    /* =========================================================
       COPY RESET CREDENTIALS
    ========================================================= */

    const copyCredentials =
        async () => {
            if (
                !resetCredentials
            ) {
                return;
            }

            try {
                await navigator.clipboard.writeText(
                    `Username: ${resetCredentials.username}\nTemporary Password: ${resetCredentials.password}`
                );

                setSuccess(
                    "Credentials copied to clipboard."
                );

            } catch {
                setError(
                    "Unable to copy credentials automatically."
                );
            }
        };


    /* =========================================================
       EMAIL RESET CREDENTIALS
    ========================================================= */

    const sendCredentials =
        () => {
            if (
                !resetCredentials?.email
            ) {
                setError(
                    "This user does not have an email address."
                );

                return;
            }


            const subject =
                "UK LogiWare - Password Reset Credentials";


            const body =
                `Hello ${resetCredentials.name},

Your UK LogiWare password has been reset.

Username: ${resetCredentials.username}
Temporary Password: ${resetCredentials.password}

Please use this temporary password to log in.

You will be required to create a new password after login.

UK LogiWare Safety Training`;


            const gmailUrl =
                `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    resetCredentials.email
                )}&su=${encodeURIComponent(
                    subject
                )}&body=${encodeURIComponent(
                    body
                )}`;


            window.open(
                gmailUrl,
                "_blank",
                "noopener,noreferrer"
            );
        };


    return (
        <>
            <div
                className="
                    space-y-4
                "
            >
                {/* =============================================
                    ALERTS
                ============================================== */}

                {error && (
                    <Alert
                        type="error"
                        text={
                            error
                        }
                        onClose={() =>
                            setError("")
                        }
                    />
                )}


                {success && (
                    <Alert
                        type="success"
                        text={
                            success
                        }
                        onClose={() =>
                            setSuccess("")
                        }
                    />
                )}


                {/* =============================================
                    RESET CREDENTIALS
                ============================================== */}

                {resetCredentials && (
                    <section
                        className="
                            overflow-hidden
                            rounded-xl
                            border
                            border-blue-200
                            bg-white
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-4
                                border-b
                                border-blue-100
                                bg-blue-50
                                px-5
                                py-4
                            "
                        >
                            <div>
                                <h3
                                    className="
                                        text-[13px]
                                        font-bold
                                        text-[#172033]
                                    "
                                >
                                    New Temporary Credentials
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        text-[#64748b]
                                    "
                                >
                                    {resetCredentials.name}
                                </p>
                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setResetCredentials(
                                        null
                                    )
                                }
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-[16px]
                                    text-[#64748b]
                                    transition
                                    hover:bg-white
                                "
                            >
                                ×
                            </button>
                        </div>


                        <div
                            className="
                                p-5
                            "
                        >
                            <div
                                className="
                                    grid
                                    gap-3
                                    md:grid-cols-2
                                "
                            >
                                <CredentialBox
                                    label="Username"
                                    value={
                                        resetCredentials.username
                                    }
                                />

                                <CredentialBox
                                    label="Temporary Password"
                                    value={
                                        resetCredentials.password
                                    }
                                />
                            </div>


                            <div
                                className="
                                    mt-4
                                    rounded-lg
                                    border
                                    border-amber-200
                                    bg-amber-50
                                    px-4
                                    py-3
                                    text-[9px]
                                    leading-4
                                    text-amber-700
                                "
                            >
                                This temporary password is shown only now.
                                The Trainer or Trainee must change it on
                                their next login.
                            </div>


                            <div
                                className="
                                    mt-4
                                    flex
                                    flex-col
                                    gap-2
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >
                                <button
                                    type="button"
                                    onClick={
                                        copyCredentials
                                    }
                                    className="
                                        min-h-[40px]
                                        rounded-lg
                                        border
                                        border-[#cbd5e1]
                                        bg-white
                                        px-4
                                        text-[9px]
                                        font-semibold
                                        text-[#52627a]
                                        transition
                                        hover:bg-[#f8fafc]
                                    "
                                >
                                    Copy Credentials
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        sendCredentials
                                    }
                                    className="
                                        min-h-[40px]
                                        rounded-lg
                                        bg-[#1769e8]
                                        px-4
                                        text-[9px]
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#0b5ed7]
                                    "
                                >
                                    Send Credentials by Gmail
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setResetCredentials(
                                            null
                                        )
                                    }
                                    className="
                                        min-h-[40px]
                                        rounded-lg
                                        bg-[#073763]
                                        px-5
                                        text-[9px]
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#0b4f87]
                                    "
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </section>
                )}


                {/* =============================================
                    USERS
                ============================================== */}

                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        shadow-[0_1px_3px_rgba(15,23,42,0.06)]
                    "
                >
                    {/* HEADER */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            border-b
                            border-[#e8eef5]
                            px-5
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-[14px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                Manage Users
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-[#64748b]
                                "
                            >
                                View, edit and manage Trainer and Trainee accounts.
                            </p>
                        </div>


                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <span
                                className="
                                    rounded-full
                                    bg-blue-50
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-semibold
                                    text-blue-600
                                "
                            >
                                {users.length} Users
                            </span>


                            <button
                                type="button"
                                onClick={
                                    loadPage
                                }
                                disabled={
                                    loading
                                }
                                className="
                                    min-h-[36px]
                                    rounded-lg
                                    border
                                    border-[#cbd5e1]
                                    bg-white
                                    px-3
                                    text-[9px]
                                    font-semibold
                                    text-[#52627a]
                                    transition
                                    hover:bg-[#f8fafc]
                                    disabled:opacity-50
                                "
                            >
                                Refresh
                            </button>
                        </div>
                    </div>


                    {/* FILTERS */}

                    <div
                        className="
                            border-b
                            border-[#e8eef5]
                            p-4
                        "
                    >
                        <UserFilters
                            searchTerm={
                                searchTerm
                            }
                            roleFilter={
                                roleFilter
                            }
                            statusFilter={
                                statusFilter
                            }
                            onSearchChange={
                                setSearchTerm
                            }
                            onRoleChange={
                                setRoleFilter
                            }
                            onStatusChange={
                                setStatusFilter
                            }
                        />
                    </div>


                    {/* TABLE */}

                    {loading ? (
                        <div
                            className="
                                flex
                                min-h-[260px]
                                items-center
                                justify-center
                            "
                        >
                            <div
                                className="
                                    text-center
                                "
                            >
                                <div
                                    className="
                                        mx-auto
                                        h-8
                                        w-8
                                        animate-spin
                                        rounded-full
                                        border-2
                                        border-blue-100
                                        border-t-blue-600
                                    "
                                />

                                <p
                                    className="
                                        mt-3
                                        text-[10px]
                                        text-[#64748b]
                                    "
                                >
                                    Loading users...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <UserTable
                            users={
                                filteredUsers
                            }
                            pendingResetUserIds={
                                pendingResetUserIds
                            }
                            processingId={
                                processingId
                            }
                            selectedUserId={
                                selectedUserId
                            }
                            selectedRowRef={
                                selectedRowRef
                            }
                            onEdit={
                                setEditUser
                            }
                            onResetPassword={
                                resetPassword
                            }
                            onDeactivate={
                                deactivateUser
                            }
                            onReactivate={
                                reactivateUser
                            }
                            onDelete={
                                deleteUser
                            }
                        />
                    )}
                </section>
            </div>


            {/* =============================================
                EDIT MODAL
            ============================================== */}

            <EditUserModal
                open={
                    Boolean(
                        editUser
                    )
                }
                user={
                    editUser
                }
                loading={
                    savingEdit
                }
                onSave={
                    handleEditSave
                }
                onClose={() =>
                    setEditUser(
                        null
                    )
                }
            />
        </>
    );
}


/* =========================================================
   ALERT
========================================================= */

function Alert({
    type,
    text,
    onClose,
}) {
    const success =
        type ===
        "success";

    return (
        <div
            className={`
                flex
                items-start
                justify-between
                gap-4
                rounded-lg
                border
                px-4
                py-3
                text-[10px]

                ${success
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }
            `}
        >
            <span>
                {text}
            </span>


            <button
                type="button"
                onClick={
                    onClose
                }
                className="
                    shrink-0
                    text-[16px]
                    font-bold
                "
            >
                ×
            </button>
        </div>
    );
}


/* =========================================================
   CREDENTIAL BOX
========================================================= */

function CredentialBox({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-lg
                border
                border-[#dbe4ef]
                bg-[#f8fafc]
                p-4
            "
        >
            <p
                className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[#64748b]
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-2
                    break-all
                    font-mono
                    text-[10px]
                    font-bold
                    text-[#172033]
                "
            >
                {value}
            </p>
        </div>
    );
}


export default ManageUsersTable;