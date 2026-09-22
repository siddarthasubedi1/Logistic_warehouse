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
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

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
        const handleResize = () => {
            if (
                window.innerWidth >=
                1024
            ) {
                setSidebarOpen(false);
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
        if (sidebarOpen) {
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
    }, [sidebarOpen]);


    return (
        <div className={`app-shell app-shell--${displayRole || "user"}`}>
            <div className="app-shell__inner">

                {/* ==================================================
                    DESKTOP SIDEBAR
                ================================================== */}

                <aside className="app-sidebar-desktop">
                    <div className="app-sidebar-desktop__fixed">
                        <Sidebar
                            role={displayRole}
                        />
                    </div>
                </aside>


                {/* ==================================================
                    MOBILE SIDEBAR
                ================================================== */}

                {sidebarOpen && (
                    <div className="app-mobile-drawer">

                        <button
                            type="button"
                            aria-label="Close navigation"
                            className="app-mobile-drawer__overlay"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                        />

                        <div className="app-mobile-drawer__panel">
                            <Sidebar
                                role={displayRole}
                                onNavigate={() =>
                                    setSidebarOpen(false)
                                }
                            />
                        </div>
                    </div>
                )}


                {/* ==================================================
                    MAIN CONTENT
                ================================================== */}

                <div className="app-main">

                    {/* MOBILE HEADER */}

                    <header className="app-mobile-header">

                        <button
                            type="button"
                            aria-label="Open navigation"
                            className="app-mobile-header__menu"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            >
                                <path d="M4 7h16" />
                                <path d="M4 12h16" />
                                <path d="M4 17h16" />
                            </svg>
                        </button>


                        <div className="app-mobile-header__text">
                            <p className="app-mobile-header__title">
                                {title || "UK LogiWare"}
                            </p>

                            {subtitle && (
                                <p className="app-mobile-header__subtitle">
                                    {subtitle}
                                </p>
                            )}
                        </div>


                        <div className="app-mobile-header__avatar">
                            {initial}
                        </div>
                    </header>


                    {/* ==================================================
                        DESKTOP PAGE HEADER
                    ================================================== */}

                    {showHeader &&
                        (title || subtitle) && (
                            <div className="app-page-header">

                                <div>
                                    {title && (
                                        <h1 className="app-page-header__title">
                                            {title}
                                        </h1>
                                    )}

                                    {subtitle && (
                                        <p className="app-page-header__subtitle">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>

                                {displayRole === "admin" && (
                                    <div className="app-page-header__admin-meta">
                                        <button type="button" className="app-page-header__bell" aria-label="Notifications">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
                                                <path d="M10 19h4" />
                                            </svg>
                                        </button>
                                        <div className="app-page-header__admin-avatar">{initial}</div>
                                        <div className="app-page-header__admin-copy">
                                            <strong>{currentUser?.firstName || currentUser?.username || "Administrator"}</strong>
                                            <span>Administrator</span>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}


                    {/* ==================================================
                        PAGE CONTENT
                    ================================================== */}

                    <main className="app-content">
                        {children}
                    </main>

                </div>
            </div>
        </div>
    );
}


export default DashboardLayout;