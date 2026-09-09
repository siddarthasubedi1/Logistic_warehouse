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
                space-y-6
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
            "
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div>
                <h2 className="text-base font-bold text-slate-900">
                    {editingProgramme
                        ? "Edit Training Programme"
                        : "Create Training Programme"}
                </h2>


                <p className="mt-1 text-xs leading-5 text-slate-500">
                    Configure the programme information and Trainer
                    access.
                </p>
            </div>


            {/* ================================================= */}
            {/* BASIC INFORMATION */}
            {/* ================================================= */}

            <div className="grid gap-4 md:grid-cols-2">

                {/* ================================================= */}
                {/* PROGRAMME TYPE */}
                {/* ================================================= */}

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
                        className={inputClass}
                        required
                    >
                        <option value="">
                            Select programme type
                        </option>


                        {availableProgrammeTypes.map(
                            (programme) => (
                                <option
                                    key={
                                        programme.value
                                    }
                                    value={
                                        programme.value
                                    }
                                >
                                    {programme.label}
                                </option>
                            )
                        )}
                    </select>


                    {editingProgramme && (
                        <p className="mt-1 text-[11px] text-slate-400">
                            Programme type cannot be changed from this
                            form after creation.
                        </p>
                    )}
                </FormField>


                {/* ================================================= */}
                {/* PASS MARK */}
                {/* ================================================= */}

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
                        className={inputClass}
                        placeholder="Example: 70"
                        required
                    />


                    <p className="mt-1 text-[11px] text-slate-400">
                        Enter a value between 0 and 100.
                    </p>
                </FormField>


                {/* ================================================= */}
                {/* TITLE */}
                {/* ================================================= */}

                <div className="md:col-span-2">
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
                            className={inputClass}
                            placeholder="Enter programme title"
                            required
                        />


                        <div className="mt-1 flex justify-between gap-3 text-[11px] text-slate-400">
                            <span>
                                Minimum 3 characters.
                            </span>

                            <span>
                                {formData.title.length}/150
                            </span>
                        </div>
                    </FormField>
                </div>


                {/* ================================================= */}
                {/* DESCRIPTION */}
                {/* ================================================= */}

                <div className="md:col-span-2">
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
                            className={inputClass}
                            placeholder="Describe the training programme"
                            required
                        />


                        <div className="mt-1 flex justify-between gap-3 text-[11px] text-slate-400">
                            <span>
                                Minimum 10 characters.
                            </span>

                            <span>
                                {formData.description.length}/3000
                            </span>
                        </div>
                    </FormField>
                </div>

            </div>


            {/* ================================================= */}
            {/* ADMIN TRAINER MANAGEMENT */}
            {/* ================================================= */}

            {isAdmin && (
                <div className="space-y-5 border-t border-slate-100 pt-5">

                    <div>
                        <h3 className="text-sm font-bold text-slate-900">
                            Trainer Management
                        </h3>


                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            The owner Trainer must already have access
                            to the selected training area.
                        </p>
                    </div>


                    {/* ================================================= */}
                    {/* OWNER TRAINER */}
                    {/* ================================================= */}

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
                            className={inputClass}
                            required
                        >
                            <option value="">
                                {formData.programmeType
                                    ? "Select owner Trainer"
                                    : "Select programme type first"}
                            </option>


                            {eligibleOwnerTrainers.map(
                                (trainer) => (
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


                        {formData.programmeType &&
                            eligibleOwnerTrainers.length === 0 && (
                                <p className="mt-2 text-xs text-amber-600">
                                    No active Trainer is currently assigned
                                    to this training area.
                                </p>
                            )}
                    </FormField>


                    {/* ================================================= */}
                    {/* AUTHORISED TRAINERS */}
                    {/* ================================================= */}

                    <div>
                        <p className="text-xs font-semibold text-slate-700">
                            Additional Authorised Trainers
                        </p>


                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            These Trainers can manage the programme in
                            addition to the owner Trainer.
                        </p>


                        {!formData.programmeType ? (
                            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs text-slate-500">
                                    Select a programme type first.
                                </p>
                            </div>
                        ) : !formData.ownerId ? (
                            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs text-slate-500">
                                    Select an owner Trainer before adding
                                    authorised Trainers.
                                </p>
                            </div>
                        ) : eligibleAuthorizedTrainers.length === 0 ? (
                            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs text-slate-500">
                                    No additional eligible Trainers are
                                    available for this programme.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-3 grid gap-3 md:grid-cols-2">

                                {eligibleAuthorizedTrainers.map(
                                    (trainer) => {
                                        const checked =
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
                                                    items-start
                                                    gap-3
                                                    rounded-xl
                                                    border
                                                    p-4
                                                    transition

                                                    ${saving
                                                        ? "cursor-not-allowed opacity-60"
                                                        : "cursor-pointer"
                                                    }

                                                    ${checked
                                                        ? "border-blue-300 bg-blue-50"
                                                        : "border-slate-200 bg-white hover:border-blue-300"
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
                                                        mt-0.5
                                                        h-4
                                                        w-4
                                                        rounded
                                                        border-slate-300
                                                        text-blue-600
                                                        focus:ring-blue-500
                                                    "
                                                />


                                                <div>
                                                    <p className="text-xs font-bold text-slate-800">
                                                        {getUserDisplayName(
                                                            trainer,
                                                            trainer.username ||
                                                            "Trainer"
                                                        )}
                                                    </p>


                                                    {trainer.username && (
                                                        <p className="mt-1 text-[11px] text-slate-500">
                                                            {trainer.username}
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

            <div className="border-t border-slate-100 pt-5">

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
                        className={inputClass}
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


            {/* ================================================= */}
            {/* ACTION BUTTONS */}
            {/* ================================================= */}

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">

                <ActionButton
                    variant="secondary"
                    onClick={
                        onCancel
                    }
                    disabled={
                        saving
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
                        : editingProgramme
                            ? "Save Changes"
                            : "Create Programme"}
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

            <span className="mb-2 block text-xs font-semibold text-slate-700">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </span>


            {children}

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
    disabled:cursor-not-allowed
    disabled:bg-slate-100
    disabled:text-slate-500
`;


export default TrainingProgrammeForm;