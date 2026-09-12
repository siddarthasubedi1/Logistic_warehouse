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

import FeedbackAlert from "../components/ui/FeedbackAlert";

import api from "../services/api";


function ProfilePage({
    role,
}) {
    const navigate =
        useNavigate();


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
        let mounted =
            true;


        const loadProfile =
            async () => {
                try {
                    setLoading(true);
                    setError("");


                    const response =
                        await api.get(
                            "/users/me"
                        );


                    if (!mounted) {
                        return;
                    }


                    const currentUser =
                        response.data?.user ||
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


                    if (mounted) {
                        setError(
                            error.response
                                ?.data
                                ?.message ||
                            "Unable to load profile."
                        );
                    }

                } finally {
                    if (mounted) {
                        setLoading(false);
                    }
                }
            };


        loadProfile();


        return () => {
            mounted =
                false;
        };
    }, []);


    // ======================================================
    // DASHBOARD
    // ======================================================

    const dashboardPath =
        role === "trainer"
            ? "/trainer"
            : "/trainee";


    // ======================================================
    // PROFILE IMAGE UPDATED
    // ======================================================

    const handleProfileImageUpdated = (
        updatedUser
    ) => {
        setUser(
            (currentUser) => ({
                ...currentUser,
                ...updatedUser,
            })
        );
    };


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <DashboardLayout
            role={role}
            showHeader={false}
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-6xl
                    space-y-4
                "
            >
                {/* HEADER */}

                <section
                    className="
                        flex
                        flex-col
                        gap-4
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        shadow-sm
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:p-5
                    "
                >
                    <div>
                        <p
                            className="
                                text-[8px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-blue-600
                            "
                        >
                            My Account
                        </p>


                        <h1
                            className="
                                mt-1
                                text-[18px]
                                font-semibold
                                text-slate-800
                                sm:text-[20px]
                            "
                        >
                            Profile
                        </h1>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-slate-500
                            "
                        >
                            View your account information and update your profile image.
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                dashboardPath
                            )
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-4
                            py-2.5
                            text-[9px]
                            font-medium
                            text-slate-600
                            transition
                            hover:bg-slate-50
                            sm:w-auto
                        "
                    >
                        ← Back to Dashboard
                    </button>
                </section>


                <FeedbackAlert
                    type="error"
                    message={error}
                    onClose={() =>
                        setError("")
                    }
                />


                {/* PROFILE */}

                <ProfileDetails
                    user={user}
                    loading={loading}
                    onProfileImageUpdated={
                        handleProfileImageUpdated
                    }
                />


                {/* PASSWORD */}

                <ChangePasswordForm />
            </div>
        </DashboardLayout>
    );
}


export default ProfilePage;