import {
    useEffect,
    useMemo,
    useState,
} from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import TrainingManagementShell from "../../components/training/TrainingManagementShell";
import TrainingAssignmentForm from "../../components/training/TrainingAssignmentForm";
import TrainingAssignmentTable from "../../components/training/TrainingAssignmentTable";

import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";
import EmptyState from "../../components/ui/EmptyState";

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


// ======================================================
// TRAINING ASSIGNMENTS PAGE
// ======================================================

function TrainingAssignmentsPage() {
    // ======================================================
    // DATA
    // ======================================================

    const [
        programmes,
        setProgrammes,
    ] = useState([]);


    const [
        trainees,
        setTrainees,
    ] = useState([]);


    const [
        assignments,
        setAssignments,
    ] = useState([]);


    // ======================================================
    // FORM
    // ======================================================

    const [
        programmeId,
        setProgrammeId,
    ] = useState("");


    const [
        traineeId,
        setTraineeId,
    ] = useState("");


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


    const [
        actionLoadingId,
        setActionLoadingId,
    ] = useState("");


    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");


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


    const clearFeedback =
        () => {
            setErrorMessage("");
            setSuccessMessage("");
        };


    // ======================================================
    // LOAD PROGRAMMES
    // ======================================================

    const loadProgrammes =
        async () => {
            const response =
                await api.get(
                    "/training-programmes"
                );


            const programmeList =
                parseArrayResponse(
                    response.data,
                    "programmes"
                );


            setProgrammes(
                getActiveProgrammes(
                    programmeList
                )
            );
        };


    // ======================================================
    // LOAD TRAINEES
    // ======================================================

    const loadTrainees =
        async () => {
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


    // ======================================================
    // LOAD ASSIGNMENTS
    // ======================================================

    const loadAssignments =
        async () => {
            const response =
                await api.get(
                    "/training-assignments"
                );


            const assignmentList =
                parseArrayResponse(
                    response.data,
                    "assignments"
                );


            setAssignments(
                assignmentList
            );
        };


    // ======================================================
    // LOAD PAGE
    // ======================================================

    const loadPageData =
        async () => {
            try {
                setLoading(
                    true
                );


                clearFeedback();


                await Promise.all([
                    loadProgrammes(),
                    loadTrainees(),
                    loadAssignments(),
                ]);

            } catch (error) {
                console.error(
                    "Load training assignments error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to load training assignment data."
                    )
                );

            } finally {
                setLoading(
                    false
                );
            }
        };


    useEffect(() => {
        loadPageData();
    }, []);


    // ======================================================
    // CREATE ASSIGNMENT
    // ======================================================

    const handleAssign =
        async (
            event
        ) => {
            event?.preventDefault();


            clearFeedback();


            if (
                !programmeId
            ) {
                setErrorMessage(
                    "Please select a training programme."
                );

                return;
            }


            if (
                !traineeId
            ) {
                setErrorMessage(
                    "Please select a Trainee."
                );

                return;
            }


            try {
                setSaving(
                    true
                );


                const response =
                    await api.post(
                        "/training-assignments",
                        {
                            programmeId,
                            traineeId,
                        }
                    );


                setSuccessMessage(
                    response.data
                        ?.message ||
                    "Training programme assigned successfully."
                );


                setProgrammeId(
                    ""
                );


                setTraineeId(
                    ""
                );


                await loadAssignments();

            } catch (error) {
                console.error(
                    "Create training assignment error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to assign the training programme."
                    )
                );

            } finally {
                setSaving(
                    false
                );
            }
        };


    // ======================================================
    // DEACTIVATE
    // ======================================================

    const handleDeactivate =
        async (
            assignment
        ) => {
            if (
                !assignment?._id
            ) {
                return;
            }


            const confirmed =
                window.confirm(
                    "Are you sure you want to deactivate this training assignment?"
                );


            if (
                !confirmed
            ) {
                return;
            }


            clearFeedback();


            try {
                setActionLoadingId(
                    assignment._id
                );


                const response =
                    await api.patch(
                        `/training-assignments/${assignment._id}/deactivate`
                    );


                setSuccessMessage(
                    response.data
                        ?.message ||
                    "Training assignment deactivated successfully."
                );


                await loadAssignments();

            } catch (error) {
                console.error(
                    "Deactivate assignment error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to deactivate the training assignment."
                    )
                );

            } finally {
                setActionLoadingId(
                    ""
                );
            }
        };


    // ======================================================
    // REACTIVATE
    // ======================================================

    const handleReactivate =
        async (
            assignment
        ) => {
            if (
                !assignment?._id
            ) {
                return;
            }


            clearFeedback();


            try {
                setActionLoadingId(
                    assignment._id
                );


                const response =
                    await api.patch(
                        `/training-assignments/${assignment._id}/reactivate`
                    );


                setSuccessMessage(
                    response.data
                        ?.message ||
                    "Training assignment reactivated successfully."
                );


                await loadAssignments();

            } catch (error) {
                console.error(
                    "Reactivate assignment error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reactivate the training assignment."
                    )
                );

            } finally {
                setActionLoadingId(
                    ""
                );
            }
        };


    // ======================================================
    // SEARCH
    // ======================================================

    const filteredAssignments =
        useMemo(
            () => {
                const query =
                    searchTerm
                        .trim()
                        .toLowerCase();


                if (
                    !query
                ) {
                    return assignments;
                }


                return assignments.filter(
                    (
                        assignment
                    ) => {
                        const programme =
                            getAssignmentProgramme(
                                assignment
                            );


                        const trainee =
                            getAssignmentTrainee(
                                assignment
                            );


                        const searchText =
                            [
                                programme?.title,
                                programme?.programmeType,
                                assignment?.status,

                                getUserDisplayName(
                                    trainee,
                                    ""
                                ),

                                trainee?.username,
                                trainee?.email,
                            ]
                                .filter(Boolean)
                                .join(" ")
                                .toLowerCase();


                        return searchText.includes(
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


    // ======================================================
    // COUNTS
    // ======================================================

    const activeAssignmentCount =
        assignments.filter(
            (
                assignment
            ) =>
                assignment.status !==
                "inactive"
        ).length;


    const inactiveAssignmentCount =
        assignments.filter(
            (
                assignment
            ) =>
                assignment.status ===
                "inactive"
        ).length;


    // ======================================================
    // LOADING
    // ======================================================

    if (
        loading
    ) {
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


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >
            <TrainingManagementShell
                title="Training Assignments"
                description="Assign active training programmes to Trainee accounts."
            >
                {/* ================================================= */}
                {/* STATS */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-3
                        sm:grid-cols-3
                    "
                >
                    <AssignmentStat
                        label="Total Assignments"
                        value={
                            assignments.length
                        }
                    />


                    <AssignmentStat
                        label="Active"
                        value={
                            activeAssignmentCount
                        }
                    />


                    <AssignmentStat
                        label="Inactive"
                        value={
                            inactiveAssignmentCount
                        }
                    />
                </section>


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
                {/* FORM */}
                {/* ================================================= */}

                {programmes.length ===
                    0 ? (
                    <EmptyState
                        title="No active training programmes available."
                        description="Create or activate a training programme before assigning training."
                        icon="training"
                    />
                ) : trainees.length ===
                    0 ? (
                    <EmptyState
                        title="No active Trainees available."
                        description="An active Trainee account is required before training can be assigned."
                        icon="users"
                    />
                ) : (
                    <TrainingAssignmentForm
                        programmes={
                            programmes
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
                            setProgrammeId
                        }
                        onTraineeChange={
                            setTraineeId
                        }
                        onSubmit={
                            handleAssign
                        }
                    />
                )}


                {/* ================================================= */}
                {/* SEARCH */}
                {/* ================================================= */}

                {assignments.length >
                    0 && (
                        <section
                            className="
                            rounded-xl
                            border
                            border-slate-200
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
                                gap-3
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                            >
                                <div>
                                    <h2
                                        className="
                                        text-[11px]
                                        font-semibold
                                        text-slate-800
                                    "
                                    >
                                        Search Assignments
                                    </h2>


                                    <p
                                        className="
                                        mt-1
                                        text-[8px]
                                        text-slate-400
                                    "
                                    >
                                        Search by Trainee, programme or status.
                                    </p>
                                </div>


                                <span
                                    className="
                                    w-fit
                                    rounded-full
                                    bg-slate-100
                                    px-3
                                    py-1
                                    text-[8px]
                                    text-slate-500
                                "
                                >
                                    {filteredAssignments.length} Visible
                                </span>
                            </div>


                            <div
                                className="
                                relative
                                mt-4
                            "
                            >
                                <span
                                    className="
                                    pointer-events-none
                                    absolute
                                    inset-y-0
                                    left-0
                                    flex
                                    items-center
                                    pl-3
                                    text-slate-400
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
                                            cx="11"
                                            cy="11"
                                            r="7"
                                        />

                                        <path d="m20 20-3.5-3.5" />
                                    </svg>
                                </span>


                                <input
                                    type="search"
                                    value={
                                        searchTerm
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearchTerm(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search assignments..."
                                    className="
                                    h-10
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    pl-9
                                    pr-3
                                    text-[9px]
                                    text-slate-700
                                    outline-none
                                    placeholder:text-slate-400
                                    focus:border-blue-500
                                "
                                />
                            </div>
                        </section>
                    )}


                {/* ================================================= */}
                {/* TABLE */}
                {/* ================================================= */}

                {assignments.length ===
                    0 ? (
                    <EmptyState
                        title="No training assignments found."
                        description="Use the form above to assign a programme to a Trainee."
                        icon="training"
                    />
                ) : filteredAssignments.length ===
                    0 ? (
                    <EmptyState
                        title="No matching assignments found."
                        description="Try a different search term."
                    />
                ) : (
                    <TrainingAssignmentTable
                        assignments={
                            filteredAssignments
                        }
                        actionLoadingId={
                            actionLoadingId
                        }
                        onDeactivate={
                            handleDeactivate
                        }
                        onReactivate={
                            handleReactivate
                        }
                    />
                )}
            </TrainingManagementShell>
        </DashboardLayout>
    );
}


// ======================================================
// STAT CARD
// ======================================================

function AssignmentStat({
    label,
    value,
}) {
    return (
        <article
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >
            <p
                className="
                    text-[8px]
                    text-slate-400
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    text-xl
                    font-bold
                    text-slate-800
                "
            >
                {value}
            </p>
        </article>
    );
}


export default TrainingAssignmentsPage;