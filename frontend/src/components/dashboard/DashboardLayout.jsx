import Sidebar from "./Sidebar";


function DashboardLayout({
    children,
    role,
    showHeader = true,
    title = "",
    subtitle = "",
    user = null,
}) {

    // ======================================================
    // USER INFORMATION
    // ======================================================

    const firstName =
        user?.firstName ||
        "";


    const lastName =
        user?.lastName ||
        "";


    const fullName =
        `${firstName} ${lastName}`
            .trim();


    const initial =
        firstName
            ? firstName
                .charAt(0)
                .toUpperCase()
            : role
                ?.charAt(0)
                ?.toUpperCase() ||
            "U";


    // ======================================================
    // UI
    // ======================================================

    return (
        <div
            className="
                min-h-screen
                bg-[#f7f9fc]
            "
        >

            <div
                className="
                    flex
                    min-h-screen
                    items-stretch
                "
            >

                {/* ================================================= */}
                {/* SIDEBAR */}
                {/* ================================================= */}
                {/*
                    IMPORTANT:

                    This wrapper receives the same height as the
                    entire page content.

                    Therefore, when the page becomes taller than
                    the browser viewport, the dark sidebar
                    background continues all the way to the bottom.

                    This fixes the white space that appeared below
                    the sidebar on long pages.
                */}

                <div
                    className="
                        hidden
                        w-[190px]
                        shrink-0
                        self-stretch
                        bg-[#073763]
                        lg:block
                    "
                >
                    <Sidebar
                        role={
                            role
                        }
                    />
                </div>


                {/* ================================================= */}
                {/* MAIN AREA */}
                {/* ================================================= */}

                <main
                    className="
                        min-w-0
                        flex-1
                        bg-[#f7f9fc]
                    "
                >

                    {/* ================================================= */}
                    {/* OPTIONAL PAGE HEADER */}
                    {/* ================================================= */}

                    {showHeader && (
                        <header
                            className="
                                border-b
                                border-slate-200
                                bg-white
                                px-5
                                py-4
                                lg:px-7
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                {/* ================================= */}
                                {/* LEFT SIDE */}
                                {/* ================================= */}

                                <div>

                                    {title && (
                                        <h1
                                            className="
                                                text-xl
                                                font-bold
                                                text-[#172033]
                                            "
                                        >
                                            {title}
                                        </h1>
                                    )}


                                    {subtitle && (
                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-slate-500
                                            "
                                        >
                                            {subtitle}
                                        </p>
                                    )}

                                </div>


                                {/* ================================= */}
                                {/* USER INFORMATION */}
                                {/* ================================= */}

                                {user && (
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        {/* AVATAR */}

                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-blue-100
                                                text-sm
                                                font-bold
                                                text-blue-700
                                            "
                                        >
                                            {initial}
                                        </div>


                                        {/* NAME + ROLE */}

                                        <div
                                            className="
                                                hidden
                                                sm:block
                                            "
                                        >

                                            <p
                                                className="
                                                    text-xs
                                                    font-semibold
                                                    text-slate-800
                                                "
                                            >
                                                {fullName ||
                                                    "User"}
                                            </p>


                                            <p
                                                className="
                                                    mt-[2px]
                                                    text-[10px]
                                                    capitalize
                                                    text-slate-500
                                                "
                                            >
                                                {role}
                                            </p>

                                        </div>

                                    </div>
                                )}

                            </div>

                        </header>
                    )}


                    {/* ================================================= */}
                    {/* PAGE CONTENT */}
                    {/* ================================================= */}

                    <div
                        className="
                            min-w-0
                            bg-[#f7f9fc]
                        "
                    >
                        {children}
                    </div>

                </main>

            </div>

        </div>
    );
}


export default DashboardLayout;