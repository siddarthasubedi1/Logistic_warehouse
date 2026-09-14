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


    /* =====================================================
       LOAD ASSIGNED TRAINING
    ===================================================== */

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


                    setAssignments(
                        parseArrayResponse(
                            response.data,
                            "assignments"
                        )
                    );

                } catch (
                error
                ) {
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


    useEffect(
        () => {
            loadTraining();
        },
        [
            loadTraining,
        ]
    );


    /* =====================================================
       VALID ASSIGNMENTS
    ===================================================== */

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


    /* =====================================================
       FILTER
    ===================================================== */

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
                    ) => {
                        const programme =
                            getAssignmentProgramme(
                                assignment
                            );


                        return (
                            programme
                                ?.programmeType ===
                            typeFilter
                        );
                    }
                );
            },
            [
                availableAssignments,
                typeFilter,
            ]
        );


    /* =====================================================
       OPEN TRAINING
    ===================================================== */

    const handleStartTraining =
        (
            assignment
        ) => {
            const programme =
                getAssignmentProgramme(
                    assignment
                );


            if (
                !programme?._id
            ) {
                setErrorMessage(
                    "Training programme information is missing."
                );

                return;
            }


            navigate(
                `/my-training/${programme._id}`
            );
        };


    /* =====================================================
       LOADING
    ===================================================== */

    if (
        loading
    ) {
        return (
            <DashboardLayout
                role="trainee"
                title="My Training"
                subtitle="View workplace safety programmes assigned to your account."
            >
                <div
                    className="
                        app-page
                    "
                >
                    <LoadingCard
                        message="Loading your training..."
                    />
                </div>
            </DashboardLayout>
        );
    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <DashboardLayout
            role="trainee"
            title="My Training"
            subtitle="View workplace safety programmes assigned to your account."
        >
            <div
                className="
                    app-page
                    space-y-5
                "
            >
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


                {/* ==========================================
                    SUMMARY
                =========================================== */}

                <section
                    className="
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        p-5
                        shadow-sm
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-[13px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                Assigned Programmes
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-[#64748b]
                                "
                            >
                                Complete the programmes assigned by your administrator.
                            </p>
                        </div>


                        <span
                            className="
                                self-start
                                rounded-full
                                bg-blue-50
                                px-3
                                py-1.5
                                text-[9px]
                                font-semibold
                                text-blue-600
                                sm:self-auto
                            "
                        >
                            {
                                availableAssignments.length
                            }{" "}
                            Assigned
                        </span>
                    </div>
                </section>


                {/* ==========================================
                    FILTERS
                =========================================== */}

                <section
                    className="
                        flex
                        flex-wrap
                        gap-2
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        p-4
                        shadow-sm
                    "
                >
                    <FilterButton
                        active={
                            typeFilter ===
                            "all"
                        }
                        onClick={() =>
                            setTypeFilter(
                                "all"
                            )
                        }
                    >
                        All Training
                    </FilterButton>


                    <FilterButton
                        active={
                            typeFilter ===
                            "manual-handling"
                        }
                        onClick={() =>
                            setTypeFilter(
                                "manual-handling"
                            )
                        }
                    >
                        Manual Handling
                    </FilterButton>


                    <FilterButton
                        active={
                            typeFilter ===
                            "working-at-height"
                        }
                        onClick={() =>
                            setTypeFilter(
                                "working-at-height"
                            )
                        }
                    >
                        Working at Height
                    </FilterButton>
                </section>


                {/* ==========================================
                    ASSIGNED PROGRAMMES
                =========================================== */}

                {filteredAssignments.length ===
                    0 ? (
                    <EmptyState
                        title="No training programmes found"
                        message="There are no assigned programmes matching this filter."
                    />

                ) : (
                    <section
                        className="
                            grid
                            gap-4
                            md:grid-cols-2
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
                                        handleStartTraining
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


/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({
    active,
    onClick,
    children,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className={`
                min-h-[36px]
                rounded-lg
                border
                px-4
                text-[9px]
                font-semibold
                transition

                ${active
                    ? "border-[#1769e8] bg-[#1769e8] text-white"
                    : "border-[#cbd5e1] bg-white text-[#52627a] hover:bg-[#f8fafc]"
                }
            `}
        >
            {children}
        </button>
    );
}


export default MyTrainingPage;