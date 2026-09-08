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
    {
        value:
            "draft",

        label:
            "Draft",
    },

    {
        value:
            "active",

        label:
            "Active",
    },

    {
        value:
            "inactive",

        label:
            "Inactive",
    },
];


const EMPTY_FORM = {
    programmeType:
        "manual-handling",

    title:
        "",

    description:
        "",

    ownerId:
        "",

    authorizedTrainers:
        [],

    passMark:
        80,

    status:
        "draft",
};


// ======================================================
// HELPERS
// ======================================================

function getProgrammeTypeLabel(
    value
) {
    return (
        PROGRAMME_TYPES.find(
            (item) =>
                item.value ===
                value
        )?.label ||
        value
    );
}


function getUserName(
    user
) {
    if (!user) {
        return "Unknown Trainer";
    }


    const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`
            .trim();


    return (
        fullName ||
        user.username ||
        user.email ||
        "Trainer"
    );
}


function StatusBadge({
    status,
}) {
    const styles = {
        active:
            "bg-emerald-50 text-emerald-700 ring-emerald-600/20",

        draft:
            "bg-amber-50 text-amber-700 ring-amber-600/20",

        inactive:
            "bg-slate-100 text-slate-600 ring-slate-500/20",
    };


    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ring-1 ring-inset ${styles[
                status
            ] ||
                styles.inactive
                }`}
        >
            {
                status ||
                "unknown"
            }
        </span>
    );
}


// ======================================================
// COMPONENT
// ======================================================

