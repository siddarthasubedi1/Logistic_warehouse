import {
    useNavigate,
} from "react-router-dom";

import api from "../../services/api";


function LogoutButton() {
    const navigate =
        useNavigate();


    const handleLogout =
        async () => {
            try {
                /*
                    Backend logout route:

                    POST /api/auth/logout

                    Your axios instance already
                    uses withCredentials: true,
                    so the refresh cookie is sent.
                */

                await api.post(
                    "/auth/logout"
                );
            } catch (error) {
                /*
                    Even if the backend request fails,
                    we still clear the frontend session.

                    This prevents the user from staying
                    inside protected pages.
                */

                console.error(
                    "Logout request failed:",
                    error
                );
            } finally {
                /*
                    Remove Sprint 1 authentication
                    information from sessionStorage.
                */

                sessionStorage.removeItem(
                    "accessToken"
                );

                sessionStorage.removeItem(
                    "user"
                );


                /*
                    Return user to login page.
                */

                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );
            }
        };


    return (
        <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-[10px] text-left text-[12px] font-medium text-slate-200 transition hover:bg-red-500/10 hover:text-red-300"
        >

            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-[18px] w-[18px] shrink-0"
            >
                <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />

                <path d="M14 8l4 4-4 4" />

                <path d="M18 12H8" />
            </svg>


            <span>
                Logout
            </span>

        </button>
    );
}


export default LogoutButton;