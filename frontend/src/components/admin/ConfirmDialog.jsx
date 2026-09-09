import ActionButton from "../ui/ActionButton";


function ConfirmDialog({
    open = false,
    title = "Confirm Action",
    message = "",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    loading = false,
    onConfirm,
    onCancel,
}) {
    if (!open) {
        return null;
    }


    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-slate-950/50
                p-4
            "
        >
            <div
                role="dialog"
                aria-modal="true"
                className="
                    w-full
                    max-w-md
                    rounded-2xl
                    bg-white
                    p-6
                    shadow-2xl
                "
            >
                <h2 className="text-lg font-bold text-slate-900">
                    {title}
                </h2>


                {message && (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                        {message}
                    </p>
                )}


                <div className="mt-6 flex justify-end gap-3">
                    <ActionButton
                        variant="secondary"
                        disabled={loading}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </ActionButton>


                    <ActionButton
                        variant={variant}
                        disabled={loading}
                        onClick={onConfirm}
                    >
                        {loading
                            ? "Processing..."
                            : confirmText}
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}


export default ConfirmDialog;