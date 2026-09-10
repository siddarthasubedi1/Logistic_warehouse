import ActionButton from "../ui/ActionButton";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";

import {
    formatProgrammeType,
    getUserDisplayName,
} from "../../utils/training";


function TrainingProgrammeTable({
    programmes = [],
    processingId = "",
    onEdit,
    onManageSections,
    onDeactivate,
    onReactivate,
}) {

    if (
        programmes.length ===
        0
    ) {
        return (
            <EmptyState
                title="No training programmes found."
                description="Create a programme or change the current filters."
            />
        );
    }


    return (
        <section
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
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-slate-200
                    bg-gradient-to-r
                    from-white
                    to-blue-50/40
                    px-4
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
                "
            >

                <div>

                    <h2
                        className="
                            text-sm
                            font-bold
                            text-slate-900
                        "
                    >
                        Training Programme List
                    </h2>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            leading-5
                            text-slate-500
                        "
                    >
                        Manage programme details, learning sections and status.
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
                    {programmes.length} Programme
                    {programmes.length ===
                        1
                        ? ""
                        : "s"}
                </span>

            </div>


            {/* ================================================= */}
            {/* MOBILE / TABLET CARDS */}
            {/* ================================================= */}

            <div
                className="
                    grid
                    gap-4
                    p-4
                    md:grid-cols-2
                    lg:hidden
                "
            >

                {programmes.map(
                    (
                        programme
                    ) => (
                        <ProgrammeCard
                            key={
                                programme._id
                            }
                            programme={
                                programme
                            }
                            processingId={
                                processingId
                            }
                            onEdit={
                                onEdit
                            }
                            onManageSections={
                                onManageSections
                            }
                            onDeactivate={
                                onDeactivate
                            }
                            onReactivate={
                                onReactivate
                            }
                        />
                    )
                )}

            </div>


            {/* ================================================= */}
            {/* DESKTOP TABLE */}
            {/* ================================================= */}

            <div
                className="
                    hidden
                    overflow-x-auto
                    lg:block
                "
            >

                <table
                    className="
                        min-w-[900px]
                        w-full
                    "
                >

                    <thead className="bg-slate-50">

                        <tr
                            className="
                                text-left
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >

                            <th className="px-5 py-3.5">
                                Programme
                            </th>


                            <th className="px-5 py-3.5">
                                Type
                            </th>


                            <th className="px-5 py-3.5">
                                Owner
                            </th>


                            <th className="px-5 py-3.5">
                                Pass Mark
                            </th>


                            <th className="px-5 py-3.5">
                                Status
                            </th>


                            <th className="px-5 py-3.5 text-right">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody
                        className="
                            divide-y
                            divide-slate-100
                        "
                    >

                        {programmes.map(
                            (
                                programme
                            ) => {
                                const processing =
                                    processingId ===
                                    programme._id;


                                const inactive =
                                    programme.status ===
                                    "inactive";


                                return (
                                    <tr
                                        key={
                                            programme._id
                                        }
                                        className="
                                            bg-white
                                            text-xs
                                            text-slate-700
                                            transition
                                            hover:bg-slate-50
                                        "
                                    >

                                        {/* PROGRAMME */}

                                        <td className="px-5 py-4">

                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    gap-3
                                                "
                                            >

                                                <ProgrammeIcon
                                                    type={
                                                        programme.programmeType
                                                    }
                                                />


                                                <div
                                                    className="
                                                        max-w-[280px]
                                                        min-w-0
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            break-words
                                                            font-semibold
                                                            text-slate-900
                                                        "
                                                    >
                                                        {programme.title}
                                                    </p>


                                                    {programme.description && (
                                                        <p
                                                            className="
                                                                mt-1
                                                                line-clamp-2
                                                                text-[10px]
                                                                leading-5
                                                                text-slate-500
                                                            "
                                                        >
                                                            {programme.description}
                                                        </p>
                                                    )}

                                                </div>

                                            </div>

                                        </td>


                                        {/* TYPE */}

                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                            "
                                        >
                                            <ProgrammeTypeBadge
                                                type={
                                                    programme.programmeType
                                                }
                                            />
                                        </td>


                                        {/* OWNER */}

                                        <td className="px-5 py-4">

                                            <p
                                                className="
                                                    max-w-[170px]
                                                    truncate
                                                    text-[10px]
                                                    font-semibold
                                                    text-slate-700
                                                "
                                            >
                                                {getUserDisplayName(
                                                    programme.ownerTrainer ||
                                                    programme.owner ||
                                                    programme.trainer,
                                                    "—"
                                                )}
                                            </p>

                                        </td>


                                        {/* PASS MARK */}

                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                <div
                                                    className="
                                                        h-1.5
                                                        w-12
                                                        overflow-hidden
                                                        rounded-full
                                                        bg-slate-100
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            h-full
                                                            rounded-full
                                                            bg-blue-500
                                                        "
                                                        style={{
                                                            width:
                                                                `${Math.min(
                                                                    Number(
                                                                        programme.passMark ??
                                                                        0
                                                                    ),
                                                                    100
                                                                )}%`,
                                                        }}
                                                    />
                                                </div>


                                                <span
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        text-slate-700
                                                    "
                                                >
                                                    {programme.passMark ??
                                                        0}%
                                                </span>

                                            </div>

                                        </td>


                                        {/* STATUS */}

                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                            "
                                        >
                                            <StatusBadge
                                                status={
                                                    programme.status
                                                }
                                            />
                                        </td>


                                        {/* ACTIONS */}

                                        <td className="px-5 py-4">

                                            <div
                                                className="
                                                    flex
                                                    flex-wrap
                                                    justify-end
                                                    gap-2
                                                "
                                            >

                                                <ActionButton
                                                    variant="secondary"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onManageSections(
                                                            programme
                                                        )
                                                    }
                                                >
                                                    Sections
                                                </ActionButton>


                                                <ActionButton
                                                    variant="secondary"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        onEdit(
                                                            programme
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </ActionButton>


                                                {inactive ? (
                                                    <ActionButton
                                                        variant="success"
                                                        disabled={
                                                            processing
                                                        }
                                                        onClick={() =>
                                                            onReactivate(
                                                                programme
                                                            )
                                                        }
                                                    >
                                                        {processing
                                                            ? "Processing..."
                                                            : "Reactivate"}
                                                    </ActionButton>
                                                ) : (
                                                    <ActionButton
                                                        variant="warning"
                                                        disabled={
                                                            processing
                                                        }
                                                        onClick={() =>
                                                            onDeactivate(
                                                                programme
                                                            )
                                                        }
                                                    >
                                                        {processing
                                                            ? "Processing..."
                                                            : "Deactivate"}
                                                    </ActionButton>
                                                )}

                                            </div>

                                        </td>

                                    </tr>
                                );
                            }
                        )}

                    </tbody>

                </table>

            </div>

        </section>
    );
}


