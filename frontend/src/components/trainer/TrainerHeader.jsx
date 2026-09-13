import ProfileHeaderButton from "../account/ProfileHeaderButton";


function TrainerHeader({ user }) {
    const name =
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
        user?.username ||
        "Trainer";

    return (
        <header className="flex min-h-[72px] items-center justify-between gap-4 border-b border-[#dbe4ef] bg-white px-5 py-3 lg:px-7">

            <div className="min-w-0">

                <h1 className="text-[20px] font-bold tracking-[-0.02em] text-[#172033]">
                    Trainer Dashboard
                </h1>

                <p className="mt-1 text-[9px] text-[#64748b]">
                    Welcome back,{" "}
                    <span className="font-semibold text-[#1769e8]">
                        {name}!
                    </span>
                </p>

            </div>


            <div className="flex items-center gap-3">

                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe4ef] bg-white text-[#52627a]"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                    >
                        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                        <path d="M10 21h4" />
                    </svg>
                </button>


                <div className="h-8 w-px bg-[#e2e8f0]" />


                <ProfileHeaderButton
                    user={user}
                    role="trainer"
                />

            </div>

        </header>
    );
}


export default TrainerHeader;