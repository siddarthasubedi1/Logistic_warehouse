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
        `${firstName} ${lastName}`.trim();


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
                max-w-full
                items-center
                gap-2.5
                rounded-xl
                px-1.5
                py-1
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
                            rounded-xl
                            border
                            border-slate-200
                            object-cover
                            ring-2
                            ring-transparent
                            transition
                            group-hover:ring-blue-100
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
                            rounded-xl
                            bg-gradient-to-br
                            from-blue-100
                            to-blue-200
                            text-xs
                            font-bold
                            text-blue-700
                            ring-2
                            ring-transparent
                            transition
                            group-hover:ring-blue-100
                        "
                    >
                        {initial}
                    </div>
                )}


                <span
                    className="
                        absolute
                        -bottom-0.5
                        -right-0.5
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
            {/* NAME */}
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
                        max-w-[145px]
                        truncate
                        text-[10px]
                        font-semibold
                        text-slate-800
                    "
                >
                    {fullName}
                </p>


                <div
                    className="
                        mt-0.5
                        flex
                        items-center
                        gap-1.5
                    "
                >

                    <span
                        className="
                            text-[8px]
                            capitalize
                            text-slate-400
                        "
                    >
                        {role}
                    </span>


                    <span
                        className="
                            h-1
                            w-1
                            rounded-full
                            bg-slate-300
                        "
                    />


                    <span
                        className="
                            text-[8px]
                            font-medium
                            text-blue-500
                        "
                    >
                        Profile
                    </span>

                </div>

            </div>


            {/* ================================================= */}
            {/* ARROW */}
            {/* ================================================= */}

            <div
                className="
                    hidden
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    transition
                    group-hover:bg-blue-50
                    group-hover:text-blue-600
                    sm:flex
                "
            >

                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-3.5 w-3.5"
                >
                    <path d="m9 6 6 6-6 6" />
                </svg>

            </div>

        </button>
    );
}


export default ProfileHeaderButton;