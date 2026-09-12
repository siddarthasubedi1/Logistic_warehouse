import ProfileHeaderButton from "../account/ProfileHeaderButton";


function TraineeHeader({
    user,
}) {
    const name =
        `${user?.firstName || ""} ${user?.lastName || ""}`
            .trim() ||
        user?.username ||
        "Trainee";


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
                    Welcome back, {name}!
                </h1>


                <p
                    className="
                        mt-1
                        text-[9px]
                        font-medium
                        text-slate-600
                    "
                >
                    Continue your safety training journey.
                </p>
            </div>


            <ProfileHeaderButton
                user={
                    user
                }
                role="trainee"
            />
        </header>
    );
}


export default TraineeHeader;