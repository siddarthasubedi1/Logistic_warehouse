import Sidebar from "./Sidebar";

function DashboardLayout({
    children,
    role,
    showHeader = true,
    title = "",
    subtitle = "",
    user = null,
}) {
    const firstName =
        user?.firstName || "";

    const lastName =
        user?.lastName || "";

    const fullName =
        `${firstName} ${lastName}`.trim();

    const initial =
        firstName
            ? firstName.charAt(0).toUpperCase()
            : role?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="min-h-screen bg-[#f7f9fc]">

            <div className="flex min-h-screen">

                {/* =====================================
                    SIDEBAR
                ====================================== */}

                <div className="hidden shrink-0 lg:block">
                    <Sidebar role={role} />
                </div>


                {/* =====================================
                    MAIN AREA
                ====================================== */}

                <div className="min-w-0 flex-1">

                    {/* =================================
                        OPTIONAL SHARED HEADER

                        Trainer/Admin dashboards use
                        their own headers, so they pass:
                        showHeader={false}

                        This remains available so your
                        existing Trainee page is not
                        broken.
                    ================================== */}

                    {showHeader && (
                        <header className="border-b border-slate-200 bg-white px-5 py-4 lg:px-7">

                            <div className="flex flex-wrap items-center justify-between gap-4">

                                {/* LEFT */}

                                <div>

                                    {title && (
                                        <h1 className="text-xl font-bold text-[#172033]">
                                            {title}
                                        </h1>
                                    )}


                                    {subtitle && (
                                        <p className="mt-1 text-xs text-slate-500">
                                            {subtitle}
                                        </p>
                                    )}

                                </div>


                                {/* USER */}

                                {user && (
                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                            {initial}
                                        </div>


                                        <div className="hidden sm:block">

                                            <p className="text-xs font-semibold text-slate-800">
                                                {fullName || "User"}
                                            </p>


                                            <p className="mt-[2px] text-[10px] capitalize text-slate-500">
                                                {role}
                                            </p>

                                        </div>

                                    </div>
                                )}

                            </div>

                        </header>
                    )}


                    {/* =================================
                        PAGE CONTENT
                    ================================== */}

                    <div className="min-w-0">
                        {children}
                    </div>

                </div>

            </div>

        </div>
    );
}

export default DashboardLayout;