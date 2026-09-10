import ActionButton from "../ui/ActionButton";


// ======================================================
// BROAD TRAINING AREAS
// ======================================================

const TRAINING_SECTIONS = [
    {
        id:
            "manual-handling",

        name:
            "Manual Handling",

        description:
            "Safe lifting, carrying and manual handling procedures.",
    },

    {
        id:
            "working-at-height",

        name:
            "Working at Height",

        description:
            "Safety procedures for working at elevated locations.",
    },
];


// ======================================================
// USER DETAILS FORM
// ======================================================

function UserDetailsForm({
    formData,
    saving = false,
    onChange,
    onToggleTrainingSection,
    onSubmit,
    onCancel,
}) {
    const isTrainer =
        formData.role ===
        "trainer";


    const isTrainee =
        formData.role ===
        "trainee";


    const selectedSections =
        Array.isArray(
            formData
                .assignedTrainingSections
        )
            ? formData
                .assignedTrainingSections
            : [];


    return (
        <form
            onSubmit={
                onSubmit
            }
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    overflow-hidden
                    border-b
                    border-slate-100
                    bg-gradient-to-r
                    from-white
                    via-white
                    to-blue-50
                    p-5
                    sm:p-6
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-16
                        -top-16
                        h-40
                        w-40
                        rounded-full
                        bg-blue-50
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        flex
                        items-start
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-50
                            text-blue-600
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
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
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.16em]
                                text-blue-600
                            "
                        >
                            Account Creation
                        </p>


                        <h2
                            className="
                                mt-1
                                text-base
                                font-bold
                                text-slate-900
                            "
                        >
                            User Information
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Enter the personal information and training
                            access for the new Trainer or Trainee.
                        </p>
                    </div>

                </div>

            </div>


            <div
                className="
                    space-y-6
                    p-4
                    sm:p-5
                    lg:p-6
                "
            >

                {/* ================================================= */}
                {/* PERSONAL INFORMATION */}
                {/* ================================================= */}

                <section>

                    <SectionHeading
                        title="Personal Information"
                        description="Enter the user's basic account information."
                        number="1"
                    />


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
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Enter first name"
                                className={
                                    inputClass
                                }
                                required
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
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Enter last name"
                                className={
                                    inputClass
                                }
                                required
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
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Enter age"
                                className={
                                    inputClass
                                }
                                required
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
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                className={`${inputClass} appearance-none`}
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
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="user@example.com"
                                className={
                                    inputClass
                                }
                                required
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
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Enter phone number"
                                className={
                                    inputClass
                                }
                                required
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
                                        onChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    placeholder="Enter address"
                                    className={
                                        inputClass
                                    }
                                    required
                                />
                            </FormField>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* ROLE */}
                {/* ================================================= */}

                <section
                    className="
                        border-t
                        border-slate-100
                        pt-6
                    "
                >

                    <SectionHeading
                        title="Account Role"
                        description="Select whether the new account belongs to a Trainer or Trainee."
                        number="2"
                    />


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
                            description="Can manage training programmes for assigned training areas."
                            value="trainer"
                            checked={
                                isTrainer
                            }
                            onChange={
                                onChange
                            }
                            disabled={
                                saving
                            }
                        />


                        <RoleOption
                            title="Trainee"
                            description="Receives both broad training areas automatically."
                            value="trainee"
                            checked={
                                isTrainee
                            }
                            onChange={
                                onChange
                            }
                            disabled={
                                saving
                            }
                        />

                    </div>

                </section>


                {/* ================================================= */}
                {/* TRAINING ACCESS */}
                {/* ================================================= */}

                {formData.role && (
                    <section
                        className="
                            border-t
                            border-slate-100
                            pt-6
                        "
                    >

                        <SectionHeading
                            title="Training Access"
                            description={
                                isTrainer
                                    ? "Choose Manual Handling, Working at Height, or both for this Trainer."
                                    : "Both broad training areas are automatically assigned to a Trainee."
                            }
                            number="3"
                        />


                        {isTrainee && (
                            <div
                                className="
                                    mt-4
                                    flex
                                    items-start
                                    gap-3
                                    rounded-xl
                                    border
                                    border-emerald-100
                                    bg-emerald-50
                                    p-4
                                "
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="
                                        mt-0.5
                                        h-4
                                        w-4
                                        shrink-0
                                        text-emerald-600
                                    "
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    />

                                    <path d="m8 12 2.5 2.5L16 9" />
                                </svg>


                                <p
                                    className="
                                        text-[9px]
                                        leading-5
                                        text-emerald-700
                                    "
                                >
                                    Trainee access is automatic. Manual
                                    Handling and Working at Height stay
                                    selected and cannot be manually
                                    removed here.
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
                                    const checked =
                                        selectedSections.includes(
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
                                                rounded-xl
                                                border
                                                p-4
                                                transition

                                                ${checked
                                                    ? "border-blue-400 bg-blue-50 ring-1 ring-blue-100"
                                                    : "border-slate-200 bg-white"
                                                }

                                                ${isTrainee
                                                    ? "cursor-default"
                                                    : "cursor-pointer hover:border-blue-300"
                                                }
                                            `}
                                        >

                                            <input
                                                type="checkbox"
                                                checked={
                                                    checked
                                                }
                                                disabled={
                                                    isTrainee ||
                                                    saving
                                                }
                                                onChange={() =>
                                                    onToggleTrainingSection(
                                                        section.id
                                                    )
                                                }
                                                className="
                                                    mt-1
                                                    h-4
                                                    w-4
                                                    rounded
                                                    border-slate-300
                                                    text-blue-600
                                                    focus:ring-blue-500
                                                "
                                            />


                                            <div>

                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-bold
                                                        text-slate-800
                                                    "
                                                >
                                                    {section.name}
                                                </p>


                                                <p
                                                    className="
                                                        mt-1
                                                        text-[9px]
                                                        leading-5
                                                        text-slate-500
                                                    "
                                                >
                                                    {section.description}
                                                </p>


                                                {checked && (
                                                    <span
                                                        className="
                                                            mt-3
                                                            inline-flex
                                                            rounded-full
                                                            bg-blue-100
                                                            px-2.5
                                                            py-1
                                                            text-[8px]
                                                            font-semibold
                                                            text-blue-700
                                                        "
                                                    >
                                                        Assigned
                                                    </span>
                                                )}

                                            </div>

                                        </label>
                                    );
                                }
                            )}

                        </div>

                    </section>
                )}


                {/* ================================================= */}
                {/* ACTIONS */}
                {/* ================================================= */}

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

                    <ActionButton
                        variant="secondary"
                        disabled={
                            saving
                        }
                        onClick={
                            onCancel
                        }
                        className="
                            w-full
                            justify-center
                            sm:w-auto
                        "
                    >
                        Cancel
                    </ActionButton>


                    <ActionButton
                        type="submit"
                        variant="primary"
                        disabled={
                            saving
                        }
                        className="
                            w-full
                            justify-center
                            sm:w-auto
                        "
                    >
                        {saving
                            ? "Saving..."
                            : "Save User Information"}
                    </ActionButton>

                </div>

            </div>

        </form>
    );
}


// ======================================================
// SECTION HEADING
// ======================================================

function SectionHeading({
    title,
    description,
    number,
}) {
    return (
        <div
            className="
                flex
                items-start
                gap-3
            "
        >

            <span
                className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-50
                    text-[10px]
                    font-bold
                    text-blue-700
                "
            >
                {number}
            </span>


            <div>
                <h3
                    className="
                        text-xs
                        font-bold
                        text-slate-900
                    "
                >
                    {title}
                </h3>


                <p
                    className="
                        mt-1
                        text-[9px]
                        leading-5
                        text-slate-500
                    "
                >
                    {description}
                </p>
            </div>

        </div>
    );
}


// ======================================================
// FORM FIELD
// ======================================================

function FormField({
    label,
    required = false,
    children,
}) {
    return (
        <label className="block">

            <span
                className="
                    text-[10px]
                    font-semibold
                    text-slate-700
                "
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </span>


            <div className="mt-2">
                {children}
            </div>

        </label>
    );
}


// ======================================================
// ROLE OPTION
// ======================================================

function RoleOption({
    title,
    description,
    value,
    checked,
    onChange,
    disabled,
}) {
    return (
        <label
            className={`
                flex
                items-start
                gap-3
                rounded-xl
                border
                p-4
                transition

                ${checked
                    ? "border-blue-400 bg-blue-50 ring-1 ring-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }

                ${disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }
            `}
        >

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
                disabled={
                    disabled
                }
                className="
                    mt-1
                    h-4
                    w-4
                    border-slate-300
                    text-blue-600
                    focus:ring-blue-500
                "
            />


            <div>

                <p
                    className="
                        text-[10px]
                        font-bold
                        text-slate-800
                    "
                >
                    {title}
                </p>


                <p
                    className="
                        mt-1
                        text-[9px]
                        leading-5
                        text-slate-500
                    "
                >
                    {description}
                </p>

            </div>

        </label>
    );
}


// ======================================================
// INPUT STYLE
// ======================================================

const inputClass = `
    h-11
    w-full
    rounded-xl
    border
    border-slate-300
    bg-white
    px-3
    text-[10px]
    text-slate-800
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
    disabled:cursor-not-allowed
    disabled:bg-slate-100
    disabled:text-slate-500
`;


export default UserDetailsForm;