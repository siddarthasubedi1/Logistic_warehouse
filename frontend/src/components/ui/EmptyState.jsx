function EmptyState({
    title = "No data found.",
    description = "",
    action = null,
}) {
    return (
        <div
            className="
                flex
                min-h-[180px]
                items-center
                justify-center
                p-6
                text-center
            "
        >
            <div className="max-w-md">
                {/* Empty icon */}
                <div
                    className="
                        mx-auto
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-100
                        text-xl
                        text-slate-400
                    "
                >
                    —
                </div>


                <h3 className="mt-4 text-sm font-bold text-slate-800">
                    {title}
                </h3>


                {description && (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                        {description}
                    </p>
                )}


                {action && (
                    <div className="mt-5 flex justify-center">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}


export default EmptyState;