function StatusBadge({
    status = "",
}) {

    // ======================================================
    // NORMALIZE STATUS
    // ======================================================

    const normalizedStatus =
        String(
            status
        )
            .trim()
            .toLowerCase();


    // ======================================================
    // STYLES
    // ======================================================

    const styles = {
        active:
            "bg-emerald-50 text-emerald-700 ring-emerald-200",

        inactive:
            "bg-red-50 text-red-700 ring-red-200",

        deactivated:
            "bg-red-50 text-red-700 ring-red-200",

        draft:
            "bg-amber-50 text-amber-700 ring-amber-200",

        pending:
            "bg-amber-50 text-amber-700 ring-amber-200",

        created:
            "bg-blue-50 text-blue-700 ring-blue-200",

        completed:
            "bg-emerald-50 text-emerald-700 ring-emerald-200",

        passed:
            "bg-emerald-50 text-emerald-700 ring-emerald-200",

        failed:
            "bg-red-50 text-red-700 ring-red-200",

        assigned:
            "bg-blue-50 text-blue-700 ring-blue-200",

        trainer:
            "bg-indigo-50 text-indigo-700 ring-indigo-200",

        trainee:
            "bg-blue-50 text-blue-700 ring-blue-200",

        admin:
            "bg-violet-50 text-violet-700 ring-violet-200",

        administrator:
            "bg-violet-50 text-violet-700 ring-violet-200",

        success:
            "bg-emerald-50 text-emerald-700 ring-emerald-200",

        failure:
            "bg-red-50 text-red-700 ring-red-200",

        warning:
            "bg-amber-50 text-amber-700 ring-amber-200",
    };


    // ======================================================
    // DOT STYLE
    // ======================================================

    const dotStyles = {
        active:
            "bg-emerald-500",

        inactive:
            "bg-red-500",

        deactivated:
            "bg-red-500",

        draft:
            "bg-amber-500",

        pending:
            "bg-amber-500",

        created:
            "bg-blue-500",

        completed:
            "bg-emerald-500",

        passed:
            "bg-emerald-500",

        failed:
            "bg-red-500",

        assigned:
            "bg-blue-500",

        trainer:
            "bg-indigo-500",

        trainee:
            "bg-blue-500",

        admin:
            "bg-violet-500",

        administrator:
            "bg-violet-500",

        success:
            "bg-emerald-500",

        failure:
            "bg-red-500",

        warning:
            "bg-amber-500",
    };


    const badgeStyle =
        styles[
        normalizedStatus
        ] ||
        "bg-slate-100 text-slate-600 ring-slate-200";


    const dotStyle =
        dotStyles[
        normalizedStatus
        ] ||
        "bg-slate-400";


    // ======================================================
    // LABEL
    // ======================================================

    const label =
        normalizedStatus
            ? normalizedStatus
                .replace(
                    /-/g,
                    " "
                )
                .replace(
                    /\b\w/g,
                    (
                        character
                    ) =>
                        character.toUpperCase()
                )
            : "Unknown";


    // ======================================================
    // UI
    // ======================================================

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                whitespace-nowrap
                rounded-full
                px-2.5
                py-1
                text-[9px]
                font-semibold
                ring-1
                ring-inset

                ${badgeStyle}
            `}
        >

            <span
                className={`
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full

                    ${dotStyle}
                `}
            />


            <span>
                {label}
            </span>

        </span>
    );
}


export default StatusBadge;