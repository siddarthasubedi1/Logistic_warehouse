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


const SECTION_STATUSES = [
    "active",
    "inactive",
];


const getInitialFormData =
    () => ({
        title: "",
        content: "",
        imageUrl: "",
        imageAltText: "",
        status: "active",
    });


function LearningSectionManager() {
    const navigate =
        useNavigate();


    const {
        programmeId,
    } = useParams();


    const [
        programme,
        setProgramme,
    ] = useState(null);


    const [
        sections,
        setSections,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


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


    const [
        saving,
        setSaving,
    ] = useState(false);


    const [
        processingId,
        setProcessingId,
    ] = useState("");


    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    // ======================================================
    // FEEDBACK
    // ======================================================

    const clearFeedback =
        () => {
            setErrorMessage("");
            setSuccessMessage("");
        };


    // ======================================================
    // LOAD PROGRAMME
    // ======================================================

    const loadProgramme =
        useCallback(
            async () => {
                const response =
                    await api.get(
                        `/training-programmes/${programmeId}`
                    );


                const loadedProgramme =
                    response.data
                        ?.programme ||
                    response.data ||
                    null;


                setProgramme(
                    loadedProgramme
                );


                return loadedProgramme;
            },
            [
                programmeId,
            ]
        );


    // ======================================================
    // LOAD SECTIONS
    // ======================================================

    const loadSections =
        useCallback(
            async () => {
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
            },
            [
                programmeId,
            ]
        );


    // ======================================================
    // INITIAL LOAD
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


                    if (
                        active
                    ) {
                        setErrorMessage(
                            getApiErrorMessage(
                                error,
                                "Unable to load programme sections."
                            )
                        );
                    }

                } finally {
                    if (
                        active
                    ) {
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
        } =
            event.target;


        clearFeedback();


        setFormData(
            (
                current
            ) => ({
                ...current,

                [name]:
                    value,
            })
        );
    };


    // ======================================================
    // RESET FORM
    // ======================================================

    const resetForm =
        () => {
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

    const handleAddSection =
        () => {
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
                top: 0,
                behavior: "smooth",
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
            top: 0,
            behavior: "smooth",
        });
    };


    // ======================================================
    // VALIDATION
    // ======================================================

    const validateForm =
        () => {
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


            if (
                title.length <
                2 ||
                title.length >
                150
            ) {
                return "Learning section title must be between 2 and 150 characters.";
            }


            if (
                !content
            ) {
                return "Learning section content is required.";
            }


            if (
                imageAltText.length >
                250
            ) {
                return "Image alternative text cannot exceed 250 characters.";
            }


            if (
                imageUrl &&
                !imageAltText
            ) {
                return "Alternative text is required when the learning section contains an image.";
            }


            if (
                !SECTION_STATUSES.includes(
                    formData.status
                )
            ) {
                return "Learning section status must be active or inactive.";
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


                if (
                    editingSection
                ) {
                    const response =
                        await api.patch(
                            `/training-programmes/${programmeId}/sections/${editingSection._id}`,
                            payload
                        );


                    setSuccessMessage(
                        response.data
                            ?.message ||
                        "Learning section updated successfully."
                    );

                } else {
                    const response =
                        await api.post(
                            `/training-programmes/${programmeId}/sections`,
                            payload
                        );


                    setSuccessMessage(
                        response.data
                            ?.message ||
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
    // DEACTIVATE
    // ======================================================

    const handleDeactivate =
        async (
            section
        ) => {
            if (
                !section?._id ||
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
                    response.data
                        ?.message ||
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
    // REACTIVATE
    // ======================================================

    const handleReactivate =
        async (
            section
        ) => {
            if (
                !section?._id ||
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
                    response.data
                        ?.message ||
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
    // REORDER
    // ======================================================

    const reorderSections =
        async (
            reorderedSections
        ) => {
            if (
                processingId ||
                programme?.status ===
                "inactive" ||
                !Array.isArray(
                    reorderedSections
                ) ||
                reorderedSections.length ===
                0
            ) {
                return;
            }


            clearFeedback();


            const previousSections =
                sections;


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
                    response.data
                        ?.message ||
                    "Learning section order updated successfully."
                );


                await loadSections();

            } catch (error) {
                console.error(
                    "Reorder learning sections error:",
                    error
                );


                setSections(
                    previousSections
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reorder learning sections."
                    )
                );


                try {
                    await loadSections();

                } catch (
                reloadError
                ) {
                    console.error(
                        "Reload sections error:",
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


        const reordered = [
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


        const reordered = [
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
    // NOT FOUND
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


    const activeSections =
        sections.filter(
            (
                section
            ) =>
                section.status ===
                "active"
        ).length;


    const inactiveSections =
        sections.filter(
            (
                section
            ) =>
                section.status ===
                "inactive"
        ).length;


    // ======================================================
    // UI
    // ======================================================

    return (
        <div
            className="
                space-y-4
            "
        >
            {/* ================================================= */}
            {/* PROGRAMME HEADER */}
            {/* ================================================= */}

            <section
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                    sm:p-5
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >
                    <div
                        className="
                            min-w-0
                        "
                    >
                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >
                            <span
                                className="
                                    rounded-full
                                    bg-blue-50
                                    px-2.5
                                    py-1
                                    text-[7px]
                                    font-medium
                                    text-blue-600
                                "
                            >
                                {formatProgrammeType(
                                    programme.programmeType
                                )}
                            </span>


                            <StatusBadge
                                status={
                                    programme.status
                                }
                            />
                        </div>


                        <h2
                            className="
                                mt-3
                                break-words
                                text-[17px]
                                font-semibold
                                text-slate-800
                                sm:text-[19px]
                            "
                        >
                            {programme.title}
                        </h2>


                        {programme.description && (
                            <p
                                className="
                                    mt-2
                                    max-w-3xl
                                    text-[9px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                {
                                    programme.description
                                }
                            </p>
                        )}
                    </div>


                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                        "
                    >
                        <ActionButton
                            variant="secondary"
                            onClick={() =>
                                navigate(
                                    "/training-programmes"
                                )
                            }
                            className="
                                w-full
                                sm:w-auto
                            "
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
                                className="
                                    w-full
                                    sm:w-auto
                                "
                            >
                                + Add Section
                            </ActionButton>
                        )}
                    </div>
                </div>
            </section>


            {/* ================================================= */}
            {/* STATS */}
            {/* ================================================= */}

            <section
                className="
                    grid
                    gap-3
                    sm:grid-cols-3
                "
            >
                <SectionStat
                    label="Total Sections"
                    value={
                        sections.length
                    }
                />


                <SectionStat
                    label="Active Sections"
                    value={
                        activeSections
                    }
                />


                <SectionStat
                    label="Inactive Sections"
                    value={
                        inactiveSections
                    }
                />
            </section>


            {/* ================================================= */}
            {/* FEEDBACK */}
            {/* ================================================= */}

            {programmeInactive && (
                <FeedbackAlert
                    type="warning"
                    message="This training programme is inactive. Learning sections cannot be changed until the programme is reactivated."
                />
            )}


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
            {/* FORM */}
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
            {/* TABLE */}
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
                <div
                    className="
                        flex
                        flex-col
                        gap-2
                        border-b
                        border-slate-100
                        px-4
                        py-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:px-5
                    "
                >
                    <div>
                        <h3
                            className="
                                text-[11px]
                                font-semibold
                                text-slate-800
                            "
                        >
                            Learning Sections
                        </h3>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                text-slate-400
                            "
                        >
                            Manage section content and learning order.
                        </p>
                    </div>


                    <span
                        className="
                            w-fit
                            rounded-full
                            bg-slate-100
                            px-3
                            py-1
                            text-[8px]
                            text-slate-500
                        "
                    >
                        {sections.length} Section
                        {sections.length ===
                            1
                            ? ""
                            : "s"}
                    </span>
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


// ======================================================
// STAT
// ======================================================

function SectionStat({
    label,
    value,
}) {
    return (
        <article
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >
            <p
                className="
                    text-[8px]
                    text-slate-400
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    text-xl
                    font-bold
                    text-slate-800
                "
            >
                {value}
            </p>
        </article>
    );
}


export default LearningSectionManager;