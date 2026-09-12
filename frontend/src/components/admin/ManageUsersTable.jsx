import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../../services/api";

import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import EditUserModal from "./EditUserModal";
import ConfirmDialog from "./ConfirmDialog";
import GeneratedCredentialsModal from "./GeneratedCredentialsModal";

import FeedbackAlert from "../ui/FeedbackAlert";

import {
    getApiErrorMessage,
    parseArrayResponse,
} from "../../utils/training";


function ManageUsersTable({
    selectedUserId = null,
}) {
    const [
        users,
        setUsers,
    ] = useState([]);

    const [
        pendingResetUserIds,
        setPendingResetUserIds,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

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
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");

    const [
        editingUser,
        setEditingUser,
    ] = useState(null);

    const [
        editError,
        setEditError,
    ] = useState("");

    const [
        savingEdit,
        setSavingEdit,
    ] = useState(false);

    const [
        processingId,
        setProcessingId,
    ] = useState("");

    const [
        confirmAction,
        setConfirmAction,
    ] = useState(null);

    const [
        credentialUser,
        setCredentialUser,
    ] = useState(null);

    const [
        resetCredentials,
        setResetCredentials,
    ] = useState(null);


    // ======================================================
    // LOAD USERS
    // ======================================================

    const loadUsers =
        useCallback(
            async () => {
                try {
                    setLoading(true);

                    const response =
                        await api.get(
                            "/admin/users"
                        );

                    setUsers(
                        parseArrayResponse(
                            response.data,
                            "users"
                        )
                    );

                } catch (error) {
                    console.error(
                        "Load users error:",
                        error
                    );

                    setErrorMessage(
                        getApiErrorMessage(
                            error,
                            "Unable to load users."
                        )
                    );

                } finally {
                    setLoading(false);
                }
            },
            []
        );


    // ======================================================
    // RESET REQUESTS
    // ======================================================

    const loadPasswordResetRequests =
        useCallback(
            async () => {
                try {
                    const response =
                        await api.get(
                            "/admin/password-reset-requests"
                        );

                    const requests =
                        parseArrayResponse(
                            response.data,
                            "requests"
                        );

                    const ids =
                        requests
                            .filter(
                                (
                                    request
                                ) =>
                                    String(
                                        request?.status ||
                                        "pending"
                                    ).toLowerCase() ===
                                    "pending"
                            )
                            .map(
                                (
                                    request
                                ) =>
                                    String(
                                        request.user?._id ||
                                        request.user ||
                                        request.userId ||
                                        ""
                                    )
                            )
                            .filter(Boolean);

                    setPendingResetUserIds(
                        ids
                    );

                } catch (error) {
                    console.error(
                        "Load password reset requests error:",
                        error
                    );

                    setPendingResetUserIds(
                        []
                    );
                }
            },
            []
        );


    useEffect(() => {
        loadUsers();
        loadPasswordResetRequests();
    }, [
        loadUsers,
        loadPasswordResetRequests,
    ]);


    useEffect(() => {
        if (
            !selectedUserId
        ) {
            return;
        }

        window.setTimeout(
            () => {
                document
                    .getElementById(
                        "selected-admin-user"
                    )
                    ?.scrollIntoView({
                        behavior:
                            "smooth",

                        block:
                            "center",
                    });
            },
            300
        );
    }, [
        selectedUserId,
        users,
    ]);


    // ======================================================
    // FILTER
    // ======================================================

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
                        const searchable =
                            [
                                user.firstName,
                                user.lastName,
                                user.username,
                                user.email,
                            ]
                                .filter(Boolean)
                                .join(" ")
                                .toLowerCase();

                        const matchesSearch =
                            !query ||
                            searchable.includes(
                                query
                            );

                        const matchesRole =
                            roleFilter ===
                            "all" ||
                            user.role ===
                            roleFilter;

                        const userStatus =
                            String(
                                user.status ||
                                ""
                            ).toLowerCase();

                        const matchesStatus =
                            statusFilter ===
                            "all" ||
                            userStatus ===
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


    // ======================================================
    // EDIT
    // ======================================================

    const handleSaveEdit =
        async (
            formData
        ) => {
            if (
                !editingUser?._id
            ) {
                return;
            }

            try {
                setSavingEdit(true);
                setEditError("");

                const response =
                    await api.patch(
                        `/admin/users/${editingUser._id}`,
                        formData
                    );

                setSuccessMessage(
                    response.data?.message ||
                    "User updated successfully."
                );

                setEditingUser(null);

                await loadUsers();

            } catch (error) {
                console.error(
                    "Edit user error:",
                    error
                );

                setEditError(
                    getApiErrorMessage(
                        error,
                        "Unable to update user."
                    )
                );

            } finally {
                setSavingEdit(false);
            }
        };


    // ======================================================
    // CONFIRM ACTION
    // ======================================================

    const requestAction = (
        type,
        user
    ) => {
        const labels = {
            deactivate:
                "Deactivate User",

            reactivate:
                "Reactivate User",

            delete:
                "Delete User",
        };

        const messages = {
            deactivate:
                "This user will no longer be able to sign in.",

            reactivate:
                "This user will regain access to their account.",

            delete:
                "This action permanently removes the user account.",
        };

        setConfirmAction({
            type,
            user,
            title:
                labels[type],

            message:
                messages[type],
        });
    };


    const handleConfirmedAction =
        async () => {
            const action =
                confirmAction;

            if (
                !action?.user?._id
            ) {
                return;
            }

            const user =
                action.user;

            try {
                setProcessingId(
                    user._id
                );

                let response;

                if (
                    action.type ===
                    "deactivate"
                ) {
                    response =
                        await api.patch(
                            `/admin/users/${user._id}/deactivate`
                        );
                }

                if (
                    action.type ===
                    "reactivate"
                ) {
                    response =
                        await api.patch(
                            `/admin/users/${user._id}/reactivate`
                        );
                }

                if (
                    action.type ===
                    "delete"
                ) {
                    response =
                        await api.delete(
                            `/admin/users/${user._id}`
                        );
                }

                setSuccessMessage(
                    response?.data?.message ||
                    "Action completed successfully."
                );

                setConfirmAction(null);

                await loadUsers();

            } catch (error) {
                console.error(
                    "User action error:",
                    error
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to complete this action."
                    )
                );

            } finally {
                setProcessingId("");
            }
        };


    // ======================================================
    // RESET PASSWORD
    // ONLY AFTER REQUEST
    // ======================================================

    const handleResetPassword =
        async (
            user
        ) => {
            const allowed =
                pendingResetUserIds.includes(
                    String(
                        user._id
                    )
                );

            if (
                !allowed
            ) {
                setErrorMessage(
                    "Reset Password is available only after the Trainer or Trainee submits a reset request."
                );

                return;
            }

            try {
                setProcessingId(
                    user._id
                );

                const response =
                    await api.post(
                        `/admin/users/${user._id}/reset-password`
                    );

                const credentials =
                    response.data?.credentials;

                if (
                    !credentials
                ) {
                    throw new Error(
                        "Credential information was not returned."
                    );
                }

                setCredentialUser(
                    user
                );

                setResetCredentials(
                    credentials
                );

                setSuccessMessage(
                    response.data?.message ||
                    "Temporary password generated successfully."
                );

                await loadPasswordResetRequests();

            } catch (error) {
                console.error(
                    "Reset password error:",
                    error
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reset password."
                    )
                );

            } finally {
                setProcessingId("");
            }
        };


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
                <div
                    className="
                        flex
                        flex-col
                        gap-2
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div>
                        <h2
                            className="
                                text-[12px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            User Accounts
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[8px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Manage Trainer and Trainee accounts.
                        </p>
                    </div>


                    <span
                        className="
                            w-fit
                            rounded-full
                            bg-slate-100
                            px-3
                            py-1
                            text-[8px]
                            font-semibold
                            text-slate-600
                        "
                    >
                        {filteredUsers.length} Users
                    </span>
                </div>
            </div>


            <div
                className="
                    space-y-4
                    p-4
                    sm:p-5
                "
            >
                <FeedbackAlert
                    type="success"
                    message={
                        successMessage
                    }
                    onClose={() =>
                        setSuccessMessage("")
                    }
                />

                <FeedbackAlert
                    type="error"
                    message={
                        errorMessage
                    }
                    onClose={() =>
                        setErrorMessage("")
                    }
                />


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


                {loading ? (
                    <div
                        className="
                            py-12
                            text-center
                        "
                    >
                        <p
                            className="
                                text-[9px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Loading users...
                        </p>
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
                        onEdit={
                            setEditingUser
                        }
                        onResetPassword={
                            handleResetPassword
                        }
                        onDeactivate={(
                            user
                        ) =>
                            requestAction(
                                "deactivate",
                                user
                            )
                        }
                        onReactivate={(
                            user
                        ) =>
                            requestAction(
                                "reactivate",
                                user
                            )
                        }
                        onDelete={(
                            user
                        ) =>
                            requestAction(
                                "delete",
                                user
                            )
                        }
                    />
                )}
            </div>


            <EditUserModal
                open={
                    Boolean(
                        editingUser
                    )
                }
                user={
                    editingUser
                }
                saving={
                    savingEdit
                }
                errorMessage={
                    editError
                }
                onSave={
                    handleSaveEdit
                }
                onClose={() => {
                    setEditingUser(null);
                    setEditError("");
                }}
            />


            <ConfirmDialog
                open={
                    Boolean(
                        confirmAction
                    )
                }
                title={
                    confirmAction?.title
                }
                message={
                    confirmAction?.message
                }
                confirmText={
                    confirmAction?.type ===
                        "delete"
                        ? "Delete"
                        : "Confirm"
                }
                variant={
                    confirmAction?.type ===
                        "reactivate"
                        ? "success"
                        : "danger"
                }
                loading={
                    Boolean(
                        processingId
                    )
                }
                onConfirm={
                    handleConfirmedAction
                }
                onCancel={() =>
                    setConfirmAction(
                        null
                    )
                }
            />


            <GeneratedCredentialsModal
                open={
                    Boolean(
                        resetCredentials
                    )
                }
                credentials={
                    resetCredentials
                }
                user={
                    credentialUser
                }
                onClose={() => {
                    setResetCredentials(null);
                    setCredentialUser(null);
                }}
            />
        </section>
    );
}


export default ManageUsersTable;