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

    // ======================================================
    // AUTHORIZED TRAINER COUNT
    // ======================================================

    const authorisedCount =
        Array.isArray(
            formData.authorizedTrainers
        )
            ? formData.authorizedTrainers.length
            : 0;


    // ======================================================
    // UI
    // ======================================================

    return (
        <form
            onSubmit={
                onSubmit
            }
            className="
                overflow-hidden
<<<<<<< HEAD
                rounded-2xl
=======
                rounded-xl
>>>>>>> sprint2
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
<<<<<<< HEAD
                    relative
                    overflow-hidden
                    border-b
                    border-slate-200
                    bg-gradient-to-r
                    from-[#073763]
                    via-[#0b4f87]
                    to-[#1769aa]
                    px-5
                    py-5
                    text-white
                    sm:px-6
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-12
                        -top-12
                        h-32
                        w-32
                        rounded-full
                        bg-white/10
                    "
                />


                <div
                    className="
                        relative
                        flex
                        items-start
                        gap-4
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
                            border
                            border-white/15
                            bg-white/10
                        "
                    >
=======
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
>>>>>>> sprint2

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <rect
                                x="4"
                                y="4"
                                width="16"
                                height="16"
                                rx="3"
                            />

<<<<<<< HEAD
                            <path d="M8 9h8" />
=======
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
>>>>>>> sprint2

                            <path d="M8 13h8" />

<<<<<<< HEAD
                            <path d="M8 17h5" />
                        </svg>

                    </div>


                    <div>

                        <p
                            className="
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.18em]
                                text-blue-100
                            "
                        >
                            Safety Programme
                        </p>


                        <h2
                            className="
                                mt-1
                                text-base
                                font-bold
                                sm:text-lg
                            "
                        >
                            {editingProgramme
                                ? "Edit Training Programme"
                                : "Create Training Programme"}
                        </h2>


                        <p
                            className="
                                mt-1
                                max-w-xl
                                text-[10px]
                                leading-5
                                text-blue-100
                            "
                        >
                            Configure programme information,
                            pass requirements and Trainer access.
                        </p>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* FORM BODY */}
            {/* ================================================= */}

            <div
                className="
                    space-y-6
                    p-4
                    sm:p-5
                    lg:p-6
                "
            >

                {/* ================================================= */}
                {/* BASIC INFORMATION */}
                {/* ================================================= */}

                <FormSection
                    title="Programme Information"
                    description="Define the safety training programme and its pass requirement."
                    icon="programme"
                >

                    <div
                        className="
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
=======
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
>>>>>>> sprint2

                            <div className="relative">

<<<<<<< HEAD
                                <select
                                    name="programmeType"
                                    value={
                                        formData.programmeType
=======
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
>>>>>>> sprint2
                                    }
                                    onChange={
                                        onInputChange
                                    }
                                    disabled={
                                        saving ||
<<<<<<< HEAD
                                        Boolean(
                                            editingProgramme
                                        )
                                    }
                                    className={
                                        selectClass
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
                                                {programme.label}
                                            </option>
                                        )
                                    )}

                                </select>


                                <SelectArrow />

                            </div>


                            {editingProgramme && (
                                <HelperText>
                                    Programme type cannot be changed after creation.
                                </HelperText>
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
                                className={
                                    inputClass
                                }
                                placeholder="Example: 80"
                                required
                            />


                            <HelperText>
                                Enter a value between 0 and 100.
                            </HelperText>

                        </FormField>


                        {/* TITLE */}

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
=======
                                        !formData.programmeType
>>>>>>> sprint2
                                    }
                                    className={
                                        inputClass
                                    }
<<<<<<< HEAD
                                    placeholder="Example: Manual Handling Safety"
                                    required
                                />


                                <div
                                    className="
                                        mt-2
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                        text-[9px]
                                        text-slate-400
                                    "
                                >

                                    <span>
                                        Minimum 3 characters.
                                    </span>


                                    <span
                                        className="
                                            font-semibold
                                        "
                                    >
                                        {formData.title.length}/150
                                    </span>

                                </div>

                            </FormField>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="md:col-span-2">

                            <FormField
                                label="Description"
                                required
                            >

                                <textarea
                                    name="description"
                                    rows="6"
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
                                    className={`${inputClass} min-h-[140px] resize-y`}
                                    placeholder="Describe the purpose and safety learning objectives of this programme."
                                    required
                                />


                                <div
                                    className="
                                        mt-2
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                        text-[9px]
                                        text-slate-400
                                    "
                                >

                                    <span>
                                        Minimum 10 characters.
                                    </span>


                                    <span
                                        className="
                                            font-semibold
                                        "
                                    >
                                        {formData.description.length}/3000
                                    </span>

                                </div>

                            </FormField>

                        </div>

                    </div>

                </FormSection>


                {/* ================================================= */}
                {/* PROGRAMME TYPE INFORMATION */}
                {/* ================================================= */}

                {formData.programmeType && (
                    <div
                        className="
                            rounded-xl
                            border
                            border-blue-100
                            bg-gradient-to-r
                            from-blue-50
                            to-white
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
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-blue-600
                                    shadow-sm
                                "
                            >
                                <ProgrammeTypeIcon
                                    type={
                                        formData.programmeType
                                    }
                                />
                            </div>


                            <div>

                                <p
                                    className="
                                        text-[11px]
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    {formData.programmeType ===
                                        "working-at-height"
                                        ? "Working at Height"
                                        : "Manual Handling"}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    {formData.programmeType ===
                                        "working-at-height"
                                        ? "This programme covers safety procedures for elevated work, ladders, platforms and fall-risk awareness."
                                        : "This programme covers safe lifting, carrying, load assessment and injury-prevention practices."}
                                </p>

                            </div>

                        </div>

                    </div>
                )}


                {/* ================================================= */}
                {/* ADMIN TRAINER MANAGEMENT */}
                {/* ================================================= */}

                {isAdmin && (
                    <FormSection
                        title="Trainer Management"
                        description="Select the programme owner and any additional authorised Trainers."
                        icon="trainer"
                    >

                        <div
                            className="
                                space-y-5
                            "
                        >

                            {/* OWNER */}

                            <FormField
                                label="Owner Trainer"
                                required
                            >

                                <div className="relative">

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
                                            selectClass
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


                                    <SelectArrow />

                                </div>


                                <HelperText>
                                    Owner must already have access to the selected training area.
                                </HelperText>


                                {formData.programmeType &&
                                    eligibleOwnerTrainers.length ===
                                    0 && (
                                        <div
                                            className="
                                                mt-3
                                                rounded-xl
                                                border
                                                border-amber-200
                                                bg-amber-50
                                                p-3
                                                text-[10px]
                                                text-amber-700
                                            "
                                        >
                                            No active Trainer is currently assigned to this training area.
                                        </div>
                                    )}

                            </FormField>


                            {/* AUTHORIZED TRAINERS */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50/60
                                    p-4
                                    sm:p-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                text-slate-800
                                            "
                                        >
                                            Additional Authorised Trainers
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-[9px]
                                                leading-5
                                                text-slate-500
                                            "
                                        >
                                            These Trainers can manage this programme in addition to its owner.
                                        </p>

                                    </div>


                                    <span
                                        className="
                                            w-fit
                                            rounded-full
                                            bg-blue-50
                                            px-3
                                            py-1.5
                                            text-[9px]
                                            font-semibold
                                            text-blue-700
                                        "
                                    >
                                        {authorisedCount} Selected
                                    </span>

                                </div>


                                {!formData.programmeType ? (
                                    <TrainerEmptyState
                                        message="Select a programme type first."
                                    />
                                ) : !formData.ownerId ? (
                                    <TrainerEmptyState
                                        message="Select an owner Trainer before adding authorised Trainers."
                                    />
                                ) : eligibleAuthorizedTrainers.length ===
                                    0 ? (
                                    <TrainerEmptyState
                                        message="No additional eligible Trainers are available for this programme."
                                    />
                                ) : (
                                    <div
                                        className="
                                            mt-4
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
                                                    Array.isArray(
                                                        formData.authorizedTrainers
                                                    ) &&
                                                    formData.authorizedTrainers.includes(
                                                        trainer._id
                                                    );


                                                return (
                                                    <label
                                                        key={
                                                            trainer._id
                                                        }
                                                        className={`
                                                            relative
                                                            overflow-hidden
                                                            rounded-xl
                                                            border
                                                            p-4
                                                            transition-all

                                                            ${saving
                                                                ? "cursor-not-allowed opacity-60"
                                                                : "cursor-pointer"
                                                            }

                                                            ${checked
                                                                ? "border-blue-400 bg-blue-50 shadow-sm"
                                                                : "border-slate-200 bg-white hover:border-blue-300"
                                                            }
                                                        `}
                                                    >

                                                        {checked && (
                                                            <div
                                                                className="
                                                                    absolute
                                                                    left-0
                                                                    top-0
                                                                    h-full
                                                                    w-1
                                                                    bg-blue-500
                                                                "
                                                            />
                                                        )}


                                                        <div
                                                            className="
                                                                flex
                                                                items-start
                                                                gap-3
                                                            "
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
                                                                    mt-1
                                                                    h-4
                                                                    w-4
                                                                    shrink-0
                                                                    rounded
                                                                    border-slate-300
                                                                    text-blue-600
                                                                    focus:ring-blue-500
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
                                                                        text-[11px]
                                                                        font-bold
                                                                        text-slate-800
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
                                                                            mt-1
                                                                            truncate
                                                                            text-[9px]
                                                                            text-slate-500
                                                                        "
                                                                    >
                                                                        @{trainer.username}
                                                                    </p>
                                                                )}

                                                            </div>

                                                        </div>

                                                    </label>
                                                );
                                            }
                                        )}

                                    </div>
                                )}

                            </div>

                        </div>

                    </FormSection>
