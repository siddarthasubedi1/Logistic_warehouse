import ActionButton from "../ui/ActionButton";

import {
    formatProgrammeType,
    getUserDisplayName,
} from "../../utils/training";


function TrainingAssignmentForm({
    programmes = [],
    trainees = [],
    programmeId = "",
    traineeId = "",
    saving = false,
    onProgrammeChange,
    onTraineeChange,
    onSubmit,
}) {
    const selectedProgramme =
        programmes.find(
            (
                programme
            ) =>
                String(
                    programme._id
                ) ===
                String(
                    programmeId
                )
        );


    const selectedTrainee =
        trainees.find(
            (
                trainee
            ) =>
                String(
                    trainee._id
                ) ===
                String(
                    traineeId
                )
        );


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
                    Assign Training Programme
                </h2>

                <p
                    className="
                        mt-1
                        text-[8px]
                        font-medium
                        text-slate-500
                    "
                >
                    Select an active programme and the Trainee who should receive access.
                </p>
            </div>


            <div
                className="
                    space-y-5
                    p-4
                    sm:p-5
                "
            >
                <div
                    className="
                        grid
                        gap-4
                        md:grid-cols-2
                    "
                >
                    <Field
                        label="Training Programme"
                    >
                        <select
                            value={
                                programmeId
                            }
                            onChange={(
                                event
                            ) =>
                                onProgrammeChange?.(
                                    event.target.value
                                )
                            }
                            disabled={
                                saving
                            }
                            className={
                                selectClass
                            }
                            required
                        >
                            <option value="">
                                Select programme
                            </option>

                            {programmes.map(
                                (
                                    programme
                                ) => (
                                    <option
                                        key={
                                            programme._id
                                        }
                                        value={
                                            programme._id
                                        }
                                    >
                                        {programme.title} —{" "}
                                        {formatProgrammeType(
                                            programme.programmeType
                                        )}
                                    </option>
                                )
                            )}
                        </select>
                    </Field>


                    <Field
                        label="Trainee"
                    >
                        <select
                            value={
                                traineeId
                            }
                            onChange={(
                                event
                            ) =>
                                onTraineeChange?.(
                                    event.target.value
                                )
                            }
                            disabled={
                                saving
                            }
                            className={
                                selectClass
                            }
                            required
                        >
                            <option value="">
                                Select Trainee
                            </option>

                            {trainees.map(
                                (
                                    trainee
                                ) => (
                                    <option
                                        key={
                                            trainee._id
                                        }
                                        value={
                                            trainee._id
                                        }
                                    >
                                        {getUserDisplayName(
                                            trainee,
                                            trainee.username ||
                                            "Trainee"
                                        )}
                                    </option>
                                )
                            )}
                        </select>
                    </Field>
                </div>


                {(selectedProgramme ||
                    selectedTrainee) && (
                        <div
                            className="
                            grid
                            gap-3
                            rounded-lg
                            bg-slate-50
                            p-4
                            sm:grid-cols-2
                        "
                        >
                            <SelectionItem
                                label="Programme"
                                value={
                                    selectedProgramme?.title ||
                                    "Not selected"
                                }
                                extra={
                                    selectedProgramme
                                        ? formatProgrammeType(
                                            selectedProgramme.programmeType
                                        )
                                        : ""
                                }
                            />

                            <SelectionItem
                                label="Trainee"
                                value={
                                    selectedTrainee
                                        ? getUserDisplayName(
                                            selectedTrainee,
                                            selectedTrainee.username
                                        )
                                        : "Not selected"
                                }
                                extra={
                                    selectedTrainee?.username
                                        ? `@${selectedTrainee.username}`
                                        : ""
                                }
                            />
                        </div>
                    )}


                <div
                    className="
                        flex
                        justify-end
                        border-t
                        border-slate-100
                        pt-5
                    "
                >
                    <ActionButton
                        type="submit"
                        variant="primary"
                        disabled={
                            saving ||
                            !programmeId ||
                            !traineeId
                        }
                        className="
                            w-full
                            sm:w-auto
                        "
                    >
                        {saving
                            ? "Assigning..."
                            : "Assign Programme"}
                    </ActionButton>
                </div>
            </div>
        </form>
    );
}


function Field({
    label,
    children,
}) {
    return (
        <label>
            <span
                className="
                    mb-2
                    block
                    text-[8px]
                    font-semibold
                    text-slate-700
                "
            >
                {label}{" "}
                <span
                    className="
                        text-red-500
                    "
                >
                    *
                </span>
            </span>

            {children}
        </label>
    );
}


function SelectionItem({
    label,
    value,
    extra,
}) {
    return (
        <div
            className="
                rounded-lg
                bg-white
                p-3
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
                    mt-1
                    text-[9px]
                    font-bold
                    text-slate-800
                "
            >
                {value}
            </p>

            {extra && (
                <p
                    className="
                        mt-1
                        text-[7px]
                        font-medium
                        text-slate-500
                    "
                >
                    {extra}
                </p>
            )}
        </div>
    );
}


const selectClass = `
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
    focus:border-blue-500
    focus:ring-1
    focus:ring-blue-100
    disabled:bg-slate-50
`;


export default TrainingAssignmentForm;