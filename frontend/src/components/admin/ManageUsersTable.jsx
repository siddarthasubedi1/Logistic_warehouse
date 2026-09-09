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

    // ======================================================
    // USERS
    // ======================================================

    const [
        users,
        setUsers,
    ] = useState([]);


    // ======================================================
    // PENDING PASSWORD RESET REQUESTS
    // ======================================================

    const [
        pendingResetUserIds,
        setPendingResetUserIds,
    ] = useState([]);


    // ======================================================
    // PAGE STATE
    // ======================================================

    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        processingId,
        setProcessingId,
    ] = useState("");


    // ======================================================
    // FILTERS
    // ======================================================

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


    // ======================================================
    // FEEDBACK
    // ======================================================

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    // ======================================================
    // CONFIRM ACTION
    // ======================================================

    const [
        confirmAction,
        setConfirmAction,
    ] = useState(null);


    // ======================================================
    // EDIT USER
    // ======================================================

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


    // ======================================================
    // RESET PASSWORD CREDENTIALS
    // ======================================================

    const [
        resetCredentials,
        setResetCredentials,
    ] = useState(null);


    const [
        credentialUser,
        setCredentialUser,
    ] = useState(null);


    // ======================================================
    // CLEAR FEEDBACK
    // ======================================================

    const clearFeedback = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };


    // ======================================================
    // LOAD USERS
    // ======================================================

    const loadUsers =
        useCallback(async () => {
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
        }, []);


    // ======================================================
    // LOAD PENDING PASSWORD RESET REQUESTS
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


                const userIds =
                    requests
                        .filter(
                            (request) =>
                                request?.status ===
                                "pending"
                        )
                        .map(
                            (request) => {
                                const requestUser =
                                    request?.user;


                                if (!requestUser) {
                                    return "";
                                }


                                if (
                                    typeof requestUser ===
                                    "object"
                                ) {
                                    return String(
                                        requestUser._id ||
                                        requestUser.id ||
                                        ""
                                    );
                                }


                                return String(
                                    requestUser
                                );
                            }
                        )
                        .filter(Boolean);


                setPendingResetUserIds(
                    [
                        ...new Set(
                            userIds
                        ),
                    ]
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
        }, []);


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        loadUsers();
        loadPasswordResetRequests();
    }, [
        loadUsers,
        loadPasswordResetRequests,
    ]);


    // ======================================================
    // SCROLL TO SELECTED USER
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


        return () => {
            window.clearTimeout(
                timer
            );
        };

    }, [
        loading,
        selectedUserId,
    ]);


    // ======================================================
    // FILTER USERS
    // ======================================================

    const filteredUsers =
        useMemo(() => {
            const query =
                searchTerm
                    .trim()
                    .toLowerCase();


            return users.filter(
                (user) => {

                    // --------------------------------------
                    // ROLE FILTER
                    // --------------------------------------

                    if (
                        roleFilter !==
                        "all" &&
                        user.role !==
                        roleFilter
                    ) {
                        return false;
                    }


                    // --------------------------------------
                    // STATUS FILTER
                    // --------------------------------------

                    if (
                        statusFilter !==
                        "all"
                    ) {
                        const status =
                            String(
                                user.status ||
                                ""
                            ).toLowerCase();


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


                    // --------------------------------------
                    // SEARCH
                    // --------------------------------------

                    if (!query) {
                        return true;
                    }


                    const searchableText =
                        [
                            getUserDisplayName(
                                user,
                                ""
                            ),

                            user.username,

                            user.email,

                            user.phoneNumber,

                            user.address,

                            user.role,
                        ]
                            .filter(
                                Boolean
                            )
                            .join(" ")
                            .toLowerCase();


                    return searchableText.includes(
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
    // OPEN EDIT USER
    // ======================================================

    const handleEditUser = (
        user
    ) => {
        if (!user?._id) {
            return;
        }


        clearFeedback();

        setEditError("");

        setEditingUser(
            user
        );
    };


    // ======================================================
    // SAVE EDITED USER
    // ======================================================

    const handleSaveEditedUser =
        async (
            formData
        ) => {
            if (
                !editingUser?._id
            ) {
                return;
            }


            setEditError("");


            // ------------------------------------------
            // REQUIRED FIELDS
            // ------------------------------------------

            if (
                !formData.firstName ||
                !formData.lastName ||
                !formData.age ||
                !formData.email ||
                !formData.phoneNumber ||
                !formData.address ||
                !formData.gender
            ) {
                setEditError(
                    "Please complete all user information."
                );

                return;
            }


            // ------------------------------------------
            // AGE
            // ------------------------------------------

            if (
                !Number.isInteger(
                    Number(
                        formData.age
                    )
                ) ||
                Number(
                    formData.age
                ) < 16
            ) {
                setEditError(
                    "Age must be 16 or above."
                );

                return;
            }


            // ------------------------------------------
            // EMAIL
            // ------------------------------------------

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    formData.email
                )
            ) {
                setEditError(
                    "Please enter a valid email address."
                );

                return;
            }


            try {
                setEditSaving(
                    true
                );


                const response =
                    await api.patch(
                        `/admin/users/${editingUser._id}`,
                        formData
                    );


                setSuccessMessage(
                    response.data?.message ||
                    "User updated successfully."
                );


                setEditingUser(
                    null
                );


                setEditError("");


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
    // CLOSE EDIT
    // ======================================================

    const handleCloseEdit = () => {
        if (
            editSaving
        ) {
            return;
        }


        setEditingUser(
            null
        );

        setEditError("");
    };


    // ======================================================
    // REQUEST DEACTIVATE
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
                )}? They will not be able to access protected areas until reactivated.`,

            confirmText:
                "Deactivate",

            variant:
                "warning",
        });
    };


    // ======================================================
    // REQUEST REACTIVATE
    // ======================================================

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


    // ======================================================
    // REQUEST DELETE
    // ======================================================

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
                `Permanently delete ${getUserDisplayName(
                    user,
                    "this user"
                )}? This action cannot be undone.`,

            confirmText:
                "Delete",

            variant:
                "danger",
        });
    };


    // ======================================================
    // CONFIRM USER ACTION
    // ======================================================

    const handleConfirmAction =
        async () => {
            const action =
                confirmAction;


            const user =
                action?.user;


            if (
                !action ||
                !user?._id
            ) {
                return;
            }


            clearFeedback();


            try {
                setProcessingId(
                    user._id
                );


                // ------------------------------------------
                // DEACTIVATE
                // ------------------------------------------

                if (
                    action.type ===
                    "deactivate"
                ) {
                    const response =
                        await api.patch(
                            `/admin/users/${user._id}/deactivate`
                        );


                    setSuccessMessage(
                        response.data?.message ||
                        "User deactivated successfully."
                    );
                }


                // ------------------------------------------
                // REACTIVATE
                // ------------------------------------------

                if (
                    action.type ===
                    "reactivate"
                ) {
                    const response =
                        await api.patch(
                            `/admin/users/${user._id}/reactivate`
                        );


                    setSuccessMessage(
                        response.data?.message ||
                        "User reactivated successfully."
                    );
                }


                // ------------------------------------------
                // DELETE
                // ------------------------------------------

                if (
                    action.type ===
                    "delete"
                ) {
                    const response =
                        await api.delete(
                            `/admin/users/${user._id}`
                        );


                    setSuccessMessage(
                        response.data?.message ||
                        "User deleted successfully."
                    );
                }


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
                        "Unable to complete the requested action."
                    )
                );

            } finally {
                setProcessingId("");
            }
        };


    // ======================================================
    // REQUEST PASSWORD RESET
    // ======================================================

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
                `Reset the password for ${getUserDisplayName(
                    user,
                    user.username ||
                    "this user"
                )}? A new temporary password will be generated.`,

            confirmText:
                "Reset Password",

            variant:
                "warning",
        });
    };


    // ======================================================
    // RESET PASSWORD
    // ======================================================

    const handleResetPassword =
        async (
            user
        ) => {
            if (!user?._id) {
                return;
            }


            try {
                setProcessingId(
                    user._id
                );


                clearFeedback();


                const response =
                    await api.post(
                        `/admin/users/${user._id}/reset-password`
                    );


                const credentials =
                    response.data
                        ?.credentials;


                if (
                    !credentials
                ) {
                    throw new Error(
                        "Credential information was not returned."
                    );
                }


                setCredentialUser({
                    ...user,

                    ...(response.data?.user ||
                        {}),
                });


                setResetCredentials(
                    credentials
                );


                setSuccessMessage(
                    response.data?.message ||
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
                setProcessingId("");
            }
        };


    // ======================================================
    // CONFIRM DIALOG HANDLER
    // ======================================================

    const handleConfirmDialog =
        async () => {
            if (
                confirmAction?.type ===
                "reset-password"
            ) {
                const user =
                    confirmAction.user;


                setConfirmAction(
                    null
                );


                await handleResetPassword(
                    user
                );


                return;
            }


            await handleConfirmAction();
        };


    // ======================================================
    // PASSWORD RESET NOTICE
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
                passwordResetRequest?.status ===
                "pending"
            )
        );


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

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    border-b
                    border-slate-200
                    p-5
                "
            >
                <h2
                    className="
                        text-base
                        font-bold
                        text-slate-900
                    "
                >
                    Trainer & Trainee Accounts
                </h2>


                <p
                    className="
                        mt-1
                        text-xs
                        text-slate-500
                    "
                >
                    Search, edit, deactivate, reactivate, reset
                    passwords, or remove user accounts.
                </p>
            </div>


            {/* ================================================= */}
            {/* FILTERS + FEEDBACK */}
            {/* ================================================= */}

            <div className="space-y-5 p-5">

                {showPendingResetNotice && (
                    <FeedbackAlert
                        type="info"
                        message="This user has a pending password reset request."
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


            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

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


            {/* ================================================= */}
            {/* EDIT USER */}
            {/* ================================================= */}

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
                onClose={
                    handleCloseEdit
                }
            />


            {/* ================================================= */}
            {/* CONFIRM ACTION */}
            {/* ================================================= */}

            <ConfirmDialog
                open={
                    Boolean(
                        confirmAction
                    )
                }
                title={
                    confirmAction?.title ||
                    ""
                }
                message={
                    confirmAction?.message ||
                    ""
                }
                confirmText={
                    confirmAction?.confirmText ||
                    "Confirm"
                }
                variant={
                    confirmAction?.variant ||
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


            {/* ================================================= */}
            {/* GENERATED RESET CREDENTIALS */}
            {/* ================================================= */}

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


export default ManageUsersTable;