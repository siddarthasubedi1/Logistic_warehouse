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
    return (
        <form
            onSubmit={onSubmit}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div>

                <h2 className="text-base font-bold text-slate-900">
                    Assign Training Programme
                </h2>


                <p className="mt-1 text-xs leading-5 text-slate-500">
                    Select an active training programme and the Trainee who
                    should receive access.
                </p>

            </div>


            {/* ================================================= */}
            {/* FIELDS */}
            {/* ================================================= */}

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">

                {/* Programme */}
                <label className="block">

                    <span className="text-xs font-semibold text-slate-700">
                        Training Programme
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    </span>


                    <select
                        value={
                            programmeId
                        }
                        onChange={(
                            event
                        ) =>
                            onProgrammeChange(
                                event.target.value
                            )
                        }
                        className={inputClass}
                    >
                        <option value="">
                            Select programme
                        </option>


                        {programmes.map(
                            (programme) => (
                                <option
                                    key={
                                        programme._id
                                    }
                                    value={
                                        programme._id
                                    }
                                >
                                    {programme.title}
                                    {" — "}
                                    {formatProgrammeType(
                                        programme.programmeType
                                    )}
                                </option>
                            )
                        )}

                    </select>

                </label>


                {/* Trainee */}
                <label className="block">

                    <span className="text-xs font-semibold text-slate-700">
                        Trainee
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    </span>


                    <select
                        value={
                            traineeId
                        }
                        onChange={(
                            event
                        ) =>
                            onTraineeChange(
                                event.target.value
                            )
                        }
                        className={inputClass}
                    >
                        <option value="">
                            Select Trainee
                        </option>


                        {trainees.map(
                            (trainee) => (
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
                                        trainee.username
                                    )}
                                    {trainee.username
                                        ? ` — @${trainee.username}`
                                        : ""}
                                </option>
                            )
                        )}

                    </select>

                </label>


                {/* Submit */}
                <ActionButton
                    type="submit"
                    variant="primary"
                    disabled={
                        saving ||
                        !programmeId ||
                        !traineeId
                    }
                    className="justify-center px-6"
                >
                    {saving
                        ? "Assigning..."
                        : "Assign Programme"}
                </ActionButton>

            </div>

        </form>
    );
}


const inputClass = `
    mt-2
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


export default TrainingAssignmentForm;