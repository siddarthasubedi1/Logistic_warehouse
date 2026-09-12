function TrainingPageIntro({
    title,
    description = "",
    action = null,
}) {
    return (
        <div
            className="
                flex
                w-full
                min-w-0
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >
            <div
                className="
                    min-w-0
                    max-w-3xl
                "
            >
                <h1
                    className="
                        break-words
                        text-[16px]
                        font-semibold
                        text-slate-800
                        sm:text-[18px]
                    "
                >
                    {title}
                </h1>

                {description && (
                    <p
                        className="
                            mt-1
                            max-w-2xl
                            text-[9px]
                            leading-5
                            text-slate-400
                        "
                    >
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <div
                    className="
                        w-full
                        shrink-0
                        sm:w-auto
                    "
                >
                    {action}
                </div>
            )}
        </div>
    );
}


export default TrainingPageIntro;