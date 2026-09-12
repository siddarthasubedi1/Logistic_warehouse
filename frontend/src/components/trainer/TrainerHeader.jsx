import ProfileHeaderButton from "../account/ProfileHeaderButton";


function TrainerHeader({
    user,
}) {
    const name =
        `${user?.firstName || ""} ${user?.lastName || ""}`
            .trim() ||
        user?.username ||
        "Trainer";


    return (
        <header
            className="
                flex
                flex-col
                gap-4
                border
                border-slate-200
                bg-white
                px-4
                py-4
                sm:px-5
                md:flex-row
                md:items-center
                md:justify-between
                lg:px-6
            "
        >
            <div>
                <h1
                    className="
                        text-[20px]
                        font-bold
                        text-[#172033]
                        sm:text-[22px]
                    "
                >
                    Trainer Dashboard
                </h1>


                <p
                    className="
                        mt-1
                        text-[9px]
                        font-medium
                        text-slate-600
                    "
                >
                    Welcome back,{" "}

                    <span
                        className="
                            font-semibold
                            text-blue-600
                        "
                    >
                        {name}
                    </span>
                    !
                </p>
            </div>


            <ProfileHeaderButton
                user={
                    user
                }
                role="trainer"
            />
        </header>
    );
}


export default TrainerHeader;