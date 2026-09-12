function LoadingCard({
    message = "Loading...",
}) {
    return (
        <div
            className="
                flex
                min-h-[180px]
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                py-8
                shadow-sm
            "
        >
            <div className="text-center">

                {/* SPINNER */}

                <div
                    className="
                        mx-auto
                        h-7
                        w-7
                        animate-spin
                        rounded-full
                        border-[3px]
                        border-slate-200
                        border-t-[#0b4f87]
                    "
                />


                {/* MESSAGE */}

                <p
                    className="
                        mt-4
                        text-[9px]
                        font-medium
                        text-slate-600
                    "
                >
                    {message}
                </p>

            </div>
        </div>
    );
}


export default LoadingCard;