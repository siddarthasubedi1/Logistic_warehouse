import ProfileHeaderButton from "../account/ProfileHeaderButton";


function TraineeHeader({
    user,
}) {
    const firstName =
        user?.firstName ||
        "Trainee";


    return (
        <header className="border-b border-slate-200 bg-white px-6 py-4 xl:px-7">

            <div className="flex items-center justify-between">

                {/* LEFT */}

                <div>

                    <h1 className="text-[20px] font-bold text-[#172033]">
                        Trainee Dashboard
                    </h1>

                    <p className="mt-1 text-[11px] text-slate-500">
                        Welcome back,{" "}
                        <span className="font-semibold text-blue-600">
                            {firstName}!
                        </span>
                    </p>

                </div>


                {/* RIGHT */}

                <div className="flex items-center gap-3">

                    {/* NOTIFICATION */}

                    <button
                        type="button"
                        className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            className="h-5 w-5"
                        >
                            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

                            <path d="M10 21h4" />
                        </svg>

                    </button>


                    <div className="h-8 w-px bg-slate-200" />


                    {/* CLICKABLE PROFILE */}

                    <ProfileHeaderButton
                        user={user}
                        role="trainee"
                    />

                </div>

            </div>

        </header>
    );
}


export default TraineeHeader;