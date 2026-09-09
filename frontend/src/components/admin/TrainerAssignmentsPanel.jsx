import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../../services/api";

import ActionButton from "../ui/ActionButton";
import FeedbackAlert from "../ui/FeedbackAlert";
import LoadingCard from "../ui/LoadingCard";
import StatusBadge from "../ui/StatusBadge";

import {
    getApiErrorMessage,
    getUserDisplayName,
    parseArrayResponse,
} from "../../utils/training";


const TRAINING_SECTIONS = [
    {
        id:
            "manual-handling",

        name:
            "Manual Handling",

        description:
            "Safe lifting, carrying and manual handling procedures.",
    },

    {
        id:
            "working-at-height",

        name:
            "Working at Height",

        description:
            "Safety procedures for working at elevated locations.",
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


                const responseUsers =
                    parseArrayResponse(
                        response.data,
                        "users"
                    );


                const manageableUsers =
                    responseUsers.filter(
                        (user) =>
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
                        "Unable to load Trainers and Trainees."
                    )
                );


                return [];

            } finally {
                setLoading(false);
            }
        }, []);


    useEffect(() => {
        loadUsers();
    }, [
        loadUsers,
    ]);


    // ======================================================
    // FILTER
    // ======================================================

    const filteredUsers =
        useMemo(() => {
            if (
                roleFilter ===
                "all"
            ) {
                return users;
            }


            return users.filter(
                (user) =>
                    user.role ===
                    roleFilter
            );
        }, [
            users,
            roleFilter,
        ]);


    // ======================================================
    // SELECTED USER
    // ======================================================

    const selectedUser =
        useMemo(
            () =>
                users.find(
                    (user) =>
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


    // ======================================================
    // FILTER CHANGE
    // ======================================================

    const handleRoleFilterChange = (
        event
    ) => {
        setRoleFilter(
            event.target.value
        );


        setSelectedUserId("");
        setSelectedSections([]);
        setErrorMessage("");
        setSuccessMessage("");
    };


    // ======================================================
    // USER CHANGE
    // ======================================================

    const handleUserChange = (
        event
    ) => {
        const userId =
            event.target.value;


        setSelectedUserId(
            userId
        );


        setErrorMessage("");
        setSuccessMessage("");


        const user =
            users.find(
                (item) =>
                    String(
                        item._id
                    ) ===
                    String(
                        userId
                    )
            );


        if (!user) {
            setSelectedSections(
                []
            );

            return;
        }


        // Trainee must always have both broad sections.
        if (
            user.role ===
            "trainee"
        ) {
            setSelectedSections(
                TRAINING_SECTIONS.map(
                    (section) =>
                        section.id
                )
            );

            return;
        }


        setSelectedSections(
            Array.isArray(
                user.assignedTrainingSections
            )
                ? user.assignedTrainingSections
                : []
        );
    };


    // ======================================================
    // TOGGLE TRAINER SECTION
    // ======================================================

    const toggleTrainingSection = (
        sectionId
    ) => {
        if (
            selectedUser?.role !==
            "trainer"
        ) {
            return;
        }


        setErrorMessage("");
        setSuccessMessage("");


        setSelectedSections(
            (current) =>
                current.includes(
                    sectionId
                )
                    ? current.filter(
                        (item) =>
                            item !==
                            sectionId
                    )
                    : [
                        ...current,
                        sectionId,
                    ]
        );
    };


    // ======================================================
    // SAVE
    // ======================================================

    const handleSave =
        async () => {
            if (
                !selectedUser?._id
            ) {
                setErrorMessage(
                    "Please select a user."
                );

                return;
            }


            if (
                selectedUser.role ===
                "trainer" &&
                selectedSections.length ===
                0
            ) {
                setErrorMessage(
                    "Please select at least one training section for the Trainer."
                );

                return;
            }


            const sections =
                selectedUser.role ===
                    "trainee"
                    ? TRAINING_SECTIONS.map(
                        (section) =>
                            section.id
                    )
                    : selectedSections;


            try {
                setSaving(true);

                setErrorMessage("");
                setSuccessMessage("");


                const response =
                    await api.patch(
                        `/admin/users/${selectedUser._id}/training-sections`,
                        {
                            trainingSections:
                                sections,
                        }
                    );


                setSuccessMessage(
                    response.data
                        ?.message ||
                    "Training access updated successfully."
                );


                const refreshedUsers =
                    await loadUsers();


                const refreshedUser =
                    refreshedUsers.find(
                        (user) =>
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
                        refreshedUser.role ===
                            "trainee"
                            ? TRAINING_SECTIONS.map(
                                (section) =>
                                    section.id
                            )
                            : Array.isArray(
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
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="border-b border-slate-200 p-5">

                <h2 className="text-base font-bold text-slate-900">
                    Training Area Access
                </h2>


                <p className="mt-1 text-xs leading-5 text-slate-500">
                    Trainers can receive one or both broad training areas.
                    Trainees receive both automatically.
                </p>

            </div>


            <div className="space-y-5 p-5">

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


                {loading ? (
                    <LoadingCard
                        message="Loading users..."
                    />
                ) : (
                    <>
                        {/* ================================================= */}
                        {/* USER SELECT */}
                        {/* ================================================= */}

                        <div className="grid gap-4 md:grid-cols-[220px_1fr]">

                            <label className="block">
                                <span className="text-xs font-semibold text-slate-700">
                                    User Type
                                </span>


                                <select
                                    value={
                                        roleFilter
                                    }
                                    onChange={
                                        handleRoleFilterChange
                                    }
                                    className={inputClass}
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


                            <label className="block">
                                <span className="text-xs font-semibold text-slate-700">
                                    Select User
                                </span>


                                <select
                                    value={
                                        selectedUserId
                                    }
                                    onChange={
                                        handleUserChange
                                    }
                                    className={inputClass}
                                >
                                    <option value="">
                                        Select Trainer or Trainee
                                    </option>


                                    {filteredUsers.map(
                                        (user) => (
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
                                                )}
                                                {" — "}
                                                {user.role}
                                            </option>
                                        )
                                    )}

                                </select>
                            </label>

                        </div>


                        {/* ================================================= */}
                        {/* SELECTED USER */}
                        {/* ================================================= */}

                        {selectedUser && (
                            <>
                                <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            {getUserDisplayName(
                                                selectedUser,
                                                "Selected user"
                                            )}
                                        </p>


                                        <p className="mt-1 text-xs text-slate-500">
                                            {selectedUser.username ||
                                                selectedUser.email}
                                        </p>
                                    </div>


                                    <div className="flex gap-2">

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

                                </div>


                                {/* ================================================= */}
                                {/* SECTIONS */}
                                {/* ================================================= */}

                                <div>

                                    <h3 className="text-sm font-bold text-slate-900">
                                        Training Areas
                                    </h3>


                                    <p className="mt-1 text-xs text-slate-500">
                                        {selectedUser.role ===
                                            "trainee"
                                            ? "Both areas are automatically required for Trainees."
                                            : "Select one or both areas for this Trainer."}
                                    </p>


                                    <div className="mt-4 grid gap-3 md:grid-cols-2">

                                        {TRAINING_SECTIONS.map(
                                            (section) => {
                                                const selected =
                                                    selectedSections.includes(
                                                        section.id
                                                    );


                                                return (
                                                    <button
                                                        key={
                                                            section.id
                                                        }
                                                        type="button"
                                                        disabled={
                                                            selectedUser.role ===
                                                            "trainee"
                                                        }
                                                        onClick={() =>
                                                            toggleTrainingSection(
                                                                section.id
                                                            )
                                                        }
                                                        className={`
                                                            rounded-xl
                                                            border
                                                            p-4
                                                            text-left
                                                            transition
                                                            ${selected
                                                                ? "border-blue-400 bg-blue-50"
                                                                : "border-slate-200 bg-white hover:border-blue-300"
                                                            }
                                                            ${selectedUser.role ===
                                                                "trainee"
                                                                ? "cursor-not-allowed"
                                                                : ""
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-start gap-3">

                                                            <span
                                                                className={`
                                                                    flex
                                                                    h-5
                                                                    w-5
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded
                                                                    border
                                                                    text-[10px]
                                                                    font-bold
                                                                    ${selected
                                                                        ? "border-blue-600 bg-blue-600 text-white"
                                                                        : "border-slate-300"
                                                                    }
                                                                `}
                                                            >
                                                                {selected
                                                                    ? "✓"
                                                                    : ""}
                                                            </span>


                                                            <div>
                                                                <p className="text-xs font-bold text-slate-800">
                                                                    {section.name}
                                                                </p>


                                                                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                                                    {section.description}
                                                                </p>
                                                            </div>

                                                        </div>
                                                    </button>
                                                );
                                            }
                                        )}

                                    </div>

                                </div>


                                <div className="flex justify-end">

                                    <ActionButton
                                        variant="primary"
                                        disabled={
                                            saving ||
                                            selectedUser.status !==
                                            "active"
                                        }
                                        onClick={
                                            handleSave
                                        }
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save Training Access"}
                                    </ActionButton>

                                </div>
                            </>
                        )}
                    </>
                )}

            </div>

        </section>
    );
}


const inputClass = `
    mt-2
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    py-2.5
    text-sm
    text-slate-800
    outline-none
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
`;


export default TrainerAssignmentsPanel;