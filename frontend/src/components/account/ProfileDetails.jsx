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
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="animate-pulse">

                    <div className="h-16 w-16 rounded-full bg-slate-100" />

                    <div className="mt-5 h-4 w-40 rounded bg-slate-100" />

                    <div className="mt-3 h-3 w-56 rounded bg-slate-100" />


                    <div className="mt-7 grid gap-4 sm:grid-cols-2">

                        {Array.from({
                            length: 8,
                        }).map(
                            (
                                _,
                                index
                            ) => (
                                <div
                                    key={
                                        index
                                    }
                                    className="h-16 rounded-xl bg-slate-100"
                                />
                            )
                        )}

                    </div>

                </div>

            </section>
        );
    }


    if (!user) {
        return (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

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
    // OPEN IMAGE PICKER
    // ======================================================

    const handleAvatarClick =
        () => {
            if (uploading) {
                return;
            }


            setImageError("");
            setImageSuccess("");


            fileInputRef.current
                ?.click();
        };


    // ======================================================
    // IMAGE UPLOAD
    // ======================================================

    const handleImageChange =
        async (
            event
        ) => {
            const file =
                event.target
                    .files?.[0];


            setImageError("");
            setImageSuccess("");


            if (!file) {
                return;
            }


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
                setUploading(
                    true
                );


                const formData =
                    new FormData();


                formData.append(
                    "profileImage",
                    file,
                    file.name
                );


                const response =
                    await api.patch(
                        "/users/me/profile-image",
                        formData
                    );


                const updatedUser =
                    response.data
                        ?.user;


                if (!updatedUser) {
                    throw new Error(
                        "The server did not return the updated profile."
                    );
                }


                // ===========================================
                // UPDATE SESSION STORAGE
                // ===========================================

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


                // ===========================================
                // UPDATE PAGE STATE
                // ===========================================

                onProfileImageUpdated?.(
                    updatedUser
                );


                setImageSuccess(
                    "Profile image updated successfully."
                );

            } catch (error) {
                console.error(
                    "Profile image upload error:",
                    error
                );


                setImageError(
                    error.response
                        ?.data
                        ?.message ||
                    error.message ||
                    "Unable to update profile image."
                );

            } finally {
                setUploading(
                    false
                );


                if (
                    fileInputRef.current
                ) {
                    fileInputRef.current.value =
                        "";
                }
            }
        };


    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


            {/* PROFILE TOP */}

            <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/70 px-6 py-6">

                <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-blue-100/50 blur-2xl" />


                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">


                    {/* AVATAR */}

                    <div className="relative shrink-0">

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
                                    className="h-[78px] w-[78px] rounded-full border-4 border-white object-cover shadow-md"
                                />
                            ) : (
                                <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full border-4 border-white bg-blue-100 text-2xl font-bold text-blue-600 shadow-md">
                                    {initial}
                                </div>
                            )}


                            {/* CAMERA HOVER */}

                            <span className="absolute inset-1 flex items-center justify-center rounded-full bg-slate-900/0 text-white opacity-0 transition group-hover:bg-slate-900/45 group-hover:opacity-100">

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


                            {uploading && (
                                <span className="absolute inset-1 flex items-center justify-center rounded-full bg-slate-900/65 text-[8px] font-semibold text-white">
                                    Uploading...
                                </span>
                            )}

                        </button>


                        {/* EDIT BUTTON */}

                        <button
                            type="button"
                            onClick={
                                handleAvatarClick
                            }
                            disabled={
                                uploading
                            }
                            title="Change profile image"
                            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-[#1769e0] text-white shadow-md transition hover:bg-[#0f5dc9] disabled:opacity-50"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-3.5 w-3.5"
                            >
                                <path d="M12 20h9" />

                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>

                        </button>


                        {/* HIDDEN FILE INPUT */}

                        <input
                            ref={
                                fileInputRef
                            }
                            type="file"
                            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                            onChange={
                                handleImageChange
                            }
                            className="hidden"
                        />

                    </div>


                    {/* USER INFO */}

                    <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                            <h2 className="truncate text-[17px] font-bold text-slate-900">
                                {fullName}
                            </h2>


                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-700 ring-1 ring-emerald-100">

                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                {user.status ===
                                    "active"
                                    ? "Active Account"
                                    : "Deactivated Account"}

                            </span>

                        </div>


                        <p className="mt-1 text-[10px] font-semibold capitalize text-blue-600">
                            {user.role} Account
                        </p>


                        <p className="mt-3 max-w-lg text-[9px] leading-4 text-slate-500">
                            Click your profile image or the edit icon to choose a JPG, PNG or WebP image up to 2 MB.
                        </p>

                    </div>

                </div>

            </div>


            {/* IMAGE MESSAGE */}

            {(imageError ||
                imageSuccess) && (
                    <div className="px-6 pt-5">

                        {imageError && (
                            <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[10px] text-red-600">

                                <span className="font-bold">
                                    !
                                </span>

                                <span>
                                    {imageError}
                                </span>

                            </div>
                        )}


                        {imageSuccess && (
                            <div className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[10px] text-emerald-700">

                                <span>
                                    ✓
                                </span>

                                <span>
                                    {imageSuccess}
                                </span>

                            </div>
                        )}

                    </div>
                )}


            {/* PERSONAL DETAILS */}

            <div className="p-6">

                <div className="flex items-center justify-between gap-4">

                    <div>

                        <h3 className="text-[13px] font-bold text-slate-900">
                            Personal Details
                        </h3>

                        <p className="mt-1 text-[9px] text-slate-500">
                            Your account and personal information.
                        </p>

                    </div>


                    <span className="rounded-lg bg-slate-50 px-3 py-2 text-[9px] font-semibold text-slate-500">
                        Read only
                    </span>

                </div>


                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                    <DetailField
                        label="First Name"
                        value={
                            user.firstName
                        }
                        icon="user"
                    />

                    <DetailField
                        label="Last Name"
                        value={
                            user.lastName
                        }
                        icon="user"
                    />

                    <DetailField
                        label="Username"
                        value={
                            user.username
                        }
                        icon="at"
                    />

                    <DetailField
                        label="Email"
                        value={
                            user.email
                        }
                        icon="mail"
                    />

                    <DetailField
                        label="Role"
                        value={
                            user.role
                        }
                        capitalize
                        icon="role"
                    />

                    <DetailField
                        label="Account Status"
                        value={
                            user.status
                        }
                        capitalize
                        icon="status"
                    />

                    <DetailField
                        label="Age"
                        value={
                            user.age
                        }
                        icon="calendar"
                    />

                    <DetailField
                        label="Gender"
                        value={
                            user.gender
                        }
                        capitalize
                        icon="user"
                    />

                    <DetailField
                        label="Phone Number"
                        value={
                            user.phoneNumber
                        }
                        icon="phone"
                    />

                    <DetailField
                        label="Address"
                        value={
                            user.address
                        }
                        icon="location"
                    />

                </div>

            </div>

        </section>
    );
}


