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


    const variants = {
        danger: {
            icon:
                "bg-red-50 text-red-600",

            button:
                "bg-red-600 hover:bg-red-700",

            symbol:
                "!",
        },

        warning: {
            icon:
                "bg-amber-50 text-amber-600",

            button:
                "bg-amber-500 hover:bg-amber-600",

            symbol:
                "!",
        },

        success: {
            icon:
                "bg-emerald-50 text-emerald-600",

            button:
                "bg-emerald-600 hover:bg-emerald-700",

            symbol:
                "✓",
        },

        primary: {
            icon:
                "bg-blue-50 text-blue-600",

            button:
                "bg-blue-600 hover:bg-blue-700",

            symbol:
                "?",
        },
    };


    const current =
        variants[
        variant
        ] ||
        variants.primary;


    return (
        <div
            className="
                fixed
                inset-0
                z-[110]
                flex
                items-center
                justify-center
                bg-slate-950/45
                p-4
            "
            onMouseDown={(
                event
            ) => {
                if (
                    event.target ===
                    event.currentTarget &&
                    !loading
                ) {
                    onCancel?.();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                className="
                    w-full
                    max-w-[420px]
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-xl
                "
            >
                <div
                    className="
                        p-5
                        sm:p-6
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
                            className={`
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                text-[12px]
                                font-bold
                                ${current.icon}
                            `}
                        >
                            {current.symbol}
                        </div>


                        <div
                            className="
                                min-w-0
                                flex-1
                            "
                        >
                            <h2
                                id="confirm-dialog-title"
                                className="
                                    text-[13px]
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                {title}
                            </h2>


                            {message && (
                                <p
                                    className="
                                        mt-2
                                        text-[9px]
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    {message}
                                </p>
                            )}
                        </div>
                    </div>


                    <div
                        className="
                            mt-6
                            flex
                            flex-col-reverse
                            gap-2
                            sm:flex-row
                            sm:justify-end
                        "
                    >
                        <button
                            type="button"
                            disabled={
                                loading
                            }
                            onClick={
                                onCancel
                            }
                            className="
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                py-2.5
                                text-[9px]
                                font-medium
                                text-slate-600
                                hover:bg-slate-50
                                disabled:opacity-50
                            "
                        >
                            {cancelText}
                        </button>


                        <button
                            type="button"
                            disabled={
                                loading
                            }
                            onClick={
                                onConfirm
                            }
                            className={`
                                rounded-lg
                                px-4
                                py-2.5
                                text-[9px]
                                font-medium
                                text-white
                                disabled:opacity-50
                                ${current.button}
                            `}
                        >
                            {loading
                                ? "Processing..."
                                : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ConfirmDialog;