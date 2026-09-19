import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import api from "../../services/api";

import TrainingProgrammeForm from "./TrainingProgrammeForm";
import TrainingProgrammeFilters from "./TrainingProgrammeFilters";
import TrainingProgrammeTable from "./TrainingProgrammeTable";
import TrainingProgrammePreviewModal from "./TrainingProgrammePreviewModal";

import ActionButton from "../ui/ActionButton";
import FeedbackAlert from "../ui/FeedbackAlert";
import LoadingCard from "../ui/LoadingCard";

import {
    formatProgrammeType,
    getApiErrorMessage,
    getUserDisplayName,
    parseArrayResponse,
} from "../../utils/training";

import { canonicalModuleKey } from "../../utils/trainingModules";
import { loadModulesFromDatabase } from "../../utils/moduleStorage";


const PROGRAMME_STATUSES = [
    "draft",
    "active",
    "inactive",
];


const getInitialFormData =
    () => ({
        programmeType: "",

        title: "",

        shortDescription: "",

        description: "",

        learningObjectives: "",

        prerequisite: "",

        coverImageUrl: "",
        coverImageFile: null,

        level: "",

        passMark: "",

        status: "active",

        ownerId: "",

        authorizedTrainers: [],
    });

function TrainingProgrammeManager({
    role,
    lockedProgrammeType = "",
}) {
    const [databaseProgrammeTypes, setDatabaseProgrammeTypes] = useState([]);

    useEffect(() => {
        let mounted = true;
        loadModulesFromDatabase()
            .then((modules) => {
                if (!mounted) return;
                setDatabaseProgrammeTypes(
                    modules
                        .filter((module) => String(module?.status || "").toLowerCase() === "active")
                        .map((module) => ({ value: String(module.key || "").trim(), label: module.name }))
                        .filter((type) => type.value && type.label)
                );
            })
            .catch((error) => {
                console.error("Load training modules error:", error);
                if (mounted) setDatabaseProgrammeTypes([]);
            });
        return () => { mounted = false; };
    }, []);

    const PROGRAMME_TYPES = useMemo(() => {
        return lockedProgrammeType
            ? databaseProgrammeTypes.filter((type) => canonicalModuleKey(type.value) === canonicalModuleKey(lockedProgrammeType))
            : databaseProgrammeTypes;
    }, [databaseProgrammeTypes, lockedProgrammeType]);
    const navigate =
        useNavigate();


    const isAdmin =
        role ===
        "admin";

    const isTrainer =
        role ===
        "trainer";


    const [
        programmes,
        setProgrammes,
    ] = useState([]);

    const [
        trainers,
        setTrainers,
    ] = useState([]);

    const [
        currentTrainer,
        setCurrentTrainer,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        showForm,
        setShowForm,
    ] = useState(false);

    const [
        editingProgramme,
        setEditingProgramme,
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
        previewProgramme,
        setPreviewProgramme,
    ] = useState(null);

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        typeFilter,
        setTypeFilter,
    ] = useState("all");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    // ======================================================
    // LOAD PROGRAMMES
    // ======================================================

    const loadProgrammes =
        useCallback(
            async () => {
                const response =
                    await api.get(
                        "/training-programmes"
                    );

                setProgrammes(
                    parseArrayResponse(
                        response.data,
                        "programmes"
                    )
                );
            },
            []
        );


    const loadAdminTrainers =
        useCallback(
            async () => {
                if (
                    !isAdmin
                ) {
                    setTrainers(
                        []
                    );

                    return;
                }

                const response =
                    await api.get(
                        "/admin/users"
                    );

                const users =
                    parseArrayResponse(
                        response.data,
                        "users"
                    );

                setTrainers(
                    users.filter(
                        (
                            user
                        ) =>
                            user.role ===
                            "trainer" &&
                            user.status ===
                            "active"
                    )
                );
            },
            [
                isAdmin,
            ]
        );


    const loadCurrentTrainer =
        useCallback(
            async () => {
                if (
                    !isTrainer
                ) {
                    return;
                }

                const response =
                    await api.get(
                        "/users/me"
                    );

                setCurrentTrainer(
                    response.data
                        ?.user ||
                    response.data ||
                    null
                );
            },
            [
                isTrainer,
            ]
        );


    useEffect(() => {
        let active =
            true;

        const load =
            async () => {
                try {
                    setLoading(
                        true
                    );

                    await Promise.all([
                        loadProgrammes(),
                        loadAdminTrainers(),
                        loadCurrentTrainer(),
                    ]);

                } catch (error) {
                    console.error(
                        "Training programme load error:",
                        error
                    );

                    if (
                        active
                    ) {
                        setErrorMessage(
                            getApiErrorMessage(
                                error,
                                "Unable to load training programmes."
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

        load();

        return () => {
            active =
                false;
        };
    }, [
        loadProgrammes,
        loadAdminTrainers,
        loadCurrentTrainer,
    ]);


    // ======================================================
    // PROGRAMME TYPES
    // ======================================================

    const availableProgrammeTypes =
        useMemo(
            () => {
                if (
                    !isTrainer
                ) {
                    return PROGRAMME_TYPES;
                }

                const assigned =
                    Array.isArray(
                        currentTrainer
                            ?.assignedTrainingSections
                    )
                        ? currentTrainer
                            .assignedTrainingSections
                        : [];

                return PROGRAMME_TYPES.filter(
                    (
                        type
                    ) =>
                        assigned.includes(
                            type.value
                        )
                );
            },
            [
                isTrainer,
                currentTrainer,
                PROGRAMME_TYPES,
            ]
        );


    const eligibleOwnerTrainers =
        useMemo(
            () => {
                if (!isAdmin) {
                    return [];
                }

                // Admin-created database modules are dynamic.
                // Any active Trainer can own a programme.
                return trainers.filter(
                    (trainer) =>
                        trainer.role === "trainer" &&
                        trainer.status === "active"
                );
            },
            [
                isAdmin,
                trainers,
            ]
        );


    const eligibleAuthorizedTrainers =
        useMemo(
            () =>
                eligibleOwnerTrainers.filter(
                    (
                        trainer
                    ) =>
                        String(
                            trainer._id
                        ) !==
                        String(
                            formData.ownerId
                        )
                ),
            [
                eligibleOwnerTrainers,
                formData.ownerId,
            ]
        );


    // ======================================================
    // FILTER PROGRAMMES
    // ======================================================

    const filteredProgrammes =
        useMemo(
            () => {
                const query =
                    searchTerm
                        .trim()
                        .toLowerCase();

                return programmes.filter(
                    (
                        programme
                    ) => {
                        if (
                            lockedProgrammeType &&
                            canonicalModuleKey(programme.programmeType) !== canonicalModuleKey(lockedProgrammeType)
                        ) {
                            return false;
                        }

                        if (
                            typeFilter !==
                            "all" &&
                            programme.programmeType !==
                            typeFilter
                        ) {
                            return false;
                        }

                        if (
                            statusFilter !==
                            "all" &&
                            programme.status !==
                            statusFilter
                        ) {
                            return false;
                        }

                        if (
                            !query
                        ) {
                            return true;
                        }

                        const owner =
                            programme.ownerTrainer ||
                            programme.owner ||
                            programme.trainer;

                        const text =
                            [
                                programme.title,
                                programme.description,

                                formatProgrammeType(
                                    programme.programmeType
                                ),

                                getUserDisplayName(
                                    owner,
                                    ""
                                ),

                                programme.status,
                            ]
                                .filter(
                                    Boolean
                                )
                                .join(
                                    " "
                                )
                                .toLowerCase();

                        return text.includes(
                            query
                        );
                    }
                );
            },
            [
                programmes,
                searchTerm,
                typeFilter,
                statusFilter,
                lockedProgrammeType,
            ]
        );


    // ======================================================
    // STATISTICS
    // ======================================================

    const scopedProgrammes = lockedProgrammeType
        ? programmes.filter((programme) => canonicalModuleKey(programme.programmeType) === canonicalModuleKey(lockedProgrammeType))
        : programmes;

    const activeCount =
        scopedProgrammes.filter(
            (
                programme
            ) =>
                programme.status ===
                "active"
        ).length;


    const draftCount =
        scopedProgrammes.filter(
            (
                programme
            ) =>
                programme.status ===
                "draft"
        ).length;


    const inactiveCount =
        scopedProgrammes.filter(
            (
                programme
            ) =>
                programme.status ===
                "inactive"
        ).length;


    // ======================================================
    // FORM HELPERS
    // ======================================================

    const clearFeedback =
        () => {
            setErrorMessage(
                ""
            );

            setSuccessMessage(
                ""
            );
        };


    const resetForm =
        () => {
            setFormData({
                ...getInitialFormData(),
                programmeType: lockedProgrammeType || "",
            });

            setEditingProgramme(
                null
            );

            setShowForm(
                false
            );
        };


    // ======================================================
    // CREATE PROGRAMME
    // ======================================================

    const handleCreateProgramme =
        () => {
            clearFeedback();

            setEditingProgramme(
                null
            );

            setFormData({
                ...getInitialFormData(),
                programmeType: lockedProgrammeType || "",
            });

            setShowForm(
                true
            );
        };


    // ======================================================
    // EDIT PROGRAMME
    // ======================================================

    const handleEditProgramme =
        (
            programme
        ) => {
            clearFeedback();

            const owner =
                programme.ownerTrainer ||
                programme.owner ||
                programme.trainer;

            const authorized =
                Array.isArray(
                    programme.authorizedTrainers
                )
                    ? programme
                        .authorizedTrainers
                        .map(
                            (
                                trainer
                            ) =>
                                typeof trainer ===
                                    "string"
                                    ? trainer
                                    : trainer._id
                        )
                        .filter(
                            Boolean
                        )
                    : [];

            setEditingProgramme(
                programme
            );

            setFormData({
                programmeType:
                    programme.programmeType ||
                    "",

                title:
                    programme.title ||
                    "",

                shortDescription:
                    programme.shortDescription || programme.description || "",

                description:
                    programme.description ||
                    "",

                learningObjectives:
                    programme.learningObjectives || "Complete the learning objectives for this programme.",

                prerequisite:
                    programme.prerequisite || "",

                coverImageUrl:
                    programme.coverImageUrl || "",
                coverImageFile: null,

                level:
                    ({ easy: "beginner", medium: "intermediate", high: "advanced" }[programme.level] || programme.level || "beginner"),

                passMark:
                    programme.passMark ??
                    70,

                status:
                    programme.status ||
                    "draft",

                ownerId:
                    owner?._id ||
                    owner ||
                    "",

                authorizedTrainers:
                    authorized,
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


    // ======================================================
    // INPUT CHANGE
    // ======================================================

    const handleInputChange =
        (
            event
        ) => {
            const { name, value, files } = event.target;

            if (name === "coverImage") {
                setFormData((current) => ({ ...current, coverImageFile: files?.[0] || null }));
                return;
            }

            setFormData(
                (
                    current
                ) => {
                    if (
                        name ===
                        "programmeType"
                    ) {
                        return {
                            ...current,

                            programmeType:
                                value,

                            ownerId:
                                "",

                            authorizedTrainers:
                                [],
                        };
                    }

                    if (
                        name ===
                        "ownerId"
                    ) {
                        return {
                            ...current,

                            ownerId:
                                value,

                            authorizedTrainers:
                                current
                                    .authorizedTrainers
                                    .filter(
                                        (
                                            id
                                        ) =>
                                            String(
                                                id
                                            ) !==
                                            String(
                                                value
                                            )
                                    ),
                        };
                    }

                    return {
                        ...current,

                        [name]:
                            value,
                    };
                }
            );
        };


    // ======================================================
    // AUTHORISED TRAINERS
    // ======================================================

    const handleToggleAuthorizedTrainer =
        (
            trainerId
        ) => {
            setFormData(
                (
                    current
                ) => {
                    const selected =
                        current
                            .authorizedTrainers
                            .includes(
                                trainerId
                            );

                    return {
                        ...current,

                        authorizedTrainers:
                            selected
                                ? current
                                    .authorizedTrainers
                                    .filter(
                                        (
                                            id
                                        ) =>
                                            id !==
                                            trainerId
                                    )
                                : [
                                    ...current
                                        .authorizedTrainers,

                                    trainerId,
                                ],
                    };
                }
            );
        };


    // ======================================================
    // VALIDATION
    // ======================================================

    const validateForm =
        () => {
            if (
                !PROGRAMME_TYPES.some(
                    (
                        type
                    ) =>
                        type.value ===
                        formData.programmeType
                )
            ) {
                return "Please select a valid programme type.";
            }

            if (
                formData
                    .title
                    .trim()
                    .length <
                3
            ) {
                return "Programme title must contain at least 3 characters.";
            }

            if (formData.shortDescription.trim().length < 10) {
                return "Short description must contain at least 10 characters.";
            }

            if (formData.description.trim().length < 10) {
                return "Full description must contain at least 10 characters.";
            }

            if (formData.learningObjectives.trim().length < 10) {
                return "Learning objectives must contain at least 10 characters.";
            }

            if (!["beginner", "intermediate", "advanced"].includes(formData.level)) {
                return "Please select Beginner, Intermediate, or Advanced programme level.";
            }

            const passMark =
                Number(
                    formData.passMark
                );

            if (
                !Number.isFinite(
                    passMark
                ) ||
                passMark <
                0 ||
                passMark >
                100
            ) {
                return "Pass mark must be between 0 and 100.";
            }

            if (
                !PROGRAMME_STATUSES.includes(
                    formData.status
                )
            ) {
                return "Please select a valid programme status.";
            }

            if (
                isAdmin &&
                !formData.ownerId
            ) {
                return "Please select an owner Trainer.";
            }

            if (
                isTrainer &&
                !availableProgrammeTypes.some(
                    (
                        type
                    ) =>
                        type.value ===
                        formData.programmeType
                )
            ) {
                return "You are not assigned to this training area.";
            }

            return "";
        };


    // ======================================================
    // SAVE PROGRAMME
    // ======================================================

    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            clearFeedback();

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
                programmeType:
                    formData.programmeType,

                title:
                    formData
                        .title
                        .trim(),

                shortDescription: formData.shortDescription.trim(),

                description:
                    formData
                        .description
                        .trim(),

                learningObjectives: formData.learningObjectives.trim(),
                prerequisite: formData.prerequisite.trim(),

                level:
                    formData.level,

                passMark:
                    Number(
                        formData.passMark
                    ),

                status:
                    formData.status,
            };


            if (
                isAdmin
            ) {
                payload.ownerId =
                    formData.ownerId;

                payload.authorizedTrainers =
                    formData.authorizedTrainers;
            }


            const requestData = new FormData();
            Object.entries(payload).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((item) => requestData.append(`${key}[]`, item));
                } else if (value !== undefined && value !== null) {
                    requestData.append(key, value);
                }
            });
            if (formData.coverImageFile) requestData.append("coverImage", formData.coverImageFile);

            try {
                setSaving(
                    true
                );

                if (
                    editingProgramme
                ) {
                    const response =
                        await api.patch(
                            `/training-programmes/${editingProgramme._id}`,
                            requestData
                        );

                    setSuccessMessage(
                        response.data?.message ||
                        "Training programme updated successfully."
                    );

                } else {
                    const response =
                        await api.post(
                            "/training-programmes",
                            requestData
                        );

                    setSuccessMessage(
                        response.data?.message ||
                        "Training programme created successfully."
                    );
                }

                resetForm();

                await loadProgrammes();

            } catch (
            error
            ) {
                console.error(
                    "Save programme error:",
                    error
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to save the training programme."
                    )
                );

            } finally {
                setSaving(
                    false
                );
            }
        };


    // ======================================================
    // DEACTIVATE PROGRAMME
    // ======================================================

    const handleDeactivate =
        async (
            programme
        ) => {
            if (
                !programme?._id
            ) {
                return;
            }

            const confirmed =
                window.confirm(
                    `Deactivate "${programme.title}"?`
                );

            if (
                !confirmed
            ) {
                return;
            }

            try {
                setProcessingId(
                    programme._id
                );

                const response =
                    await api.delete(
                        `/training-programmes/${programme._id}`
                    );

                setSuccessMessage(
                    response.data?.message ||
                    "Programme deactivated successfully."
                );

                await loadProgrammes();

            } catch (
            error
            ) {
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to deactivate programme."
                    )
                );

            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    // ======================================================
    // REACTIVATE PROGRAMME
    // ======================================================

    const handleReactivate =
        async (
            programme
        ) => {
            if (
                !programme?._id
            ) {
                return;
            }

            try {
                setProcessingId(
                    programme._id
                );

                const response =
                    await api.patch(
                        `/training-programmes/${programme._id}/reactivate`
                    );

                setSuccessMessage(
                    response.data?.message ||
                    "Programme reactivated successfully."
                );

                await loadProgrammes();

            } catch (
            error
            ) {
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reactivate programme."
                    )
                );

            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    // ======================================================
    // PREVIEW
    // ======================================================

    const handlePreviewProgramme =
        (
            programme
        ) => {
            setPreviewProgramme(
                programme
            );
        };


    // ======================================================
    // MANAGE LEARNING SECTIONS
    // ======================================================

    const handleManageSections =
        (
            programme
        ) => {
            navigate(
                `/training-programmes/${programme._id}/sections`
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
                message="Loading training programmes..."
            />
        );
    }


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <div
            className="
                space-y-4
            "
        >

            {/* =============================================
                STATISTICS
            ============================================== */}

            <section
                className="
                    grid
                    gap-3
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >
                <ManagerStat
                    label="Total Programmes"
                    value={
                        scopedProgrammes.length
                    }
                />

                <ManagerStat
                    label="Active"
                    value={
                        activeCount
                    }
                />

                <ManagerStat
                    label="Draft"
                    value={
                        draftCount
                    }
                />

                <ManagerStat
                    label="Inactive"
                    value={
                        inactiveCount
                    }
                />
            </section>


            {/* =============================================
                SUCCESS MESSAGE
            ============================================== */}

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


            {/* =============================================
                ERROR MESSAGE
            ============================================== */}

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


            {/* =============================================
                CREATE BUTTON
            ============================================== */}

            {!showForm && (
                <div
                    className="
                        flex
                        justify-end
                    "
                >
                    <ActionButton
                        variant="primary"
                        onClick={
                            handleCreateProgramme
                        }
                        className="
                            w-full
                            sm:w-auto
                        "
                    >
                        + Create Programme
                    </ActionButton>
                </div>
            )}


            {/* =============================================
                CREATE / EDIT FORM
            ============================================== */}

            {showForm && (
                <TrainingProgrammeForm
                    formData={
                        formData
                    }
                    isAdmin={
                        isAdmin
                    }
                    availableProgrammeTypes={
                        availableProgrammeTypes
                    }
                    lockedProgrammeType={
                        lockedProgrammeType
                    }
                    lockedProgrammeLabel={
                        databaseProgrammeTypes.find(
                            (type) => canonicalModuleKey(type.value) === canonicalModuleKey(lockedProgrammeType)
                        )?.label || lockedProgrammeType
                    }
                    eligibleOwnerTrainers={
                        eligibleOwnerTrainers
                    }
                    eligibleAuthorizedTrainers={
                        eligibleAuthorizedTrainers
                    }
                    editingProgramme={
                        editingProgramme
                    }
                    saving={
                        saving
                    }
                    onInputChange={
                        handleInputChange
                    }
                    onToggleAuthorizedTrainer={
                        handleToggleAuthorizedTrainer
                    }
                    onSubmit={
                        handleSubmit
                    }
                    onCancel={
                        resetForm
                    }
                />
            )}


            {/* =============================================
                FILTERS
            ============================================== */}

            <TrainingProgrammeFilters
                searchTerm={
                    searchTerm
                }
                typeFilter={
                    typeFilter
                }
                statusFilter={
                    statusFilter
                }
                programmeTypes={
                    PROGRAMME_TYPES.map(
                        (
                            type
                        ) =>
                            type.value
                    )
                }
                onSearchChange={
                    setSearchTerm
                }
                onTypeChange={
                    setTypeFilter
                }
                onStatusChange={
                    setStatusFilter
                }
            />


            {/* =============================================
                PROGRAMME TABLE
            ============================================== */}

            <TrainingProgrammeTable
                programmes={
                    filteredProgrammes
                }
                processingId={
                    processingId
                }
                onPreview={
                    handlePreviewProgramme
                }
                onEdit={
                    handleEditProgramme
                }
                onManageSections={
                    handleManageSections
                }
                onDeactivate={
                    handleDeactivate
                }
                onReactivate={
                    handleReactivate
                }
            />


            {/* =============================================
                PROGRAMME PREVIEW
            ============================================== */}

            <TrainingProgrammePreviewModal
                programme={
                    previewProgramme
                }
                onClose={() =>
                    setPreviewProgramme(
                        null
                    )
                }
                onManageSections={(
                    programme
                ) => {
                    setPreviewProgramme(
                        null
                    );

                    handleManageSections(
                        programme
                    );
                }}
            />

        </div>
    );
}


/* =========================================================
   MANAGER STAT
========================================================= */

function ManagerStat({
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


export default TrainingProgrammeManager;