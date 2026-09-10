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

        shortDescription:
            "Lifting, carrying and handling loads safely.",

        type:
            "manual",
    },

    {
        id:
            "working-at-height",

        name:
            "Working at Height",

        description:
            "Safety procedures for working at elevated locations.",

        shortDescription:
            "Safe ladder, platform and elevated working practices.",

        type:
            "height",
    },
];


function TrainerAssignmentsPanel() {

    // ======================================================
    // USERS
    // ======================================================

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


    // ======================================================
    // PAGE STATE
    // ======================================================

    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        saving,
        setSaving,
    ] = useState(false);


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
                setLoading(
                    false
                );
            }
        }, []);


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        loadUsers();
    }, [
        loadUsers,
    ]);


    // ======================================================
    // FILTERED USERS
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
    // COUNTS
    // ======================================================

    const trainerCount =
        useMemo(
            () =>
                users.filter(
                    (user) =>
                        user.role ===
                        "trainer"
                ).length,
            [
                users,
            ]
        );


    const traineeCount =
        useMemo(
            () =>
                users.filter(
                    (user) =>
                        user.role ===
                        "trainee"
                ).length,
            [
                users,
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


        // ==================================================
        // TRAINEE
        //
        // Approved Sprint 1 rule:
        // Trainee receives BOTH training areas.
        // ==================================================

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


        // ==================================================
        // TRAINER
        // ==================================================

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

        // ==================================================
        // TRAINEE CANNOT MANUALLY CHANGE
        // ==================================================

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
    // SAVE TRAINING ACCESS
    // ======================================================

    const handleSave =
        async () => {

            // ==================================================
            // USER REQUIRED
            // ==================================================

            if (
                !selectedUser?._id
            ) {
                setErrorMessage(
                    "Please select a user."
                );

                return;
            }


            // ==================================================
            // TRAINER NEEDS AT LEAST ONE
            // ==================================================

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


            // ==================================================
            // TRAINEE ALWAYS BOTH
            // ==================================================

            const sections =
                selectedUser.role ===
                    "trainee"
                    ? TRAINING_SECTIONS.map(
                        (section) =>
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


                // ==================================================
                // APPROVED SPRINT 1 API
                // ==================================================

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


                // ==================================================
                // REFRESH USERS
                // ==================================================

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
                setSaving(
                    false
                );
            }
        };


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
                    border-slate-200
                    bg-gradient-to-r
                    from-[#073763]
                    via-[#0b4f87]
                    to-[#1769aa]
                    px-5
                    py-5
                    sm:px-6
                "
            >

                {/* BACKGROUND DECORATION */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-12
                        -top-14
                        h-36
                        w-36
                        rounded-full
                        bg-white/10
                    "
                />


                <div
                    className="
                        pointer-events-none
                        absolute
                        right-20
                        top-5
                        hidden
                        h-20
                        w-20
                        rotate-12
                        rounded-xl
                        border
                        border-white/10
                        lg:block
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    {/* HEADER TEXT */}

                    <div
                        className="
                            flex
                            items-start
                            gap-4
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
                                border
                                border-white/15
                                bg-white/10
                                text-white
                            "
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-6 w-6"
                            >
                                <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                <path d="M8 12h8" />

                                <path d="M12 8v8" />
                            </svg>

                        </div>


                        <div>

                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]
                                    text-blue-100
                                "
                            >
                                Safety Access Control
                            </p>


                            <h2
                                className="
                                    mt-1
                                    text-base
                                    font-bold
                                    text-white
                                    sm:text-lg
                                "
                            >
                                Training Area Access
                            </h2>


                            <p
                                className="
                                    mt-1
                                    max-w-2xl
                                    text-[11px]
                                    leading-5
                                    text-blue-100
                                "
                            >
                                Manage broad workplace safety training access for Trainers and Trainees.
                            </p>

                        </div>

                    </div>


                    {/* COUNTS */}

                    <div
                        className="
                            flex
                            flex-wrap
                            gap-2
                        "
                    >

                        <span
                            className="
                                rounded-full
                                border
                                border-white/15
                                bg-white/10
                                px-3
                                py-1.5
                                text-[9px]
                                font-semibold
                                text-white
                            "
                        >
                            {trainerCount} Trainer
                            {trainerCount ===
                                1
                                ? ""
                                : "s"}
                        </span>


                        <span
                            className="
                                rounded-full
                                border
                                border-white/15
                                bg-white/10
                                px-3
                                py-1.5
                                text-[9px]
                                font-semibold
                                text-white
                            "
                        >
                            {traineeCount} Trainee
                            {traineeCount ===
                                1
                                ? ""
                                : "s"}
                        </span>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* BODY */}
            {/* ================================================= */}

            <div
                className="
                    space-y-5
                    p-4
                    sm:p-5
                    lg:p-6
                "
            >

                {/* ================================================= */}
                {/* FEEDBACK */}
                {/* ================================================= */}

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
                {/* LOADING */}
                {/* ================================================= */}

                {loading ? (
                    <LoadingCard
                        message="Loading users..."
                    />
                ) : (
                    <>

                        {/* ================================================= */}
                        {/* EXPLANATION */}
                        {/* ================================================= */}

                        <div
                            className="
                                grid
                                gap-3
                                sm:grid-cols-2
                            "
                        >

                            {/* TRAINER RULE */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-blue-100
                                    bg-blue-50/60
                                    p-4
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
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-white
                                            text-blue-600
                                            shadow-sm
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

                                            <path d="M3 20c.5-4 2.5-6 6-6" />

                                            <path d="M16 7h5" />

                                            <path d="M18.5 4.5v5" />
                                        </svg>
                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-[11px]
                                                font-bold
                                                text-slate-800
                                            "
                                        >
                                            Trainer Rule
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                leading-5
                                                text-slate-500
                                            "
                                        >
                                            A Trainer can receive Manual Handling, Working at Height, or both.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* TRAINEE RULE */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-emerald-100
                                    bg-emerald-50/60
                                    p-4
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
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-white
                                            text-emerald-600
                                            shadow-sm
                                        "
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-5 w-5"
                                        >
                                            <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                            <path d="m9 12 2 2 4-4" />
                                        </svg>
                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-[11px]
                                                font-bold
                                                text-slate-800
                                            "
                                        >
                                            Trainee Rule
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                leading-5
                                                text-slate-500
                                            "
                                        >
                                            Every Trainee automatically receives both workplace safety areas.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* USER SELECTION */}
                        {/* ================================================= */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50/70
                                p-4
                                sm:p-5
                            "
                        >

                            <div
                                className="
                                    mb-4
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-blue-100
                                        text-blue-700
                                    "
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-4 w-4"
                                    >
                                        <circle
                                            cx="10"
                                            cy="8"
                                            r="3"
                                        />

                                        <path d="M4 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                                        <path d="m17 10 2 2 3-4" />
                                    </svg>
                                </div>


                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        Select Account
                                    </p>


                                    <p
                                        className="
                                            mt-0.5
                                            text-[10px]
                                            text-slate-500
                                        "
                                    >
                                        Choose the user whose training access you want to manage.
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    grid
                                    gap-4
                                    lg:grid-cols-[220px_1fr]
                                "
                            >

                                {/* USER TYPE */}

                                <label className="block">

                                    <span
                                        className="
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        "
                                    >
                                        User Type
                                    </span>


                                    <div className="relative">

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
                                                All Users
                                            </option>

                                            <option value="trainer">
                                                Trainers
                                            </option>

                                            <option value="trainee">
                                                Trainees
                                            </option>
                                        </select>


                                        <SelectArrow />

                                    </div>

                                </label>


                                {/* SELECT USER */}

                                <label className="block">

                                    <span
                                        className="
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        "
                                    >
                                        Select User
                                    </span>


                                    <div className="relative">

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
                                                Select Trainer or Trainee
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
                                                        )}
                                                        {" — "}
                                                        {user.role}
                                                    </option>
                                                )
                                            )}

                                        </select>


                                        <SelectArrow />

                                    </div>

                                </label>

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* NO USER SELECTED */}
                        {/* ================================================= */}

                        {!selectedUser && (
                            <div
                                className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    bg-white
                                    px-5
                                    py-10
                                    text-center
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-slate-100
                                        text-slate-400
                                    "
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-6 w-6"
                                    >
                                        <circle
                                            cx="9"
                                            cy="8"
                                            r="3"
                                        />

                                        <path d="M3 20c.5-4 2.5-6 6-6" />

                                        <path d="M17 8h4" />

                                        <path d="M19 6v4" />
                                    </svg>
                                </div>


                                <p
                                    className="
                                        mt-4
                                        text-xs
                                        font-bold
                                        text-slate-700
                                    "
                                >
                                    Select a Trainer or Trainee
                                </p>


                                <p
                                    className="
                                        mt-1
                                        max-w-md
                                        text-[10px]
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    Training area controls will appear here after you select an account.
                                </p>

                            </div>
                        )}


                        {/* ================================================= */}
                        {/* SELECTED USER */}
                        {/* ================================================= */}

                        {selectedUser && (
                            <>

                                {/* ================================================= */}
                                {/* USER CARD */}
                                {/* ================================================= */}

                                <div
                                    className="
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            flex-col
                                            gap-4
                                            bg-gradient-to-r
                                            from-slate-50
                                            to-blue-50/50
                                            p-4
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                            sm:p-5
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

                                            {/* AVATAR */}

                                            <div
                                                className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-blue-100
                                                    text-sm
                                                    font-bold
                                                    text-blue-700
                                                    ring-1
                                                    ring-blue-200
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

                                                <p
                                                    className="
                                                        truncate
                                                        text-sm
                                                        font-bold
                                                        text-slate-900
                                                    "
                                                >
                                                    {getUserDisplayName(
                                                        selectedUser,
                                                        "Selected user"
                                                    )}
                                                </p>


                                                <p
                                                    className="
                                                        mt-1
                                                        truncate
                                                        text-[10px]
                                                        text-slate-500
                                                    "
                                                >
                                                    {selectedUser.username ||
                                                        selectedUser.email}
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

                                </div>


                                {/* ================================================= */}
                                {/* TRAINING AREAS */}
                                {/* ================================================= */}

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-4
                                        sm:p-5
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

                                            <p
                                                className="
                                                    text-xs
                                                    font-bold
                                                    text-slate-900
                                                "
                                            >
                                                Training Areas
                                            </p>


                                            <p
                                                className="
                                                    mt-1
                                                    text-[10px]
                                                    leading-5
                                                    text-slate-500
                                                "
                                            >
                                                {selectedUser.role ===
                                                    "trainee"
                                                    ? "Both areas are automatically required for Trainees."
                                                    : "Select Manual Handling, Working at Height, or both for this Trainer."}
                                            </p>

                                        </div>


                                        <span
                                            className="
                                                w-fit
                                                rounded-full
                                                bg-blue-50
                                                px-3
                                                py-1.5
                                                text-[9px]
                                                font-semibold
                                                text-blue-700
                                            "
                                        >
                                            {selectedSections.length} of{" "}
                                            {TRAINING_SECTIONS.length} selected
                                        </span>

                                    </div>


                                    {/* ================================================= */}
                                    {/* SECTION CARDS */}
                                    {/* ================================================= */}

                                    <div
                                        className="
                                            mt-5
                                            grid
                                            gap-4
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


                                                const traineeLocked =
                                                    selectedUser.role ===
                                                    "trainee";


                                                return (
                                                    <button
                                                        key={
                                                            section.id
                                                        }
                                                        type="button"
                                                        disabled={
                                                            traineeLocked
                                                        }
                                                        onClick={() =>
                                                            toggleTrainingSection(
                                                                section.id
                                                            )
                                                        }
                                                        className={`
                                                            group
                                                            relative
                                                            overflow-hidden
                                                            rounded-2xl
                                                            border
                                                            p-4
                                                            text-left
                                                            transition-all
                                                            duration-200
                                                            sm:p-5

                                                            ${selected
                                                                ? "border-blue-400 bg-gradient-to-br from-blue-50 to-white shadow-sm ring-1 ring-blue-100"
                                                                : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
                                                            }

                                                            ${traineeLocked
                                                                ? "cursor-not-allowed"
                                                                : "cursor-pointer"
                                                            }
                                                        `}
                                                    >

                                                        {/* TOP ACCENT */}

                                                        <div
                                                            className={`
                                                                absolute
                                                                left-0
                                                                top-0
                                                                h-1
                                                                w-full

                                                                ${section.type ===
                                                                    "manual"
                                                                    ? "bg-blue-500"
                                                                    : "bg-amber-500"
                                                                }
                                                            `}
                                                        />


                                                        <div
                                                            className="
                                                                flex
                                                                items-start
                                                                gap-4
                                                            "
                                                        >

                                                            {/* SECTION ICON */}

                                                            <TrainingIcon
                                                                type={
                                                                    section.type
                                                                }
                                                                selected={
                                                                    selected
                                                                }
                                                            />


                                                            <div
                                                                className="
                                                                    min-w-0
                                                                    flex-1
                                                                "
                                                            >

                                                                <div
                                                                    className="
                                                                        flex
                                                                        items-start
                                                                        justify-between
                                                                        gap-3
                                                                    "
                                                                >

                                                                    <div>

                                                                        <p
                                                                            className="
                                                                                text-xs
                                                                                font-bold
                                                                                text-slate-800
                                                                            "
                                                                        >
                                                                            {section.name}
                                                                        </p>


                                                                        <p
                                                                            className="
                                                                                mt-1
                                                                                text-[10px]
                                                                                leading-5
                                                                                text-slate-500
                                                                            "
                                                                        >
                                                                            {section.shortDescription}
                                                                        </p>

                                                                    </div>


                                                                    {/* CHECKBOX */}

                                                                    <span
                                                                        className={`
                                                                            flex
                                                                            h-6
                                                                            w-6
                                                                            shrink-0
                                                                            items-center
                                                                            justify-center
                                                                            rounded-md
                                                                            border
                                                                            text-[10px]
                                                                            font-bold
                                                                            transition

                                                                            ${selected
                                                                                ? "border-blue-600 bg-blue-600 text-white"
                                                                                : "border-slate-300 bg-white text-transparent"
                                                                            }
                                                                        `}
                                                                    >
                                                                        ✓
                                                                    </span>

                                                                </div>


                                                                <p
                                                                    className="
                                                                        mt-4
                                                                        text-[9px]
                                                                        leading-4
                                                                        text-slate-400
                                                                    "
                                                                >
                                                                    {section.description}
                                                                </p>


                                                                {traineeLocked && (
                                                                    <p
                                                                        className="
                                                                            mt-3
                                                                            text-[9px]
                                                                            font-semibold
                                                                            text-emerald-600
                                                                        "
                                                                    >
                                                                        Automatically assigned to Trainees
                                                                    </p>
                                                                )}

                                                            </div>

                                                        </div>

                                                    </button>
                                                );
                                            }
                                        )}

                                    </div>


                                    {/* ================================================= */}
                                    {/* SAVE AREA */}
                                    {/* ================================================= */}

                                    <div
                                        className="
                                            mt-5
                                            flex
                                            flex-col
                                            gap-3
                                            border-t
                                            border-slate-100
                                            pt-5
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                        "
                                    >

                                        <div>

                                            {selectedUser.status !==
                                                "active" && (
                                                    <p
                                                        className="
                                                        text-[10px]
                                                        font-semibold
                                                        text-amber-600
                                                    "
                                                    >
                                                        Reactivate this account before changing training access.
                                                    </p>
                                                )}


                                            {selectedUser.status ===
                                                "active" && (
                                                    <p
                                                        className="
                                                        text-[10px]
                                                        text-slate-500
                                                    "
                                                    >
                                                        Changes are saved to the user's approved Sprint 1 training access.
                                                    </p>
                                                )}

                                        </div>


                                        <ActionButton
                                            variant="primary"
                                            className="
                                                w-full
                                                justify-center
                                                sm:w-auto
                                            "
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

                                </div>

                            </>
                        )}

                    </>
                )}

            </div>

        </section>
    );
}


