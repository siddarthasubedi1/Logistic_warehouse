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

    const availableAssignments =
        useMemo(() => {
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
        }, [
            assignments,
        ]);


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
                    assignment?.status !==
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

            <div className="space-y-5">

                {/* ================================================= */}
                {/* HERO */}
                {/* ================================================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-200
                        bg-gradient-to-r
                        from-[#073763]
                        via-[#0b4f87]
                        to-[#1769aa]
                        px-5
                        py-6
                        text-white
                        shadow-sm
                        sm:px-6
                        lg:px-7
                    "
                >

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-16
                            h-48
                            w-48
                            rounded-full
                            bg-white/10
                        "
                    />


                    <div
                        className="
                            pointer-events-none
                            absolute
                            right-24
                            top-5
                            hidden
                            h-28
                            w-28
                            rotate-12
                            rounded-2xl
                            border
                            border-white/10
                            lg:block
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            flex
                            flex-col
                            gap-5
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                gap-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-white/15
                                    bg-white/10
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-6 w-6"
                                >
                                    <path d="M4 5h7v14H4z" />

                                    <path d="M13 5h7v14h-7z" />

                                    <path d="M7 9h2" />

                                    <path d="M16 9h2" />

                                    <path d="M7 13h2" />

                                    <path d="M16 13h2" />
                                </svg>
                            </div>


                            <div>

                                <p
                                    className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.18em]
                                        text-blue-100
                                    "
                                >
                                    Workplace Safety Learning
                                </p>


                                <h1
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        sm:text-2xl
                                    "
                                >
                                    My Training
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-[11px]
                                        leading-5
                                        text-blue-100
                                        sm:text-xs
                                    "
                                >
                                    View your assigned safety training
                                    programmes and begin learning
                                    Manual Handling or Working at Height.
                                </p>

                            </div>

                        </div>


                        <div
                            className="
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            <span
                                className="
                                    rounded-full
                                    border
                                    border-white/15
                                    bg-white/10
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-semibold
                                "
                            >
                                Safety First
                            </span>


                            <span
                                className="
                                    rounded-full
                                    border
                                    border-white/15
                                    bg-white/10
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-semibold
                                "
                            >
                                Structured Learning
                            </span>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* STATS */}
                {/* ================================================= */}

                {!loading && (
                    <section
                        className="
                            grid
                            gap-3
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >

                        <TrainingStat
                            title="Assigned"
                            value={
                                availableAssignments.length
                            }
                            description="Training programmes"
                            type="assigned"
                        />


                        <TrainingStat
                            title="Available"
                            value={
                                activeAssignments
                            }
                            description="Ready to start"
                            type="available"
                        />


                        <TrainingStat
                            title="Manual Handling"
                            value={
                                manualHandlingCount
                            }
                            description="Assigned programmes"
                            type="manual"
                        />


                        <TrainingStat
                            title="Working at Height"
                            value={
                                workingAtHeightCount
                            }
                            description="Assigned programmes"
                            type="height"
                        />

                    </section>
                )}


                {/* ================================================= */}
                {/* ERROR */}
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
                {/* CONTENT HEADER */}
                {/* ================================================= */}

                {!loading &&
                    availableAssignments.length >
                    0 && (
                        <section
                            className="
                                rounded-2xl
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
                                            text-sm
                                            font-bold
                                            text-slate-900
                                        "
                                    >
                                        Assigned Training Programmes
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            leading-5
                                            text-slate-500
                                        "
                                    >
                                        Select an available programme
                                        below to open its learning
                                        content.
                                    </p>

                                </div>


                                <span
                                    className="
                                        w-fit
                                        rounded-full
                                        bg-blue-50
                                        px-3
                                        py-1.5
                                        text-[9px]
                                        font-semibold
                                        text-blue-700
                                    "
                                >
                                    {availableAssignments.length} Programme
                                    {availableAssignments.length ===
                                        1
                                        ? ""
                                        : "s"}
                                </span>

                            </div>

                        </section>
                    )}


                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

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
                    <div
                        className="
                            grid
                            gap-5
                            md:grid-cols-2
                            2xl:grid-cols-3
                        "
                    >

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


                {/* ================================================= */}
                {/* LEARNING NOTE */}
                {/* ================================================= */}

                {!loading &&
                    availableAssignments.length >
                    0 && (
                        <section
                            className="
                                rounded-2xl
                                border
                                border-emerald-100
                                bg-gradient-to-r
                                from-emerald-50
                                via-white
                                to-blue-50
                                p-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-white
                                        text-emerald-600
                                        shadow-sm
                                    "
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                    >
                                        <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                </div>


                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        Learn Safely
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            max-w-4xl
                                            text-[10px]
                                            leading-5
                                            text-slate-500
                                        "
                                    >
                                        Read each learning section
                                        carefully and use the Previous
                                        and Next controls to move through
                                        the programme in order.
                                    </p>

                                </div>

                            </div>

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
    title,
    value,
    description,
    type,
}) {
    const themes = {
        assigned:
            "bg-blue-50 text-blue-700",

        available:
            "bg-emerald-50 text-emerald-700",

        manual:
            "bg-indigo-50 text-indigo-700",

        height:
            "bg-amber-50 text-amber-700",
    };


    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <div
                    className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl

                        ${themes[type]}
                    `}
                >
                    <TrainingStatIcon
                        type={
                            type
                        }
                    />
                </div>


                <div>

                    <p
                        className="
                            text-xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {value}
                    </p>


                    <p
                        className="
                            text-[9px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        {title}
                    </p>

                </div>

            </div>


            <p
                className="
                    mt-3
                    text-[9px]
                    text-slate-500
                "
            >
                {description}
            </p>

        </div>
    );
}


// ======================================================
// STAT ICON
// ======================================================

function TrainingStatIcon({
    type,
}) {
    if (
        type ===
        "available"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />

                <path d="m8 12 2.5 2.5L16 9" />
            </svg>
        );
    }


    if (
        type ===
        "height"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <path d="M5 21V5" />

                <path d="M19 21V5" />

                <path d="M5 9h14" />

                <path d="M5 14h14" />

                <path d="M5 19h14" />
            </svg>
        );
    }


    if (
        type ===
        "manual"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <rect
                    x="3"
                    y="8"
                    width="18"
                    height="10"
                    rx="2"
                />

                <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />

                <path d="M8 13h8" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path d="M4 5h7v14H4z" />

            <path d="M13 5h7v14h-7z" />

            <path d="M7 9h2" />

            <path d="M16 9h2" />
        </svg>
    );
}


export default MyTrainingPage;