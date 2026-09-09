import ActionButton from "../ui/ActionButton";


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


    return (
        <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
            {/* ================================================= */}
            {/* PERSONAL INFORMATION */}
            {/* ================================================= */}

            <div>
                <h2 className="text-base font-bold text-slate-900">
                    User Information
                </h2>


                <p className="mt-1 text-xs text-slate-500">
                    Enter the personal information for the new
                    Trainer or Trainee.
                </p>
            </div>


            <div className="grid gap-4 md:grid-cols-2">

                {/* First name */}
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
                        placeholder="Enter first name"
                        className={inputClass}
                    />
                </FormField>


                {/* Last name */}
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
                        placeholder="Enter last name"
                        className={inputClass}
                    />
                </FormField>


                {/* Age */}
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
                        placeholder="Enter age"
                        className={inputClass}
                    />
                </FormField>


                {/* Gender */}
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
                        className={inputClass}
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


                {/* Email */}
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
                        placeholder="user@example.com"
                        className={inputClass}
                    />
                </FormField>


                {/* Phone */}
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
                        placeholder="Enter phone number"
                        className={inputClass}
                    />
                </FormField>


                {/* Address */}
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
                            placeholder="Enter address"
                            className={inputClass}
                        />
                    </FormField>
                </div>
            </div>


            {/* ================================================= */}
            {/* ROLE */}
            {/* ================================================= */}

            <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-900">
                    Role
                </h3>


                <p className="mt-1 text-xs text-slate-500">
                    Select whether this account is for a Trainer
                    or Trainee.
                </p>


                <div className="mt-4 grid gap-3 sm:grid-cols-2">

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
                    />


                    <RoleOption
                        title="Trainee"
                        description="Receives both training areas automatically."
                        value="trainee"
                        checked={
                            isTrainee
                        }
                        onChange={
                            onChange
                        }
                    />

                </div>
            </div>


            {/* ================================================= */}
            {/* TRAINING SECTIONS */}
            {/* ================================================= */}

            {formData.role && (
                <div className="border-t border-slate-100 pt-5">
                    <h3 className="text-sm font-bold text-slate-900">
                        Training Access
                    </h3>


                    {isTrainer ? (
                        <p className="mt-1 text-xs text-slate-500">
                            A Trainer can be assigned Manual Handling,
                            Working at Height, or both.
                        </p>
                    ) : (
                        <p className="mt-1 text-xs text-slate-500">
                            Trainees automatically receive access to
                            both training areas.
                        </p>
                    )}


                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {TRAINING_SECTIONS.map(
                            (section) => {
                                const checked =
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
                                            cursor-pointer
                                            items-start
                                            gap-3
                                            rounded-xl
                                            border
                                            p-4
                                            transition
                                            ${checked
                                                ? "border-blue-300 bg-blue-50"
                                                : "border-slate-200 bg-white"
                                            }
                                            ${isTrainee
                                                ? "cursor-default"
                                                : "hover:border-blue-300"
                                            }
                                        `}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                checked
                                            }
                                            disabled={
                                                isTrainee
                                            }
                                            onChange={() =>
                                                onToggleTrainingSection(
                                                    section.id
                                                )
                                            }
                                            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                                        />


                                        <div>
                                            <p className="text-xs font-semibold text-slate-800">
                                                {section.name}
                                            </p>


                                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                                {section.description}
                                            </p>
                                        </div>
                                    </label>
                                );
                            }
                        )}
                    </div>
                </div>
            )}


            {/* ================================================= */}
            {/* BUTTONS */}
            {/* ================================================= */}

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">

                <ActionButton
                    variant="secondary"
                    disabled={
                        saving
                    }
                    onClick={
                        onCancel
                    }
                >
                    Cancel
                </ActionButton>


                <ActionButton
                    type="submit"
                    variant="primary"
                    disabled={
                        saving
                    }
                >
                    {saving
                        ? "Saving..."
                        : "Save User Information"}
                </ActionButton>

            </div>
        </form>
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
            <span className="text-xs font-semibold text-slate-700">
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
}) {
    return (
        <label
            className={`
                flex
                cursor-pointer
                items-start
                gap-3
                rounded-xl
                border
                p-4
                transition
                ${checked
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300"
                }
            `}
        >
            <input
                type="radio"
                name="role"
                value={value}
                checked={
                    checked
                }
                onChange={
                    onChange
                }
                className="mt-1 h-4 w-4 border-slate-300 text-blue-600"
            />


            <div>
                <p className="text-xs font-bold text-slate-800">
                    {title}
                </p>


                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    {description}
                </p>
            </div>
        </label>
    );
}


// ======================================================
// SHARED INPUT STYLE
// ======================================================

const inputClass = `
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    py-2.5
    text-sm
    text-slate-800
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
`;


export default UserDetailsForm;