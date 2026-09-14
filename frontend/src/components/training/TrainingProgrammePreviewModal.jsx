import StatusBadge from "../ui/StatusBadge";

import {
    formatProgrammeType,
    formatTrainingDateTime,
    getProgrammeOwner,
    getUserDisplayName,
} from "../../utils/training";


function TrainingProgrammePreviewModal({
    programme,
    onClose,
    onManageSections,
}) {
    if (!programme) {
        return null;
    }

    const owner =
        getProgrammeOwner(
            programme
        );

    const authorisedTrainers =
        Array.isArray(
            programme.authorizedTrainers
        )
            ? programme.authorizedTrainers
            : [];

    return (
        <div
            className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="programme-preview-title"
        >
            <button
                type="button"
                aria-label="Close programme preview"
                className="absolute inset-0 cursor-default"
                onClick={onClose}
            />

            <section className="relative z-10 max-h-[92vh] w-full max-w-[720px] overflow-y-auto rounded-2xl border border-[#dbe4ef] bg-white shadow-2xl">
                <header className="relative overflow-hidden bg-gradient-to-r from-[#073763] to-[#1769aa] px-5 py-5 text-white sm:px-6">
                    <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10" />

                    <div className="relative z-10 flex items-start justify-between gap-4">
                        <div>
                            <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.1em] text-blue-100">
                                Programme Preview
                            </span>

                            <h2
                                id="programme-preview-title"
                                className="mt-3 text-[18px] font-bold text-white"
                            >
                                {programme.title}
                            </h2>

                            <p className="mt-2 max-w-[560px] text-[9px] leading-5 text-blue-100">
                                Read-only preview of the programme information that is available to authorised users.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[18px] text-white transition hover:bg-white/20"
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                </header>

                <div className="space-y-5 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[8px] font-semibold text-blue-700">
                            {formatProgrammeType(
                                programme.programmeType
                            )}
                        </span>

                        <StatusBadge
                            status={
                                programme.status ||
                                "draft"
                            }
                        />
                    </div>

                    <section>
                        <h3 className="text-[10px] font-bold text-[#172033]">
                            Description
                        </h3>

                        <p className="mt-2 whitespace-pre-wrap text-[9px] leading-5 text-[#52627a]">
                            {programme.description ||
                                "No programme description has been provided."}
                        </p>
                    </section>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <PreviewInfo
                            label="Owner"
                            value={
                                getUserDisplayName(
                                    owner,
                                    "Not assigned"
                                )
                            }
                        />

                        <PreviewInfo
                            label="Pass Mark"
                            value={`${programme.passMark ?? 0}%`}
                        />

                        <PreviewInfo
                            label="Created"
                            value={
                                formatTrainingDateTime(
                                    programme.createdAt
                                )
                            }
                        />

                        <PreviewInfo
                            label="Last Updated"
                            value={
                                formatTrainingDateTime(
                                    programme.updatedAt
                                )
                            }
                        />
                    </div>

                    <section className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-[10px] font-bold text-[#172033]">
                                    Authorised Trainers
                                </h3>

                                <p className="mt-1 text-[8px] text-[#64748b]">
                                    Additional Trainers explicitly authorised to manage this programme.
                                </p>
                            </div>

                            <span className="rounded-full bg-white px-2.5 py-1 text-[7px] font-semibold text-[#64748b]">
                                {authorisedTrainers.length}
                            </span>
                        </div>

                        {authorisedTrainers.length === 0 ? (
                            <p className="mt-3 text-[8px] text-[#94a3b8]">
                                No additional Trainers are authorised. The programme is managed by its owner and Administrators.
                            </p>
                        ) : (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {authorisedTrainers.map(
                                    (trainer) => (
                                        <span
                                            key={
                                                trainer?._id ||
                                                String(
                                                    trainer
                                                )
                                            }
                                            className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[8px] font-semibold text-blue-700"
                                        >
                                            {getUserDisplayName(
                                                trainer,
                                                "Trainer"
                                            )}
                                        </span>
                                    )
                                )}
                            </div>
                        )}
                    </section>
                </div>

                <footer className="flex flex-col-reverse gap-2 border-t border-[#e8eef5] bg-[#fbfdff] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-[38px] rounded-lg border border-[#cbd5e1] bg-white px-5 text-[9px] font-semibold text-[#52627a] transition hover:bg-[#f8fafc]"
                    >
                        Close
                    </button>

                    {onManageSections && (
                        <button
                            type="button"
                            onClick={() =>
                                onManageSections(
                                    programme
                                )
                            }
                            className="min-h-[38px] rounded-lg bg-[#1769e8] px-5 text-[9px] font-semibold text-white transition hover:bg-[#0b5ed7]"
                        >
                            Open Learning Sections
                        </button>
                    )}
                </footer>
            </section>
        </div>
    );
}


function PreviewInfo({
    label,
    value,
}) {
    return (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5">
            <p className="text-[7px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                {label}
            </p>

            <p className="mt-2 break-words text-[9px] font-bold text-[#334155]">
                {value || "—"}
            </p>
        </div>
    );
}


export default TrainingProgrammePreviewModal;