import {
    useEffect,
    useState,
} from "react";

import Sidebar from "./Sidebar";

import {
    getSessionUser,
    getUserInitial,
} from "../../utils/session";


function DashboardLayout({
    children,
    role,
    showHeader = true,
    title = "",
    subtitle = "",
    user = null,
}) {
    const [
        sidebarOpen,
        setSidebarOpen,
    ] = useState(false);

    const sessionUser =
        getSessionUser();

    const currentUser =
        user ||
        sessionUser ||
        null;

    const displayRole =
        String(
            role ||
            currentUser?.role ||
            ""
        )
            .trim()
            .toLowerCase();

    const initial =
        getUserInitial(
            currentUser
        );


    useEffect(() => {
        const handleResize =
            () => {
                if (
                    window.innerWidth >=
                    1024
                ) {
                    setSidebarOpen(
                        false
                    );
                }
            };

        window.addEventListener(
            "resize",
            handleResize
        );

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, []);


    useEffect(() => {
        if (
            sidebarOpen
        ) {
            document.body.style.overflow =
                "hidden";
        } else {
            document.body.style.overflow =
                "";
        }

        return () => {
            document.body.style.overflow =
                "";
        };
    }, [
        sidebarOpen,
    ]);


    return (
        <div
            className="
                min-h-screen
                bg-[#f5f7fb]
                text-[#172033]
            "
        >
            <div
                className="
                    flex
                    min-h-screen
                "
            >
                {/* DESKTOP SIDEBAR */}

                <aside
                    className="
                        hidden
                        w-[194px]
                        shrink-0
                        lg:block
                    "
                >
                    <div
                        className="
                            fixed
                            inset-y-0
                            left-0
                            z-50
                            w-[194px]
                        "
                    >
                        <Sidebar
                            role={
                                displayRole
                            }
                        />
                    </div>
                </aside>


                {/* MOBILE SIDEBAR */}

                {sidebarOpen && (
                    <div
                        className="
                            fixed
                            inset-0
                            z-[200]
                            lg:hidden
                        "
                    >
                        <button
                            type="button"
                            aria-label="Close navigation"
                            onClick={() =>
                                setSidebarOpen(
                                    false
                                )
                            }
                            className="
                                absolute
                                inset-0
                                bg-slate-950/45
                            "
                        />

                        <div
                            className="
                                relative
                                h-full
                                w-[250px]
                                max-w-[86vw]
                                shadow-2xl
                            "
                        >
                            <Sidebar
                                role={
                                    displayRole
                                }
                                onNavigate={() =>
                                    setSidebarOpen(
                                        false
                                    )
                                }
                            />
                        </div>
                    </div>
                )}


                {/* MAIN */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    {/* MOBILE TOP BAR */}

                    <header
                        className="
                            sticky
                            top-0
                            z-[100]
                            flex
                            h-[62px]
                            items-center
                            justify-between
                            border-b
                            border-[#dbe4ef]
                            bg-white
                            px-4
                            shadow-[0_1px_2px_rgba(15,23,42,0.03)]
                            lg:hidden
                        "
                    >
                        <button
                            type="button"
                            aria-label="Open navigation"
                            onClick={() =>
                                setSidebarOpen(
                                    true
                                )
                            }
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-[#073763]
                                text-white
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <path d="M4 7h16" />

                                <path d="M4 12h16" />

                                <path d="M4 17h16" />
                            </svg>
                        </button>


                        <div
                            className="
                                min-w-0
                                flex-1
                                px-3
                            "
                        >
                            <p
                                className="
                                    m-0
                                    truncate
                                    text-[14px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                {title ||
                                    "UK LogiWare"}
                            </p>

                            {subtitle && (
                                <p
                                    className="
                                        m-0
                                        mt-0.5
                                        truncate
                                        text-[9px]
                                        text-slate-500
                                    "
                                >
                                    {subtitle}
                                </p>
                            )}
                        </div>


                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-50
                                text-[12px]
                                font-bold
                                text-blue-600
                            "
                        >
                            {initial}
                        </div>
                    </header>


                    {/* OPTIONAL PAGE HEADER */}

                    {showHeader &&
                        (
                            title ||
                            subtitle
                        ) && (
                            <div
                                className="
                                    hidden
                                    min-h-[82px]
                                    items-center
                                    border-b
                                    border-[#dbe4ef]
                                    bg-white
                                    px-6
                                    lg:flex
                                "
                            >
                                <div>
                                    {title && (
                                        <h1
                                            className="
                                                m-0
                                                text-[21px]
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
                                                m-0
                                                mt-1
                                                text-[10px]
                                                text-slate-500
                                            "
                                        >
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}


                    {/* CONTENT */}

                    <main
                        className="
                            min-w-0
                        "
                    >
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}


export default DashboardLayout;