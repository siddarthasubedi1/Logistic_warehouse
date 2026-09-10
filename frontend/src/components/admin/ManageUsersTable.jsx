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


// ======================================================
// MANAGE USERS TABLE
// ======================================================

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
    // PASSWORD RESET REQUESTS
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
    // CONFIRM DIALOG
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
    // RESET CREDENTIALS
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
    // LOAD RESET REQUESTS
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
                        .filter(
                            Boolean
                        );


                setPendingResetUserIds(
                    [
                        ...new Set(
                            ids
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
    // SCROLL TO USER FROM RESET REQUEST
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
    // FILTERED USERS
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
                                .trim()
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


                    const text =
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
                            user.status,
                        ]
                            .filter(
                                Boolean
                            )
                            .join(" ")
                            .toLowerCase();


                    return text.includes(
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


    const activeCount =
        users.filter(
            (
                user
            ) =>
                user.status ===
                "active"
        ).length;


    // ======================================================
    // EDIT USER
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
                !editingUser
                    ?._id
            ) {
                return;
            }


            setEditError(
                ""
            );


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


            if (
                !Number.isInteger(
                    Number(
                        formData.age
                    )
                ) ||
                Number(
                    formData.age
                ) <
                16
            ) {
                setEditError(
                    "Age must be 16 or above."
                );

                return;
            }


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
                    response.data
                        ?.message ||
                    "User updated successfully."
                );


                setEditingUser(
                    null
                );

                setEditError(
                    ""
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

        setEditError(
            ""
        );
    };


    // ======================================================
    // DEACTIVATE REQUEST
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
    // REACTIVATE REQUEST
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
    // DELETE REQUEST
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
    // RESET PASSWORD REQUEST
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
    // NORMAL USER ACTION
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


            try {
                setProcessingId(
                    user._id
                );

                clearFeedback();


                if (
                    action.type ===
                    "deactivate"
                ) {
                    const response =
                        await api.patch(
                            `/admin/users/${user._id}/deactivate`
                        );


                    setSuccessMessage(
                        response.data
                            ?.message ||
                        "User deactivated successfully."
                    );
                }


                if (
                    action.type ===
                    "reactivate"
                ) {
                    const response =
                        await api.patch(
                            `/admin/users/${user._id}/reactivate`
                        );


                    setSuccessMessage(
                        response.data
                            ?.message ||
                        "User reactivated successfully."
                    );
                }


                if (
                    action.type ===
                    "delete"
                ) {
                    const response =
                        await api.delete(
                            `/admin/users/${user._id}`
                        );


                    setSuccessMessage(
                        response.data
                            ?.message ||
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
                setProcessingId(
                    ""
                );
            }
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


    // ======================================================
    // CONFIRM HANDLER
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
    // RESET NOTICE
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
    // UI
    // ======================================================

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

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    overflow-hidden
                    border-b
                    border-slate-100
                    bg-gradient-to-r
                    from-white
                    via-white
                    to-blue-50
                    p-5
                    sm:p-6
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-20
                        -top-20
                        h-48
                        w-48
                        rounded-full
                        bg-blue-50
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        flex
                        flex-col
                        gap-4
                        xl:flex-row
                        xl:items-center
                        xl:justify-between
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
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                            "
                        >
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
                        </div>


                        <div>
                            <p
                                className="
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-blue-600
                                "
                            >
                                User Administration
                            </p>


                            <h2
                                className="
                                    mt-1
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
                                    max-w-xl
                                    text-[10px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                Search, edit, deactivate, reactivate
                                and manage password-reset requests.
                            </p>
                        </div>

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-3
                            gap-2
                            sm:w-fit
                        "
                    >
                        <MiniStat
                            label="Trainers"
                            value={
                                trainerCount
                            }
                        />

                        <MiniStat
                            label="Trainees"
                            value={
                                traineeCount
                            }
                        />

                        <MiniStat
                            label="Active"
                            value={
                                activeCount
                            }
                        />
                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* FILTERS */}
            {/* ================================================= */}

            <div
                className="
                    space-y-4
                    border-b
                    border-slate-100
                    p-4
                    sm:p-5
                "
            >

                {showPendingResetNotice && (
                    <FeedbackAlert
                        type="warning"
                        message="This user has a pending password reset request. The Reset Password action is now available for this account."
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
            {/* USER TABLE */}
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
            {/* CONFIRM */}
            {/* ================================================= */}

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


            {/* ================================================= */}
            {/* GENERATED CREDENTIALS */}
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


// ======================================================
// MINI STAT
// ======================================================

function MiniStat({
    label,
    value,
}) {
    return (
        <div
            className="
                min-w-[72px]
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                py-2.5
                text-center
                shadow-sm
            "
        >
            <p
                className="
                    text-lg
                    font-bold
                    text-slate-900
                "
            >
                {value}
            </p>


            <p
                className="
                    mt-0.5
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-400
                "
            >
                {label}
            </p>
        </div>
    );
}


export default ManageUsersTable;