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


// ======================================================
// TRAINEE LEARNING PAGE
// ======================================================

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
    // SECTIONS
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
        useCallback(
            async () => {
                if (
                    !programmeId
                ) {
                    setProgramme(
                        null
                    );

                    setAssignment(
                        null
                    );

                    setSections(
                        []
                    );

                    setErrorMessage(
                        "Training programme information is missing."
                    );

                    setLoading(
                        false
                    );

                    return;
                }


                try {
                    setLoading(
                        true
                    );


                    setErrorMessage(
                        ""
                    );


                    const [
                        programmeResponse,
                        sectionsResponse,
                    ] =
                        await Promise.all([
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
                                section.status ===
                                "active" ||
                                !section.status
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


                    setProgramme(
                        null
                    );

                    setAssignment(
                        null
                    );

                    setSections(
                        []
                    );


                    setErrorMessage(
                        getApiErrorMessage(
                            error,
                            "Unable to load this training programme."
                        )
                    );

                } finally {
                    setLoading(
                        false
                    );
                }
            },
            [
                programmeId,
            ]
        );


    useEffect(() => {
        loadLearning();
    }, [
        loadLearning,
    ]);


    // ======================================================
    // CURRENT SECTION
    // ======================================================

    const currentSection =
        useMemo(
            () => {
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
            },
            [
                sections,
                currentSectionIndex,
            ]
        );


    // ======================================================
    // PROGRESS
    // ======================================================

    const learningProgress =
        sections.length >
            0
            ? Math.round(
                (
                    (
                        currentSectionIndex +
                        1
                    ) /
                    sections.length
                ) *
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
            index <
            0 ||
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
            behavior:
                "smooth",
        });
    };


    // ======================================================
    // PREVIOUS
    // ======================================================

    const handlePrevious =
        () => {
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

    const handleNext =
        () => {
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

    const handleFinish =
        () => {
            navigate(
                "/my-training"
            );
        };


    // ======================================================
    // LOADING
    // ======================================================

    if (
        loading
    ) {
        return (
            <DashboardLayout
                role="trainee"
                title="Training"
                subtitle="Loading workplace safety learning content."
            >
                <LoadingCard
                    message="Loading training content..."
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
            showHeader={false}
        >
            <div
                className="
                    space-y-4
                "
            >
                {/* ================================================= */}
                {/* TOP BAR */}
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
                        p-4
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
                                    text-[8px]
                                    text-slate-400
                                "
                                >
                                    Learning Progress
                                </span>


                                <span
                                    className="
                                    rounded-full
                                    bg-blue-50
                                    px-3
                                    py-1
                                    text-[8px]
                                    font-medium
                                    text-blue-600
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
                        {/* ASSIGNMENT STATUS */}
                        {/* ================================================= */}

                        {assignment && (
                            <section
                                className="
                                    flex
                                    items-start
                                    gap-3
                                    rounded-xl
                                    border
                                    border-emerald-200
                                    bg-emerald-50
                                    p-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white
                                        text-emerald-600
                                    "
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-4 w-4"
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
                                            text-[9px]
                                            font-medium
                                            text-emerald-700
                                        "
                                    >
                                        Training Access Active
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-[8px]
                                            leading-4
                                            text-emerald-600
                                        "
                                    >
                                        This programme is assigned to your Trainee account.
                                    </p>
                                </div>
                            </section>
                        )}


                        {/* ================================================= */}
                        {/* CONTENT */}
                        {/* ================================================= */}

                        {sections.length ===
                            0 ? (
                            <EmptyState
                                title="No learning content available."
                                description="This programme does not currently contain active learning sections."
                                icon="training"
                            />
                        ) : (
                            <section
                                className="
                                    grid
                                    gap-4
                                    lg:grid-cols-[250px_minmax(0,1fr)]
                                    xl:grid-cols-[280px_minmax(0,1fr)]
                                "
                            >
                                {/* ========================================= */}
                                {/* SECTION NAVIGATION */}
                                {/* ========================================= */}

                                <div
                                    className="
                                        min-w-0
                                    "
                                >
                                    <div
                                        className="
                                            lg:sticky
                                            lg:top-4
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
                                </div>


                                {/* ========================================= */}
                                {/* LEARNING CONTENT */}
                                {/* ========================================= */}

                                <div
                                    className="
                                        min-w-0
                                    "
                                >
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