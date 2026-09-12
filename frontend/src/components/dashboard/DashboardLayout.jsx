import {
    useEffect,
    useState,
} from "react";

import Sidebar from "./Sidebar";

import {
    getSessionUser,
} from "../../utils/session";


// ======================================================
// DASHBOARD LAYOUT
// ======================================================
//
// FRONTEND LAYOUT ONLY.
//
// This file does NOT:
// - call backend APIs
// - change authentication
// - change database records
// - change user permissions
//
// It only controls page layout and responsive sidebar.
//
// ======================================================

function DashboardLayout({
    children,
    role,
    showHeader = true,
    title = "",
    subtitle = "",
    user = null,
}) {
    // ======================================================
    // MOBILE SIDEBAR
    // ======================================================

    const [
        mobileSidebarOpen,
        setMobileSidebarOpen,
    ] = useState(false);


    // ======================================================
    // CURRENT USER
    // ======================================================

    const sessionUser =
        getSessionUser();


    const currentUser =
        user ||
        sessionUser ||
        null;


    // ======================================================
    // USER DISPLAY
    // ======================================================

    const firstName =
        currentUser?.firstName ||
        "";


    const lastName =
        currentUser?.lastName ||
        "";


    const fullName =
        `${firstName} ${lastName}`
            .trim();


    const displayName =
        fullName ||
        currentUser?.username ||
        "User";


    const initial =
        displayName
            .charAt(0)
            .toUpperCase();


    // ======================================================
    // CLOSE MOBILE SIDEBAR ON DESKTOP
    // ======================================================

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


    // ======================================================
    // MOBILE BODY SCROLL
    // ======================================================

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


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <div
            className="
                min-h-screen
                bg-[#f4f7fb]
            "
        >
            <div
                className="
                    flex
                    min-h-screen
                "
            >

                {/* ================================================= */}
                {/* DESKTOP SIDEBAR */}
                {/* ================================================= */}

                <aside
                    className="
                        hidden
                        w-[225px]
                        shrink-0
                        lg:block
                    "
                >
                    <div
                        className="
                            fixed
                            bottom-0
                            left-0
                            top-0
                            w-[225px]
                        "
                    >
                        <Sidebar
                            role={
                                role
                            }
                        />
                    </div>
                </aside>


                {/* ================================================= */}
                {/* MOBILE SIDEBAR */}
                {/* ================================================= */}

                {mobileSidebarOpen && (
                    <div
                        className="
                            fixed
                            inset-0
                            z-[100]
                            lg:hidden
                        "
                    >

                        {/* OVERLAY */}

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
                                bg-slate-950/50
                            "
                        />


                        {/* SIDEBAR DRAWER */}

                        <div
                            className="
                                relative
                                h-full
                                w-[250px]
                                max-w-[85vw]
                                shadow-2xl
                            "
                        >
                            <Sidebar
                                role={
                                    role
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


                {/* ================================================= */}
                {/* MAIN CONTENT */}
                {/* ================================================= */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    {/* ================================================= */}
                    {/* MOBILE TOP BAR */}
                    {/* ================================================= */}

                    <header
                        className="
                            sticky
                            top-0
                            z-40
                            flex
                            h-16
                            items-center
                            justify-between
                            border-b
                            border-slate-200
                            bg-white
                            px-4
                            lg:hidden
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileSidebarOpen(
                                        true
                                    )
                                }
                                aria-label="Open navigation"
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-5 w-5"
                                >
                                    <path d="M4 7h16" />
                                    <path d="M4 12h16" />
                                    <path d="M4 17h16" />
                                </svg>
                            </button>


                            <div>
                                <p
                                    className="
                                        text-sm
                                        font-bold
                                        text-[#172033]
                                    "
                                >
                                    UK LogiWare
                                </p>


                                <p
                                    className="
                                        text-[9px]
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    "
                                >
                                    Safety Training
                                </p>
                            </div>

                        </div>


                        {currentUser && (
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-50
                                    text-xs
                                    font-bold
                                    text-blue-700
                                "
                            >
                                {initial}
                            </div>
                        )}

                    </header>


                    {/* ================================================= */}
                    {/* DESKTOP PAGE HEADER */}
                    {/* ================================================= */}

                    {showHeader && (
                        <header
                            className="
                                border-b
                                border-slate-200
                                bg-white
                            "
                        >
                            <div
                                className="
                                    mx-auto
                                    flex
                                    min-h-[82px]
                                    w-full
                                    max-w-[1500px]
                                    items-center
                                    justify-between
                                    gap-5
                                    px-4
                                    py-4
                                    sm:px-6
                                    lg:px-7
                                "
                            >

                                {/* ================================= */}
                                {/* PAGE TITLE */}
                                {/* ================================= */}

                                <div
                                    className="
                                        min-w-0
                                    "
                                >

                                    {title && (
                                        <h1
                                            className="
                                                truncate
                                                text-[20px]
                                                font-bold
                                                leading-tight
                                                text-[#172033]
                                                sm:text-[22px]
                                            "
                                        >
                                            {title}
                                        </h1>
                                    )}


                                    {subtitle && (
                                        <p
                                            className="
                                                mt-1
                                                truncate
                                                text-[10px]
                                                text-slate-500
                                                sm:text-[11px]
                                            "
                                        >
                                            {subtitle}
                                        </p>
                                    )}

                                </div>


                                {/* ================================= */}
                                {/* USER INFORMATION */}
                                {/* ================================= */}

                                {currentUser && (
                                    <div
                                        className="
                                            hidden
                                            shrink-0
                                            items-center
                                            gap-3
                                            sm:flex
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
                                                text-xs
                                                font-bold
                                                text-blue-700
                                            "
                                        >
                                            {initial}
                                        </div>


                                        <div
                                            className="
                                                hidden
                                                md:block
                                            "
                                        >
                                            <p
                                                className="
                                                    max-w-[180px]
                                                    truncate
                                                    text-[10px]
                                                    font-semibold
                                                    text-slate-800
                                                "
                                            >
                                                {displayName}
                                            </p>


                                            <p
                                                className="
                                                    mt-[2px]
                                                    text-[9px]
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
                    {/* PAGE BODY */}
                    {/* ================================================= */}

                    <main
                        className="
                            min-h-[calc(100vh-82px)]
                            bg-[#f4f7fb]
                        "
                    >
                        <div
                            className="
                                mx-auto
                                w-full
                                max-w-[1500px]
                                px-3
                                py-4
                                sm:px-5
                                sm:py-5
                                lg:px-7
                                lg:py-6
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