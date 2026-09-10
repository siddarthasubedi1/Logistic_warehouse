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

    // ======================================================
    // MOBILE SIDEBAR
    // ======================================================

    const [
        mobileSidebarOpen,
        setMobileSidebarOpen,
    ] = useState(false);


    // ======================================================
    // SESSION USER
    // ======================================================

    const sessionUser =
        getSessionUser();


    const currentUser =
        user ||
        sessionUser ||
        null;


    // ======================================================
    // USER INFORMATION
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
    // CLOSE MOBILE SIDEBAR ON LARGE SCREEN
    // ======================================================

    useEffect(
        () => {
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
        },
        []
    );


    // ======================================================
    // LOCK BODY SCROLL WHEN MOBILE MENU OPEN
    // ======================================================

    useEffect(
        () => {
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
        },
        [
            mobileSidebarOpen,
        ]
    );


    // ======================================================
    // UI
    // ======================================================

    return (
        <div
            className="
                relative
                min-h-screen
                overflow-x-hidden
                bg-[#f4f7fb]
            "
        >

            {/* ================================================= */}
            {/* BACKGROUND DESIGN */}
            {/* ================================================= */}

            <div
                className="
                    pointer-events-none
                    fixed
                    inset-0
                    z-0
                    overflow-hidden
                "
            >

                <div
                    className="
                        absolute
                        -right-32
                        -top-32
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-blue-100/40
                        blur-3xl
                    "
                />


                <div
                    className="
                        absolute
                        -bottom-40
                        left-[18%]
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-cyan-100/30
                        blur-3xl
                    "
                />


                <div
                    className="
                        absolute
                        inset-0
                        opacity-[0.025]
                    "
                    style={{
                        backgroundImage:
                            "linear-gradient(#0f4c81 1px, transparent 1px), linear-gradient(90deg, #0f4c81 1px, transparent 1px)",

                        backgroundSize:
                            "32px 32px",
                    }}
                />

            </div>


            {/* ================================================= */}
            {/* PAGE LAYOUT */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    z-10
                    flex
                    min-h-screen
                    items-stretch
                "
            >

                {/* ================================================= */}
                {/* DESKTOP SIDEBAR */}
                {/* ================================================= */}

                <div
                    className="
                        hidden
                        w-[220px]
                        shrink-0
                        self-stretch
                        bg-[#073763]
                        lg:block
                        xl:w-[235px]
                    "
                >
                    <Sidebar
                        role={
                            role
                        }
                    />
                </div>


                {/* ================================================= */}
                {/* MOBILE SIDEBAR OVERLAY */}
                {/* ================================================= */}

                {mobileSidebarOpen && (
                    <div
                        className="
                            fixed
                            inset-0
                            z-[80]
                            lg:hidden
                        "
                    >

                        {/* BACKDROP */}

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
                                backdrop-blur-[2px]
                            "
                        />


                        {/* DRAWER */}

                        <div
                            className="
                                relative
                                h-full
                                w-[270px]
                                max-w-[85vw]
                                bg-[#073763]
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
                {/* MAIN AREA */}
                {/* ================================================= */}

                <main
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    {/* ================================================= */}
                    {/* MOBILE TOP BAR */}
                    {/* ================================================= */}

                    <div
                        className="
                            sticky
                            top-0
                            z-50
                            flex
                            h-16
                            items-center
                            justify-between
                            border-b
                            border-slate-200
                            bg-white/95
                            px-4
                            backdrop-blur
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
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    text-slate-700
                                    shadow-sm
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
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-blue-600
                                    "
                                >
                                    UK LogiWare
                                </p>


                                <p
                                    className="
                                        text-sm
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    Safety Training
                                </p>

                            </div>

                        </div>


                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-100
                                text-xs
                                font-bold
                                text-blue-700
                            "
                        >
                            {initial}
                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* PAGE HEADER */}
                    {/* ================================================= */}

                    {showHeader && (
                        <header
                            className="
                                border-b
                                border-slate-200/90
                                bg-white/90
                                px-4
                                py-4
                                backdrop-blur
                                sm:px-5
                                lg:px-7
                                xl:px-8
                            "
                        >

                            <div
                                className="
                                    mx-auto
                                    flex
                                    w-full
                                    max-w-[1600px]
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                {/* ================================= */}
                                {/* TITLE */}
                                {/* ================================= */}

                                <div className="min-w-0">

                                    {title && (
                                        <div
                                            className="
                                                flex
                                                items-start
                                                gap-3
                                            "
                                        >

                                            <div
                                                className="
                                                    mt-0.5
                                                    hidden
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-blue-50
                                                    text-blue-600
                                                    sm:flex
                                                "
                                            >

                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    className="h-5 w-5"
                                                >
                                                    <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                                    <path d="m9 12 2 2 4-4" />
                                                </svg>

                                            </div>


                                            <div className="min-w-0">

                                                <h1
                                                    className="
                                                        truncate
                                                        text-lg
                                                        font-bold
                                                        text-[#172033]
                                                        sm:text-xl
                                                        lg:text-[22px]
                                                    "
                                                >
                                                    {title}
                                                </h1>


                                                {subtitle && (
                                                    <p
                                                        className="
                                                            mt-1
                                                            max-w-3xl
                                                            text-xs
                                                            leading-5
                                                            text-slate-500
                                                            sm:text-[13px]
                                                        "
                                                    >
                                                        {subtitle}
                                                    </p>
                                                )}

                                            </div>

                                        </div>
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
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            px-3
                                            py-2
                                            shadow-sm
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
                                                bg-blue-100
                                                text-xs
                                                font-bold
                                                text-blue-700
                                            "
                                        >
                                            {initial}
                                        </div>


                                        <div>

                                            <p
                                                className="
                                                    max-w-[180px]
                                                    truncate
                                                    text-xs
                                                    font-semibold
                                                    text-slate-800
                                                "
                                            >
                                                {fullName ||
                                                    currentUser.username ||
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
                            relative
                            min-w-0
                            px-3
                            py-4
                            sm:px-5
                            sm:py-5
                            lg:px-6
                            lg:py-6
                            xl:px-8
                        "
                    >

                        <div
                            className="
                                mx-auto
                                w-full
                                max-w-[1600px]
                            "
                        >
                            {children}
                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
}


export default DashboardLayout;