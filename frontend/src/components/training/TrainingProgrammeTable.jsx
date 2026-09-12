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
    if (programmes.length === 0) {
        return (
            <div
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >
                <EmptyState
                    title="No training programmes found."
                    description="Create a programme or change the current filters."
                    icon="training"
                />
            </div>
        );
    }


    return (
        <section
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
                    flex
                    flex-col
                    gap-2
                    border-b
                    border-slate-100
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
                            text-[11px]
                            font-semibold
                            text-slate-800
                        "
                    >
                        Training Programmes
                    </h2>

                    <p
                        className="
                            mt-1
                            text-[8px]
                            text-slate-400
                        "
                    >
                        Manage programme details, sections and status.
                    </p>
                </div>

                <span
                    className="
                        w-fit
                        rounded-full
                        bg-slate-100
                        px-3
                        py-1
                        text-[8px]
                        font-medium
                        text-slate-500
                    "
                >
                    {programmes.length} Programme
                    {programmes.length === 1
                        ? ""
                        : "s"}
                </span>
            </div>


            {/* MOBILE / TABLET */}

            <div
                className="
                    grid
                    gap-3
                    p-4
                    md:grid-cols-2
                    lg:hidden
                "
            >
                {programmes.map(
                    (programme) => (
                        <ProgrammeCard
                            key={programme._id}
                            programme={programme}
                            processingId={
                                processingId
                            }
                            onEdit={onEdit}
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


            {/* DESKTOP TABLE */}

            <div
                className="
                    hidden
                    overflow-x-auto
                    lg:block
                "
            >
                <table
                    className="
                        w-full
                        min-w-[850px]
                    "
                >
                    <thead
                        className="
                            border-b
                            border-slate-200
                            bg-slate-50
                        "
                    >
                        <tr
                            className="
                                text-left
                                text-[8px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            <th className="px-5 py-3">
                                Programme
                            </th>

                            <th className="px-4 py-3">
                                Training Area
                            </th>

                            <th className="px-4 py-3">
                                Owner
                            </th>

                            <th className="px-4 py-3">
                                Pass Mark
                            </th>

                            <th className="px-4 py-3">
                                Status
                            </th>

                            <th
                                className="
                                    px-5
                                    py-3
                                    text-right
                                "
                            >
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
                            (programme) => {
                                const processing =
                                    processingId ===
                                    programme._id;

                                const inactive =
                                    programme.status ===
                                    "inactive";

                                const owner =
                                    programme.ownerTrainer ||
                                    programme.owner ||
                                    null;

                                return (
                                    <tr
                                        key={
                                            programme._id
                                        }
                                        className="
                                            bg-white
                                            transition
                                            hover:bg-slate-50
                                        "
                                    >
                                        {/* PROGRAMME */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    items-center
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
                                                        min-w-0
                                                    "
                                                >
                                                    <p
                                                        className="
                                                            max-w-[230px]
                                                            truncate
                                                            text-[9px]
                                                            font-semibold
                                                            text-slate-700
                                                        "
                                                    >
                                                        {
                                                            programme.title
                                                        }
                                                    </p>

                                                    {programme.description && (
                                                        <p
                                                            className="
                                                                mt-1
                                                                max-w-[230px]
                                                                truncate
                                                                text-[7px]
                                                                text-slate-400
                                                            "
                                                        >
                                                            {
                                                                programme.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>


                                        {/* TYPE */}

                                        <td
                                            className="
                                                px-4
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

                                        <td
                                            className="
                                                px-4
                                                py-4
                                                text-[8px]
                                                text-slate-600
                                            "
                                        >
                                            {getUserDisplayName(
                                                owner,
                                                "—"
                                            )}
                                        </td>


                                        {/* PASS */}

                                        <td
                                            className="
                                                px-4
                                                py-4
                                            "
                                        >
                                            <span
                                                className="
                                                    text-[9px]
                                                    font-medium
                                                    text-slate-700
                                                "
                                            >
                                                {programme.passMark ??
                                                    0}
                                                %
                                            </span>
                                        </td>


                                        {/* STATUS */}

                                        <td
                                            className="
                                                px-4
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

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
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
                                                        onManageSections?.(
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
                                                        onEdit?.(
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
                                                            onReactivate?.(
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
                                                            onDeactivate?.(
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
        null;


    return (
        <article
            className="
                rounded-lg
                border
                border-slate-200
                bg-white
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
                <ProgrammeIcon
                    type={
                        programme.programmeType
                    }
                />

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    <h3
                        className="
                            break-words
                            text-[10px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        {programme.title}
                    </h3>

                    <div
                        className="
                            mt-2
                            flex
                            flex-wrap
                            gap-2
                        "
                    >
                        <ProgrammeTypeBadge
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
                </div>
            </div>


            {programme.description && (
                <p
                    className="
                        mt-3
                        line-clamp-2
                        text-[8px]
                        leading-4
                        text-slate-400
                    "
                >
                    {programme.description}
                </p>
            )}


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
                    value={`${programme.passMark ??
                        0
                        }%`}
                />
            </div>


            <div
                className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-2
                "
            >
                <ActionButton
                    variant="secondary"
                    disabled={processing}
                    onClick={() =>
                        onManageSections?.(
                            programme
                        )
                    }
                    className="
                        w-full
                        justify-center
                    "
                >
                    Sections
                </ActionButton>

                <ActionButton
                    variant="secondary"
                    disabled={processing}
                    onClick={() =>
                        onEdit?.(
                            programme
                        )
                    }
                    className="
                        w-full
                        justify-center
                    "
                >
                    Edit
                </ActionButton>

                {inactive ? (
                    <ActionButton
                        variant="success"
                        disabled={processing}
                        onClick={() =>
                            onReactivate?.(
                                programme
                            )
                        }
                        className="
                            col-span-2
                            w-full
                            justify-center
                        "
                    >
                        {processing
                            ? "Processing..."
                            : "Reactivate"}
                    </ActionButton>
                ) : (
                    <ActionButton
                        variant="warning"
                        disabled={processing}
                        onClick={() =>
                            onDeactivate?.(
                                programme
                            )
                        }
                        className="
                            col-span-2
                            w-full
                            justify-center
                        "
                    >
                        {processing
                            ? "Processing..."
                            : "Deactivate"}
                    </ActionButton>
                )}
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
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg

                ${workingAtHeight
                    ? "bg-amber-50 text-amber-600"
                    : "bg-blue-50 text-blue-600"
                }
            `}
        >
            {workingAtHeight ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
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
                    className="h-4 w-4"
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
// PROGRAMME TYPE
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
                whitespace-nowrap
                rounded-full
                px-2.5
                py-1
                text-[7px]
                font-medium

                ${workingAtHeight
                    ? "bg-amber-50 text-amber-600"
                    : "bg-blue-50 text-blue-600"
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
                    text-[7px]
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
                    text-[8px]
                    font-medium
                    text-slate-600
                "
            >
                {value || "—"}
            </p>
        </div>
    );
}


export default TrainingProgrammeTable;