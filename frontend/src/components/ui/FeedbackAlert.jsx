function FeedbackAlert({
    type = "error",
    message = "",
    onClose,
}) {
    if (!message) {
        return null;
    }


    const alertStyles = {
        success:
            "border-emerald-200 bg-emerald-50 text-emerald-800",

        error:
            "border-red-200 bg-red-50 text-red-800",

        warning:
            "border-amber-200 bg-amber-50 text-amber-800",

        info:
            "border-blue-200 bg-blue-50 text-blue-800",
    };


    const icons = {
        success: "✓",
        error: "!",
        warning: "!",
        info: "i",
    };


    const style =
        alertStyles[type] ||
        alertStyles.info;


    return (
        <div
            role="alert"
            className={`
                flex
                items-start
                justify-between
                gap-4
                rounded-xl
                border
                px-4
                py-3
                ${style}
            `}
        >
            <div className="flex items-start gap-3">
                <span
                    className="
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-current
                        text-[10px]
                        font-bold
                    "
                >
                    {icons[type] || "i"}
                </span>


                <p className="text-xs font-medium leading-5">
                    {message}
                </p>
            </div>


            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close message"
                    className="
                        shrink-0
                        text-lg
                        leading-none
                        opacity-60
                        transition
                        hover:opacity-100
                    "
                >
                    ×
                </button>
            )}
        </div>
    );
}


export default FeedbackAlert;