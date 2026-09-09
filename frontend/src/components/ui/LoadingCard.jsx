function LoadingCard({
    message = "Loading...",
}) {
    return (
        <div
            className="
                flex
                min-h-[180px]
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >
            <div className="text-center">
                {/* Spinner */}
                <div
                    className="
                        mx-auto
                        h-8
                        w-8
                        animate-spin
                        rounded-full
                        border-4
                        border-slate-200
                        border-t-blue-600
                    "
                />


                <p className="mt-4 text-xs font-medium text-slate-500">
                    {message}
                </p>
            </div>
        </div>
    );
}


export default LoadingCard;