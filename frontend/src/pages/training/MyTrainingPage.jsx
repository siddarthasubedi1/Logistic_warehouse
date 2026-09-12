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


function MyTrainingPage() {
    const navigate =
        useNavigate();


    const [
        assignments,
        setAssignments,
    ] = useState([]);

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


    const loadTraining =
        useCallback(
            async () => {
                try {
                    setLoading(true);
                    setErrorMessage("");

                    const response =
                        await api.get(
                            "/my-training"
                        );

                    setAssignments(
                        parseArrayResponse(
                            response.data,
                            "assignments"
                        )
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
            },
            []
        );


    useEffect(() => {
        loadTraining();
    }, [
        loadTraining,
    ]);


    const availableAssignments =
        useMemo(
            () =>
                assignments.filter(
                    (
                        assignment
                    ) =>
                        Boolean(
                            getAssignmentProgramme(
                                assignment
                            )
                        )
                ),
            [
                assignments,
            ]
        );


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


    if (loading) {
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
                            sm:p-5
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
                                    Training Programmes
                                </h2>

                                <p
                                    className="
                                    mt-1
                                    text-[8px]
                                    font-medium
                                    text-slate-500
                                "
                                >
                                    Filter your assigned safety training.
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
                                font-medium
                                text-slate-800
                                outline-none
                                focus:border-blue-500
                                sm:w-[220px]
                            "
                            >
                                <option value="all">
                                    All Training
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


                {filteredAssignments.length ===
                    0 ? (
                    <section
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                        "
                    >
                        <EmptyState
                            title="No assigned training found."
                            description="There are no programmes matching the current filter."
                            icon="training"
                        />
                    </section>
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


export default MyTrainingPage;