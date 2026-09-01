import {
    useRef,
    useState,
} from "react";

import api from "../../services/api";


const BACKEND_URL =
    "http://localhost:5000";


function ProfileDetails({
    user,
    loading,
    onProfileImageUpdated,
}) {
    const fileInputRef =
        useRef(null);


    const [uploading, setUploading] =
        useState(false);

    const [imageError, setImageError] =
        useState("");

    const [imageSuccess, setImageSuccess] =
        useState("");


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    Loading profile...
                </p>
            </section>
        );
    }


    if (!user) {
        return (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    Profile information is unavailable.
                </p>
            </section>
        );
    }


    const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim();


    const initial =
        user.firstName
            ?.charAt(0)
            ?.toUpperCase() ||
        "U";


    const profileImageUrl =
        user.profileImage
            ? `${BACKEND_URL}${user.profileImage}`
            : "";


    // ======================================================
    // OPEN FILE CHOOSER
    // ======================================================

    const handleAvatarClick = () => {
        if (uploading) {
            return;
        }


        fileInputRef.current?.click();
    };


    // ======================================================
    // SELECT + UPLOAD IMAGE
    // ======================================================

    const handleImageChange =
        async (event) => {
            const file =
                event.target.files?.[0];


            setImageError("");
            setImageSuccess("");


            if (!file) {
                return;
            }


            // ----------------------------------------------
            // FRONTEND FILE TYPE CHECK
            // Backend validates again.
            // ----------------------------------------------

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {
                setImageError(
                    "Only JPG, PNG and WebP images are allowed."
                );


                event.target.value =
                    "";

                return;
            }


            // ----------------------------------------------
            // FRONTEND SIZE CHECK
            // Maximum 2 MB.
            // ----------------------------------------------

            if (
                file.size >
                2 * 1024 * 1024
            ) {
                setImageError(
                    "Profile image must not be larger than 2 MB."
                );


                event.target.value =
                    "";

                return;
            }


            try {
                setUploading(true);


                const formData =
                    new FormData();


                formData.append(
                    "profileImage",
                    file
                );


                /*
                    Do NOT manually set Content-Type.

                    Axios/browser will automatically
                    create the correct multipart boundary.
                */

                const response =
                    await api.patch(
                        "/users/me/profile-image",
                        formData
                    );


                const updatedUser =
                    response.data?.user;


                if (
                    updatedUser
                ) {
                    // --------------------------------------
                    // UPDATE SESSION USER
                    // --------------------------------------

                    const storedUserRaw =
                        sessionStorage.getItem(
                            "user"
                        );


                    let storedUser = {};


                    try {
                        storedUser =
                            storedUserRaw
                                ? JSON.parse(
                                    storedUserRaw
                                )
                                : {};
                    } catch {
                        storedUser = {};
                    }


                    const mergedUser = {
                        ...storedUser,
                        ...updatedUser,
                    };


                    sessionStorage.setItem(
                        "user",
                        JSON.stringify(
                            mergedUser
                        )
                    );


                    // --------------------------------------
                    // UPDATE PROFILE PAGE STATE
                    // --------------------------------------

                    if (
                        onProfileImageUpdated
                    ) {
                        onProfileImageUpdated(
                            updatedUser
                        );
                    }
                }


                setImageSuccess(
                    "Profile image updated successfully."
                );

            } catch (error) {
                console.error(
                    "Profile image upload error:",
                    error
                );


                setImageError(
                    error.response?.data
                        ?.message ||
                    "Unable to update profile image."
                );

            } finally {
                setUploading(false);


                if (
                    fileInputRef.current
                ) {
                    fileInputRef.current.value =
                        "";
                }
            }
        };


    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* ==================================================
                PROFILE HEADER
            ================================================== */}

            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">

                {/* PROFILE IMAGE */}

                <div className="relative">

                    <button
                        type="button"
                        onClick={
                            handleAvatarClick
                        }
                        disabled={
                            uploading
                        }
                        title="Change profile image"
                        className="group relative block rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-wait"
                    >

                        {profileImageUrl ? (
                            <img
                                src={
                                    profileImageUrl
                                }
                                alt={
                                    `${fullName} profile`
                                }
                                className="h-14 w-14 rounded-full border border-slate-200 object-cover"
                            />
                        ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                                {initial}
                            </div>
                        )}


                        {/* HOVER CAMERA OVERLAY */}

                        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/0 text-white opacity-0 transition group-hover:bg-slate-900/45 group-hover:opacity-100">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <path d="M14.5 4 16 6h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l1.5-2h5Z" />

                                <circle
                                    cx="12"
                                    cy="12"
                                    r="3"
                                />
                            </svg>

                        </span>


                        {/* UPLOADING */}

                        {uploading && (
                            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/60 text-[8px] font-semibold text-white">
                                Uploading
                            </span>
                        )}

                    </button>


                    {/* SMALL EDIT ICON */}

                    <button
                        type="button"
                        onClick={
                            handleAvatarClick
                        }
                        disabled={
                            uploading
                        }
                        title="Change profile image"
                        className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-2.5 w-2.5"
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                    </button>


                    {/* HIDDEN INPUT */}

                    <input
                        ref={
                            fileInputRef
                        }
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={
                            handleImageChange
                        }
                        className="hidden"
                    />

                </div>


                {/* USER NAME */}

                <div>

                    <h2 className="text-[15px] font-bold text-slate-900">
                        {fullName}
                    </h2>


                    <p className="mt-1 text-[10px] capitalize text-slate-500">
                        {user.role}
                    </p>


                    <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-semibold text-emerald-600">
                        {user.status ===
                            "active"
                            ? "Active Account"
                            : "Deactivated Account"}
                    </span>

                </div>

            </div>


            {/* IMAGE MESSAGE */}

            {imageError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[9px] text-red-600">
                    {imageError}
                </div>
            )}


            {imageSuccess && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[9px] text-emerald-600">
                    {imageSuccess}
                </div>
            )}


            {/* ==================================================
                PERSONAL DETAILS
            ================================================== */}

            <div className="pt-5">

                <h3 className="text-[12px] font-bold text-slate-900">
                    Personal Details
                </h3>


                <p className="mt-1 text-[9px] text-slate-500">
                    Your account and personal information.
                </p>


                <div className="mt-5 grid gap-x-4 gap-y-4 sm:grid-cols-2">

                    <DetailField
                        label="First Name"
                        value={
                            user.firstName
                        }
                    />

                    <DetailField
                        label="Last Name"
                        value={
                            user.lastName
                        }
                    />

                    <DetailField
                        label="Username"
                        value={
                            user.username
                        }
                    />

                    <DetailField
                        label="Email"
                        value={
                            user.email
                        }
                    />

                    <DetailField
                        label="Role"
                        value={
                            user.role
                        }
                        capitalize
                    />

                    <DetailField
                        label="Account Status"
                        value={
                            user.status
                        }
                        capitalize
                    />

                    <DetailField
                        label="Age"
                        value={
                            user.age
                        }
                    />

                    <DetailField
                        label="Gender"
                        value={
                            user.gender
                        }
                        capitalize
                    />

                    <DetailField
                        label="Phone Number"
                        value={
                            user.phoneNumber
                        }
                    />

                    <DetailField
                        label="Address"
                        value={
                            user.address
                        }
                    />

                </div>

            </div>

        </section>
    );
}


// ======================================================
// DETAIL FIELD
// ======================================================

function DetailField({
    label,
    value,
    capitalize = false,
}) {
    return (
        <div>

            <label className="mb-2 block text-[9px] font-medium text-slate-500">
                {label}
            </label>


            <div
                className={`min-h-[38px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-[10px] font-medium text-slate-800 ${capitalize
                    ? "capitalize"
                    : ""
                    }`}
            >
                {value !==
                    undefined &&
                    value !==
                    null &&
                    value !==
                    ""
                    ? value
                    : "—"}
            </div>

        </div>
    );
}


export default ProfileDetails;