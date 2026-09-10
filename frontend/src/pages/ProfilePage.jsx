import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProfileDetails from "../components/account/ProfileDetails";
import ChangePasswordForm from "../components/account/ChangePasswordForm";

import api from "../services/api";


function ProfilePage({
    role,
}) {
    const navigate =
        useNavigate();


    // ======================================================
    // STATE
    // ======================================================

    const [
        user,
        setUser,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // ======================================================
    // LOAD PROFILE
    // ======================================================

    useEffect(() => {
        const loadProfile =
            async () => {
                try {
                    setLoading(true);

                    setError("");


                    const response =
                        await api.get(
                            "/users/me"
                        );


                    const currentUser =
                        response.data
                            ?.user ||
                        null;


                    setUser(
                        currentUser
                    );


                    if (
                        currentUser
                    ) {
                        sessionStorage.setItem(
                            "user",
                            JSON.stringify(
                                currentUser
                            )
                        );
                    }

                } catch (error) {
                    console.error(
                        "Profile loading error:",
                        error
                    );


                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load profile."
                    );

                } finally {
                    setLoading(
                        false
                    );
                }
            };


        loadProfile();

    }, []);


    // ======================================================
    // DASHBOARD PATH
    // ======================================================

    const dashboardPath =
        role ===
            "trainer"
            ? "/trainer"
            : "/trainee";


    // ======================================================
    // PROFILE IMAGE UPDATED
    // ======================================================

    const handleProfileImageUpdated = (
        updatedUser
    ) => {
        setUser(
            (
                currentUser
            ) => ({
                ...currentUser,
                ...updatedUser,
            })
        );
    };


    // ======================================================
    // DISPLAY
    // ======================================================

    const displayName =
        [
            user?.firstName,
            user?.lastName,
        ]
            .filter(Boolean)
            .join(" ") ||
        (
            role ===
                "trainer"
                ? "Trainer"
                : "Trainee"
        );


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <DashboardLayout
            role={
                role
            }
            showHeader={
                false
            }
        >

            <div className="space-y-5">

                {/* ================================================= */}
                {/* HERO */}
                {/* ================================================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-200
                        bg-gradient-to-r
                        from-[#073763]
                        via-[#0b4f87]
                        to-[#1769aa]
                        px-5
                        py-6
                        text-white
                        shadow-sm
                        sm:px-6
                        lg:px-7
                    "
                >

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-16
                            h-48
                            w-48
                            rounded-full
                            bg-white/10
                        "
                    />


                    <div
                        className="
                            pointer-events-none
                            absolute
                            right-24
                            top-8
                            hidden
                            h-28
                            w-28
                            rotate-12
                            rounded-2xl
                            border
                            border-white/10
                            lg:block
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            flex
                            flex-col
                            gap-5
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        {/* LEFT */}

                        <div
                            className="
                                flex
                                items-start
                                gap-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
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
                                    className="h-6 w-6"
                                >
                                    <circle
                                        cx="12"
                                        cy="8"
                                        r="3"
                                    />

                                    <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />

                                    <path d="M18 4v5" />

                                    <path d="M15.5 6.5h5" />
                                </svg>

                            </div>


                            <div>

                                <p
                                    className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.18em]
                                        text-blue-100
                                    "
                                >
                                    Account Center
                                </p>


                                <h1
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        sm:text-2xl
                                    "
                                >
                                    My Profile
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-[11px]
                                        leading-5
                                        text-blue-100
                                    "
                                >
                                    Manage your profile image and keep
                                    your workplace safety training
                                    account secure.
                                </p>

                            </div>

                        </div>


                        {/* RIGHT */}

                        <div
                            className="
                                flex
                                flex-col
                                items-stretch
                                gap-2
                                sm:items-end
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        dashboardPath
                                    )
                                }
                                className="
                                    inline-flex
                                    min-h-[40px]
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-white/15
                                    bg-white/10
                                    px-4
                                    py-2
                                    text-[10px]
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-white/20
                                "
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                >
                                    <path d="m15 18-6-6 6-6" />
                                </svg>

                                Back to Dashboard

                            </button>


                            <div
                                className="
                                    flex
                                    flex-wrap
                                    justify-start
                                    gap-2
                                    sm:justify-end
                                "
                            >

                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-white/15
                                        bg-white/10
                                        px-3
                                        py-1.5
                                        text-[9px]
                                        font-semibold
                                        capitalize
                                    "
                                >
                                    {role} Account
                                </span>


                                {user?.status && (
                                    <span
                                        className="
                                            rounded-full
                                            border
                                            border-white/15
                                            bg-white/10
                                            px-3
                                            py-1.5
                                            text-[9px]
                                            font-semibold
                                            capitalize
                                        "
                                    >
                                        {user.status}
                                    </span>
                                )}

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* USER SUMMARY */}
                {/* ================================================= */}

                {!loading &&
                    user && (
                        <section
                            className="
                                grid
                                gap-3
                                sm:grid-cols-2
                                xl:grid-cols-4
                            "
                        >

                            <ProfileStat
                                title="Account"
                                value={
                                    displayName
                                }
                                type="user"
                            />


                            <ProfileStat
                                title="Role"
                                value={
                                    user.role ||
                                    role
                                }
                                type="role"
                            />


                            <ProfileStat
                                title="Username"
                                value={
                                    user.username ||
                                    "—"
                                }
                                type="username"
                            />


                            <ProfileStat
                                title="Status"
                                value={
                                    user.status ||
                                    "—"
                                }
                                type="status"
                            />

                        </section>
                    )}


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (
                    <div
                        className="
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-[10px]
                            text-red-700
                        "
                    >

                        <div
                            className="
                                flex
                                h-6
                                w-6
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                font-bold
                                text-red-600
                            "
                        >
                            !
                        </div>


                        <span
                            className="
                                pt-1
                            "
                        >
                            {error}
                        </span>

                    </div>
                )}


                {/* ================================================= */}
                {/* PROFILE CONTENT */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        items-start
                        gap-5
                        xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)]
                    "
                >

                    <ProfileDetails
                        user={
                            user
                        }
                        loading={
                            loading
                        }
                        onProfileImageUpdated={
                            handleProfileImageUpdated
                        }
                    />


                    <ChangePasswordForm />

                </section>


                {/* ================================================= */}
                {/* SECURITY NOTE */}
                {/* ================================================= */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-blue-100
                        bg-gradient-to-r
                        from-blue-50
                        via-white
                        to-emerald-50
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-white
                                text-blue-600
                                shadow-sm
                            "
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                <path d="m9 12 2 2 4-4" />
                            </svg>

                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Account Security
                            </p>


                            <p
                                className="
                                    mt-1
                                    max-w-4xl
                                    text-[10px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                Keep your login credentials private.
                                After changing your password, the system
                                signs you out so you can authenticate
                                again using the new password.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </DashboardLayout>
    );
}


