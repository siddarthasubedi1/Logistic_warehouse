import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import TrainerHeader from "../components/trainer/TrainerHeader";

import LoadingCard from "../components/ui/LoadingCard";
import FeedbackAlert from "../components/ui/FeedbackAlert";

import api from "../services/api";

import boxLift from "../images/box-lift.jpg";
import heightImage from "../images/hight.jpg";

import {
    getSessionUser,
    updateSessionUser,
} from "../utils/session";

import {
    getApiErrorMessage,
    parseArrayResponse,
} from "../utils/training";


/* =========================================================
   TRAINING AREA CONFIGURATION
========================================================= */

const TRAINING_AREAS = {
    "manual-handling": {
        title:
            "Manual Handling",

        description:
            "Safe techniques for lifting, carrying, and moving loads in the workplace.",

        image:
            boxLift,
    },

    "working-at-height": {
        title:
            "Working at Height",

        description:
            "Safe working practices for elevated work and fall prevention.",

        image:
            heightImage,
    },
};


/* =========================================================
   NORMALISE TRAINING SECTION
========================================================= */

function normalizeTrainingSection(
    value
) {
    return String(
        value || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /_/g,
            "-"
        )
        .replace(
            /\s+/g,
            "-"
        );
}


/* =========================================================
   TRAINER DASHBOARD
========================================================= */

