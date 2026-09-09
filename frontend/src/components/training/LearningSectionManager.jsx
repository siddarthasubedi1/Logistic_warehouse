import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import api from "../../services/api";

import LearningSectionForm from "./LearningSectionForm";
import LearningSectionTable from "./LearningSectionTable";

import ActionButton from "../ui/ActionButton";
import EmptyState from "../ui/EmptyState";
import FeedbackAlert from "../ui/FeedbackAlert";
import LoadingCard from "../ui/LoadingCard";
import StatusBadge from "../ui/StatusBadge";

import {
    formatProgrammeType,
    getApiErrorMessage,
    parseArrayResponse,
    sortLearningSections,
} from "../../utils/training";


// ======================================================
// ALLOWED SECTION STATUSES
// ======================================================

const SECTION_STATUSES = [
    "active",
    "inactive",
];


// ======================================================
// INITIAL FORM DATA
// ======================================================

const getInitialFormData =
    () => ({
        title:
            "",

        content:
            "",

        imageUrl:
            "",

        imageAltText:
            "",

        status:
            "active",
    });


// ======================================================
// LEARNING SECTION MANAGER
// ======================================================

function LearningSectionManager() {
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
    // SECTIONS
    // ======================================================

    const [
        sections,
        setSections,
    ] = useState([]);


    // ======================================================
    // FORM
    // ======================================================

    const [
        showForm,
        setShowForm,
    ] = useState(false);


    const [
        editingSection,
        setEditingSection,
    ] = useState(null);


    const [
        formData,
        setFormData,
    ] = useState(
        getInitialFormData()
    );


    // ======================================================
    // LOADING STATE
    // ======================================================

    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        saving,
        setSaving,
    ] = useState(false);


    const [
        processingId,
        setProcessingId,
    ] = useState("");


    // ======================================================
    // FEEDBACK
    // ======================================================

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    // ======================================================
    // CLEAR FEEDBACK
    // ======================================================

    const clearFeedback = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };


    // ======================================================
    // LOAD PROGRAMME
    // ======================================================

    const loadProgramme =
        useCallback(async () => {
            const response =
                await api.get(
                    `/training-programmes/${programmeId}`
                );


            const loadedProgramme =
                response.data?.programme ||
                response.data ||
                null;


            setProgramme(
                loadedProgramme
            );


            return loadedProgramme;

        }, [
            programmeId,
        ]);


    // ======================================================
    // LOAD SECTIONS
    // ======================================================

    const loadSections =
        useCallback(async () => {
            const response =
                await api.get(
                    `/training-programmes/${programmeId}/sections`
                );


            const responseSections =
                parseArrayResponse(
                    response.data,
                    "sections"
                );


            const sortedSections =
                sortLearningSections(
                    responseSections
                );


            setSections(
                sortedSections
            );


            return sortedSections;

        }, [
            programmeId,
        ]);


    // ======================================================
    // INITIAL PAGE LOAD
    // ======================================================

    useEffect(() => {
        let active =
            true;


        const loadPage =
            async () => {
                try {
                    setLoading(
                        true
                    );


                    clearFeedback();


                    await Promise.all([
                        loadProgramme(),
                        loadSections(),
                    ]);

                } catch (error) {
                    console.error(
                        "Learning section load error:",
                        error
                    );


                    if (active) {
                        setErrorMessage(
                            getApiErrorMessage(
                                error,
                                "Unable to load programme sections."
                            )
                        );
                    }

                } finally {
                    if (active) {
                        setLoading(
                            false
                        );
                    }
                }
            };


        loadPage();


        return () => {
            active =
                false;
        };

    }, [
        loadProgramme,
        loadSections,
    ]);


    // ======================================================
    // FORM CHANGE
    // ======================================================

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;


        clearFeedback();


        setFormData(
            (current) => ({
                ...current,

                [name]:
                    value,
            })
        );
    };


    // ======================================================
    // RESET FORM
    // ======================================================

    const resetForm = () => {
        setEditingSection(
            null
        );


        setFormData(
            getInitialFormData()
        );


        setShowForm(
            false
        );
    };


    // ======================================================
    // ADD SECTION
    // ======================================================

    const handleAddSection = () => {
        clearFeedback();


        if (
            programme?.status ===
            "inactive"
        ) {
            setErrorMessage(
                "Learning sections cannot be added while the training programme is inactive."
            );

            return;
        }


        setEditingSection(
            null
        );


        setFormData(
            getInitialFormData()
        );


        setShowForm(
            true
        );


        window.scrollTo({
            top:
                0,

            behavior:
                "smooth",
        });
    };


    // ======================================================
    // EDIT SECTION
    // ======================================================

    const handleEditSection = (
        section
    ) => {
        if (
            !section?._id
        ) {
            return;
        }


        clearFeedback();


        if (
            programme?.status ===
            "inactive"
        ) {
            setErrorMessage(
                "Learning sections cannot be edited while the training programme is inactive."
            );

            return;
        }


        setEditingSection(
            section
        );


        setFormData({
            title:
                section.title ||
                "",

            content:
                section.content ||
                "",

            imageUrl:
                section.imageUrl ||
                "",

            imageAltText:
                section.imageAltText ||
                "",

            status:
                section.status ||
                "active",
        });


        setShowForm(
            true
        );


        window.scrollTo({
            top:
                0,

            behavior:
                "smooth",
        });
    };


    // ======================================================
    // VALIDATE FORM
    // ======================================================

    const validateForm = () => {
        const title =
            formData
                .title
                .trim();


        const content =
            formData
                .content
                .trim();


        const imageUrl =
            formData
                .imageUrl
                .trim();


        const imageAltText =
            formData
                .imageAltText
                .trim();


        // ------------------------------------------
        // TITLE
        // ------------------------------------------

        if (
            title.length <
            2 ||
            title.length >
            150
        ) {
            return (
                "Learning section title must be between 2 and 150 characters."
            );
        }


        // ------------------------------------------
        // CONTENT
        // ------------------------------------------

        if (!content) {
            return (
                "Learning section content is required."
            );
        }


        // ------------------------------------------
        // IMAGE ALT TEXT LENGTH
        // ------------------------------------------

        if (
            imageAltText.length >
            250
        ) {
            return (
                "Image alternative text cannot exceed 250 characters."
            );
        }


        // ------------------------------------------
        // IMAGE REQUIRES ALT TEXT
        // ------------------------------------------

        if (
            imageUrl &&
            !imageAltText
        ) {
            return (
                "Alternative text is required when the learning section contains an image."
            );
        }


        // ------------------------------------------
        // STATUS
        // ------------------------------------------

        if (
            !SECTION_STATUSES.includes(
                formData.status
            )
        ) {
            return (
                "Learning section status must be active or inactive."
            );
        }


        return "";
    };


    // ======================================================
    // SAVE SECTION
    // ======================================================

    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();


            clearFeedback();


            if (
                programme?.status ===
                "inactive"
            ) {
                setErrorMessage(
                    "Learning sections cannot be changed while the training programme is inactive."
                );

                return;
            }


            const validationError =
                validateForm();


            if (
                validationError
            ) {
                setErrorMessage(
                    validationError
                );

                return;
            }


            const payload = {
                title:
                    formData
                        .title
                        .trim(),

                content:
                    formData
                        .content
                        .trim(),

                imageUrl:
                    formData
                        .imageUrl
                        .trim(),

                imageAltText:
                    formData
                        .imageAltText
                        .trim(),

                status:
                    formData.status,
            };


            try {
                setSaving(
                    true
                );


                // ------------------------------------------
                // UPDATE
                // ------------------------------------------

                if (
                    editingSection
                ) {
                    const response =
                        await api.patch(
                            `/training-programmes/${programmeId}/sections/${editingSection._id}`,
                            payload
                        );


                    setSuccessMessage(
                        response.data?.message ||
                        "Learning section updated successfully."
                    );

                } else {

                    // --------------------------------------
                    // CREATE
                    // --------------------------------------

                    const response =
                        await api.post(
                            `/training-programmes/${programmeId}/sections`,
                            payload
                        );


                    setSuccessMessage(
                        response.data?.message ||
                        "Learning section created successfully."
                    );
                }


                resetForm();


                await loadSections();

            } catch (error) {
                console.error(
                    "Save learning section error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to save the learning section."
                    )
                );

            } finally {
                setSaving(
                    false
                );
            }
        };


    // ======================================================
    // DEACTIVATE SECTION
    // ======================================================

    const handleDeactivate =
        async (
            section
        ) => {
            if (
                !section?._id
            ) {
                return;
            }


            if (
                processingId
            ) {
                return;
            }


            const confirmed =
                window.confirm(
                    `Deactivate "${section.title}"?`
                );


            if (
                !confirmed
            ) {
                return;
            }


            clearFeedback();


            try {
                setProcessingId(
                    section._id
                );


                const response =
                    await api.delete(
                        `/training-programmes/${programmeId}/sections/${section._id}`
                    );


                setSuccessMessage(
                    response.data?.message ||
                    "Learning section deactivated successfully."
                );


                if (
                    editingSection?._id ===
                    section._id
                ) {
                    resetForm();
                }


                await loadSections();

            } catch (error) {
                console.error(
                    "Deactivate learning section error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to deactivate this learning section."
                    )
                );

            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    // ======================================================
    // REACTIVATE SECTION
    // ======================================================

    const handleReactivate =
        async (
            section
        ) => {
            if (
                !section?._id
            ) {
                return;
            }


            if (
                processingId
            ) {
                return;
            }


            clearFeedback();


            try {
                setProcessingId(
                    section._id
                );


                const response =
                    await api.patch(
                        `/training-programmes/${programmeId}/sections/${section._id}/reactivate`
                    );


                setSuccessMessage(
                    response.data?.message ||
                    "Learning section reactivated successfully."
                );


                await loadSections();

            } catch (error) {
                console.error(
                    "Reactivate learning section error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reactivate this learning section."
                    )
                );

            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    // ======================================================
    // REORDER SECTIONS
    // ======================================================

    const reorderSections =
        async (
            reorderedSections
        ) => {
            if (
                processingId
            ) {
                return;
            }


            if (
                programme?.status ===
                "inactive"
            ) {
                setErrorMessage(
                    "Learning sections cannot be reordered while the training programme is inactive."
                );

                return;
            }


            if (
                !Array.isArray(
                    reorderedSections
                ) ||
                reorderedSections.length ===
                0
            ) {
                return;
            }


            clearFeedback();


            // Keep previous order so it can be restored
            // visually if the API request fails.
            const previousSections =
                sections;


            // Update the displayed order immediately.
            const optimisticSections =
                reorderedSections.map(
                    (
                        section,
                        index
                    ) => ({
                        ...section,

                        order:
                            index +
                            1,
                    })
                );


            setSections(
                optimisticSections
            );


            try {
                setProcessingId(
                    "reorder"
                );


                const response =
                    await api.put(
                        `/training-programmes/${programmeId}/sections/reorder`,
                        {
                            sectionIds:
                                reorderedSections.map(
                                    (
                                        section
                                    ) =>
                                        section._id
                                ),
                        }
                    );


                setSuccessMessage(
                    response.data?.message ||
                    "Learning section order updated successfully."
                );


                await loadSections();

            } catch (error) {
                console.error(
                    "Reorder learning sections error:",
                    error
                );


                // Restore the previous display order.
                setSections(
                    previousSections
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reorder learning sections."
                    )
                );


                // Reload server state so frontend and
                // backend remain synchronized.
                try {
                    await loadSections();

                } catch (reloadError) {
                    console.error(
                        "Reload sections after reorder error:",
                        reloadError
                    );
                }

            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    // ======================================================
    // MOVE UP
    // ======================================================

    const handleMoveUp = (
        section,
        index
    ) => {
        if (
            !section?._id ||
            index <=
            0 ||
            processingId
        ) {
            return;
        }


        const reordered =
            [
                ...sections,
            ];


        [
            reordered[
            index -
            1
            ],
            reordered[
            index
            ],
        ] = [
                reordered[
                index
                ],
                reordered[
                index -
                1
                ],
            ];


        reorderSections(
            reordered
        );
    };


    // ======================================================
    // MOVE DOWN
    // ======================================================

    const handleMoveDown = (
        section,
        index
    ) => {
        if (
            !section?._id ||
            index >=
            sections.length -
            1 ||
            processingId
        ) {
            return;
        }


        const reordered =
            [
                ...sections,
            ];


        [
            reordered[
            index +
            1
            ],
            reordered[
            index
            ],
        ] = [
                reordered[
                index
                ],
                reordered[
                index +
                1
                ],
            ];


        reorderSections(
            reordered
        );
    };


    // ======================================================
    // LOADING
    // ======================================================

    if (
        loading
    ) {
        return (
            <LoadingCard
                message="Loading learning sections..."
            />
        );
    }


    // ======================================================
    // PROGRAMME NOT FOUND
    // ======================================================

    if (
        !programme
    ) {
        return (
            <EmptyState
                title="Programme not found."
                description="The requested training programme could not be loaded."
                action={
                    <ActionButton
                        variant="primary"
                        onClick={() =>
                            navigate(
                                "/training-programmes"
                            )
                        }
                    >
                        Back to Programmes
                    </ActionButton>
                }
            />
        );
    }


    const programmeInactive =
        programme.status ===
        "inactive";


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <div className="space-y-6">

            {/* ================================================= */}
            {/* PROGRAMME HEADER */}
            {/* ================================================= */}

            <section
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >

                    <div>

                        <div className="flex flex-wrap items-center gap-2">

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-blue-600
                                "
                            >
                                {formatProgrammeType(
                                    programme.programmeType
                                )}
                            </p>


                            <StatusBadge
                                status={
                                    programme.status
                                }
                            />

                        </div>


                        <h2
                            className="
                                mt-2
                                text-xl
                                font-bold
                                text-slate-900
                            "
                        >
                            {programme.title}
                        </h2>


                        {programme.description && (
                            <p
                                className="
                                    mt-2
                                    max-w-3xl
                                    text-xs
                                    leading-5
                                    text-slate-500
                                "
                            >
                                {programme.description}
                            </p>
                        )}


                        <p className="mt-3 text-xs font-medium text-slate-500">
                            {sections.length}{" "}
                            {sections.length ===
                                1
                                ? "learning section"
                                : "learning sections"}
                        </p>

                    </div>


                    <div className="flex flex-wrap gap-2">

                        <ActionButton
                            variant="secondary"
                            onClick={() =>
                                navigate(
                                    "/training-programmes"
                                )
                            }
                        >
                            ← Back
                        </ActionButton>


                        {!programmeInactive && (
                            <ActionButton
                                variant="primary"
                                onClick={
                                    handleAddSection
                                }
                                disabled={
                                    saving ||
                                    Boolean(
                                        processingId
                                    )
                                }
                            >
                                + Add Section
                            </ActionButton>
                        )}

                    </div>

                </div>

            </section>


            {/* ================================================= */}
            {/* INACTIVE PROGRAMME NOTICE */}
            {/* ================================================= */}

            {programmeInactive && (
                <FeedbackAlert
                    type="warning"
                    message="This training programme is inactive. New sections cannot be added and existing sections cannot be edited or reordered until the programme is reactivated."
                />
            )}


            {/* ================================================= */}
            {/* SUCCESS */}
            {/* ================================================= */}

            <FeedbackAlert
                type="success"
                message={
                    successMessage
                }
                onClose={() =>
                    setSuccessMessage(
                        ""
                    )
                }
            />


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
            {/* SECTION FORM */}
            {/* ================================================= */}

            {showForm &&
                !programmeInactive && (
                    <LearningSectionForm
                        formData={
                            formData
                        }
                        editingSection={
                            editingSection
                        }
                        saving={
                            saving
                        }
                        onChange={
                            handleChange
                        }
                        onSubmit={
                            handleSubmit
                        }
                        onCancel={
                            resetForm
                        }
                    />
                )}


            {/* ================================================= */}
            {/* LEARNING SECTION TABLE */}
            {/* ================================================= */}

            <section
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >

                <div className="border-b border-slate-200 p-5">

                    <h3 className="text-base font-bold text-slate-900">
                        Learning Sections
                    </h3>


                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Add learning content and control the order in
                        which Trainees move through the programme.
                    </p>

                </div>


                <LearningSectionTable
                    sections={
                        sections
                    }
                    processingId={
                        processingId
                    }
                    programmeInactive={
                        programmeInactive
                    }
                    onEdit={
                        handleEditSection
                    }
                    onDeactivate={
                        handleDeactivate
                    }
                    onReactivate={
                        handleReactivate
                    }
                    onMoveUp={
                        handleMoveUp
                    }
                    onMoveDown={
                        handleMoveDown
                    }
                />

            </section>

        </div>
    );
}


export default LearningSectionManager;