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


                // ===========================================
                // USER
                // ===========================================

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


                sessionStorage.setItem(
                    "user",
                    JSON.stringify(
                        currentUser
                    )
                );


                // ===========================================
                // TRAINING
                // ===========================================

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
                (
                    assignment
                ) => {
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
                (
                    assignment
                ) =>
                    getAssignmentProgramme(
                        assignment
                    )?.programmeType ===
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
                (
                    assignment
                ) =>
                    getAssignmentProgramme(
                        assignment
                    )?.programmeType ===
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
    // DISPLAY NAME
    // ======================================================

    const fullName =
        [
            user?.firstName,
            user?.lastName,
        ]
            .filter(Boolean)
            .join(" ") ||
        "Trainee";


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <DashboardLayout
                role="trainee"
                showHeader={false}
            >

                <div className="space-y-5">

                    <div
                        className="
                            rounded-2xl
                            border
                            border-blue-100
                            bg-gradient-to-r
                            from-[#073763]
                            via-[#0b4f87]
                            to-[#1769aa]
                            p-6
                            text-white
                        "
                    >

                        <p
                            className="
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.18em]
                                text-blue-100
                            "
                        >
                            Workplace Safety Training
                        </p>


                        <h1
                            className="
                                mt-2
                                text-xl
                                font-bold
                            "
                        >
                            Loading Trainee Dashboard
                        </h1>

                    </div>


                    <LoadingCard
                        message="Loading Trainee Dashboard..."
                    />

                </div>

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

            <div className="space-y-5">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <TraineeHeader
                    user={
                        user
                    }
                />


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
                {/* ACCOUNT OVERVIEW */}
                {/* ================================================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                        sm:p-6
                    "
                >

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-16
                            h-44
                            w-44
                            rounded-full
                            bg-blue-50
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
                                    rounded-2xl
                                    bg-blue-50
                                    text-blue-700
                                "
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-6 w-6"
                                >
                                    <circle
                                        cx="12"
                                        cy="8"
                                        r="3"
                                    />

                                    <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />

                                    <path d="M18 4v5" />

                                    <path d="M15.5 6.5h5" />
                                </svg>

                            </div>


                            <div>

                                <p
                                    className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-blue-600
                                    "
                                >
                                    Trainee Account
                                </p>


                                <h2
                                    className="
                                        mt-1
                                        break-words
                                        text-lg
                                        font-bold
                                        text-slate-900
                                        sm:text-xl
                                    "
                                >
                                    {fullName}
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-[10px]
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
                                    text-[9px]
                                    font-semibold
                                    capitalize
                                    text-blue-700
                                "
                            >
                                {user?.role ||
                                    "trainee"}
                            </span>


                            <span
                                className={`
                                    rounded-full
                                    px-3
                                    py-1.5
                                    text-[9px]
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
                                    "unknown"}
                            </span>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* DASHBOARD STATS */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-4
                        sm:grid-cols-2
                        xl:grid-cols-3
                    "
                >

                    <DashboardStat
                        title="Assigned Programmes"
                        value={
                            availableAssignments.length
                        }
                        description="Active programmes currently assigned to you."
                        type="assigned"
                    />


                    <DashboardStat
                        title="Manual Handling"
                        value={
                            manualHandlingCount
                        }
                        description="Available Manual Handling programmes."
                        type="manual"
                    />


                    <DashboardStat
                        title="Working at Height"
                        value={
                            workingAtHeightCount
                        }
                        description="Available Working at Height programmes."
                        type="height"
                    />

                </section>


                {/* ================================================= */}
                {/* TRAINING TITLE */}
                {/* ================================================= */}

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
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
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
                                    bg-blue-50
                                    text-blue-600
                                "
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                >
                                    <path d="M4 5h7v14H4z" />

                                    <path d="M13 5h7v14h-7z" />
                                </svg>

                            </div>


                            <div>

                                <h2
                                    className="
                                        text-sm
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    My Training
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-[10px]
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    Training programmes assigned to you
                                    by the Administrator.
                                </p>

                            </div>

                        </div>


                        <ActionButton
                            variant="secondary"
                            onClick={() =>
                                navigate(
                                    "/my-training"
                                )
                            }
                            className="
                                w-full
                                justify-center
                                sm:w-auto
                            "
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
                    <section
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                        "
                    >
                        <EmptyState
                            title="No training assigned."
                            description="You do not currently have any active training programmes. Please contact the Administrator."
                        />
                    </section>
                ) : (
                    <div
                        className="
                            grid
                            gap-5
                            md:grid-cols-2
                            2xl:grid-cols-3
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
                {/* LEARNING ACCESS INFO */}
                {/* ================================================= */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-blue-100
                        bg-gradient-to-r
                        from-blue-50
                        via-white
                        to-emerald-50
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
                                text-blue-600
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

                            <h3
                                className="
                                    text-xs
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Sprint 2 Learning Access
                            </h3>


                            <p
                                className="
                                    mt-1
                                    max-w-4xl
                                    text-[10px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                You can open programmes assigned to your
                                Trainee account and move through their
                                active learning sections. Quiz scoring,
                                panoramic scenarios, badges and richer
                                progress features are handled in later
                                project sprints.
                            </p>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* FOOTER */}
                {/* ================================================= */}

                <footer
                    className="
                        flex
                        flex-col
                        gap-2
                        border-t
                        border-slate-200
                        pt-4
                        text-[9px]
                        text-slate-400
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <span>
                        © 2026 UK LogiWare. All rights reserved.
                    </span>


                    <span>
                        Version 1.0.0
                    </span>

                </footer>

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
    type,
}) {
    const styles = {
        assigned: {
            icon:
                "bg-blue-50 text-blue-700",

            accent:
                "bg-blue-500",
        },

        manual: {
            icon:
                "bg-indigo-50 text-indigo-700",

            accent:
                "bg-indigo-500",
        },

        height: {
            icon:
                "bg-amber-50 text-amber-700",

            accent:
                "bg-amber-500",
        },
    };


    const current =
        styles[type] ||
        styles.assigned;


    return (
        <article
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
            "
        >

            <div
                className={`
                    absolute
                    left-0
                    top-0
                    h-full
                    w-1

                    ${current.accent}
                `}
            />


            <div
                className="
                    flex
                    items-start
                    justify-between
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

                        ${current.icon}
                    `}
                >
                    <DashboardStatIcon
                        type={
                            type
                        }
                    />
                </div>


                <span
                    className="
                        text-3xl
                        font-bold
                        text-slate-900
                    "
                >
                    {value}
                </span>

            </div>


            <h3
                className="
                    mt-4
                    text-[10px]
                    font-bold
                    text-slate-800
                "
            >
                {title}
            </h3>


            <p
                className="
                    mt-1
                    text-[9px]
                    leading-5
                    text-slate-500
                "
            >
                {description}
            </p>

        </article>
    );
}


// ======================================================
// STAT ICON
// ======================================================

function DashboardStatIcon({
    type,
}) {
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
        </svg>
    );
}


export default TraineeDashboard;