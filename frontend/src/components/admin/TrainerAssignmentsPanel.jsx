import {
    useEffect,
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
        trainers,
        setTrainers,
    ] = useState([]);


    const [
        selectedTrainerId,
        setSelectedTrainerId,
    ] = useState("");


    const [
        selectedSections,
        setSelectedSections,
    ] = useState([]);


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
    // LOAD TRAINERS
    // ======================================================

    const loadTrainers =
        async () => {
            try {
                setLoading(true);
                setError("");


                const response =
                    await api.get(
                        "/admin/users"
                    );


                const users =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : response.data
                            ?.users || [];


                const trainerUsers =
                    users.filter(
                        (user) =>
                            user.role ===
                            "trainer"
                    );


                setTrainers(
                    trainerUsers
                );

            } catch (error) {
                console.error(
                    "Load Trainers error:",
                    error
                );


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to load Trainers."
                );

            } finally {
                setLoading(false);
            }
        };


    useEffect(() => {
        loadTrainers();
    }, []);


    // ======================================================
    // SELECT TRAINER
    // ======================================================

    const handleTrainerChange = (
        event
    ) => {
        const trainerId =
            event.target.value;


        setSelectedTrainerId(
            trainerId
        );


        setMessage("");
        setError("");


        const trainer =
            trainers.find(
                (item) =>
                    item._id ===
                    trainerId
            );


        if (!trainer) {
            setSelectedSections(
                []
            );

            return;
        }


        setSelectedSections(
            Array.isArray(
                trainer.assignedTrainingSections
            )
                ? trainer.assignedTrainingSections
                : []
        );
    };


    // ======================================================
    // TOGGLE TRAINING SECTION
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
    };


    // ======================================================
    // SAVE ASSIGNMENTS
    // ======================================================

    const saveAssignments =
        async () => {
            if (
                !selectedTrainerId
            ) {
                setError(
                    "Please select a Trainer."
                );

                return;
            }


            try {
                setSaving(true);

                setError("");
                setMessage("");


                const response =
                    await api.patch(
                        `/admin/trainers/${selectedTrainerId}/training-sections`,
                        {
                            trainingSections:
                                selectedSections,
                        }
                    );


                setMessage(
                    response.data
                        ?.message ||
                    "Trainer assignments updated successfully."
                );


                await loadTrainers();


            } catch (error) {
                console.error(
                    "Save assignment error:",
                    error
                );


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to update Trainer assignments."
                );

            } finally {
                setSaving(false);
            }
        };


    // ======================================================
    // SELECTED TRAINER
    // ======================================================

    const selectedTrainer =
        trainers.find(
            (trainer) =>
                trainer._id ===
                selectedTrainerId
        );


    // ======================================================
    // UI
    // ======================================================

    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="border-b border-slate-200 px-6 py-5">

                <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

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
                            Trainer Training Assignments
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Assign one or multiple training sections to a Trainer.
                        </p>
                    </div>

                </div>

            </div>


            <div className="space-y-6 p-6">

                {/* ERROR */}

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}


                {/* SUCCESS */}

                {message && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {message}
                    </div>
                )}


                {/* SELECT TRAINER */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Select Trainer
                    </label>


                    <select
                        value={
                            selectedTrainerId
                        }
                        onChange={
                            handleTrainerChange
                        }
                        disabled={
                            loading
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500"
                    >

                        <option value="">
                            {loading
                                ? "Loading Trainers..."
                                : "Select a Trainer"}
                        </option>


                        {trainers.map(
                            (trainer) => (
                                <option
                                    key={
                                        trainer._id
                                    }
                                    value={
                                        trainer._id
                                    }
                                >
                                    {trainer.firstName}{" "}
                                    {trainer.lastName}
                                    {" - "}
                                    {trainer.username}
                                </option>
                            )
                        )}

                    </select>

                </div>


                {/* TRAINER INFORMATION */}

                {selectedTrainer && (
                    <div className="rounded-xl bg-slate-50 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Selected Trainer
                        </p>

                        <p className="mt-2 font-semibold text-slate-900">
                            {selectedTrainer.firstName}{" "}
                            {selectedTrainer.lastName}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Username:{" "}
                            {selectedTrainer.username}
                        </p>

                    </div>
                )}


                {/* TRAINING SECTIONS */}

                {selectedTrainerId && (
                    <div>

                        <h3 className="text-sm font-bold text-slate-900">
                            Training Sections
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            You can select more than one section for the same Trainer.
                        </p>


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
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-slate-200 bg-white hover:border-blue-300"
                                                }`}
                                        >

                                            <div className="flex items-start gap-3">

                                                <div
                                                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${selected
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
                                                        {
                                                            section.name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                                        {
                                                            section.description
                                                        }
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


                {/* CURRENT ASSIGNMENT SUMMARY */}

                {selectedTrainerId && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                        <p className="text-sm font-semibold text-slate-900">
                            Current Selection
                        </p>


                        {selectedSections.length ===
                            0 ? (
                            <p className="mt-2 text-sm text-slate-500">
                                No training sections selected.
                            </p>
                        ) : (
                            <div className="mt-3 flex flex-wrap gap-2">

                                {selectedSections.map(
                                    (sectionId) => {

                                        const section =
                                            TRAINING_SECTIONS.find(
                                                (item) =>
                                                    item.id ===
                                                    sectionId
                                            );


                                        return (
                                            <span
                                                key={
                                                    sectionId
                                                }
                                                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                                            >
                                                {section
                                                    ?.name ||
                                                    sectionId}
                                            </span>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </div>
                )}


                {/* SAVE */}

                {selectedTrainerId && (
                    <div className="flex justify-end">

                        <button
                            type="button"
                            onClick={
                                saveAssignments
                            }
                            disabled={
                                saving
                            }
                            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Training Assignments"}
                        </button>

                    </div>
                )}

            </div>

        </section>
    );
}


export default TrainerAssignmentsPanel;