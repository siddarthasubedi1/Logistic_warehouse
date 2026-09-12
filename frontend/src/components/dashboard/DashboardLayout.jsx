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
        role ||
        currentUser?.role ||
        "";


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
        const handleResize = () => {
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
        document.body.style.overflow =
            mobileSidebarOpen
                ? "hidden"
                : "";


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
                bg-[#f4f7fb]
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
                        w-[225px]
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
                            w-[225px]
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
                            z-[100]
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
                                bg-slate-950/50
                            "
                        />


                        <div
                            className="
                                relative
                                h-full
                                w-[250px]
                                max-w-[84vw]
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


                {/* CONTENT */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    {/* MOBILE BAR */}

                    <header
                        className="
                            sticky
                            top-0
                            z-40
                            flex
                            h-[58px]
                            items-center
                            justify-between
                            border-b
                            border-slate-200
                            bg-white
                            px-3
                            sm:px-4
                            lg:hidden
                        "
                    >
                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-3
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
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-md
                                    border
                                    border-slate-200
                                    bg-white
                                    text-[#073763]
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


                            <div
                                className="
                                    min-w-0
                                "
                            >
                                <p
                                    className="
                                        truncate
                                        text-[11px]
                                        font-bold
                                        text-[#172033]
                                    "
                                >
                                    UK LogiWare
                                </p>

                                <p
                                    className="
                                        truncate
                                        text-[7px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.08em]
                                        text-slate-500
                                    "
                                >
                                    Safety Training
                                </p>
                            </div>
                        </div>


                        <div
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
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
                    </header>


                    {/* OPTIONAL PAGE HEADER */}

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
                                    w-full
                                    max-w-[1500px]
                                    flex-col
                                    gap-3
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
                                            text-[19px]
                                            font-bold
                                            text-[#172033]
                                            sm:text-[22px]
                                        "
                                    >
                                        {title}
                                    </h1>

                                    {subtitle && (
                                        <p
                                            className="
                                                mt-1
                                                text-[9px]
                                                font-medium
                                                text-slate-600
                                            "
                                        >
                                            {subtitle}
                                        </p>
                                    )}
                                </div>


                                <div
                                    className="
                                        hidden
                                        items-center
                                        gap-3
                                        md:flex
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
                                            {displayName}
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-[7px]
                                                capitalize
                                                text-slate-500
                                            "
                                        >
                                            {displayRole}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </header>
                    )}


                    {/* PAGE */}

                    <main
                        className="
                            mx-auto
                            w-full
                            max-w-[1500px]
                            p-3
                            sm:p-4
                            md:p-5
                            lg:p-6
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