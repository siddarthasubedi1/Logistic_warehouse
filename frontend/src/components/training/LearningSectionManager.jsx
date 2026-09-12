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
import FeedbackAlert from "../ui/FeedbackAlert";
import LoadingCard from "../ui/LoadingCard";
import StatusBadge from "../ui/StatusBadge";

import {
    formatProgrammeType,
    getApiErrorMessage,
    parseArrayResponse,
    sortLearningSections,
} from "../../utils/training";


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


function LearningSectionManager() {
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


    const loadProgramme =
        useCallback(
            async () => {
                const response =
                    await api.get(
                        `/training-programmes/${programmeId}`
                    );

                const loaded =
                    response.data
                        ?.programme ||
                    response.data ||
                    null;

                setProgramme(
                    loaded
                );

                return loaded;
            },
            [
                programmeId,
            ]
        );


    const loadSections =
        useCallback(
            async () => {
                const response =
                    await api.get(
                        `/training-programmes/${programmeId}/sections`
                    );

                const loaded =
                    sortLearningSections(
                        parseArrayResponse(
                            response.data,
                            "sections"
                        )
                    );

                setSections(
                    loaded
                );

                return loaded;
            },
            [
                programmeId,
            ]
        );


    useEffect(() => {
        let active =
            true;

        const load =
            async () => {
                try {
                    setLoading(true);

                    await Promise.all([
                        loadProgramme(),
                        loadSections(),
                    ]);

                } catch (error) {
                    console.error(
                        "Learning content load error:",
                        error
                    );

                    if (
                        active
                    ) {
                        setErrorMessage(
                            getApiErrorMessage(
                                error,
                                "Unable to load learning sections."
                            )
                        );
                    }

                } finally {
                    if (
                        active
                    ) {
                        setLoading(false);
                    }
                }
            };

        load();

        return () => {
            active =
                false;
        };
    }, [
        loadProgramme,
        loadSections,
    ]);


    const programmeInactive =
        programme?.status ===
        "inactive";


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


    const clearFeedback =
        () => {
            setErrorMessage("");
            setSuccessMessage("");
        };


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


    const handleCreate =
        () => {
            clearFeedback();

            setEditingSection(
                null
            );

            setFormData(
                getInitialFormData()
            );

            setShowForm(
                true
            );
        };


    const handleEditSection =
        (
            section
        ) => {
            if (
                programmeInactive
            ) {
                return;
            }

            clearFeedback();

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
                behavior:
                    "smooth",
            });
        };


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


    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            clearFeedback();

            if (
                !formData
                    .title
                    .trim()
            ) {
                setErrorMessage(
                    "Section title is required."
                );

                return;
            }

            if (
                !formData
                    .content
                    .trim()
            ) {
                setErrorMessage(
                    "Learning content is required."
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
                setSaving(true);

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
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to save learning section."
                    )
                );

            } finally {
                setSaving(false);
            }
        };


    const handleDeactivate =
        async (
            section
        ) => {
            const confirmed =
                window.confirm(
                    `Deactivate "${section.title}"?`
                );

            if (
                !confirmed
            ) {
                return;
            }

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

                await loadSections();

            } catch (error) {
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to deactivate learning section."
                    )
                );

            } finally {
                setProcessingId("");
            }
        };


    const handleReactivate =
        async (
            section
        ) => {
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
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reactivate learning section."
                    )
                );

            } finally {
                setProcessingId("");
            }
        };


    const reorderSections =
        async (
            reordered
        ) => {
            if (
                programmeInactive
            ) {
                return;
            }

            const previous =
                sections;

            const optimistic =
                reordered.map(
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
                optimistic
            );

            try {
                setProcessingId(
                    "reorder"
                );

                await api.put(
                    `/training-programmes/${programmeId}/sections/reorder`,
                    {
                        sectionIds:
                            reordered.map(
                                (
                                    section
                                ) =>
                                    section._id
                            ),
                    }
                );

                await loadSections();

                setSuccessMessage(
                    "Learning section order updated successfully."
                );

            } catch (error) {
                setSections(
                    previous
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reorder learning sections."
                    )
                );

            } finally {
                setProcessingId("");
            }
        };


    const handleMoveUp =
        (
            section
        ) => {
            const index =
                sections.findIndex(
                    (
                        item
                    ) =>
                        item._id ===
                        section._id
                );

            if (
                index <=
                0
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


    const handleMoveDown =
        (
            section
        ) => {
            const index =
                sections.findIndex(
                    (
                        item
                    ) =>
                        item._id ===
                        section._id
                );

            if (
                index ===
                -1 ||
                index >=
                sections.length -
                1
            ) {
                return;
            }

            const reordered =
                [
                    ...sections,
                ];

            [
                reordered[
                index
                ],
                reordered[
                index +
                1
                ],
            ] = [
                    reordered[
                    index +
                    1
                    ],
                    reordered[
                    index
                    ],
                ];

            reorderSections(
                reordered
            );
        };


    if (
        loading
    ) {
        return (
            <LoadingCard
                message="Loading learning sections..."
            />
        );
    }


    return (
        <div
            className="
                space-y-4
            "
        >
            {/* PROGRAMME SUMMARY */}

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
                        md:flex-row
                        md:items-start
                        md:justify-between
                    "
                >
                    <div>
                        <div
                            className="
                                flex
                                flex-wrap
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
                                    font-semibold
                                    text-blue-700
                                "
                            >
                                {formatProgrammeType(
                                    programme?.programmeType
                                )}
                            </span>

                            <StatusBadge
                                status={
                                    programme?.status
                                }
                            />
                        </div>


                        <h2
                            className="
                                mt-3
                                text-[16px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            {programme?.title ||
                                "Training Programme"}
                        </h2>


                        {programme?.description && (
                            <p
                                className="
                                    mt-2
                                    max-w-3xl
                                    text-[9px]
                                    font-medium
                                    leading-5
                                    text-slate-600
                                "
                            >
                                {
                                    programme.description
                                }
                            </p>
                        )}
                    </div>


                    <ActionButton
                        variant="secondary"
                        onClick={() =>
                            navigate(
                                "/training-programmes"
                            )
                        }
                    >
                        ← Back to Programmes
                    </ActionButton>
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


            <FeedbackAlert
                type="success"
                message={
                    successMessage
                }
                onClose={() =>
                    setSuccessMessage("")
                }
            />

            <FeedbackAlert
                type="error"
                message={
                    errorMessage
                }
                onClose={() =>
                    setErrorMessage("")
                }
            />


            {!showForm &&
                !programmeInactive && (
                    <div
                        className="
                        flex
                        justify-end
                    "
                    >
                        <ActionButton
                            variant="primary"
                            onClick={
                                handleCreate
                            }
                            className="
                            w-full
                            sm:w-auto
                        "
                        >
                            + Add Learning Section
                        </ActionButton>
                    </div>
                )}


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
                            handleInputChange
                        }
                        onSubmit={
                            handleSubmit
                        }
                        onCancel={
                            resetForm
                        }
                    />
                )}


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
                                font-bold
                                text-[#172033]
                            "
                        >
                            Learning Sections
                        </h3>

                        <p
                            className="
                                mt-1
                                text-[8px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Manage content and learning order.
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
                            font-semibold
                            text-slate-600
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