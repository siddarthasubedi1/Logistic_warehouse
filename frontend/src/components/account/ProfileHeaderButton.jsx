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


    // ======================================================
    // USER INFORMATION
    // ======================================================

    const firstName =
        user?.firstName ||
        (
            role ===
                "trainer"
                ? "Trainer"
                : "Trainee"
        );


    const lastName =
        user?.lastName ||
        "";


    const fullName =
        `${firstName} ${lastName}`
            .trim();


    const initial =
        firstName
            .charAt(0)
            .toUpperCase();


    const profilePath =
        role ===
            "trainer"
            ? "/trainer/profile"
            : "/trainee/profile";


    const profileImageUrl =
        user?.profileImage
            ? `${BACKEND_URL}${user.profileImage}`
            : "";


    // ======================================================
    // OPEN PROFILE
    // ======================================================

    const handleOpenProfile =
        () => {
            navigate(
                profilePath
            );
        };


    // ======================================================
    // UI
    // ======================================================

    return (
        <button
            type="button"
            onClick={
                handleOpenProfile
            }
            title="View profile"
            className="
                group
                flex
                min-w-0
                max-w-full
                items-center
                gap-2.5
                rounded-lg
                px-2
                py-1.5
                text-left
                transition
                hover:bg-slate-50
                focus:outline-none
                focus:ring-2
                focus:ring-blue-100
            "
        >
            {/* ================================================= */}
            {/* PROFILE IMAGE */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    shrink-0
                "
            >
                {profileImageUrl ? (
                    <img
                        src={
                            profileImageUrl
                        }
                        alt={
                            `${fullName} profile`
                        }
                        className="
                            h-9
                            w-9
                            rounded-full
                            border
                            border-slate-200
                            object-cover
                        "
                    />
                ) : (
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-50
                            text-[10px]
                            font-semibold
                            text-blue-600
                        "
                    >
                        {initial}
                    </div>
                )}


                <span
                    className="
                        absolute
                        bottom-0
                        right-0
                        h-2.5
                        w-2.5
                        rounded-full
                        border-2
                        border-white
                        bg-emerald-500
                    "
                />
            </div>


            {/* ================================================= */}
            {/* USER */}
            {/* ================================================= */}

            <div
                className="
                    hidden
                    min-w-0
                    sm:block
                "
            >
                <p
                    className="
                        max-w-[150px]
                        truncate
                        text-[9px]
                        font-semibold
                        text-slate-800
                    "
                >
                    {fullName}
                </p>


                <p
                    className="
                        mt-0.5
                        text-[7px]
                        capitalize
                        text-slate-400
                    "
                >
                    {role}
                </p>
            </div>


            {/* ================================================= */}
            {/* ARROW */}
            {/* ================================================= */}

            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="
                    hidden
                    h-3.5
                    w-3.5
                    shrink-0
                    text-slate-400
                    transition
                    group-hover:text-blue-600
                    sm:block
                "
            >
                <path d="m9 6 6 6-6 6" />
            </svg>
        </button>
    );
}


export default ProfileHeaderButton;