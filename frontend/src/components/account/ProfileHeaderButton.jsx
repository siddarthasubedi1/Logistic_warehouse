import {
    useNavigate,
} from "react-router-dom";


const BACKEND_URL =
    import.meta.env
        .VITE_BACKEND_URL ||
    "http://localhost:5000";


function ProfileHeaderButton({
    user,
    role,
}) {
    const navigate =
        useNavigate();


    const normalizedRole =
        String(
            role ||
            user?.role ||
            ""
        )
            .trim()
            .toLowerCase();


    const firstName =
        user?.firstName ||
        (
            normalizedRole ===
                "trainer"
                ? "Trainer"
                : normalizedRole ===
                    "trainee"
                    ? "Trainee"
                    : "User"
        );


    const lastName =
        user?.lastName ||
        "";


    const fullName =
        `${firstName} ${lastName}`
            .trim();


    const initial =
        fullName
            .charAt(0)
            .toUpperCase();


    const profilePath =
        normalizedRole ===
            "trainer"
            ? "/trainer/profile"
            : normalizedRole ===
                "trainee"
                ? "/trainee/profile"
                : "/";


    const profileImageUrl =
        user?.profileImage
            ? user.profileImage.startsWith(
                "http"
            )
                ? user.profileImage
                : `${BACKEND_URL}${user.profileImage}`
            : "";


    return (
        <button
            type="button"
            onClick={() =>
                navigate(
                    profilePath
                )
            }
            title="View profile"
            className="
                group
                flex
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
                        alt={`${fullName} profile`}
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
                            text-[11px]
                            font-bold
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


            <div
                className="
                    hidden
                    min-w-0
                    sm:block
                "
            >
                <p
                    className="
                        m-0
                        max-w-[150px]
                        truncate
                        text-[10px]
                        font-bold
                        text-[#172033]
                    "
                >
                    {fullName}
                </p>

                <p
                    className="
                        m-0
                        mt-0.5
                        text-[8px]
                        capitalize
                        text-slate-500
                    "
                >
                    {normalizedRole}
                </p>
            </div>


            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="
                    hidden
                    h-3.5
                    w-3.5
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