import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import TrainingPageIntro from "../../components/training/TrainingPageIntro";
import AssignedProgrammeCard from "../../components/training/AssignedProgrammeCard";

import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";
import EmptyState from "../../components/ui/EmptyState";

import api from "../../services/api";

import {
    getApiErrorMessage,
    getAssignmentProgramme,
    parseArrayResponse,
} from "../../utils/training";


function MyTrainingPage() {
    const navigate =
        useNavigate();


    // ======================================================
    // ASSIGNMENTS
    // ======================================================

    const [
        assignments,
        setAssignments,
    ] = useState([]);


    // ======================================================
    // PAGE STATE
    // ======================================================

    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    // ======================================================
    // LOAD MY TRAINING
    // ======================================================

    const loadTraining =
        useCallback(async () => {
            try {
                setLoading(true);

                setErrorMessage("");


                const response =
                    await api.get(
                        "/my-training"
                    );


                const assignmentList =
                    parseArrayResponse(
                        response.data,
                        "assignments"
                    );


                setAssignments(
                    assignmentList
                );

            } catch (error) {
                console.error(
                    "Load my training error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to load your assigned training."
                    )
                );

            } finally {
                setLoading(false);
            }
        }, []);


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        loadTraining();
    }, [
        loadTraining,
    ]);


    // ======================================================
    // AVAILABLE ASSIGNMENTS
    // ======================================================
    //
    // If an assignment references a programme that no
    // longer exists, it is not displayed.
    // ======================================================

    const availableAssignments =
        useMemo(() => {
            return assignments.filter(
                (assignment) =>
                    Boolean(
                        getAssignmentProgramme(
                            assignment
                        )
                    )
            );
        }, [
            assignments,
        ]);


    // ======================================================
    // START LEARNING
    // ======================================================

    const handleStartLearning = (
        programme
    ) => {
        if (!programme?._id) {
            return;
        }


        navigate(
            `/my-training/${programme._id}`
        );
    };


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <DashboardLayout
            role="trainee"
            showHeader={false}
        >
            <div className="space-y-6">

                {/* ========================================== */}
                {/* PAGE HEADER */}
                {/* ========================================== */}

                <TrainingPageIntro
                    title="My Training"
                    description="View the training programmes assigned to you and start learning."
                />


                {/* ========================================== */}
                {/* ERROR */}
                {/* ========================================== */}

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


                {/* ========================================== */}
                {/* CONTENT */}
                {/* ========================================== */}

                {loading ? (
                    <LoadingCard
                        message="Loading your training..."
                    />
                ) : availableAssignments.length ===
                    0 ? (
                    <EmptyState
                        title="No training assigned."
                        description="You do not currently have any training programmes available."
                    />
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                        {availableAssignments.map(
                            (
                                assignment
                            ) => (
                                <AssignedProgrammeCard
                                    key={
                                        assignment._id
                                    }
                                    assignment={
                                        assignment
                                    }
                                    onStart={
                                        handleStartLearning
                                    }
                                />
                            )
                        )}

                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}


export default MyTrainingPage;