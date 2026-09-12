function AdminHeader({
    user,
}) {
    const firstName =
        user?.firstName ||
        "";


    const lastName =
        user?.lastName ||
        "";


    const name =
        `${firstName} ${lastName}`
            .trim() ||
        user?.username ||
        "System Administrator";


    const initial =
        name
            .charAt(0)
            .toUpperCase();


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
            <div
                className="
                    min-w-0
                "
            >
                <h1
                    className="
                        text-[20px]
                        font-bold
                        text-[#172033]
                        sm:text-[22px]
                    "
                >
                    Admin Dashboard
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


            <div
                className="
                    hidden
                    items-center
                    gap-4
                    md:flex
                "
            >
                <button
                    type="button"
                    aria-label="Notifications"
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-slate-200
                        text-slate-500
                    "
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-4 w-4"
                    >
                        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                        <path d="M10 21h4" />
                    </svg>
                </button>


                <div
                    className="
                        h-8
                        w-px
                        bg-slate-200
                    "
                />


                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-50
                            text-[9px]
                            font-bold
                            text-blue-600
                        "
                    >
                        {initial}
                    </div>


                    <div>
                        <p
                            className="
                                text-[9px]
                                font-semibold
                                text-slate-800
                            "
                        >
                            {name}
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-[7px]
                                text-slate-500
                            "
                        >
                            Administrator
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}


export default AdminHeader;