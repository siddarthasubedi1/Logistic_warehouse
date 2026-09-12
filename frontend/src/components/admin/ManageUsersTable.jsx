import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import api from "../../services/api";


const TRAINING_SECTIONS = [
    {
        value:
            "manual-handling",

        label:
            "Manual Handling",
    },

    {
        value:
            "working-at-height",

        label:
            "Working at Height",
    },
];


function ManageUsersTable({
    selectedUserId = null,
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
        message,
        setMessage,
    ] = useState("");


    const [
        actionUserId,
        setActionUserId,
    ] = useState("");


    const [
        roleFilter,
        setRoleFilter,
    ] = useState("all");


    const [
        selectedAssignmentUserId,
        setSelectedAssignmentUserId,
    ] = useState("");


    const [
        assignmentSection,
        setAssignmentSection,
    ] = useState("");


    const [
        updatingAssignment,
        setUpdatingAssignment,
    ] = useState(false);


    const [
        resetCredentials,
        setResetCredentials,
    ] = useState(null);


    const selectedRowRef =
        useRef(null);


    const getUserId =
        (
            user
        ) =>
            user?._id ||
            user?.id ||
            "";


    const getName =
        (
            user
        ) =>
            `${user?.firstName || ""} ${user?.lastName || ""}`
                .trim() ||
            user?.username ||
            "User";


    const getRequestUserId =
        (
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
            },
            []
        );


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


                    setResetRequests(
                        data.filter(
                            (
                                request
                            ) =>
                                !request.status ||
                                request.status ===
                                "pending"
                        )
                    );

                } catch (error) {
                    console.error(
                        "Reset request loading error:",
                        error
                    );


                    setResetRequests(
                        []
                    );
                }
            },
            []
        );


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

                } catch (error) {
                    console.error(
                        "Manage users error:",
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


    useEffect(() => {
        if (
            !loading &&
            selectedUserId &&
            selectedRowRef.current
        ) {
            selectedRowRef.current.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "center",
            });
        }
    }, [
        loading,
        selectedUserId,
    ]);


    const filteredUsers =
        useMemo(
            () => {
                if (
                    roleFilter ===
                    "all"
                ) {
                    return users;
                }


                return users.filter(
                    (
                        user
                    ) =>
                        String(
                            user.role ||
                            ""
                        ).toLowerCase() ===
                        roleFilter
                );
            },
            [
                users,
                roleFilter,
            ]
        );


    const selectedAssignmentUser =
        useMemo(
            () =>
                users.find(
                    (
                        user
                    ) =>
                        String(
                            getUserId(
                                user
                            )
                        ) ===
                        String(
                            selectedAssignmentUserId
                        )
                ) ||
                null,
            [
                users,
                selectedAssignmentUserId,
            ]
        );


    useEffect(() => {
        if (
            !selectedAssignmentUser
        ) {
            setAssignmentSection(
                ""
            );

            return;
        }


        if (
            selectedAssignmentUser.role ===
            "trainer"
        ) {
            setAssignmentSection(
                selectedAssignmentUser
                    .assignedTrainingSections?.[0] ||
                ""
            );
        } else {
            setAssignmentSection(
                ""
            );
        }
    }, [
        selectedAssignmentUser,
    ]);


    const hasResetRequest =
        (
            user
        ) =>
            resetRequests.some(
                (
                    request
                ) =>
                    String(
                        getRequestUserId(
                            request
                        )
                    ) ===
                    String(
                        getUserId(
                            user
                        )
                    )
            );


    const updateTrainerAssignment =
        async () => {
            if (
                !selectedAssignmentUser ||
                selectedAssignmentUser.role !==
                "trainer"
            ) {
                return;
            }


            if (
                !assignmentSection
            ) {
                setError(
                    "Please select one training module for the Trainer."
                );

                return;
            }


            try {
                setUpdatingAssignment(
                    true
                );


                setError(
                    ""
                );


                setMessage(
                    ""
                );


                await api.patch(
                    `/admin/users/${getUserId(
                        selectedAssignmentUser
                    )}/training-sections`,
                    {
                        assignedTrainingSections: [
                            assignmentSection,
                        ],
                    }
                );


                setMessage(
                    "Trainer training assignment updated successfully."
                );


                await loadUsers();

            } catch (error) {
                console.error(
                    "Training assignment update error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to update training assignment."
                );

            } finally {
                setUpdatingAssignment(
                    false
                );
            }
        };


    const toggleStatus =
        async (
            user
        ) => {
            const userId =
                getUserId(
                    user
                );


            const active =
                String(
                    user.status ||
                    ""
                ).toLowerCase() ===
                "active";


            try {
                setActionUserId(
                    userId
                );


                setError(
                    ""
                );


                setMessage(
                    ""
                );


                await api.patch(
                    `/admin/users/${userId}/${active
                        ? "deactivate"
                        : "reactivate"
                    }`
                );


                setMessage(
                    active
                        ? "User deactivated successfully."
                        : "User reactivated successfully."
                );


                await loadUsers();

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to update user status."
                );

            } finally {
                setActionUserId(
                    ""
                );
            }
        };


    const deleteUser =
        async (
            user
        ) => {
            const name =
                getName(
                    user
                );


            if (
                !window.confirm(
                    `Delete ${name}? This action cannot be undone.`
                )
            ) {
                return;
            }


            const userId =
                getUserId(
                    user
                );


            try {
                setActionUserId(
                    userId
                );


                setError(
                    ""
                );


                setMessage(
                    ""
                );


                await api.delete(
                    `/admin/users/${userId}`
                );


                setMessage(
                    "User deleted successfully."
                );


                await Promise.all([
                    loadUsers(),
                    loadResetRequests(),
                ]);

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to delete user."
                );

            } finally {
                setActionUserId(
                    ""
                );
            }
        };


    const resetPassword =
        async (
            user
        ) => {
            if (
                !hasResetRequest(
                    user
                )
            ) {
                setError(
                    "This user does not have a pending password reset request."
                );

                return;
            }


            const name =
                getName(
                    user
                );


            if (
                !window.confirm(
                    `Reset the password for ${name}? A new temporary password will be generated.`
                )
            ) {
                return;
            }


            const userId =
                getUserId(
                    user
                );


            try {
                setActionUserId(
                    userId
                );


                setError(
                    ""
                );


                setMessage(
                    ""
                );


                setResetCredentials(
                    null
                );


                const response =
                    await api.post(
                        `/admin/users/${userId}/reset-password`
                    );


                const returned =
                    response.data?.credentials;


                if (
                    !returned?.username ||
                    !returned?.password
                ) {
                    setError(
                        "Password was reset but temporary credentials were not returned."
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
                        returned.username,

                    password:
                        returned.password,
                });


                setMessage(
                    "Password reset successfully. Copy or send the temporary credentials now because the password will not be shown again."
                );


                await Promise.all([
                    loadUsers(),
                    loadResetRequests(),
                ]);

            } catch (error) {
                console.error(
                    "Reset password error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to reset the user's password."
                );

            } finally {
                setActionUserId(
                    ""
                );
            }
        };


    const copyResetCredentials =
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


                setMessage(
                    "Temporary credentials copied to clipboard."
                );

            } catch {
                setError(
                    "Unable to copy automatically."
                );
            }
        };


    const emailResetCredentials =
        () => {
            if (
                !resetCredentials?.email
            ) {
                setError(
                    "No email address is available for this user."
                );

                return;
            }


            const subject =
                encodeURIComponent(
                    "UK LogiWare - Password Reset Credentials"
                );


            const body =
                encodeURIComponent(
                    `Hello ${resetCredentials.name},\n\nYour UK LogiWare password has been reset.\n\nUsername: ${resetCredentials.username}\nTemporary Password: ${resetCredentials.password}\n\nYou must change this temporary password when you next log in.\n\nUK LogiWare Safety Training`
                );


            window.location.href =
                `mailto:${resetCredentials.email}?subject=${subject}&body=${body}`;
        };


    return (
        <div
            className="
                space-y-4
            "
        >
            {error && (
                <Alert
                    type="error"
                    text={
                        error
                    }
                    onClose={() =>
                        setError(
                            ""
                        )
                    }
                />
            )}


            {message && (
                <Alert
                    type="success"
                    text={
                        message
                    }
                    onClose={() =>
                        setMessage(
                            ""
                        )
                    }
                />
            )}


            <section
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#dbe4ef]
                    bg-white
                    shadow-sm
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-3
                        border-b
                        border-[#e8eef5]
                        px-5
                        py-4
                    "
                >
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-50
                            text-blue-600
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="
                                h-5
                                w-5
                            "
                        >
                            <circle
                                cx="9"
                                cy="8"
                                r="3"
                            />

                            <path d="M3 20c.5-4 2.5-6 6-6" />

                            <path d="M18 13v8" />

                            <path d="M14 17h8" />
                        </svg>
                    </div>


                    <div>
                        <h2
                            className="
                                text-[14px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Trainer & Trainee Training Assignments
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                text-[#64748b]
                            "
                        >
                            Trainer receives exactly one module. Trainee receives both automatically.
                        </p>
                    </div>
                </div>


                <div
                    className="
                        grid
                        gap-4
                        p-5
                        md:grid-cols-[220px_minmax(0,1fr)]
                    "
                >
                    <label>
                        <span
                            className="
                                mb-2
                                block
                                text-[10px]
                                font-medium
                                text-[#172033]
                            "
                        >
                            User Type
                        </span>


                        <select
                            value={
                                roleFilter
                            }
                            onChange={(
                                event
                            ) => {
                                setRoleFilter(
                                    event.target.value
                                );

                                setSelectedAssignmentUserId(
                                    ""
                                );
                            }}
                            className="app-input"
                        >
                            <option value="all">
                                All Users
                            </option>

                            <option value="trainer">
                                Trainers
                            </option>

                            <option value="trainee">
                                Trainees
                            </option>
                        </select>
                    </label>


                    <label>
                        <span
                            className="
                                mb-2
                                block
                                text-[10px]
                                font-medium
                                text-[#172033]
                            "
                        >
                            Select Trainer or Trainee
                        </span>


                        <select
                            value={
                                selectedAssignmentUserId
                            }
                            onChange={(
                                event
                            ) =>
                                setSelectedAssignmentUserId(
                                    event.target.value
                                )
                            }
                            className="app-input"
                        >
                            <option value="">
                                Select a user
                            </option>


                            {filteredUsers.map(
                                (
                                    user
                                ) => (
                                    <option
                                        key={
                                            getUserId(
                                                user
                                            )
                                        }
                                        value={
                                            getUserId(
                                                user
                                            )
                                        }
                                    >
                                        {getName(
                                            user
                                        )}{" "}
                                        -{" "}
                                        {user.role}
                                    </option>
                                )
                            )}
                        </select>
                    </label>
                </div>


                {selectedAssignmentUser && (
                    <div
                        className="
                            border-t
                            border-[#e8eef5]
                            px-5
                            py-4
                        "
                    >
                        {selectedAssignmentUser.role ===
                            "trainer" ? (
                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    md:flex-row
                                    md:items-end
                                "
                            >
                                <label
                                    className="
                                        min-w-0
                                        flex-1
                                    "
                                >
                                    <span
                                        className="
                                            mb-2
                                            block
                                            text-[10px]
                                            font-medium
                                            text-[#172033]
                                        "
                                    >
                                        Assigned Module
                                    </span>


                                    <select
                                        value={
                                            assignmentSection
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setAssignmentSection(
                                                event.target.value
                                            )
                                        }
                                        className="app-input"
                                    >
                                        <option value="">
                                            Select one module
                                        </option>


                                        {TRAINING_SECTIONS.map(
                                            (
                                                section
                                            ) => (
                                                <option
                                                    key={
                                                        section.value
                                                    }
                                                    value={
                                                        section.value
                                                    }
                                                >
                                                    {section.label}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </label>


                                <button
                                    type="button"
                                    onClick={
                                        updateTrainerAssignment
                                    }
                                    disabled={
                                        updatingAssignment
                                    }
                                    className="
                                        min-h-[44px]
                                        rounded-lg
                                        bg-[#1769e8]
                                        px-5
                                        text-[10px]
                                        font-semibold
                                        text-white
                                        disabled:opacity-50
                                    "
                                >
                                    {updatingAssignment
                                        ? "Updating..."
                                        : "Save Assignment"}
                                </button>
                            </div>
                        ) : (
                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-emerald-100
                                    bg-emerald-50
                                    px-4
                                    py-3
                                    text-[10px]
                                    text-emerald-700
                                "
                            >
                                This Trainee automatically has access to Manual Handling and Working at Height.
                            </div>
                        )}
                    </div>
                )}
            </section>


            {resetCredentials && (
                <section
                    className="
                        rounded-xl
                        border
                        border-blue-200
                        bg-[#eef6ff]
                        p-5
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-4
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
                                text-[10px]
                                text-slate-500
                            "
                        >
                            Close
                        </button>
                    </div>


                    <p
                        className="
                            mt-4
                            text-[9px]
                            text-orange-600
                        "
                    >
                        Save or send these credentials now. The temporary password is shown only once.
                    </p>


                    <div
                        className="
                            mt-4
                            grid
                            gap-3
                            md:grid-cols-2
                        "
                    >
                        <Credential
                            label="Username"
                            value={
                                resetCredentials.username
                            }
                        />


                        <Credential
                            label="Temporary Password"
                            value={
                                resetCredentials.password
                            }
                        />
                    </div>


                    <div
                        className="
                            mt-4
                            flex
                            flex-wrap
                            gap-3
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                copyResetCredentials
                            }
                            className="
                                rounded-lg
                                bg-[#1769e8]
                                px-5
                                py-2.5
                                text-[10px]
                                font-semibold
                                text-white
                            "
                        >
                            Copy Credentials
                        </button>


                        <button
                            type="button"
                            onClick={
                                emailResetCredentials
                            }
                            className="
                                rounded-lg
                                bg-[#1769e8]
                                px-5
                                py-2.5
                                text-[10px]
                                font-semibold
                                text-white
                            "
                        >
                            Send Email
                        </button>
                    </div>
                </section>
            )}


            <section
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#dbe4ef]
                    bg-white
                    shadow-sm
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-[#e8eef5]
                        px-5
                        py-4
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
                            Trainer & Trainee Accounts
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                text-[#64748b]
                            "
                        >
                            Manage system access status.
                        </p>
                    </div>


                    <span
                        className="
                            rounded-lg
                            bg-blue-50
                            px-3
                            py-2
                            text-[10px]
                            font-medium
                            text-blue-600
                        "
                    >
                        {users.length} Users
                    </span>
                </div>


                <div
                    className="
                        overflow-x-auto
                    "
                >
                    <table
                        className="
                            min-w-[850px]
                        "
                    >
                        <thead
                            className="
                                bg-[#f8fafc]
                            "
                        >
                            <tr>
                                <TableHead>
                                    User
                                </TableHead>

                                <TableHead>
                                    Username
                                </TableHead>

                                <TableHead>
                                    Role
                                </TableHead>

                                <TableHead>
                                    Status
                                </TableHead>

                                <TableHead
                                    align="right"
                                >
                                    Actions
                                </TableHead>
                            </tr>
                        </thead>


                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="
                                            py-14
                                            text-center
                                            text-[11px]
                                            text-slate-500
                                        "
                                    >
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length ===
                                0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="
                                            py-14
                                            text-center
                                            text-[11px]
                                            text-slate-500
                                        "
                                    >
                                        No Trainer or Trainee accounts found.
                                    </td>
                                </tr>
                            ) : (
                                users.map(
                                    (
                                        user
                                    ) => {
                                        const userId =
                                            getUserId(
                                                user
                                            );


                                        const pendingReset =
                                            hasResetRequest(
                                                user
                                            );


                                        const active =
                                            String(
                                                user.status ||
                                                ""
                                            ).toLowerCase() ===
                                            "active";


                                        const busy =
                                            String(
                                                actionUserId
                                            ) ===
                                            String(
                                                userId
                                            );


                                        const highlighted =
                                            String(
                                                selectedUserId ||
                                                ""
                                            ) ===
                                            String(
                                                userId
                                            );


                                        return (
                                            <tr
                                                key={
                                                    userId
                                                }
                                                ref={
                                                    highlighted
                                                        ? selectedRowRef
                                                        : null
                                                }
                                                className={`
                                                    border-b
                                                    border-[#edf1f6]
                                                    last:border-0

                                                    ${highlighted ||
                                                        pendingReset
                                                        ? "bg-blue-50/50"
                                                        : "bg-white"
                                                    }
                                                `}
                                            >
                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                    "
                                                >
                                                    <div>
                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                            "
                                                        >
                                                            <p
                                                                className="
                                                                    text-[10px]
                                                                    font-semibold
                                                                    text-[#172033]
                                                                "
                                                            >
                                                                {getName(
                                                                    user
                                                                )}
                                                            </p>


                                                            {pendingReset && (
                                                                <span
                                                                    className="
                                                                        rounded-full
                                                                        bg-amber-100
                                                                        px-2
                                                                        py-1
                                                                        text-[7px]
                                                                        font-semibold
                                                                        text-amber-700
                                                                    "
                                                                >
                                                                    RESET REQUESTED
                                                                </span>
                                                            )}
                                                        </div>


                                                        <p
                                                            className="
                                                                mt-1
                                                                text-[9px]
                                                                text-[#64748b]
                                                            "
                                                        >
                                                            {user.email ||
                                                                "—"}
                                                        </p>
                                                    </div>
                                                </td>


                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-[10px]
                                                        text-[#52627a]
                                                    "
                                                >
                                                    {user.username ||
                                                        "—"}
                                                </td>


                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            rounded-full
                                                            bg-blue-50
                                                            px-3
                                                            py-1.5
                                                            text-[9px]
                                                            font-medium
                                                            capitalize
                                                            text-blue-600
                                                        "
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>


                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                    "
                                                >
                                                    <span
                                                        className={`
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-full
                                                            px-3
                                                            py-1.5
                                                            text-[9px]
                                                            font-medium

                                                            ${active
                                                                ? "bg-emerald-50 text-emerald-600"
                                                                : "bg-slate-100 text-slate-600"
                                                            }
                                                        `}
                                                    >
                                                        <span
                                                            className={`
                                                                h-1.5
                                                                w-1.5
                                                                rounded-full

                                                                ${active
                                                                    ? "bg-emerald-500"
                                                                    : "bg-slate-400"
                                                                }
                                                            `}
                                                        />

                                                        {active
                                                            ? "Active"
                                                            : "Deactivated"}
                                                    </span>
                                                </td>


                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            flex
                                                            justify-end
                                                            gap-2
                                                        "
                                                    >
                                                        {pendingReset &&
                                                            active && (
                                                                <ActionButton
                                                                    disabled={
                                                                        busy
                                                                    }
                                                                    onClick={() =>
                                                                        resetPassword(
                                                                            user
                                                                        )
                                                                    }
                                                                    variant="blue"
                                                                >
                                                                    Reset Password
                                                                </ActionButton>
                                                            )}


                                                        <ActionButton
                                                            disabled={
                                                                busy
                                                            }
                                                            onClick={() =>
                                                                toggleStatus(
                                                                    user
                                                                )
                                                            }
                                                            variant="warning"
                                                        >
                                                            {active
                                                                ? "Deactivate"
                                                                : "Reactivate"}
                                                        </ActionButton>


                                                        <ActionButton
                                                            disabled={
                                                                busy
                                                            }
                                                            onClick={() =>
                                                                deleteUser(
                                                                    user
                                                                )
                                                            }
                                                            variant="danger"
                                                        >
                                                            Delete
                                                        </ActionButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}


function TableHead({
    children,
    align = "left",
}) {
    return (
        <th
            className={`
                px-5
                py-3
                text-[9px]
                font-semibold
                uppercase
                text-[#607089]

                ${align ===
                    "right"
                    ? "text-right"
                    : "text-left"
                }
            `}
        >
            {children}
        </th>
    );
}


function ActionButton({
    children,
    onClick,
    disabled,
    variant,
}) {
    let classes =
        "border-[#dbe4ef] text-[#52627a]";


    if (
        variant ===
        "blue"
    ) {
        classes =
            "border-blue-300 text-blue-600 hover:bg-blue-50";
    }


    if (
        variant ===
        "warning"
    ) {
        classes =
            "border-amber-300 text-amber-600 hover:bg-amber-50";
    }


    if (
        variant ===
        "danger"
    ) {
        classes =
            "border-red-200 text-red-500 hover:bg-red-50";
    }


    return (
        <button
            type="button"
            onClick={
                onClick
            }
            disabled={
                disabled
            }
            className={`
                min-h-[34px]
                whitespace-nowrap
                rounded-lg
                border
                bg-white
                px-3
                text-[9px]
                font-medium
                transition
                disabled:cursor-not-allowed
                disabled:opacity-40
                ${classes}
            `}
        >
            {children}
        </button>
    );
}


function Credential({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-lg
                border
                border-blue-100
                bg-white
                p-4
            "
        >
            <p
                className="
                    text-[8px]
                    font-semibold
                    uppercase
                    text-[#8aa0bb]
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-2
                    break-all
                    text-[11px]
                    font-bold
                    text-[#172033]
                "
            >
                {value}
            </p>
        </div>
    );
}


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
                    font-bold
                "
            >
                ×
            </button>
        </div>
    );
}


export default ManageUsersTable;