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

import LearningProgrammeHeader from "../../components/training/LearningProgrammeHeader";
import LearningSectionList from "../../components/training/LearningSectionList";
import LearningContentCard from "../../components/training/LearningContentCard";

import ActionButton from "../../components/ui/ActionButton";
import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";
import EmptyState from "../../components/ui/EmptyState";

import api from "../../services/api";

import {
    getApiErrorMessage,
    parseArrayResponse,
    sortLearningSections,
} from "../../utils/training";


function TraineeLearningPage() {
    const navigate =
        useNavigate();


    const {
        programmeId,
    } = useParams();


    // ======================================================
    // PROGRAMME
    // ======================================================

    const [
        programme,
        setProgramme,
    ] = useState(null);


    // ======================================================
    // ASSIGNMENT
    // ======================================================

    const [
        assignment,
        setAssignment,
    ] = useState(null);


    // ======================================================
    // LEARNING SECTIONS
    // ======================================================

    const [
        sections,
        setSections,
    ] = useState([]);


    // ======================================================
    // CURRENT SECTION
    // ======================================================

    const [
        currentSectionIndex,
        setCurrentSectionIndex,
    ] = useState(0);


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
    // LOAD LEARNING
    // ======================================================

    const loadLearning =
        useCallback(async () => {
            if (!programmeId) {
                setProgramme(null);

                setAssignment(null);

                setSections([]);

                setErrorMessage(
                    "Training programme information is missing."
                );

                setLoading(false);

                return;
            }


            try {
                setLoading(true);

                setErrorMessage("");


                const [
                    programmeResponse,
                    sectionsResponse,
                ] = await Promise.all([
                    api.get(
                        `/my-training/${programmeId}`
                    ),

                    api.get(
                        `/my-training/${programmeId}/sections`
                    ),
                ]);


                const loadedProgramme =
                    programmeResponse.data
                        ?.programme ||
                    sectionsResponse.data
                        ?.programme ||
                    null;


                setProgramme(
                    loadedProgramme
                );


                setAssignment(
                    programmeResponse.data
                        ?.assignment ||
                    null
                );


                const sectionList =
                    parseArrayResponse(
                        sectionsResponse.data,
                        "sections"
                    );


                const activeSections =
                    sectionList.filter(
                        (
                            section
                        ) =>
                            section?.status ===
                            "active" ||
                            !section?.status
                    );


                setSections(
                    sortLearningSections(
                        activeSections
                    )
                );


                setCurrentSectionIndex(
                    0
                );

            } catch (error) {
                console.error(
                    "Load trainee learning error:",
                    error
                );


                setProgramme(null);

                setAssignment(null);

                setSections([]);


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to load this training programme."
                    )
                );

            } finally {
                setLoading(false);
            }
        }, [
            programmeId,
        ]);


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        loadLearning();
    }, [
        loadLearning,
    ]);


    // ======================================================
    // CURRENT SECTION
    // ======================================================

    const currentSection =
        useMemo(() => {
            if (
                sections.length ===
                0
            ) {
                return null;
            }


            return (
                sections[
                currentSectionIndex
                ] ||
                null
            );
        }, [
            sections,
            currentSectionIndex,
        ]);


    // ======================================================
    // PROGRESS DISPLAY
    // ======================================================

    const learningProgress =
        sections.length >
            0
            ? Math.round(
                ((currentSectionIndex +
                    1) /
                    sections.length) *
                100
            )
            : 0;


    // ======================================================
    // SELECT SECTION
    // ======================================================

    const handleSelectSection = (
        index
    ) => {
        if (
            index < 0 ||
            index >=
            sections.length
        ) {
            return;
        }


        setCurrentSectionIndex(
            index
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // ======================================================
    // PREVIOUS
    // ======================================================

    const handlePrevious = () => {
        if (
            currentSectionIndex <=
            0
        ) {
            return;
        }


        handleSelectSection(
            currentSectionIndex -
            1
        );
    };


    // ======================================================
    // NEXT
    // ======================================================

    const handleNext = () => {
        if (
            currentSectionIndex >=
            sections.length -
            1
        ) {
            return;
        }


        handleSelectSection(
            currentSectionIndex +
            1
        );
    };


    // ======================================================
    // FINISH
    // ======================================================

    const handleFinish = () => {
        navigate(
            "/my-training"
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

                <div className="space-y-5">

                    <div
                        className="
                            rounded-2xl
                            border
                            border-blue-100
                            bg-gradient-to-r
                            from-[#073763]
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
                            Workplace Safety Learning
                        </p>


                        <h1
                            className="
                                mt-2
                                text-xl
                                font-bold
                            "
                        >
                            Loading Training Programme
                        </h1>
                    </div>


                    <LoadingCard
                        message="Loading training content..."
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
                {/* BACK BAR */}
                {/* ================================================= */}

                <section
                    className="
                        flex
                        flex-col
                        gap-3
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-3
                        shadow-sm
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

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
                        ← Back to My Training
                    </ActionButton>


                    {programme &&
                        sections.length >
                        0 && (
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    sm:justify-end
                                "
                            >

                                <span
                                    className="
                                        text-[9px]
                                        font-semibold
                                        text-slate-500
                                    "
                                >
                                    Learning Progress
                                </span>


                                <span
                                    className="
                                        rounded-full
                                        bg-blue-50
                                        px-3
                                        py-1.5
                                        text-[9px]
                                        font-bold
                                        text-blue-700
                                    "
                                >
                                    {learningProgress}%
                                </span>

                            </div>
                        )}

                </section>


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
                {/* UNAVAILABLE */}
                {/* ================================================= */}

                {!programme ? (
                    <EmptyState
                        title="Training programme unavailable."
                        description="This programme is not assigned to you or is currently unavailable."
                        action={
                            <ActionButton
                                variant="primary"
                                onClick={() =>
                                    navigate(
                                        "/my-training"
                                    )
                                }
                            >
                                Return to My Training
                            </ActionButton>
                        }
                    />
                ) : (
                    <>

                        {/* ================================================= */}
                        {/* PROGRAMME HEADER */}
                        {/* ================================================= */}

                        <LearningProgrammeHeader
                            programme={
                                programme
                            }
                            currentSection={
                                currentSectionIndex
                            }
                            totalSections={
                                sections.length
                            }
                        />


                        {/* ================================================= */}
                        {/* ASSIGNMENT */}
                        {/* ================================================= */}

                        {assignment && (
                            <section
                                className="
                                    rounded-xl
                                    border
                                    border-emerald-200
                                    bg-gradient-to-r
                                    from-emerald-50
                                    to-white
                                    p-4
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
                                            text-emerald-600
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
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="9"
                                            />

                                            <path d="m8 12 2.5 2.5L16 9" />
                                        </svg>
                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-[11px]
                                                font-bold
                                                text-emerald-800
                                            "
                                        >
                                            Training Access Active
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-[9px]
                                                leading-5
                                                text-emerald-700
                                            "
                                        >
                                            This programme is actively
                                            assigned to your Trainee
                                            account.
                                        </p>

                                    </div>

                                </div>

                            </section>
                        )}


                        {/* ================================================= */}
                        {/* NO SECTIONS */}
                        {/* ================================================= */}

                        {sections.length ===
                            0 ? (
                            <EmptyState
                                title="No learning content available."
                                description="This programme does not currently contain any active learning sections."
                            />
                        ) : (
                            <section
                                className="
                                    grid
                                    items-start
                                    gap-5
                                    xl:grid-cols-[300px_minmax(0,1fr)]
                                "
                            >

                                {/* ========================================== */}
                                {/* SECTION NAVIGATION */}
                                {/* ========================================== */}

                                <div
                                    className="
                                        xl:sticky
                                        xl:top-5
                                    "
                                >
                                    <LearningSectionList
                                        sections={
                                            sections
                                        }
                                        currentSectionIndex={
                                            currentSectionIndex
                                        }
                                        onSelectSection={
                                            handleSelectSection
                                        }
                                    />
                                </div>


                                {/* ========================================== */}
                                {/* CONTENT */}
                                {/* ========================================== */}

                                <div className="min-w-0">

                                    <LearningContentCard
                                        section={
                                            currentSection
                                        }
                                        currentIndex={
                                            currentSectionIndex
                                        }
                                        totalSections={
                                            sections.length
                                        }
                                        onPrevious={
                                            handlePrevious
                                        }
                                        onNext={
                                            handleNext
                                        }
                                        onFinish={
                                            handleFinish
                                        }
                                    />

                                </div>

                            </section>
                        )}

                    </>
                )}

            </div>

        </DashboardLayout>
    );
}


export default TraineeLearningPage;