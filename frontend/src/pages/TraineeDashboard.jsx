import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import TraineeHeader from "../components/trainee/TraineeHeader";

import AssignedProgrammeCard from "../components/training/AssignedProgrammeCard";

import ActionButton from "../components/ui/ActionButton";
import EmptyState from "../components/ui/EmptyState";
import FeedbackAlert from "../components/ui/FeedbackAlert";
import LoadingCard from "../components/ui/LoadingCard";

import api from "../services/api";

import {
    getApiErrorMessage,
    getAssignmentProgramme,
    parseArrayResponse,
} from "../utils/training";


// ======================================================
// TRAINEE DASHBOARD
// ======================================================
//
// Sprint 2 trainee dashboard.
//
// IMPORTANT:
//
// The old dashboard used:
//
// assignedTrainingSections
//
// and:
//
// /users/me/training-progress
//
// Those belong to the older broad-module flow.
//
// Sprint 2 uses specific programme assignments:
//
// /api/my-training
//
// ======================================================

function TraineeDashboard() {
    const navigate =
        useNavigate();


    // ======================================================
    // USER
    // ======================================================

    const [
        user,
        setUser,
    ] = useState(null);


    // ======================================================
    // TRAINING ASSIGNMENTS
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
    // LOAD DASHBOARD
    // ======================================================

    const loadDashboard =
        useCallback(async () => {
            try {
                setLoading(
                    true
                );


                setErrorMessage(
                    ""
                );


                // ------------------------------------------
                // Load profile and assigned programmes
                // together.
                // ------------------------------------------

                const [
                    userResponse,
                    trainingResponse,
                ] = await Promise.all([
                    api.get(
                        "/users/me"
                    ),

                    api.get(
                        "/my-training"
                    ),
                ]);


                // ------------------------------------------
                // USER
                // ------------------------------------------

                const currentUser =
                    userResponse.data
                        ?.user ||
                    userResponse.data ||
                    null;


                if (
                    !currentUser
                ) {
                    throw new Error(
                        "Unable to load Trainee information."
                    );
                }


                if (
                    currentUser.role !==
                    "trainee"
                ) {
                    throw new Error(
                        "This account is not authorised to access the Trainee Dashboard."
                    );
                }


                setUser(
                    currentUser
                );


                // Keep the current user session fresh.
                sessionStorage.setItem(
                    "user",
                    JSON.stringify(
                        currentUser
                    )
                );


                // ------------------------------------------
                // TRAINING
                // ------------------------------------------

                const assignmentList =
                    parseArrayResponse(
                        trainingResponse.data,
                        "assignments"
                    );


                setAssignments(
                    assignmentList
                );

            } catch (error) {
                console.error(
                    "Trainee dashboard error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to load Trainee Dashboard."
                    )
                );

            } finally {
                setLoading(
                    false
                );
            }
        }, []);


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        loadDashboard();
    }, [
        loadDashboard,
    ]);


    // ======================================================
    // AVAILABLE TRAINING
    // ======================================================

    const availableAssignments =
        useMemo(() => {
            return assignments.filter(
                (assignment) => {
                    const programme =
                        getAssignmentProgramme(
                            assignment
                        );


                    if (!programme) {
                        return false;
                    }


                    return (
                        assignment.status ===
                        "active" &&
                        programme.status ===
                        "active"
                    );
                }
            );
        }, [
            assignments,
        ]);


    // ======================================================
    // MANUAL HANDLING COUNT
    // ======================================================

    const manualHandlingCount =
        useMemo(() => {
            return availableAssignments.filter(
                (assignment) =>
                    getAssignmentProgramme(
                        assignment
                    )
                        ?.programmeType ===
                    "manual-handling"
            ).length;
        }, [
            availableAssignments,
        ]);


    // ======================================================
    // WORKING AT HEIGHT COUNT
    // ======================================================

    const workingAtHeightCount =
        useMemo(() => {
            return availableAssignments.filter(
                (assignment) =>
                    getAssignmentProgramme(
                        assignment
                    )
                        ?.programmeType ===
                    "working-at-height"
            ).length;
        }, [
            availableAssignments,
        ]);


    // ======================================================
    // START LEARNING
    // ======================================================

    const handleStartLearning = (
        programme
    ) => {
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

    if (loading) {
        return (
            <DashboardLayout
                role="trainee"
                showHeader={false}
            >
                <LoadingCard
                    message="Loading Trainee Dashboard..."
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
            showHeader={false}
        >
            <div className="min-h-screen bg-[#f6f8fb]">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <TraineeHeader
                    user={
                        user
                    }
                />


                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                <main
                    className="
                        space-y-6
                        px-5
                        py-5
                        lg:px-6
                    "
                >

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
                    {/* ACCOUNT CARD */}
                    {/* ================================================= */}

                    <section
                        className="
                            rounded-xl
                            border
                            border-slate-200
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

                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-blue-600
                                    "
                                >
                                    Trainee Account
                                </p>


                                <h1
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    {user?.firstName}{" "}
                                    {user?.lastName}
                                </h1>


                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    Username:{" "}

                                    <span
                                        className="
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        {user?.username ||
                                            "—"}
                                    </span>
                                </p>

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
                                        bg-blue-50
                                        px-3
                                        py-1.5
                                        text-[10px]
                                        font-semibold
                                        capitalize
                                        text-blue-700
                                    "
                                >
                                    {user?.role}
                                </span>


                                <span
                                    className={`
                                        rounded-full
                                        px-3
                                        py-1.5
                                        text-[10px]
                                        font-semibold
                                        capitalize

                                        ${user?.status ===
                                            "active"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-red-50 text-red-600"
                                        }
                                    `}
                                >
                                    {user?.status ||
                                        "Unknown"}
                                </span>

                            </div>

                        </div>
                    </section>


                    {/* ================================================= */}
                    {/* DASHBOARD STATISTICS */}
                    {/* ================================================= */}

                    <section
                        className="
                            grid
                            gap-4
                            md:grid-cols-3
                        "
                    >

                        <DashboardStat
                            title="Assigned Programmes"
                            value={
                                availableAssignments.length
                            }
                            description="Active programmes currently assigned to you."
                        />


                        <DashboardStat
                            title="Manual Handling"
                            value={
                                manualHandlingCount
                            }
                            description="Available Manual Handling programmes."
                        />


                        <DashboardStat
                            title="Working at Height"
                            value={
                                workingAtHeightCount
                            }
                            description="Available Working at Height programmes."
                        />

                    </section>


                    {/* ================================================= */}
                    {/* MY TRAINING HEADER */}
                    {/* ================================================= */}

                    <section
                        className="
                            rounded-xl
                            border
                            border-slate-200
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
                                        text-base
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    My Training
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    Training programmes assigned to
                                    you by the Administrator.
                                </p>

                            </div>


                            <ActionButton
                                variant="secondary"
                                onClick={() =>
                                    navigate(
                                        "/my-training"
                                    )
                                }
                            >
                                View All Training
                            </ActionButton>

                        </div>

                    </section>


                    {/* ================================================= */}
                    {/* TRAINING PROGRAMMES */}
                    {/* ================================================= */}

                    {availableAssignments.length ===
                        0 ? (
                        <EmptyState
                            title="No training assigned."
                            description="You do not currently have any active training programmes. Please contact the Administrator."
                        />
                    ) : (
                        <div
                            className="
                                grid
                                gap-5
                                md:grid-cols-2
                                xl:grid-cols-3
                            "
                        >

                            {availableAssignments
                                .slice(
                                    0,
                                    6
                                )
                                .map(
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
                    {/* SPRINT 2 NOTICE */}
                    {/* ================================================= */}

                    <section
                        className="
                            rounded-xl
                            border
                            border-blue-100
                            bg-blue-50
                            p-5
                        "
                    >
                        <h3
                            className="
                                text-sm
                                font-bold
                                text-blue-900
                            "
                        >
                            Sprint 2 Learning Access
                        </h3>


                        <p
                            className="
                                mt-2
                                max-w-3xl
                                text-xs
                                leading-5
                                text-blue-700
                            "
                        >
                            You can open assigned programmes and move
                            through their active learning sections.
                            Quiz scoring, scenarios, badges, and detailed
                            progress tracking belong to later project
                            sprints.
                        </p>
                    </section>


                    {/* ================================================= */}
                    {/* FOOTER */}
                    {/* ================================================= */}

                    <footer
                        className="
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-2
                            border-t
                            border-slate-200
                            pt-4
                            text-[9px]
                            text-slate-400
                        "
                    >
                        <span>
                            © 2026 UK LogiWare. All rights reserved.
                        </span>

                        <span>
                            Version 1.0.0
                        </span>
                    </footer>

                </main>

            </div>
        </DashboardLayout>
    );
}


// ======================================================
// DASHBOARD STAT
// ======================================================

function DashboardStat({
    title,
    value,
    description,
}) {
    return (
        <article
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
            "
        >
            <p
                className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-400
                "
            >
                {title}
            </p>


            <p
                className="
                    mt-2
                    text-3xl
                    font-bold
                    text-slate-900
                "
            >
                {value}
            </p>


            <p
                className="
                    mt-2
                    text-xs
                    leading-5
                    text-slate-500
                "
            >
                {description}
            </p>
        </article>
    );
}


export default TraineeDashboard;