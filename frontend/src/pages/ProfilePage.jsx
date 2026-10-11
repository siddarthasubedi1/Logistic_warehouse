import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import ThemeToggle from "../components/dashboard/ThemeToggle";
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

    const photoInputRef = useRef(null);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoNotice, setPhotoNotice] = useState("");
    const [photoVersion, setPhotoVersion] = useState(0);


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


    const handleProfileImageChange = async (event) => {
        const file = event.target.files?.[0];
        // Allow selecting the same file again following a failed attempt.
        event.target.value = "";
        if (!file) return;
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            setError("Choose a JPG, PNG, or WebP image.");
            setPhotoNotice("");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setError("This photo is too large. Choose an image under 2 MB.");
            setPhotoNotice("");
            return;
        }
        setError("");
        setPhotoNotice("");
        setPhotoUploading(true);
        try {
            const data = new FormData();
            data.append("profileImage", file);
            const response = await api.patch("/users/me/profile-image", data);
            const updatedImage = response.data?.profileImage || response.data?.user?.profileImage;
            if (!updatedImage) throw new Error("The server did not return the saved photo. Please refresh your profile.");
            const updatedUser = { ...user, ...response.data.user, profileImage: updatedImage };
            setUser(updatedUser);
            saveSessionUser(updatedUser);
            setPhotoVersion(version => version + 1);
            setPhotoNotice("Your profile photo has been saved.");
            window.dispatchEvent(new Event("logiware-profile-updated"));
        } catch (uploadError) {
            setError(uploadError.response?.data?.message || uploadError.message || "Photo upload failed. Please try again.");
        } finally {
            setPhotoUploading(false);
        }
    };

    const handleRemovePhoto = async () => {
        if (photoUploading) return;
        setError("");
        setPhotoNotice("");
        setPhotoUploading(true);
        try {
            await api.delete("/users/me/profile-image");
            const updatedUser = { ...user, profileImage: "" };
            setUser(updatedUser);
            saveSessionUser(updatedUser);
            setPhotoNotice("Your profile photo has been removed.");
            window.dispatchEvent(new Event("logiware-profile-updated"));
        } catch (deleteError) {
            setError(deleteError.response?.data?.message || "Unable to remove photo.");
        } finally {
            setPhotoUploading(false);
        }
    };

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
                    onClose={() => setError("")}
                />
                {photoNotice && (
                    <div className="profile-photo-success" role="status">
                        {photoNotice}
                    </div>
                )}


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


                    <div className="profile-topbar-actions">
                        <ThemeToggle />

                        <button
                            type="button"
                            className="profile-back-button"
                            onClick={() =>
                                navigate(
                                    normalizedRole ===
                                        "trainer"
                                        ? "/trainer"
                                        : "/trainee"
                                )
                            }
                        >
                            <span aria-hidden="true">‹</span>
                            Back to Dashboard
                        </button>
                    </div>

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

                            <div className="profile-photo-controls">
                                <input
                                    ref={photoInputRef}
                                    className="profile-photo-file-input"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    aria-label="Choose a profile photo"
                                    onChange={handleProfileImageChange}
                                    disabled={photoUploading}
                                />
                                <button
                                    type="button"
                                    className="profile-avatar-wrap profile-avatar-button"
                                    onClick={() => photoInputRef.current?.click()}
                                    disabled={photoUploading}
                                    aria-label="Change profile picture"
                                    title="Change profile picture"
                                >
                                    <span className="profile-avatar-fallback" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
                                    {profileImageUrl ? (
                                        <img
                                            src={`${profileImageUrl}${profileImageUrl.includes("?") ? "&" : "?"}v=${photoVersion}`}
                                            alt={`${name} profile`}
                                            onError={event => { event.currentTarget.style.visibility = "hidden"; }}
                                            onLoad={event => { event.currentTarget.style.visibility = "visible"; }}
                                        />
                                    ) : null}
                                    <span className="profile-avatar-edit" aria-hidden="true">✎</span>
                                </button>
                                <div className="profile-photo-actions">
                                    <button
                                        type="button"
                                        className="profile-photo-change"
                                        onClick={() => photoInputRef.current?.click()}
                                        disabled={photoUploading}
                                    >
                                        {photoUploading ? "Saving photo…" : profileImageUrl ? "Change photo" : "Add photo"}
                                    </button>
                                    {profileImageUrl && (
                                        <button
                                            type="button"
                                            className="profile-photo-remove"
                                            onClick={handleRemovePhoto}
                                            disabled={photoUploading}
                                        >Remove</button>
                                    )}
                                </div>
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
                                    Upload a JPG, PNG or WebP image (maximum 2 MB).
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