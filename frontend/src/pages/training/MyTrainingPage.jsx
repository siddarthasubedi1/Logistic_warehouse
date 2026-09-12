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


// ======================================================
// MY TRAINING
// ======================================================

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
    // STATE
    // ======================================================

    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    const [
        typeFilter,
        setTypeFilter,
    ] = useState("all");


    // ======================================================
    // LOAD
    // ======================================================

    const loadTraining =
        useCallback(
            async () => {
                try {
                    setLoading(
                        true
                    );


                    setErrorMessage(
                        ""
                    );


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
                    setLoading(
                        false
                    );
                }
            },
            []
        );


    useEffect(() => {
        loadTraining();
    }, [
        loadTraining,
    ]);


    // ======================================================
    // AVAILABLE ASSIGNMENTS
    // ======================================================

    const availableAssignments =
        useMemo(
            () => {
                return assignments.filter(
                    (
                        assignment
                    ) =>
                        Boolean(
                            getAssignmentProgramme(
                                assignment
                            )
                        )
                );
            },
            [
                assignments,
            ]
        );


    // ======================================================
    // FILTERED ASSIGNMENTS
    // ======================================================

    const filteredAssignments =
        useMemo(
            () => {
                if (
                    typeFilter ===
                    "all"
                ) {
                    return availableAssignments;
                }


                return availableAssignments.filter(
                    (
                        assignment
                    ) =>
                        getAssignmentProgramme(
                            assignment
                        )?.programmeType ===
                        typeFilter
                );
            },
            [
                availableAssignments,
                typeFilter,
            ]
        );


    // ======================================================
    // COUNTS
    // ======================================================

    const activeAssignments =
        availableAssignments.filter(
            (
                assignment
            ) => {
                const programme =
                    getAssignmentProgramme(
                        assignment
                    );


                return (
                    assignment.status !==
                    "inactive" &&
                    programme?.status !==
                    "inactive"
                );
            }
        ).length;


    const manualHandlingCount =
        availableAssignments.filter(
            (
                assignment
            ) =>
                getAssignmentProgramme(
                    assignment
                )?.programmeType ===
                "manual-handling"
        ).length;


    const workingAtHeightCount =
        availableAssignments.filter(
            (
                assignment
            ) =>
                getAssignmentProgramme(
                    assignment
                )?.programmeType ===
                "working-at-height"
        ).length;


    // ======================================================
    // START LEARNING
    // ======================================================

    const handleStartLearning = (
        assignment
    ) => {
        const programme =
            getAssignmentProgramme(
                assignment
            );


        if (
            !programme?._id
        ) {
            return;
        }


        navigate(
            `/my-training/${programme._id}`
        );
    };


    // ======================================================
    // LOADING
    // ======================================================

    if (
        loading
    ) {
        return (
            <DashboardLayout
                role="trainee"
                title="My Training"
                subtitle="View your assigned workplace safety programmes."
            >
                <LoadingCard
                    message="Loading your training..."
                />
            </DashboardLayout>
        );
    }


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <DashboardLayout
            role="trainee"
            title="My Training"
            subtitle="View your assigned workplace safety programmes."
        >
            <div
                className="
                    space-y-4
                "
            >
                {/* ================================================= */}
                {/* FEEDBACK */}
                {/* ================================================= */}

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
                {/* STATS */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >
                    <TrainingStat
                        label="Assigned"
                        value={
                            availableAssignments.length
                        }
                    />


                    <TrainingStat
                        label="Available"
                        value={
                            activeAssignments
                        }
                    />


                    <TrainingStat
                        label="Manual Handling"
                        value={
                            manualHandlingCount
                        }
                    />


                    <TrainingStat
                        label="Working at Height"
                        value={
                            workingAtHeightCount
                        }
                    />
                </section>


                {/* ================================================= */}
                {/* FILTER */}
                {/* ================================================= */}

                {availableAssignments.length >
                    0 && (
                        <section
                            className="
                            flex
                            flex-col
                            gap-3
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            shadow-sm
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
                                    Training Programmes
                                </h2>


                                <p
                                    className="
                                    mt-1
                                    text-[8px]
                                    text-slate-400
                                "
                                >
                                    Select a training area to filter your programmes.
                                </p>
                            </div>


                            <select
                                value={
                                    typeFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setTypeFilter(
                                        event.target.value
                                    )
                                }
                                className="
                                h-10
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-3
                                text-[9px]
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                sm:w-[220px]
                            "
                            >
                                <option value="all">
                                    All Training Areas
                                </option>

                                <option value="manual-handling">
                                    Manual Handling
                                </option>

                                <option value="working-at-height">
                                    Working at Height
                                </option>
                            </select>
                        </section>
                    )}


                {/* ================================================= */}
                {/* PROGRAMMES */}
                {/* ================================================= */}

                {availableAssignments.length ===
                    0 ? (
                    <EmptyState
                        title="No training has been assigned yet."
                        description="Your assigned training programmes will appear here."
                        icon="training"
                    />
                ) : filteredAssignments.length ===
                    0 ? (
                    <EmptyState
                        title="No programmes found."
                        description="There are no assigned programmes for this training area."
                        icon="training"
                    />
                ) : (
                    <section
                        className="
                            grid
                            gap-4
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >
                        {filteredAssignments.map(
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
                    </section>
                )}
            </div>
        </DashboardLayout>
    );
}


// ======================================================
// STAT
// ======================================================

function TrainingStat({
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


export default MyTrainingPage;