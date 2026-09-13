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

                await api.post(
                    "/auth/logout"
                );

            } catch (
            error
            ) {
                console.error(
                    "Logout request failed:",
                    error
                );

            } finally {
                clearAuthSession();

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
                flex
                min-h-[42px]
                w-full
                items-center
                gap-3
                rounded-md
                px-3
                py-2
                text-left
                text-[11px]
                font-medium
                text-white
                transition
                hover:bg-white/10
                focus:outline-none
                focus:ring-2
                focus:ring-white/20
                disabled:opacity-60
            "
        >
            <span
                className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
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

                        <path d="m14 8 4 4-4 4" />

                        <path d="M18 12H8" />
                    </svg>
                )}
            </span>


            <span>
                {loggingOut
                    ? "Signing Out..."
                    : "Logout"}
            </span>
        </button>
    );
}


export default LogoutButton;