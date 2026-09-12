import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../../services/api";

import FeedbackAlert from "../ui/FeedbackAlert";
import StatusBadge from "../ui/StatusBadge";

import {
    getApiErrorMessage,
    getUserDisplayName,
    parseArrayResponse,
} from "../../utils/training";


const TRAINING_SECTIONS = [
    {
        id: "manual-handling",
        name: "Manual Handling",
    },
    {
        id: "working-at-height",
        name: "Working at Height",
    },
];


function TrainerAssignmentsPanel() {
    const [
        users,
        setUsers,
    ] = useState([]);

    const [
        selectedUserId,
        setSelectedUserId,
    ] = useState("");

    const [
        selectedSections,
        setSelectedSections,
    ] = useState([]);

    const [
        roleFilter,
        setRoleFilter,
    ] = useState("all");

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    const loadUsers =
        useCallback(
            async () => {
                try {
                    setLoading(true);

                    const response =
                        await api.get(
                            "/admin/users"
                        );

                    const responseUsers =
                        parseArrayResponse(
                            response.data,
                            "users"
                        );

                    const manageableUsers =
                        responseUsers.filter(
                            (
                                user
                            ) =>
                                user.role ===
                                "trainer" ||
                                user.role ===
                                "trainee"
                        );

                    setUsers(
                        manageableUsers
                    );

                    return manageableUsers;

                } catch (error) {
                    console.error(
                        "Load training access users error:",
                        error
                    );

                    setErrorMessage(
                        getApiErrorMessage(
                            error,
                            "Unable to load users."
                        )
                    );

                    return [];

                } finally {
                    setLoading(false);
                }
            },
            []
        );


    useEffect(() => {
        loadUsers();
    }, [
        loadUsers,
    ]);


    const filteredUsers =
        useMemo(
            () =>
                roleFilter ===
                    "all"
                    ? users
                    : users.filter(
                        (
                            user
                        ) =>
                            user.role ===
                            roleFilter
                    ),
            [
                users,
                roleFilter,
            ]
        );


    const selectedUser =
        useMemo(
            () =>
                users.find(
                    (
                        user
                    ) =>
                        String(
                            user._id
                        ) ===
                        String(
                            selectedUserId
                        )
                ) ||
                null,
            [
                users,
                selectedUserId,
            ]
        );


    const handleSelectUser = (
        event
    ) => {
        const userId =
            event.target.value;

        setSelectedUserId(
            userId
        );

        setSuccessMessage("");
        setErrorMessage("");

        const user =
            users.find(
                (
                    item
                ) =>
                    String(
                        item._id
                    ) ===
                    String(
                        userId
                    )
            );

        if (
            !user
        ) {
            setSelectedSections(
                []
            );

            return;
        }

        if (
            user.role ===
            "trainee"
        ) {
            setSelectedSections(
                TRAINING_SECTIONS.map(
                    (
                        section
                    ) =>
                        section.id
                )
            );

            return;
        }

        setSelectedSections(
            Array.isArray(
                user.assignedTrainingSections
            )
                ? user
                    .assignedTrainingSections
                    .slice(
                        0,
                        1
                    )
                : []
        );
    };


    const selectSection = (
        sectionId
    ) => {
        if (
            !selectedUser ||
            selectedUser.role ===
            "trainee"
        ) {
            return;
        }

        setSelectedSections([
            sectionId,
        ]);
    };


    const handleSave =
        async () => {
            if (
                !selectedUser
            ) {
                setErrorMessage(
                    "Please select a user."
                );

                return;
            }

            const trainingSections =
                selectedUser.role ===
                    "trainee"
                    ? TRAINING_SECTIONS.map(
                        (
                            section
                        ) =>
                            section.id
                    )
                    : selectedSections;

            if (
                selectedUser.role ===
                "trainer" &&
                trainingSections.length !==
                1
            ) {
                setErrorMessage(
                    "Trainer must have exactly one training area."
                );

                return;
            }

            try {
                setSaving(true);
                setErrorMessage("");
                setSuccessMessage("");

                const response =
                    await api.patch(
                        `/admin/users/${selectedUser._id}/training-sections`,
                        {
                            trainingSections,
                        }
                    );

                setSuccessMessage(
                    response.data?.message ||
                    "Training access updated successfully."
                );

                const refreshedUsers =
                    await loadUsers();

                const refreshedUser =
                    refreshedUsers.find(
                        (
                            user
                        ) =>
                            String(
                                user._id
                            ) ===
                            String(
                                selectedUser._id
                            )
                    );

                if (
                    refreshedUser
                ) {
                    setSelectedSections(
                        Array.isArray(
                            refreshedUser
                                .assignedTrainingSections
                        )
                            ? refreshedUser
                                .assignedTrainingSections
                            : []
                    );
                }

            } catch (error) {
                console.error(
                    "Update training access error:",
                    error
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to update training access."
                    )
                );

            } finally {
                setSaving(false);
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
                <h2
                    className="
                        text-[12px]
                        font-bold
                        text-[#172033]
                    "
                >
                    Training Access
                </h2>

                <p
                    className="
                        mt-1
                        text-[8px]
                        font-medium
                        text-slate-500
                    "
                >
                    Trainer receives one training area. Trainee receives both automatically.
                </p>
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


                <div
                    className="
                        grid
                        gap-3
                        md:grid-cols-2
                    "
                >
                    <select
                        value={
                            roleFilter
                        }
                        onChange={(
                            event
                        ) =>
                            setRoleFilter(
                                event.target.value
                            )
                        }
                        className={
                            inputClass
                        }
                    >
                        <option value="all">
                            All Roles
                        </option>

                        <option value="trainer">
                            Trainer
                        </option>

                        <option value="trainee">
                            Trainee
                        </option>
                    </select>


                    <select
                        value={
                            selectedUserId
                        }
                        onChange={
                            handleSelectUser
                        }
                        disabled={
                            loading
                        }
                        className={
                            inputClass
                        }
                    >
                        <option value="">
                            {loading
                                ? "Loading users..."
                                : "Select user"}
                        </option>

                        {filteredUsers.map(
                            (
                                user
                            ) => (
                                <option
                                    key={
                                        user._id
                                    }
                                    value={
                                        user._id
                                    }
                                >
                                    {getUserDisplayName(
                                        user,
                                        user.username
                                    )}{" "}
                                    — {user.role}
                                </option>
                            )
                        )}
                    </select>
                </div>


                {selectedUser && (
                    <>
                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                                rounded-lg
                                bg-slate-50
                                p-3
                            "
                        >
                            <span
                                className="
                                    text-[9px]
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {getUserDisplayName(
                                    selectedUser,
                                    selectedUser.username
                                )}
                            </span>

                            <StatusBadge
                                status={
                                    selectedUser.role
                                }
                            />

                            <StatusBadge
                                status={
                                    selectedUser.status
                                }
                            />
                        </div>


                        <div
                            className="
                                grid
                                gap-3
                                md:grid-cols-2
                            "
                        >
                            {TRAINING_SECTIONS.map(
                                (
                                    section
                                ) => {
                                    const selected =
                                        selectedSections.includes(
                                            section.id
                                        );

                                    return (
                                        <label
                                            key={
                                                section.id
                                            }
                                            className={`
                                                flex
                                                items-center
                                                gap-3
                                                rounded-lg
                                                border
                                                p-4

                                                ${selected
                                                    ? "border-blue-300 bg-blue-50"
                                                    : "border-slate-200 bg-white"
                                                }

                                                ${selectedUser.role ===
                                                    "trainer"
                                                    ? "cursor-pointer"
                                                    : "cursor-default"
                                                }
                                            `}
                                        >
                                            <input
                                                type={
                                                    selectedUser.role ===
                                                        "trainer"
                                                        ? "radio"
                                                        : "checkbox"
                                                }
                                                checked={
                                                    selected
                                                }
                                                disabled={
                                                    selectedUser.role ===
                                                    "trainee"
                                                }
                                                onChange={() =>
                                                    selectSection(
                                                        section.id
                                                    )
                                                }
                                                className="
                                                    h-4
                                                    w-4
                                                    accent-blue-600
                                                "
                                            />

                                            <span
                                                className="
                                                    text-[9px]
                                                    font-bold
                                                    text-slate-800
                                                "
                                            >
                                                {section.name}
                                            </span>
                                        </label>
                                    );
                                }
                            )}
                        </div>


                        {selectedUser.role ===
                            "trainee" && (
                                <div
                                    className="
                                    rounded-lg
                                    border
                                    border-emerald-200
                                    bg-emerald-50
                                    p-3
                                "
                                >
                                    <p
                                        className="
                                        text-[8px]
                                        font-medium
                                        text-emerald-700
                                    "
                                    >
                                        Trainee training access is automatically fixed to both modules.
                                    </p>
                                </div>
                            )}


                        <div
                            className="
                                flex
                                justify-end
                            "
                        >
                            <button
                                type="button"
                                onClick={
                                    handleSave
                                }
                                disabled={
                                    saving
                                }
                                className="
                                    min-h-[40px]
                                    w-full
                                    rounded-lg
                                    bg-blue-600
                                    px-5
                                    text-[9px]
                                    font-semibold
                                    text-white
                                    hover:bg-blue-700
                                    disabled:opacity-50
                                    sm:w-auto
                                "
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Training Access"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}


const inputClass = `
    min-h-[40px]
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[9px]
    font-medium
    text-slate-800
    outline-none
    focus:border-blue-500
    focus:ring-1
    focus:ring-blue-100
`;


export default TrainerAssignmentsPanel;