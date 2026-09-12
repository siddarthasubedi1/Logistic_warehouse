function StatusBadge({
    status = "",
}) {
    const normalizedStatus =
        String(status)
            .trim()
            .toLowerCase();


    const styles = {
        active:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        inactive:
            "border-red-200 bg-red-50 text-red-700",

        deactivated:
            "border-red-200 bg-red-50 text-red-700",

        draft:
            "border-amber-200 bg-amber-50 text-amber-700",

        pending:
            "border-amber-200 bg-amber-50 text-amber-700",

        created:
            "border-blue-200 bg-blue-50 text-blue-700",

        completed:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        complete:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        passed:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        pass:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        failed:
            "border-red-200 bg-red-50 text-red-700",

        fail:
            "border-red-200 bg-red-50 text-red-700",

        assigned:
            "border-blue-200 bg-blue-50 text-blue-700",

        trainer:
            "border-violet-200 bg-violet-50 text-violet-700",

        trainee:
            "border-blue-200 bg-blue-50 text-blue-700",

        admin:
            "border-indigo-200 bg-indigo-50 text-indigo-700",

        administrator:
            "border-indigo-200 bg-indigo-50 text-indigo-700",

        success:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        failure:
            "border-red-200 bg-red-50 text-red-700",

        warning:
            "border-amber-200 bg-amber-50 text-amber-700",
    };


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

        complete:
            "bg-emerald-500",

        passed:
            "bg-emerald-500",

        pass:
            "bg-emerald-500",

        failed:
            "bg-red-500",

        fail:
            "bg-red-500",

        assigned:
            "bg-blue-500",

        trainer:
            "bg-violet-500",

        trainee:
            "bg-blue-500",

        admin:
            "bg-indigo-500",

        administrator:
            "bg-indigo-500",

        success:
            "bg-emerald-500",

        failure:
            "bg-red-500",

        warning:
            "bg-amber-500",
    };


    const badgeStyle =
        styles[normalizedStatus] ||
        "border-slate-200 bg-slate-100 text-slate-700";


    const dotStyle =
        dotStyles[normalizedStatus] ||
        "bg-slate-500";


    const label =
        normalizedStatus
            ? normalizedStatus
                .replace(
                    /[-_]+/g,
                    " "
                )
                .replace(
                    /\b\w/g,
                    (character) =>
                        character.toUpperCase()
                )
            : "Unknown";


    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                whitespace-nowrap
                rounded-full
                border
                px-2.5
                py-1
                text-[7px]
                font-semibold

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