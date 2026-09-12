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
            <section
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
            </section>
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
                            font-bold
                            text-[#172033]
                        "
                    >
                        Training Programmes
                    </h2>

                    <p
                        className="
                            mt-1
                            text-[8px]
                            font-medium
                            text-slate-500
                        "
                    >
                        Manage programme details, content and status.
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
                        font-semibold
                        text-slate-600
                    "
                >
                    {programmes.length} Programme
                    {programmes.length ===
                        1
                        ? ""
                        : "s"}
                </span>
            </div>


            {/* MOBILE */}

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


            {/* DESKTOP */}

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
                    <thead
                        className="
                            bg-slate-50
                        "
                    >
                        <tr>
                            <Head>
                                Programme
                            </Head>

                            <Head>
                                Type
                            </Head>

                            <Head>
                                Owner
                            </Head>

                            <Head>
                                Pass Mark
                            </Head>

                            <Head>
                                Status
                            </Head>

                            <Head right>
                                Actions
                            </Head>
                        </tr>
                    </thead>


                    <tbody>
                        {programmes.map(
                            (
                                programme
                            ) => {
                                const owner =
                                    programme.ownerTrainer ||
                                    programme.owner ||
                                    programme.trainer;

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
                                            border-t
                                            border-slate-100
                                            hover:bg-slate-50/60
                                        "
                                    >
                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <div
                                                className="
                                                    max-w-[240px]
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
                                                    {
                                                        programme.title
                                                    }
                                                </p>

                                                {programme.description && (
                                                    <p
                                                        className="
                                                            mt-1
                                                            line-clamp-2
                                                            text-[7px]
                                                            font-medium
                                                            leading-4
                                                            text-slate-500
                                                        "
                                                    >
                                                        {
                                                            programme.description
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </td>


                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >
                                            <span
                                                className="
                                                    rounded-full
                                                    bg-blue-50
                                                    px-2.5
                                                    py-1
                                                    text-[7px]
                                                    font-semibold
                                                    text-blue-700
                                                "
                                            >
                                                {formatProgrammeType(
                                                    programme.programmeType
                                                )}
                                            </span>
                                        </td>


                                        <td
                                            className="
                                                px-5
                                                py-4
                                                text-[8px]
                                                font-semibold
                                                text-slate-600
                                            "
                                        >
                                            {getUserDisplayName(
                                                owner,
                                                "—"
                                            )}
                                        </td>


                                        <td
                                            className="
                                                px-5
                                                py-4
                                                text-[8px]
                                                font-semibold
                                                text-slate-700
                                            "
                                        >
                                            {programme.passMark ??
                                                0}
                                            %
                                        </td>


                                        <td
                                            className="
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
                                                    Learning Sections
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
                                                        Reactivate
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
                                                        Deactivate
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


function ProgrammeCard({
    programme,
    processingId,
    onEdit,
    onManageSections,
    onDeactivate,
    onReactivate,
}) {
    const owner =
        programme.ownerTrainer ||
        programme.owner ||
        programme.trainer;

    const processing =
        processingId ===
        programme._id;

    const inactive =
        programme.status ===
        "inactive";


    return (
        <article
            className="
                rounded-xl
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
                    justify-between
                    gap-3
                "
            >
                <span
                    className="
                        rounded-full
                        bg-blue-50
                        px-2.5
                        py-1
                        text-[7px]
                        font-semibold
                        text-blue-700
                    "
                >
                    {formatProgrammeType(
                        programme.programmeType
                    )}
                </span>

                <StatusBadge
                    status={
                        programme.status
                    }
                />
            </div>


            <h3
                className="
                    mt-3
                    text-[11px]
                    font-bold
                    text-slate-800
                "
            >
                {programme.title}
            </h3>


            {programme.description && (
                <p
                    className="
                        mt-2
                        line-clamp-3
                        text-[8px]
                        font-medium
                        leading-5
                        text-slate-600
                    "
                >
                    {
                        programme.description
                    }
                </p>
            )}


            <div
                className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-2
                "
            >
                <Info
                    label="Owner"
                    value={
                        getUserDisplayName(
                            owner,
                            "—"
                        )
                    }
                />

                <Info
                    label="Pass Mark"
                    value={`${programme.passMark ??
                        0}%`}
                />
            </div>


            <div
                className="
                    mt-4
                    grid
                    gap-2
                    sm:grid-cols-2
                "
            >
                <ActionButton
                    variant="primary"
                    disabled={
                        processing
                    }
                    onClick={() =>
                        onManageSections?.(
                            programme
                        )
                    }
                >
                    Learning Sections
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
                        Reactivate
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
                        Deactivate
                    </ActionButton>
                )}
            </div>
        </article>
    );
}


function Info({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-lg
                bg-slate-50
                p-3
            "
        >
            <p
                className="
                    text-[7px]
                    font-semibold
                    text-slate-500
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    truncate
                    text-[8px]
                    font-bold
                    text-slate-700
                "
            >
                {value}
            </p>
        </div>
    );
}


function Head({
    children,
    right = false,
}) {
    return (
        <th
            className={`
                px-5
                py-3
                text-[7px]
                font-bold
                uppercase
                tracking-wide
                text-slate-500

                ${right
                    ? "text-right"
                    : "text-left"
                }
            `}
        >
            {children}
        </th>
    );
}


export default TrainingProgrammeTable;