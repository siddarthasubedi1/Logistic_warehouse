// ======================================================
// TRAINING ASSIGNMENTS PAGE
// ======================================================
//
// Administrator can:
// - View training assignments
// - Assign programmes to Trainees
// - Search assignments
// - Deactivate assignments
// - Reactivate assignments
//
// ======================================================

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


function TrainingAssignmentsPage() {

    // ==================================================
    // DATA
    // ==================================================

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


    // ==================================================
    // ASSIGNMENT FORM
    // ==================================================

    const [
        programmeId,
        setProgrammeId,
    ] = useState("");


    const [
        traineeId,
        setTraineeId,
    ] = useState("");


    // ==================================================
    // PAGE STATE
    // ==================================================

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


    // ==================================================
    // FEEDBACK
    // ==================================================

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    const clearFeedback = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };


    // ==================================================
    // LOAD PROGRAMMES
    // ==================================================

    const loadProgrammes = async () => {
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


    // ==================================================
    // LOAD TRAINEES
    // ==================================================

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


    // ==================================================
    // LOAD ASSIGNMENTS
    // ==================================================

    const loadAssignments = async () => {
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


    // ==================================================
    // LOAD PAGE
    // ==================================================

    const loadPageData = async () => {
        setLoading(true);

        clearFeedback();


        try {
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
            setLoading(false);
        }
    };


    useEffect(() => {
        loadPageData();
    }, []);


    // ==================================================
    // CREATE ASSIGNMENT
    // ==================================================

    const handleAssign = async (
        event
    ) => {
        if (event) {
            event.preventDefault();
        }


        clearFeedback();


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


        try {
            setSaving(true);


            const response =
                await api.post(
                    "/training-assignments",
                    {
                        programmeId,
                        traineeId,
                    }
                );


            setSuccessMessage(
                response.data?.message ||
                "Training programme assigned successfully."
            );


            // Reset assignment form.
            setProgrammeId("");
            setTraineeId("");


            // Reload assignments.
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
            setSaving(false);
        }
    };


    // ==================================================
    // DEACTIVATE
    // ==================================================

    const handleDeactivate = async (
        assignment
    ) => {
        if (!assignment?._id) {
            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to deactivate this training assignment?"
            );


        if (!confirmed) {
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
                response.data?.message ||
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
            setActionLoadingId("");
        }
    };


    // ==================================================
    // REACTIVATE
    // ==================================================

    const handleReactivate = async (
        assignment
    ) => {
        if (!assignment?._id) {
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
                response.data?.message ||
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
            setActionLoadingId("");
        }
    };


    // ==================================================
    // SEARCH
    // ==================================================

    const filteredAssignments =
        useMemo(() => {
            const query =
                searchTerm
                    .trim()
                    .toLowerCase();


            if (!query) {
                return assignments;
            }


            return assignments.filter(
                (assignment) => {
                    const trainee =
                        getAssignmentTrainee(
                            assignment
                        );


                    const programme =
                        getAssignmentProgramme(
                            assignment
                        );


                    const traineeName =
                        getUserDisplayName(
                            trainee,
                            ""
                        );


                    const traineeUsername =
                        trainee?.username ||
                        "";


                    const programmeTitle =
                        programme?.title ||
                        "";


                    const programmeType =
                        programme?.programmeType ||
                        "";


                    const status =
                        assignment?.status ||
                        "";


                    const searchableText =
                        `
                            ${traineeName}
                            ${traineeUsername}
                            ${programmeTitle}
                            ${programmeType}
                            ${status}
                        `.toLowerCase();


                    return searchableText.includes(
                        query
                    );
                }
            );
        }, [
            assignments,
            searchTerm,
        ]);


    // ==================================================
    // PAGE
    // ==================================================

    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >
            <TrainingManagementShell
                title="Training Assignments"
                description="Assign active workplace safety training programmes to Trainees and manage existing assignments."
            >

                {/* ====================================== */}
                {/* FEEDBACK */}
                {/* ====================================== */}

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


                {/* ====================================== */}
                {/* LOADING */}
                {/* ====================================== */}

                {loading ? (
                    <LoadingCard
                        message="Loading training assignments..."
                    />
                ) : (
                    <>

                        {/* ============================== */}
                        {/* ASSIGNMENT FORM */}
                        {/* ============================== */}

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


                        {/* ============================== */}
                        {/* SEARCH */}
                        {/* ============================== */}

                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <label
                                htmlFor="assignment-search"
                                className="mb-2 block text-xs font-semibold text-slate-700"
                            >
                                Search Assignments
                            </label>


                            <input
                                id="assignment-search"
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
                                placeholder="Search by Trainee, programme, type or status..."
                                className="
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
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                        </section>


                        {/* ============================== */}
                        {/* RESULTS */}
                        {/* ============================== */}

                        {assignments.length ===
                            0 ? (
                            <EmptyState
                                title="No training assignments found."
                                description="Use the form above to assign an active training programme to a Trainee."
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

                    </>
                )}

            </TrainingManagementShell>
        </DashboardLayout>
    );
}


export default TrainingAssignmentsPage;