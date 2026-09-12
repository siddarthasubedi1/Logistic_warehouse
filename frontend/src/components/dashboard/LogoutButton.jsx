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


                // Existing backend logout endpoint.
                await api.post(
                    "/auth/logout"
                );

            } catch (error) {
                /*
                    Even if the backend request fails,
                    the frontend session is still cleared.
                */

                console.error(
                    "Logout request failed:",
                    error
                );

            } finally {
                // ===========================================
                // CLEAR AUTH SESSION
                // ===========================================

                clearAuthSession();


                // ===========================================
                // RETURN TO LOGIN
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
                min-h-[40px]
                w-full
                items-center
                gap-3
                rounded-md
                px-3
                py-2
                text-left
                text-[10px]
                font-medium
                text-slate-100
                transition
                hover:bg-white/10
                hover:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-white/20
                disabled:cursor-not-allowed
                disabled:opacity-50
            "
        >
            {/* ================================================= */}
            {/* ICON */}
            {/* ================================================= */}

            <span
                className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    text-slate-200
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
                        className="h-[16px] w-[16px]"
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

            <span
                className="
                    truncate
                "
            >
                {loggingOut
                    ? "Signing Out..."
                    : "Logout"}
            </span>
        </button>
    );
}


export default LogoutButton;