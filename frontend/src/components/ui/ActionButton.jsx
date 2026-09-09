function ActionButton({
    children,
    type = "button",
    variant = "primary",
    onClick,
    disabled = false,
    className = "",
    title,
}) {
    const variants = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-700 border-blue-600",

        secondary:
            "bg-white text-slate-700 hover:bg-slate-50 border-slate-300",

        success:
            "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600",

        danger:
            "bg-red-600 text-white hover:bg-red-700 border-red-600",

        warning:
            "bg-amber-500 text-white hover:bg-amber-600 border-amber-500",

        ghost:
            "bg-transparent text-slate-600 hover:bg-slate-100 border-transparent",
    };


    const variantClass =
        variants[variant] ||
        variants.primary;


    return (
        <button
            type={type}
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                px-4
                py-2.5
                text-xs
                font-semibold
                transition
                focus:outline-none
                focus:ring-2
                focus:ring-blue-200
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${variantClass}
                ${className}
            `}
        >
            {children}
        </button>
    );
}


export default ActionButton;