// ======================================================
// SELECT ARROW
// ======================================================

function SelectArrow() {
    return (
        <div
            className="
                pointer-events-none
                absolute
                inset-y-0
                right-0
                flex
                items-center
                pr-3
                pt-2
                text-slate-400
            "
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
            >
                <path d="m7 10 5 5 5-5" />
            </svg>
        </div>
    );
}


// ======================================================
// TRAINING ICON
// ======================================================

function TrainingIcon({
    type,
    selected,
}) {

    if (
        type ===
        "height"
    ) {
        return (
            <div
                className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    transition

                    ${selected
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-500"
                    }
                `}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                >
                    <path d="M5 21V7" />

                    <path d="M19 21V7" />

                    <path d="M5 10h14" />

                    <path d="M5 15h14" />

                    <path d="M5 20h14" />

                    <path d="M3 7h18" />
                </svg>
            </div>
        );
    }


    return (
        <div
            className={`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                transition

                ${selected
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-500"
                }
            `}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <rect
                    x="3"
                    y="8"
                    width="18"
                    height="10"
                    rx="2"
                />

                <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />

                <path d="M8 13h8" />

                <path d="M12 10v6" />
            </svg>
        </div>
    );
}


// ======================================================
// INPUT STYLE
// ======================================================

const inputClass = `
    mt-2
    h-11
    w-full
    appearance-none
    rounded-xl
    border
    border-slate-300
    bg-white
    px-3
    pr-10
    text-xs
    font-medium
    text-slate-800
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
`;


export default TrainerAssignmentsPanel;