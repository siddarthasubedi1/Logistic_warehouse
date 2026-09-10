import {
    useEffect,
    useState,
} from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import TrainerHeader from "../components/trainer/TrainerHeader";
import TrainerModuleCard from "../components/trainer/TrainerModuleCard";
import TrainerStats from "../components/trainer/TrainerStats";
import TrainerTaskOverview from "../components/trainer/TrainerTaskOverview";
import TrainerScores from "../components/trainer/TrainerScores";
import TrainerProgressOverview from "../components/trainer/TrainerProgressOverview";
import TrainerRecentActivity from "../components/trainer/TrainerRecentActivity";

import api from "../services/api";


function TrainerDashboard() {
    // ======================================================
    // USER STATE
    // ======================================================

    const [
        user,
        setUser,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // ======================================================
    // LOAD TRAINER PROFILE
    // ======================================================

    useEffect(() => {
        const loadTrainerProfile =
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
                            "Unable to load trainer information."
                        );

                        return;
                    }


                    if (
                        currentUser.role !==
                        "trainer"
                    ) {
                        setError(
                            "This account is not authorised to access the Trainer Dashboard."
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
                        "Trainer dashboard profile error:",
                        error
                    );


                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load Trainer Dashboard information."
                    );

                } finally {
                    setLoading(
                        false
                    );
                }
            };


        loadTrainerProfile();

    }, []);


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <DashboardLayout
                role="trainer"
                showHeader={false}
            >

                <div
                    className="
                        flex
                        min-h-[70vh]
                        items-center
                        justify-center
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-sm
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            text-center
                            shadow-sm
                        "
                    >

                        <div
                            className="
                                mx-auto
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                bg-blue-50
                            "
                        >

                            <div
                                className="
                                    h-6
                                    w-6
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-blue-100
                                    border-t-blue-600
                                "
                            />

                        </div>


                        <h2
                            className="
                                mt-4
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Loading Trainer Dashboard
                        </h2>


                        <p
                            className="
                                mt-2
                                text-[10px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Preparing your assigned training areas and
                            account information.
                        </p>

                    </div>

                </div>

            </DashboardLayout>
        );
    }


    // ======================================================
    // ERROR
    // ======================================================

    if (error) {
        return (
            <DashboardLayout
                role="trainer"
                showHeader={false}
            >

                <div
                    className="
                        flex
                        min-h-[70vh]
                        items-center
                        justify-center
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-2xl
                            border
                            border-red-200
                            bg-white
                            p-6
                            text-center
                            shadow-sm
                        "
                    >

                        <div
                            className="
                                mx-auto
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                bg-red-50
                                text-red-600
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
                                    cy="12"
                                    r="9"
                                />

                                <path d="M12 7v6" />

                                <path d="M12 17h.01" />
                            </svg>

                        </div>


                        <h2
                            className="
                                mt-4
                                text-base
                                font-bold
                                text-slate-900
                            "
                        >
                            Unable to Load Dashboard
                        </h2>


                        <p
                            className="
                                mt-2
                                text-[11px]
                                leading-5
                                text-slate-500
                            "
                        >
                            {error}
                        </p>

                    </div>

                </div>

            </DashboardLayout>
        );
    }


    // ======================================================
    // TRAINING ASSIGNMENTS
    // ======================================================

    const assignedTrainingSections =
        Array.isArray(
            user?.assignedTrainingSections
        )
            ? user.assignedTrainingSections
            : [];


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
        "Trainer";


    // ======================================================
    // DASHBOARD
    // ======================================================

    return (
        <DashboardLayout
            role="trainer"
            showHeader={false}
        >

            <div className="space-y-5">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <TrainerHeader
                    user={
                        user
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

                                    <path d="M18 5v4" />

                                    <path d="M16 7h4" />
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
                                    Trainer Account
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
                                    "trainer"}
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


                            <span
                                className="
                                    rounded-full
                                    bg-indigo-50
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-semibold
                                    text-indigo-700
                                "
                            >
                                {
                                    assignedTrainingSections.length
                                }{" "}
                                {assignedTrainingSections.length ===
                                    1
                                    ? "Training Area"
                                    : "Training Areas"}
                            </span>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* TRAINING AREA */}
                {/* ================================================= */}

                <TrainerModuleCard
                    assignedTrainingSections={
                        assignedTrainingSections
                    }
                />


                {/* ================================================= */}
                {/* STATS */}
                {/* ================================================= */}

                <TrainerStats />


                {/* ================================================= */}
                {/* TASKS + SCORES */}
                {/* ================================================= */}

                <div
                    className="
                        grid
                        gap-5
                        xl:grid-cols-2
                    "
                >

                    <TrainerTaskOverview />

                    <TrainerScores />

                </div>


                {/* ================================================= */}
                {/* PROGRESS + ACTIVITY */}
                {/* ================================================= */}

                <div
                    className="
                        grid
                        gap-5
                        xl:grid-cols-2
                    "
                >

                    <TrainerProgressOverview />

                    <TrainerRecentActivity />

                </div>


                {/* ================================================= */}
                {/* SAFETY NOTE */}
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

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Trainer Access Control
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
                                Your assigned training areas determine
                                which Manual Handling or Working at
                                Height programmes you are permitted to
                                create and manage.
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


export default TrainerDashboard;