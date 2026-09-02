import {
    useEffect,
    useState,
} from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import TraineeHeader from "../components/trainee/TraineeHeader";

import api from "../services/api";

import boxLift from "../images/box-lift.jpg";
import heightImage from "../images/hight.jpg";
import insideWarehouse from "../images/inside-warehouse.jpg";
import loadingImage from "../images/loading.jpg";
import warehouseImage from "../images/warehouse.jpg";


function TraineeDashboard() {
    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {
        const loadTrainee =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const response =
                        await api.get(
                            "/users/me"
                        );

                    const currentUser =
                        response.data?.user;


                    if (!currentUser) {
                        setError(
                            "Unable to load trainee information."
                        );

                        return;
                    }


                    if (
                        currentUser.role !==
                        "trainee"
                    ) {
                        setError(
                            "This account is not authorised to access the Trainee Dashboard."
                        );

                        return;
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

                } catch (error) {
                    console.error(
                        "Trainee dashboard error:",
                        error
                    );


                    setError(
                        error.response?.data
                            ?.message ||
                        "Unable to load Trainee Dashboard."
                    );

                } finally {
                    setLoading(false);
                }
            };


        loadTrainee();

    }, []);


    if (loading) {
        return (
            <DashboardLayout
                role="trainee"
                showHeader={false}
            >
                <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">

                    <div className="text-center">

                        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="mt-4 text-sm font-medium text-slate-600">
                            Loading Trainee Dashboard...
                        </p>

                    </div>

                </div>
            </DashboardLayout>
        );
    }


    if (error) {
        return (
            <DashboardLayout
                role="trainee"
                showHeader={false}
            >
                <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-5">

                    <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">

                        <h2 className="text-base font-bold text-slate-900">
                            Unable to Load Dashboard
                        </h2>

                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>

                    </div>

                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            role="trainee"
            showHeader={false}
        >
            <div className="min-h-screen bg-[#f6f8fb]">

                <TraineeHeader
                    user={user}
                />


                <div className="px-6 py-5 xl:px-7">

                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_285px]">

                        {/* LEFT COLUMN */}

                        <div className="min-w-0 space-y-4">


                            {/* =========================================
                                TRAINEE ACCOUNT INFORMATION
                            ========================================= */}

                            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div>

                                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                                            Trainee Account
                                        </p>

                                        <h2 className="mt-1 text-[16px] font-bold text-[#172033]">

                                            {user?.firstName}{" "}
                                            {user?.lastName}

                                        </h2>

                                        <p className="mt-1 text-[9px] text-slate-500">

                                            Username:{" "}

                                            <span className="font-semibold text-slate-700">
                                                {user?.username}
                                            </span>

                                        </p>

                                    </div>


                                    <div className="flex gap-2">

                                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[8px] font-semibold capitalize text-blue-700">

                                            {user?.role}

                                        </span>


                                        <span
                                            className={`rounded-full px-3 py-1.5 text-[8px] font-semibold capitalize ${user?.status ===
                                                "active"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-red-50 text-red-600"
                                                }`}
                                        >

                                            {user?.status}

                                        </span>

                                    </div>

                                </div>

                            </section>


                            {/* =========================================
                                TRAINING MODULES
                            ========================================= */}

                            <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">

                                <h2 className="mb-3 text-[13px] font-bold text-[#172033]">
                                    My Training Modules
                                </h2>

                                <div className="grid gap-3 md:grid-cols-2">

                                    <TrainingCard
                                        status="IN PROGRESS"
                                        statusType="progress"
                                        title="Manual Handling"
                                        description="Learn safe manual handling techniques and reduce injury risks."
                                        progress={60}
                                        image={boxLift}
                                        buttonText="Continue Learning"
                                    />


                                    <TrainingCard
                                        status="NOT STARTED"
                                        statusType="notStarted"
                                        title="Working at Height"
                                        description="Learn how to work safely at elevated heights and prevent falls."
                                        progress={0}
                                        image={
                                            heightImage
                                        }
                                        buttonText="Start Learning"
                                    />

                                </div>

                            </section>


                            {/* =========================================
                                PANORAMIC SCENARIOS
                            ========================================= */}

                            <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">

                                <div className="mb-3 flex items-center justify-between">

                                    <h2 className="text-[13px] font-bold text-[#172033]">
                                        Panoramic Scenarios
                                    </h2>

                                    <button
                                        type="button"
                                        className="text-[10px] font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        View All
                                    </button>

                                </div>


                                <div className="grid gap-3 md:grid-cols-3">

                                    <ScenarioCard
                                        title="Warehouse - Receiving Area"
                                        description="Identify hazards in the receiving area."
                                        image={
                                            warehouseImage
                                        }
                                    />

                                    <ScenarioCard
                                        title="Storage Area - High Risk"
                                        description="Spot the hazards in the storage area."
                                        image={
                                            insideWarehouse
                                        }
                                    />

                                    <ScenarioCard
                                        title="Loading Dock"
                                        description="Find and report the safety hazards."
                                        image={
                                            loadingImage
                                        }
                                    />

                                </div>

                            </section>


                            {/* =========================================
                                QUIZ RESULTS
                            ========================================= */}

                            <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">

                                <div className="mb-3 flex items-center justify-between">

                                    <h2 className="text-[13px] font-bold text-[#172033]">
                                        Recent Quiz Results
                                    </h2>

                                    <button
                                        type="button"
                                        className="text-[10px] font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        View All
                                    </button>

                                </div>


                                <div className="overflow-x-auto">

                                    <table className="w-full border-collapse text-left">

                                        <thead>

                                            <tr className="border-b border-slate-200">

                                                <TableHeading>
                                                    Quiz Title
                                                </TableHeading>

                                                <TableHeading>
                                                    Module
                                                </TableHeading>

                                                <TableHeading>
                                                    Score
                                                </TableHeading>

                                                <TableHeading>
                                                    Date
                                                </TableHeading>

                                                <TableHeading>
                                                    Result
                                                </TableHeading>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            <QuizRow
                                                quiz="Manual Handling Quiz"
                                                module="Manual Handling"
                                                score="85%"
                                                date="May 10, 2026"
                                            />

                                            <QuizRow
                                                quiz="Working at Height Quiz"
                                                module="Working at Height"
                                                score="70%"
                                                date="May 15, 2026"
                                            />

                                            <QuizRow
                                                quiz="Safety Basics Quiz"
                                                module="General Safety"
                                                score="92%"
                                                date="May 19, 2026"
                                            />

                                        </tbody>

                                    </table>

                                </div>

                            </section>

                        </div>


                        {/* RIGHT COLUMN */}

                        <div className="space-y-4">


                            {/* PROGRESS */}

                            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

                                <h2 className="text-[13px] font-bold text-[#172033]">
                                    My Progress
                                </h2>


                                <div className="mt-4 flex items-center gap-5">

                                    <ProgressCircle
                                        percentage={80}
                                    />


                                    <div className="space-y-3">

                                        <ProgressStat
                                            value="2"
                                            label="Modules Completed"
                                            color="green"
                                        />

                                        <ProgressStat
                                            value="4"
                                            label="Quizzes Taken"
                                            color="blue"
                                        />

                                        <ProgressStat
                                            value="80%"
                                            label="Average Score"
                                            color="orange"
                                        />

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-blue-200 bg-white px-3 py-2 text-[10px] font-semibold text-blue-600 transition hover:bg-blue-50"
                                >

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-4 w-4"
                                    >
                                        <path d="M4 20V10" />
                                        <path d="M10 20V4" />
                                        <path d="M16 20v-7" />
                                        <path d="M22 20V8" />
                                    </svg>

                                    View Detailed Progress

                                </button>

                            </section>


                            {/* NOTIFICATIONS */}

                            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

                                <div className="flex items-center justify-between">

                                    <h2 className="text-[13px] font-bold text-[#172033]">
                                        Notifications
                                    </h2>

                                    <button
                                        type="button"
                                        className="text-[9px] font-semibold text-blue-600"
                                    >
                                        View All
                                    </button>

                                </div>


                                <div className="mt-4 space-y-4">

                                    <Notification
                                        icon="gift"
                                        title="New training program available"
                                        text="Warehouse Fire Safety Training"
                                        time="2 hours ago"
                                        color="purple"
                                    />

                                    <Notification
                                        icon="check"
                                        title="You passed the quiz!"
                                        text="Manual Handling Quiz"
                                        time="1 day ago"
                                        color="green"
                                    />

                                    <Notification
                                        icon="award"
                                        title="Complete another module"
                                        text="Finish Working at Height module"
                                        time="2 days ago"
                                        color="yellow"
                                    />

                                </div>

                            </section>


                            {/* ACHIEVEMENTS */}

                            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

                                <div className="flex items-center justify-between">

                                    <h2 className="text-[13px] font-bold text-[#172033]">
                                        My Achievements
                                    </h2>

                                    <button
                                        type="button"
                                        className="text-[9px] font-semibold text-blue-600"
                                    >
                                        View All
                                    </button>

                                </div>


                                <div className="mt-5 grid grid-cols-3 gap-2">

                                    <Achievement
                                        type="manual"
                                        title="Manual Handling"
                                        subtitle="Completed"
                                    />

                                    <Achievement
                                        type="quiz"
                                        title="Quiz Master"
                                        subtitle="Score 80%"
                                    />

                                    <Achievement
                                        type="vest"
                                        title="Safety Starter"
                                        subtitle="In Progress"
                                    />

                                </div>

                            </section>


                            {/* SUPPORT */}

                            <section className="rounded-lg border border-blue-100 bg-blue-50 p-4">

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-600">

                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                className="h-5 w-5"
                                            >
                                                <path d="M4 13a8 8 0 0 1 16 0" />

                                                <path d="M4 13v4a2 2 0 0 0 2 2h2v-6H4z" />

                                                <path d="M20 13v4a2 2 0 0 1-2 2h-2v-6h4z" />
                                            </svg>

                                        </div>


                                        <div>
                                            <p className="text-[10px] text-slate-600">
                                                Need Help?
                                            </p>

                                            <p className="text-[11px] font-semibold text-blue-600">
                                                Contact Support
                                            </p>
                                        </div>

                                    </div>


                                    <span className="text-xl text-blue-600">
                                        ›
                                    </span>

                                </div>

                            </section>

                        </div>

                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}


