function StatusBadge({
    status = "",
}) {
    const normalizedStatus =
        String(status)
            .trim()
            .toLowerCase();


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
    };


    const badgeStyle =
        styles[normalizedStatus] ||
        "bg-slate-100 text-slate-600 ring-slate-200";


    const label =
        normalizedStatus
            ? normalizedStatus
                .replace(/-/g, " ")
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
                whitespace-nowrap
                rounded-full
                px-2.5
                py-1
                text-[10px]
                font-semibold
                ring-1
                ring-inset
                ${badgeStyle}
            `}
        >
            {label}
        </span>
    );
}


export default StatusBadge;