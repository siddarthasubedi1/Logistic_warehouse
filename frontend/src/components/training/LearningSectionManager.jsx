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

import api, {
    API_BASE_URL,
} from "../../services/api";

import LearningSectionForm from "./LearningSectionForm";
import LearningSectionTable from "./LearningSectionTable";
import LearningSectionPreviewModal from "./LearningSectionPreviewModal";

import ActionButton from "../ui/ActionButton";
import FeedbackAlert from "../ui/FeedbackAlert";
import LoadingCard from "../ui/LoadingCard";
import StatusBadge from "../ui/StatusBadge";

import {
    formatProgrammeType,
    getApiErrorMessage,
    parseArrayResponse,
} from "../../utils/training";


/* =========================================================
   BACKEND URL
========================================================= */

const BACKEND_URL =
    API_BASE_URL.replace(
        /\/api\/?$/,
        ""
    );


function getTrainingImageUrl(
    imageUrl
) {
    if (
        !imageUrl
    ) {
        return "";
    }


    if (
        imageUrl.startsWith(
            "http://"
        ) ||
        imageUrl.startsWith(
            "https://"
        ) ||
        imageUrl.startsWith(
            "blob:"
        ) ||
        imageUrl.startsWith(
            "data:"
        )
    ) {
        return imageUrl;
    }


    return `${BACKEND_URL}${imageUrl}`;
}


/* =========================================================
   INITIAL FORM
========================================================= */

function getInitialFormData() {
    return {
        title:
            "",

        content:
            "",

        imageAltText:
            "",

        status:
            "active",
    };
}


/* =========================================================
   LEARNING SECTION MANAGER
========================================================= */

