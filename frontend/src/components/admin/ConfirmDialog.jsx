import ActionButton from "../ui/ActionButton";


// ======================================================
// CONFIRM DIALOG
// ======================================================

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


    // ======================================================
    // DIALOG STYLE
    // ======================================================

    const config = {
        danger: {
            iconBackground:
                "bg-red-50",

            iconColor:
                "text-red-600",

            border:
                "border-red-100",

            label:
                "Important Action",
        },

        warning: {
            iconBackground:
                "bg-amber-50",

            iconColor:
                "text-amber-600",

            border:
                "border-amber-100",

            label:
                "Confirmation Required",
        },

        success: {
            iconBackground:
                "bg-emerald-50",

            iconColor:
                "text-emerald-600",

            border:
                "border-emerald-100",

            label:
                "Confirm Action",
        },

        primary: {
            iconBackground:
                "bg-blue-50",

            iconColor:
                "text-blue-600",

            border:
                "border-blue-100",

            label:
                "Confirm Action",
        },
    };


    const current =
        config[variant] ||
        config.primary;


    // ======================================================
    // UI
    // ======================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-slate-950/55
                p-4
                backdrop-blur-[2px]
            "
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                className={`
                    relative
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-white
                    shadow-2xl
                    ${current.border}
                `}
            >

                {/* ============================================== */}
                {/* DECORATION */}
                {/* ============================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-16
                        -top-16
                        h-36
                        w-36
                        rounded-full
                        bg-slate-50
                    "
                />


                {/* ============================================== */}
                {/* CONTENT */}
                {/* ============================================== */}

                <div
                    className="
                        relative
                        z-10
                        p-5
                        sm:p-6
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-4
                        "
                    >

                        {/* ICON */}

                        <div
                            className={`
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                ${current.iconBackground}
                                ${current.iconColor}
                            `}
                        >
                            {variant ===
                                "success" ? (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-5 w-5"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    />

                                    <path d="m8 12 2.5 2.5L16 9" />
                                </svg>
                            ) : (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                >
                                    <path d="M12 3 2.5 20h19L12 3Z" />

                                    <path d="M12 9v5" />

                                    <path d="M12 17h.01" />
                                </svg>
                            )}
                        </div>


                        {/* TEXT */}

                        <div
                            className="
                                min-w-0
                                flex-1
                            "
                        >
                            <p
                                className={`
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-[0.16em]
                                    ${current.iconColor}
                                `}
                            >
                                {current.label}
                            </p>


                            <h2
                                id="confirm-dialog-title"
                                className="
                                    mt-1
                                    break-words
                                    text-base
                                    font-bold
                                    text-slate-900
                                    sm:text-lg
                                "
                            >
                                {title}
                            </h2>


                            {message && (
                                <p
                                    className="
                                        mt-3
                                        text-[10px]
                                        leading-5
                                        text-slate-500
                                        sm:text-xs
                                        sm:leading-6
                                    "
                                >
                                    {message}
                                </p>
                            )}

                        </div>

                    </div>


                    {/* ========================================== */}
                    {/* SAFETY MESSAGE */}
                    {/* ========================================== */}

                    <div
                        className="
                            mt-5
                            rounded-xl
                            border
                            border-slate-100
                            bg-slate-50
                            p-3
                        "
                    >
                        <div
                            className="
                                flex
                                items-start
                                gap-2
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="
                                    mt-0.5
                                    h-4
                                    w-4
                                    shrink-0
                                    text-slate-400
                                "
                            >
                                <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />

                                <path d="M9 12h6" />
                            </svg>


                            <p
                                className="
                                    text-[9px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                Please check the account information
                                before continuing with this
                                administrative action.
                            </p>
                        </div>
                    </div>


                    {/* ========================================== */}
                    {/* ACTIONS */}
                    {/* ========================================== */}

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
                        <ActionButton
                            variant="secondary"
                            disabled={loading}
                            onClick={onCancel}
                            className="
                                w-full
                                justify-center
                                sm:w-auto
                            "
                        >
                            {cancelText}
                        </ActionButton>


                        <ActionButton
                            variant={variant}
                            disabled={loading}
                            onClick={onConfirm}
                            className="
                                w-full
                                justify-center
                                sm:w-auto
                            "
                        >
                            {loading
                                ? "Processing..."
                                : confirmText}
                        </ActionButton>
                    </div>

                </div>

            </div>
        </div>
    );
}


export default ConfirmDialog;