import {
    useNavigate,
} from "react-router-dom";
import {
    clearAuthSession,
} from "../utils/session";


import Logo from "../components/layout/Logo";


function Unauthorized() {
    const navigate =
        useNavigate();


    // ======================================================
    // CURRENT USER
    // ======================================================

    const storedUser =
        sessionStorage.getItem(
            "user"
        );


    let user =
        null;


    try {
        user =
            storedUser
                ? JSON.parse(
                    storedUser
                )
                : null;

    } catch {
        user =
            null;
    }


    const role =
        user?.role ||
        "";


    // ======================================================
    // DASHBOARD PATH
    // ======================================================

    const dashboardPath =
        role ===
            "admin"
            ? "/admin"
            : role ===
                "trainer"
                ? "/trainer"
                : role ===
                    "trainee"
                    ? "/trainee"
                    : "/login";


    // ======================================================
    // RETURN
    // ======================================================

    const handleBack =
        () => {
            navigate(
                dashboardPath,
                {
                    replace:
                        true,
                }
            );
        };


    // ======================================================
    // UI
    // ======================================================

    return (
        <main
            className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-[#f4f7fb]
                px-4
                py-8
            "
        >
            <section
                className="
                    w-full
                    max-w-[440px]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >
                {/* ================================================= */}
                {/* LOGO */}
                {/* ================================================= */}

                <div
                    className="
                        border-b
                        border-slate-100
                        px-5
                        py-4
                    "
                >
                    <Logo />
                </div>


                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                <div
                    className="
                        px-5
                        py-8
                        text-center
                        sm:px-7
                    "
                >
                    {/* ICON */}

                    <div
                        className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-red-50
                            text-red-500
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-6 w-6"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />

                            <path d="m8 8 8 8" />

                            <path d="m16 8-8 8" />
                        </svg>
                    </div>


                    {/* TITLE */}

                    <h1
                        className="
                            mt-4
                            text-[20px]
                            font-semibold
                            text-slate-800
                        "
                    >
                        Access Denied
                    </h1>


                    {/* DESCRIPTION */}

                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-sm
                            text-[9px]
                            leading-5
                            text-slate-500
                        "
                    >
                        You do not have permission to access this page.
                    </p>


                    {/* ROLE */}

                    {role && (
                        <div
                            className="
                                mx-auto
                                mt-5
                                max-w-[250px]
                                rounded-lg
                                bg-slate-50
                                p-3
                            "
                        >
                            <p
                                className="
                                    text-[7px]
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Current Role
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[10px]
                                    font-medium
                                    capitalize
                                    text-slate-700
                                "
                            >
                                {role}
                            </p>
                        </div>
                    )}


                    {/* BUTTON */}

                    <button
                        type="button"
                        onClick={
                            handleBack
                        }
                        className="
                            mt-6
                            inline-flex
                            min-h-[40px]
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-blue-600
                            px-5
                            py-2.5
                            text-[9px]
                            font-medium
                            text-white
                            transition
                            hover:bg-blue-700
                            sm:w-auto
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                        >
                            <path d="M3 12 12 4l9 8" />

                            <path d="M5 10v10h14V10" />
                        </svg>


                        {role
                            ? "Back to Dashboard"
                            : "Back to Login"}
                    </button>
                </div>
            </section>
        </main>
    );
}


export default Unauthorized;