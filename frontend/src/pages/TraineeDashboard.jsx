import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import TraineeHeader from "../components/trainee/TraineeHeader";
import FeedbackAlert from "../components/ui/FeedbackAlert";
import LoadingCard from "../components/ui/LoadingCard";

import api from "../services/api";
import boxLift from "../images/box-lift.jpg";
import heightImage from "../images/hight.jpg";
import warehouseImage from "../images/warehouse.jpg";
import insideWarehouseImage from "../images/inside-warehouse.jpg";
import loadingImage from "../images/loading.jpg";

import {
    getSessionUser,
    saveSessionUser,
} from "../utils/session";

import { getApiErrorMessage } from "../utils/training";


const MODULES = {
    "manual-handling": {
        title: "Manual Handling",
        description: "Learn safe manual handling techniques and reduce injury risks.",
        image: boxLift,
    },
    "working-at-height": {
        title: "Working at Height",
        description: "Learn how to work safely at elevated heights and prevent falls.",
        image: heightImage,
    },
};


const SCENARIOS = [
    {
        title: "Warehouse - Receiving Area",
        text: "Identify hazards in the receiving area.",
        image: warehouseImage,
    },
    {
        title: "Storage Area - High Risk",
        text: "Spot the hazards in the storage area.",
        image: insideWarehouseImage,
    },
    {
        title: "Loading Dock",
        text: "Find and report the safety hazards.",
        image: loadingImage,
    },
];


function TraineeDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => getSessionUser());
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        let mounted = true;

        const loadDashboard = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const [profileResult, progressResult] = await Promise.allSettled([
                    api.get("/users/me"),
                    api.get("/users/me/training-progress"),
                ]);

                if (!mounted) {
                    return;
                }

                if (profileResult.status === "fulfilled") {
                    const currentUser = profileResult.value.data?.user || null;

                    if (currentUser) {
                        setUser(currentUser);
                        saveSessionUser(currentUser);
                    }
                }

                if (progressResult.status === "fulfilled") {
                    setProgress(
                        Array.isArray(progressResult.value.data?.progress)
                            ? progressResult.value.data.progress
                            : []
                    );
                }

                if (
                    profileResult.status === "rejected" &&
                    progressResult.status === "rejected"
                ) {
                    throw profileResult.reason;
                }

            } catch (error) {
                console.error("Trainee dashboard error:", error);

                if (mounted) {
                    setErrorMessage(
                        getApiErrorMessage(
                            error,
                            "Unable to load your trainee dashboard."
                        )
                    );
                }

            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };


        loadDashboard();


        return () => {
            mounted = false;
        };
    }, []);


    const assignedSections = useMemo(() => {
        const fromUser = Array.isArray(user?.assignedTrainingSections)
            ? user.assignedTrainingSections
            : [];

        if (fromUser.length > 0) {
            return fromUser;
        }

        return progress
            .map((item) => item.trainingSection)
            .filter(Boolean);
    }, [user, progress]);


    const moduleRows = useMemo(
        () =>
            assignedSections
                .map((id) => {
                    const module = MODULES[id];

                    if (!module) {
                        return null;
                    }

                    const progressRecord = progress.find(
                        (item) => item.trainingSection === id
                    );

                    return {
                        id,
                        ...module,
                        progress: Number(progressRecord?.progress || 0),
                        status: progressRecord?.status || "not-started",
                    };
                })
                .filter(Boolean),
        [assignedSections, progress]
    );


    const completedModules =
        moduleRows.filter(
            (item) => item.progress >= 100
        ).length;


    const averageProgress =
        moduleRows.length
            ? Math.round(
                moduleRows.reduce(
                    (sum, item) =>
                        sum + item.progress,
                    0
                ) /
                moduleRows.length
            )
            : 0;


    const startModule = async (moduleId) => {
        try {
            await api.post(
                `/users/me/training-progress/${moduleId}/start`
            );

            navigate("/my-training");

        } catch (error) {
            setErrorMessage(
                getApiErrorMessage(
                    error,
                    "Unable to start this training module."
                )
            );
        }
    };


    if (loading) {
        return (
            <DashboardLayout
                role="trainee"
                showHeader={false}
            >
                <div className="app-page">
                    <LoadingCard
                        message="Loading your training dashboard..."
                    />
                </div>
            </DashboardLayout>
        );
    }


    const displayName =
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
        user?.username ||
        "Trainee";


    return (
        <DashboardLayout
            role="trainee"
            showHeader={false}
        >
            <TraineeHeader
                user={user}
            />


            <div className="trainee-dashboard-figma">

                <FeedbackAlert
                    type="error"
                    message={errorMessage}
                    onClose={() =>
                        setErrorMessage("")
                    }
                />


                <div className="trainee-dashboard-grid">

                    <div className="trainee-dashboard-main">

                        {/* ACCOUNT */}

                        <section className="trainee-account-card">

                            <div>

                                <p className="trainee-eyebrow">
                                    Trainee Account
                                </p>

                                <h2>
                                    {displayName}
                                </h2>

                                <p>
                                    Username:{" "}
                                    {user?.username || "—"}
                                </p>

                            </div>


                            <div className="trainee-account-badges">

                                <span>
                                    Trainee
                                </span>

                                <span className="active">
                                    Active
                                </span>

                            </div>

                        </section>


                        {/* TRAINING MODULES */}

                        <section className="trainee-card-shell">

                            <div className="trainee-section-heading">

                                <div>

                                    <h3>
                                        My Training Modules
                                    </h3>

                                    <p>
                                        Training assigned to you by the Administrator.
                                    </p>

                                </div>


                                <span>
                                    {moduleRows.length} Assigned
                                </span>

                            </div>


                            <div className="trainee-module-grid">

                                {moduleRows.map(
                                    (module) => (
                                        <article
                                            key={module.id}
                                            className="trainee-module-card"
                                        >

                                            <div className="trainee-module-copy">

                                                <span className="module-status">
                                                    {module.progress >= 100
                                                        ? "COMPLETED"
                                                        : "IN PROGRESS"}
                                                </span>


                                                <h4>
                                                    {module.title}
                                                </h4>


                                                <p>
                                                    {module.description}
                                                </p>


                                                <div className="module-progress-label">

                                                    <span>
                                                        {module.progress}% Complete
                                                    </span>

                                                </div>


                                                <div className="module-progress-track">

                                                    <div
                                                        style={{
                                                            width: `${module.progress}%`,
                                                        }}
                                                    />

                                                </div>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        startModule(
                                                            module.id
                                                        )
                                                    }
                                                >
                                                    Continue Learning{" "}
                                                    <span>
                                                        ›
                                                    </span>
                                                </button>

                                            </div>


                                            <img
                                                src={module.image}
                                                alt={module.title}
                                            />

                                        </article>
                                    )
                                )}

                            </div>

                        </section>


                        {/* PANORAMIC SCENARIOS */}

                        <section className="trainee-card-shell">

                            <div className="trainee-section-heading">

                                <h3>
                                    Panoramic Scenarios
                                </h3>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/trainee/scenarios"
                                        )
                                    }
                                >
                                    View All
                                </button>

                            </div>


                            <div className="trainee-scenario-grid">

                                {SCENARIOS.map(
                                    (scenario) => (
                                        <article
                                            key={scenario.title}
                                            className="scenario-card"
                                        >

                                            <div className="scenario-image-wrap">

                                                <img
                                                    src={scenario.image}
                                                    alt={scenario.title}
                                                />

                                                <span>
                                                    ◎
                                                </span>

                                            </div>


                                            <div className="scenario-copy">

                                                <h4>
                                                    {scenario.title}
                                                </h4>


                                                <p>
                                                    {scenario.text}
                                                </p>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            "/trainee/scenarios"
                                                        )
                                                    }
                                                >
                                                    ▣ Start Scenario
                                                </button>

                                            </div>

                                        </article>
                                    )
                                )}

                            </div>

                        </section>


                        {/* QUIZ RESULTS */}

                        <section className="trainee-card-shell trainee-quiz-results">

                            <div className="trainee-section-heading trainee-quiz-heading">

                                <div>

                                    <h3>
                                        Recent Quiz Results
                                    </h3>

                                    <p>
                                        Your completed quiz attempts will appear here.
                                    </p>

                                </div>

                            </div>


                            <div className="trainee-quiz-table">

                                <div className="quiz-table-head">

                                    <span>
                                        Quiz Title
                                    </span>

                                    <span>
                                        Module
                                    </span>

                                    <span>
                                        Score
                                    </span>

                                    <span>
                                        Date
                                    </span>

                                    <span>
                                        Result
                                    </span>

                                </div>


                                <div className="quiz-table-empty">
                                    No quiz attempts yet.
                                </div>

                            </div>

                        </section>

                    </div>


                    {/* RIGHT COLUMN */}

                    <aside className="trainee-dashboard-rail">

                        {/* PROGRESS */}

                        <section className="rail-card progress-card">

                            <h3>
                                My Progress
                            </h3>


                            <div className="progress-card-body">

                                <div className="progress-circle">

                                    <span>
                                        {averageProgress}%
                                    </span>

                                </div>


                                <div className="progress-numbers">

                                    <p>

                                        <strong className="green">
                                            {completedModules}
                                        </strong>

                                        <span>
                                            Modules Completed
                                        </span>

                                    </p>


                                    <p>

                                        <strong>
                                            0
                                        </strong>

                                        <span>
                                            Quizzes Taken
                                        </span>

                                    </p>


                                    <p>

                                        <strong className="orange">
                                            0%
                                        </strong>

                                        <span>
                                            Average Score
                                        </span>

                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/trainee/progress"
                                    )
                                }
                            >
                                ▥ View Detailed Progress
                            </button>

                        </section>


                        {/* TRAINING STATUS */}

                        <section className="rail-card">

                            <h3>
                                My Training Status
                            </h3>


                            <div className="training-status-list">

                                {moduleRows.map(
                                    (module) => (
                                        <div
                                            key={module.id}
                                            className="training-status-item"
                                        >

                                            <div>

                                                <strong>
                                                    {module.title}
                                                </strong>


                                                <span>
                                                    {module.progress >= 100
                                                        ? "COMPLETED"
                                                        : "IN PROGRESS"}
                                                </span>

                                            </div>


                                            <div className="module-progress-track small">

                                                <div
                                                    style={{
                                                        width: `${module.progress}%`,
                                                    }}
                                                />

                                            </div>


                                            <p>
                                                {module.progress}% Complete
                                            </p>

                                        </div>
                                    )
                                )}

                            </div>

                        </section>


                        {/* NOTIFICATIONS */}

                        <section className="rail-card">

                            <div className="rail-card-heading">

                                <h3>
                                    Notifications
                                </h3>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/trainee/notifications"
                                        )
                                    }
                                >
                                    View All
                                </button>

                            </div>


                            <div className="notification-row">

                                <div className="notification-icon">
                                    🎁
                                </div>


                                <div>

                                    <strong>
                                        Training available
                                    </strong>


                                    <p>
                                        {moduleRows.length} assigned training modules are available.
                                    </p>


                                    <span>
                                        Available now
                                    </span>

                                </div>

                            </div>

                        </section>


                        {/* ACHIEVEMENTS */}

                        <section className="rail-card achievement-card">

                            <h3>
                                My Achievements
                            </h3>


                            <div className="achievement-empty">

                                <div>
                                    ☆
                                </div>


                                <strong>
                                    No achievements yet
                                </strong>


                                <p>
                                    Complete training to earn achievements.
                                </p>

                            </div>

                        </section>


                        {/* SUPPORT */}

                        <button
                            type="button"
                            className="support-card"
                            onClick={() =>
                                navigate(
                                    "/trainee/help"
                                )
                            }
                        >

                            <span>
                                ◉
                            </span>


                            <div>

                                <small>
                                    Need Help?
                                </small>

                                <strong>
                                    Contact Support
                                </strong>

                            </div>


                            <b>
                                ›
                            </b>

                        </button>

                    </aside>

                </div>

            </div>

        </DashboardLayout>
    );
}


export default TraineeDashboard;