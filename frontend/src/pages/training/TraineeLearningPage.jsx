import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import api from "../../services/api";


// ======================================================
// HELPERS
// ======================================================

function programmeTypeLabel(type) {
    if (type === "manual-handling") {
        return "Manual Handling";
    }


    if (type === "working-at-height") {
        return "Working at Height";
    }


    return type || "Training";
}


function getTrainerName(owner) {
    if (!owner) {
        return "Trainer";
    }


    const name =
        `${owner.firstName || ""} ${owner.lastName || ""}`.trim();


    return (
        name ||
        owner.username ||
        "Trainer"
    );
}


// ======================================================
// COMPONENT
// ======================================================

function TraineeLearningPage() {
    const {
        programmeId,
    } = useParams();


    const navigate =
        useNavigate();


    const [
        programme,
        setProgramme,
    ] = useState(null);


    const [
        sections,
        setSections,
    ] = useState([]);


    const [
        currentIndex,
        setCurrentIndex,
    ] = useState(0);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // ==================================================
    // LOAD SECTIONS
    // ==================================================

    const loadLearningContent =
        useCallback(
            async () => {
                try {
                    setLoading(true);

                    setError("");


                    const response =
                        await api.get(
                            `/my-training/${programmeId}/sections`
                        );


                    setProgramme(
                        response.data
                            ?.programme ||
                        null
                    );


                    const sectionList =
                        Array.isArray(
                            response.data
                                ?.sections
                        )
                            ? response.data
                                .sections
                            : [];


                    setSections(
                        sectionList
                    );


                    setCurrentIndex(
                        0
                    );

                } catch (error) {
                    console.error(
                        "Load learning content error:",
                        error
                    );


                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load this training programme."
                    );

                } finally {
                    setLoading(false);
                }
            },
            [
                programmeId,
            ]
        );


    useEffect(() => {
        loadLearningContent();
    }, [
        loadLearningContent,
    ]);


    // ==================================================
    // CURRENT SECTION
    // ==================================================

    const currentSection =
        useMemo(
            () => {
                return (
                    sections[
                    currentIndex
                    ] ||
                    null
                );
            },
            [
                sections,
                currentIndex,
            ]
        );


    // ==================================================
    // NAVIGATION STATE
    // ==================================================

    const isFirstSection =
        currentIndex === 0;


    const isLastSection =
        sections.length > 0 &&
        currentIndex ===
        sections.length - 1;


    const progressPercentage =
        sections.length > 0
            ? Math.round(
                (
                    (
                        currentIndex +
                        1
                    ) /
                    sections.length
                ) *
                100
            )
            : 0;


    // ==================================================
    // PREVIOUS
    // ==================================================

    const previousSection =
        () => {

            if (
                currentIndex >
                0
            ) {
                setCurrentIndex(
                    (previous) =>
                        previous - 1
                );


                window.scrollTo({
                    top:
                        0,

                    behavior:
                        "smooth",
                });
            }
        };


    // ==================================================
    // NEXT
    // ==================================================

    const nextSection =
        () => {

            if (
                currentIndex <
                sections.length - 1
            ) {
                setCurrentIndex(
                    (previous) =>
                        previous + 1
                );


                window.scrollTo({
                    top:
                        0,

                    behavior:
                        "smooth",
                });
            }
        };


    // ==================================================
    // SELECT SECTION
    // ==================================================

    const selectSection =
        (index) => {

            setCurrentIndex(
                index
            );


            window.scrollTo({
                top:
                    0,

                behavior:
                    "smooth",
            });
        };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {
        return (
            <DashboardLayout
                role="trainee"
                title="Training"
                subtitle="Loading learning content..."
            >

                <div className="flex min-h-[450px] items-center justify-center">

                    <div className="text-center">

                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />


                        <p className="mt-4 text-sm text-slate-500">
                            Loading training content...
                        </p>

                    </div>

                </div>

            </DashboardLayout>
        );
    }


    // ==================================================
    // ERROR
    // ==================================================

    if (error) {
        return (
            <DashboardLayout
                role="trainee"
                title="Training"
                subtitle="Unable to open training."
            >

                <div className="p-5 lg:p-6">

                    <div className="rounded-xl border border-red-200 bg-red-50 p-6">

                        <h2 className="text-sm font-bold text-red-700">
                            Training Unavailable
                        </h2>


                        <p className="mt-2 text-xs text-red-600">
                            {error}
                        </p>


                        <button
                            type="button"

                            onClick={
                                () =>
                                    navigate(
                                        "/my-training"
                                    )
                            }

                            className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white"
                        >
                            Back to My Training
                        </button>

                    </div>

                </div>

            </DashboardLayout>
        );
    }


    // ==================================================
    // NO SECTIONS
    // ==================================================

    if (
        !programme ||
        sections.length === 0
    ) {
        return (
            <DashboardLayout
                role="trainee"
                title={
                    programme
                        ?.title ||
                    "Training"
                }

                subtitle="Learning content"
            >

                <div className="p-5 lg:p-6">

                    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                        <div className="text-3xl">
                            📖
                        </div>


                        <h2 className="mt-4 text-base font-bold text-slate-900">
                            No Learning Sections Available
                        </h2>


                        <p className="mt-2 text-xs text-slate-500">
                            This programme does not currently contain any active learning sections.
                        </p>


                        <button
                            type="button"

                            onClick={
                                () =>
                                    navigate(
                                        "/my-training"
                                    )
                            }

                            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
                        >
                            Back to My Training
                        </button>

                    </div>

                </div>

            </DashboardLayout>
        );
    }


    // ==================================================
    // MAIN UI
    // ==================================================

    return (
        <DashboardLayout
            role="trainee"

            title={
                programme.title
            }

            subtitle={
                programmeTypeLabel(
                    programme.programmeType
                )
            }
        >

            <div className="p-5 lg:p-6">

                {/* ==========================================
                    BACK
                ========================================== */}

                <button
                    type="button"

                    onClick={
                        () =>
                            navigate(
                                "/my-training"
                            )
                    }

                    className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600"
                >
                    ← Back to My Training
                </button>


                {/* ==========================================
                    PROGRAMME HEADER
                ========================================== */}

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                        <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-600">
                                {
                                    programmeTypeLabel(
                                        programme.programmeType
                                    )
                                }
                            </p>


                            <h2 className="mt-1 text-xl font-bold text-slate-900">
                                {
                                    programme.title
                                }
                            </h2>


                            <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500">
                                {
                                    programme.description
                                }
                            </p>

                        </div>


                        <div className="flex gap-6">

                            <div>

                                <p className="text-[10px] uppercase text-slate-400">
                                    Trainer
                                </p>


                                <p className="mt-1 text-xs font-semibold text-slate-700">
                                    {
                                        getTrainerName(
                                            programme.owner
                                        )
                                    }
                                </p>

                            </div>


                            <div>

                                <p className="text-[10px] uppercase text-slate-400">
                                    Pass Mark
                                </p>


                                <p className="mt-1 text-xs font-semibold text-slate-700">
                                    {
                                        programme.passMark
                                    }
                                    %
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* PROGRESS BAR */}

                    <div className="mt-5">

                        <div className="mb-2 flex items-center justify-between">

                            <p className="text-[10px] font-semibold text-slate-500">
                                Section {
                                    currentIndex +
                                    1
                                } of {
                                    sections.length
                                }
                            </p>


                            <p className="text-[10px] font-semibold text-blue-600">
                                {
                                    progressPercentage
                                }
                                %
                            </p>

                        </div>


                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                            <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-300"

                                style={{
                                    width:
                                        `${progressPercentage}%`,
                                }}
                            />

                        </div>

                    </div>

                </section>


                {/* ==========================================
                    MAIN LAYOUT
                ========================================== */}

                <div className="mt-5 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">

                    {/* ======================================
                        SECTION LIST
                    ====================================== */}

                    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                            Learning Sections
                        </h3>


                        <div className="mt-4 space-y-2">

                            {
                                sections.map(
                                    (
                                        section,
                                        index
                                    ) => {

                                        const active =
                                            index ===
                                            currentIndex;


                                        return (
                                            <button
                                                key={
                                                    section._id
                                                }

                                                type="button"

                                                onClick={
                                                    () =>
                                                        selectSection(
                                                            index
                                                        )
                                                }

                                                className={`w-full rounded-lg border px-3 py-3 text-left transition ${active
                                                    ? "border-blue-200 bg-blue-50"
                                                    : "border-slate-100 bg-white hover:bg-slate-50"
                                                    }`}
                                            >

                                                <div className="flex items-start gap-3">

                                                    <div
                                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${active
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-slate-100 text-slate-600"
                                                            }`}
                                                    >
                                                        {
                                                            index +
                                                            1
                                                        }
                                                    </div>


                                                    <div>

                                                        <p
                                                            className={`text-xs font-semibold ${active
                                                                ? "text-blue-700"
                                                                : "text-slate-700"
                                                                }`}
                                                        >
                                                            {
                                                                section.title
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            </button>
                                        );
                                    }
                                )
                            }

                        </div>

                    </aside>


                    {/* ======================================
                        CURRENT SECTION
                    ====================================== */}

                    <main className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                        {/* SECTION HEADER */}

                        <div className="border-b border-slate-100 p-5">

                            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                                Section {
                                    currentIndex +
                                    1
                                }
                            </p>


                            <h2 className="mt-2 text-xl font-bold text-slate-900">
                                {
                                    currentSection.title
                                }
                            </h2>

                        </div>


                        {/* IMAGE */}

                        {
                            currentSection.imageUrl && (

                                <div className="border-b border-slate-100 bg-slate-50 p-5">

                                    <img
                                        src={
                                            currentSection.imageUrl
                                        }

                                        alt={
                                            currentSection.imageAltText ||
                                            currentSection.title
                                        }

                                        className="mx-auto max-h-[420px] w-full rounded-lg object-contain"
                                    />

                                </div>
                            )
                        }


                        {/* CONTENT */}

                        <div className="p-5 lg:p-7">

                            <div className="whitespace-pre-line text-sm leading-7 text-slate-700">
                                {
                                    currentSection.content
                                }
                            </div>

                        </div>


                        {/* ==================================
                            PREVIOUS / NEXT
                        ================================== */}

                        <div className="flex items-center justify-between gap-3 border-t border-slate-100 p-5">

                            <button
                                type="button"

                                disabled={
                                    isFirstSection
                                }

                                onClick={
                                    previousSection
                                }

                                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ← Previous
                            </button>


                            <div className="text-center">

                                <p className="text-[10px] text-slate-400">
                                    {
                                        currentIndex +
                                        1
                                    } / {
                                        sections.length
                                    }
                                </p>

                            </div>


                            {
                                !isLastSection
                                    ? (
                                        <button
                                            type="button"

                                            onClick={
                                                nextSection
                                            }

                                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            Next →
                                        </button>
                                    )
                                    : (
                                        <button
                                            type="button"

                                            onClick={
                                                () =>
                                                    navigate(
                                                        "/my-training"
                                                    )
                                            }

                                            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                        >
                                            Finish Reading
                                        </button>
                                    )
                            }

                        </div>

                    </main>

                </div>

            </div>

        </DashboardLayout>
    );
}


export default TraineeLearningPage;