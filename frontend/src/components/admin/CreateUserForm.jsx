import {
    useEffect,
    useState,
} from "react";

import api from "../../services/api";


const TRAINING_SECTIONS = [
    {
        id: "manual-handling",
        name: "Manual Handling",
    },
    {
        id: "working-at-height",
        name: "Working at Height",
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
    ] = useState(true);


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
                console.error(
                    "Load pending users error:",
                    error
                );


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
            (
                current
            ) =>
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
        setSuccess("");
    };


    // ======================================================
    // CHANGE
    // ======================================================

    const handleChange = (
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
                    "role"
                ) {
                    return {
                        ...current,

                        role:
                            value,

                        assignedTrainingSections:
                            value ===
                                "trainee"
                                ? TRAINING_SECTIONS.map(
                                    (
                                        section
                                    ) =>
                                        section.id
                                )
                                : [],
                    };
                }


                return {
                    ...current,

                    [name]:
                        value,
                };
            }
        );


        setError("");
        setSuccess("");
    };


    // ======================================================
    // TRAINER TRAINING SELECTION
    // ======================================================

    const toggleTrainingSection = (
        sectionId
    ) => {
        if (
            formData.role ===
            "trainee"
        ) {
            return;
        }


        setFormData(
            (
                current
            ) => {
                const selected =
                    current.assignedTrainingSections;


                if (
                    selected.includes(
                        sectionId
                    )
                ) {
                    return {
                        ...current,

                        assignedTrainingSections:
                            selected.filter(
                                (
                                    id
                                ) =>
                                    id !==
                                    sectionId
                            ),
                    };
                }


                return {
                    ...current,

                    assignedTrainingSections:
                        [
                            ...selected,
                            sectionId,
                        ],
                };
            }
        );
    };


    // ======================================================
    // SAVE PENDING USER
    // ======================================================

    const handleSaveUser =
        async (
            event
        ) => {
            event.preventDefault();


            setError("");
            setSuccess("");
            setCredentials(
                null
            );


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
            } =
                formData;


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
                Number(
                    age
                ) <
                16
            ) {
                setError(
                    "Age must be 16 or above."
                );

                return;
            }


            if (
                role ===
                "trainer" &&
                assignedTrainingSections.length ===
                0
            ) {
                setError(
                    "Please select at least one training section for the Trainer."
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
                                Number(
                                    age
                                ),

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
                console.error(
                    "Create pending user error:",
                    error
                );


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

    const handlePendingUserChange = (
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


        setSuccess("");
        setError("");


        const user =
            pendingUsers.find(
                (
                    item
                ) =>
                    String(
                        item._id
                    ) ===
                    String(
                        userId
                    )
            );


        setSelectedUser(
            user ||
            null
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
                setCredentials(
                    null
                );


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
                        ?.user
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
                console.error(
                    "Generate credentials error:",
                    error
                );


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
    // SEND GMAIL
    // ======================================================

    const handleSendEmail =
        () => {
            if (
                !selectedUser
                    ?.email ||
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
    // DONE
    // ======================================================

    const handleDone = () => {
        setCredentials(
            null
        );

        setSelectedUser(
            null
        );

        setSelectedUserId(
            ""
        );

        setSuccess("");
        setError("");
    };


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
            {/* FEEDBACK */}
            {/* ================================================= */}

            {success && (
                <div
                    className="
                        rounded-lg
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-4
                        py-3
                        text-[10px]
                        text-emerald-700
                    "
                >
                    {success}
                </div>
            )}


            {error && (
                <div
                    className="
                        rounded-lg
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-[10px]
                        text-red-700
                    "
                >
                    {error}
                </div>
            )}


            {/* ================================================= */}
            {/* USER FORM */}
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

                {/* HEADER */}

                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        border-b
                        border-slate-100
                        px-5
                        py-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div>
                        <h2
                            className="
                                text-[13px]
                                font-semibold
                                text-slate-800
                            "
                        >
                            Create Trainer or Trainee
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-slate-400
                            "
                        >
                            Enter user information and assign training access.
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={
                            toggleCreateForm
                        }
                        className="
                            rounded-lg
                            border
                            border-blue-200
                            bg-white
                            px-4
                            py-2.5
                            text-[10px]
                            font-medium
                            text-blue-600
                            transition
                            hover:bg-blue-50
                        "
                    >
                        {showCreateForm
                            ? "Close Form"
                            : "+ Add New User"}
                    </button>
                </div>


                {/* FORM */}

                {showCreateForm && (
                    <form
                        onSubmit={
                            handleSaveUser
                        }
                        className="
                            p-5
                            sm:p-6
                        "
                    >

                        <h3
                            className="
                                text-[11px]
                                font-semibold
                                text-slate-800
                            "
                        >
                            Personal Information
                        </h3>


                        <div
                            className="
                                mt-4
                                grid
                                gap-4
                                md:grid-cols-2
                            "
                        >

                            <FormField
                                label="First Name"
                                required
                            >
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
                                    className={
                                        inputClass
                                    }
                                />
                            </FormField>


                            <FormField
                                label="Last Name"
                                required
                            >
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
                                    className={
                                        inputClass
                                    }
                                />
                            </FormField>


                            <FormField
                                label="Age"
                                required
                            >
                                <input
                                    type="number"
                                    name="age"
                                    min="16"
                                    value={
                                        formData.age
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter age"
                                    className={
                                        inputClass
                                    }
                                />
                            </FormField>


                            <FormField
                                label="Gender"
                                required
                            >
                                <select
                                    name="gender"
                                    value={
                                        formData.gender
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className={
                                        inputClass
                                    }
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
                            </FormField>


                            <FormField
                                label="Email"
                                required
                            >
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
                                    className={
                                        inputClass
                                    }
                                />
                            </FormField>


                            <FormField
                                label="Phone Number"
                                required
                            >
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
                                    className={
                                        inputClass
                                    }
                                />
                            </FormField>


                            <div className="md:col-span-2">
                                <FormField
                                    label="Address"
                                    required
                                >
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
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>
                            </div>

                        </div>


                        {/* ROLE */}

                        <div
                            className="
                                mt-6
                                border-t
                                border-slate-100
                                pt-5
                            "
                        >
                            <h3
                                className="
                                    text-[11px]
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                User Role
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-slate-400
                                "
                            >
                                Select whether this user is a Trainer or Trainee.
                            </p>


                            <div
                                className="
                                    mt-4
                                    grid
                                    gap-3
                                    sm:grid-cols-2
                                "
                            >
                                <RoleOption
                                    title="Trainer"
                                    description="Can manage assigned training sections."
                                    value="trainer"
                                    checked={
                                        formData.role ===
                                        "trainer"
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />


                                <RoleOption
                                    title="Trainee"
                                    description="Receives both training sections automatically."
                                    value="trainee"
                                    checked={
                                        formData.role ===
                                        "trainee"
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>


                        {/* TRAINING ACCESS */}

                        {formData.role && (
                            <div
                                className="
                                    mt-6
                                    border-t
                                    border-slate-100
                                    pt-5
                                "
                            >
                                <h3
                                    className="
                                        text-[11px]
                                        font-semibold
                                        text-slate-800
                                    "
                                >
                                    Training Access
                                </h3>


                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        text-slate-400
                                    "
                                >
                                    {formData.role ===
                                        "trainee"
                                        ? "Both training sections are assigned automatically."
                                        : "Select training sections for this Trainer."}
                                </p>


                                <div
                                    className="
                                        mt-4
                                        flex
                                        flex-wrap
                                        gap-3
                                    "
                                >
                                    {TRAINING_SECTIONS.map(
                                        (
                                            section
                                        ) => {
                                            const checked =
                                                formData.assignedTrainingSections.includes(
                                                    section.id
                                                );


                                            return (
                                                <label
                                                    key={
                                                        section.id
                                                    }
                                                    className={`
                                                        flex
                                                        min-w-[190px]
                                                        items-center
                                                        gap-3
                                                        rounded-lg
                                                        border
                                                        px-4
                                                        py-3
                                                        text-[10px]

                                                        ${checked
                                                            ? "border-blue-300 bg-blue-50 text-blue-700"
                                                            : "border-slate-200 bg-white text-slate-600"
                                                        }

                                                        ${formData.role ===
                                                            "trainee"
                                                            ? "cursor-default"
                                                            : "cursor-pointer"
                                                        }
                                                    `}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            checked
                                                        }
                                                        disabled={
                                                            formData.role ===
                                                            "trainee"
                                                        }
                                                        onChange={() =>
                                                            toggleTrainingSection(
                                                                section.id
                                                            )
                                                        }
                                                    />

                                                    {
                                                        section.name
                                                    }
                                                </label>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        )}


                        {/* ACTIONS */}

                        <div
                            className="
                                mt-6
                                flex
                                flex-col-reverse
                                gap-2
                                border-t
                                border-slate-100
                                pt-5
                                sm:flex-row
                                sm:justify-end
                            "
                        >
                            <button
                                type="button"
                                onClick={
                                    handleCancelForm
                                }
                                disabled={
                                    savingUser
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-5
                                    py-2.5
                                    text-[10px]
                                    font-medium
                                    text-slate-600
                                    hover:bg-slate-50
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={
                                    savingUser
                                }
                                className="
                                    rounded-lg
                                    bg-blue-600
                                    px-5
                                    py-2.5
                                    text-[10px]
                                    font-medium
                                    text-white
                                    hover:bg-blue-700
                                    disabled:opacity-50
                                "
                            >
                                {savingUser
                                    ? "Saving..."
                                    : "Save User"}
                            </button>
                        </div>

                    </form>
                )}

            </section>


            {/* ================================================= */}
            {/* PENDING USERS */}
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
                        items-center
                        justify-between
                        border-b
                        border-slate-100
                        px-5
                        py-4
                    "
                >
                    <div>
                        <h2
                            className="
                                text-[12px]
                                font-semibold
                                text-slate-800
                            "
                        >
                            Pending Account Creation
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                text-slate-400
                            "
                        >
                            Review a user and generate their login credentials.
                        </p>
                    </div>


                    <span
                        className="
                            rounded-full
                            bg-blue-50
                            px-3
                            py-1
                            text-[8px]
                            font-medium
                            text-blue-600
                        "
                    >
                        {pendingUsers.length} Pending
                    </span>
                </div>


                <div
                    className="
                        p-5
                    "
                >
                    <label
                        className="
                            block
                            text-[9px]
                            font-medium
                            text-slate-600
                        "
                    >
                        Select Pending User
                    </label>


                    <select
                        value={
                            selectedUserId
                        }
                        onChange={
                            handlePendingUserChange
                        }
                        disabled={
                            loadingUsers
                        }
                        className="
                            mt-2
                            h-11
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-3
                            text-[10px]
                            text-slate-700
                            outline-none
                            focus:border-blue-500
                        "
                    >
                        <option value="">
                            {loadingUsers
                                ? "Loading..."
                                : pendingUsers.length ===
                                    0
                                    ? "No pending users"
                                    : "Select pending user"}
                        </option>


                        {pendingUsers.map(
                            (
                                user
                            ) => (
                                <option
                                    key={
                                        user._id
                                    }
                                    value={
                                        user._id
                                    }
                                >
                                    {user.firstName}{" "}
                                    {user.lastName} —{" "}
                                    {user.role}
                                </option>
                            )
                        )}
                    </select>


                    {/* SELECTED USER */}

                    {selectedUser &&
                        !credentials && (
                            <div
                                className="
                                mt-4
                                rounded-lg
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
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
                                        <p
                                            className="
                                            text-[11px]
                                            font-semibold
                                            text-slate-800
                                        "
                                        >
                                            {
                                                selectedUser.firstName
                                            }{" "}
                                            {
                                                selectedUser.lastName
                                            }
                                        </p>


                                        <p
                                            className="
                                            mt-1
                                            text-[9px]
                                            text-slate-500
                                        "
                                        >
                                            {
                                                selectedUser.email
                                            }
                                        </p>


                                        <div
                                            className="
                                            mt-3
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                        >
                                            <SmallBadge>
                                                {
                                                    selectedUser.role
                                                }
                                            </SmallBadge>


                                            {selectedUser.assignedTrainingSections
                                                ?.map(
                                                    (
                                                        id
                                                    ) => (
                                                        <SmallBadge
                                                            key={
                                                                id
                                                            }
                                                        >
                                                            {
                                                                TRAINING_SECTIONS.find(
                                                                    (
                                                                        section
                                                                    ) =>
                                                                        section.id ===
                                                                        id
                                                                )
                                                                    ?.name
                                                            }
                                                        </SmallBadge>
                                                    )
                                                )}
                                        </div>
                                    </div>


                                    <button
                                        type="button"
                                        onClick={
                                            handleGenerate
                                        }
                                        disabled={
                                            generating
                                        }
                                        className="
                                        rounded-lg
                                        bg-blue-600
                                        px-5
                                        py-2.5
                                        text-[10px]
                                        font-medium
                                        text-white
                                        hover:bg-blue-700
                                        disabled:opacity-50
                                    "
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
                        <div
                            className="
                                mt-4
                                rounded-lg
                                border
                                border-emerald-200
                                bg-emerald-50
                                p-5
                            "
                        >
                            <p
                                className="
                                    text-[11px]
                                    font-semibold
                                    text-emerald-800
                                "
                            >
                                Credentials Generated Successfully
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    text-emerald-600
                                "
                            >
                                These credentials are shown only once.
                            </p>


                            <div
                                className="
                                    mt-4
                                    grid
                                    gap-3
                                    md:grid-cols-2
                                "
                            >
                                <CredentialBox
                                    label="Username"
                                    value={
                                        credentials.username
                                    }
                                />


                                <CredentialBox
                                    label="Temporary Password"
                                    value={
                                        credentials.password
                                    }
                                />
                            </div>


                            <div
                                className="
                                    mt-4
                                    flex
                                    flex-col
                                    gap-2
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >
                                <button
                                    type="button"
                                    onClick={
                                        handleSendEmail
                                    }
                                    className="
                                        rounded-lg
                                        border
                                        border-emerald-300
                                        bg-white
                                        px-4
                                        py-2.5
                                        text-[10px]
                                        font-medium
                                        text-emerald-700
                                        hover:bg-emerald-100
                                    "
                                >
                                    Send Credentials by Gmail
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleDone
                                    }
                                    className="
                                        rounded-lg
                                        bg-emerald-600
                                        px-5
                                        py-2.5
                                        text-[10px]
                                        font-medium
                                        text-white
                                        hover:bg-emerald-700
                                    "
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


function FormField({
    label,
    required = false,
    children,
}) {
    return (
        <label className="block">
            <span
                className="
                    text-[9px]
                    font-medium
                    text-slate-600
                "
            >
                {label}

                {required && (
                    <span className="text-red-500">
                        {" "}*
                    </span>
                )}
            </span>


            <div className="mt-2">
                {children}
            </div>
        </label>
    );
}


function RoleOption({
    title,
    description,
    value,
    checked,
    onChange,
}) {
    return (
        <label
            className={`
                flex
                cursor-pointer
                items-center
                justify-between
                rounded-lg
                border
                p-4

                ${checked
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 bg-white"
                }
            `}
        >
            <div>
                <p
                    className="
                        text-[10px]
                        font-semibold
                        text-slate-700
                    "
                >
                    {title}
                </p>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-400
                    "
                >
                    {description}
                </p>
            </div>


            <input
                type="radio"
                name="role"
                value={
                    value
                }
                checked={
                    checked
                }
                onChange={
                    onChange
                }
            />
        </label>
    );
}


function SmallBadge({
    children,
}) {
    return (
        <span
            className="
                rounded-full
                bg-blue-50
                px-2.5
                py-1
                text-[8px]
                capitalize
                text-blue-600
            "
        >
            {children}
        </span>
    );
}


function CredentialBox({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-lg
                bg-white
                px-4
                py-3
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
                    break-all
                    font-mono
                    text-[11px]
                    font-semibold
                    text-slate-800
                "
            >
                {value}
            </p>
        </div>
    );
}


const inputClass = `
    h-11
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[10px]
    text-slate-700
    outline-none
    placeholder:text-slate-400
    focus:border-blue-500
`;


export default CreateUserForm;