function TrainingCard({
    status,
    statusType,
    title,
    description,
    progress,
    image,
    buttonText,
}) {
    return (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">

            <div className="grid min-h-[205px] grid-cols-[1.1fr_.9fr]">

                <div className="flex flex-col p-4">

                    <span
                        className={`w-fit rounded px-2 py-1 text-[8px] font-bold ${statusType ===
                            "progress"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-blue-100 text-blue-500"
                            }`}
                    >
                        {status}
                    </span>


                    <h3 className="mt-4 text-[15px] font-bold text-[#172033]">
                        {title}
                    </h3>


                    <p className="mt-2 text-[9px] leading-4 text-slate-500">
                        {description}
                    </p>


                    <div className="mt-auto">

                        <p className="mb-1 text-[9px] text-slate-500">
                            {progress}% Complete
                        </p>

                        <div className="h-[5px] overflow-hidden rounded-full bg-slate-200">

                            <div
                                className="h-full bg-emerald-500"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />

                        </div>


                        <button
                            type="button"
                            className="mt-3 flex w-full items-center justify-between rounded bg-[#06345f] px-4 py-2 text-[9px] font-semibold text-white transition hover:bg-[#0a467d]"
                        >
                            <span>
                                {buttonText}
                            </span>

                            <span>
                                ›
                            </span>
                        </button>

                    </div>

                </div>


                <img
                    src={image}
                    alt={title}
                    className="h-full min-h-[205px] w-full object-cover"
                />

            </div>

        </div>
    );
}


