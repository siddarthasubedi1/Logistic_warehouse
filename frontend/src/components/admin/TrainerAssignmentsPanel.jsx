import {
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../../services/api";


const TRAINING_SECTIONS = [
    {
        id: "manual-handling",
        name: "Manual Handling",

        description:
            "Safe lifting, carrying and manual handling procedures.",
    },

    {
        id: "working-at-height",
        name: "Working at Height",

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
        error,
        setError,
    ] = useState("");


    const [
        message,
        setMessage,
    ] = useState("");


    // ======================================================
    // LOAD TRAINERS + TRAINEES
    // ======================================================

    const loadUsers =
        async () => {
            try {
                setLoading(true);
                setError("");


                const response =
                    await api.get(
                        "/admin/users"
                    );


                const responseUsers =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : response.data
                            ?.users || [];


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
                    "Load users error:",
                    error
                );


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to load Trainers and Trainees."
                );


                return [];

            } finally {
                setLoading(false);
            }
        };


    useEffect(() => {
        loadUsers();
    }, []);


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
                (user) =>
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
        users.find(
            (user) =>
                String(user._id) ===
                String(
                    selectedUserId
                )
        );


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


        setError("");
        setMessage("");
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


        setMessage("");
        setError("");


        if (!userId) {
            setSelectedSections(
                []
            );

            return;
        }


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


        setSelectedSections(
            Array.isArray(
                user
                    .assignedTrainingSections
            )
                ? user
                    .assignedTrainingSections
                : []
        );
    };


    // ======================================================
    // TOGGLE SECTION
    // ======================================================

    const toggleTrainingSection = (
        sectionId
    ) => {
        setSelectedSections(
            (current) => {
                if (
                    current.includes(
                        sectionId
                    )
                ) {
                    return current.filter(
                        (item) =>
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


        setError("");
        setMessage("");
    };


    // ======================================================
    // SAVE ASSIGNMENT
    // ======================================================

    const saveAssignments =
        async () => {
            if (!selectedUserId) {
                setError(
                    "Please select a Trainer or Trainee."
                );

                return;
            }


            if (
                selectedSections.length ===
                0
            ) {
                setError(
                    "Please select at least one training section."
                );

                return;
            }


            try {
                setSaving(true);

                setError("");
                setMessage("");


                const response =
                    await api.patch(
                        `/admin/users/${selectedUserId}/training-sections`,
                        {
                            trainingSections:
                                selectedSections,
                        }
                    );


                setMessage(
                    response.data
                        ?.message ||
                    "Training assignment updated successfully."
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
                                selectedUserId
                            )
                    );


                if (refreshedUser) {
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
                    "Save training assignment error:",
                    error
                );


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to update training assignment."
                );

            } finally {
                setSaving(false);
            }
        };


    // ======================================================
    // SECTION NAME
    // ======================================================

    const getSectionName = (
        sectionId
    ) => {
        const section =
            TRAINING_SECTIONS.find(
                (item) =>
                    item.id ===
                    sectionId
            );


        return (
            section?.name ||
            sectionId
        );
    };


    // ======================================================
    // UI
    // ======================================================

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="border-b border-slate-200 px-6 py-5">

                <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <circle
                                cx="9"
                                cy="7"
                                r="3"
                            />

                            <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                            <path d="M18 5v8" />

                            <path d="M14 9h8" />
                        </svg>

                    </div>


                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Trainer & Trainee Training Assignments
                        </h2>


                        <p className="mt-1 text-sm text-slate-500">
                            Assign one or both training sections to a Trainer or Trainee.
                        </p>

                    </div>

                </div>

            </div>


            <div className="space-y-6 p-6">

                {/* ERROR */}

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}


                {/* SUCCESS */}

                {message && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        {message}
                    </div>
                )}


                {/* FILTER + SELECT USER */}

                <div className="grid gap-4 lg:grid-cols-[220px_1fr]">

                    {/* ROLE FILTER */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                            User Type
                        </label>


                        <select
                            value={
                                roleFilter
                            }
                            onChange={
                                handleRoleFilterChange
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

                    </div>


                    {/* SELECT USER */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                            Select Trainer or Trainee
                        </label>


                        <select
                            value={
                                selectedUserId
                            }
                            onChange={
                                handleUserChange
                            }
                            disabled={
                                loading
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        >

                            <option value="">

                                {loading
                                    ? "Loading users..."
                                    : "Select a user"}

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
                                        {user.firstName}{" "}
                                        {user.lastName}
                                        {" — "}
                                        {user.role ===
                                            "trainer"
                                            ? "Trainer"
                                            : "Trainee"}
                                        {user.username
                                            ? ` — ${user.username}`
                                            : ""}
                                    </option>
                                )
                            )}

                        </select>

                    </div>

                </div>


                {/* SELECTED USER */}

                {selectedUser && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Selected User
                                </p>


                                <p className="mt-2 text-base font-bold text-slate-900">
                                    {selectedUser.firstName}{" "}
                                    {selectedUser.lastName}
                                </p>


                                <p className="mt-1 text-sm text-slate-500">
                                    {selectedUser.username}
                                </p>

                            </div>


                            <div className="flex flex-wrap gap-2">

                                <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold capitalize text-blue-700">
                                    {selectedUser.role}
                                </span>


                                <span
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${selectedUser.status ===
                                        "active"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {selectedUser.status}
                                </span>

                            </div>

                        </div>

                    </div>
                )}


                {/* TRAINING SECTIONS */}

                {selectedUser && (
                    <div>

                        <div>

                            <h3 className="text-sm font-bold text-slate-900">
                                Assigned Training Sections
                            </h3>


                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Select one or both sections. The selected sections will appear on this user's dashboard.
                            </p>

                        </div>


                        <div className="mt-4 grid gap-4 md:grid-cols-2">

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
                                            onClick={() =>
                                                toggleTrainingSection(
                                                    section.id
                                                )
                                            }
                                            className={`rounded-xl border p-5 text-left transition ${selected
                                                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                                                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                                                }`}
                                        >

                                            <div className="flex items-start gap-3">

                                                {/* CHECKBOX */}

                                                <div
                                                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${selected
                                                        ? "border-blue-600 bg-blue-600 text-white"
                                                        : "border-slate-300 bg-white"
                                                        }`}
                                                >
                                                    {selected && (
                                                        <span className="text-xs font-bold">
                                                            ✓
                                                        </span>
                                                    )}
                                                </div>


                                                <div>

                                                    <p className="font-semibold text-slate-900">
                                                        {section.name}
                                                    </p>


                                                    <p className="mt-1 text-xs leading-5 text-slate-500">
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
                )}


                {/* SUMMARY */}

                {selectedUser && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                        <p className="text-sm font-semibold text-slate-900">
                            Current Selection
                        </p>


                        {selectedSections.length ===
                            0 ? (
                            <p className="mt-2 text-sm text-slate-500">
                                No training section selected.
                            </p>
                        ) : (
                            <div className="mt-3 flex flex-wrap gap-2">

                                {selectedSections.map(
                                    (sectionId) => (
                                        <span
                                            key={
                                                sectionId
                                            }
                                            className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700"
                                        >
                                            {getSectionName(
                                                sectionId
                                            )}
                                        </span>
                                    )
                                )}

                            </div>
                        )}

                    </div>
                )}


                {/* SAVE */}

                {selectedUser && (
                    <div className="flex justify-end">

                        <button
                            type="button"
                            onClick={
                                saveAssignments
                            }
                            disabled={
                                saving ||
                                selectedSections.length ===
                                0 ||
                                selectedUser.status !==
                                "active"
                            }
                            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Training Assignment"}
                        </button>

                    </div>
                )}

            </div>

        </section>
    );
}


export default TrainerAssignmentsPanel;