// ======================================================
// PROFILE STAT
// ======================================================

function ProfileStat({
    title,
    value,
    type,
}) {
    const styles = {
        user:
            "bg-blue-50 text-blue-700",

        role:
            "bg-indigo-50 text-indigo-700",

        username:
            "bg-violet-50 text-violet-700",

        status:
            "bg-emerald-50 text-emerald-700",
    };


    return (
        <article
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <div
                    className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl

                        ${styles[type]}
                    `}
                >
                    <ProfileStatIcon
                        type={
                            type
                        }
                    />
                </div>


                <div className="min-w-0">

                    <p
                        className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        {title}
                    </p>


                    <p
                        className="
                            mt-1
                            truncate
                            text-[10px]
                            font-bold
                            capitalize
                            text-slate-800
                        "
                    >
                        {value}
                    </p>

                </div>

            </div>

        </article>
    );
}


// ======================================================
// STAT ICON
// ======================================================

function ProfileStatIcon({
    type,
}) {
    if (
        type ===
        "username"
    ) {
        return (
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
                    r="4"
                />

                <path d="M16 12v1a2 2 0 0 0 4 0v-1a8 8 0 1 0-3 6" />
            </svg>
        );
    }


    if (
        type ===
        "role"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
            >
                <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />
            </svg>
        );
    }


    if (
        type ===
        "status"
    ) {
        return (
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

                <path d="m8 12 2.5 2.5L16 9" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
        >
            <circle
                cx="12"
                cy="8"
                r="3"
            />

            <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
        </svg>
    );
}


export default ProfilePage;