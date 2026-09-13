import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../../services/api";
import GeneratedCredentialsModal from "./GeneratedCredentialsModal";


const TRAINING_SECTIONS = [
    {
        id: "manual-handling",
        label: "Manual Handling",
        description:
            "Safe lifting, carrying and manual handling practices.",
    },
    {
        id: "working-at-height",
        label: "Working at Height",
        description:
            "Safety procedures for working at elevated locations.",
    },
];


function initialForm() {
    return {
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        email: "",
        phoneNumber: "",
        address: "",
        role: "",
        assignedTrainingSections: [],
    };
}


function CreateUserForm() {
    const [
        showForm,
        setShowForm,
    ] = useState(false);

    const [
        formData,
        setFormData,
    ] = useState(
        initialForm()
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
        loadingPending,
        setLoadingPending,
    ] = useState(true);

    const [
        saving,
        setSaving,
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

    const [
        credentials,
        setCredentials,
    ] = useState(null);

    const [
        credentialUser,
        setCredentialUser,
    ] = useState(null);


    const getId = (
        user
    ) =>
        user?._id ||
        user?.id ||
        "";


    const selectedPendingUser =
        useMemo(
            () =>
                pendingUsers.find(
                    (
                        user
                    ) =>
                        String(
                            getId(
                                user
                            )
                        ) ===
                        String(
                            selectedUserId
                        )
                ) || null,
            [
                pendingUsers,
                selectedUserId,
            ]
        );


    /* =====================================================
       LOAD PENDING USERS
    ===================================================== */

    const loadPendingUsers =
        useCallback(
            async () => {
                try {
                    setLoadingPending(
                        true
                    );

                    setError("");

                    const response =
                        await api.get(
                            "/admin/pending-users"
                        );

                    const data =
                        Array.isArray(
                            response.data
                        )
                            ? response.data
                            : response.data
                                ?.users ||
                            response.data
                                ?.pendingUsers ||
                            [];

                    setPendingUsers(
                        data
                    );

                } catch (
                error
                ) {
                    console.error(
                        "Pending user loading error:",
                        error
                    );

                    setError(
                        error
                            .response
                            ?.data
                            ?.message ||
                        "Unable to load pending users."
                    );

                } finally {
                    setLoadingPending(
                        false
                    );
                }
            },
            []
        );


    useEffect(() => {
        loadPendingUsers();
    }, [
        loadPendingUsers,
    ]);


    /* =====================================================
       FORM CHANGE
    ===================================================== */

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } =
            event.target;

        setError("");
        setSuccess("");

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
                                        item
                                    ) =>
                                        item.id
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
    };


    /* =====================================================
       TRAINER MODULE
    ===================================================== */

    const chooseTraining = (
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

                assignedTrainingSections:
                    [
                        sectionId,
                    ],
            })
        );

        setError("");
    };


    const resetForm =
        () => {
            setFormData(
                initialForm()
            );

            setError("");
            setSuccess("");
        };


    const closeForm =
        () => {
            setShowForm(
                false
            );

            resetForm();
        };


    /* =====================================================
       SAVE PENDING USER
    ===================================================== */

    const savePendingUser =
        async (
            event
        ) => {
            event.preventDefault();

            setError("");
            setSuccess("");


            if (
                !formData.firstName.trim() ||
                !formData.lastName.trim() ||
                !formData.age ||
                !formData.gender ||
                !formData.email.trim() ||
                !formData.phoneNumber.trim() ||
                !formData.address.trim() ||
                !formData.role
            ) {
                setError(
                    "Please complete all required information."
                );

                return;
            }


            if (
                Number(
                    formData.age
                ) < 16
            ) {
                setError(
                    "Age must be 16 or above."
                );

                return;
            }


            if (
                formData.role ===
                "trainer" &&
                formData
                    .assignedTrainingSections
                    .length !==
                1
            ) {
                setError(
                    "Trainer must be assigned exactly one training module."
                );

                return;
            }


            try {
                setSaving(
                    true
                );

                const response =
                    await api.post(
                        "/admin/pending-users",
                        {
                            firstName:
                                formData.firstName.trim(),

                            lastName:
                                formData.lastName.trim(),

                            age:
                                Number(
                                    formData.age
                                ),

                            gender:
                                formData.gender,

                            email:
                                formData.email.trim(),

                            phoneNumber:
                                formData.phoneNumber.trim(),

                            address:
                                formData.address.trim(),

                            role:
                                formData.role,

                            assignedTrainingSections:
                                formData.assignedTrainingSections,
                        }
                    );


                const created =
                    response.data
                        ?.user;

                const createdId =
                    getId(
                        created
                    );


                setSuccess(
                    response.data
                        ?.message ||
                    "User information saved successfully."
                );


                setFormData(
                    initialForm()
                );


                setShowForm(
                    false
                );


                await loadPendingUsers();


                if (
                    createdId
                ) {
                    setSelectedUserId(
                        String(
                            createdId
                        )
                    );
                }

            } catch (
            error
            ) {
                console.error(
                    "Create pending user error:",
                    error
                );

                setError(
                    error
                        .response
                        ?.data
                        ?.message ||
                    "Unable to save user information."
                );

            } finally {
                setSaving(
                    false
                );
            }
        };


    /* =====================================================
       GENERATE CREDENTIALS
    ===================================================== */

    const generateCredentials =
        async () => {
            if (
                !selectedUserId
            ) {
                setError(
                    "Please select a pending user."
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


                const returnedCredentials =
                    response.data
                        ?.credentials;


                if (
                    !returnedCredentials
                        ?.username ||
                    !returnedCredentials
                        ?.password
                ) {
                    setError(
                        "Credentials were generated but were not returned correctly."
                    );

                    return;
                }


                const user =
                    response.data
                        ?.user ||
                    selectedPendingUser;


                setCredentialUser(
                    user
                );


                setCredentials({
                    username:
                        returnedCredentials.username,

                    password:
                        returnedCredentials.password,
                });


                setSuccess(
                    response.data
                        ?.message ||
                    "Account credentials generated successfully."
                );


                setSelectedUserId(
                    ""
                );


                await loadPendingUsers();

            } catch (
            error
            ) {
                console.error(
                    "Credential generation error:",
                    error
                );

                setError(
                    error
                        .response
                        ?.data
                        ?.message ||
                    "Unable to generate credentials."
                );

            } finally {
                setGenerating(
                    false
                );
            }
        };


    const formatName = (
        user
    ) =>
        `${user?.firstName || ""} ${user?.lastName || ""}`
            .trim() ||
        user?.email ||
        "Pending User";


    return (
        <>
            <div
                className="
                    space-y-5
                "
            >

                {/* =================================================
                    HERO
                ================================================= */}

                <section
                    className="
                        create-user-banner
                    "
                >
                    <div
                        className="
                            relative
                            z-10
                            flex
                            items-center
                            gap-4
                        "
                    >
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-white/15
                                text-white
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="
                                    h-6
                                    w-6
                                "
                            >
                                <circle
                                    cx="9"
                                    cy="8"
                                    r="3"
                                />

                                <path d="M3 20c.6-4 2.6-6 6-6" />

                                <path d="M18 13v8" />

                                <path d="M14 17h8" />
                            </svg>
                        </div>


                        <div>
                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.08em]
                                    text-blue-100
                                "
                            >
                                User Management
                            </p>

                            <h2
                                className="
                                    mt-1
                                    text-[18px]
                                    font-bold
                                    text-white
                                    sm:text-[20px]
                                "
                            >
                                Create a New User
                            </h2>

                            <p
                                className="
                                    mt-1
                                    max-w-[520px]
                                    text-[9px]
                                    leading-4
                                    text-blue-100
                                "
                            >
                                Add Trainer or Trainee information,
                                assign training and generate secure
                                temporary credentials.
                            </p>
                        </div>
                    </div>


                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(
                                true
                            );

                            setError("");
                            setSuccess("");
                        }}
                        className="
                            relative
                            z-10
                            min-h-[40px]
                            rounded-lg
                            bg-white
                            px-5
                            text-[10px]
                            font-semibold
                            text-[#1769e8]
                            shadow-sm
                            transition
                            hover:bg-blue-50
                        "
                    >
                        + Create User
                    </button>
                </section>


                {/* =================================================
                    ALERTS
                ================================================= */}

                {error && (
                    <Alert
                        type="error"
                        text={
                            error
                        }
                        onClose={() =>
                            setError("")
                        }
                    />
                )}


                {success && (
                    <Alert
                        type="success"
                        text={
                            success
                        }
                        onClose={() =>
                            setSuccess("")
                        }
                    />
                )}


                {/* =================================================
                    STEP 1
                ================================================= */}

                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        shadow-[0_1px_3px_rgba(15,23,42,0.06)]
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            border-b
                            border-[#e8eef5]
                            px-5
                            py-4
                        "
                    >
                        <StepNumber>
                            1
                        </StepNumber>

                        <div>
                            <h3
                                className="
                                    text-[13px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                Add User Information
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-[#64748b]
                                "
                            >
                                Enter personal information before
                                generating login credentials.
                            </p>
                        </div>
                    </div>


                    {!showForm ? (
                        <div
                            className="
                                flex
                                min-h-[145px]
                                flex-col
                                items-center
                                justify-center
                                px-5
                                py-7
                                text-center
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-50
                                    text-blue-600
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="
                                        h-5
                                        w-5
                                    "
                                >
                                    <circle
                                        cx="9"
                                        cy="8"
                                        r="3"
                                    />

                                    <path d="M3 20c.6-4 2.6-6 6-6" />

                                    <path d="M18 13v8" />

                                    <path d="M14 17h8" />
                                </svg>
                            </div>


                            <p
                                className="
                                    mt-3
                                    text-[11px]
                                    font-semibold
                                    text-[#172033]
                                "
                            >
                                Start by adding a user
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-[#64748b]
                                "
                            >
                                Click Create User to enter Trainer or
                                Trainee information.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={
                                savePendingUser
                            }
                            className="
                                p-5
                                sm:p-6
                            "
                        >
                            {/* PERSONAL */}

                            <FormSectionTitle
                                title="Personal Information"
                                text="Basic personal details for the user."
                            />


                            <div
                                className="
                                    mt-4
                                    grid
                                    gap-4
                                    md:grid-cols-2
                                "
                            >
                                <InputField
                                    label="First Name"
                                    name="firstName"
                                    value={
                                        formData.firstName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter first name"
                                    required
                                />


                                <InputField
                                    label="Last Name"
                                    name="lastName"
                                    value={
                                        formData.lastName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter last name"
                                    required
                                />


                                <InputField
                                    label="Age"
                                    name="age"
                                    type="number"
                                    min="16"
                                    value={
                                        formData.age
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter age"
                                    required
                                />


                                <SelectField
                                    label="Gender"
                                    name="gender"
                                    value={
                                        formData.gender
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
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

                                    <option value="prefer-not-to-say">
                                        Prefer not to say
                                    </option>
                                </SelectField>
                            </div>


                            <div
                                className="
                                    my-6
                                    border-t
                                    border-[#e8eef5]
                                "
                            />


                            {/* CONTACT */}

                            <FormSectionTitle
                                title="Contact Information"
                                text="Contact details used for account communication."
                            />


                            <div
                                className="
                                    mt-4
                                    grid
                                    gap-4
                                    md:grid-cols-2
                                "
                            >
                                <InputField
                                    label="Personal Email"
                                    name="email"
                                    type="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="name@example.com"
                                    required
                                />


                                <InputField
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={
                                        formData.phoneNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter phone number"
                                    required
                                />


                                <div
                                    className="
                                        md:col-span-2
                                    "
                                >
                                    <InputField
                                        label="Address"
                                        name="address"
                                        value={
                                            formData.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter full address"
                                        required
                                    />
                                </div>
                            </div>


                            <div
                                className="
                                    my-6
                                    border-t
                                    border-[#e8eef5]
                                "
                            />


                            {/* ROLE */}

                            <FormSectionTitle
                                title="Role & Training Assignment"
                                text="Choose the user's system role and training access."
                            />


                            <div
                                className="
                                    mt-4
                                "
                            >
                                <label
                                    className="
                                        mb-2
                                        block
                                        text-[9px]
                                        font-semibold
                                        text-[#334155]
                                    "
                                >
                                    User Role
                                    <span
                                        className="
                                            ml-1
                                            text-red-500
                                        "
                                    >
                                        *
                                    </span>
                                </label>


                                <div
                                    className="
                                        grid
                                        gap-3
                                        sm:grid-cols-2
                                    "
                                >
                                    <RoleCard
                                        title="Trainer"
                                        description="Manages and monitors an assigned training module."
                                        selected={
                                            formData.role ===
                                            "trainer"
                                        }
                                        onClick={() =>
                                            handleChange({
                                                target: {
                                                    name: "role",
                                                    value: "trainer",
                                                },
                                            })
                                        }
                                    />


                                    <RoleCard
                                        title="Trainee"
                                        description="Completes both available safety training modules."
                                        selected={
                                            formData.role ===
                                            "trainee"
                                        }
                                        onClick={() =>
                                            handleChange({
                                                target: {
                                                    name: "role",
                                                    value: "trainee",
                                                },
                                            })
                                        }
                                    />
                                </div>
                            </div>


                            {/* TRAINER MODULE */}

                            {formData.role ===
                                "trainer" && (
                                    <div
                                        className="
                                        mt-5
                                        rounded-xl
                                        border
                                        border-[#dbe4ef]
                                        bg-[#f8fafc]
                                        p-4
                                    "
                                    >
                                        <p
                                            className="
                                            text-[10px]
                                            font-semibold
                                            text-[#172033]
                                        "
                                        >
                                            Assign Training Module
                                        </p>

                                        <p
                                            className="
                                            mt-1
                                            text-[8px]
                                            leading-4
                                            text-[#64748b]
                                        "
                                        >
                                            A Trainer must be assigned exactly
                                            one module.
                                        </p>


                                        <div
                                            className="
                                            mt-3
                                            grid
                                            gap-3
                                            md:grid-cols-2
                                        "
                                        >
                                            {TRAINING_SECTIONS.map(
                                                (
                                                    section
                                                ) => (
                                                    <TrainingCard
                                                        key={
                                                            section.id
                                                        }
                                                        title={
                                                            section.label
                                                        }
                                                        description={
                                                            section.description
                                                        }
                                                        selected={formData.assignedTrainingSections.includes(
                                                            section.id
                                                        )}
                                                        onClick={() =>
                                                            chooseTraining(
                                                                section.id
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}


                            {/* TRAINEE MODULE */}

                            {formData.role ===
                                "trainee" && (
                                    <div
                                        className="
                                        mt-5
                                        rounded-xl
                                        border
                                        border-blue-100
                                        bg-blue-50/60
                                        p-4
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
                                                rounded-full
                                                bg-white
                                                text-blue-600
                                            "
                                            >
                                                ✓
                                            </div>


                                            <div>
                                                <p
                                                    className="
                                                    text-[10px]
                                                    font-semibold
                                                    text-[#172033]
                                                "
                                                >
                                                    Both modules assigned
                                                    automatically
                                                </p>

                                                <p
                                                    className="
                                                    mt-1
                                                    text-[8px]
                                                    leading-4
                                                    text-[#64748b]
                                                "
                                                >
                                                    Trainees receive Manual
                                                    Handling and Working at
                                                    Height training.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}


                            {/* ACTIONS */}

                            <div
                                className="
                                    mt-7
                                    flex
                                    flex-col-reverse
                                    gap-2
                                    border-t
                                    border-[#e8eef5]
                                    pt-5
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >
                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="
                                        min-h-[40px]
                                        rounded-lg
                                        border
                                        border-[#cbd5e1]
                                        bg-white
                                        px-5
                                        text-[10px]
                                        font-semibold
                                        text-[#52627a]
                                        transition
                                        hover:bg-[#f8fafc]
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="
                                        min-h-[40px]
                                        rounded-lg
                                        bg-[#1769e8]
                                        px-5
                                        text-[10px]
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#0b5ed7]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save User Information"}
                                </button>
                            </div>
                        </form>
                    )}
                </section>


                {/* =================================================
                    STEP 2
                ================================================= */}

                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        shadow-[0_1px_3px_rgba(15,23,42,0.06)]
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            border-b
                            border-[#e8eef5]
                            px-5
                            py-4
                        "
                    >
                        <StepNumber>
                            2
                        </StepNumber>

                        <div>
                            <h3
                                className="
                                    text-[13px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                Generate Login Credentials
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-[#64748b]
                                "
                            >
                                Select a pending user and generate their
                                username and temporary password.
                            </p>
                        </div>
                    </div>


                    <div
                        className="
                            p-5
                            sm:p-6
                        "
                    >
                        <label
                            className="
                                mb-2
                                block
                                text-[9px]
                                font-semibold
                                text-[#334155]
                            "
                        >
                            Pending User
                        </label>


                        <div
                            className="
                                flex
                                flex-col
                                gap-3
                                md:flex-row
                            "
                        >
                            <div
                                className="
                                    relative
                                    flex-1
                                "
                            >
                                <select
                                    value={
                                        selectedUserId
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSelectedUserId(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    disabled={
                                        loadingPending ||
                                        generating
                                    }
                                    className="
                                        min-h-[42px]
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#cbd5e1]
                                        bg-white
                                        px-3
                                        text-[10px]
                                        text-[#172033]
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        disabled:bg-slate-50
                                        disabled:text-slate-400
                                    "
                                >
                                    <option value="">
                                        {loadingPending
                                            ? "Loading pending users..."
                                            : "Select pending user"}
                                    </option>


                                    {pendingUsers.map(
                                        (
                                            user
                                        ) => (
                                            <option
                                                key={
                                                    getId(
                                                        user
                                                    )
                                                }
                                                value={
                                                    getId(
                                                        user
                                                    )
                                                }
                                            >
                                                {formatName(
                                                    user
                                                )}
                                                {" — "}
                                                {user.role ||
                                                    "User"}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>


                            <button
                                type="button"
                                onClick={
                                    generateCredentials
                                }
                                disabled={
                                    !selectedUserId ||
                                    generating ||
                                    loadingPending
                                }
                                className="
                                    min-h-[42px]
                                    shrink-0
                                    rounded-lg
                                    bg-[#1769e8]
                                    px-5
                                    text-[10px]
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-[#0b5ed7]
                                    disabled:cursor-not-allowed
                                    disabled:bg-[#94a3b8]
                                "
                            >
                                {generating
                                    ? "Generating..."
                                    : "Generate Credentials"}
                            </button>
                        </div>


                        {selectedPendingUser && (
                            <div
                                className="
                                    mt-4
                                    rounded-lg
                                    border
                                    border-[#dbe4ef]
                                    bg-[#f8fafc]
                                    p-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-4
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-[#073763]
                                                text-[11px]
                                                font-bold
                                                text-white
                                            "
                                        >
                                            {formatName(
                                                selectedPendingUser
                                            )
                                                .charAt(
                                                    0
                                                )
                                                .toUpperCase()}
                                        </div>


                                        <div>
                                            <p
                                                className="
                                                    text-[10px]
                                                    font-semibold
                                                    text-[#172033]
                                                "
                                            >
                                                {formatName(
                                                    selectedPendingUser
                                                )}
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-[8px]
                                                    text-[#64748b]
                                                "
                                            >
                                                {selectedPendingUser.email ||
                                                    "No email address"}
                                            </p>
                                        </div>
                                    </div>


                                    <span
                                        className="
                                            self-start
                                            rounded-full
                                            bg-blue-50
                                            px-3
                                            py-1.5
                                            text-[8px]
                                            font-semibold
                                            capitalize
                                            text-blue-600
                                            sm:self-auto
                                        "
                                    >
                                        {selectedPendingUser.role ||
                                            "User"}
                                    </span>
                                </div>
                            </div>
                        )}


                        {!loadingPending &&
                            pendingUsers.length ===
                            0 && (
                                <div
                                    className="
                                        mt-4
                                        rounded-lg
                                        border
                                        border-dashed
                                        border-[#cbd5e1]
                                        bg-[#f8fafc]
                                        px-4
                                        py-6
                                        text-center
                                    "
                                >
                                    <p
                                        className="
                                            text-[10px]
                                            font-semibold
                                            text-[#52627a]
                                        "
                                    >
                                        No pending users
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[8px]
                                            text-[#94a3b8]
                                        "
                                    >
                                        Add a Trainer or Trainee above
                                        before generating credentials.
                                    </p>
                                </div>
                            )}
                    </div>
                </section>
            </div>


            {/* =================================================
                CREDENTIAL MODAL
            ================================================= */}

            <GeneratedCredentialsModal
                open={
                    Boolean(
                        credentials
                    )
                }
                credentials={
                    credentials
                }
                user={
                    credentialUser
                }
                onClose={() => {
                    setCredentials(
                        null
                    );

                    setCredentialUser(
                        null
                    );
                }}
            />
        </>
    );
}


/* =========================================================
   COMPONENTS
========================================================= */

function StepNumber({
    children,
}) {
    return (
        <div
            className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#1769e8]
                text-[10px]
                font-bold
                text-white
            "
        >
            {children}
        </div>
    );
}


function FormSectionTitle({
    title,
    text,
}) {
    return (
        <div>
            <h4
                className="
                    text-[11px]
                    font-bold
                    text-[#172033]
                "
            >
                {title}
            </h4>

            <p
                className="
                    mt-1
                    text-[8px]
                    text-[#64748b]
                "
            >
                {text}
            </p>
        </div>
    );
}


function InputField({
    label,
    required,
    ...props
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
                    text-[9px]
                    font-semibold
                    text-[#334155]
                "
            >
                {label}

                {required && (
                    <span
                        className="
                            ml-1
                            text-red-500
                        "
                    >
                        *
                    </span>
                )}
            </span>


            <input
                {...props}
                required={
                    required
                }
                className="
                    min-h-[42px]
                    w-full
                    rounded-lg
                    border
                    border-[#cbd5e1]
                    bg-white
                    px-3
                    text-[10px]
                    text-[#172033]
                    outline-none
                    transition
                    placeholder:text-[#a7b4c7]
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                "
            />
        </label>
    );
}


function SelectField({
    label,
    required,
    children,
    ...props
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
                    text-[9px]
                    font-semibold
                    text-[#334155]
                "
            >
                {label}

                {required && (
                    <span
                        className="
                            ml-1
                            text-red-500
                        "
                    >
                        *
                    </span>
                )}
            </span>


            <select
                {...props}
                required={
                    required
                }
                className="
                    min-h-[42px]
                    w-full
                    rounded-lg
                    border
                    border-[#cbd5e1]
                    bg-white
                    px-3
                    text-[10px]
                    text-[#172033]
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                "
            >
                {children}
            </select>
        </label>
    );
}


function RoleCard({
    title,
    description,
    selected,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className={`
                flex
                min-h-[95px]
                w-full
                items-start
                gap-3
                rounded-xl
                border
                p-4
                text-left
                transition

                ${selected
                    ? "border-blue-500 bg-blue-50/70 ring-1 ring-blue-100"
                    : "border-[#dbe4ef] bg-white hover:border-blue-200 hover:bg-[#f8fafc]"
                }
            `}
        >
            <span
                className={`
                    mt-0.5
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border

                    ${selected
                        ? "border-blue-600 bg-blue-600"
                        : "border-[#cbd5e1] bg-white"
                    }
                `}
            >
                {selected && (
                    <span
                        className="
                            h-2
                            w-2
                            rounded-full
                            bg-white
                        "
                    />
                )}
            </span>


            <span>
                <span
                    className="
                        block
                        text-[10px]
                        font-semibold
                        text-[#172033]
                    "
                >
                    {title}
                </span>

                <span
                    className="
                        mt-1
                        block
                        text-[8px]
                        leading-4
                        text-[#64748b]
                    "
                >
                    {description}
                </span>
            </span>
        </button>
    );
}


function TrainingCard({
    title,
    description,
    selected,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className={`
                w-full
                rounded-lg
                border
                p-4
                text-left
                transition

                ${selected
                    ? "border-blue-500 bg-white ring-1 ring-blue-100"
                    : "border-[#dbe4ef] bg-white hover:border-blue-200"
                }
            `}
        >
            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >
                <div>
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            text-[#172033]
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            mt-1
                            text-[8px]
                            leading-4
                            text-[#64748b]
                        "
                    >
                        {description}
                    </p>
                </div>


                <span
                    className={`
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        text-[9px]

                        ${selected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-[#cbd5e1] bg-white"
                        }
                    `}
                >
                    {selected
                        ? "✓"
                        : ""}
                </span>
            </div>
        </button>
    );
}


function Alert({
    type,
    text,
    onClose,
}) {
    const success =
        type ===
        "success";

    return (
        <div
            className={`
                flex
                items-center
                justify-between
                gap-3
                rounded-lg
                border
                px-4
                py-3
                text-[10px]

                ${success
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }
            `}
        >
            <span>
                {text}
            </span>

            <button
                type="button"
                onClick={
                    onClose
                }
                className="
                    shrink-0
                    text-[15px]
                    font-bold
                "
            >
                ×
            </button>
        </div>
    );
}


export default CreateUserForm;