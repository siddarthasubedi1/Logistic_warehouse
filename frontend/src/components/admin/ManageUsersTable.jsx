import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../../services/api";

import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import ConfirmDialog from "./ConfirmDialog";
import GeneratedCredentialsModal from "./GeneratedCredentialsModal";
import EditUserModal from "./EditUserModal";

import FeedbackAlert from "../ui/FeedbackAlert";
import LoadingCard from "../ui/LoadingCard";

import {
    getApiErrorMessage,
    getUserDisplayName,
    parseArrayResponse,
} from "../../utils/training";


function ManageUsersTable({
    selectedUserId = null,
    passwordResetRequest = null,
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
        errorMessage,
        setErrorMessage,
    ] = useState("");


    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    const [
        confirmAction,
        setConfirmAction,
    ] = useState(null);


    const [
        editingUser,
        setEditingUser,
    ] = useState(null);


    const [
        editSaving,
        setEditSaving,
    ] = useState(false);


    const [
        editError,
        setEditError,
    ] = useState("");


    const [
        resetCredentials,
        setResetCredentials,
    ] = useState(null);


    const [
        credentialUser,
        setCredentialUser,
    ] = useState(null);


    const clearFeedback =
        () => {
            setErrorMessage("");
            setSuccessMessage("");
        };


    // ======================================================
    // USERS
    // ======================================================

    const loadUsers =
        useCallback(async () => {
            try {
                setLoading(
                    true
                );


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
                setLoading(
                    false
                );
            }
        }, []);


    // ======================================================
    // RESET REQUESTS
    // ======================================================

    const loadPasswordResetRequests =
        useCallback(async () => {
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
                                request?.status ===
                                "pending"
                        )
                        .map(
                            (
                                request
                            ) => {
                                const user =
                                    request?.user;


                                if (!user) {
                                    return "";
                                }


                                if (
                                    typeof user ===
                                    "object"
                                ) {
                                    return String(
                                        user._id ||
                                        user.id ||
                                        ""
                                    );
                                }


                                return String(
                                    user
                                );
                            }
                        )
                        .filter(Boolean);


                setPendingResetUserIds(
                    [
                        ...new Set(
                            ids
                        ),
                    ]
                );

            } catch (error) {
                console.error(
                    "Load reset requests error:",
                    error
                );


                setPendingResetUserIds(
                    []
                );
            }
        }, []);


    useEffect(() => {
        loadUsers();
        loadPasswordResetRequests();
    }, [
        loadUsers,
        loadPasswordResetRequests,
    ]);


    // ======================================================
    // SCROLL TO RESET USER
    // ======================================================

    useEffect(() => {
        if (
            loading ||
            !selectedUserId
        ) {
            return;
        }


        const timer =
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
                100
            );


        return () =>
            window.clearTimeout(
                timer
            );

    }, [
        loading,
        selectedUserId,
    ]);


    // ======================================================
    // FILTERING
    // ======================================================

    const filteredUsers =
        useMemo(() => {
            const query =
                searchTerm
                    .trim()
                    .toLowerCase();


            return users.filter(
                (
                    user
                ) => {
                    if (
                        roleFilter !==
                        "all" &&
                        user.role !==
                        roleFilter
                    ) {
                        return false;
                    }


                    if (
                        statusFilter !==
                        "all"
                    ) {
                        const status =
                            String(
                                user.status ||
                                ""
                            )
                                .toLowerCase();


                        if (
                            statusFilter ===
                            "active" &&
                            status !==
                            "active"
                        ) {
                            return false;
                        }


                        if (
                            statusFilter ===
                            "deactivated" &&
                            ![
                                "deactivated",
                                "inactive",
                            ].includes(
                                status
                            )
                        ) {
                            return false;
                        }
                    }


                    if (!query) {
                        return true;
                    }


                    const searchable =
                        [
                            getUserDisplayName(
                                user,
                                ""
                            ),

                            user.username,
                            user.email,
                            user.role,
                            user.status,
                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();


                    return searchable.includes(
                        query
                    );
                }
            );

        }, [
            users,
            searchTerm,
            roleFilter,
            statusFilter,
        ]);


    // ======================================================
    // EDIT
    // ======================================================

    const handleEditUser = (
        user
    ) => {
        clearFeedback();

        setEditingUser(
            user
        );

        setEditError(
            ""
        );
    };


    const handleSaveEditedUser =
        async (
            formData
        ) => {
            if (
                !editingUser
                    ?._id
            ) {
                return;
            }


            try {
                setEditSaving(
                    true
                );

                setEditError(
                    ""
                );


                const response =
                    await api.patch(
                        `/admin/users/${editingUser._id}`,
                        formData
                    );


                setSuccessMessage(
                    response.data
                        ?.message ||
                    "User updated successfully."
                );


                setEditingUser(
                    null
                );


                await loadUsers();

            } catch (error) {
                console.error(
                    "Update user error:",
                    error
                );


                setEditError(
                    getApiErrorMessage(
                        error,
                        "Unable to update this user."
                    )
                );

            } finally {
                setEditSaving(
                    false
                );
            }
        };


    // ======================================================
    // ACTION REQUESTS
    // ======================================================

    const requestDeactivate = (
        user
    ) => {
        clearFeedback();


        setConfirmAction({
            type:
                "deactivate",

            user,

            title:
                "Deactivate User",

            message:
                `Deactivate ${getUserDisplayName(
                    user,
                    "this user"
                )}?`,

            confirmText:
                "Deactivate",

            variant:
                "warning",
        });
    };


    const requestReactivate = (
        user
    ) => {
        clearFeedback();


        setConfirmAction({
            type:
                "reactivate",

            user,

            title:
                "Reactivate User",

            message:
                `Reactivate ${getUserDisplayName(
                    user,
                    "this user"
                )}?`,

            confirmText:
                "Reactivate",

            variant:
                "success",
        });
    };


    const requestDelete = (
        user
    ) => {
        clearFeedback();


        setConfirmAction({
            type:
                "delete",

            user,

            title:
                "Delete User",

            message:
                `Delete ${getUserDisplayName(
                    user,
                    "this user"
                )}? This action cannot be undone.`,

            confirmText:
                "Delete",

            variant:
                "danger",
        });
    };


    const requestResetPassword = (
        user
    ) => {
        if (
            !user?._id ||
            !pendingResetUserIds.includes(
                String(
                    user._id
                )
            )
        ) {
            setErrorMessage(
                "This user does not have a pending password reset request."
            );

            return;
        }


        clearFeedback();


        setConfirmAction({
            type:
                "reset-password",

            user,

            title:
                "Reset Password",

            message:
                `Generate a new temporary password for ${getUserDisplayName(
                    user,
                    user.username ||
                    "this user"
                )}?`,

            confirmText:
                "Reset Password",

            variant:
                "warning",
        });
    };


    // ======================================================
    // USER ACTION
    // ======================================================

    const handleNormalAction =
        async (
            action
        ) => {
            const user =
                action?.user;


            if (
                !action ||
                !user?._id
            ) {
                return;
            }


            try {
                setProcessingId(
                    user._id
                );

                clearFeedback();


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
                    response?.data
                        ?.message ||
                    "Action completed successfully."
                );


                setConfirmAction(
                    null
                );


                await loadUsers();

            } catch (error) {
                console.error(
                    "User action error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to complete the action."
                    )
                );

            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    // ======================================================
    // PASSWORD RESET
    // ======================================================

    const handleResetPassword =
        async (
            user
        ) => {
            try {
                setProcessingId(
                    user._id
                );


                const response =
                    await api.post(
                        `/admin/users/${user._id}/reset-password`
                    );


                const credentials =
                    response.data
                        ?.credentials;


                if (!credentials) {
                    throw new Error(
                        "Credential information was not returned."
                    );
                }


                setCredentialUser({
                    ...user,

                    ...(response.data
                        ?.user ||
                        {}),
                });


                setResetCredentials(
                    credentials
                );


                setSuccessMessage(
                    response.data
                        ?.message ||
                    "Temporary password generated successfully."
                );


                await Promise.all([
                    loadUsers(),
                    loadPasswordResetRequests(),
                ]);

            } catch (error) {
                console.error(
                    "Reset password error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reset this user's password."
                    )
                );

            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    const handleConfirmDialog =
        async () => {
            const action =
                confirmAction;


            if (
                action?.type ===
                "reset-password"
            ) {
                setConfirmAction(
                    null
                );


                await handleResetPassword(
                    action.user
                );


                return;
            }


            await handleNormalAction(
                action
            );
        };


    // ======================================================
    // NOTICE
    // ======================================================

    const showPendingResetNotice =
        Boolean(
            selectedUserId &&
            (
                pendingResetUserIds.includes(
                    String(
                        selectedUserId
                    )
                ) ||
                passwordResetRequest
                    ?.status ===
                "pending"
            )
        );


    // ======================================================
    // COUNTS
    // ======================================================

    const trainerCount =
        users.filter(
            (
                user
            ) =>
                user.role ===
                "trainer"
        ).length;


    const traineeCount =
        users.filter(
            (
                user
            ) =>
                user.role ===
                "trainee"
        ).length;


    // ======================================================
    // UI
    // ======================================================

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
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-slate-100
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
                            text-[12px]
                            font-semibold
                            text-slate-800
                        "
                    >
                        Trainer & Trainee Accounts
                    </h2>


                    <p
                        className="
                            mt-1
                            text-[8px]
                            text-slate-400
                        "
                    >
                        Search and manage user accounts.
                    </p>
                </div>


                <div
                    className="
                        flex
                        gap-2
                    "
                >
                    <CountBadge
                        label="Trainers"
                        value={
                            trainerCount
                        }
                    />


                    <CountBadge
                        label="Trainees"
                        value={
                            traineeCount
                        }
                    />
                </div>
            </div>


            {/* FILTER AREA */}

            <div
                className="
                    space-y-3
                    border-b
                    border-slate-100
                    p-5
                "
            >
                {showPendingResetNotice && (
                    <FeedbackAlert
                        type="info"
                        message="This user has a pending password reset request. Reset Password is now available."
                    />
                )}


                <FeedbackAlert
                    type="success"
                    message={
                        successMessage
                    }
                    onClose={() =>
                        setSuccessMessage(
                            ""
                        )
                    }
                />


                <FeedbackAlert
                    type="error"
                    message={
                        errorMessage
                    }
                    onClose={() =>
                        setErrorMessage(
                            ""
                        )
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
            </div>


            {/* TABLE */}

            {loading ? (
                <div className="p-5">
                    <LoadingCard
                        message="Loading users..."
                    />
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
                        handleEditUser
                    }
                    onResetPassword={
                        requestResetPassword
                    }
                    onDeactivate={
                        requestDeactivate
                    }
                    onReactivate={
                        requestReactivate
                    }
                    onDelete={
                        requestDelete
                    }
                />
            )}


            {/* EDIT USER */}

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
                    editSaving
                }
                errorMessage={
                    editError
                }
                onSave={
                    handleSaveEditedUser
                }
                onClose={() => {
                    if (
                        !editSaving
                    ) {
                        setEditingUser(
                            null
                        );

                        setEditError(
                            ""
                        );
                    }
                }}
            />


            {/* CONFIRM */}

            <ConfirmDialog
                open={
                    Boolean(
                        confirmAction
                    )
                }
                title={
                    confirmAction
                        ?.title ||
                    ""
                }
                message={
                    confirmAction
                        ?.message ||
                    ""
                }
                confirmText={
                    confirmAction
                        ?.confirmText ||
                    "Confirm"
                }
                variant={
                    confirmAction
                        ?.variant ||
                    "danger"
                }
                loading={
                    Boolean(
                        processingId
                    )
                }
                onConfirm={
                    handleConfirmDialog
                }
                onCancel={() =>
                    setConfirmAction(
                        null
                    )
                }
            />


            {/* RESET CREDENTIALS */}

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
                    setResetCredentials(
                        null
                    );

                    setCredentialUser(
                        null
                    );
                }}
            />

        </section>
    );
}


function CountBadge({
    label,
    value,
}) {
    return (
        <span
            className="
                rounded-full
                bg-slate-100
                px-3
                py-1.5
                text-[8px]
                text-slate-500
            "
        >
            {label}:{" "}

            <strong
                className="
                    text-slate-700
                "
            >
                {value}
            </strong>
        </span>
    );
}


export default ManageUsersTable;