import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../../services/api";


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
            "Safety procedures and hazards related to elevated work.",
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
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");


    /* =========================================================
       LOAD USERS
    ========================================================= */

    const loadUsers =
        useCallback(
            async () => {
                try {
                    setLoading(
                        true
                    );

                    setError(
                        ""
                    );


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


                    const manageable =
                        data.filter(
                            (
                                user
                            ) =>
                                user.role ===
                                "trainer" ||
                                user.role ===
                                "trainee"
                        );


                    setUsers(
                        manageable
                    );

                    return manageable;

                } catch (
                error
                ) {
                    console.error(
                        "Training assignment users error:",
                        error
                    );

                    setError(
                        error.response?.data?.message ||
                        "Unable to load users."
                    );

                    return [];

                } finally {
                    setLoading(
                        false
                    );
                }
            },
            []
        );


    useEffect(() => {
        loadUsers();
    }, [
        loadUsers,
    ]);


    /* =========================================================
       FILTER
    ========================================================= */

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


    /* =========================================================
       SELECTED USER
    ========================================================= */

    const selectedUser =
        useMemo(
            () =>
                users.find(
                    (
                        user
                    ) =>
                        String(
                            user._id ||
                            user.id
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


    /* =========================================================
       USER SELECTION
    ========================================================= */

    const selectUser = (
        event
    ) => {
        const userId =
            event.target.value;


        setSelectedUserId(
            userId
        );


        setError(
            ""
        );


        setSuccess(
            ""
        );


        const user =
            users.find(
                (
                    item
                ) =>
                    String(
                        item._id ||
                        item.id
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


        /* =====================================================
           TRAINEE
    
           Trainee always receives both modules.
        ===================================================== */

        if (
            user.role ===
            "trainee"
        ) {
            setSelectedSections(
                TRAINING_SECTIONS.map(
                    (
                        item
                    ) =>
                        item.id
                )
            );

            return;
        }


        /* =====================================================
           TRAINER
    
           Keep ALL currently assigned modules.
    
           Do NOT use:
           .slice(0, 1)
        ===================================================== */

        setSelectedSections(
            Array.isArray(
                user.assignedTrainingSections
            )
                ? [
                    ...user
                        .assignedTrainingSections,
                ]
                : []
        );
    };


    /* =========================================================
       SELECT TRAINER MODULE
    ========================================================= */

    const selectTraining =
        (
            sectionId
        ) => {
            if (
                !selectedUser ||
                selectedUser.role !==
                "trainer"
            ) {
                return;
            }

            setSelectedSections(
                (
                    current
                ) => {
                    const alreadySelected =
                        current.includes(
                            sectionId
                        );

                    if (
                        alreadySelected
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

            setError(
                ""
            );

            setSuccess(
                ""
            );
        };


    /* =========================================================
       SAVE
    ========================================================= */

    const saveAssignment =
        async () => {
            if (
                !selectedUser
            ) {
                setError(
                    "Please select a user first."
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
                trainingSections.length <
                1
            ) {
                setError(
                    "Trainer must have at least one training module."
                );

                return;
            }


            try {
                setSaving(
                    true
                );

                setError(
                    ""
                );

                setSuccess(
                    ""
                );


                const userId =
                    selectedUser._id ||
                    selectedUser.id;


                const response =
                    await api.patch(
                        `/admin/users/${userId}/training-sections`,
                        {
                            trainingSections,
                        }
                    );


                setSuccess(
                    response.data?.message ||
                    "Training assignment updated successfully."
                );


                const refreshedUsers =
                    await loadUsers();


                const refreshedUser =
                    refreshedUsers.find(
                        (
                            user
                        ) =>
                            String(
                                user._id ||
                                user.id
                            ) ===
                            String(
                                userId
                            )
                    );


                if (
                    refreshedUser?.role ===
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
                            refreshedUser?.assignedTrainingSections
                        )
                            ? [
                                ...refreshedUser
                                    .assignedTrainingSections,
                            ]
                            : []
                    );
                }

            } catch (
            error
            ) {
                console.error(
                    "Save training assignment error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to save training assignment."
                );

            } finally {
                setSaving(
                    false
                );
            }
        };


    /* =========================================================
       NAME
    ========================================================= */

    const getName = (
        user
    ) =>
        `${user?.firstName || ""} ${user?.lastName || ""}`
            .trim() ||
        user?.username ||
        "User";


    return (
        <section
            className="
                overflow-hidden
                rounded-xl
                border
                border-[#dbe4ef]
                bg-white
                shadow-[0_1px_3px_rgba(15,23,42,0.06)]
            "
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-[#e8eef5]
                    px-5
                    py-4
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
                            h-10
                            w-10
                            shrink-0
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
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="
                                h-5
                                w-5
                            "
                        >
                            <rect
                                x="4"
                                y="4"
                                width="6"
                                height="16"
                                rx="1"
                            />

                            <rect
                                x="14"
                                y="4"
                                width="6"
                                height="16"
                                rx="1"
                            />
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
                            Training Assignments
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-[#64748b]
                            "
                        >
                            Manage Trainer and Trainee module access.
                        </p>
                    </div>
                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >
                    <span
                        className="
                            rounded-full
                            bg-blue-50
                            px-3
                            py-1.5
                            text-[8px]
                            font-semibold
                            text-blue-600
                        "
                    >
                        Trainer → 1 or both modules
                    </span>

                    <span
                        className="
                            rounded-full
                            bg-emerald-50
                            px-3
                            py-1.5
                            text-[8px]
                            font-semibold
                            text-emerald-600
                        "
                    >
                        Trainee → Both
                    </span>
                </div>
            </div>


            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (
                <div
                    className="
                        border-b
                        border-red-100
                        bg-red-50
                        px-5
                        py-3
                        text-[9px]
                        text-red-700
                    "
                >
                    {error}
                </div>
            )}


            {success && (
                <div
                    className="
                        border-b
                        border-emerald-100
                        bg-emerald-50
                        px-5
                        py-3
                        text-[9px]
                        text-emerald-700
                    "
                >
                    {success}
                </div>
            )}


            {/* =================================================
                BODY
            ================================================= */}

            <div
                className="
                    p-5
                "
            >
                {loading ? (
                    <div
                        className="
                            flex
                            min-h-[160px]
                            items-center
                            justify-center
                        "
                    >
                        <div
                            className="
                                text-center
                            "
                        >
                            <div
                                className="
                                    mx-auto
                                    h-7
                                    w-7
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-blue-100
                                    border-t-blue-600
                                "
                            />

                            <p
                                className="
                                    mt-3
                                    text-[9px]
                                    text-[#64748b]
                                "
                            >
                                Loading users...
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* SELECT USER */}

                        <div
                            className="
                                grid
                                gap-4
                                md:grid-cols-[220px_minmax(0,1fr)]
                            "
                        >
                            <label>
                                <span
                                    className="
                                        mb-2
                                        block
                                        text-[9px]
                                        font-semibold
                                        text-[#334155]
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

                                        setSelectedUserId(
                                            ""
                                        );

                                        setSelectedSections(
                                            []
                                        );
                                    }}
                                    className="
                                        min-h-[42px]
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#cbd5e1]
                                        bg-white
                                        px-3
                                        text-[10px]
                                        text-[#172033]
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
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
                                        text-[9px]
                                        font-semibold
                                        text-[#334155]
                                    "
                                >
                                    Select User
                                </span>

                                <select
                                    value={
                                        selectedUserId
                                    }
                                    onChange={
                                        selectUser
                                    }
                                    className="
                                        min-h-[42px]
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#cbd5e1]
                                        bg-white
                                        px-3
                                        text-[10px]
                                        text-[#172033]
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
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
                                                    user._id ||
                                                    user.id
                                                }
                                                value={
                                                    user._id ||
                                                    user.id
                                                }
                                            >
                                                {getName(
                                                    user
                                                )}
                                                {" — "}
                                                {user.role}
                                            </option>
                                        )
                                    )}
                                </select>
                            </label>
                        </div>


                        {/* SELECTED USER */}

                        {selectedUser && (
                            <div
                                className="
                                    mt-5
                                    rounded-xl
                                    border
                                    border-[#dbe4ef]
                                    bg-[#f8fafc]
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
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-[#073763]
                                                text-[11px]
                                                font-bold
                                                text-white
                                            "
                                        >
                                            {getName(
                                                selectedUser
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
                                                    text-[#172033]
                                                "
                                            >
                                                {getName(
                                                    selectedUser
                                                )}
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-[8px]
                                                    text-[#64748b]
                                                "
                                            >
                                                {selectedUser.username ||
                                                    "No username"}
                                            </p>
                                        </div>
                                    </div>


                                    <span
                                        className="
                                            self-start
                                            rounded-full
                                            bg-blue-50
                                            px-3
                                            py-1.5
                                            text-[8px]
                                            font-semibold
                                            capitalize
                                            text-blue-600
                                            sm:self-auto
                                        "
                                    >
                                        {selectedUser.role}
                                    </span>
                                </div>


                                <div
                                    className="
                                        mt-5
                                        grid
                                        gap-3
                                        md:grid-cols-2
                                    "
                                >
                                    {TRAINING_SECTIONS.map(
                                        (
                                            section
                                        ) => {
                                            const trainee =
                                                selectedUser.role ===
                                                "trainee";


                                            const selected =
                                                trainee ||
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
                                                        trainee
                                                    }
                                                    onClick={() =>
                                                        selectTraining(
                                                            section.id
                                                        )
                                                    }
                                                    className={`
                                                        w-full
                                                        rounded-xl
                                                        border
                                                        p-4
                                                        text-left
                                                        transition

                                                        ${selected
                                                            ? "border-blue-500 bg-white ring-1 ring-blue-100"
                                                            : "border-[#dbe4ef] bg-white hover:border-blue-200"
                                                        }

                                                        ${trainee
                                                            ? "cursor-default"
                                                            : ""
                                                        }
                                                    `}
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
                                                            <p
                                                                className="
                                                                    text-[10px]
                                                                    font-semibold
                                                                    text-[#172033]
                                                                "
                                                            >
                                                                {section.name}
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-[8px]
                                                                    leading-4
                                                                    text-[#64748b]
                                                                "
                                                            >
                                                                {section.description}
                                                            </p>
                                                        </div>


                                                        <span
                                                            className={`
                                                                flex
                                                                h-5
                                                                w-5
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                border
                                                                text-[9px]

                                                                ${selected
                                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                                    : "border-[#cbd5e1] bg-white"
                                                                }
                                                            `}
                                                        >
                                                            {selected
                                                                ? "✓"
                                                                : ""}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>


                                {selectedUser.role ===
                                    "trainee" && (
                                        <div
                                            className="
                                            mt-4
                                            rounded-lg
                                            border
                                            border-emerald-200
                                            bg-emerald-50
                                            px-4
                                            py-3
                                            text-[9px]
                                            text-emerald-700
                                        "
                                        >
                                            Trainees automatically receive both
                                            Manual Handling and Working at Height.
                                        </div>
                                    )}


                                <div
                                    className="
                                        mt-5
                                        flex
                                        justify-end
                                    "
                                >
                                    <button
                                        type="button"
                                        onClick={
                                            saveAssignment
                                        }
                                        disabled={
                                            saving
                                        }
                                        className="
                                            min-h-[40px]
                                            rounded-lg
                                            bg-[#1769e8]
                                            px-5
                                            text-[9px]
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-[#0b5ed7]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save Assignment"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}


export default TrainerAssignmentsPanel;