=======
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
>>>>>>> sprint2
                )}


                {/* ================================================= */}
                {/* STATUS */}
                {/* ================================================= */}

<<<<<<< HEAD
                <FormSection
                    title="Programme Availability"
                    description="Control whether this programme is currently available."
                    icon="status"
                >

                    <FormField
                        label="Programme Status"
                        required
                    >

                        <div className="relative">

=======
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
>>>>>>> sprint2
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
<<<<<<< HEAD
                                    selectClass
=======
                                    inputClass
>>>>>>> sprint2
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
<<<<<<< HEAD


                            <SelectArrow />

                        </div>


                        <div
                            className="
                                mt-3
                                grid
                                gap-2
                                sm:grid-cols-3
                            "
                        >

                            <StatusHelp
                                title="Draft"
                                description="Still being prepared."
                                active={
                                    formData.status ===
                                    "draft"
                                }
                            />


                            <StatusHelp
                                title="Active"
                                description="Available for programme use."
                                active={
                                    formData.status ===
                                    "active"
                                }
                            />


                            <StatusHelp
                                title="Inactive"
                                description="Retained but unavailable."
                                active={
                                    formData.status ===
                                    "inactive"
                                }
                            />

                        </div>

                    </FormField>

                </FormSection>
=======
                        </FormField>
                    </div>
                </div>