function ScenarioCard({
    title,
    description,
    image,
}) {
    return (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">

            <div className="relative">

                <img
                    src={image}
                    alt={title}
                    className="h-[110px] w-full object-cover"
                />

                <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white">

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
                            r="8"
                        />

                        <path d="M4 12h16" />

                        <path d="M12 4a14 14 0 0 1 0 16" />

                        <path d="M12 4a14 14 0 0 0 0 16" />
                    </svg>

                </div>

            </div>


            <div className="p-3">

                <h3 className="text-[10px] font-bold text-slate-800">
                    {title}
                </h3>


                <p className="mt-1 min-h-[26px] text-[8px] leading-3 text-slate-500">
                    {description}
                </p>


                <button
                    type="button"
                    className="mt-2 flex items-center gap-1 rounded border border-blue-200 px-2 py-1 text-[8px] font-semibold text-blue-600"
                >
                    <span className="text-[10px]">
                        ▶
                    </span>

                    Start Scenario
                </button>

            </div>

        </div>
    );
}


function TableHeading({
    children,
}) {
    return (
        <th className="px-2 py-2 text-[8px] font-semibold text-slate-500">
            {children}
        </th>
    );
}


function QuizRow({
    quiz,
    module,
    score,
    date,
}) {
    return (
        <tr className="border-b border-slate-100 last:border-b-0">

            <td className="px-2 py-2 text-[8px] font-medium text-slate-700">
                {quiz}
            </td>

            <td className="px-2 py-2 text-[8px] text-slate-600">
                {module}
            </td>

            <td className="px-2 py-2 text-[8px] font-semibold text-slate-700">
                {score}
            </td>

            <td className="px-2 py-2 text-[8px] text-slate-600">
                {date}
            </td>

            <td className="px-2 py-2">

                <span className="rounded bg-emerald-100 px-2 py-1 text-[8px] font-semibold text-emerald-600">
                    Passed
                </span>

            </td>

        </tr>
    );
}


