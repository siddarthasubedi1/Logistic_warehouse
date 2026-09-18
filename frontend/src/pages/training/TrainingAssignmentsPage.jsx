import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import TrainingAssignmentForm from "../../components/training/TrainingAssignmentForm";
import TrainingAssignmentTable from "../../components/training/TrainingAssignmentTable";

import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";

import api from "../../services/api";

import {
    getActiveProgrammes,
    getAssignableTrainees,
    getAssignmentProgramme,
    getAssignmentTrainee,
    getUserDisplayName,
    parseArrayResponse,
    getApiErrorMessage,
} from "../../utils/training";

import {
    canonicalModuleKey,
    getActiveTrainingModules,
} from "../../utils/trainingModules";


/* =========================================================
   NORMALISE MODULE / PROGRAMME KEY

   Examples:
   "Cyber Awareness"  -> "cyber-awareness"
   "cyber_awareness"  -> "cyber-awareness"
   "CYBER-AWARENESS"  -> "cyber-awareness"
========================================================= */

function normalizeModuleKey(value) {
    return canonicalModuleKey(value);
}


function TrainingAssignmentsPage() {
    const navigate = useNavigate();

    /* =====================================================
       STATE
    ===================================================== */

    const [
        programmes,
        setProgrammes,
    ] = useState([]);

    const [
        modules,
        setModules,
    ] = useState([]);

    const [
        moduleId,
        setModuleId,
    ] = useState("");

    const [
        trainees,
        setTrainees,
    ] = useState([]);

    const [
        assignments,
        setAssignments,
    ] = useState([]);

    const [
        programmeId,
        setProgrammeId,
    ] = useState("");

    const [
        traineeId,
        setTraineeId,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        actionLoadingId,
        setActionLoadingId,
    ] = useState("");

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    /* =====================================================
       CLEAR MESSAGES
    ===================================================== */

    const clearFeedback = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };


    /* =====================================================
       LOAD PROGRAMMES + MODULES
    ===================================================== */

    const loadProgrammes = async () => {
        /*
         * Modules are created through your existing
         * Training Module system.
         */
        const activeModules =
            getActiveTrainingModules();

        setModules(activeModules);


        /*
         * Programmes come from MongoDB.
         */
        const response =
            await api.get(
                "/training-programmes"
            );

        const programmeList =
            parseArrayResponse(
                response.data,
                "programmes"
            );


        /*
         * Only active programmes can be assigned.
         */
        const activeProgrammes =
            getActiveProgrammes(
                programmeList
            );

        setProgrammes(
            activeProgrammes
        );
    };


    /* =====================================================
       LOAD TRAINEES
    ===================================================== */

    const loadTrainees = async () => {
        const response =
            await api.get(
                "/admin/users"
            );

        const userList =
            parseArrayResponse(
                response.data,
                "users"
            );

        setTrainees(
            getAssignableTrainees(
                userList
            )
        );
    };


    /* =====================================================
       LOAD ASSIGNMENTS
    ===================================================== */

    const loadAssignments = async () => {
        try {
            const response =
                await api.get(
                    "/training-assignments"
                );

            const backendAssignments =
                parseArrayResponse(
                    response.data,
                    "assignments"
                );

            setAssignments(
                backendAssignments
            );
        } catch (error) {
            console.error(
                "Load assignments error:",
                error
            );

            setAssignments([]);
        }
    };


    /* =====================================================
       LOAD PAGE
    ===================================================== */

    const loadPageData = async () => {
        try {
            setLoading(true);

            clearFeedback();

            await Promise.all([
                loadProgrammes(),
                loadTrainees(),
                loadAssignments(),
            ]);
        } catch (error) {
            console.error(
                "Training assignment page error:",
                error
            );

            setErrorMessage(
                getApiErrorMessage(
                    error,
                    "Unable to load training assignment data."
                )
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadPageData();
    }, []);


    /* =====================================================
       FILTER PROGRAMMES BY SELECTED MODULE

       IMPORTANT FIX:
       Both values are normalised before comparison.
    ===================================================== */

    const filteredProgrammes =
        useMemo(
            () => {
                if (!moduleId) {
                    return [];
                }

                const selectedKey =
                    normalizeModuleKey(
                        moduleId
                    );


                return programmes.filter(
                    (programme) => {
                        const programmeKey =
                            normalizeModuleKey(
                                programme
                                    ?.programmeType
                            );

                        return (
                            programmeKey ===
                            selectedKey
                        );
                    }
                );
            },
            [
                programmes,
                moduleId,
            ]
        );


    /* =====================================================
       SELECTED MODULE
    ===================================================== */

    const selectedModule =
        useMemo(
            () =>
                modules.find(
                    (module) =>
                        normalizeModuleKey(
                            module.id
                        ) ===
                        normalizeModuleKey(
                            moduleId
                        )
                ),
            [
                modules,
                moduleId,
            ]
        );


    /* =====================================================
       MODULE CHANGE
    ===================================================== */

    const handleModuleChange =
        (value) => {
            setModuleId(
                normalizeModuleKey(
                    value
                )
            );

            /*
             * Reset programme because a programme
             * from the previous module must not remain selected.
             */
            setProgrammeId("");

            clearFeedback();
        };


    /* =====================================================
       PROGRAMME CHANGE
    ===================================================== */

    const handleProgrammeChange =
        (value) => {
            setProgrammeId(
                value
            );

            clearFeedback();
        };


    /* =====================================================
       TRAINEE CHANGE
    ===================================================== */

    const handleTraineeChange =
        (value) => {
            setTraineeId(
                value
            );

            clearFeedback();
        };


    /* =====================================================
       ADD PROGRAMME

       Opens the programme page for the currently
       selected Training Module.
    ===================================================== */

    const handleAddProgramme =
        () => {
            if (
                selectedModule
                    ?.moduleId
            ) {
                navigate(
                    `/training-programmes/module/${selectedModule.moduleId}/programme`
                );

                return;
            }

            navigate(
                "/training-programmes"
            );
        };


    /* =====================================================
       CREATE ASSIGNMENT
    ===================================================== */

    const handleSubmit =
        async (event) => {
            event.preventDefault();

            clearFeedback();


            if (!moduleId) {
                setErrorMessage(
                    "Please select a training module."
                );

                return;
            }


            if (!programmeId) {
                setErrorMessage(
                    "Please select a training programme."
                );

                return;
            }


            if (!traineeId) {
                setErrorMessage(
                    "Please select a Trainee."
                );

                return;
            }


            /*
             * Security/data integrity check:
             * make sure the selected programme really
             * belongs to the selected module.
             */
            const selectedProgramme =
                filteredProgrammes.find(
                    (programme) =>
                        String(
                            programme._id
                        ) ===
                        String(
                            programmeId
                        )
                );


            if (!selectedProgramme) {
                setErrorMessage(
                    "The selected programme does not belong to this training module."
                );

                setProgrammeId("");

                return;
            }


            try {
                setSaving(true);


                await api.post(
                    "/training-assignments",
                    {
                        programmeId,
                        traineeId,
                    }
                );


                setSuccessMessage(
                    `${selectedProgramme.title} assigned successfully.`
                );


                /*
                 * Clear programme and trainee.
                 * Keep module selected so Admin can
                 * assign another programme from the
                 * same module.
                 */
                setProgrammeId("");
                setTraineeId("");


                await loadAssignments();

            } catch (error) {
                console.error(
                    "Create assignment error:",
                    error
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to assign the training programme."
                    )
                );
            } finally {
                setSaving(false);
            }
        };


    /* =====================================================
       CHANGE ASSIGNMENT STATUS
    ===================================================== */

    const handleStatusChange =
        async (
            assignment,
            status
        ) => {
            const assignmentId =
                assignment?._id;

            if (!assignmentId) {
                return;
            }


            try {
                setActionLoadingId(
                    assignmentId
                );

                clearFeedback();


                await api.patch(
                    `/training-assignments/${assignmentId}`,
                    {
                        status,
                    }
                );


                setSuccessMessage(
                    `Assignment ${status} successfully.`
                );


                await loadAssignments();

            } catch (error) {
                console.error(
                    "Update assignment error:",
                    error
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to update assignment."
                    )
                );
            } finally {
                setActionLoadingId("");
            }
        };


    /* =====================================================
       DELETE ASSIGNMENT
    ===================================================== */

    const handleDelete =
        async (
            assignment
        ) => {
            const assignmentId =
                assignment?._id;

            if (!assignmentId) {
                return;
            }


            const programme =
                getAssignmentProgramme(
                    assignment
                );


            const confirmed =
                window.confirm(
                    `Delete assignment for "${programme?.title || "this programme"}"?`
                );


            if (!confirmed) {
                return;
            }


            try {
                setActionLoadingId(
                    assignmentId
                );

                clearFeedback();


                await api.delete(
                    `/training-assignments/${assignmentId}`
                );


                setSuccessMessage(
                    "Assignment deleted successfully."
                );


                await loadAssignments();

            } catch (error) {
                console.error(
                    "Delete assignment error:",
                    error
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to delete assignment."
                    )
                );
            } finally {
                setActionLoadingId("");
            }
        };


    /* =====================================================
       SEARCH ASSIGNMENTS
    ===================================================== */

    const filteredAssignments =
        useMemo(
            () => {
                const query =
                    searchTerm
                        .trim()
                        .toLowerCase();


                if (!query) {
                    return assignments;
                }


                return assignments.filter(
                    (assignment) => {
                        const programme =
                            getAssignmentProgramme(
                                assignment
                            );

                        const trainee =
                            getAssignmentTrainee(
                                assignment
                            );


                        const searchableText =
                            [
                                programme
                                    ?.title,

                                programme
                                    ?.programmeType,

                                trainee
                                    ?.username,

                                getUserDisplayName(
                                    trainee,
                                    ""
                                ),

                                assignment
                                    ?.status,
                            ]
                                .filter(Boolean)
                                .join(" ")
                                .toLowerCase();


                        return searchableText.includes(
                            query
                        );
                    }
                );
            },
            [
                assignments,
                searchTerm,
            ]
        );


    /* =====================================================
       STATISTICS
    ===================================================== */

    const activeAssignments =
        assignments.filter(
            (assignment) =>
                String(
                    assignment
                        ?.status ||
                    ""
                )
                    .toLowerCase() !==
                "inactive"
        );


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <DashboardLayout
                role="admin"
                showHeader={false}
            >
                <LoadingCard
                    message="Loading training assignments..."
                />
            </DashboardLayout>
        );
    }


    /* =====================================================
       UI
    ===================================================== */

    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >
            <div
                className="
                    space-y-5
                "
            >
                {/* =========================================
                    PAGE HEADER
                ========================================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-xl
                        bg-gradient-to-r
                        from-[#073763]
                        to-[#1769aa]
                        p-7
                        text-white
                        shadow-sm
                    "
                >
                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-20
                            h-52
                            w-52
                            rounded-full
                            bg-white/10
                        "
                    />

                    <div
                        className="
                            relative
                            z-10
                            flex
                            flex-col
                            gap-4
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.15em]
                                    text-blue-100
                                "
                            >
                                Training Management
                            </p>

                            <h1
                                className="
                                    mt-2
                                    text-2xl
                                    font-bold
                                "
                            >
                                Training Assignments
                            </h1>

                            <p
                                className="
                                    mt-2
                                    max-w-2xl
                                    text-sm
                                    text-blue-100
                                "
                            >
                                Assign active workplace safety programmes
                                to Trainee accounts and manage existing
                                assignments.
                            </p>
                        </div>


                        <button
                            type="button"
                            onClick={
                                () =>
                                    navigate(
                                        "/training-programmes"
                                    )
                            }
                            className="
                                rounded-xl
                                bg-white
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-[#073763]
                                shadow-sm
                                hover:bg-blue-50
                            "
                        >
                            + Add Programme
                        </button>
                    </div>
                </section>


                {/* =========================================
                    FEEDBACK
                ========================================= */}

                {errorMessage && (
                    <FeedbackAlert
                        type="error"
                        message={
                            errorMessage
                        }
                    />
                )}


                {successMessage && (
                    <FeedbackAlert
                        type="success"
                        message={
                            successMessage
                        }
                    />
                )}


                {/* =========================================
                    STATISTICS
                ========================================= */}

                <div
                    className="
                        grid
                        gap-4
                        md:grid-cols-3
                    "
                >
                    <StatCard
                        title="Total Assignments"
                        value={
                            assignments.length
                        }
                    />

                    <StatCard
                        title="Active"
                        value={
                            activeAssignments.length
                        }
                    />

                    <StatCard
                        title="Assignable Trainees"
                        value={
                            trainees.length
                        }
                    />
                </div>


                {/* =========================================
                    CREATE ASSIGNMENT
                ========================================= */}

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
                            px-5
                            py-5
                        "
                    >
                        <h2
                            className="
                                text-sm
                                font-bold
                                text-[#172033]
                            "
                        >
                            Create Assignment
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-slate-500
                            "
                        >
                            Select a module, programme and Trainee.
                        </p>
                    </div>


                    <div
                        className="
                            p-5
                        "
                    >
                        <TrainingAssignmentForm
                            modules={
                                modules
                            }

                            moduleId={
                                moduleId
                            }

                            onModuleChange={
                                handleModuleChange
                            }

                            onAddProgramme={
                                handleAddProgramme
                            }

                            programmes={
                                filteredProgrammes
                            }

                            trainees={
                                trainees
                            }

                            programmeId={
                                programmeId
                            }

                            traineeId={
                                traineeId
                            }

                            saving={
                                saving
                            }

                            onProgrammeChange={
                                handleProgrammeChange
                            }

                            onTraineeChange={
                                handleTraineeChange
                            }

                            onSubmit={
                                handleSubmit
                            }
                        />
                    </div>
                </section>


                {/* =========================================
                    EXISTING ASSIGNMENTS
                ========================================= */}

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
                            flex
                            flex-col
                            gap-4
                            border-b
                            border-slate-100
                            px-5
                            py-5
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-sm
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                Existing Assignments
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-slate-500
                                "
                            >
                                Manage currently assigned
                                training programmes.
                            </p>
                        </div>


                        <input
                            type="search"
                            value={
                                searchTerm
                            }
                            onChange={
                                (event) =>
                                    setSearchTerm(
                                        event
                                            .target
                                            .value
                                    )
                            }
                            placeholder="Search assignments..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-300
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                                md:w-80
                            "
                        />
                    </div>


                    <TrainingAssignmentTable
                        assignments={
                            filteredAssignments
                        }

                        actionLoadingId={
                            actionLoadingId
                        }

                        onStatusChange={
                            handleStatusChange
                        }

                        onDelete={
                            handleDelete
                        }
                    />
                </section>
            </div>
        </DashboardLayout>
    );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    title,
    value,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >
            <p
                className="
                    text-[9px]
                    font-medium
                    text-slate-500
                "
            >
                {title}
            </p>

            <div
                className="
                    mt-3
                    flex
                    items-center
                    justify-between
                "
            >
                <p
                    className="
                        text-2xl
                        font-bold
                        text-[#172033]
                    "
                >
                    {value}
                </p>

                <div
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-50
                        text-xl
                        text-blue-600
                    "
                >
                    ✓
                </div>
            </div>
        </div>
    );
}


export default TrainingAssignmentsPage;