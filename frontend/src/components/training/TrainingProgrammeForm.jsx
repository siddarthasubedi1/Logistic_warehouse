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
            onSubmit={onSubmit}
            className="
                overflow-hidden
                rounded-xl
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
                    {editingProgramme
                        ? "Edit Training Programme"
                        : "Create Training Programme"}
                </h2>


                <p
                    className="
                        mt-1
                        text-[8px]
                        leading-4
                        text-slate-400
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
                {/* ================================================= */}
                {/* BASIC INFORMATION */}
                {/* ================================================= */}

                <div>
                    <h3
                        className="
                            text-[10px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        Programme Information
                    </h3>


                    <div
                        className="
                            mt-4
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >
                        {/* PROGRAMME TYPE */}

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


                            {editingProgramme && (
                                <p
                                    className="
                                        mt-1
                                        text-[7px]
                                        text-slate-400
                                    "
                                >
                                    Programme type cannot be changed after creation.
                                </p>
                            )}
                        </FormField>


                        {/* PASS MARK */}

                        <FormField
                            label="Pass Mark (%)"
                            required
                        >
                            <input
                                type="number"
                                name="passMark"
                                min="0"
                                max="100"
                                step="1"
                                value={
                                    formData.passMark
                                }
                                onChange={
                                    onInputChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Example: 70"
                                className={
                                    inputClass
                                }
                                required
                            />
                        </FormField>


                        {/* TITLE */}

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


                                <div
                                    className="
                                        mt-1
                                        flex
                                        justify-between
                                        gap-3
                                        text-[7px]
                                        text-slate-400
                                    "
                                >
                                    <span>
                                        Minimum 3 characters
                                    </span>


                                    <span>
                                        {
                                            formData
                                                .title
                                                .length
                                        }
                                        /150
                                    </span>
                                </div>
                            </FormField>
                        </div>


                        {/* DESCRIPTION */}

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
                                    placeholder="Describe the training programme"
                                    className={`
                                        ${inputClass}
                                        min-h-[110px]
                                        resize-y
                                        py-3
                                    `}
                                    required
                                />


                                <div
                                    className="
                                        mt-1
                                        flex
                                        justify-between
                                        gap-3
                                        text-[7px]
                                        text-slate-400
                                    "
                                >
                                    <span>
                                        Minimum 10 characters
                                    </span>


                                    <span>
                                        {
                                            formData
                                                .description
                                                .length
                                        }
                                        /3000
                                    </span>
                                </div>
                            </FormField>
                        </div>
                    </div>
                </div>


                {/* ================================================= */}
                {/* ADMIN TRAINER MANAGEMENT */}
                {/* ================================================= */}

                {isAdmin && (
                    <div
                        className="
                            border-t
                            border-slate-100
                            pt-5
                        "
                    >
                        <h3
                            className="
                                text-[10px]
                                font-semibold
                                text-slate-700
                            "
                        >
                            Trainer Management
                        </h3>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                leading-4
                                text-slate-400
                            "
                        >
                            Select the Trainer responsible for this programme.
                        </p>


                        {/* OWNER */}

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
                                        {formData.programmeType
                                            ? "Select owner Trainer"
                                            : "Select programme type first"}
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


                        {/* AUTHORIZED TRAINERS */}

                        <div
                            className="
                                mt-5
                            "
                        >
                            <p
                                className="
                                    text-[8px]
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Authorised Trainers
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[7px]
                                    leading-4
                                    text-slate-400
                                "
                            >
                                Additional Trainers who can manage this programme.
                            </p>


                            {!formData.programmeType ? (
                                <InformationBox>
                                    Select a programme type first.
                                </InformationBox>
                            ) : !formData.ownerId ? (
                                <InformationBox>
                                    Select an owner Trainer first.
                                </InformationBox>
                            ) : eligibleAuthorizedTrainers.length ===
                                0 ? (
                                <InformationBox>
                                    No additional eligible Trainers are available.
                                </InformationBox>
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
                                            const checked =
                                                formData.authorizedTrainers.includes(
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
                                                        transition

                                                        ${checked
                                                            ? "border-blue-300 bg-blue-50"
                                                            : "border-slate-200 bg-white hover:border-blue-200"
                                                        }

                                                        ${saving
                                                            ? "cursor-not-allowed opacity-60"
                                                            : ""
                                                        }
                                                    `}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            checked
                                                        }
                                                        disabled={
                                                            saving
                                                        }
                                                        onChange={() =>
                                                            onToggleAuthorizedTrainer(
                                                                trainer._id
                                                            )
                                                        }
                                                        className="
                                                            h-3.5
                                                            w-3.5
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
                                                                font-medium
                                                                text-slate-700
                                                            "
                                                        >
                                                            {getUserDisplayName(
                                                                trainer,
                                                                trainer.username ||
                                                                "Trainer"
                                                            )}
                                                        </p>


                                                        {trainer.username && (
                                                            <p
                                                                className="
                                                                    mt-0.5
                                                                    truncate
                                                                    text-[7px]
                                                                    text-slate-400
                                                                "
                                                            >
                                                                {
                                                                    trainer.username
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </label>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* ================================================= */}
                {/* STATUS */}
                {/* ================================================= */}

                <div
                    className="
                        border-t
                        border-slate-100
                        pt-5
                    "
                >
                    <div
                        className="
                            max-w-md
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
                                required
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
                </div>


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
                        type="button"
                        variant="secondary"
                        onClick={
                            onCancel
                        }
                        disabled={
                            saving
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


// ======================================================
// FIELD
// ======================================================

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


// ======================================================
// INFORMATION BOX
// ======================================================

function InformationBox({
    children,
}) {
    return (
        <div
            className="
                mt-3
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                p-3
            "
        >
            <p
                className="
                    text-[8px]
                    text-slate-500
                "
            >
                {children}
            </p>
        </div>
    );
}


// ======================================================
// INPUT STYLE
// ======================================================

const inputClass = `
    min-h-[40px]
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[9px]
    text-slate-700
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-blue-500
    focus:ring-1
    focus:ring-blue-100
    disabled:cursor-not-allowed
    disabled:bg-slate-50
    disabled:text-slate-400
`;


export default TrainingProgrammeForm;