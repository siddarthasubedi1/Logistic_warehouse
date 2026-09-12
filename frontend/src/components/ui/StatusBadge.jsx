function StatusBadge({
    status = "",
}) {
    // ======================================================
    // NORMALIZE
    // ======================================================

    const normalizedStatus =
        String(
            status
        )
            .trim()
            .toLowerCase();


    // ======================================================
    // BADGE STYLES
    // ======================================================

    const styles = {
        active:
            "bg-emerald-50 text-emerald-600",

        inactive:
            "bg-red-50 text-red-600",

        deactivated:
            "bg-red-50 text-red-600",

        draft:
            "bg-amber-50 text-amber-600",

        pending:
            "bg-amber-50 text-amber-600",

        created:
            "bg-blue-50 text-blue-600",

        completed:
            "bg-emerald-50 text-emerald-600",

        passed:
            "bg-emerald-50 text-emerald-600",

        failed:
            "bg-red-50 text-red-600",

        assigned:
            "bg-blue-50 text-blue-600",

        trainer:
            "bg-purple-50 text-purple-600",

        trainee:
            "bg-blue-50 text-blue-600",

        admin:
            "bg-violet-50 text-violet-600",

        administrator:
            "bg-violet-50 text-violet-600",

        success:
            "bg-emerald-50 text-emerald-600",

        failure:
            "bg-red-50 text-red-600",

        warning:
            "bg-amber-50 text-amber-600",
    };


    // ======================================================
    // DOT
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
            "bg-purple-500",

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
        "bg-slate-100 text-slate-500";


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
                text-[7px]
                font-medium

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