// ======================================================
// MOBILE PROGRAMME CARD
// ======================================================

function ProgrammeCard({
    programme,
    processingId,
    onEdit,
    onManageSections,
    onDeactivate,
    onReactivate,
}) {
    const processing =
        processingId ===
        programme._id;


    const inactive =
        programme.status ===
        "inactive";


    const owner =
        programme.ownerTrainer ||
        programme.owner ||
        programme.trainer;


    return (
        <article
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            <div
                className={`
                    h-1
                    w-full

                    ${programme.programmeType ===
                        "working-at-height"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }
                `}
            />


            <div className="p-4">

                {/* TOP */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >

                    <ProgrammeIcon
                        type={
                            programme.programmeType
                        }
                    />


                    <StatusBadge
                        status={
                            programme.status
                        }
                    />

                </div>


                {/* TITLE */}

                <h3
                    className="
                        mt-4
                        break-words
                        text-sm
                        font-bold
                        text-slate-900
                    "
                >
                    {programme.title}
                </h3>


                {programme.description && (
                    <p
                        className="
                            mt-2
                            line-clamp-3
                            text-[10px]
                            leading-5
                            text-slate-500
                        "
                    >
                        {programme.description}
                    </p>
                )}


                <div className="mt-3">

                    <ProgrammeTypeBadge
                        type={
                            programme.programmeType
                        }
                    />

                </div>


                {/* INFO */}

                <div
                    className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-3
                        border-t
                        border-slate-100
                        pt-4
                    "
                >

                    <ProgrammeDetail
                        label="Owner"
                        value={
                            getUserDisplayName(
                                owner,
                                "—"
                            )
                        }
                    />


                    <ProgrammeDetail
                        label="Pass Mark"
                        value={`${programme.passMark ?? 0}%`}
                    />

                </div>


                {/* PROGRESS STYLE */}

                <div
                    className="
                        mt-4
                        rounded-xl
                        bg-slate-50
                        p-3
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <span
                            className="
                                text-[9px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Pass Requirement
                        </span>


                        <span
                            className="
                                text-[9px]
                                font-bold
                                text-slate-700
                            "
                        >
                            {programme.passMark ??
                                0}%
                        </span>

                    </div>


                    <div
                        className="
                            mt-2
                            h-1.5
                            overflow-hidden
                            rounded-full
                            bg-slate-200
                        "
                    >

                        <div
                            className="
                                h-full
                                rounded-full
                                bg-blue-500
                            "
                            style={{
                                width:
                                    `${Math.min(
                                        Number(
                                            programme.passMark ??
                                            0
                                        ),
                                        100
                                    )}%`,
                            }}
                        />

                    </div>

                </div>


                {/* ACTIONS */}

                <div
                    className="
                        mt-4
                        grid
                        gap-2
                        sm:grid-cols-2
                    "
                >

                    <ActionButton
                        variant="secondary"
                        disabled={
                            processing
                        }
                        onClick={() =>
                            onManageSections(
                                programme
                            )
                        }
                        className="justify-center"
                    >
                        Sections
                    </ActionButton>


                    <ActionButton
                        variant="secondary"
                        disabled={
                            processing
                        }
                        onClick={() =>
                            onEdit(
                                programme
                            )
                        }
                        className="justify-center"
                    >
                        Edit
                    </ActionButton>


                    {inactive ? (
                        <ActionButton
                            variant="success"
                            disabled={
                                processing
                            }
                            onClick={() =>
                                onReactivate(
                                    programme
                                )
                            }
                            className="
                                justify-center
                                sm:col-span-2
                            "
                        >
                            {processing
                                ? "Processing..."
                                : "Reactivate Programme"}
                        </ActionButton>
                    ) : (
                        <ActionButton
                            variant="warning"
                            disabled={
                                processing
                            }
                            onClick={() =>
                                onDeactivate(
                                    programme
                                )
                            }
                            className="
                                justify-center
                                sm:col-span-2
                            "
                        >
                            {processing
                                ? "Processing..."
                                : "Deactivate Programme"}
                        </ActionButton>
                    )}

                </div>

            </div>

        </article>
    );
}


// ======================================================
// PROGRAMME ICON
// ======================================================

function ProgrammeIcon({
    type,
}) {
    const workingAtHeight =
        type ===
        "working-at-height";


    return (
        <div
            className={`
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl

                ${workingAtHeight
                    ? "bg-amber-50 text-amber-700"
                    : "bg-blue-50 text-blue-700"
                }
            `}
        >

            {workingAtHeight ? (
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
            ) : (
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
            )}

        </div>
    );
}


// ======================================================
// TYPE BADGE
// ======================================================

function ProgrammeTypeBadge({
    type,
}) {
    const workingAtHeight =
        type ===
        "working-at-height";


    return (
        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-[9px]
                font-semibold
                ring-1
                ring-inset

                ${workingAtHeight
                    ? "bg-amber-50 text-amber-700 ring-amber-200"
                    : "bg-blue-50 text-blue-700 ring-blue-200"
                }
            `}
        >
            {formatProgrammeType(
                type
            )}
        </span>
    );
}


// ======================================================
// DETAIL
// ======================================================

function ProgrammeDetail({
    label,
    value,
}) {
    return (
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
                    text-[10px]
                    font-semibold
                    text-slate-700
                "
            >
                {value ||
                    "—"}
            </p>

        </div>
    );
}


export default TrainingProgrammeTable;