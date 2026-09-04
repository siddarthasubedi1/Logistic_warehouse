import {
    useEffect,
    useState,
} from "react";

import api from "../../services/api";


const TRAINING_SECTIONS = [
    {
        id: "manual-handling",
        name: "Manual Handling",

        description:
            "Safe lifting, carrying and manual handling procedures.",
    },

    {
        id: "working-at-height",
        name: "Working at Height",

        description:
            "Safety procedures for working at elevated locations.",
    },
];


const getInitialFormData = () => ({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "",
    role: "",
    assignedTrainingSections: [],
});


function CreateUserForm() {
    const [
        showCreateForm,
        setShowCreateForm,
    ] = useState(false);


    const [
        formData,
        setFormData,
    ] = useState(
        getInitialFormData()
    );


    const [
        pendingUsers,
        setPendingUsers,
    ] = useState([]);


    const [
        selectedUserId,
        setSelectedUserId,
    ] = useState("");


    const [
        selectedUser,
        setSelectedUser,
    ] = useState(null);


    const [
        credentials,
        setCredentials,
    ] = useState(null);


    const [
        loadingUsers,
        setLoadingUsers,
    ] = useState(false);


    const [
        savingUser,
        setSavingUser,
    ] = useState(false);


    const [
        generating,
        setGenerating,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        success,
        setSuccess,
    ] = useState("");


    // ======================================================
    // LOAD PENDING USERS
    // ======================================================

    const loadPendingUsers =
        async () => {
            try {
                setLoadingUsers(
                    true
                );


                const response =
                    await api.get(
                        "/admin/pending-users"
                    );


                setPendingUsers(
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : []
                );

            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to load pending users."
                );

            } finally {
                setLoadingUsers(
                    false
                );
            }
        };


    useEffect(() => {
        loadPendingUsers();
    }, []);


    // ======================================================
    // CREATE FORM
    // ======================================================

    const toggleCreateForm = () => {
        setShowCreateForm(
            (current) =>
                !current
        );

        setError("");
        setSuccess("");
    };


    const handleCancelForm = () => {
        setShowCreateForm(
            false
        );

        setFormData(
            getInitialFormData()
        );

        setError("");
    };


    // ======================================================
    // NORMAL FORM CHANGE
    // ======================================================

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;


        setFormData(
            (current) => ({
                ...current,
                [name]:
                    value,
            })
        );


        setError("");
        setSuccess("");
    };


    // ======================================================
    // TRAINING SECTION TOGGLE
    // ======================================================

    const toggleTrainingSection = (
        sectionId
    ) => {
        setFormData(
            (current) => {
                const currentSections =
                    current
                        .assignedTrainingSections;


                if (
                    currentSections.includes(
                        sectionId
                    )
                ) {
                    return {
                        ...current,

                        assignedTrainingSections:
                            currentSections.filter(
                                (item) =>
                                    item !==
                                    sectionId
                            ),
                    };
                }


                return {
                    ...current,

                    assignedTrainingSections:
                        [
                            ...currentSections,
                            sectionId,
                        ],
                };
            }
        );


        setError("");
        setSuccess("");
    };


    // ======================================================
    // SAVE USER
    // ======================================================

    const handleSaveUser =
        async (event) => {
            event.preventDefault();


            setError("");
            setSuccess("");
            setCredentials(null);


            const {
                firstName,
                lastName,
                age,
                email,
                phoneNumber,
                address,
                gender,
                role,
                assignedTrainingSections,
            } = formData;


            if (
                !firstName.trim() ||
                !lastName.trim() ||
                !age ||
                !email.trim() ||
                !phoneNumber.trim() ||
                !address.trim() ||
                !gender ||
                !role
            ) {
                setError(
                    "Please complete all user information."
                );

                return;
            }


            if (
                Number(age) <
                16
            ) {
                setError(
                    "Age must be 16 or above."
                );

                return;
            }


            if (
                assignedTrainingSections.length ===
                0
            ) {
                setError(
                    "Please select at least one training section."
                );

                return;
            }


            try {
                setSavingUser(
                    true
                );


                const response =
                    await api.post(
                        "/admin/pending-users",
                        {
                            firstName:
                                firstName.trim(),

                            lastName:
                                lastName.trim(),

                            age:
                                Number(age),

                            email:
                                email.trim(),

                            phoneNumber:
                                phoneNumber.trim(),

                            address:
                                address.trim(),

                            gender,

                            role,

                            assignedTrainingSections,
                        }
                    );


                setSuccess(
                    response.data
                        ?.message ||
                    "User information saved successfully."
                );


                setFormData(
                    getInitialFormData()
                );


                setShowCreateForm(
                    false
                );


                await loadPendingUsers();

            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to save user information."
                );

            } finally {
                setSavingUser(
                    false
                );
            }
        };


    // ======================================================
    // SELECT PENDING USER
    // ======================================================

    const handleUserSelect = (
        event
    ) => {
        const userId =
            event.target.value;


        setSelectedUserId(
            userId
        );


        setCredentials(
            null
        );


        setError("");
        setSuccess("");


        if (!userId) {
            setSelectedUser(
                null
            );

            return;
        }


        const user =
            pendingUsers.find(
                (item) =>
                    String(
                        item.id
                    ) ===
                    String(
                        userId
                    )
            );


        setSelectedUser(
            user || null
        );
    };


    // ======================================================
    // GENERATE CREDENTIALS
    // ======================================================

    const handleGenerate =
        async () => {
            if (
                !selectedUserId
            ) {
                setError(
                    "Please select a pending user first."
                );

                return;
            }


            try {
                setGenerating(
                    true
                );

                setError("");
                setSuccess("");
                setCredentials(null);


                const response =
                    await api.post(
                        "/admin/generate-credentials",
                        {
                            pendingUserId:
                                selectedUserId,
                        }
                    );


                setCredentials(
                    response.data
                        .credentials
                );


                if (
                    response.data
                        .user
                ) {
                    setSelectedUser(
                        response.data
                            .user
                    );
                }


                setSelectedUserId(
                    ""
                );


                setSuccess(
                    response.data
                        ?.message ||
                    "Account generated successfully."
                );


                await loadPendingUsers();

            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to generate account."
                );

            } finally {
                setGenerating(
                    false
                );
            }
        };


    // ======================================================
    // SEND EMAIL
    // ======================================================

    const handleSendEmail = () => {
        if (
            !selectedUser?.email ||
            !credentials
        ) {
            return;
        }


        const fullName =
            `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`
                .trim();


        const subject =
            "UK LogiWare - Your Account Credentials";


        const body =
            `Hello ${fullName},

Your UK LogiWare account has been created successfully.

Username: ${credentials.username}
Temporary Password: ${credentials.password}

Login here:
http://localhost:5173/login

For security, please change your temporary password after your first login.

Regards,
UK LogiWare Administrator`;


        const gmailUrl =
            "https://mail.google.com/mail/?view=cm&fs=1" +
            `&to=${encodeURIComponent(
                selectedUser.email
            )}` +
            `&su=${encodeURIComponent(
                subject
            )}` +
            `&body=${encodeURIComponent(
                body
            )}`;


        window.open(
            gmailUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    // ======================================================
    // SECTION NAME
    // ======================================================

    const getSectionName = (
        sectionId
    ) => {
        const section =
            TRAINING_SECTIONS.find(
                (item) =>
                    item.id ===
                    sectionId
            );


        return (
            section?.name ||
            sectionId
        );
    };


    return (
        <div className="space-y-6">

            {/* ================================================= */}
            {/* CREATE USER HERO */}
            {/* ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-7">

                    <div className="absolute -right-14 -top-16 h-40 w-40 rounded-full bg-white/10" />


                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-4">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-7 w-7 text-white"
                                >
                                    <circle
                                        cx="9"
                                        cy="7"
                                        r="3"
                                    />

                                    <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                                    <path d="M18 5v8" />

                                    <path d="M14 9h8" />
                                </svg>

                            </div>


                            <div>

                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                                    User Accounts
                                </p>


                                <h1 className="mt-1 text-xl font-bold text-white">
                                    Create Trainer or Trainee
                                </h1>


                                <p className="mt-1 text-sm text-blue-100">
                                    Enter user information and assign their training.
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={
                                toggleCreateForm
                            }
                            className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
                        >
                            {showCreateForm
                                ? "Close Form"
                                : "+ Add New User"}
                        </button>

                    </div>

                </div>

            </section>


            {/* ================================================= */}
            {/* MESSAGES */}
            {/* ================================================= */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}


            {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {success}
                </div>
            )}


            {/* ================================================= */}
            {/* CREATE FORM */}
            {/* ================================================= */}

            {showCreateForm && (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-6 py-5">

                        <h2 className="text-lg font-bold text-slate-900">
                            User Information
                        </h2>


                        <p className="mt-1 text-sm text-slate-500">
                            Complete the details and assign at least one training section.
                        </p>

                    </div>


                    <form
                        onSubmit={
                            handleSaveUser
                        }
                        className="space-y-6 p-6"
                    >

                        {/* PERSONAL INFORMATION */}

                        <div>

                            <h3 className="text-sm font-bold text-slate-900">
                                Personal Information
                            </h3>


                            <div className="mt-4 grid gap-4 md:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        First Name *
                                    </label>


                                    <input
                                        type="text"
                                        name="firstName"
                                        value={
                                            formData.firstName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter first name"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Last Name *
                                    </label>


                                    <input
                                        type="text"
                                        name="lastName"
                                        value={
                                            formData.lastName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter last name"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Age *
                                    </label>


                                    <input
                                        type="number"
                                        min="16"
                                        name="age"
                                        value={
                                            formData.age
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter age"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Gender *
                                    </label>


                                    <select
                                        name="gender"
                                        value={
                                            formData.gender
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                                    >
                                        <option value="">
                                            Select gender
                                        </option>

                                        <option value="male">
                                            Male
                                        </option>

                                        <option value="female">
                                            Female
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>
                                    </select>

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Email *
                                    </label>


                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="example@email.com"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Phone Number *
                                    </label>


                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={
                                            formData.phoneNumber
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter phone number"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                    />

                                </div>


                                <div className="md:col-span-2">

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Address *
                                    </label>


                                    <input
                                        type="text"
                                        name="address"
                                        value={
                                            formData.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter address"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* ROLE */}

                        <div className="border-t border-slate-200 pt-6">

                            <h3 className="text-sm font-bold text-slate-900">
                                User Role
                            </h3>


                            <p className="mt-1 text-xs text-slate-500">
                                Select whether this user is a Trainer or Trainee.
                            </p>


                            <div className="mt-4 grid gap-4 md:grid-cols-2">

                                {[
                                    {
                                        id:
                                            "trainer",

                                        title:
                                            "Trainer",

                                        description:
                                            "Can manage assigned training sections and trainee activities.",
                                    },

                                    {
                                        id:
                                            "trainee",

                                        title:
                                            "Trainee",

                                        description:
                                            "Can complete the training sections assigned by the Administrator.",
                                    },
                                ].map(
                                    (roleOption) => {
                                        const selected =
                                            formData.role ===
                                            roleOption.id;


                                        return (
                                            <button
                                                key={
                                                    roleOption.id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleChange({
                                                        target: {
                                                            name:
                                                                "role",

                                                            value:
                                                                roleOption.id,
                                                        },
                                                    })
                                                }
                                                className={`rounded-xl border p-5 text-left transition ${selected
                                                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                                                    : "border-slate-200 hover:border-blue-300"
                                                    }`}
                                            >

                                                <div className="flex items-center justify-between gap-3">

                                                    <div>

                                                        <p className="font-bold text-slate-900">
                                                            {roleOption.title}
                                                        </p>


                                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                                            {roleOption.description}
                                                        </p>

                                                    </div>


                                                    <div
                                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected
                                                            ? "border-blue-600 bg-blue-600"
                                                            : "border-slate-300"
                                                            }`}
                                                    >
                                                        {selected && (
                                                            <div className="h-2 w-2 rounded-full bg-white" />
                                                        )}
                                                    </div>

                                                </div>

                                            </button>
                                        );
                                    }
                                )}

                            </div>

                        </div>


                        {/* TRAINING ASSIGNMENT */}

                        {formData.role && (
                            <div className="border-t border-slate-200 pt-6">

                                <div>

                                    <h3 className="text-sm font-bold text-slate-900">
                                        Training Assignment *
                                    </h3>


                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Select one or both training sections for this{" "}
                                        {formData.role ===
                                            "trainer"
                                            ? "Trainer"
                                            : "Trainee"}.
                                    </p>

                                </div>


                                <div className="mt-4 grid gap-4 md:grid-cols-2">

                                    {TRAINING_SECTIONS.map(
                                        (section) => {
                                            const selected =
                                                formData.assignedTrainingSections.includes(
                                                    section.id
                                                );


                                            return (
                                                <button
                                                    key={
                                                        section.id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        toggleTrainingSection(
                                                            section.id
                                                        )
                                                    }
                                                    className={`rounded-xl border p-5 text-left transition ${selected
                                                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                                                        : "border-slate-200 bg-white hover:border-blue-300"
                                                        }`}
                                                >

                                                    <div className="flex items-start gap-3">

                                                        <div
                                                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${selected
                                                                ? "border-blue-600 bg-blue-600 text-white"
                                                                : "border-slate-300"
                                                                }`}
                                                        >
                                                            {selected && (
                                                                <span className="text-xs font-bold">
                                                                    ✓
                                                                </span>
                                                            )}
                                                        </div>


                                                        <div>

                                                            <p className="font-bold text-slate-900">
                                                                {section.name}
                                                            </p>


                                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                                {section.description}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>


                                {formData.assignedTrainingSections.length >
                                    0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">

                                            {formData.assignedTrainingSections.map(
                                                (
                                                    sectionId
                                                ) => (
                                                    <span
                                                        key={
                                                            sectionId
                                                        }
                                                        className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700"
                                                    >
                                                        {getSectionName(
                                                            sectionId
                                                        )}
                                                    </span>
                                                )
                                            )}

                                        </div>
                                    )}

                            </div>
                        )}


                        {/* BUTTONS */}

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={
                                    handleCancelForm
                                }
                                disabled={
                                    savingUser
                                }
                                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={
                                    savingUser
                                }
                                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {savingUser
                                    ? "Saving..."
                                    : "Save User"}
                            </button>

                        </div>

                    </form>

                </section>
            )}


            {/* ================================================= */}
            {/* PENDING ACCOUNT CREATION */}
            {/* ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                        <div>

                            <h2 className="text-lg font-bold text-slate-900">
                                Pending Account Creation
                            </h2>


                            <p className="mt-1 text-sm text-slate-500">
                                Review the user and generate their login credentials.
                            </p>

                        </div>


                        <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                            {pendingUsers.length} Pending
                        </span>

                    </div>

                </div>


                <div className="space-y-5 p-6">

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Select Pending User
                        </label>


                        <select
                            value={
                                selectedUserId
                            }
                            onChange={
                                handleUserSelect
                            }
                            disabled={
                                loadingUsers
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                        >

                            <option value="">

                                {loadingUsers
                                    ? "Loading pending users..."
                                    : pendingUsers.length ===
                                        0
                                        ? "No pending users"
                                        : "Select pending user"}

                            </option>


                            {pendingUsers.map(
                                (user) => (
                                    <option
                                        key={
                                            user.id
                                        }
                                        value={
                                            user.id
                                        }
                                    >
                                        {user.firstName}{" "}
                                        {user.lastName}
                                        {" — "}
                                        {user.role ===
                                            "trainer"
                                            ? "Trainer"
                                            : "Trainee"}
                                    </option>
                                )
                            )}

                        </select>

                    </div>


                    {/* REVIEW */}

                    {selectedUser &&
                        !credentials && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Account Review
                                        </p>


                                        <h3 className="mt-2 text-lg font-bold text-slate-900">
                                            {selectedUser.firstName}{" "}
                                            {selectedUser.lastName}
                                        </h3>


                                        <p className="mt-1 text-sm text-slate-500">
                                            {selectedUser.email}
                                        </p>

                                    </div>


                                    <span className="w-fit rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold capitalize text-blue-700">
                                        {selectedUser.role}
                                    </span>

                                </div>


                                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Age
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {selectedUser.age}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Gender
                                        </p>

                                        <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                                            {selectedUser.gender}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Phone
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {selectedUser.phoneNumber}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Address
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {selectedUser.address}
                                        </p>

                                    </div>

                                </div>


                                {/* ASSIGNED TRAINING */}

                                <div className="mt-5 border-t border-slate-200 pt-4">

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Assigned Training
                                    </p>


                                    <div className="mt-3 flex flex-wrap gap-2">

                                        {Array.isArray(
                                            selectedUser.assignedTrainingSections
                                        ) &&
                                            selectedUser.assignedTrainingSections
                                                .length >
                                            0 ? (
                                            selectedUser.assignedTrainingSections.map(
                                                (
                                                    sectionId
                                                ) => (
                                                    <span
                                                        key={
                                                            sectionId
                                                        }
                                                        className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700"
                                                    >
                                                        {getSectionName(
                                                            sectionId
                                                        )}
                                                    </span>
                                                )
                                            )
                                        ) : (
                                            <span className="text-sm text-slate-400">
                                                No training assigned.
                                            </span>
                                        )}

                                    </div>

                                </div>


                                <div className="mt-5 flex justify-end">

                                    <button
                                        type="button"
                                        onClick={
                                            handleGenerate
                                        }
                                        disabled={
                                            generating
                                        }
                                        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {generating
                                            ? "Generating..."
                                            : "Generate Username & Password"}
                                    </button>

                                </div>

                            </div>
                        )}


                    {/* CREDENTIALS */}

                    {credentials && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                                    Account Created
                                </p>


                                <h3 className="mt-2 text-lg font-bold text-slate-900">
                                    Credentials Generated Successfully
                                </h3>


                                <p className="mt-1 text-sm text-slate-600">
                                    These credentials are shown only once.
                                </p>

                            </div>


                            <div className="mt-5 grid gap-4 md:grid-cols-2">

                                <div className="rounded-xl bg-white p-4">

                                    <p className="text-xs font-semibold text-slate-400">
                                        Username
                                    </p>


                                    <p className="mt-2 break-all font-mono text-sm font-bold text-slate-900">
                                        {credentials.username}
                                    </p>

                                </div>


                                <div className="rounded-xl bg-white p-4">

                                    <p className="text-xs font-semibold text-slate-400">
                                        Temporary Password
                                    </p>


                                    <p className="mt-2 break-all font-mono text-sm font-bold text-slate-900">
                                        {credentials.password}
                                    </p>

                                </div>

                            </div>


                            <div className="mt-5 flex flex-wrap justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={
                                        handleSendEmail
                                    }
                                    className="rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                                >
                                    Send Credentials by Gmail
                                </button>


                                <button
                                    type="button"
                                    onClick={() => {
                                        setCredentials(
                                            null
                                        );

                                        setSelectedUser(
                                            null
                                        );

                                        setSuccess(
                                            ""
                                        );
                                    }}
                                    className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                                >
                                    Done
                                </button>

                            </div>

                        </div>
                    )}

                </div>

            </section>

        </div>
    );
}


export default CreateUserForm;