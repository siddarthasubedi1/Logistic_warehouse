import {
    useNavigate,
} from "react-router-dom";


const BACKEND_URL =
    "http://localhost:5000";


function ProfileHeaderButton({
    user,
    role,
}) {
    const navigate =
        useNavigate();


    const firstName =
        user?.firstName ||
        (
            role === "trainer"
                ? "Trainer"
                : "Trainee"
        );


    const lastName =
        user?.lastName ||
        "";


    const fullName =
        `${firstName} ${lastName}`.trim();


    const initial =
        firstName
            .charAt(0)
            .toUpperCase();


    const profilePath =
        role === "trainer"
            ? "/trainer/profile"
            : "/trainee/profile";


    const profileImageUrl =
        user?.profileImage
            ? `${BACKEND_URL}${user.profileImage}`
            : "";


    return (
        <button
            type="button"
            onClick={() =>
                navigate(
                    profilePath
                )
            }
            className="group flex items-center gap-3 rounded-lg px-2 py-1.5 text-left transition hover:bg-slate-50"
            title="View profile"
        >

            {/* PROFILE IMAGE */}

            {profileImageUrl ? (
                <img
                    src={
                        profileImageUrl
                    }
                    alt={
                        `${fullName} profile`
                    }
                    className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover ring-2 ring-transparent transition group-hover:ring-blue-100"
                />
            ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 ring-2 ring-transparent transition group-hover:ring-blue-100">
                    {initial}
                </div>
            )}


            {/* NAME + ROLE */}

            <div className="hidden sm:block">

                <p className="text-[10px] font-semibold text-slate-800">
                    {fullName}
                </p>

                <p className="text-[9px] capitalize text-slate-400">
                    {role}
                </p>

            </div>


            {/* DROPDOWN ARROW */}

            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600"
            >
                <path d="m7 10 5 5 5-5" />
            </svg>

        </button>
    );
}


export default ProfileHeaderButton;