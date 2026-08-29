import {
    useNavigate,
} from "react-router-dom";


function Unauthorized() {
    const navigate =
        useNavigate();


    const storedUser =
        sessionStorage.getItem("user");


    let user = null;


    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch {
        user = null;
    }


    const role =
        user?.role || "";


    const dashboardPath =
        role === "admin"
            ? "/admin"
            : role === "trainer"
                ? "/trainer"
                : role === "trainee"
                    ? "/trainee"
                    : "/login";


    const handleBackToDashboard =
        () => {
            navigate(
                dashboardPath,
                {
                    replace: true,
                }
            );
        };


    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-4">

            <div className="w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">

                {/* ICON */}

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">

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


                {/* TITLE */}

                <h1 className="mt-5 text-2xl font-bold text-slate-900">
                    Access Denied
                </h1>


                <p className="mt-3 text-sm leading-6 text-slate-500">
                    You do not have permission to access this page.
                    This area is restricted by role-based access control.
                </p>


                {/* ROLE */}

                {role && (
                    <div className="mx-auto mt-5 max-w-[280px] rounded-lg bg-slate-50 px-4 py-3">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Current Role
                        </p>

                        <p className="mt-1 text-sm font-bold capitalize text-blue-600">
                            {role}
                        </p>

                    </div>
                )}


                {/* BUTTON */}

                <button
                    type="button"
                    onClick={
                        handleBackToDashboard
                    }
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
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

                    Back to Dashboard
                </button>


                {/* SPRINT MESSAGE */}

                <div className="mt-7 border-t border-slate-100 pt-5">

                    <div className="flex items-start justify-center gap-2 text-left">

                        <div className="mt-[2px] text-blue-500">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-4 w-4"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                />

                                <path d="M12 11v5" />

                                <circle
                                    cx="12"
                                    cy="8"
                                    r=".7"
                                    fill="currentColor"
                                />
                            </svg>

                        </div>


                        <p className="max-w-[330px] text-[10px] leading-5 text-slate-400">
                            Sprint 1 uses protected routes and role-based
                            access control to ensure Admin, Trainer and
                            Trainee users can only access authorised areas.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Unauthorized;