function LearningSectionManager({
    role,
}) {
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
        previewSection,
        setPreviewSection,
    ] = useState(null);


    const [
        formData,
        setFormData,
    ] = useState(
        getInitialFormData()
    );


    const [
        imageFile,
        setImageFile,
    ] = useState(null);


    const [
        imagePreview,
        setImagePreview,
    ] = useState("");


    const [
        saving,
        setSaving,
    ] = useState(false);


    const [
        processingId,
        setProcessingId,
    ] = useState("");


    const [
        reordering,
        setReordering,
    ] = useState(false);


    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    const canManage =
        role ===
        "admin" ||
        role ===
        "trainer";


    /* =====================================================
       LOAD PROGRAMME
    ===================================================== */

    const loadProgramme =
        useCallback(
            async () => {
                if (
                    !programmeId
                ) {
                    return;
                }


                const response =
                    await api.get(
                        `/training-programmes/${programmeId}`
                    );


                setProgramme(
                    response.data
                        ?.programme ||
                    response.data ||
                    null
                );
            },
            [
                programmeId,
            ]
        );


    /* =====================================================
       LOAD SECTIONS
    ===================================================== */

    const loadSections =
        useCallback(
            async () => {
                if (
                    !programmeId
                ) {
                    return;
                }


                const response =
                    await api.get(
                        `/training-programmes/${programmeId}/sections`
                    );


                const sectionData =
                    parseArrayResponse(
                        response.data,
                        "sections"
                    );


                setSections(
                    [
                        ...sectionData,
                    ].sort(
                        (
                            first,
                            second
                        ) =>
                            Number(
                                first.order ||
                                0
                            ) -
                            Number(
                                second.order ||
                                0
                            )
                    )
                );
            },
            [
                programmeId,
            ]
        );


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        let mounted =
            true;


        const load =
            async () => {
                try {
                    setLoading(
                        true
                    );


                    setErrorMessage(
                        ""
                    );


                    await Promise.all([
                        loadProgramme(),
                        loadSections(),
                    ]);


                } catch (
                error
                ) {
                    console.error(
                        "Learning section load error:",
                        error
                    );


                    if (
                        mounted
                    ) {
                        setErrorMessage(
                            getApiErrorMessage(
                                error,
                                "Unable to load the learning sections."
                            )
                        );
                    }


                } finally {
                    if (
                        mounted
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            };


        load();


        return () => {
            mounted =
                false;
        };

    }, [
        loadProgramme,
        loadSections,
    ]);


    /* =====================================================
       CLEAN UP BLOB PREVIEW
    ===================================================== */

    useEffect(
        () => {
            return () => {
                if (
                    imagePreview &&
                    imagePreview.startsWith(
                        "blob:"
                    )
                ) {
                    URL.revokeObjectURL(
                        imagePreview
                    );
                }
            };
        },
        [
            imagePreview,
        ]
    );


    /* =====================================================
       SORTED SECTIONS
    ===================================================== */

    const sortedSections =
        useMemo(
            () =>
                [
                    ...sections,
                ].sort(
                    (
                        first,
                        second
                    ) =>
                        Number(
                            first.order ||
                            0
                        ) -
                        Number(
                            second.order ||
                            0
                        )
                ),
            [
                sections,
            ]
        );


    const activeCount =
        sections.filter(
            (
                section
            ) =>
                section.status ===
                "active"
        ).length;


    const inactiveCount =
        sections.filter(
            (
                section
            ) =>
                section.status ===
                "inactive"
        ).length;


    /* =====================================================
       FEEDBACK
    ===================================================== */

    const clearFeedback =
        () => {
            setErrorMessage(
                ""
            );

            setSuccessMessage(
                ""
            );
        };


    /* =====================================================
       PREVIEW CLEANUP
    ===================================================== */

    const revokeTemporaryPreview =
        () => {
            if (
                imagePreview &&
                imagePreview.startsWith(
                    "blob:"
                )
            ) {
                URL.revokeObjectURL(
                    imagePreview
                );
            }
        };


    /* =====================================================
       RESET FORM
    ===================================================== */

    const resetForm =
        () => {
            revokeTemporaryPreview();


            setImageFile(
                null
            );


            setImagePreview(
                ""
            );


            setFormData(
                getInitialFormData()
            );


            setEditingSection(
                null
            );


            setShowForm(
                false
            );
        };


    /* =====================================================
       CREATE
    ===================================================== */

    const handleCreateSection =
        () => {
            clearFeedback();

            revokeTemporaryPreview();


            setEditingSection(
                null
            );


            setFormData(
                getInitialFormData()
            );


            setImageFile(
                null
            );


            setImagePreview(
                ""
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


    /* =====================================================
       EDIT
    ===================================================== */

    const handleEditSection =
        (
            section
        ) => {
            clearFeedback();

            revokeTemporaryPreview();


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

                imageAltText:
                    section.imageAltText ||
                    "",

                status:
                    section.status ||
                    "active",
            });


            setImageFile(
                null
            );


            setImagePreview(
                getTrainingImageUrl(
                    section.imageUrl
                )
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


    /* =====================================================
       STANDARD INPUT
    ===================================================== */

    const handleInputChange =
        (
            event
        ) => {
            const {
                name,
                value,
            } =
                event.target;


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


    /* =====================================================
       IMAGE SELECT
    ===================================================== */

    const handleImageChange =
        (
            event
        ) => {
            const file =
                event.target
                    .files?.[0];


            if (
                !file
            ) {
                return;
            }


            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {
                setErrorMessage(
                    "Only JPG, JPEG, PNG and WebP images are allowed."
                );


                event.target.value =
                    "";

                return;
            }


            const maximumSize =
                5 *
                1024 *
                1024;


            if (
                file.size >
                maximumSize
            ) {
                setErrorMessage(
                    "Training image must not be larger than 5 MB."
                );


                event.target.value =
                    "";

                return;
            }


            setErrorMessage(
                ""
            );


            revokeTemporaryPreview();


            setImageFile(
                file
            );


            const previewUrl =
                URL.createObjectURL(
                    file
                );


            setImagePreview(
                previewUrl
            );
        };


    /* =====================================================
       VALIDATION
    ===================================================== */

    const validateForm =
        () => {
            if (
                formData
                    .title
                    .trim()
                    .length <
                2
            ) {
                return "Section title must contain at least 2 characters.";
            }


            if (
                !formData
                    .content
                    .trim()
            ) {
                return "Learning content is required.";
            }


            if (
                !editingSection &&
                !imageFile
            ) {
                return "Please choose a learning section image.";
            }


            if (
                !formData
                    .imageAltText
                    .trim()
            ) {
                return "Please provide alternative text for the learning section image.";
            }


            if (
                formData
                    .imageAltText
                    .trim()
                    .length >
                250
            ) {
                return "Image alternative text cannot exceed 250 characters.";
            }


            if (
                ![
                    "active",
                    "inactive",
                ].includes(
                    formData.status
                )
            ) {
                return "Please select a valid section status.";
            }


            return "";
        };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();


            clearFeedback();


            if (
                !canManage
            ) {
                setErrorMessage(
                    "You do not have permission to manage learning sections."
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


            /*
             * IMPORTANT:
             * We now send multipart/form-data.
             *
             * Do NOT manually set Content-Type.
             * api.js already handles FormData.
             */

            const payload =
                new FormData();


            payload.append(
                "title",
                formData
                    .title
                    .trim()
            );


            payload.append(
                "content",
                formData
                    .content
                    .trim()
            );


            payload.append(
                "imageAltText",
                formData
                    .imageAltText
                    .trim()
            );


            payload.append(
                "status",
                formData.status
            );


            if (
                imageFile
            ) {
                payload.append(
                    "image",
                    imageFile
                );
            }


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


            } catch (
            error
            ) {
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


    /* =====================================================
       DEACTIVATE SECTION
    ===================================================== */

    const handleDeleteSection =
        async (
            section
        ) => {
            if (
                !canManage ||
                !section?._id
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


                await loadSections();


            } catch (
            error
            ) {
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to deactivate the learning section."
                    )
                );


            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    /* =====================================================
       REORDER
    ===================================================== */

    const saveNewOrder =
        async (
            reorderedSections
        ) => {
            if (
                !canManage ||
                reordering
            ) {
                return;
            }


            clearFeedback();


            const previousSections =
                sections;


            const normalized =
                reorderedSections.map(
                    (
                        section,
                        index
                    ) => ({
                        ...section,

                        order:
                            index + 1,
                    })
                );


            setSections(
                normalized
            );


            try {
                setReordering(
                    true
                );


                const response =
                    await api.put(
                        `/training-programmes/${programmeId}/sections/reorder`,
                        {
                            sectionIds:
                                normalized.map(
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


            } catch (
            error
            ) {
                setSections(
                    previousSections
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to update learning section order."
                    )
                );


            } finally {
                setReordering(
                    false
                );
            }
        };


    const handleMoveUp =
        (
            section,
            index
        ) => {
            if (
                index <=
                0 ||
                reordering
            ) {
                return;
            }


            const reordered =
                [
                    ...sortedSections,
                ];


            [
                reordered[
                index - 1
                ],
                reordered[
                index
                ],
            ] = [
                    reordered[
                    index
                    ],
                    reordered[
                    index - 1
                    ],
                ];


            saveNewOrder(
                reordered
            );
        };


    const handleMoveDown =
        (
            section,
            index
        ) => {
            if (
                index >=
                sortedSections.length -
                1 ||
                reordering
            ) {
                return;
            }


            const reordered =
                [
                    ...sortedSections,
                ];


            [
                reordered[
                index
                ],
                reordered[
                index + 1
                ],
            ] = [
                    reordered[
                    index + 1
                    ],
                    reordered[
                    index
                    ],
                ];


            saveNewOrder(
                reordered
            );
        };


    /* =====================================================
       PREVIEW
    ===================================================== */

    const handlePreview =
        (
            section
        ) => {
            setPreviewSection({
                ...section,

                imageUrl:
                    getTrainingImageUrl(
                        section.imageUrl
                    ),
            });
        };


    /* =====================================================
       BACK
    ===================================================== */

    const handleBack =
        () => {
            navigate(
                "/training-programmes"
            );
        };


    /* =====================================================
       LOADING
    ===================================================== */

    if (
        loading
    ) {
        return (
            <LoadingCard
                message="Loading learning sections..."
            />
        );
    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <div className="space-y-4">

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


            {/* PROGRAMME HEADER */}

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
                        relative
                        overflow-hidden
                        bg-gradient-to-r
                        from-[#073763]
                        to-[#1769aa]
                        px-4
                        py-5
                        text-white
                        sm:px-6
                    "
                >
                    <div
                        className="
                            absolute
                            -right-14
                            -top-16
                            h-44
                            w-44
                            rounded-full
                            bg-white/10
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            flex
                            flex-col
                            gap-4
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >
                        <div className="min-w-0">
                            <button
                                type="button"
                                onClick={
                                    handleBack
                                }
                                className="
                                    mb-3
                                    inline-flex
                                    items-center
                                    gap-1
                                    rounded-lg
                                    bg-white/10
                                    px-3
                                    py-1.5
                                    text-[8px]
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-white/20
                                "
                            >
                                ← Training Programmes
                            </button>


                            <p
                                className="
                                    text-[7px]
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-blue-100
                                "
                            >
                                Learning Content Management
                            </p>


                            <h1
                                className="
                                    mt-2
                                    text-[18px]
                                    font-bold
                                    text-white
                                    sm:text-[20px]
                                "
                            >
                                {programme
                                    ?.title ||
                                    "Training Programme"}
                            </h1>


                            <div
                                className="
                                    mt-3
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                "
                            >
                                <span
                                    className="
                                        rounded-full
                                        bg-white/10
                                        px-3
                                        py-1.5
                                        text-[8px]
                                        font-semibold
                                        text-blue-50
                                    "
                                >
                                    {formatProgrammeType(
                                        programme
                                            ?.programmeType
                                    )}
                                </span>


                                {programme
                                    ?.status && (
                                        <StatusBadge
                                            status={
                                                programme.status
                                            }
                                        />
                                    )}
                            </div>


                            {programme
                                ?.description && (
                                    <p
                                        className="
                                        mt-3
                                        max-w-[720px]
                                        text-[8px]
                                        font-medium
                                        leading-5
                                        text-blue-100
                                    "
                                    >
                                        {
                                            programme.description
                                        }
                                    </p>
                                )}
                        </div>


                        {canManage && (
                            <ActionButton
                                variant="primary"
                                onClick={
                                    handleCreateSection
                                }
                                className="
                                    w-full
                                    shrink-0
                                    border
                                    border-white/20
                                    bg-white
                                    text-[#0b4f87]
                                    hover:bg-blue-50
                                    lg:w-auto
                                "
                            >
                                + Add Learning Section
                            </ActionButton>
                        )}
                    </div>
                </div>
            </section>


            {/* STATS */}

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
                    label="Active"
                    value={
                        activeCount
                    }
                />

                <SectionStat
                    label="Inactive"
                    value={
                        inactiveCount
                    }
                />
            </section>


            {/* ORDER INFO */}

            {canManage &&
                sections.length >
                1 && (
                    <section
                        className="
                        rounded-xl
                        border
                        border-blue-100
                        bg-blue-50
                        px-4
                        py-3
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
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                text-[12px]
                                font-bold
                                text-blue-700
                            "
                            >
                                ↕
                            </div>

                            <div>
                                <p
                                    className="
                                    text-[9px]
                                    font-bold
                                    text-blue-900
                                "
                                >
                                    Learning navigation order
                                </p>

                                <p
                                    className="
                                    mt-1
                                    text-[8px]
                                    leading-4
                                    text-blue-700
                                "
                                >
                                    Use the up and down controls
                                    to change the order in which
                                    Trainees see the learning
                                    sections.
                                </p>
                            </div>
                        </div>
                    </section>
                )}


            {/* FORM */}

            {showForm &&
                canManage && (
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
                        imageFile={
                            imageFile
                        }
                        imagePreview={
                            imagePreview
                        }
                        onChange={
                            handleInputChange
                        }
                        onImageChange={
                            handleImageChange
                        }
                        onSubmit={
                            handleSubmit
                        }
                        onCancel={
                            resetForm
                        }
                    />
                )}


            {/* TABLE */}

            <LearningSectionTable
                sections={
                    sortedSections
                }
                processingId={
                    processingId
                }
                onPreview={
                    handlePreview
                }
                onEdit={
                    canManage
                        ? handleEditSection
                        : undefined
                }
                onMoveUp={
                    canManage
                        ? handleMoveUp
                        : undefined
                }
                onMoveDown={
                    canManage
                        ? handleMoveDown
                        : undefined
                }
                onDelete={
                    canManage
                        ? handleDeleteSection
                        : undefined
                }
            />


            {/* PREVIEW */}

            <LearningSectionPreviewModal
                section={
                    previewSection
                }
                programme={
                    programme
                }
                onClose={() =>
                    setPreviewSection(
                        null
                    )
                }
            />

        </div>
    );
}


/* =========================================================
   STAT
========================================================= */

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
                    font-medium
                    text-slate-500
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-2
                    text-[22px]
                    font-bold
                    text-[#172033]
                "
            >
                {value}
            </p>
        </article>
    );
}


export default LearningSectionManager;