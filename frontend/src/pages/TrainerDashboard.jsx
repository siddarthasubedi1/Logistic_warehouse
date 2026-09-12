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
import StatusBadge from "../components/ui/StatusBadge";

import api from "../services/api";

import {
    formatProgrammeType,
    getApiErrorMessage,
    parseArrayResponse,
} from "../utils/training";

import {
    getSessionUser,
} from "../utils/session";

function TrainerDashboard() {
    const navigate =
        useNavigate();


    const user =
        getSessionUser();


    // ======================================================
    // DATA
    // ======================================================

    const [
        programmes,
        setProgrammes,
    ] = useState([]);


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


                    const results =
                        await Promise.allSettled([
                            api.get(
                                "/training-programmes"
                            ),

                            api.get(
                                "/training-assignments"
                            ),
                        ]);


                    if (!active) {
                        return;
                    }


                    const programmeResult =
                        results[0];


                    const assignmentResult =
                        results[1];


                    if (
                        programmeResult.status ===
                        "fulfilled"
                    ) {
                        setProgrammes(
                            parseArrayResponse(
                                programmeResult.value.data,
                                "programmes"
                            )
                        );
                    }


                    if (
                        assignmentResult.status ===
                        "fulfilled"
                    ) {
                        setAssignments(
                            parseArrayResponse(
                                assignmentResult.value.data,
                                "assignments"
                            )
                        );
                    }


                    if (
                        programmeResult.status ===
                        "rejected" &&
                        assignmentResult.status ===
                        "rejected"
                    ) {
                        throw (
                            programmeResult.reason
                        );
                    }

                } catch (error) {
                    console.error(
                        "Trainer dashboard error:",
                        error
                    );


                    if (active) {
                        setErrorMessage(
                            getApiErrorMessage(
                                error,
                                "Unable to load Trainer dashboard data."
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
    // ASSIGNED TRAINING AREAS
    // ======================================================

    const assignedTrainingSections =
        Array.isArray(
            user?.assignedTrainingSections
        )
            ? user.assignedTrainingSections
            : [];


    // ======================================================
    // COUNTS
    // ======================================================

    const activeProgrammes =
        programmes.filter(
            (
                programme
            ) =>
                programme.status ===
                "active"
        );


    const activeAssignments =
        assignments.filter(
            (
                assignment
            ) =>
                assignment.status !==
                "inactive"
        );


    // ======================================================
    // DISPLAY PROGRAMMES
    // ======================================================

    const displayedProgrammes =
        useMemo(
            () =>
                programmes.slice(
                    0,
                    4
                ),
            [
                programmes,
            ]
        );


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <DashboardLayout
                role="trainer"
                title="Trainer Dashboard"
                subtitle="Manage your workplace safety training."
            >
                <LoadingCard
                    message="Loading Trainer dashboard..."
                />
            </DashboardLayout>
        );
    }


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <DashboardLayout
            role="trainer"
            title="Trainer Dashboard"
            subtitle="Manage your workplace safety training."
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
                                TRAINER
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
                                Manage training programmes and learning content for your assigned workplace safety area.
                            </p>


                            {assignedTrainingSections.length >
                                0 && (
                                    <div
                                        className="
                                        mt-4
                                        flex
                                        flex-wrap
                                        gap-2
                                    "
                                    >
                                        {assignedTrainingSections.map(
                                            (
                                                section
                                            ) => (
                                                <span
                                                    key={
                                                        section
                                                    }
                                                    className="
                                                    rounded-full
                                                    bg-slate-100
                                                    px-3
                                                    py-1.5
                                                    text-[8px]
                                                    font-medium
                                                    text-slate-600
                                                "
                                                >
                                                    {formatProgrammeType(
                                                        section
                                                    )}
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}
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
                                <path d="M4 5h16v14H4z" />
                                <path d="M8 9h8" />
                                <path d="M8 13h5" />
                                <path d="M17 15v5" />
                                <path d="M14.5 17.5h5" />
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
                    <DashboardStat
                        label="Programmes"
                        value={
                            programmes.length
                        }
                        icon="programme"
                    />


                    <DashboardStat
                        label="Active Programmes"
                        value={
                            activeProgrammes.length
                        }
                        icon="active"
                    />


                    <DashboardStat
                        label="Training Assignments"
                        value={
                            assignments.length
                        }
                        icon="assignment"
                    />


                    <DashboardStat
                        label="Active Assignments"
                        value={
                            activeAssignments.length
                        }
                        icon="users"
                    />
                </section>


                {/* ================================================= */}
                {/* QUICK ACTIONS */}
                {/* ================================================= */}

                <section
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        shadow-sm
                        sm:p-5
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
                            Quick Actions
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                text-slate-400
                            "
                        >
                            Open your main training management areas.
                        </p>
                    </div>


                    <div
                        className="
                            mt-4
                            grid
                            gap-3
                            sm:grid-cols-2
                        "
                    >
                        <QuickAction
                            title="Training Programmes"
                            description="Create and manage your training programmes."
                            onClick={() =>
                                navigate(
                                    "/training-programmes"
                                )
                            }
                        />


                        <QuickAction
                            title="Training Assignments"
                            description="View training access and assigned Trainees."
                            onClick={() =>
                                navigate(
                                    "/training-assignments"
                                )
                            }
                        />
                    </div>
                </section>


                {/* ================================================= */}
                {/* PROGRAMMES */}
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
                                Training Programmes
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    text-slate-400
                                "
                            >
                                Recently available programmes.
                            </p>
                        </div>


                        <ActionButton
                            variant="secondary"
                            onClick={() =>
                                navigate(
                                    "/training-programmes"
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


                    {displayedProgrammes.length ===
                        0 ? (
                        <div
                            className="
                                p-6
                                text-center
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    text-slate-400
                                "
                            >
                                No training programmes available.
                            </p>
                        </div>
                    ) : (
                        <div
                            className="
                                divide-y
                                divide-slate-100
                            "
                        >
                            {displayedProgrammes.map(
                                (
                                    programme
                                ) => (
                                    <div
                                        key={
                                            programme._id
                                        }
                                        className="
                                            flex
                                            flex-col
                                            gap-3
                                            px-4
                                            py-4
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                            sm:px-5
                                        "
                                    >
                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >
                                            <p
                                                className="
                                                    truncate
                                                    text-[10px]
                                                    font-medium
                                                    text-slate-700
                                                "
                                            >
                                                {
                                                    programme.title
                                                }
                                            </p>


                                            <div
                                                className="
                                                    mt-2
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-2
                                                "
                                            >
                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-blue-50
                                                        px-2.5
                                                        py-1
                                                        text-[7px]
                                                        text-blue-600
                                                    "
                                                >
                                                    {formatProgrammeType(
                                                        programme.programmeType
                                                    )}
                                                </span>


                                                <StatusBadge
                                                    status={
                                                        programme.status
                                                    }
                                                />
                                            </div>
                                        </div>


                                        <ActionButton
                                            variant="secondary"
                                            onClick={() =>
                                                navigate(
                                                    `/training-programmes/${programme._id}/sections`
                                                )
                                            }
                                            className="
                                                w-full
                                                justify-center
                                                sm:w-auto
                                            "
                                        >
                                            Learning Sections
                                        </ActionButton>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}


// ======================================================
// DASHBOARD STAT
// ======================================================

function DashboardStat({
    label,
    value,
    icon,
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
            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                <div>
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
                </div>


                <div
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-50
                        text-blue-600
                    "
                >
                    <StatIcon
                        type={
                            icon
                        }
                    />
                </div>
            </div>
        </article>
    );
}


// ======================================================
// QUICK ACTION
// ======================================================

function QuickAction({
    title,
    description,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className="
                group
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-4
                text-left
                transition
                hover:border-blue-200
                hover:bg-blue-50
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                <div>
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            text-slate-700
                            group-hover:text-blue-700
                        "
                    >
                        {title}
                    </p>


                    <p
                        className="
                            mt-1
                            text-[8px]
                            leading-4
                            text-slate-400
                        "
                    >
                        {description}
                    </p>
                </div>


                <span
                    className="
                        text-blue-500
                    "
                >
                    →
                </span>
            </div>
        </button>
    );
}


// ======================================================
// ICON
// ======================================================

function StatIcon({
    type,
}) {
    if (
        type ===
        "users"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
            >
                <circle
                    cx="9"
                    cy="8"
                    r="3"
                />

                <path d="M3 19c.5-4 2.5-6 6-6s5.5 2 6 6" />

                <path d="M16 6a3 3 0 0 1 0 6" />

                <path d="M17 14c2.5.5 3.5 2 4 5" />
            </svg>
        );
    }


    if (
        type ===
        "assignment"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
            >
                <path d="M6 4h12v16H6z" />
                <path d="M9 8h6" />
                <path d="M9 12h6" />
                <path d="M9 16h4" />
            </svg>
        );
    }


    if (
        type ===
        "active"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
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


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-4 w-4"
        >
            <path d="M4 5h7v14H4z" />
            <path d="M13 5h7v14h-7z" />
        </svg>
    );
}


export default TrainerDashboard;