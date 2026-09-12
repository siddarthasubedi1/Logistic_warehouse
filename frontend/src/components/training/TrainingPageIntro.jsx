function TrainingPageIntro({
    title,
    description = "",
    action = null,
}) {
    return (
        <section
            className="
                flex
                min-h-[78px]
                w-full
                min-w-0
                flex-col
                gap-3
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-4
                shadow-sm
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-5
            "
        >
            <div
                className="
                    min-w-0
                    max-w-3xl
                "
            >
                <p
                    className="
                        text-[7px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-blue-600
                    "
                >
                    Training Management
                </p>


                <h1
                    className="
                        mt-1
                        break-words
                        text-[18px]
                        font-bold
                        text-[#172033]
                        sm:text-[20px]
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
                            font-medium
                            leading-5
                            text-slate-600
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
        </section>
    );
}


export default TrainingPageIntro;