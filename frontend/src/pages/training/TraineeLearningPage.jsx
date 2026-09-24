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
    } =
        useParams();

    const [
        programme,
        setProgramme,
    ] = useState(null);

    const [
        assignment,
        setAssignment,
    ] = useState(null);

    const [
        sections,
        setSections,
    ] = useState([]);

    const [
        currentSectionIndex,
        setCurrentSectionIndex,
    ] = useState(0);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    const loadLearning =
        useCallback(
            async () => {
                if (
                    !programmeId
                ) {
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


                    const loadedSections =
                        parseArrayResponse(
                            sectionsResponse.data,
                            "sections"
                        );


                    setSections(
                        sortLearningSections(
                            loadedSections
                        )
                    );


                    setCurrentSectionIndex(
                        0
                    );

                } catch (
                error
                ) {
                    console.error(
                        "Load trainee learning error:",
                        error
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


    const currentSection =
        useMemo(
            () =>
                sections[
                currentSectionIndex
                ] ||
                null,
            [
                sections,
                currentSectionIndex,
            ]
        );


    const hasPrevious =
        currentSectionIndex >
        0;


    const hasNext =
        currentSectionIndex <
        sections.length -
        1;


    if (
        loading
    ) {
        return (
            <DashboardLayout
                role="trainee"
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
                        message="Loading training content..."
                    />
                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            role="trainee"
            showHeader={
                false
            }
        >
            <div
                className="
                    app-page
                    space-y-5
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


                {/* BACK */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/my-training"
                        )
                    }
                    className="
                        inline-flex
                        min-h-[36px]
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-[#cbd5e1]
                        bg-white
                        px-4
                        text-[9px]
                        font-semibold
                        text-[#52627a]
                        transition
                        hover:bg-[#f8fafc]
                    "
                >
                    ← Back to My Training
                </button>


                {/* PROGRAMME HEADER */}

                {programme && (
                    <LearningProgrammeHeader
                        programme={
                            programme
                        }
                        assignment={
                            assignment
                        }
                    />
                )}


                {sections.length ===
                    0 ? (
                    <EmptyState
                        title="No learning content"
                        message="Learning sections have not been added to this programme yet."
                    />
                ) : (
                    <section
                        className="
                            grid
                            gap-5
                            lg:grid-cols-[260px_minmax(0,1fr)]
                        "
                    >
                        {/* LEFT NAV */}

                        <div
                            className="
                                self-start
                                overflow-hidden
                                rounded-xl
                                border
                                border-[#dbe4ef]
                                bg-white
                                shadow-sm
                                lg:sticky
                                lg:top-5
                            "
                        >
                            <div
                                className="
                                    border-b
                                    border-[#e8eef5]
                                    px-4
                                    py-4
                                "
                            >
                                <h2
                                    className="
                                        text-[11px]
                                        font-bold
                                        text-[#172033]
                                    "
                                >
                                    Learning Sections
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        text-[#64748b]
                                    "
                                >
                                    {sections.length} sections available
                                </p>
                            </div>


                            <LearningSectionList
                                sections={
                                    sections
                                }
                                currentSectionIndex={
                                    currentSectionIndex
                                }
                                onSelect={
                                    setCurrentSectionIndex
                                }
                            />
                        </div>


                        {/* CONTENT */}

                        <div
                            className="
                                min-w-0
                                space-y-4
                            "
                        >
                            {currentSection && (
                                <LearningContentCard
                                    section={
                                        currentSection
                                    }
                                />
                            )}


                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[#dbe4ef]
                                    bg-white
                                    p-4
                                    shadow-sm
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >
                                <button
                                    type="button"
                                    disabled={
                                        !hasPrevious
                                    }
                                    onClick={() =>
                                        setCurrentSectionIndex(
                                            (
                                                current
                                            ) =>
                                                Math.max(
                                                    0,
                                                    current -
                                                    1
                                                )
                                        )
                                    }
                                    className="
                                        min-h-[40px]
                                        rounded-lg
                                        border
                                        border-[#cbd5e1]
                                        bg-white
                                        px-5
                                        text-[9px]
                                        font-semibold
                                        text-[#52627a]
                                        transition
                                        hover:bg-[#f8fafc]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    ← Previous
                                </button>


                                <div
                                    className="
                                        text-center
                                    "
                                >
                                    <p
                                        className="
                                            text-[8px]
                                            text-[#64748b]
                                        "
                                    >
                                        Section
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            font-bold
                                            text-[#172033]
                                        "
                                    >
                                        {currentSectionIndex +
                                            1}{" "}
                                        of{" "}
                                        {sections.length}
                                    </p>
                                </div>


                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            if (currentSection?._id) {
                                                await api.post(`/training-content/trainee/${programmeId}/sections/${currentSection._id}/complete`);
                                            }
                                            if (hasNext) {
                                                setCurrentSectionIndex((current) => Math.min(sections.length - 1, current + 1));
                                            } else {
                                                navigate(`/my-training/${programmeId}/exercise`);
                                            }
                                        } catch (error) {
                                            setErrorMessage(getApiErrorMessage(error, "Unable to record learning completion."));
                                        }
                                    }}
                                    className="
                                        min-h-[40px]
                                        rounded-lg
                                        bg-[#1769e8]
                                        px-5
                                        text-[9px]
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#0b5ed7]
                                        disabled:cursor-not-allowed
                                        disabled:bg-[#94a3b8]
                                    "
                                >
                                    {hasNext ? "Next →" : "Start Exercise →"}
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </DashboardLayout>
    );
}


export default TraineeLearningPage;