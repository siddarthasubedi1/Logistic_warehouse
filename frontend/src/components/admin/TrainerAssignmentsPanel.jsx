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


// ======================================================
// APPROVED SPRINT 1 BROAD TRAINING AREAS
// ======================================================

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


// ======================================================
// TRAINER ASSIGNMENTS PANEL
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
                        "Unable to load Trainers and Trainees."
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
    // FILTER USERS
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
    // SELECTED USER
    // ======================================================

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


    // ======================================================
    // ROLE FILTER
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


        // ==================================================
        // TRAINEE ALWAYS GETS BOTH
        // ==================================================

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


        // ==================================================
        // TRAINER USES CURRENT ASSIGNMENTS
        // ==================================================

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
    // TRAINER SECTION TOGGLE
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


        setErrorMessage(
            ""
        );

        setSuccessMessage(
            ""
        );


        setSelectedSections(
            (
                current
            ) =>
                current.includes(
                    sectionId
                )
                    ? current.filter(
                        (
                            item
                        ) =>
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
                                refreshedUser
                                    .assignedTrainingSections
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
                        -right-16
                        -top-16
                        h-40
                        w-40
                        rounded-full
                        bg-blue-50
                    "
                />


                <div
                    className="
                        relative
                        z-10
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

                            <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                            <path d="M16 5h5v5" />

                            <path d="m21 5-6 6" />
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
                            Sprint 1 Training Access
                        </p>


                        <h2
                            className="
                                mt-1
                                text-base
                                font-bold
                                text-slate-900
                            "
                        >
                            Roles & Training Assignments
                        </h2>


                        <p
                            className="
                                mt-1
                                max-w-2xl
                                text-[10px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Control the broad training areas available
                            to Trainer and Trainee accounts.
                        </p>
                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div
                className="
                    space-y-5
                    p-4
                    sm:p-5
                    lg:p-6
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
                {/* RULE */}
                {/* ================================================= */}

                <div
                    className="
                        grid
                        gap-3
                        md:grid-cols-2
                    "
                >

                    <RuleCard
                        title="Trainer"
                        text="A Trainer can be assigned Manual Handling, Working at Height, or both broad training areas."
                        type="trainer"
                    />


                    <RuleCard
                        title="Trainee"
                        text="A Trainee automatically receives both broad training areas. The Administrator does not manually remove either area."
                        type="trainee"
                    />

                </div>


                {/* ================================================= */}
                {/* SELECT USER */}
                {/* ================================================= */}

                <div
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50/50
                        p-4
                        sm:p-5
                    "
                >

                    <h3
                        className="
                            text-xs
                            font-bold
                            text-slate-900
                        "
                    >
                        Select Account
                    </h3>


                    <p
                        className="
                            mt-1
                            text-[9px]
                            leading-5
                            text-slate-500
                        "
                    >
                        First filter by role, then choose the Trainer or
                        Trainee whose training access you want to view.
                    </p>


                    <div
                        className="
                            mt-4
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >

                        <label className="block">

                            <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Role Filter
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


                        <label className="block">

                            <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                User
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

                </div>


                {/* ================================================= */}
                {/* SELECTED USER */}
                {/* ================================================= */}

                {selectedUser && (
                    <div
                        className="
                            rounded-xl
                            border
                            border-blue-100
                            bg-white
                            p-4
                            shadow-sm
                            sm:p-5
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
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
                                        rounded-full
                                        bg-[#073763]
                                        text-sm
                                        font-bold
                                        text-white
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


                                <div className="min-w-0">

                                    <h3
                                        className="
                                            truncate
                                            text-xs
                                            font-bold
                                            text-slate-900
                                        "
                                    >
                                        {getUserDisplayName(
                                            selectedUser,
                                            selectedUser.username
                                        )}
                                    </h3>


                                    <p
                                        className="
                                            mt-1
                                            truncate
                                            text-[9px]
                                            text-slate-500
                                        "
                                    >
                                        {selectedUser.email ||
                                            selectedUser.username ||
                                            "—"}
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >
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
                        {/* TRAINING AREAS */}
                        {/* ================================================= */}

                        <div
                            className="
                                mt-5
                                border-t
                                border-slate-100
                                pt-5
                            "
                        >

                            <h3
                                className="
                                    text-xs
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Training Areas
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                {selectedUser.role ===
                                    "trainee"
                                    ? "Both areas are automatically required for Trainees."
                                    : "Select one or both broad training areas for this Trainer."}
                            </p>


                            <div
                                className="
                                    mt-4
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
                                                        ? "border-blue-400 bg-blue-50 ring-1 ring-blue-100"
                                                        : "border-slate-200 bg-white hover:border-blue-300"
                                                    }

                                                    ${selectedUser.role ===
                                                        "trainee"
                                                        ? "cursor-default"
                                                        : ""
                                                    }
                                                `}
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        gap-3
                                                    "
                                                >

                                                    <span
                                                        className={`
                                                            flex
                                                            h-6
                                                            w-6
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            border
                                                            text-[10px]
                                                            font-bold

                                                            ${selected
                                                                ? "border-blue-600 bg-blue-600 text-white"
                                                                : "border-slate-300 bg-white text-transparent"
                                                            }
                                                        `}
                                                    >
                                                        ✓
                                                    </span>


                                                    <div>

                                                        <p
                                                            className="
                                                                text-[10px]
                                                                font-bold
                                                                text-slate-800
                                                            "
                                                        >
                                                            {section.name}
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1
                                                                text-[9px]
                                                                leading-5
                                                                text-slate-500
                                                            "
                                                        >
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


                        <div
                            className="
                                mt-5
                                flex
                                justify-end
                                border-t
                                border-slate-100
                                pt-5
                            "
                        >

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
                                className="
                                    w-full
                                    justify-center
                                    sm:w-auto
                                "
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Training Access"}
                            </ActionButton>

                        </div>

                    </div>
                )}

            </div>

        </section>
    );
}


// ======================================================
// RULE CARD
// ======================================================

function RuleCard({
    title,
    text,
    type,
}) {
    const trainer =
        type ===
        "trainer";


    return (
        <div
            className={`
                rounded-xl
                border
                p-4

                ${trainer
                    ? "border-blue-100 bg-blue-50/60"
                    : "border-emerald-100 bg-emerald-50/60"
                }
            `}
        >

            <div
                className="
                    flex
                    items-start
                    gap-3
                "
            >

                <div
                    className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg

                        ${trainer
                            ? "bg-blue-100 text-blue-600"
                            : "bg-emerald-100 text-emerald-600"
                        }
                    `}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                    >
                        <circle
                            cx="12"
                            cy="8"
                            r="3"
                        />

                        <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                    </svg>
                </div>


                <div>
                    <h3
                        className="
                            text-[10px]
                            font-bold
                            text-slate-800
                        "
                    >
                        {title}
                    </h3>


                    <p
                        className="
                            mt-1
                            text-[9px]
                            leading-5
                            text-slate-500
                        "
                    >
                        {text}
                    </p>
                </div>

            </div>

        </div>
    );
}


// ======================================================
// INPUT CLASS
// ======================================================

const inputClass = `
    mt-2
    h-11
    w-full
    rounded-xl
    border
    border-slate-300
    bg-white
    px-3
    text-[10px]
    text-slate-800
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
`;


export default TrainerAssignmentsPanel;