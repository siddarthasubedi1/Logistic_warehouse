import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProfileDetails from "../components/account/ProfileDetails";
import ChangePasswordForm from "../components/account/ChangePasswordForm";
import FeedbackAlert from "../components/ui/FeedbackAlert";
import LoadingCard from "../components/ui/LoadingCard";

import api from "../services/api";

import {
    saveSessionUser,
} from "../utils/session";


const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:5000";


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


    useEffect(() => {
        let mounted =
            true;


        const loadProfile =
            async () => {
                try {
                    setLoading(
                        true
                    );

                    setError(
                        ""
                    );


                    const response =
                        await api.get(
                            "/users/me"
                        );


                    if (
                        !mounted
                    ) {
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
                        saveSessionUser(
                            currentUser
                        );
                    }

                } catch (
                error
                ) {
                    console.error(
                        "Profile loading error:",
                        error
                    );


                    if (
                        mounted
                    ) {
                        setError(
                            error.response?.data?.message ||
                            "Unable to load profile."
                        );
                    }

                } finally {
                    if (
                        mounted
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            };


        loadProfile();


        return () => {
            mounted =
                false;
        };
    }, []);


    if (
        loading
    ) {
        return (
            <DashboardLayout
                role={role}
                showHeader={false}
            >
                <div className="app-page">
                    <LoadingCard
                        message="Loading your profile..."
                    />
                </div>
            </DashboardLayout>
        );
    }


    const name =
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
        user?.username ||
        "User";


    const normalizedRole =
        String(
            user?.role ||
            role ||
            ""
        )
            .trim()
            .toLowerCase();


    const profileImageUrl =
        user?.profileImage
            ? user.profileImage.startsWith(
                "http"
            )
                ? user.profileImage
                : `${BACKEND_URL}${user.profileImage}`
            : "";


    return (
        <DashboardLayout
            role={role}
            showHeader={false}
            user={user}
        >
            <div className="profile-figma-page">

                <FeedbackAlert
                    type="error"
                    message={error}
                    onClose={() =>
                        setError("")
                    }
                />


                {/* TOP BAR */}

                <div className="profile-topbar">

                    <div>

                        <p className="profile-eyebrow">
                            ● &nbsp; Account Center
                        </p>


                        <h1>
                            My Profile
                        </h1>


                        <span>
                            Manage your personal details, profile image and account security.
                        </span>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                normalizedRole ===
                                    "trainer"
                                    ? "/trainer"
                                    : "/trainee"
                            )
                        }
                    >
                        ‹ &nbsp; Back to Dashboard
                    </button>

                </div>


                {/* SECURITY BANNER */}

                <section className="profile-security-banner">

                    <div>

                        <p>
                            UK LOGIWARE SAFETY TRAINING
                        </p>


                        <h2>
                            Keep your account secure and up to date
                        </h2>


                        <span>
                            Update your profile photo and manage your password from one secure place.
                        </span>

                    </div>


                    <div className="profile-role-pill">

                        <span>
                            ◈
                        </span>


                        <div>

                            <small>
                                Account Role
                            </small>


                            <strong>
                                {normalizedRole ===
                                    "trainer"
                                    ? "Trainer"
                                    : "Trainee"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* MAIN */}

                <div className="profile-main-grid">

                    {/* PROFILE */}

                    <section className="profile-details-card">

                        <div className="profile-user-strip">

                            <div className="profile-avatar-wrap">

                                {profileImageUrl ? (
                                    <img
                                        src={profileImageUrl}
                                        alt={`${name} profile`}
                                    />
                                ) : (
                                    <div className="profile-avatar-fallback">
                                        {name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                )}


                                <span>
                                    ✎
                                </span>

                            </div>


                            <div>

                                <div className="profile-name-line">

                                    <h2>
                                        {name}
                                    </h2>


                                    <span>
                                        ● &nbsp; Active Account
                                    </span>

                                </div>


                                <p>
                                    {normalizedRole ===
                                        "trainer"
                                        ? "Trainer Account"
                                        : "Trainee Account"}
                                </p>


                                <small>
                                    Click your profile image or the edit icon to choose a JPG, PNG or WebP image up to 2 MB.
                                </small>

                            </div>

                        </div>


                        <div className="profile-details-heading">

                            <div>

                                <h3>
                                    Personal Details
                                </h3>


                                <p>
                                    Your account and personal information.
                                </p>

                            </div>


                            <span>
                                Read only
                            </span>

                        </div>


                        <ProfileDetails
                            user={user}
                        />

                    </section>


                    {/* PASSWORD */}

                    <section className="profile-password-card">

                        <div className="profile-password-heading">

                            <div className="profile-lock-icon">
                                ♙
                            </div>


                            <div>

                                <p>
                                    SECURITY
                                </p>


                                <h2>
                                    Change Password
                                </h2>


                                <span>
                                    Create a strong password to keep your account protected.
                                </span>

                            </div>

                        </div>


                        <ChangePasswordForm />

                    </section>

                </div>

            </div>

        </DashboardLayout>
    );
}


export default ProfilePage;