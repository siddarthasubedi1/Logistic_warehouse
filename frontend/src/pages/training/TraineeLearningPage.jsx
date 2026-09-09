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
    // LOAD LEARNING PROGRAMME
    // ======================================================
    //
    // Backend endpoints:
    //
    // GET /api/my-training/:programmeId
    //
    // Returns:
    // - programme
    // - assignment
    // - sectionCount
    //
    // GET /api/my-training/:programmeId/sections
    //
    // Returns only active learning sections that belong
    // to an actively assigned and active programme.
    //
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


                // ------------------------------------------
                // Load the assigned programme and its
                // learning sections.
                // ------------------------------------------

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


                // ------------------------------------------
                // PROGRAMME
                // ------------------------------------------

                const loadedProgramme =
                    programmeResponse.data
                        ?.programme ||
                    sectionsResponse.data
                        ?.programme ||
                    null;


                setProgramme(
                    loadedProgramme
                );


                // ------------------------------------------
                // ASSIGNMENT
                // ------------------------------------------

                setAssignment(
                    programmeResponse.data
                        ?.assignment ||
                    null
                );


                // ------------------------------------------
                // SECTIONS
                // ------------------------------------------

                const sectionList =
                    parseArrayResponse(
                        sectionsResponse.data,
                        "sections"
                    );


                /*
                    The backend already returns only active
                    sections for the Trainee.

                    We still keep this small frontend guard so
                    inactive content is never displayed if the
                    API response changes unexpectedly.
                */

                const activeSections =
                    sectionList.filter(
                        (section) =>
                            section?.status ===
                            "active" ||
                            !section?.status
                    );


                setSections(
                    sortLearningSections(
                        activeSections
                    )
                );


                // Start from first section every time a new
                // programme is loaded.
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
    // PREVIOUS SECTION
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
    // NEXT SECTION
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
    // FINISH READING
    // ======================================================
    //
    // Sprint 2 only provides learning-content navigation.
    //
    // Persistent completion/progress belongs to the later
    // progress module, so we do not create a fake completion
    // API call here.
    //
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
            <div className="space-y-6">

                {/* ========================================== */}
                {/* BACK */}
                {/* ========================================== */}

                <div>
                    <ActionButton
                        variant="secondary"
                        onClick={() =>
                            navigate(
                                "/my-training"
                            )
                        }
                    >
                        ← Back to My Training
                    </ActionButton>
                </div>


                {/* ========================================== */}
                {/* ERROR */}
                {/* ========================================== */}

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


                {/* ========================================== */}
                {/* PROGRAMME UNAVAILABLE */}
                {/* ========================================== */}

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

                        {/* ================================== */}
                        {/* PROGRAMME HEADER */}
                        {/* ================================== */}

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


                        {/* ================================== */}
                        {/* ASSIGNMENT INFORMATION */}
                        {/* ================================== */}

                        {assignment && (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-blue-100
                                    bg-blue-50
                                    px-4
                                    py-3
                                "
                            >
                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        text-blue-700
                                    "
                                >
                                    This programme is actively assigned
                                    to your account.
                                </p>
                            </div>
                        )}


                        {/* ================================== */}
                        {/* NO SECTIONS */}
                        {/* ================================== */}

                        {sections.length ===
                            0 ? (
                            <EmptyState
                                title="No learning content available."
                                description="This programme does not currently contain any active learning sections."
                            />
                        ) : (
                            <div
                                className="
                                    grid
                                    gap-6
                                    lg:grid-cols-[300px_minmax(0,1fr)]
                                "
                            >

                                {/* ========================== */}
                                {/* SECTION LIST */}
                                {/* ========================== */}

                                <div>
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


                                {/* ========================== */}
                                {/* LEARNING CONTENT */}
                                {/* ========================== */}

                                <div>
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

                            </div>
                        )}

                    </>
                )}

            </div>
        </DashboardLayout>
    );
}


export default TraineeLearningPage;