>>>>>>> sprint2


                {/* ================================================= */}
                {/* ACTIONS */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        flex-col-reverse
<<<<<<< HEAD
                        gap-3
=======
                        gap-2
>>>>>>> sprint2
                        border-t
                        border-slate-100
                        pt-5
                        sm:flex-row
                        sm:justify-end
                    "
                >
<<<<<<< HEAD

                    <ActionButton
=======
                    <ActionButton
                        type="button"
>>>>>>> sprint2
                        variant="secondary"
                        onClick={
                            onCancel
                        }
                        disabled={
                            saving
                        }
                        className="
                            w-full
<<<<<<< HEAD
                            justify-center
=======
>>>>>>> sprint2
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
<<<<<<< HEAD
                            justify-center
=======
>>>>>>> sprint2
                            sm:w-auto
                        "
                    >
                        {saving
                            ? "Saving..."
                            : editingProgramme
                                ? "Save Changes"
                                : "Create Programme"}
                    </ActionButton>
<<<<<<< HEAD

                </div>

            </div>

=======
                </div>
            </div>
>>>>>>> sprint2
        </form>
    );
}


// ======================================================
<<<<<<< HEAD
// FORM SECTION
// ======================================================

function FormSection({
    title,
    description,
    icon,
    children,
}) {
    return (
        <section>

            <div
                className="
                    mb-5
                    flex
                    items-start
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                    "
                >
                    <SectionIcon
                        type={
                            icon
                        }
                    />
                </div>


                <div>

                    <h3
                        className="
                            text-sm
                            font-bold
                            text-slate-900
                        "
                    >
                        {title}
                    </h3>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            leading-5
                            text-slate-500
                        "
                    >
                        {description}
                    </p>

                </div>

            </div>


            {children}

        </section>
    );
}