function TrainerDashboard() {
    const navigate =
        useNavigate();


    const [
        user,
        setUser,
    ] = useState(
        () =>
            getSessionUser()
    );


    const [
        programmes,
        setProgrammes,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    /* =====================================================
       LOAD DASHBOARD DATA
    ===================================================== */

    useEffect(() => {
        let mounted =
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


                    const [
                        profileResult,
                        programmeResult,
                    ] =
                        await Promise.allSettled([
                            api.get(
                                "/users/me"
                            ),

                            api.get(
                                "/training-programmes"
                            ),
                        ]);


                    if (
                        !mounted
                    ) {
                        return;
                    }


                    /* =========================================
                       USER PROFILE
                    ========================================== */

                    if (
                        profileResult.status ===
                        "fulfilled"
                    ) {
                        const currentUser =
                            profileResult.value
                                .data
                                ?.user ||
                            null;


                        if (
                            currentUser
                        ) {
                            setUser(
                                currentUser
                            );


                            updateSessionUser(
                                currentUser
                            );
                        }
                    }


                    /* =========================================
                       TRAINING PROGRAMMES
                    ========================================== */

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


                    /*
                     * Only show a full dashboard load error
                     * when BOTH requests fail.
                     */

                    if (
                        profileResult.status ===
                        "rejected" &&
                        programmeResult.status ===
                        "rejected"
                    ) {
                        throw profileResult.reason;
                    }

                } catch (
                error
                ) {
                    console.error(
                        "Trainer dashboard error:",
                        error
                    );


                    if (
                        mounted
                    ) {
                        setErrorMessage(
                            getApiErrorMessage(
                                error,
                                "Unable to load Trainer dashboard."
                            )
                        );
                    }

                } finally {
                    if (
                        mounted
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            };


        loadDashboard();


        return () => {
            mounted =
                false;
        };

    }, []);


    /* =====================================================
       ASSIGNED TRAINING SECTIONS
    ===================================================== */

    const assignedSections =
        useMemo(
            () => {
                if (
                    !Array.isArray(
                        user?.assignedTrainingSections
                    )
                ) {
                    return [];
                }


                return user
                    .assignedTrainingSections
                    .map(
                        normalizeTrainingSection
                    )
                    .filter(
                        Boolean
                    );
            },
            [
                user,
            ]
        );


    /* =====================================================
       ASSIGNED AREA INFORMATION
    ===================================================== */

    const assignedAreas =
        useMemo(
            () =>
                assignedSections
                    .map(
                        (
                            id
                        ) => {
                            const area =
                                TRAINING_AREAS[
                                id
                                ];


                            if (
                                !area
                            ) {
                                return null;
                            }


                            return {
                                id,
                                ...area,
                            };
                        }
                    )
                    .filter(
                        Boolean
                    ),
            [
                assignedSections,
            ]
        );


    /* =====================================================
       PROGRAMMES BY TRAINING AREA
    ===================================================== */

    const programmesByArea =
        useMemo(
            () => {
                const result =
                    {};


                assignedSections.forEach(
                    (
                        section
                    ) => {
                        result[
                            section
                        ] =
                            programmes.filter(
                                (
                                    programme
                                ) =>
                                    normalizeTrainingSection(
                                        programme.programmeType
                                    ) ===
                                    section
                            );
                    }
                );


                return result;
            },
            [
                assignedSections,
                programmes,
            ]
        );


    /* =====================================================
       TOTAL RELEVANT PROGRAMMES
    ===================================================== */

    const totalRelevantProgrammes =
        useMemo(
            () =>
                Object
                    .values(
                        programmesByArea
                    )
                    .reduce(
                        (
                            total,
                            list
                        ) =>
                            total +
                            list.length,
                        0
                    ),
            [
                programmesByArea,
            ]
        );


    /* =====================================================
       LOADING
    ===================================================== */

    if (
        loading
    ) {
        return (
            <DashboardLayout
                role="trainer"
                showHeader={
                    false
                }
            >
                <div
                    className="
                        app-page
                    "
                >
                    <LoadingCard
                        message="Loading Trainer dashboard..."
                    />
                </div>
            </DashboardLayout>
        );
    }


    /* =====================================================
       DISPLAY NAME
    ===================================================== */

    const displayName =
        `${user?.firstName || ""} ${user?.lastName || ""}`
            .trim() ||
        user?.fullName ||
        user?.username ||
        "Trainer";


    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <DashboardLayout
            role="trainer"
            showHeader={
                false
            }
        >

            <TrainerHeader
                user={
                    user
                }
            />


            <div
                className="
                    trainer-dashboard-figma
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


                {/* ===========================================
                    TRAINER ACCOUNT
                ============================================ */}

                <section
                    className="
                        trainer-account-card
                    "
                >

                    <div>

                        <p
                            className="
                                trainer-eyebrow
                            "
                        >
                            Trainer Account
                        </p>


                        <h2>
                            {displayName}
                        </h2>


                        <p>
                            Username:{" "}

                            {user?.username ||
                                "—"}
                        </p>

                    </div>


                    <div
                        className="
                            trainer-account-badges
                        "
                    >

                        <span>
                            Trainer
                        </span>


                        <span
                            className="
                                trainer-badge-active
                            "
                        >
                            Active
                        </span>


                        <span
                            className="
                                trainer-badge-section
                            "
                        >
                            {assignedAreas.length}{" "}
                            Training Section
                            {assignedAreas.length ===
                                1
                                ? ""
                                : "s"}
                        </span>

                    </div>

                </section>


                {/* ===========================================
                    TRAINING SECTIONS
                ============================================ */}

                <section
                    className="
                        trainer-module-section
                    "
                >

                    <div
                        className="
                            trainer-section-heading
                        "
                    >

                        <div>

                            <h3>
                                My Training Sections
                            </h3>


                            <p>
                                Training sections assigned by the Administrator.
                            </p>

                        </div>


                        <span>
                            {assignedAreas.length}{" "}
                            Section
                            {assignedAreas.length ===
                                1
                                ? ""
                                : "s"}
                        </span>

                    </div>


                    {assignedAreas.length ===
                        0 ? (

                        <div
                            className="
                                trainer-empty
                            "
                        >
                            No training section has been assigned yet.
                        </div>

                    ) : (

                        <div
                            className="
                                trainer-module-list
                            "
                        >

                            {assignedAreas.map(
                                (
                                    area
                                ) => {
                                    const areaProgrammes =
                                        programmesByArea[
                                        area.id
                                        ] ||
                                        [];


                                    return (
                                        <article
                                            key={
                                                area.id
                                            }
                                            className="
                                                trainer-module-row
                                            "
                                        >

                                            <div
                                                className="
                                                    trainer-module-copy
                                                "
                                            >

                                                <h4>
                                                    {area.title}
                                                </h4>


                                                <div
                                                    className="
                                                        trainer-module-detail
                                                    "
                                                >

                                                    <img
                                                        src={
                                                            area.image
                                                        }
                                                        alt={
                                                            area.title
                                                        }
                                                    />


                                                    <div>

                                                        <p>
                                                            {area.description}
                                                        </p>


                                                        <span>
                                                            Assigned
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            <div
                                                className="
                                                    trainer-module-actions
                                                "
                                            >

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            "/training-programmes"
                                                        )
                                                    }
                                                >
                                                    View Module
                                                </button>


                                                <small>
                                                    {
                                                        areaProgrammes.length
                                                    }{" "}
                                                    Programme
                                                    {areaProgrammes.length ===
                                                        1
                                                        ? ""
                                                        : "s"}
                                                </small>

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </div>

                    )}

                </section>


                {/* ===========================================
                    OVERVIEW STATS
                ============================================ */}

                <section
                    className="
                        trainer-stat-grid
                    "
                >

                    <TrainerStat
                        title="Training Sections"
                        value={
                            assignedAreas.length
                        }
                        subtitle="Assigned to your account"
                        type="users"
                    />


                    <TrainerStat
                        title="Programmes"
                        value={
                            totalRelevantProgrammes
                        }
                        subtitle="Available in your sections"
                        type="complete"
                    />


                    <TrainerStat
                        title="Trainees"
                        value="0"
                        subtitle="No trainer trainee endpoint yet"
                        type="progress"
                    />


                    <TrainerStat
                        title="Pending Tasks"
                        value="0"
                        subtitle="No task data available yet"
                        type="empty"
                    />

                </section>


                {/* ===========================================
                    TRAINEE TASKS + SCORES
                ============================================ */}

                <section
                    className="
                        trainer-two-column
                    "
                >

                    <DashboardPanel
                        title="Trainee Task Overview"
                        subtitle="Trainee activity within your assigned training section."
                    >

                        <EmptyPanel
                            message="No trainee task data is available yet."
                        />

                    </DashboardPanel>


                    <DashboardPanel
                        title="Trainee Scores"
                        subtitle="Latest quiz scores in your assigned training section."
                    >

                        <EmptyPanel
                            message="No trainee scores are available yet."
                        />

                    </DashboardPanel>

                </section>


                {/* ===========================================
                    PROGRESS + ACTIVITY
                ============================================ */}

                <section
                    className="
                        trainer-two-column
                        trainer-bottom-grid
                    "
                >

                    <DashboardPanel
                        title="Trainee Progress Overview"
                        subtitle="Overall progress in your assigned training section."
                    >

                        <div
                            className="
                                trainer-progress-empty
                            "
                        >

                            <div
                                className="
                                    trainer-progress-ring
                                "
                            >
                                0%
                            </div>


                            <div>

                                <p>

                                    <span
                                        className="
                                            dot
                                            complete
                                        "
                                    />

                                    Completed

                                    <strong>
                                        0
                                    </strong>

                                </p>


                                <p>

                                    <span
                                        className="
                                            dot
                                            progress
                                        "
                                    />

                                    In Progress

                                    <strong>
                                        0
                                    </strong>

                                </p>


                                <p>

                                    <span
                                        className="
                                            dot
                                            empty
                                        "
                                    />

                                    Not Started

                                    <strong>
                                        0
                                    </strong>

                                </p>

                            </div>

                        </div>

                    </DashboardPanel>


                    <DashboardPanel
                        title="Recent Activity"
                        subtitle="Latest training activity."
                    >

                        <EmptyPanel
                            message="No recent trainee activity is available yet."
                        />

                    </DashboardPanel>

                </section>

            </div>

        </DashboardLayout>
    );
}


/* =========================================================
   STAT CARD
========================================================= */

function TrainerStat({
    title,
    value,
    subtitle,
    type,
}) {
    return (
        <article
            className="
                trainer-stat-card
            "
        >

            <div
                className={`
                    trainer-stat-icon
                    trainer-stat-icon--${type}
                `}
            >
                <StatIcon
                    type={
                        type
                    }
                />
            </div>


            <div>

                <p>
                    {title}
                </p>


                <strong>
                    {value}
                </strong>


                <small>
                    {subtitle}
                </small>

            </div>

        </article>
    );
}


/* =========================================================
   STAT ICON
========================================================= */

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
                strokeWidth="1.8"
            >
                <circle
                    cx="9"
                    cy="8"
                    r="3"
                />

                <path d="M3.5 19c.6-3.5 2.5-5.5 5.5-5.5s4.9 2 5.5 5.5" />

                <circle
                    cx="17"
                    cy="9"
                    r="2"
                />
            </svg>
        );
    }


    if (
        type ===
        "complete"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
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
        "progress"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M5 19V9" />

                <path d="M12 19V5" />

                <path d="M19 19v-7" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
            />

            <path d="M12 7v5" />

            <path d="M12 16h.01" />
        </svg>
    );
}


/* =========================================================
   DASHBOARD PANEL
========================================================= */

function DashboardPanel({
    title,
    subtitle,
    children,
}) {
    return (
        <section
            className="
                trainer-panel
            "
        >

            <div
                className="
                    trainer-panel-heading
                "
            >

                <div>

                    <h3>
                        {title}
                    </h3>


                    <p>
                        {subtitle}
                    </p>

                </div>

            </div>


            {children}

        </section>
    );
}


/* =========================================================
   EMPTY PANEL
========================================================= */

function EmptyPanel({
    message,
}) {
    return (
        <div
            className="
                trainer-panel-empty
            "
        >

            <p>
                {message}
            </p>

        </div>
    );
}


export default TrainerDashboard;