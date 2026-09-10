import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import api from "../../services/api";

import {
    clearAuthSession,
} from "../../utils/session";


function LogoutButton() {
    const navigate =
        useNavigate();


    const [
        loggingOut,
        setLoggingOut,
    ] = useState(false);


    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout =
        async () => {
            if (
                loggingOut
            ) {
                return;
            }


            try {
                setLoggingOut(
                    true
                );


                /*
                    Backend logout route:

                    POST /api/auth/logout

                    Axios already uses withCredentials,
                    so the refresh cookie is included.
                */

                await api.post(
                    "/auth/logout"
                );

            } catch (error) {
                /*
                    Frontend session must still be removed
                    if the logout request fails.

                    This prevents users remaining inside
                    protected frontend routes.
                */

                console.error(
                    "Logout request failed:",
                    error
                );

            } finally {
                // ===========================================
                // CLEAR SESSION
                // ===========================================

                clearAuthSession();


                // ===========================================
                // LOGIN PAGE
                // ===========================================

                navigate(
                    "/login",
                    {
                        replace:
                            true,
                    }
                );


                setLoggingOut(
                    false
                );
            }
        };


    // ======================================================
    // UI
    // ======================================================

    return (
        <button
            type="button"
            onClick={
                handleLogout
            }
            disabled={
                loggingOut
            }
            className="
                group
                flex
                min-h-[42px]
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-left
                text-[11px]
                font-medium
                text-slate-200
                transition
                hover:bg-red-500/10
                hover:text-red-200
                focus:outline-none
                focus:ring-2
                focus:ring-red-300/30
                disabled:cursor-not-allowed
                disabled:opacity-60
            "
        >

            {/* ================================================= */}
            {/* ICON */}
            {/* ================================================= */}

            <span
                className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-white/5
                    text-slate-300
                    transition
                    group-hover:bg-red-500/10
                    group-hover:text-red-200
                "
            >

                {loggingOut ? (
                    <span
                        className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/30
                            border-t-white
                        "
                    />
                ) : (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-[17px] w-[17px]"
                    >
                        <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />

                        <path d="M14 8l4 4-4 4" />

                        <path d="M18 12H8" />
                    </svg>
                )}

            </span>


            {/* ================================================= */}
            {/* LABEL */}
            {/* ================================================= */}

            <div
                className="
                    min-w-0
                    flex-1
                "
            >

                <p
                    className="
                        truncate
                        text-[11px]
                        font-semibold
                    "
                >
                    {loggingOut
                        ? "Signing Out..."
                        : "Logout"}
                </p>


                <p
                    className="
                        mt-0.5
                        text-[8px]
                        text-slate-400
                        transition
                        group-hover:text-red-200/70
                    "
                >
                    End secure session
                </p>

            </div>


            {!loggingOut && (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="
                        h-3.5
                        w-3.5
                        shrink-0
                        text-slate-400
                        transition
                        group-hover:translate-x-0.5
                        group-hover:text-red-200
                    "
                >
                    <path d="m9 6 6 6-6 6" />
                </svg>
            )}

        </button>
    );
}


export default LogoutButton;