function DetailField({
    label,
    value,
    capitalize = false,
    icon,
}) {
    const displayValue =
        value === null ||
            value === undefined ||
            value === ""
            ? "—"
            : value;


    return (
        <div>

            <p className="mb-2 text-[9px] font-semibold text-slate-500">
                {label}
            </p>


            <div className="flex min-h-[50px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3">

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm ring-1 ring-slate-100">

                    <FieldIcon
                        type={
                            icon
                        }
                    />

                </div>


                <p
                    className={`min-w-0 break-words text-[10px] font-semibold text-slate-700 ${capitalize
                        ? "capitalize"
                        : ""
                        }`}
                >
                    {displayValue}
                </p>

            </div>

        </div>
    );
}


function FieldIcon({
    type,
}) {
    const common =
        "h-3.5 w-3.5";


    if (type === "mail") {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    common
                }
            >
                <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                />

                <path d="m4 7 8 6 8-6" />
            </svg>
        );
    }


    if (type === "phone") {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    common
                }
            >
                <path d="M7 3h3l1.5 4-2 1.5a15 15 0 0 0 6 6l1.5-2L21 14v3c0 2-1 4-4 4C9.3 21 3 14.7 3 7c0-3 2-4 4-4Z" />
            </svg>
        );
    }


    if (
        type ===
        "location"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    common
                }
            >
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />

                <circle
                    cx="12"
                    cy="10"
                    r="2.5"
                />
            </svg>
        );
    }


    if (
        type ===
        "calendar"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    common
                }
            >
                <rect
                    x="4"
                    y="5"
                    width="16"
                    height="15"
                    rx="2"
                />

                <path d="M8 3v4M16 3v4M4 10h16" />
            </svg>
        );
    }


    if (type === "at") {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={
                    common
                }
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
                className={
                    common
                }
            >
                <path d="M12 3 5 6v5c0 4.7 2.9 8.2 7 10 4.1-1.8 7-5.3 7-10V6l-7-3Z" />
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
                className={
                    common
                }
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
            className={
                common
            }
        >
            <circle
                cx="12"
                cy="8"
                r="4"
            />

            <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
        </svg>
    );
}


export default ProfileDetails;