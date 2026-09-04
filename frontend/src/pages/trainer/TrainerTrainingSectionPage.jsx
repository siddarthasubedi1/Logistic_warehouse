import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import api from "../../services/api";


const TRAINING_SECTIONS = {
    "manual-handling": {
        id: "manual-handling",
        title: "Manual Handling",

        description:
            "Manage Manual Handling training content, trainee tasks, progress and scores.",

        lessons: 10,

        areas: [
            "Safe Lifting Techniques",
            "Load Assessment",
            "Correct Carrying Procedures",
            "Workplace Hazards",
        ],
    },

    "working-at-height": {
        id: "working-at-height",
        title: "Working at Height",

        description:
            "Manage Working at Height training content, trainee tasks, progress and scores.",

        lessons: 8,

        areas: [
            "Fall Prevention",
            "Ladder Safety",
            "Platform Safety",
            "Working at Height Hazards",
        ],
    },
};


function TrainerTrainingSectionPage() {
    const navigate =
        useNavigate();


    const {
        sectionId,
    } = useParams();


    const section =
        TRAINING_SECTIONS[
        sectionId
        ];


    const [
        trainer,
        setTrainer,
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
    // VERIFY TRAINER ASSIGNMENT
    // ======================================================

    useEffect(() => {

        const loadTrainer =
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


                    if (
                        !currentUser
                    ) {
                        setError(
                            "Unable to load Trainer information."
                        );

                        return;
                    }


                    if (
                        currentUser.role !==
                        "trainer"
                    ) {
                        setError(
                            "You are not authorised to access this page."
                        );

                        return;
                    }


                    const assignments =
                        Array.isArray(
                            currentUser
                                .assignedTrainingSections
                        )
                            ? currentUser
                                .assignedTrainingSections
                            : [];


                    if (
                        !assignments.includes(
                            sectionId
                        )
                    ) {
                        setError(
                            "This training section has not been assigned to you."
                        );

                        return;
                    }


                    setTrainer(
                        currentUser
                    );

                } catch (error) {

                    console.error(
                        "Trainer section error:",
                        error
                    );


                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load this training section."
                    );

                } finally {

                    setLoading(
                        false
                    );
                }
            };


        loadTrainer();

    }, [
        sectionId,
    ]);


    // ======================================================
    // INVALID SECTION
    // ======================================================

    if (!section) {
        return (
            <DashboardLayout
                role="trainer"
                showHeader={false}
            >

                <div className="min-h-screen bg-[#f6f8fb] p-6">

                    <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">

                        <h1 className="text-lg font-bold text-slate-900">
                            Training Section Not Found
                        </h1>


                        <p className="mt-2 text-sm text-slate-500">
                            The requested training section does not exist.
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/trainer"
                                )
                            }
                            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Back to Dashboard
                        </button>

                    </div>

                </div>

            </DashboardLayout>
        );
    }


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <DashboardLayout
                role="trainer"
                showHeader={false}
            >

                <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">

                    <div className="text-center">

                        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="mt-4 text-sm text-slate-500">
                            Loading training section...
                        </p>

                    </div>

                </div>

            </DashboardLayout>
        );
    }


    // ======================================================
    // UNAUTHORISED SECTION
    // ======================================================

    if (error) {
        return (
            <DashboardLayout
                role="trainer"
                showHeader={false}
            >

                <div className="min-h-screen bg-[#f6f8fb] p-6">

                    <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                            !
                        </div>


                        <h1 className="mt-4 text-lg font-bold text-slate-900">
                            Access Denied
                        </h1>


                        <p className="mt-2 text-sm text-slate-500">
                            {error}
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/trainer"
                                )
                            }
                            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Back to Trainer Dashboard
                        </button>

                    </div>

                </div>

            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            role="trainer"
            showHeader={false}
        >

            <main className="min-h-screen bg-[#f6f8fb] px-5 py-5 lg:px-6">

                {/* BREADCRUMB */}

                <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/trainer"
                            )
                        }
                        className="font-medium text-blue-600 hover:text-blue-700"
                    >
                        Trainer Dashboard
                    </button>

                    <span>
                        ›
                    </span>

                    <span>
                        {section.title}
                    </span>

                </div>


                {/* HEADER */}

                <section className="rounded-xl bg-[#073763] p-6 text-white shadow-sm">

                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-200">
                                Assigned Training Section
                            </p>


                            <h1 className="mt-2 text-2xl font-bold">
                                {section.title}
                            </h1>


                            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                                {section.description}
                            </p>

                        </div>


                        <div className="rounded-xl bg-white/10 px-5 py-4 text-center">

                            <p className="text-2xl font-bold">
                                {section.lessons}
                            </p>

                            <p className="text-xs text-blue-100">
                                Lessons
                            </p>

                        </div>

                    </div>

                </section>


                {/* TRAINER INFORMATION */}

                <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex flex-wrap items-center justify-between gap-4">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Responsible Trainer
                            </p>


                            <h2 className="mt-1 font-bold text-slate-900">
                                {trainer?.firstName}{" "}
                                {trainer?.lastName}
                            </h2>


                            <p className="mt-1 text-xs text-slate-500">
                                {trainer?.username}
                            </p>

                        </div>


                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            Assigned
                        </span>

                    </div>

                </section>


                {/* MANAGEMENT CARDS */}

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            📘
                        </div>


                        <h3 className="mt-4 font-bold text-slate-900">
                            Training Content
                        </h3>


                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            View and manage lessons for this training section.
                        </p>


                        <button
                            type="button"
                            className="mt-4 text-xs font-semibold text-blue-600"
                        >
                            Manage Content →
                        </button>

                    </div>


                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                            ✓
                        </div>


                        <h3 className="mt-4 font-bold text-slate-900">
                            Trainee Tasks
                        </h3>


                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            View and edit trainee tasks related to this section.
                        </p>


                        <button
                            type="button"
                            className="mt-4 text-xs font-semibold text-blue-600"
                        >
                            Manage Tasks →
                        </button>

                    </div>


                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            %
                        </div>


                        <h3 className="mt-4 font-bold text-slate-900">
                            Scores
                        </h3>


                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            View and update trainee scores for this section.
                        </p>


                        <button
                            type="button"
                            className="mt-4 text-xs font-semibold text-blue-600"
                        >
                            View Scores →
                        </button>

                    </div>


                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            📊
                        </div>


                        <h3 className="mt-4 font-bold text-slate-900">
                            Progress
                        </h3>


                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            Monitor trainee progress for this training section.
                        </p>


                        <button
                            type="button"
                            className="mt-4 text-xs font-semibold text-blue-600"
                        >
                            View Progress →
                        </button>

                    </div>

                </div>


                {/* SECTION CONTENT */}

                <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-4">

                        <h2 className="font-bold text-slate-900">
                            {section.title} Topics
                        </h2>


                        <p className="mt-1 text-xs text-slate-500">
                            Main areas included in this training section.
                        </p>

                    </div>


                    <div className="grid gap-3 md:grid-cols-2">

                        {section.areas.map(
                            (
                                area,
                                index
                            ) => (
                                <div
                                    key={
                                        area
                                    }
                                    className="flex items-center gap-3 rounded-lg border border-slate-200 p-4"
                                >

                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                                        {index + 1}
                                    </span>


                                    <p className="text-sm font-medium text-slate-800">
                                        {area}
                                    </p>

                                </div>
                            )
                        )}

                    </div>

                </section>

            </main>

        </DashboardLayout>
    );
}


export default TrainerTrainingSectionPage;