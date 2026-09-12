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

import ActionButton from "../ui/ActionButton";
import FeedbackAlert from "../ui/FeedbackAlert";
import LoadingCard from "../ui/LoadingCard";

import {
    formatProgrammeType,
    getApiErrorMessage,
    getUserDisplayName,
    parseArrayResponse,
} from "../../utils/training";


const PROGRAMME_TYPES = [
    {
        value:
            "manual-handling",

        label:
            "Manual Handling",
    },

    {
        value:
            "working-at-height",

        label:
            "Working at Height",
    },
];


const PROGRAMME_STATUSES = [
    "draft",
    "active",
    "inactive",
];


const getInitialFormData =
    () => ({
        programmeType:
            "",

        title:
            "",

        description:
            "",

        passMark:
            70,

        status:
            "draft",

        ownerId:
            "",

        authorizedTrainers:
            [],
    });


function TrainingProgrammeManager({
    role,
}) {
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
                    setLoading(true);

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
            ]
        );


    const eligibleOwnerTrainers =
        useMemo(
            () => {
                if (
                    !isAdmin
                ) {
                    return [];
                }

                if (
                    !formData.programmeType
                ) {
                    return trainers;
                }

                return trainers.filter(
                    (
                        trainer
                    ) =>
                        Array.isArray(
                            trainer
                                .assignedTrainingSections
                        ) &&
                        trainer
                            .assignedTrainingSections
                            .includes(
                                formData.programmeType
                            )
                );
            },
            [
                isAdmin,
                trainers,
                formData.programmeType,
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
    // FILTER
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
                                .filter(Boolean)
                                .join(" ")
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
            ]
        );


    const activeCount =
        programmes.filter(
            (
                programme
            ) =>
                programme.status ===
                "active"
        ).length;


    const draftCount =
        programmes.filter(
            (
                programme
            ) =>
                programme.status ===
                "draft"
        ).length;


    const inactiveCount =
        programmes.filter(
            (
                programme
            ) =>
                programme.status ===
                "inactive"
        ).length;


    // ======================================================
    // FORM
    // ======================================================

    const clearFeedback =
        () => {
            setErrorMessage("");
            setSuccessMessage("");
        };


    const resetForm =
        () => {
            setFormData(
                getInitialFormData()
            );

            setEditingProgramme(
                null
            );

            setShowForm(
                false
            );
        };


    const handleCreateProgramme =
        () => {
            clearFeedback();

            setEditingProgramme(
                null
            );

            setFormData(
                getInitialFormData()
            );

            setShowForm(
                true
            );
        };


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
                        .filter(Boolean)
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

                description:
                    programme.description ||
                    "",

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

            if (
                formData
                    .description
                    .trim()
                    .length <
                10
            ) {
                return "Programme description must contain at least 10 characters.";
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

                description:
                    formData
                        .description
                        .trim(),

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

            try {
                setSaving(true);

                if (
                    editingProgramme
                ) {
                    const response =
                        await api.patch(
                            `/training-programmes/${editingProgramme._id}`,
                            payload
                        );

                    setSuccessMessage(
                        response.data?.message ||
                        "Training programme updated successfully."
                    );

                } else {
                    const response =
                        await api.post(
                            "/training-programmes",
                            payload
                        );

                    setSuccessMessage(
                        response.data?.message ||
                        "Training programme created successfully."
                    );
                }

                resetForm();

                await loadProgrammes();

            } catch (error) {
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
                setSaving(false);
            }
        };


    // ======================================================
    // STATUS ACTIONS
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

            } catch (error) {
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to deactivate programme."
                    )
                );

            } finally {
                setProcessingId("");
            }
        };


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

            } catch (error) {
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reactivate programme."
                    )
                );

            } finally {
                setProcessingId("");
            }
        };


    const handleManageSections =
        (
            programme
        ) => {
            navigate(
                `/training-programmes/${programme._id}/sections`
            );
        };


    if (
        loading
    ) {
        return (
            <LoadingCard
                message="Loading training programmes..."
            />
        );
    }


    return (
        <div
            className="
                space-y-4
            "
        >
            {/* STATS */}

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
                        programmes.length
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


            <TrainingProgrammeTable
                programmes={
                    filteredProgrammes
                }
                processingId={
                    processingId
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
        </div>
    );
}


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