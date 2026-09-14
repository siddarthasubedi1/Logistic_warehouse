import LearningContentCard from "./LearningContentCard";
import StatusBadge from "../ui/StatusBadge";


function LearningSectionPreviewModal({
    section,
    programme,
    onClose,
}) {
    if (!section) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="section-preview-title"
        >
            <button
                type="button"
                aria-label="Close learning section preview"
                className="absolute inset-0 cursor-default"
                onClick={onClose}
            />

            <section className="relative z-10 max-h-[92vh] w-full max-w-[820px] overflow-y-auto rounded-2xl border border-[#dbe4ef] bg-[#f8fafc] shadow-2xl">
                <header className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-[#dbe4ef] bg-white px-5 py-4 sm:px-6">
                    <div>
                        <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#1769e8]">
                            Learning Section Preview
                        </p>

                        <h2
                            id="section-preview-title"
                            className="mt-1 text-[14px] font-bold text-[#172033]"
                        >
                            {section.title}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="text-[8px] text-[#64748b]">
                                {programme?.title ||
                                    "Training Programme"}
                            </span>

                            <span className="text-[8px] text-[#cbd5e1]">
                                •
                            </span>

                            <span className="text-[8px] text-[#64748b]">
                                Section {section.order || "—"}
                            </span>

                            <StatusBadge
                                status={
                                    section.status ||
                                    "active"
                                }
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[18px] text-[#52627a] transition hover:bg-slate-200"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </header>

                <div className="p-4 sm:p-6">
                    <LearningContentCard
                        section={section}
                    />
                </div>

                <footer className="sticky bottom-0 flex justify-end border-t border-[#dbe4ef] bg-white px-5 py-4 sm:px-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-[38px] rounded-lg bg-[#1769e8] px-5 text-[9px] font-semibold text-white transition hover:bg-[#0b5ed7]"
                    >
                        Close Preview
                    </button>
                </footer>
            </section>
        </div>
    );
}


export default LearningSectionPreviewModal;