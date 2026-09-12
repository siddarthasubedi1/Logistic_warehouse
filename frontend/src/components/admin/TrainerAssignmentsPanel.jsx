import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../../services/api";

import FeedbackAlert from "../ui/FeedbackAlert";
import LoadingCard from "../ui/LoadingCard";

import {
    getApiErrorMessage,
    getUserDisplayName,
    parseArrayResponse,
} from "../../utils/training";


// ======================================================
// TRAINING AREAS
// ======================================================

const TRAINING_SECTIONS = [
    {
        id:
            "manual-handling",

        name:
            "Manual Handling",

        description:
            "Manual lifting, carrying and handling procedures.",
    },

    {
        id:
            "working-at-height",

        name:
            "Working at Height",

        description:
            "Training for safe work at elevated locations.",
    },
];


// ======================================================
// PANEL
// ======================================================

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
                setLoading(
                    true
                );


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
                setLoading(
                    false
                );
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
                (
                    user
                ) =>
                    user.role ===
                    roleFilter
            );

        }, [
            users,
            roleFilter,
        ]);


    // ======================================================
    // CURRENT USER
    // ======================================================

    const selectedUser =
        useMemo(() => {
            return (
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
                null
            );

        }, [
            users,
            selectedUserId,
        ]);


    // ======================================================
    // ROLE FILTER CHANGE
    // ======================================================

    const handleRoleFilterChange = (
        event
    ) => {
        setRoleFilter(
            event.target.value
        );


        setSelectedUserId(
            ""
        );


        setSelectedSections(
            []
        );


        setErrorMessage(
            ""
        );


        setSuccessMessage(
            ""
        );
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


        setErrorMessage(
            ""
        );


        setSuccessMessage(
            ""
        );


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


        if (!user) {
            setSelectedSections(
                []
            );

            return;
        }


        // Trainees receive both areas.
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
                : []
        );
    };


    // ======================================================
    // TOGGLE TRAINER AREA
    // ======================================================

    const toggleTrainingSection = (
        sectionId
    ) => {
        if (
            selectedUser
                ?.role !==
            "trainer"
        ) {
            return;
        }


        setErrorMessage(
            ""
        );


        setSuccessMessage(
            ""
        );


        setSelectedSections(
            (
                current
            ) => {
                if (
                    current.includes(
                        sectionId
                    )
                ) {
                    return current.filter(
                        (
                            item
                        ) =>
                            item !==
                            sectionId
                    );
                }


                return [
                    ...current,
                    sectionId,
                ];
            }
        );
    };


    // ======================================================
    // SAVE
    // ======================================================

    const handleSave =
        async () => {
            if (
                !selectedUser
                    ?._id
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
                    "Please select at least one training section."
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


            try {
                setSaving(
                    true
                );


                setErrorMessage(
                    ""
                );


                setSuccessMessage(
                    ""
                );


                const response =
                    await api.patch(
                        `/admin/users/${selectedUser._id}/training-sections`,

                        {
                            trainingSections,
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
                    if (
                        refreshedUser.role ===
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

                    } else {
                        setSelectedSections(
                            Array.isArray(
                                refreshedUser.assignedTrainingSections
                            )
                                ? refreshedUser
                                    .assignedTrainingSections
                                : []
                        );
                    }
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
                setSaving(
                    false
                );
            }
        };


    // ======================================================
    // LOADING
    // ======================================================

    if (
        loading
    ) {
        return (
            <LoadingCard
                message="Loading training access..."
            />
        );
    }


    // ======================================================
    // PAGE
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
                    border-slate-100
                    px-5
                    py-4
                "
            >
                <h2
                    className="
                        text-[12px]
                        font-semibold
                        text-slate-800
                    "
                >
                    Training Access
                </h2>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-400
                    "
                >
                    View or update training areas for Trainer and
                    Trainee accounts.
                </p>
            </div>


            {/* ================================================= */}
            {/* BODY */}
            {/* ================================================= */}

            <div
                className="
                    space-y-4
                    p-5
                "
            >
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


                {/* ================================================= */}
                {/* SELECT USER */}
                {/* ================================================= */}

                <div
                    className="
                        grid
                        gap-3
                        md:grid-cols-2
                    "
                >
                    <label
                        className="
                            block
                        "
                    >
                        <span
                            className="
                                text-[8px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Filter Role
                        </span>


                        <select
                            value={
                                roleFilter
                            }
                            onChange={
                                handleRoleFilterChange
                            }
                            className={
                                inputClass
                            }
                        >
                            <option value="all">
                                All Trainer & Trainee
                            </option>

                            <option value="trainer">
                                Trainer
                            </option>

                            <option value="trainee">
                                Trainee
                            </option>
                        </select>
                    </label>


                    <label
                        className="
                            block
                        "
                    >
                        <span
                            className="
                                text-[8px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Select User
                        </span>


                        <select
                            value={
                                selectedUserId
                            }
                            onChange={
                                handleUserChange
                            }
                            className={
                                inputClass
                            }
                        >
                            <option value="">
                                Select user
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
                                            user.username ||
                                            "User"
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
                    <div
                        className="
                            mt-4
                            rounded-lg
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-blue-50
                                        text-[10px]
                                        font-semibold
                                        text-blue-600
                                    "
                                >
                                    {getUserDisplayName(
                                        selectedUser,
                                        "U"
                                    )
                                        .charAt(
                                            0
                                        )
                                        .toUpperCase()}
                                </div>


                                <div>
                                    <p
                                        className="
                                            text-[10px]
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        {getUserDisplayName(
                                            selectedUser,
                                            selectedUser.username
                                        )}
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-[8px]
                                            capitalize
                                            text-slate-400
                                        "
                                    >
                                        {selectedUser.role}
                                        {" · "}
                                        {selectedUser.status}
                                    </p>
                                </div>
                            </div>
                        </div>


                        {/* ================================================= */}
                        {/* TRAINING */}
                        {/* ================================================= */}

                        <div
                            className="
                                mt-4
                                border-t
                                border-slate-200
                                pt-4
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Training Areas
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    text-slate-400
                                "
                            >
                                {selectedUser.role ===
                                    "trainee"
                                    ? "Trainees receive both training areas automatically."
                                    : "Select the training areas available to this Trainer."}
                            </p>


                            <div
                                className="
                                    mt-3
                                    grid
                                    gap-3
                                    sm:grid-cols-2
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
                                                    items-start
                                                    gap-3
                                                    rounded-lg
                                                    border
                                                    p-4

                                                    ${selected
                                                        ? "border-blue-300 bg-blue-50"
                                                        : "border-slate-200 bg-white"
                                                    }

                                                    ${selectedUser.role ===
                                                        "trainee"
                                                        ? "cursor-default"
                                                        : "cursor-pointer"
                                                    }
                                                `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selected
                                                    }
                                                    disabled={
                                                        selectedUser.role ===
                                                        "trainee" ||
                                                        saving
                                                    }
                                                    onChange={() =>
                                                        toggleTrainingSection(
                                                            section.id
                                                        )
                                                    }
                                                />


                                                <div>
                                                    <p
                                                        className="
                                                            text-[9px]
                                                            font-medium
                                                            text-slate-700
                                                        "
                                                    >
                                                        {section.name}
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[7px]
                                                            leading-4
                                                            text-slate-400
                                                        "
                                                    >
                                                        {section.description}
                                                    </p>
                                                </div>
                                            </label>
                                        );
                                    }
                                )}
                            </div>


                            {/* SAVE */}

                            <div
                                className="
                                    mt-4
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
                                        saving ||
                                        selectedUser.status !==
                                        "active"
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        bg-blue-600
                                        px-5
                                        py-2.5
                                        text-[9px]
                                        font-medium
                                        text-white
                                        hover:bg-blue-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                        sm:w-auto
                                    "
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Training Access"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}


const inputClass = `
    mt-2
    h-10
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[9px]
    text-slate-700
    outline-none
    focus:border-blue-500
`;


export default TrainerAssignmentsPanel;