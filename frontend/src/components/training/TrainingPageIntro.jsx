function TrainingPageIntro({
    title,
    description = "",
    action = null,
}) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            {/* ================================================= */}
            {/* PAGE TITLE */}
            {/* ================================================= */}

            <div className="max-w-3xl">

                <h1 className="text-2xl font-bold text-slate-900">
                    {title}
                </h1>


                {description && (
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        {description}
                    </p>
                )}

            </div>


            {/* ================================================= */}
            {/* OPTIONAL ACTION */}
            {/* ================================================= */}

            {action && (
                <div className="shrink-0">
                    {action}
                </div>
            )}

        </div>
    );
}


export default TrainingPageIntro;