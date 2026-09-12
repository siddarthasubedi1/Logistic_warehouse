import {
    useEffect,
    useState,
} from "react";

import Sidebar from "./Sidebar";

import {
    getSessionUser,
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
        mobileSidebarOpen,
        setMobileSidebarOpen,
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


    const fullName =
        `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`
            .trim();


    const displayName =
        fullName ||
        currentUser?.username ||
        "User";


    const initial =
        displayName
            .charAt(0)
            .toUpperCase();


    useEffect(() => {
        const handleResize =
            () => {
                if (
                    window.innerWidth >=
                    1024
                ) {
                    setMobileSidebarOpen(
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
            mobileSidebarOpen
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
        mobileSidebarOpen,
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
                        w-[230px]
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
                            w-[230px]
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

                {mobileSidebarOpen && (
                    <div
                        className="
                            fixed
                            inset-0
                            z-[120]
                            lg:hidden
                        "
                    >
                        <button
                            type="button"
                            aria-label="Close navigation"
                            onClick={() =>
                                setMobileSidebarOpen(
                                    false
                                )
                            }
                            className="
                                absolute
                                inset-0
                                bg-slate-950/55
                            "
                        />


                        <div
                            className="
                                relative
                                h-full
                                w-[260px]
                                max-w-[86vw]
                                shadow-2xl
                            "
                        >
                            <Sidebar
                                role={
                                    displayRole
                                }
                                onNavigate={() =>
                                    setMobileSidebarOpen(
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
                    {/* MOBILE HEADER */}

                    <header
                        className="
                            sticky
                            top-0
                            z-40
                            flex
                            h-[62px]
                            items-center
                            justify-between
                            border-b
                            border-[#dbe4ef]
                            bg-white
                            px-4
                            lg:hidden
                        "
                    >
                        <button
                            type="button"
                            aria-label="Open navigation"
                            onClick={() =>
                                setMobileSidebarOpen(
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
                                className="
                                    h-5
                                    w-5
                                "
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
                                        truncate
                                        text-[10px]
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


                    {/* PAGE HEADER */}

                    {showHeader && (
                        <header
                            className="
                                hidden
                                min-h-[80px]
                                items-center
                                justify-between
                                gap-6
                                border-b
                                border-[#dbe4ef]
                                bg-white
                                px-7
                                py-4
                                lg:flex
                            "
                        >
                            <div
                                className="
                                    min-w-0
                                "
                            >
                                {title && (
                                    <h1
                                        className="
                                            truncate
                                            text-[22px]
                                            font-bold
                                            tracking-[-0.02em]
                                            text-[#111827]
                                        "
                                    >
                                        {title}
                                    </h1>
                                )}


                                {subtitle && (
                                    <p
                                        className="
                                            mt-1
                                            text-[11px]
                                            font-medium
                                            text-[#64748b]
                                        "
                                    >
                                        {subtitle}
                                    </p>
                                )}
                            </div>


                            <div
                                className="
                                    flex
                                    shrink-0
                                    items-center
                                    gap-4
                                "
                            >
                                <button
                                    type="button"
                                    aria-label="Notifications"
                                    className="
                                        relative
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-slate-200
                                        bg-white
                                        text-slate-600
                                        transition
                                        hover:bg-slate-50
                                    "
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="
                                            h-5
                                            w-5
                                        "
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
                                            h-10
                                            w-10
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


                                    <div>
                                        <p
                                            className="
                                                text-[11px]
                                                font-semibold
                                                text-[#172033]
                                            "
                                        >
                                            {displayName}
                                        </p>


                                        <p
                                            className="
                                                mt-0.5
                                                text-[9px]
                                                capitalize
                                                text-slate-500
                                            "
                                        >
                                            {displayRole ||
                                                "User"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </header>
                    )}


                    {/* PAGE CONTENT */}

                    <main
                        className="
                            min-h-[calc(100vh-62px)]
                            bg-[#f5f7fb]
                            p-3
                            sm:p-4
                            md:p-5
                            lg:min-h-[calc(100vh-80px)]
                            lg:p-6
                        "
                    >
                        <div
                            className="
                                mx-auto
                                w-full
                                max-w-[1700px]
                            "
                        >
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}


export default DashboardLayout;