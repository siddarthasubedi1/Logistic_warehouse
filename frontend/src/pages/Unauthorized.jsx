import {
    useNavigate,
} from "react-router-dom";


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


    const handleBackToDashboard = () => {
        navigate(
            dashboardPath,
            {
                replace:
                    true,
            }
        );
    };


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <main
            className="
                relative
                flex
                min-h-screen
                items-center
                justify-center
                overflow-hidden
                bg-slate-100
                px-4
                py-8
            "
        >
            {/* BACKGROUND */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-32
                    -top-32
                    h-80
                    w-80
                    rounded-full
                    bg-blue-100/70
                    blur-3xl
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-32
                    -right-32
                    h-80
                    w-80
                    rounded-full
                    bg-red-100/60
                    blur-3xl
                "
            />


            <section
                className="
                    relative
                    z-10
                    w-full
                    max-w-[560px]
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                    shadow-slate-300/40
                "
            >
                {/* TOP */}

                <div
                    className="
                        relative
                        overflow-hidden
                        bg-gradient-to-r
                        from-[#073763]
                        via-[#0b4f87]
                        to-[#1769aa]
                        px-6
                        py-7
                        text-center
                        text-white
                    "
                >
                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-12
                            -top-12
                            h-36
                            w-36
                            rounded-full
                            bg-white/10
                        "
                    />


                    <div
                        className="
                            relative
                            mx-auto
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-white/15
                            bg-white/10
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-8 w-8"
                        >
                            <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                            <path d="m9 9 6 6" />

                            <path d="m15 9-6 6" />
                        </svg>
                    </div>


                    <p
                        className="
                            mt-5
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            text-blue-100
                        "
                    >
                        Role-Based Access Control
                    </p>


                    <h1
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            sm:text-3xl
                        "
                    >
                        Access Denied
                    </h1>
                </div>


                {/* CONTENT */}

                <div
                    className="
                        px-5
                        py-6
                        text-center
                        sm:px-8
                        sm:py-8
                    "
                >
                    <p
                        className="
                            mx-auto
                            max-w-md
                            text-[11px]
                            leading-6
                            text-slate-500
                        "
                    >
                        You do not have permission to access this page.
                        This area is protected by the system's
                        role-based access control.
                    </p>


                    {role && (
                        <div
                            className="
                                mx-auto
                                mt-6
                                max-w-[300px]
                                rounded-xl
                                border
                                border-blue-100
                                bg-blue-50
                                p-4
                            "
                        >
                            <p
                                className="
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.14em]
                                    text-slate-400
                                "
                            >
                                Your Current Role
                            </p>


                            <p
                                className="
                                    mt-1.5
                                    text-sm
                                    font-bold
                                    capitalize
                                    text-blue-700
                                "
                            >
                                {role}
                            </p>
                        </div>
                    )}


                    <button
                        type="button"
                        onClick={
                            handleBackToDashboard
                        }
                        className="
                            mt-7
                            inline-flex
                            min-h-[44px]
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-3
                            text-[10px]
                            font-semibold
                            text-white
                            shadow-sm
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


                    <div
                        className="
                            mt-7
                            border-t
                            border-slate-100
                            pt-5
                        "
                    >
                        <div
                            className="
                                flex
                                items-start
                                justify-center
                                gap-2
                                text-left
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="
                                    mt-0.5
                                    h-4
                                    w-4
                                    shrink-0
                                    text-blue-500
                                "
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                />

                                <path d="M12 11v5" />

                                <path d="M12 8h.01" />
                            </svg>


                            <p
                                className="
                                    max-w-[360px]
                                    text-[9px]
                                    leading-5
                                    text-slate-400
                                "
                            >
                                Admin, Trainer and Trainee accounts have
                                different permissions. Protected routes
                                prevent users from opening areas outside
                                their assigned role.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}


export default Unauthorized;