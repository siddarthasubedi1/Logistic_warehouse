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

    // ======================================================
    // SELECTED DATA
    // ======================================================

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
                    border-blue-200
                    bg-gradient-to-r
                    from-[#073763]
                    via-[#0b4f87]
                    to-[#1769aa]
                    px-5
                    py-5
                    text-white
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
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <circle
                                cx="8"
                                cy="8"
                                r="3"
                            />

                            <path d="M3 20c.5-4 2-6 5-6" />

                            <path d="M15 6h6v12h-6" />

                            <path d="m12 12 3-3" />

                            <path d="m12 12 3 3" />
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
                            Training Access
                        </p>


                        <h2
                            className="
                                mt-1
                                text-base
                                font-bold
                                sm:text-lg
                            "
                        >
                            Assign Training Programme
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
                            Select an active programme and the
                            Trainee who should receive access.
                        </p>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* BODY */}
            {/* ================================================= */}

            <div
                className="
                    p-4
                    sm:p-5
                    lg:p-6
                "
            >

                <div
                    className="
                        grid
                        gap-4
                        lg:grid-cols-2
                    "
                >

                    {/* ================================================= */}
                    {/* PROGRAMME */}
                    {/* ================================================= */}

                    <label className="block">

                        <span
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            Training Programme

                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </span>


                        <div className="relative mt-2">

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
                                disabled={
                                    saving
                                }
                                className={
                                    selectClass
                                }
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
                                            {programme.title}
                                            {" — "}
                                            {formatProgrammeType(
                                                programme.programmeType
                                            )}
                                        </option>
                                    )
                                )}

                            </select>


                            <SelectArrow />

                        </div>

                    </label>


                    {/* ================================================= */}
                    {/* TRAINEE */}
                    {/* ================================================= */}

                    <label className="block">

                        <span
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            Trainee

                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </span>


                        <div className="relative mt-2">

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
                                disabled={
                                    saving
                                }
                                className={
                                    selectClass
                                }
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
                                                trainee.username
                                            )}

                                            {trainee.username
                                                ? ` — @${trainee.username}`
                                                : ""}
                                        </option>
                                    )
                                )}

                            </select>


                            <SelectArrow />

                        </div>

                    </label>

                </div>


                {/* ================================================= */}
                {/* PREVIEW */}
                {/* ================================================= */}

                {(selectedProgramme ||
                    selectedTrainee) && (
                        <div
                            className="
                            mt-5
                            grid
                            gap-3
                            rounded-2xl
                            border
                            border-blue-100
                            bg-gradient-to-r
                            from-blue-50
                            to-white
                            p-4
                            md:grid-cols-2
                        "
                        >

                            <SelectionPreview
                                label="Programme"
                                value={
                                    selectedProgramme
                                        ? selectedProgramme.title
                                        : "Not selected"
                                }
                                extra={
                                    selectedProgramme
                                        ? formatProgrammeType(
                                            selectedProgramme.programmeType
                                        )
                                        : ""
                                }
                                type="programme"
                            />


                            <SelectionPreview
                                label="Trainee"
                                value={
                                    selectedTrainee
                                        ? getUserDisplayName(
                                            selectedTrainee,
                                            "Trainee"
                                        )
                                        : "Not selected"
                                }
                                extra={
                                    selectedTrainee?.username
                                        ? `@${selectedTrainee.username}`
                                        : ""
                                }
                                type="trainee"
                            />

                        </div>
                    )}


                {/* ================================================= */}
                {/* ACTION */}
                {/* ================================================= */}

                <div
                    className="
                        mt-5
                        flex
                        flex-col
                        gap-3
                        border-t
                        border-slate-100
                        pt-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <p
                        className="
                            text-[9px]
                            leading-4
                            text-slate-500
                        "
                    >
                        Only active programmes and eligible active
                        Trainee accounts are available.
                    </p>


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
                            justify-center
                            px-6
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


// ======================================================
// SELECTION PREVIEW
// ======================================================

function SelectionPreview({
    label,
    value,
    extra,
    type,
}) {
    return (
        <div
            className="
                flex
                items-start
                gap-3
                rounded-xl
                border
                border-white
                bg-white/80
                p-3
            "
        >

            <div
                className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl

                    ${type ===
                        "trainee"
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-blue-50 text-blue-600"
                    }
                `}
            >
                {type ===
                    "trainee" ? (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                    >
                        <circle
                            cx="12"
                            cy="8"
                            r="3"
                        />

                        <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                    </svg>
                ) : (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                    >
                        <rect
                            x="4"
                            y="4"
                            width="16"
                            height="16"
                            rx="3"
                        />

                        <path d="M8 9h8" />

                        <path d="M8 13h8" />
                    </svg>
                )}
            </div>


            <div className="min-w-0">

                <p
                    className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                    "
                >
                    {label}
                </p>


                <p
                    className="
                        mt-1
                        break-words
                        text-[11px]
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
                            text-[9px]
                            text-slate-500
                        "
                    >
                        {extra}
                    </p>
                )}

            </div>

        </div>
    );
}


// ======================================================
// ARROW
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
// SELECT STYLE
// ======================================================

const selectClass = `
    h-11
    w-full
    appearance-none
    rounded-xl
    border
    border-slate-300
    bg-white
    px-3.5
    pr-10
    text-xs
    text-slate-800
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
    disabled:cursor-not-allowed
    disabled:bg-slate-100
`;


export default TrainingAssignmentForm;