function ProgressCircle({
    percentage,
}) {
    return (
        <div
            className="relative flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-full"
            style={{
                background: `conic-gradient(
                    #9aacc1 ${percentage}%,
                    #e3e8ef ${percentage}% 100%
                )`,
            }}
        >

            <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-white">

                <span className="text-[11px] font-bold text-slate-500">
                    {percentage}%
                </span>

            </div>

        </div>
    );
}


function ProgressStat({
    value,
    label,
    color,
}) {
    const colors = {
        green: "text-emerald-600",
        blue: "text-blue-600",
        orange: "text-orange-500",
    };


    return (
        <div>

            <p
                className={`text-[15px] font-bold ${colors[color]
                    }`}
            >
                {value}
            </p>

            <p className="text-[8px] leading-3 text-slate-500">
                {label}
            </p>

        </div>
    );
}


function Notification({
    icon,
    title,
    text,
    time,
    color,
}) {
    const styles = {
        purple:
            "bg-violet-100 text-violet-600",

        green:
            "bg-emerald-100 text-emerald-600",

        yellow:
            "bg-yellow-100 text-yellow-600",
    };


    return (
        <div className="flex items-start gap-3">

            <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${styles[color]
                    }`}
            >

                {icon === "gift" && (
                    <span className="text-sm">
                        🎁
                    </span>
                )}

                {icon === "check" && (
                    <span className="text-sm font-bold">
                        ✓
                    </span>
                )}

                {icon === "award" && (
                    <span className="text-sm">
                        ☆
                    </span>
                )}

            </div>


            <div className="min-w-0">

                <p className="text-[9px] font-semibold text-slate-800">
                    {title}
                </p>

                <p className="mt-[2px] text-[8px] text-slate-500">
                    {text}
                </p>

                <p className="mt-[2px] text-[7px] text-slate-400">
                    {time}
                </p>

            </div>

        </div>
    );
}


function Achievement({
    type,
    title,
    subtitle,
}) {
    return (
        <div className="text-center">

            <div className="mx-auto flex h-11 w-11 items-center justify-center">

                {type === "manual" && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <path d="M12 3 5 6v5c0 4.8 2.8 8 7 10 4.2-2 7-5.2 7-10V6l-7-3z" />

                            <path d="m9 12 2 2 4-4" />
                        </svg>

                    </div>
                )}


                {type === "quiz" && (
                    <div className="text-[30px]">
                        🏆
                    </div>
                )}


                {type === "vest" && (
                    <div className="text-[28px]">
                        🦺
                    </div>
                )}

            </div>


            <p className="mt-1 text-[8px] font-semibold text-slate-700">
                {title}
            </p>

            <p className="mt-[2px] text-[7px] text-slate-400">
                {subtitle}
            </p>

        </div>
    );
}


export default TraineeDashboard;