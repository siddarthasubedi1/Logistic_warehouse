function ActionButton({
    children,
    type = "button",
    variant = "primary",
    onClick,
    disabled = false,
    className = "",
    title,
}) {
    // ======================================================
    // BUTTON VARIANTS
    // ======================================================

    const variants = {
        primary: `
            border-blue-600
            bg-blue-600
            text-white
            hover:border-blue-700
            hover:bg-blue-700
        `,

        secondary: `
            border-slate-300
            bg-white
            text-slate-600
            hover:border-slate-400
            hover:bg-slate-50
        `,

        success: `
            border-emerald-600
            bg-emerald-600
            text-white
            hover:border-emerald-700
            hover:bg-emerald-700
        `,

        danger: `
            border-red-600
            bg-red-600
            text-white
            hover:border-red-700
            hover:bg-red-700
        `,

        warning: `
            border-amber-500
            bg-amber-500
            text-white
            hover:border-amber-600
            hover:bg-amber-600
        `,

        ghost: `
            border-transparent
            bg-transparent
            text-slate-600
            hover:bg-slate-100
            hover:text-slate-800
        `,

        light: `
            border-slate-200
            bg-white
            text-blue-600
            hover:bg-blue-50
        `,

        dark: `
            border-[#0a4371]
            bg-[#0a4371]
            text-white
            hover:bg-[#08375e]
        `,
    };


    const variantClass =
        variants[variant] ||
        variants.primary;


    // ======================================================
    // UI
    // ======================================================

    return (
        <button
            type={type}
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex
                min-h-[36px]
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                px-4
                py-2
                text-[9px]
                font-medium
                leading-none
                transition
                duration-150
                focus:outline-none
                focus:ring-2
                focus:ring-blue-100
                focus:ring-offset-1
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