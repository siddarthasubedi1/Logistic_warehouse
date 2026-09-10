function LoadingCard({
    message = "Loading...",
}) {
    return (
        <div
            className="
                relative
                flex
                min-h-[220px]
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >

            {/* DECORATION */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-44
                    w-44
                    rounded-full
                    bg-blue-50
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-16
                    -left-16
                    h-44
                    w-44
                    rounded-full
                    bg-emerald-50
                "
            />


            <div
                className="
                    relative
                    z-10
                    max-w-sm
                    text-center
                "
            >

                {/* SPINNER WRAPPER */}

                <div
                    className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-blue-50
                        shadow-sm
                    "
                >

                    <div
                        className="
                            h-7
                            w-7
                            animate-spin
                            rounded-full
                            border-[3px]
                            border-blue-100
                            border-t-blue-600
                        "
                    />

                </div>


                {/* TITLE */}

                <p
                    className="
                        mt-4
                        text-[11px]
                        font-bold
                        text-slate-800
                    "
                >
                    Please wait
                </p>


                {/* MESSAGE */}

                <p
                    className="
                        mt-1
                        text-[10px]
                        leading-5
                        text-slate-500
                    "
                >
                    {message}
                </p>


                {/* SMALL LOADING DOTS */}

                <div
                    className="
                        mt-4
                        flex
                        items-center
                        justify-center
                        gap-1.5
                    "
                >

                    <span
                        className="
                            h-1.5
                            w-1.5
                            animate-pulse
                            rounded-full
                            bg-blue-500
                        "
                    />


                    <span
                        className="
                            h-1.5
                            w-1.5
                            animate-pulse
                            rounded-full
                            bg-blue-400
                            [animation-delay:150ms]
                        "
                    />


                    <span
                        className="
                            h-1.5
                            w-1.5
                            animate-pulse
                            rounded-full
                            bg-blue-300
                            [animation-delay:300ms]
                        "
                    />

                </div>

            </div>

        </div>
    );
}


export default LoadingCard;