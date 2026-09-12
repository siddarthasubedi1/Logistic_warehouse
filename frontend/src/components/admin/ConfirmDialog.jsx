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
    if (
        !open
    ) {
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

        info: {
            icon:
                "bg-blue-50 text-blue-600",

            button:
                "bg-blue-600 hover:bg-blue-700",

            symbol:
                "i",
        },
    };


    const current =
        variants[
        variant
        ] ||
        variants.danger;


    return (
        <div
            className="
                fixed
                inset-0
                z-[250]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-slate-950/55
                p-4
                backdrop-blur-[1px]
            "
        >
            <section
                role="dialog"
                aria-modal="true"
                className="
                    w-full
                    max-w-[420px]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
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
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                text-[15px]
                                font-bold

                                ${current.icon}
                            `}
                        >
                            {
                                current.symbol
                            }
                        </div>


                        <div
                            className="
                                min-w-0
                                flex-1
                            "
                        >
                            <h2
                                className="
                                    text-[13px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                {title}
                            </h2>


                            {message && (
                                <p
                                    className="
                                        mt-2
                                        text-[9px]
                                        font-medium
                                        leading-5
                                        text-slate-600
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
                            onClick={
                                onCancel
                            }
                            disabled={
                                loading
                            }
                            className="
                                min-h-[38px]
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                text-[9px]
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-50
                                disabled:opacity-50
                            "
                        >
                            {cancelText}
                        </button>


                        <button
                            type="button"
                            onClick={
                                onConfirm
                            }
                            disabled={
                                loading
                            }
                            className={`
                                min-h-[38px]
                                rounded-lg
                                px-4
                                text-[9px]
                                font-semibold
                                text-white
                                transition
                                disabled:cursor-not-allowed
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
            </section>
        </div>
    );
}


export default ConfirmDialog;