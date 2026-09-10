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


// ======================================================
// STATUS
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
// TRAINING PROGRAMME MANAGER
// ======================================================

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
    ] = useState(
        "all"
    );


    const [
        statusFilter,
        setStatusFilter,
    ] = useState(
        "all"
    );


    // ======================================================
    // PROCESS
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
        useCallback(async () => {
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
        }, []);


    // ======================================================
    // LOAD ADMIN TRAINERS
    // ======================================================

    const loadAdminTrainers =
        useCallback(async () => {
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
        }, [
            isAdmin,
        ]);


    // ======================================================
    // LOAD CURRENT TRAINER
    // ======================================================

    const loadCurrentTrainer =
        useCallback(async () => {
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
                    "Load current Trainer error:",
                    error
                );


                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to load Trainer profile."
                    )
                );
            }
        }, [
            isTrainer,
        ]);


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
        useMemo(() => {
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

        }, [
            isTrainer,
            currentTrainer,
        ]);


    const availableProgrammeTypes =
        isTrainer
            ? trainerProgrammeTypes
            : PROGRAMME_TYPES;


    // ======================================================
    // ELIGIBLE OWNER TRAINERS
    // ======================================================

    const eligibleOwnerTrainers =
        useMemo(() => {
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

        }, [
            isAdmin,
            trainers,
            formData.programmeType,
        ]);


    // ======================================================
    // ELIGIBLE AUTHORIZED TRAINERS
    // ======================================================

    const eligibleAuthorizedTrainers =
        useMemo(() => {
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

        }, [
            isAdmin,
            eligibleOwnerTrainers,
            formData.ownerId,
        ]);


    // ======================================================
    // FILTER PROGRAMMES
    // ======================================================

    const filteredProgrammes =
        useMemo(() => {
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

        }, [
            programmes,
            searchTerm,
            typeFilter,
            statusFilter,
        ]);


    // ======================================================
    // INPUT CHANGE
    // ======================================================

    const handleInputChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;


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
                            current
                                .authorizedTrainers
                                .filter(
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
    // TOGGLE AUTHORIZED TRAINER
    // ======================================================

    const handleToggleAuthorizedTrainer = (
        trainerId
    ) => {
        clearFeedback();


        setFormData(
            (
                current
            ) => {
                const selected =
                    current
                        .authorizedTrainers;


                if (
                    selected.includes(
                        trainerId
                    )
                ) {
                    return {
                        ...current,

                        authorizedTrainers:
                            selected.filter(
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
                        ...selected,
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
            behavior: "smooth",
        });
    };


    // ======================================================
    // VALIDATE
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
            return (
                "Please select a valid programme type."
            );
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
            return (
                "Programme title must be between 3 and 150 characters."
            );
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
            return (
                "Programme description must be between 10 and 3000 characters."
            );
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
            return (
                "Pass mark must be a number between 0 and 100."
            );
        }


        if (
            !PROGRAMME_STATUSES.includes(
                formData.status
            )
        ) {
            return (
                "Please select a valid programme status."
            );
        }


        if (
            isAdmin &&
            !formData.ownerId
        ) {
            return (
                "Please select an owner Trainer."
            );
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
            return (
                "The selected owner Trainer is not assigned to this training area."
            );
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
            return (
                "You are not assigned to this training area."
            );
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
                        formData
                            .authorizedTrainers;
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
    // MANAGE LEARNING SECTIONS
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

    if (loading) {
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
        <div className="space-y-5">

            {/* ================================================= */}
            {/* OVERVIEW */}
            {/* ================================================= */}

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
                    type="total"
                />

                <ManagerStat
                    label="Active"
                    value={
                        activeCount
                    }
                    type="active"
                />

                <ManagerStat
                    label="Draft"
                    value={
                        draftCount
                    }
                    type="draft"
                />

                <ManagerStat
                    label="Inactive"
                    value={
                        inactiveCount
                    }
                    type="inactive"
                />
            </section>


            {/* ================================================= */}
            {/* FEEDBACK */}
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
            {/* CREATE CONTROL */}
            {/* ================================================= */}

            {!showForm && (
                <section
                    className="
                        flex
                        flex-col
                        gap-3
                        rounded-2xl
                        border
                        border-blue-100
                        bg-gradient-to-r
                        from-blue-50
                        via-white
                        to-emerald-50
                        p-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:p-5
                    "
                >
                    <div>
                        <h3
                            className="
                                text-xs
                                font-bold
                                text-slate-900
                            "
                        >
                            Create Training Content
                        </h3>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                leading-5
                                text-slate-500
                            "
                        >
                            {isAdmin
                                ? "Create programmes, select an owner Trainer and authorize additional Trainers where required."
                                : "Create and manage programmes only for training areas assigned to your Trainer account."}
                        </p>
                    </div>


                    <ActionButton
                        variant="primary"
                        className="
                            w-full
                            justify-center
                            sm:w-auto
                        "
                        onClick={
                            handleCreateProgramme
                        }
                    >
                        + Create Programme
                    </ActionButton>
                </section>
            )}


            {/* ================================================= */}
            {/* FORM */}
            {/* ================================================= */}

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


            {/* ================================================= */}
            {/* PROGRAMME LIST */}
            {/* ================================================= */}

            <section
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >
                <div
                    className="
                        border-b
                        border-slate-100
                        bg-gradient-to-r
                        from-white
                        to-blue-50/40
                        p-5
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-sm
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Training Programmes
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-[10px]
                                    text-slate-500
                                "
                            >
                                Search, edit and manage programme learning
                                content.
                            </p>
                        </div>


                        <span
                            className="
                                w-fit
                                rounded-full
                                bg-blue-50
                                px-3
                                py-1.5
                                text-[9px]
                                font-semibold
                                text-blue-700
                            "
                        >
                            {filteredProgrammes.length} shown
                        </span>
                    </div>
                </div>


                <div
                    className="
                        border-b
                        border-slate-100
                        p-4
                        sm:p-5
                    "
                >
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
                            PROGRAMME_TYPES
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
                </div>


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
            </section>
        </div>
    );
}


// ======================================================
// MANAGER STAT
// ======================================================

function ManagerStat({
    label,
    value,
    type,
}) {
    const styles = {
        total:
            "bg-blue-50 text-blue-700",

        active:
            "bg-emerald-50 text-emerald-700",

        draft:
            "bg-amber-50 text-amber-700",

        inactive:
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
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        {label}
                    </p>


                    <p
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {value}
                    </p>
                </div>


                <div
                    className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl

                        ${styles[type]}
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