// ======================================================
=======
>>>>>>> sprint2
// FIELD
// ======================================================

function FormField({
    label,
    required = false,
    children,
}) {
    return (
<<<<<<< HEAD
        <label className="block">

=======
        <label
            className="
                block
            "
        >
>>>>>>> sprint2
            <span
                className="
                    mb-2
                    block
<<<<<<< HEAD
                    text-[11px]
                    font-semibold
                    text-slate-700
=======
                    text-[8px]
                    font-medium
                    text-slate-500
>>>>>>> sprint2
                "
            >
                {label}


                {required && (
                    <span
                        className="
<<<<<<< HEAD
                            ml-1
                            text-red-500
                        "
                    >
                        *
=======
                            text-red-500
                        "
                    >
                        {" "}*
>>>>>>> sprint2
                    </span>
                )}

            </span>


            {children}
        </label>
    );
}


// ======================================================
<<<<<<< HEAD
// HELPER
// ======================================================

function HelperText({
    children,
}) {
    return (
        <p
            className="
                mt-2
                text-[9px]
                leading-4
                text-slate-400
            "
        >
            {children}
        </p>
    );
}


// ======================================================
// TRAINER EMPTY STATE
// ======================================================

function TrainerEmptyState({
    message,
}) {
    return (
        <div
            className="
                mt-4
                rounded-xl
                border
                border-dashed
                border-slate-300
                bg-white
                p-4
                text-center
            "
        >

            <p
                className="
                    text-[10px]
                    text-slate-500
                "
            >
                {message}
            </p>

        </div>
    );
}


// ======================================================
// STATUS HELP
// ======================================================

function StatusHelp({
    title,
    description,
    active,
}) {
    return (
        <div
            className={`
                rounded-xl
                border
                p-3
                transition

                ${active
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200 bg-slate-50"
                }
            `}
        >

            <p
                className={`
                    text-[10px]
                    font-bold

                    ${active
                        ? "text-blue-700"
                        : "text-slate-600"
                    }
                `}
            >
                {title}
            </p>


            <p
                className="
                    mt-1
                    text-[9px]
                    leading-4
                    text-slate-500
                "
            >
                {description}
            </p>

=======
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
>>>>>>> sprint2
        </div>
    );
}


// ======================================================
<<<<<<< HEAD
// SELECT ARROW
// ======================================================

function SelectArrow() {
    return (
        <div
            className="
                pointer-events-none
                absolute
                inset-y-0
                right-0
                flex
                items-center
                pr-3
                text-slate-400
            "
        >

            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
            >
                <path d="m7 10 5 5 5-5" />
            </svg>

        </div>
    );
}


// ======================================================
// PROGRAMME TYPE ICON
// ======================================================

function ProgrammeTypeIcon({
    type,
}) {

    if (
        type ===
        "working-at-height"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <path d="M5 21V6" />

                <path d="M19 21V6" />

                <path d="M5 9h14" />

                <path d="M5 14h14" />

                <path d="M5 19h14" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <rect
                x="3"
                y="8"
                width="18"
                height="10"
                rx="2"
            />

            <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />

            <path d="M8 13h8" />
        </svg>
    );
}


// ======================================================
// SECTION ICON
// ======================================================

function SectionIcon({
    type,
}) {

    if (
        type ===
        "trainer"
    ) {
        return (
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

                <path d="M16 8l2 2 3-4" />
            </svg>
        );
    }


    if (
        type ===
        "status"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />

                <path d="m8 12 2.5 2.5L16 9" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path d="M6 4h12v16H6z" />

            <path d="M9 9h6" />

            <path d="M9 13h6" />
        </svg>
    );
}


// ======================================================
// SHARED STYLES
=======
// INPUT STYLE
>>>>>>> sprint2
// ======================================================

const inputClass = `
    min-h-[40px]
    w-full
    rounded-xl
    border
    border-slate-300
    bg-white
<<<<<<< HEAD
    px-3.5
    py-3
    text-xs
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


const selectClass = `
    w-full
    appearance-none
    rounded-xl
    border
    border-slate-300
    bg-white
    px-3.5
    py-3
    pr-10
    text-xs
    text-slate-800
=======
    px-3
    text-[9px]
    text-slate-700
>>>>>>> sprint2
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