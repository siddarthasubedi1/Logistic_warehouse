import {
    useEffect,
    useState,
} from "react";

import api from "../../services/api";

import FeedbackAlert from "../ui/FeedbackAlert";
import StatusBadge from "../ui/StatusBadge";


const TRAINING_SECTIONS = [
    {
        id: "manual-handling",
        name: "Manual Handling",
        description:
            "Safe lifting, carrying and manual handling practices.",
    },
    {
        id: "working-at-height",
        name: "Working at Height",
        description:
            "Safe working practices for elevated environments.",
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
                setLoadingUsers(true);

                const response =
                    await api.get(
                        "/admin/pending-users"
                    );

                const users =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : response.data?.users ||
                        response.data?.pendingUsers ||
                        [];

                setPendingUsers(
                    users
                );

            } catch (error) {
                console.error(
                    "Load pending users error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load pending users."
                );

            } finally {
                setLoadingUsers(false);
            }
        };


    useEffect(() => {
        loadPendingUsers();
    }, []);


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
    // TRAINER AREA
    // EXACTLY ONE
    // ======================================================

    const selectTrainerSection = (
        sectionId
    ) => {
        if (
            formData.role !==
            "trainer"
        ) {
            return;
        }

        setFormData(
            (
                current
            ) => ({
                ...current,

                assignedTrainingSections: [
                    sectionId,
                ],
            })
        );
    };


    // ======================================================
    // CREATE PENDING USER
    // ======================================================

    const handleSaveUser =
        async (
            event
        ) => {
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
                Number(age) <
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
                assignedTrainingSections.length !==
                1
            ) {
                setError(
                    "Please select exactly one training area for the Trainer."
                );

                return;
            }

            try {
                setSavingUser(true);

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
                    response.data?.message ||
                    "User information saved successfully."
                );

                setFormData(
                    getInitialFormData()
                );

                setShowCreateForm(false);

                await loadPendingUsers();

            } catch (error) {
                console.error(
                    "Create pending user error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to save user information."
                );

            } finally {
                setSavingUser(false);
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

        setCredentials(null);
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
                setGenerating(true);

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
                    response.data?.credentials ||
                    null
                );

                if (
                    response.data?.user
                ) {
                    setSelectedUser(
                        response.data.user
                    );
                }

                setSuccess(
                    response.data?.message ||
                    "Account generated successfully."
                );

                setSelectedUserId("");

                await loadPendingUsers();

            } catch (error) {
                console.error(
                    "Generate credentials error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to generate account."
                );

            } finally {
                setGenerating(false);
            }
        };


    // ======================================================
    // SEND GMAIL
    // ======================================================

    const handleSendEmail =
        () => {
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

For security, you must change your temporary password after your first login.

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


    const handleDone =
        () => {
            setCredentials(null);
            setSelectedUser(null);
            setSelectedUserId("");
            setSuccess("");
            setError("");
        };


    return (
        <div
            className="
                space-y-4
            "
        >
            <FeedbackAlert
                type="success"
                message={
                    success
                }
                onClose={() =>
                    setSuccess("")
                }
            />

            <FeedbackAlert
                type="error"
                message={
                    error
                }
                onClose={() =>
                    setError("")
                }
            />


            {/* ================================================= */}
            {/* USER INFORMATION */}
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
                        gap-3
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
                        <h2
                            className="
                                text-[12px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            User Information
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[8px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Enter Trainer or Trainee information before generating login credentials.
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            setShowCreateForm(
                                (
                                    current
                                ) =>
                                    !current
                            )
                        }
                        className="
                            min-h-[38px]
                            rounded-lg
                            bg-blue-600
                            px-4
                            text-[9px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-blue-700
                        "
                    >
                        {showCreateForm
                            ? "Close Form"
                            : "+ Add New User"}
                    </button>
                </div>


                {showCreateForm && (
                    <form
                        onSubmit={
                            handleSaveUser
                        }
                        className="
                            space-y-6
                            p-4
                            sm:p-5
                        "
                    >
                        <section>
                            <SectionTitle>
                                Personal Information
                            </SectionTitle>


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
                                        disabled={
                                            savingUser
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
                                        disabled={
                                            savingUser
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
                                        disabled={
                                            savingUser
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
                                        disabled={
                                            savingUser
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
                                    label="Personal Email"
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
                                        disabled={
                                            savingUser
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
                                        disabled={
                                            savingUser
                                        }
                                        placeholder="Enter phone number"
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <div
                                    className="
                                        md:col-span-2
                                    "
                                >
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
                                            disabled={
                                                savingUser
                                            }
                                            placeholder="Enter address"
                                            className={
                                                inputClass
                                            }
                                        />
                                    </FormField>
                                </div>
                            </div>
                        </section>


                        {/* ROLE */}

                        <section
                            className="
                                border-t
                                border-slate-100
                                pt-5
                            "
                        >
                            <SectionTitle>
                                Select User Role
                            </SectionTitle>


                            <div
                                className="
                                    mt-4
                                    grid
                                    gap-3
                                    sm:grid-cols-2
                                "
                            >
                                <RoleOption
                                    label="Trainer"
                                    description="Manages one assigned safety training area."
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
                                    label="Trainee"
                                    description="Receives access to both safety training areas."
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
                        </section>


                        {/* TRAINING ACCESS */}

                        {formData.role && (
                            <section
                                className="
                                    border-t
                                    border-slate-100
                                    pt-5
                                "
                            >
                                <SectionTitle>
                                    Training Access
                                </SectionTitle>


                                {formData.role ===
                                    "trainee" && (
                                        <div
                                            className="
                                            mt-3
                                            rounded-lg
                                            border
                                            border-emerald-200
                                            bg-emerald-50
                                            p-3
                                        "
                                        >
                                            <p
                                                className="
                                                text-[8px]
                                                font-medium
                                                text-emerald-700
                                            "
                                            >
                                                Trainees automatically receive Manual Handling and Working at Height.
                                            </p>
                                        </div>
                                    )}


                                <div
                                    className="
                                        mt-4
                                        grid
                                        gap-3
                                        md:grid-cols-2
                                    "
                                >
                                    {TRAINING_SECTIONS.map(
                                        (
                                            section
                                        ) => {
                                            const selected =
                                                formData
                                                    .assignedTrainingSections
                                                    .includes(
                                                        section.id
                                                    );

                                            return (
                                                <label
                                                    key={
                                                        section.id
                                                    }
                                                    className={`
                                                        flex
                                                        items-start
                                                        gap-3
                                                        rounded-lg
                                                        border
                                                        p-4
                                                        transition

                                                        ${selected
                                                            ? "border-blue-300 bg-blue-50"
                                                            : "border-slate-200 bg-white"
                                                        }

                                                        ${formData.role ===
                                                            "trainer"
                                                            ? "cursor-pointer"
                                                            : "cursor-default"
                                                        }
                                                    `}
                                                >
                                                    <input
                                                        type={
                                                            formData.role ===
                                                                "trainer"
                                                                ? "radio"
                                                                : "checkbox"
                                                        }
                                                        name="trainingArea"
                                                        checked={
                                                            selected
                                                        }
                                                        disabled={
                                                            formData.role ===
                                                            "trainee"
                                                        }
                                                        onChange={() =>
                                                            selectTrainerSection(
                                                                section.id
                                                            )
                                                        }
                                                        className="
                                                            mt-0.5
                                                            h-4
                                                            w-4
                                                            accent-blue-600
                                                        "
                                                    />


                                                    <div>
                                                        <p
                                                            className="
                                                                text-[9px]
                                                                font-bold
                                                                text-slate-800
                                                            "
                                                        >
                                                            {
                                                                section.name
                                                            }
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-[7px]
                                                                font-medium
                                                                leading-4
                                                                text-slate-500
                                                            "
                                                        >
                                                            {
                                                                section.description
                                                            }
                                                        </p>
                                                    </div>
                                                </label>
                                            );
                                        }
                                    )}
                                </div>
                            </section>
                        )}


                        {/* ACTION */}

                        <div
                            className="
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
                                onClick={() => {
                                    setShowCreateForm(
                                        false
                                    );

                                    setFormData(
                                        getInitialFormData()
                                    );
                                }}
                                className="
                                    min-h-[40px]
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-5
                                    text-[9px]
                                    font-semibold
                                    text-slate-700
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
                                    min-h-[40px]
                                    rounded-lg
                                    bg-blue-600
                                    px-5
                                    text-[9px]
                                    font-semibold
                                    text-white
                                    hover:bg-blue-700
                                    disabled:opacity-50
                                "
                            >
                                {savingUser
                                    ? "Saving..."
                                    : "Save User Information"}
                            </button>
                        </div>
                    </form>
                )}
            </section>


            {/* ================================================= */}
            {/* GENERATE ACCOUNT */}
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
                        border-b
                        border-slate-100
                        px-4
                        py-4
                        sm:px-5
                    "
                >
                    <h2
                        className="
                            text-[12px]
                            font-bold
                            text-[#172033]
                        "
                    >
                        Generate Login Credentials
                    </h2>

                    <p
                        className="
                            mt-1
                            text-[8px]
                            font-medium
                            text-slate-500
                        "
                    >
                        Select a pending user to generate a username and temporary password.
                    </p>
                </div>


                <div
                    className="
                        p-4
                        sm:p-5
                    "
                >
                    {loadingUsers ? (
                        <p
                            className="
                                text-[9px]
                                text-slate-500
                            "
                        >
                            Loading pending users...
                        </p>
                    ) : pendingUsers.length ===
                        0 ? (
                        <div
                            className="
                                rounded-lg
                                bg-slate-50
                                p-5
                                text-center
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    text-slate-600
                                "
                            >
                                No pending users.
                            </p>
                        </div>
                    ) : (
                        <div
                            className="
                                grid
                                gap-3
                                md:grid-cols-[minmax(0,1fr)_auto]
                            "
                        >
                            <select
                                value={
                                    selectedUserId
                                }
                                onChange={
                                    handlePendingUserChange
                                }
                                className={
                                    inputClass
                                }
                            >
                                <option value="">
                                    Select pending user
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


                            <button
                                type="button"
                                onClick={
                                    handleGenerate
                                }
                                disabled={
                                    generating ||
                                    !selectedUserId
                                }
                                className="
                                    min-h-[40px]
                                    rounded-lg
                                    bg-blue-600
                                    px-5
                                    text-[9px]
                                    font-semibold
                                    text-white
                                    hover:bg-blue-700
                                    disabled:opacity-50
                                "
                            >
                                {generating
                                    ? "Generating..."
                                    : "Generate Credentials"}
                            </button>
                        </div>
                    )}


                    {selectedUser && (
                        <div
                            className="
                                mt-4
                                flex
                                flex-wrap
                                items-center
                                gap-2
                                rounded-lg
                                bg-slate-50
                                p-3
                            "
                        >
                            <span
                                className="
                                    text-[8px]
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                {selectedUser.firstName}{" "}
                                {selectedUser.lastName}
                            </span>

                            <StatusBadge
                                status={
                                    selectedUser.role
                                }
                            />
                        </div>
                    )}
                </div>
            </section>


            {/* ================================================= */}
            {/* CREDENTIALS */}
            {/* ================================================= */}

            {credentials && (
                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-emerald-200
                        bg-white
                        shadow-sm
                    "
                >
                    <div
                        className="
                            border-b
                            border-emerald-100
                            bg-emerald-50
                            px-4
                            py-4
                            sm:px-5
                        "
                    >
                        <h2
                            className="
                                text-[12px]
                                font-bold
                                text-emerald-800
                            "
                        >
                            Credentials Generated Successfully
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[8px]
                                font-medium
                                text-emerald-700
                            "
                        >
                            Save these credentials before closing this section.
                        </p>
                    </div>


                    <div
                        className="
                            p-4
                            sm:p-5
                        "
                    >
                        <div
                            className="
                                grid
                                gap-3
                                sm:grid-cols-2
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
                                rounded-lg
                                border
                                border-amber-200
                                bg-amber-50
                                p-3
                            "
                        >
                            <p
                                className="
                                    text-[8px]
                                    font-medium
                                    leading-5
                                    text-amber-800
                                "
                            >
                                The temporary password supports first login only. The Trainer or Trainee must create a new password before using the dashboard.
                            </p>
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
                            {selectedUser?.email && (
                                <button
                                    type="button"
                                    onClick={
                                        handleSendEmail
                                    }
                                    className="
                                        min-h-[40px]
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-4
                                        text-[9px]
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Send by Gmail
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={
                                    handleDone
                                }
                                className="
                                    min-h-[40px]
                                    rounded-lg
                                    bg-blue-600
                                    px-5
                                    text-[9px]
                                    font-semibold
                                    text-white
                                "
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}


function SectionTitle({
    children,
}) {
    return (
        <h3
            className="
                text-[10px]
                font-bold
                text-slate-800
            "
        >
            {children}
        </h3>
    );
}


function FormField({
    label,
    required = false,
    children,
}) {
    return (
        <label
            className="
                block
            "
        >
            <span
                className="
                    mb-2
                    block
                    text-[8px]
                    font-semibold
                    text-slate-700
                "
            >
                {label}

                {required && (
                    <span
                        className="
                            text-red-500
                        "
                    >
                        {" "}*
                    </span>
                )}
            </span>

            {children}
        </label>
    );
}


function RoleOption({
    label,
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
                gap-4
                rounded-lg
                border
                p-4
                transition

                ${checked
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-200"
                }
            `}
        >
            <div>
                <p
                    className="
                        text-[9px]
                        font-bold
                        text-slate-800
                    "
                >
                    {label}
                </p>

                <p
                    className="
                        mt-1
                        text-[7px]
                        font-medium
                        text-slate-500
                    "
                >
                    {description}
                </p>
            </div>

            <input
                type="radio"
                name="role"
                value={value}
                checked={checked}
                onChange={onChange}
                className="
                    h-4
                    w-4
                    accent-blue-600
                "
            />
        </label>
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
                border
                border-slate-200
                bg-slate-50
                p-4
            "
        >
            <p
                className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-2
                    break-all
                    font-mono
                    text-[11px]
                    font-bold
                    text-slate-800
                "
            >
                {value ||
                    "—"}
            </p>
        </div>
    );
}


const inputClass = `
    min-h-[40px]
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[9px]
    font-medium
    text-slate-800
    outline-none
    placeholder:text-slate-400
    focus:border-blue-500
    focus:ring-1
    focus:ring-blue-100
    disabled:cursor-not-allowed
    disabled:bg-slate-50
`;


export default CreateUserForm;