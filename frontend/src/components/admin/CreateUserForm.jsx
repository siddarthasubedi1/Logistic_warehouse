import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../../services/api";


const TRAINING_SECTIONS = [
    {
        id:
            "manual-handling",

        label:
            "Manual Handling",

        description:
            "Safe lifting, carrying and manual handling practices.",
    },

    {
        id:
            "working-at-height",

        label:
            "Working at Height",

        description:
            "Safety procedures for working at elevated locations.",
    },
];


function initialForm() {
    return {
        firstName:
            "",

        lastName:
            "",

        age:
            "",

        gender:
            "",

        email:
            "",

        phoneNumber:
            "",

        address:
            "",

        role:
            "",

        assignedTrainingSections:
            [],
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


    const getId =
        (
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
                ) ||
                null,
            [
                pendingUsers,
                selectedUserId,
            ]
        );


    const loadPendingUsers =
        useCallback(
            async () => {
                try {
                    setLoadingPending(
                        true
                    );


                    const response =
                        await api.get(
                            "/admin/pending-users"
                        );


                    const data =
                        Array.isArray(
                            response.data
                        )
                            ? response.data
                            : response.data?.users ||
                            response.data?.pendingUsers ||
                            [];


                    setPendingUsers(
                        data
                    );

                } catch (error) {
                    console.error(
                        "Pending user loading error:",
                        error
                    );


                    setError(
                        error.response?.data?.message ||
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


    const handleChange =
        (
            event
        ) => {
            const {
                name,
                value,
            } =
                event.target;


            setError(
                ""
            );


            setSuccess(
                ""
            );


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
        };


    const chooseTraining =
        (
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


            setError(
                ""
            );
        };


    const resetForm =
        () => {
            setFormData(
                initialForm()
            );

            setError(
                ""
            );

            setSuccess(
                ""
            );
        };


    const savePendingUser =
        async (
            event
        ) => {
            event.preventDefault();


            setError(
                ""
            );


            setSuccess(
                ""
            );


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
                ) <
                16
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
                    response.data?.user;


                const createdId =
                    getId(
                        created
                    );


                setSuccess(
                    response.data?.message ||
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
                setSaving(
                    false
                );
            }
        };


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


                setError(
                    ""
                );


                setSuccess(
                    ""
                );


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
                    response.data?.credentials;


                if (
                    !returnedCredentials?.username ||
                    !returnedCredentials?.password
                ) {
                    setError(
                        "Credentials were generated but were not returned correctly."
                    );

                    return;
                }


                setCredentials({
                    username:
                        returnedCredentials.username,

                    password:
                        returnedCredentials.password,

                    email:
                        response.data?.user?.email ||
                        selectedPendingUser?.email ||
                        "",

                    name:
                        `${response.data?.user?.firstName || selectedPendingUser?.firstName || ""} ${response.data?.user?.lastName || selectedPendingUser?.lastName || ""}`
                            .trim(),
                });


                setSuccess(
                    response.data?.message ||
                    "Account credentials generated successfully."
                );


                setSelectedUserId(
                    ""
                );


                await loadPendingUsers();

            } catch (error) {
                console.error(
                    "Credential generation error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to generate credentials."
                );

            } finally {
                setGenerating(
                    false
                );
            }
        };


    const copyCredentials =
        async () => {
            if (
                !credentials
            ) {
                return;
            }


            const text =
                `Username: ${credentials.username}\nTemporary Password: ${credentials.password}`;


            try {
                await navigator.clipboard.writeText(
                    text
                );


                setSuccess(
                    "Credentials copied to clipboard."
                );

            } catch {
                setError(
                    "Unable to copy automatically. Please copy the credentials manually."
                );
            }
        };


    const sendEmail =
        () => {
            if (
                !credentials?.email
            ) {
                setError(
                    "No email address is available for this user."
                );

                return;
            }


            const subject =
                encodeURIComponent(
                    "UK LogiWare - Temporary Login Credentials"
                );


            const body =
                encodeURIComponent(
                    `Hello ${credentials.name || "User"},\n\nYour UK LogiWare temporary login credentials are:\n\nUsername: ${credentials.username}\nTemporary Password: ${credentials.password}\n\nYou will be required to change this temporary password after your first login.\n\nUK LogiWare Safety Training`
                );


            window.location.href =
                `mailto:${credentials.email}?subject=${subject}&body=${body}`;
        };


    return (
        <div
            className="
                space-y-4
            "
        >
            <section
                className="
                    relative
                    overflow-hidden
                    rounded-xl
                    bg-gradient-to-r
                    from-[#1769e8]
                    to-[#5236ff]
                    px-5
                    py-5
                    text-white
                    shadow-sm
                    sm:px-6
                "
            >
                <div
                    className="
                        absolute
                        -right-10
                        -top-16
                        h-40
                        w-40
                        rounded-full
                        bg-white/10
                    "
                />


                <div
                    className="
                        relative
                        z-10
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
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
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

                                <path d="M3 20c.5-4 2.5-6 6-6" />

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
                                    tracking-[0.16em]
                                    text-blue-100
                                "
                            >
                                User Accounts
                            </p>


                            <h2
                                className="
                                    mt-1
                                    text-[18px]
                                    font-bold
                                    text-white
                                "
                            >
                                Create Trainer or Trainee
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-[11px]
                                    text-blue-100
                                "
                            >
                                Enter user information and assign their training.
                            </p>
                        </div>
                    </div>


                    <button
                        type="button"
                        onClick={() => {
                            if (
                                showForm
                            ) {
                                resetForm();
                            }


                            setShowForm(
                                (
                                    current
                                ) =>
                                    !current
                            );
                        }}
                        className="
                            min-h-[42px]
                            rounded-lg
                            bg-white
                            px-5
                            text-[11px]
                            font-medium
                            text-[#1769e8]
                            shadow-sm
                            transition
                            hover:bg-blue-50
                        "
                    >
                        {showForm
                            ? "Close Form"
                            : "+ Add New User"}
                    </button>
                </div>
            </section>


            {error && (
                <Alert
                    type="error"
                    text={
                        error
                    }
                    onClose={() =>
                        setError(
                            ""
                        )
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
                        setSuccess(
                            ""
                        )
                    }
                />
            )}


            {showForm && (
                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        shadow-sm
                    "
                >
                    <div
                        className="
                            border-b
                            border-[#e8eef5]
                            px-5
                            py-4
                        "
                    >
                        <h3
                            className="
                                text-[14px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            User Information
                        </h3>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-[#7c8da6]
                            "
                        >
                            Complete the details and select the correct user role.
                        </p>
                    </div>


                    <form
                        onSubmit={
                            savePendingUser
                        }
                        className="
                            p-5
                        "
                    >
                        <h4
                            className="
                                text-[12px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Personal Information
                        </h4>


                        <div
                            className="
                                mt-4
                                grid
                                gap-4
                                md:grid-cols-2
                            "
                        >
                            <Field
                                label="First Name"
                                required
                            >
                                <input
                                    name="firstName"
                                    value={
                                        formData.firstName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter first name"
                                    className="app-input"
                                />
                            </Field>


                            <Field
                                label="Last Name"
                                required
                            >
                                <input
                                    name="lastName"
                                    value={
                                        formData.lastName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter last name"
                                    className="app-input"
                                />
                            </Field>


                            <Field
                                label="Age"
                                required
                            >
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
                                    className="app-input"
                                />
                            </Field>


                            <Field
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
                                    className="app-input"
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
                            </Field>


                            <Field
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
                                    className="app-input"
                                />
                            </Field>


                            <Field
                                label="Phone Number"
                                required
                            >
                                <input
                                    name="phoneNumber"
                                    value={
                                        formData.phoneNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter phone number"
                                    className="app-input"
                                />
                            </Field>
                        </div>


                        <div
                            className="
                                mt-4
                            "
                        >
                            <Field
                                label="Address"
                                required
                            >
                                <input
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter address"
                                    className="app-input"
                                />
                            </Field>
                        </div>


                        <div
                            className="
                                my-5
                                border-t
                                border-[#e8eef5]
                            "
                        />


                        <div>
                            <h4
                                className="
                                    text-[12px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                User Role
                            </h4>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-[#7c8da6]
                                "
                            >
                                Select whether this user is a Trainer or Trainee.
                            </p>


                            <div
                                className="
                                    mt-4
                                    grid
                                    gap-3
                                    md:grid-cols-2
                                "
                            >
                                <RoleCard
                                    selected={
                                        formData.role ===
                                        "trainer"
                                    }
                                    title="Trainer"
                                    description="Can manage one assigned training module and trainee activities."
                                    onClick={() =>
                                        handleChange({
                                            target: {
                                                name:
                                                    "role",

                                                value:
                                                    "trainer",
                                            },
                                        })
                                    }
                                />


                                <RoleCard
                                    selected={
                                        formData.role ===
                                        "trainee"
                                    }
                                    title="Trainee"
                                    description="Receives both training modules automatically."
                                    onClick={() =>
                                        handleChange({
                                            target: {
                                                name:
                                                    "role",

                                                value:
                                                    "trainee",
                                            },
                                        })
                                    }
                                />
                            </div>
                        </div>


                        {formData.role && (
                            <>
                                <div
                                    className="
                                        my-5
                                        border-t
                                        border-[#e8eef5]
                                    "
                                />


                                <div>
                                    <h4
                                        className="
                                            text-[12px]
                                            font-bold
                                            text-[#172033]
                                        "
                                    >
                                        Training Assignment
                                    </h4>


                                    <p
                                        className="
                                            mt-1
                                            text-[9px]
                                            text-[#7c8da6]
                                        "
                                    >
                                        {formData.role ===
                                            "trainer"
                                            ? "Trainer must be assigned exactly one training module."
                                            : "Trainee receives both training modules automatically."}
                                    </p>


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
                                            ) => (
                                                <TrainingCard
                                                    key={
                                                        section.id
                                                    }
                                                    section={
                                                        section
                                                    }
                                                    selected={formData.assignedTrainingSections.includes(
                                                        section.id
                                                    )}
                                                    locked={
                                                        formData.role ===
                                                        "trainee"
                                                    }
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
                            </>
                        )}


                        <div
                            className="
                                mt-6
                                flex
                                flex-col-reverse
                                justify-end
                                gap-3
                                sm:flex-row
                            "
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    resetForm();

                                    setShowForm(
                                        false
                                    );
                                }}
                                className="
                                    min-h-[40px]
                                    rounded-lg
                                    border
                                    border-[#dbe4ef]
                                    bg-white
                                    px-5
                                    text-[10px]
                                    font-medium
                                    text-[#52627a]
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
                                    disabled:opacity-50
                                "
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save User"}
                            </button>
                        </div>
                    </form>
                </section>
            )}


            {credentials && (
                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-blue-200
                        bg-[#eef6ff]
                        p-5
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        "
                    >
                        <div
                            className="
                                flex
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
                                    rounded-lg
                                    bg-[#1769e8]
                                    text-white
                                "
                            >
                                🔑
                            </div>


                            <div>
                                <h3
                                    className="
                                        text-[13px]
                                        font-bold
                                        text-[#172033]
                                    "
                                >
                                    New Temporary Credentials
                                </h3>


                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        text-[#64748b]
                                    "
                                >
                                    {credentials.name ||
                                        "New user"}
                                </p>
                            </div>
                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                setCredentials(
                                    null
                                )
                            }
                            className="
                                text-[10px]
                                text-slate-500
                            "
                        >
                            Close
                        </button>
                    </div>


                    <p
                        className="
                            mt-4
                            text-[9px]
                            text-orange-600
                        "
                    >
                        Save or send these credentials now. The temporary password is shown only once.
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
                            flex-wrap
                            gap-3
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                copyCredentials
                            }
                            className="
                                min-h-[40px]
                                rounded-lg
                                bg-[#1769e8]
                                px-5
                                text-[10px]
                                font-semibold
                                text-white
                            "
                        >
                            Copy Credentials
                        </button>


                        <button
                            type="button"
                            onClick={
                                sendEmail
                            }
                            className="
                                min-h-[40px]
                                rounded-lg
                                bg-[#1769e8]
                                px-5
                                text-[10px]
                                font-semibold
                                text-white
                            "
                        >
                            Send Email
                        </button>
                    </div>
                </section>
            )}


            <section
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#dbe4ef]
                    bg-white
                    shadow-sm
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-[#e8eef5]
                        px-5
                        py-4
                    "
                >
                    <div>
                        <h3
                            className="
                                text-[13px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Pending Account Creation
                        </h3>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-[#7c8da6]
                            "
                        >
                            Review the user and generate their login credentials.
                        </p>
                    </div>


                    <span
                        className="
                            rounded-full
                            bg-blue-50
                            px-3
                            py-1.5
                            text-[9px]
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
                        "
                    >
                        <span
                            className="
                                mb-2
                                block
                                text-[10px]
                                font-medium
                                text-[#172033]
                            "
                        >
                            Select Pending User
                        </span>


                        <select
                            value={
                                selectedUserId
                            }
                            onChange={(
                                event
                            ) =>
                                setSelectedUserId(
                                    event.target.value
                                )
                            }
                            disabled={
                                loadingPending
                            }
                            className="app-input"
                        >
                            <option value="">
                                {loadingPending
                                    ? "Loading pending users..."
                                    : pendingUsers.length ===
                                        0
                                        ? "No pending users"
                                        : "Select a pending user"}
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
                                        {`${user.firstName || ""} ${user.lastName || ""}`.trim()}{" "}
                                        -{" "}
                                        {user.role}
                                    </option>
                                )
                            )}
                        </select>
                    </label>


                    {selectedPendingUser && (
                        <div
                            className="
                                mt-4
                                flex
                                flex-col
                                gap-3
                                rounded-lg
                                border
                                border-blue-100
                                bg-blue-50/40
                                p-4
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-[11px]
                                        font-semibold
                                        text-[#172033]
                                    "
                                >
                                    {`${selectedPendingUser.firstName || ""} ${selectedPendingUser.lastName || ""}`.trim()}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        capitalize
                                        text-[#64748b]
                                    "
                                >
                                    {selectedPendingUser.role} ·{" "}
                                    {selectedPendingUser.email}
                                </p>
                            </div>


                            <button
                                type="button"
                                onClick={
                                    generateCredentials
                                }
                                disabled={
                                    generating
                                }
                                className="
                                    min-h-[40px]
                                    rounded-lg
                                    bg-[#1769e8]
                                    px-5
                                    text-[10px]
                                    font-semibold
                                    text-white
                                    disabled:opacity-50
                                "
                            >
                                {generating
                                    ? "Generating..."
                                    : "Generate Credentials"}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}


function Field({
    label,
    required,
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
                    text-[10px]
                    font-medium
                    text-[#172033]
                "
            >
                {label}

                {required && (
                    <span
                        className="
                            ml-0.5
                            text-red-500
                        "
                    >
                        *
                    </span>
                )}
            </span>


            {children}
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
                min-h-[76px]
                items-center
                justify-between
                gap-4
                rounded-lg
                border
                px-4
                py-3
                text-left
                transition

                ${selected
                    ? "border-blue-400 bg-blue-50/50"
                    : "border-[#dbe4ef] bg-white hover:border-blue-200"
                }
            `}
        >
            <div>
                <p
                    className="
                        text-[11px]
                        font-bold
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
                        text-[#7c8da6]
                    "
                >
                    {description}
                </p>
            </div>


            <div
                className={`
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border

                    ${selected
                        ? "border-blue-500"
                        : "border-slate-300"
                    }
                `}
            >
                {selected && (
                    <span
                        className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-blue-500
                        "
                    />
                )}
            </div>
        </button>
    );
}


function TrainingCard({
    section,
    selected,
    locked,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            disabled={
                locked
            }
            className={`
                flex
                min-h-[72px]
                items-center
                gap-3
                rounded-lg
                border
                px-4
                py-3
                text-left

                ${selected
                    ? "border-blue-300 bg-blue-50/40"
                    : "border-[#dbe4ef] bg-white"
                }

                ${locked
                    ? "cursor-default"
                    : "hover:border-blue-300"
                }
            `}
        >
            <span
                className={`
                    flex
                    h-4
                    w-4
                    shrink-0
                    items-center
                    justify-center
                    rounded-sm
                    border
                    text-[10px]

                    ${selected
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-slate-300"
                    }
                `}
            >
                {selected
                    ? "✓"
                    : ""}
            </span>


            <div>
                <p
                    className="
                        text-[10px]
                        font-semibold
                        text-[#172033]
                    "
                >
                    {section.label}
                </p>


                <p
                    className="
                        mt-1
                        text-[8px]
                        leading-4
                        text-[#7c8da6]
                    "
                >
                    {section.description}
                </p>
            </div>
        </button>
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
                border-blue-100
                bg-white
                p-4
            "
        >
            <p
                className="
                    text-[8px]
                    font-semibold
                    uppercase
                    text-[#8aa0bb]
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-2
                    break-all
                    text-[11px]
                    font-bold
                    text-[#172033]
                "
            >
                {value}
            </p>
        </div>
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
                    font-bold
                "
            >
                ×
            </button>
        </div>
    );
}


export default CreateUserForm;