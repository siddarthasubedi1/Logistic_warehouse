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


// ======================================================
// PROGRAMME TYPES
// ======================================================

const PROGRAMME_TYPES = [
    {
        value: "manual-handling",
        label: "Manual Handling",
    },

    {
        value: "working-at-height",
        label: "Working at Height",
    },
];


// ======================================================
// STATUS VALUES
// ======================================================

const PROGRAMME_STATUSES = [
    "draft",
    "active",
    "inactive",
];


// ======================================================
// INITIAL FORM
// ======================================================

const getInitialFormData = () => ({
    programmeType: "",
    title: "",
    description: "",
    passMark: 70,
    status: "draft",
    ownerId: "",
    authorizedTrainers: [],
});


// ======================================================
// MANAGER
// ======================================================

function TrainingProgrammeManager({
    role,
}) {
    const navigate =
        useNavigate();


    const isAdmin =
        role === "admin";


    const isTrainer =
        role === "trainer";


    // ======================================================
    // DATA
    // ======================================================

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


    // ======================================================
    // FORM
    // ======================================================

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


    // ======================================================
    // FILTERS
    // ======================================================

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


    // ======================================================
    // PROCESSING
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


    const clearFeedback = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };


    // ======================================================
    // LOAD PROGRAMMES
    // ======================================================

    const loadProgrammes =
        useCallback(
            async () => {
                try {
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

                } catch (error) {
                    console.error(
                        "Load programmes error:",
                        error
                    );


                    setErrorMessage(
                        getApiErrorMessage(
                            error,
                            "Unable to load training programmes."
                        )
                    );
                }
            },
            []
        );


    // ======================================================
    // LOAD ADMIN TRAINERS
    // ======================================================

    const loadAdminTrainers =
        useCallback(
            async () => {
                if (!isAdmin) {
                    setTrainers([]);

                    return;
                }


                try {
                    const response =
                        await api.get(
                            "/admin/users"
                        );


                    const users =
                        parseArrayResponse(
                            response.data,
                            "users"
                        );


                    const trainerUsers =
                        users.filter(
                            (
                                user
                            ) => {
                                const status =
                                    String(
                                        user.status ||
                                        ""
                                    )
                                        .trim()
                                        .toLowerCase();


                                const accountStatus =
                                    String(
                                        user.accountStatus ||
                                        ""
                                    )
                                        .trim()
                                        .toLowerCase();


                                return (
                                    user.role ===
                                    "trainer" &&
                                    status ===
                                    "active" &&
                                    (
                                        !accountStatus ||
                                        accountStatus ===
                                        "created"
                                    )
                                );
                            }
                        );


                    setTrainers(
                        trainerUsers
                    );

                } catch (error) {
                    console.error(
                        "Load Trainers error:",
                        error
                    );


                    setErrorMessage(
                        getApiErrorMessage(
                            error,
                            "Unable to load Trainers."
                        )
                    );
                }
            },
            [
                isAdmin,
            ]
        );


    // ======================================================
    // LOAD CURRENT TRAINER
    // ======================================================

    const loadCurrentTrainer =
        useCallback(
            async () => {
                if (!isTrainer) {
                    setCurrentTrainer(
                        null
                    );

                    return;
                }


                try {
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

                } catch (error) {
                    console.error(
                        "Load Trainer error:",
                        error
                    );


                    setErrorMessage(
                        getApiErrorMessage(
                            error,
                            "Unable to load Trainer profile."
                        )
                    );
                }
            },
            [
                isTrainer,
            ]
        );


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        const loadPage =
            async () => {
                try {
                    setLoading(
                        true
                    );


                    clearFeedback();


                    await Promise.all([
                        loadProgrammes(),
                        loadAdminTrainers(),
                        loadCurrentTrainer(),
                    ]);

                } finally {
                    setLoading(
                        false
                    );
                }
            };


        loadPage();

    }, [
        loadProgrammes,
        loadAdminTrainers,
        loadCurrentTrainer,
    ]);


    // ======================================================
    // TRAINER PROGRAMME TYPES
    // ======================================================

    const trainerProgrammeTypes =
        useMemo(
            () => {
                if (!isTrainer) {
                    return PROGRAMME_TYPES;
                }


                const assignedSections =
                    Array.isArray(
                        currentTrainer
                            ?.assignedTrainingSections
                    )
                        ? currentTrainer
                            .assignedTrainingSections
                        : [];


                return PROGRAMME_TYPES.filter(
                    (
                        programmeType
                    ) =>
                        assignedSections.includes(
                            programmeType.value
                        )
                );
            },
            [
                isTrainer,
                currentTrainer,
            ]
        );


    const availableProgrammeTypes =
        isTrainer
            ? trainerProgrammeTypes
            : PROGRAMME_TYPES;


    // ======================================================
    // OWNER TRAINERS
    // ======================================================

    const eligibleOwnerTrainers =
        useMemo(
            () => {
                if (!isAdmin) {
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


    // ======================================================
    // AUTHORIZED TRAINERS
    // ======================================================

    const eligibleAuthorizedTrainers =
        useMemo(
            () => {
                if (!isAdmin) {
                    return [];
                }


                return eligibleOwnerTrainers.filter(
                    (
                        trainer
                    ) =>
                        String(
                            trainer._id
                        ) !==
                        String(
                            formData.ownerId
                        )
                );
            },
            [
                isAdmin,
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


                        if (!query) {
                            return true;
                        }


                        const owner =
                            programme.ownerTrainer ||
                            programme.owner ||
                            programme.trainer;


                        const searchableText =
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


                        return searchableText.includes(
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


    // ======================================================
    // INPUT
    // ======================================================

    const handleInputChange = (
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
                            current.authorizedTrainers.filter(
                                (
                                    trainerId
                                ) =>
                                    String(
                                        trainerId
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
    // AUTHORIZED TRAINER CHECKBOX
    // ======================================================

    const handleToggleAuthorizedTrainer = (
        trainerId
    ) => {
        clearFeedback();


        setFormData(
            (
                current
            ) => {
                if (
                    current.authorizedTrainers.includes(
                        trainerId
                    )
                ) {
                    return {
                        ...current,

                        authorizedTrainers:
                            current.authorizedTrainers.filter(
                                (
                                    id
                                ) =>
                                    id !==
                                    trainerId
                            ),
                    };
                }


                return {
                    ...current,

                    authorizedTrainers: [
                        ...current.authorizedTrainers,
                        trainerId,
                    ],
                };
            }
        );
    };


    // ======================================================
    // RESET FORM
    // ======================================================

    const resetForm = () => {
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


    // ======================================================
    // CREATE
    // ======================================================

    const handleCreateProgramme = () => {
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


    // ======================================================
    // EDIT
    // ======================================================

    const handleEditProgramme = (
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
                ? programme.authorizedTrainers
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
            behavior: "smooth",
        });
    };


    // ======================================================
    // VALIDATION
    // ======================================================

    const validateForm = () => {
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


        const title =
            formData
                .title
                .trim();


        if (
            title.length <
            3 ||
            title.length >
            150
        ) {
            return "Programme title must be between 3 and 150 characters.";
        }


        const description =
            formData
                .description
                .trim();


        if (
            description.length <
            10 ||
            description.length >
            3000
        ) {
            return "Programme description must be between 10 and 3000 characters.";
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
            return "Pass mark must be a number between 0 and 100.";
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
            isAdmin &&
            !eligibleOwnerTrainers.some(
                (
                    trainer
                ) =>
                    String(
                        trainer._id
                    ) ===
                    String(
                        formData.ownerId
                    )
            )
        ) {
            return "The selected owner Trainer is not assigned to this training area.";
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
    // SUBMIT
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


            try {
                setSaving(
                    true
                );


                const payload = {
                    programmeType:
                        formData.programmeType,

                    title:
                        formData.title.trim(),

                    description:
                        formData.description.trim(),

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


                if (
                    editingProgramme
                ) {
                    const response =
                        await api.patch(
                            `/training-programmes/${editingProgramme._id}`,
                            payload
                        );


                    setSuccessMessage(
                        response.data
                            ?.message ||
                        "Training programme updated successfully."
                    );

                } else {
                    const response =
                        await api.post(
                            "/training-programmes",
                            payload
                        );


                    setSuccessMessage(
                        response.data
                            ?.message ||
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


            if (!confirmed) {
                return;
            }


            clearFeedback();


            setProcessingId(
                programme._id
            );


            try {
                const response =
                    await api.delete(
                        `/training-programmes/${programme._id}`
                    );


                setSuccessMessage(
                    response.data
                        ?.message ||
                    "Training programme deactivated successfully."
                );


                await loadProgrammes();

            } catch (error) {
                console.error(
                    "Deactivate programme error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to deactivate this programme."
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
            programme
        ) => {
            if (
                !programme?._id
            ) {
                return;
            }


            clearFeedback();


            setProcessingId(
                programme._id
            );


            try {
                const response =
                    await api.patch(
                        `/training-programmes/${programme._id}/reactivate`
                    );


                setSuccessMessage(
                    response.data
                        ?.message ||
                    "Training programme reactivated successfully."
                );


                await loadProgrammes();

            } catch (error) {
                console.error(
                    "Reactivate programme error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reactivate this programme."
                    )
                );

            } finally {
                setProcessingId(
                    ""
                );
            }
        };


    // ======================================================
    // SECTIONS
    // ======================================================

    const handleManageSections = (
        programme
    ) => {
        if (
            !programme?._id
        ) {
            return;
        }


        navigate(
            `/training-programmes/${programme._id}/sections`
        );
    };


    // ======================================================
    // COUNTS
    // ======================================================

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
    // UI
    // ======================================================

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
                    tone="blue"
                />


                <ManagerStat
                    label="Active"
                    value={
                        activeCount
                    }
                    tone="green"
                />


                <ManagerStat
                    label="Draft"
                    value={
                        draftCount
                    }
                    tone="amber"
                />


                <ManagerStat
                    label="Inactive"
                    value={
                        inactiveCount
                    }
                    tone="slate"
                />
            </section>


            {/* FEEDBACK */}

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


            {/* CREATE BUTTON */}

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


            {/* FORM */}

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


            {/* FILTERS */}

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


            {/* TABLE */}

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


// ======================================================
// STAT CARD
// ======================================================

function ManagerStat({
    label,
    value,
    tone,
}) {
    const styles = {
        blue:
            "bg-blue-50 text-blue-600",

        green:
            "bg-emerald-50 text-emerald-600",

        amber:
            "bg-amber-50 text-amber-600",

        slate:
            "bg-slate-100 text-slate-600",
    };


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
            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                <div>
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
                </div>


                <div
                    className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full

                        ${styles[tone]
                        }
                    `}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                    >
                        <path d="M4 5h7v14H4z" />
                        <path d="M13 5h7v14h-7z" />
                    </svg>
                </div>
            </div>
        </article>
    );
}


export default TrainingProgrammeManager;