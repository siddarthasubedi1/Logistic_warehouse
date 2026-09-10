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
    // VARIANTS
    // ======================================================

    const variants = {
        primary: `
            border-blue-600
            bg-blue-600
            text-white
            shadow-sm
            hover:border-blue-700
            hover:bg-blue-700
            hover:shadow-md
        `,

        secondary: `
            border-slate-300
            bg-white
            text-slate-700
            shadow-sm
            hover:border-slate-400
            hover:bg-slate-50
        `,

        success: `
            border-emerald-600
            bg-emerald-600
            text-white
            shadow-sm
            hover:border-emerald-700
            hover:bg-emerald-700
            hover:shadow-md
        `,

        danger: `
            border-red-600
            bg-red-600
            text-white
            shadow-sm
            hover:border-red-700
            hover:bg-red-700
            hover:shadow-md
        `,

        warning: `
            border-amber-500
            bg-amber-500
            text-white
            shadow-sm
            hover:border-amber-600
            hover:bg-amber-600
            hover:shadow-md
        `,

        ghost: `
            border-transparent
            bg-transparent
            text-slate-600
            hover:bg-slate-100
            hover:text-slate-800
        `,

        light: `
            border-white/25
            bg-white
            text-blue-700
            shadow-sm
            hover:bg-blue-50
            hover:text-blue-800
        `,

        dark: `
            border-slate-700
            bg-slate-800
            text-white
            shadow-sm
            hover:bg-slate-900
        `,
    };


    const variantClass =
        variants[
        variant
        ] ||
        variants.primary;


    // ======================================================
    // UI
    // ======================================================

    return (
        <button
            type={
                type
            }
            title={
                title
            }
            onClick={
                onClick
            }
            disabled={
                disabled
            }
            className={`
                inline-flex
                min-h-[38px]
                items-center
                gap-2
                rounded-xl
                border
                px-4
                py-2.5
                text-[11px]
                font-semibold
                leading-none
                transition-all
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-blue-200
                focus:ring-offset-1
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:shadow-none
                disabled:hover:translate-y-0

                ${variantClass}

                ${className}
            `}
        >
            {children}
        </button>
    );
}


export default ActionButton;