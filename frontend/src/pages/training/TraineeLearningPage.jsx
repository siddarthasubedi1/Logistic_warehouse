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

                    setLoading(false);

                    return;
                }

                try {
                    setLoading(true);
                    setErrorMessage("");

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
                                !section.status ||
                                section.status ===
                                "active"
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


    const learningProgress =
        sections.length > 0
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


    const handlePrevious =
        () => {
            setCurrentSectionIndex(
                (
                    current
                ) =>
                    Math.max(
                        0,
                        current - 1
                    )
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };


    const handleNext =
        () => {
            setCurrentSectionIndex(
                (
                    current
                ) =>
                    Math.min(
                        sections.length -
                        1,
                        current + 1
                    )
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };


    const handleFinish =
        () => {
            navigate(
                "/my-training"
            );
        };


    if (loading) {
        return (
            <DashboardLayout
                role="trainee"
                title="Learning"
                subtitle="Loading your workplace safety training."
            >
                <LoadingCard
                    message="Loading learning content..."
                />
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            role="trainee"
            title="Learning"
            subtitle="Complete your assigned workplace safety training."
        >
            <div
                className="
                    space-y-4
                "
            >
                {/* TOP ACTION */}

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
                    <div>
                        <p
                            className="
                                text-[8px]
                                font-semibold
                                text-slate-600
                            "
                        >
                            Learning Progress
                        </p>

                        <p
                            className="
                                mt-1
                                text-[18px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            {learningProgress}%
                        </p>
                    </div>


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
                </section>


                <FeedbackAlert
                    type="error"
                    message={
                        errorMessage
                    }
                    onClose={() =>
                        setErrorMessage("")
                    }
                />


                {!programme ? (
                    <section
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                        "
                    >
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
                    </section>
                ) : (
                    <>
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
                                    ✓
                                </div>


                                <div>
                                    <p
                                        className="
                                            text-[9px]
                                            font-bold
                                            text-emerald-800
                                        "
                                    >
                                        Training Access Active
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[8px]
                                            font-medium
                                            text-emerald-700
                                        "
                                    >
                                        This programme is assigned to your Trainee account.
                                    </p>
                                </div>
                            </section>
                        )}


                        {sections.length ===
                            0 ? (
                            <section
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    shadow-sm
                                "
                            >
                                <EmptyState
                                    title="No learning content available."
                                    description="This programme currently has no active learning sections."
                                    icon="training"
                                />
                            </section>
                        ) : (
                            <section
                                className="
                                    grid
                                    min-w-0
                                    gap-4
                                    lg:grid-cols-[270px_minmax(0,1fr)]
                                "
                            >
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