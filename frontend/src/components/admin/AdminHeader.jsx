function AdminHeader({
    user,
}) {
    const firstName =
        user?.firstName ||
        "Administrator";

    const lastName =
        user?.lastName || "";

    const fullName =
        `${firstName} ${lastName}`.trim();

    const initial =
        firstName
            .charAt(0)
            .toUpperCase();


    return (
        <header className="border-b border-slate-200 bg-white px-5 py-4 lg:px-7">

            <div className="flex flex-wrap items-center justify-between gap-4">

                {/* LEFT */}

                <div>

                    <h1 className="text-xl font-bold text-[#172033]">
                        Admin Dashboard
                    </h1>


                    <p className="mt-1 text-xs text-slate-500">
                        Welcome back,{" "}
                        <span className="font-semibold text-blue-600">
                            {fullName}
                        </span>
                        !
                    </p>

                </div>


                {/* RIGHT */}

                <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">

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

                    </div>


                    <div className="h-9 w-px bg-slate-200" />


                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                            {initial}
                        </div>


                        <div className="hidden sm:block">

                            <p className="text-xs font-semibold text-slate-800">
                                {fullName}
                            </p>

                            <p className="mt-[2px] text-[10px] text-slate-500">
                                Administrator
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
}


export default AdminHeader;