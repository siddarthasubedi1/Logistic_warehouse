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


    const clearFeedback = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };


    const loadProgrammes =
        async () => {
            const response =
                await api.get(
                    "/training-programmes"
                );

            setProgrammes(
                getActiveProgrammes(
                    parseArrayResponse(
                        response.data,
                        "programmes"
                    )
                )
            );
        };


    const loadTrainees =
        async () => {
            const response =
                await api.get(
                    "/admin/users"
                );

            setTrainees(
                getAssignableTrainees(
                    parseArrayResponse(
                        response.data,
                        "users"
                    )
                )
            );
        };


    const loadAssignments =
        async () => {
            const response =
                await api.get(
                    "/training-assignments"
                );

            setAssignments(
                parseArrayResponse(
                    response.data,
                    "assignments"
                )
            );
        };


    const loadPageData =
        async () => {
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
                    "Load assignments error:",
                    error
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to load training assignments."
                    )
                );

            } finally {
                setLoading(false);
            }
        };


    useEffect(() => {
        loadPageData();
    }, []);


    const handleAssign =
        async (
            event
        ) => {
            event.preventDefault();

            clearFeedback();

            if (
                !programmeId ||
                !traineeId
            ) {
                setErrorMessage(
                    "Please select both a programme and a Trainee."
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

                setProgrammeId("");
                setTraineeId("");

                await loadAssignments();

            } catch (error) {
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
                    "Deactivate this training assignment?"
                );

            if (!confirmed) {
                return;
            }

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
                    "Training assignment deactivated."
                );

                await loadAssignments();

            } catch (error) {
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to deactivate assignment."
                    )
                );

            } finally {
                setActionLoadingId("");
            }
        };


    const handleReactivate =
        async (
            assignment
        ) => {
            if (
                !assignment?._id
            ) {
                return;
            }

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
                    "Training assignment reactivated."
                );

                await loadAssignments();

            } catch (error) {
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reactivate assignment."
                    )
                );

            } finally {
                setActionLoadingId("");
            }
        };


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

                        const text =
                            [
                                programme?.title,
                                programme?.programmeType,
                                trainee?.username,
                                getUserDisplayName(
                                    trainee,
                                    ""
                                ),
                                assignment.status,
                            ]
                                .filter(Boolean)
                                .join(" ")
                                .toLowerCase();

                        return text.includes(
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


    const activeAssignments =
        assignments.filter(
            (
                assignment
            ) =>
                assignment.status !==
                "inactive"
        ).length;


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


    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >
            <TrainingManagementShell
                title="Training Assignments"
                description="Assign active safety training programmes to Trainee accounts."
            >
                <FeedbackAlert
                    type="success"
                    message={
                        successMessage
                    }
                    onClose={() =>
                        setSuccessMessage("")
                    }
                />

                <FeedbackAlert
                    type="error"
                    message={
                        errorMessage
                    }
                    onClose={() =>
                        setErrorMessage("")
                    }
                />


                <section
                    className="
                        grid
                        gap-3
                        sm:grid-cols-3
                    "
                >
                    <Stat
                        label="Assignments"
                        value={
                            assignments.length
                        }
                    />

                    <Stat
                        label="Active"
                        value={
                            activeAssignments
                        }
                    />

                    <Stat
                        label="Assignable Trainees"
                        value={
                            trainees.length
                        }
                    />
                </section>


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
                            gap-3
                            border-b
                            border-slate-100
                            px-4
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:px-5
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-[11px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                Existing Assignments
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Review or change current programme access.
                            </p>
                        </div>


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
                                px-3
                                text-[9px]
                                font-medium
                                text-slate-800
                                outline-none
                                focus:border-blue-500
                                sm:max-w-[260px]
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
                        onDeactivate={
                            handleDeactivate
                        }
                        onReactivate={
                            handleReactivate
                        }
                    />
                </section>
            </TrainingManagementShell>
        </DashboardLayout>
    );
}


function Stat({
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
                    font-medium
                    text-slate-500
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-2
                    text-[22px]
                    font-bold
                    text-[#172033]
                "
            >
                {value}
            </p>
        </article>
    );
}


export default TrainingAssignmentsPage;