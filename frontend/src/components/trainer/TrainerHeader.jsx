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
                min-h-[86px]
                flex-col
                gap-4
                border-b
                border-[#dbe4ef]
                bg-white
                px-4
                py-4
                sm:px-5
                md:flex-row
                md:items-center
                md:justify-between
                lg:px-7
            "
        >
            <div>
                <h1
                    className="
                        m-0
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
                        m-0
                        mt-1
                        text-[10px]
                        text-slate-500
                    "
                >
                    Welcome back,{" "}

                    <span
                        className="
                            font-semibold
                            text-blue-600
                        "
                    >
                        {name}!
                    </span>
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