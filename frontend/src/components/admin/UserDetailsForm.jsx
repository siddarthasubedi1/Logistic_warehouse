import ActionButton from "../ui/ActionButton";


const TRAINING_SECTIONS = [
    {
        id: "manual-handling",
        name: "Manual Handling",
        description:
            "Safe lifting, carrying and manual handling training.",
    },

    {
        id: "working-at-height",
        name: "Working at Height",
        description:
            "Safety training for elevated work environments.",
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


    const selectedSections =
        Array.isArray(
            formData.assignedTrainingSections
        )
            ? formData.assignedTrainingSections
            : [];


    return (
        <form
            onSubmit={
                onSubmit
            }
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
                        font-semibold
                        text-slate-800
                    "
                >
                    User Information
                </h2>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-400
                    "
                >
                    Enter personal information and training access.
                </p>
            </div>


            <div
                className="
                    space-y-6
                    p-4
                    sm:p-5
                "
            >
                {/* PERSONAL INFORMATION */}

                <section>
                    <SectionHeading
                        title="Personal Information"
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
                                className={
                                    inputClass
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
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="example@email.com"
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


                {/* ROLE */}

                <section
                    className="
                        border-t
                        border-slate-100
                        pt-5
                    "
                >
                    <SectionHeading
                        title="User Role"
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
                            description="Manages assigned workplace safety training."
                            value="trainer"
                            checked={
                                isTrainer
                            }
                            disabled={
                                saving
                            }
                            onChange={
                                onChange
                            }
                        />


                        <RoleOption
                            title="Trainee"
                            description="Receives workplace safety training."
                            value="trainee"
                            checked={
                                isTrainee
                            }
                            disabled={
                                saving
                            }
                            onChange={
                                onChange
                            }
                        />
                    </div>
                </section>


                {/* TRAINING */}

                {(isTrainer ||
                    isTrainee) && (
                        <section
                            className="
                            border-t
                            border-slate-100
                            pt-5
                        "
                        >
                            <SectionHeading
                                title="Training Access"
                            />


                            {isTrainee && (
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
                                        leading-4
                                        text-emerald-700
                                    "
                                    >
                                        Trainees receive Manual Handling and Working at Height automatically.
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
                                                rounded-lg
                                                border
                                                p-4

                                                ${checked
                                                        ? "border-blue-300 bg-blue-50"
                                                        : "border-slate-200 bg-white"
                                                    }

                                                ${isTrainee
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
                                                        isTrainee ||
                                                        saving
                                                    }
                                                    onChange={() =>
                                                        onToggleTrainingSection(
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
                                                        font-medium
                                                        text-slate-700
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
                                                        leading-4
                                                        text-slate-400
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


                {/* ACTIONS */}

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
                        type="button"
                        variant="secondary"
                        disabled={
                            saving
                        }
                        onClick={
                            onCancel
                        }
                        className="
                            w-full
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


function SectionHeading({
    title,
}) {
    return (
        <h3
            className="
                text-[10px]
                font-semibold
                text-slate-700
            "
        >
            {title}
        </h3>
    );
}


function FormField({
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
                    text-[8px]
                    font-medium
                    text-slate-500
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
    title,
    description,
    value,
    checked,
    disabled,
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

                ${checked
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200 bg-white"
                }
            `}
        >
            <div>
                <p
                    className="
                        text-[9px]
                        font-medium
                        text-slate-700
                    "
                >
                    {title}
                </p>


                <p
                    className="
                        mt-1
                        text-[7px]
                        leading-4
                        text-slate-400
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
                disabled={disabled}
                onChange={
                    onChange
                }
                className="
                    h-4
                    w-4
                    accent-blue-600
                "
            />
        </label>
    );
}


const inputClass = `
    h-10
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[9px]
    text-slate-700
    outline-none
    placeholder:text-slate-400
    focus:border-blue-500
    disabled:cursor-not-allowed
    disabled:bg-slate-50
`;


export default UserDetailsForm;