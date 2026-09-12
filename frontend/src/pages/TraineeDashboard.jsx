import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import ActionButton from "../components/ui/ActionButton";
import FeedbackAlert from "../components/ui/FeedbackAlert";
import LoadingCard from "../components/ui/LoadingCard";

import api from "../services/api";

import {
    formatProgrammeType,
    getApiErrorMessage,
    getAssignmentProgramme,
    parseArrayResponse,
} from "../utils/training";

import {
    getSessionUser,
} from "../utils/session";

function TraineeDashboard() {
    const navigate =
        useNavigate();


    const user =
        getSessionUser();


    // ======================================================
    // DATA
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


    // ======================================================
    // LOAD
    // ======================================================

    useEffect(() => {
        let active =
            true;


        const loadDashboard =
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


                    if (!active) {
                        return;
                    }


                    setAssignments(
                        parseArrayResponse(
                            response.data,
                            "assignments"
                        )
                    );

                } catch (error) {
                    console.error(
                        "Trainee dashboard error:",
                        error
                    );


                    if (active) {
                        setErrorMessage(
                            getApiErrorMessage(
                                error,
                                "Unable to load your training dashboard."
                            )
                        );
                    }

                } finally {
                    if (active) {
                        setLoading(
                            false
                        );
                    }
                }
            };


        loadDashboard();


        return () => {
            active =
                false;
        };
    }, []);


    // ======================================================
    // VALID ASSIGNMENTS
    // ======================================================

    const validAssignments =
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


    // ======================================================
    // ACTIVE
    // ======================================================

    const activeAssignments =
        useMemo(
            () =>
                validAssignments.filter(
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
                ),
            [
                validAssignments,
            ]
        );


    // ======================================================
    // COUNTS
    // ======================================================

    const manualHandlingCount =
        validAssignments.filter(
            (
                assignment
            ) =>
                getAssignmentProgramme(
                    assignment
                )?.programmeType ===
                "manual-handling"
        ).length;


    const workingAtHeightCount =
        validAssignments.filter(
            (
                assignment
            ) =>
                getAssignmentProgramme(
                    assignment
                )?.programmeType ===
                "working-at-height"
        ).length;


    // ======================================================
    // DISPLAY
    // ======================================================

    const recentAssignments =
        activeAssignments.slice(
            0,
            3
        );


    // ======================================================
    // START
    // ======================================================

    const handleStart = (
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

    if (loading) {
        return (
            <DashboardLayout
                role="trainee"
                title="Dashboard"
                subtitle="Your workplace safety training."
            >
                <LoadingCard
                    message="Loading your dashboard..."
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
            title="Dashboard"
            subtitle="Your workplace safety training."
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
                        setErrorMessage(
                            ""
                        )
                    }
                />


                {/* ================================================= */}
                {/* WELCOME */}
                {/* ================================================= */}

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
                            grid
                            gap-5
                            p-5
                            md:grid-cols-[1fr_auto]
                            md:items-center
                            lg:p-6
                        "
                    >
                        <div>
                            <span
                                className="
                                    inline-flex
                                    rounded-full
                                    bg-blue-50
                                    px-3
                                    py-1
                                    text-[7px]
                                    font-medium
                                    text-blue-600
                                "
                            >
                                WORKPLACE SAFETY
                            </span>


                            <h2
                                className="
                                    mt-3
                                    text-[18px]
                                    font-semibold
                                    text-slate-800
                                    sm:text-[20px]
                                "
                            >
                                Welcome
                                {user?.firstName
                                    ? `, ${user.firstName}`
                                    : ""}
                            </h2>


                            <p
                                className="
                                    mt-2
                                    max-w-xl
                                    text-[9px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                Access your assigned safety training and continue learning from your available programmes.
                            </p>


                            <div
                                className="
                                    mt-4
                                "
                            >
                                <ActionButton
                                    variant="primary"
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
                                    View My Training
                                </ActionButton>
                            </div>
                        </div>


                        <div
                            className="
                                hidden
                                h-20
                                w-20
                                items-center
                                justify-center
                                rounded-2xl
                                bg-blue-50
                                text-blue-600
                                md:flex
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="h-9 w-9"
                            >
                                <path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
                                <path d="m8.5 12 2 2 5-5" />
                            </svg>
                        </div>
                    </div>
                </section>


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
                    <TraineeStat
                        label="Assigned Training"
                        value={
                            validAssignments.length
                        }
                    />


                    <TraineeStat
                        label="Available"
                        value={
                            activeAssignments.length
                        }
                    />


                    <TraineeStat
                        label="Manual Handling"
                        value={
                            manualHandlingCount
                        }
                    />


                    <TraineeStat
                        label="Working at Height"
                        value={
                            workingAtHeightCount
                        }
                    />
                </section>


                {/* ================================================= */}
                {/* TRAINING */}
                {/* ================================================= */}

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
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                My Training
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    text-slate-400
                                "
                            >
                                Your available workplace safety programmes.
                            </p>
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
                            View All
                        </ActionButton>
                    </div>


                    {recentAssignments.length ===
                        0 ? (
                        <div
                            className="
                                p-7
                                text-center
                            "
                        >
                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-slate-100
                                    text-slate-400
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-5 w-5"
                                >
                                    <path d="M4 5h16v14H4z" />
                                    <path d="M8 9h8" />
                                    <path d="M8 13h5" />
                                </svg>
                            </div>


                            <p
                                className="
                                    mt-3
                                    text-[10px]
                                    font-medium
                                    text-slate-600
                                "
                            >
                                No training available
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    text-slate-400
                                "
                            >
                                Assigned training programmes will appear here.
                            </p>
                        </div>
                    ) : (
                        <div
                            className="
                                grid
                                gap-3
                                p-4
                                md:grid-cols-2
                                xl:grid-cols-3
                                sm:p-5
                            "
                        >
                            {recentAssignments.map(
                                (
                                    assignment
                                ) => {
                                    const programme =
                                        getAssignmentProgramme(
                                            assignment
                                        );


                                    return (
                                        <article
                                            key={
                                                assignment._id
                                            }
                                            className="
                                                flex
                                                flex-col
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-slate-50
                                                p-4
                                            "
                                        >
                                            <span
                                                className="
                                                    w-fit
                                                    rounded-full
                                                    bg-blue-50
                                                    px-2.5
                                                    py-1
                                                    text-[7px]
                                                    font-medium
                                                    text-blue-600
                                                "
                                            >
                                                {formatProgrammeType(
                                                    programme?.programmeType
                                                )}
                                            </span>


                                            <h3
                                                className="
                                                    mt-3
                                                    text-[11px]
                                                    font-semibold
                                                    leading-5
                                                    text-slate-700
                                                "
                                            >
                                                {
                                                    programme?.title
                                                }
                                            </h3>


                                            {programme?.description && (
                                                <p
                                                    className="
                                                        mt-2
                                                        line-clamp-2
                                                        text-[8px]
                                                        leading-4
                                                        text-slate-400
                                                    "
                                                >
                                                    {
                                                        programme.description
                                                    }
                                                </p>
                                            )}


                                            <div
                                                className="
                                                    mt-auto
                                                    pt-4
                                                "
                                            >
                                                <ActionButton
                                                    variant="primary"
                                                    onClick={() =>
                                                        handleStart(
                                                            assignment
                                                        )
                                                    }
                                                    className="
                                                        w-full
                                                        justify-center
                                                    "
                                                >
                                                    Start Learning
                                                </ActionButton>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}


// ======================================================
// STAT
// ======================================================

function TraineeStat({
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


export default TraineeDashboard;