function TrainingProgrammeManager({
    role,
}) {
    const navigate =
        useNavigate();


    const isAdmin =
        role ===
        "admin";


    const [
        programmes,
        setProgrammes,
    ] = useState([]);


    const [
        trainers,
        setTrainers,
    ] = useState([]);


    const [
        currentUser,
        setCurrentUser,
    ] = useState(null);


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


    const [
        error,
        setError,
    ] = useState("");


    const [
        message,
        setMessage,
    ] = useState("");


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
    ] = useState({
        ...EMPTY_FORM,
    });


    const [
        search,
        setSearch,
    ] = useState("");


    const [
        typeFilter,
        setTypeFilter,
    ] = useState("all");


    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");


    // ==================================================
    // LOAD PROGRAMMES
    // ==================================================

    const loadProgrammes =
        useCallback(
            async () => {
                const response =
                    await api.get(
                        "/training-programmes"
                    );


                setProgrammes(
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : response.data
                            ?.programmes ||
                        []
                );
            },
            []
        );


    // ==================================================
    // LOAD TRAINERS
    // ==================================================

    const loadTrainers =
        useCallback(
            async () => {
                if (!isAdmin) {
                    return;
                }


                const response =
                    await api.get(
                        "/admin/users"
                    );


                const users =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : response.data
                            ?.users ||
                        [];


                setTrainers(
                    users.filter(
                        (user) =>
                            user.role ===
                            "trainer" &&
                            user.status ===
                            "active" &&
                            user.accountStatus ===
                            "created"
                    )
                );
            },
            [
                isAdmin,
            ]
        );


    // ==================================================
    // CURRENT TRAINER
    // ==================================================

    const loadCurrentUser =
        useCallback(
            async () => {
                if (isAdmin) {
                    return;
                }


                const response =
                    await api.get(
                        "/users/me"
                    );


                setCurrentUser(
                    response.data
                        ?.user ||
                    null
                );
            },
            [
                isAdmin,
            ]
        );


    // ==================================================
    // PAGE
    // ==================================================

    const loadPage =
        useCallback(
            async () => {
                try {
                    setLoading(
                        true
                    );


                    setError(
                        ""
                    );


                    await Promise.all([
                        loadProgrammes(),
                        loadTrainers(),
                        loadCurrentUser(),
                    ]);

                } catch (error) {
                    console.error(
                        "Load programme page error:",
                        error
                    );


                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load training programmes."
                    );

                } finally {
                    setLoading(
                        false
                    );
                }
            },
            [
                loadProgrammes,
                loadTrainers,
                loadCurrentUser,
            ]
        );


    useEffect(() => {
        loadPage();
    }, [
        loadPage,
    ]);


    // ==================================================
    // AVAILABLE TYPES
    // ==================================================

    const availableProgrammeTypes =
        useMemo(
            () => {
                if (isAdmin) {
                    return PROGRAMME_TYPES;
                }


                const assigned =
                    Array.isArray(
                        currentUser
                            ?.assignedTrainingSections
                    )
                        ? currentUser
                            .assignedTrainingSections
                        : [];


                return PROGRAMME_TYPES.filter(
                    (type) =>
                        assigned.includes(
                            type.value
                        )
                );
            },
            [
                isAdmin,
                currentUser,
            ]
        );


    // ==================================================
    // OWNER TRAINERS
    // ==================================================

    const eligibleOwnerTrainers =
        useMemo(
            () =>
                trainers.filter(
                    (trainer) =>
                        Array.isArray(
                            trainer
                                .assignedTrainingSections
                        ) &&
                        trainer
                            .assignedTrainingSections
                            .includes(
                                formData
                                    .programmeType
                            )
                ),
            [
                trainers,
                formData.programmeType,
            ]
        );


    const eligibleAuthorizedTrainers =
        useMemo(
            () =>
                eligibleOwnerTrainers.filter(
                    (trainer) =>
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


    // ==================================================
    // FILTER
    // ==================================================

    const filteredProgrammes =
        useMemo(
            () => {
                const value =
                    search
                        .trim()
                        .toLowerCase();


                return programmes.filter(
                    (programme) => {
                        if (
                            typeFilter !==
                            "all" &&
                            programme
                                .programmeType !==
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


                        if (!value) {
                            return true;
                        }


                        const text =
                            [
                                programme.title,
                                programme.description,

                                getProgrammeTypeLabel(
                                    programme
                                        .programmeType
                                ),

                                getUserName(
                                    programme.owner
                                ),
                            ]
                                .join(" ")
                                .toLowerCase();


                        return text.includes(
                            value
                        );
                    }
                );
            },
            [
                programmes,
                search,
                typeFilter,
                statusFilter,
            ]
        );


    // ==================================================
    // FORM
    // ==================================================

    const resetForm =
        () => {
            setEditingProgramme(
                null
            );


            setFormData({
                ...EMPTY_FORM,

                programmeType:
                    availableProgrammeTypes[
                        0
                    ]?.value ||
                    "manual-handling",
            });
        };


    const openCreateForm =
        () => {
            resetForm();

            setError("");

            setMessage("");

            setShowForm(true);
        };


    const openEditForm =
        (programme) => {
            const ownerId =
                typeof programme.owner ===
                    "object"
                    ? programme.owner
                        ?._id ||
                    ""
                    : programme.owner ||
                    "";


            const authorizedTrainers =
                Array.isArray(
                    programme
                        .authorizedTrainers
                )
                    ? programme
                        .authorizedTrainers
                        .map(
                            (trainer) =>
                                typeof trainer ===
                                    "object"
                                    ? trainer
                                        ?._id
                                    : trainer
                        )
                        .filter(Boolean)
                    : [];


            setEditingProgramme(
                programme
            );


            setFormData({
                programmeType:
                    programme
                        .programmeType,

                title:
                    programme.title ||
                    "",

                description:
                    programme
                        .description ||
                    "",

                ownerId,

                authorizedTrainers,

                passMark:
                    programme
                        .passMark ??
                    80,

                status:
                    programme.status ||
                    "draft",
            });


            setError("");

            setMessage("");

            setShowForm(true);
        };


    const closeForm =
        () => {
            setShowForm(false);

            resetForm();
        };


    // ==================================================
    // CHANGE
    // ==================================================

    const handleInputChange =
        (event) => {
            const {
                name,
                value,
            } =
                event.target;


            if (
                name ===
                "programmeType"
            ) {
                setFormData(
                    (current) => ({
                        ...current,

                        programmeType:
                            value,

                        ownerId:
                            isAdmin
                                ? ""
                                : current
                                    .ownerId,

                        authorizedTrainers:
                            isAdmin
                                ? []
                                : current
                                    .authorizedTrainers,
                    })
                );


                return;
            }


            if (
                name ===
                "ownerId"
            ) {
                setFormData(
                    (current) => ({
                        ...current,

                        ownerId:
                            value,

                        authorizedTrainers:
                            current
                                .authorizedTrainers
                                .filter(
                                    (id) =>
                                        id !==
                                        value
                                ),
                    })
                );


                return;
            }


            setFormData(
                (current) => ({
                    ...current,

                    [name]:
                        value,
                })
            );
        };


    const toggleAuthorizedTrainer =
        (trainerId) => {
            setFormData(
                (current) => ({
                    ...current,

                    authorizedTrainers:
                        current
                            .authorizedTrainers
                            .includes(
                                trainerId
                            )
                            ? current
                                .authorizedTrainers
                                .filter(
                                    (id) =>
                                        id !==
                                        trainerId
                                )
                            : [
                                ...current
                                    .authorizedTrainers,

                                trainerId,
                            ],
                })
            );
        };


    // ==================================================
    // SAVE
    // ==================================================

    const handleSubmit =
        async (event) => {
            event.preventDefault();


            if (
                !formData
                    .title
                    .trim()
            ) {
                setError(
                    "Programme title is required."
                );

                return;
            }


            if (
                !formData
                    .description
                    .trim()
            ) {
                setError(
                    "Programme description is required."
                );

                return;
            }


            if (
                isAdmin &&
                !formData.ownerId
            ) {
                setError(
                    "Please select a programme owner."
                );

                return;
            }


            const passMark =
                Number(
                    formData.passMark
                );


            if (
                Number.isNaN(
                    passMark
                ) ||
                passMark <
                0 ||
                passMark >
                100
            ) {
                setError(
                    "Pass mark must be between 0 and 100."
                );

                return;
            }


            try {
                setSaving(true);

                setError("");

                setMessage("");


                const payload = {
                    programmeType:
                        formData
                            .programmeType,

                    title:
                        formData
                            .title
                            .trim(),

                    description:
                        formData
                            .description
                            .trim(),

                    passMark,

                    status:
                        formData.status,
                };


                if (isAdmin) {
                    payload.ownerId =
                        formData.ownerId;


                    payload.authorizedTrainers =
                        formData
                            .authorizedTrainers;
                }


                if (
                    editingProgramme
                ) {
                    await api.patch(
                        `/training-programmes/${editingProgramme._id}`,
                        payload
                    );


                    setMessage(
                        "Training programme updated successfully."
                    );

                } else {
                    await api.post(
                        "/training-programmes",
                        payload
                    );


                    setMessage(
                        "Training programme created successfully."
                    );
                }


                await loadProgrammes();


                setShowForm(false);

                resetForm();

            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to save training programme."
                );

            } finally {
                setSaving(false);
            }
        };


    // ==================================================
    // DEACTIVATE
    // ==================================================

    const handleDeactivate =
        async (programme) => {
            if (
                !window.confirm(
                    `Deactivate "${programme.title}"?`
                )
            ) {
                return;
            }


            try {
                setProcessingId(
                    programme._id
                );


                setError("");

                setMessage("");


                await api.delete(
                    `/training-programmes/${programme._id}`
                );


                setMessage(
                    "Training programme deactivated successfully."
                );


                await loadProgrammes();

            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to deactivate training programme."
                );

            } finally {
                setProcessingId("");
            }
        };


    // ==================================================
    // REACTIVATE
    // ==================================================

    const handleReactivate =
        async (programme) => {
            if (
                !window.confirm(
                    `Reactivate "${programme.title}"?`
                )
            ) {
                return;
            }


            try {
                setProcessingId(
                    programme._id
                );


                setError("");

                setMessage("");


                await api.patch(
                    `/training-programmes/${programme._id}/reactivate`
                );


                setMessage(
                    "Training programme reactivated successfully."
                );


                await loadProgrammes();

            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to reactivate training programme."
                );

            } finally {
                setProcessingId("");
            }
        };


    // ==================================================
    // SECTIONS
    // ==================================================

    const openSections =
        (programme) => {
            navigate(
                `/training-programmes/${programme._id}/sections`
            );
        };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {
        return (
            <div className="flex min-h-[420px] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="mt-4 text-sm text-slate-600">
                        Loading training programmes...
                    </p>

                </div>

            </div>
        );
    }


    // ==================================================
    // UI
    // ==================================================

    return (
        <div className="space-y-5">

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>

                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-600">
                            Sprint 2
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            Training Programme Management
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Create, edit, deactivate, reactivate and manage learning sections.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            openCreateForm
                        }
                        disabled={
                            !isAdmin &&
                            availableProgrammeTypes.length ===
                            0
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300"
                    >
                        + Create Programme
                    </button>

                </div>

            </section>


            {
                message && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
                        {message}
                    </div>
                )
            }


            {
                error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                        {error}
                    </div>
                )
            }


            {
                showForm && (
                    <section className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">

                        <div className="mb-5 flex justify-between">

                            <h3 className="font-bold text-slate-900">
                                {
                                    editingProgramme
                                        ? "Edit Training Programme"
                                        : "Create Training Programme"
                                }
                            </h3>


                            <button
                                type="button"
                                onClick={
                                    closeForm
                                }
                                className="rounded border px-3 py-2 text-xs"
                            >
                                Cancel
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-4"
                        >

                            <div className="grid gap-4 md:grid-cols-2">

                                <label>

                                    <span className="text-xs font-semibold">
                                        Programme Type *
                                    </span>

                                    <select
                                        name="programmeType"
                                        value={
                                            formData.programmeType
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="mt-2 w-full rounded-lg border px-3 py-2.5 text-sm"
                                    >
                                        {
                                            availableProgrammeTypes.map(
                                                (type) => (
                                                    <option
                                                        key={
                                                            type.value
                                                        }
                                                        value={
                                                            type.value
                                                        }
                                                    >
                                                        {type.label}
                                                    </option>
                                                )
                                            )
                                        }
                                    </select>

                                </label>


                                <label>

                                    <span className="text-xs font-semibold">
                                        Pass Mark (%) *
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        name="passMark"
                                        value={
                                            formData.passMark
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="mt-2 w-full rounded-lg border px-3 py-2.5 text-sm"
                                    />

                                </label>

                            </div>


                            <label className="block">

                                <span className="text-xs font-semibold">
                                    Title *
                                </span>

                                <input
                                    type="text"
                                    name="title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    className="mt-2 w-full rounded-lg border px-3 py-2.5 text-sm"
                                />

                            </label>


                            <label className="block">

                                <span className="text-xs font-semibold">
                                    Description *
                                </span>

                                <textarea
                                    rows="5"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    className="mt-2 w-full rounded-lg border px-3 py-2.5 text-sm"
                                />

                            </label>


                            {
                                isAdmin && (
                                    <div className="grid gap-4 md:grid-cols-2">

                                        <label>

                                            <span className="text-xs font-semibold">
                                                Programme Owner *
                                            </span>

                                            <select
                                                name="ownerId"
                                                value={
                                                    formData.ownerId
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                className="mt-2 w-full rounded-lg border px-3 py-2.5 text-sm"
                                            >

                                                <option value="">
                                                    Select Trainer
                                                </option>

                                                {
                                                    eligibleOwnerTrainers.map(
                                                        (trainer) => (
                                                            <option
                                                                key={
                                                                    trainer._id
                                                                }
                                                                value={
                                                                    trainer._id
                                                                }
                                                            >
                                                                {
                                                                    getUserName(
                                                                        trainer
                                                                    )
                                                                }
                                                            </option>
                                                        )
                                                    )
                                                }

                                            </select>

                                        </label>


                                        <div>

                                            <p className="text-xs font-semibold">
                                                Authorized Trainers
                                            </p>

                                            <div className="mt-2 space-y-2 rounded-lg border p-3">

                                                {
                                                    eligibleAuthorizedTrainers.length ===
                                                        0
                                                        ? (
                                                            <p className="text-xs text-slate-500">
                                                                No additional eligible Trainers.
                                                            </p>
                                                        )
                                                        : eligibleAuthorizedTrainers.map(
                                                            (trainer) => (
                                                                <label
                                                                    key={
                                                                        trainer._id
                                                                    }
                                                                    className="flex gap-2"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            formData.authorizedTrainers.includes(
                                                                                trainer._id
                                                                            )
                                                                        }
                                                                        onChange={
                                                                            () =>
                                                                                toggleAuthorizedTrainer(
                                                                                    trainer._id
                                                                                )
                                                                        }
                                                                    />

                                                                    <span className="text-xs">
                                                                        {
                                                                            getUserName(
                                                                                trainer
                                                                            )
                                                                        }
                                                                    </span>
                                                                </label>
                                                            )
                                                        )
                                                }

                                            </div>

                                        </div>

                                    </div>
                                )
                            }


                            <label className="block max-w-xs">

                                <span className="text-xs font-semibold">
                                    Status
                                </span>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    className="mt-2 w-full rounded-lg border px-3 py-2.5 text-sm"
                                >
                                    {
                                        PROGRAMME_STATUSES.map(
                                            (status) => (
                                                <option
                                                    key={
                                                        status.value
                                                    }
                                                    value={
                                                        status.value
                                                    }
                                                >
                                                    {
                                                        status.label
                                                    }
                                                </option>
                                            )
                                        )
                                    }
                                </select>

                            </label>


                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    className="rounded-lg border px-4 py-2 text-xs"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white"
                                >
                                    {
                                        saving
                                            ? "Saving..."
                                            : editingProgramme
                                                ? "Save Changes"
                                                : "Create Programme"
                                    }
                                </button>

                            </div>

                        </form>

                    </section>
                )
            }


            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b p-5">

                    <div className="grid gap-2 md:grid-cols-3">

                        <input
                            type="search"
                            placeholder="Search programmes"
                            value={
                                search
                            }
                            onChange={
                                (event) =>
                                    setSearch(
                                        event.target.value
                                    )
                            }
                            className="rounded-lg border px-3 py-2 text-xs"
                        />


                        <select
                            value={
                                typeFilter
                            }
                            onChange={
                                (event) =>
                                    setTypeFilter(
                                        event.target.value
                                    )
                            }
                            className="rounded-lg border px-3 py-2 text-xs"
                        >
                            <option value="all">
                                All Types
                            </option>

                            {
                                PROGRAMME_TYPES.map(
                                    (type) => (
                                        <option
                                            key={
                                                type.value
                                            }
                                            value={
                                                type.value
                                            }
                                        >
                                            {type.label}
                                        </option>
                                    )
                                )
                            }
                        </select>


                        <select
                            value={
                                statusFilter
                            }
                            onChange={
                                (event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                            }
                            className="rounded-lg border px-3 py-2 text-xs"
                        >
                            <option value="all">
                                All Statuses
                            </option>

                            {
                                PROGRAMME_STATUSES.map(
                                    (status) => (
                                        <option
                                            key={
                                                status.value
                                            }
                                            value={
                                                status.value
                                            }
                                        >
                                            {
                                                status.label
                                            }
                                        </option>
                                    )
                                )
                            }
                        </select>

                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-slate-50">

                            <tr className="text-left text-[10px] uppercase text-slate-500">

                                <th className="px-5 py-3">
                                    Programme
                                </th>

                                <th className="px-5 py-3">
                                    Type
                                </th>

                                <th className="px-5 py-3">
                                    Owner
                                </th>

                                <th className="px-5 py-3">
                                    Pass
                                </th>

                                <th className="px-5 py-3">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-right">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y">

                            {
                                filteredProgrammes.map(
                                    (programme) => (
                                        <tr
                                            key={
                                                programme._id
                                            }
                                            className="text-xs"
                                        >

                                            <td className="px-5 py-4">
                                                <p className="font-semibold">
                                                    {
                                                        programme.title
                                                    }
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                {
                                                    getProgrammeTypeLabel(
                                                        programme.programmeType
                                                    )
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                {
                                                    getUserName(
                                                        programme.owner
                                                    )
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                {
                                                    programme.passMark
                                                }
                                                %
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    status={
                                                        programme.status
                                                    }
                                                />
                                            </td>

                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            () =>
                                                                openSections(
                                                                    programme
                                                                )
                                                        }
                                                        className="rounded-md bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700"
                                                    >
                                                        Manage Sections
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={
                                                            () =>
                                                                openEditForm(
                                                                    programme
                                                                )
                                                        }
                                                        className="rounded-md bg-blue-50 px-3 py-1.5 text-[10px] font-semibold text-blue-700"
                                                    >
                                                        Edit
                                                    </button>


                                                    {
                                                        programme.status ===
                                                            "inactive"
                                                            ? (
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        processingId ===
                                                                        programme._id
                                                                    }
                                                                    onClick={
                                                                        () =>
                                                                            handleReactivate(
                                                                                programme
                                                                            )
                                                                    }
                                                                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-[10px] font-semibold text-white disabled:bg-slate-300"
                                                                >
                                                                    {
                                                                        processingId ===
                                                                            programme._id
                                                                            ? "Processing..."
                                                                            : "Reactivate"
                                                                    }
                                                                </button>
                                                            )
                                                            : (
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        processingId ===
                                                                        programme._id
                                                                    }
                                                                    onClick={
                                                                        () =>
                                                                            handleDeactivate(
                                                                                programme
                                                                            )
                                                                    }
                                                                    className="rounded-md bg-red-50 px-3 py-1.5 text-[10px] font-semibold text-red-700"
                                                                >
                                                                    {
                                                                        processingId ===
                                                                            programme._id
                                                                            ? "Processing..."
                                                                            : "Deactivate"
                                                                    }
                                                                </button>
                                                            )
                                                    }

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )
                            }

                        </tbody>

                    </table>

                </div>

            </section>

        </div>
    );
}


export default TrainingProgrammeManager;