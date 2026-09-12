import ActionButton from "../ui/ActionButton";

import {
    getUserDisplayName,
} from "../../utils/training";


function TrainingProgrammeForm({
    formData,
    isAdmin = false,
    availableProgrammeTypes = [],
    eligibleOwnerTrainers = [],
    eligibleAuthorizedTrainers = [],
    editingProgramme = null,
    saving = false,
    onInputChange,
    onToggleAuthorizedTrainer,
    onSubmit,
    onCancel,
}) {
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
                    {editingProgramme
                        ? "Edit Training Programme"
                        : "Create Training Programme"}
                </h2>

                <p
                    className="
                        mt-1
                        text-[8px]
                        font-medium
                        text-slate-500
                    "
                >
                    Enter programme information and Trainer access.
                </p>
            </div>


            <div
                className="
                    space-y-6
                    p-4
                    sm:p-5
                "
            >
                {/* INFORMATION */}

                <section>
                    <SectionTitle>
                        Programme Information
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
                            label="Programme Type"
                            required
                        >
                            <select
                                name="programmeType"
                                value={
                                    formData.programmeType
                                }
                                onChange={
                                    onInputChange
                                }
                                disabled={
                                    saving ||
                                    Boolean(
                                        editingProgramme
                                    )
                                }
                                className={
                                    inputClass
                                }
                                required
                            >
                                <option value="">
                                    Select programme type
                                </option>

                                {availableProgrammeTypes.map(
                                    (
                                        programme
                                    ) => (
                                        <option
                                            key={
                                                programme.value
                                            }
                                            value={
                                                programme.value
                                            }
                                        >
                                            {
                                                programme.label
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </FormField>


                        <FormField
                            label="Pass Mark (%)"
                            required
                        >
                            <input
                                type="number"
                                name="passMark"
                                min="0"
                                max="100"
                                value={
                                    formData.passMark
                                }
                                onChange={
                                    onInputChange
                                }
                                disabled={
                                    saving
                                }
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
                                label="Programme Title"
                                required
                            >
                                <input
                                    type="text"
                                    name="title"
                                    minLength="3"
                                    maxLength="150"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        onInputChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    placeholder="Enter programme title"
                                    className={
                                        inputClass
                                    }
                                    required
                                />
                            </FormField>
                        </div>


                        <div
                            className="
                                md:col-span-2
                            "
                        >
                            <FormField
                                label="Description"
                                required
                            >
                                <textarea
                                    name="description"
                                    rows="5"
                                    minLength="10"
                                    maxLength="3000"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        onInputChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    placeholder="Describe this training programme"
                                    className={`
                                        ${inputClass}
                                        min-h-[120px]
                                        resize-y
                                        py-3
                                        leading-5
                                    `}
                                    required
                                />
                            </FormField>
                        </div>
                    </div>
                </section>


                {/* TRAINER MANAGEMENT */}

                {isAdmin && (
                    <section
                        className="
                            border-t
                            border-slate-100
                            pt-5
                        "
                    >
                        <SectionTitle>
                            Trainer Management
                        </SectionTitle>


                        <div
                            className="
                                mt-4
                            "
                        >
                            <FormField
                                label="Owner Trainer"
                                required
                            >
                                <select
                                    name="ownerId"
                                    value={
                                        formData.ownerId
                                    }
                                    onChange={
                                        onInputChange
                                    }
                                    disabled={
                                        saving ||
                                        !formData.programmeType
                                    }
                                    className={
                                        inputClass
                                    }
                                    required
                                >
                                    <option value="">
                                        Select owner Trainer
                                    </option>

                                    {eligibleOwnerTrainers.map(
                                        (
                                            trainer
                                        ) => (
                                            <option
                                                key={
                                                    trainer._id
                                                }
                                                value={
                                                    trainer._id
                                                }
                                            >
                                                {getUserDisplayName(
                                                    trainer,
                                                    trainer.username ||
                                                    "Trainer"
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </FormField>
                        </div>


                        <div
                            className="
                                mt-5
                            "
                        >
                            <p
                                className="
                                    text-[8px]
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Authorised Trainers
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[7px]
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Optional additional Trainers who may manage this programme.
                            </p>


                            {eligibleAuthorizedTrainers.length ===
                                0 ? (
                                <div
                                    className="
                                        mt-3
                                        rounded-lg
                                        bg-slate-50
                                        p-3
                                    "
                                >
                                    <p
                                        className="
                                            text-[8px]
                                            font-medium
                                            text-slate-500
                                        "
                                    >
                                        No additional eligible Trainers available.
                                    </p>
                                </div>
                            ) : (
                                <div
                                    className="
                                        mt-3
                                        grid
                                        gap-3
                                        md:grid-cols-2
                                    "
                                >
                                    {eligibleAuthorizedTrainers.map(
                                        (
                                            trainer
                                        ) => {
                                            const selected =
                                                formData
                                                    .authorizedTrainers
                                                    .includes(
                                                        trainer._id
                                                    );

                                            return (
                                                <label
                                                    key={
                                                        trainer._id
                                                    }
                                                    className={`
                                                        flex
                                                        cursor-pointer
                                                        items-center
                                                        gap-3
                                                        rounded-lg
                                                        border
                                                        p-3

                                                        ${selected
                                                            ? "border-blue-300 bg-blue-50"
                                                            : "border-slate-200 bg-white"
                                                        }
                                                    `}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selected
                                                        }
                                                        onChange={() =>
                                                            onToggleAuthorizedTrainer?.(
                                                                trainer._id
                                                            )
                                                        }
                                                        disabled={
                                                            saving
                                                        }
                                                        className="
                                                            h-4
                                                            w-4
                                                            accent-blue-600
                                                        "
                                                    />

                                                    <div
                                                        className="
                                                            min-w-0
                                                        "
                                                    >
                                                        <p
                                                            className="
                                                                truncate
                                                                text-[9px]
                                                                font-bold
                                                                text-slate-800
                                                            "
                                                        >
                                                            {getUserDisplayName(
                                                                trainer,
                                                                trainer.username
                                                            )}
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-[7px]
                                                                text-slate-500
                                                            "
                                                        >
                                                            @{trainer.username}
                                                        </p>
                                                    </div>
                                                </label>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                )}


                {/* STATUS */}

                <section
                    className="
                        border-t
                        border-slate-100
                        pt-5
                    "
                >
                    <div
                        className="
                            max-w-sm
                        "
                    >
                        <FormField
                            label="Programme Status"
                            required
                        >
                            <select
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    onInputChange
                                }
                                disabled={
                                    saving
                                }
                                className={
                                    inputClass
                                }
                            >
                                <option value="draft">
                                    Draft
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>
                        </FormField>
                    </div>
                </section>


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
                            : editingProgramme
                                ? "Save Changes"
                                : "Create Programme"}
                    </ActionButton>
                </div>
            </div>
        </form>
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


export default TrainingProgrammeForm;