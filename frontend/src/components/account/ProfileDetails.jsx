import {
    useRef,
    useState,
} from "react";

import api from "../../services/api";

import FeedbackAlert from "../ui/FeedbackAlert";


const BACKEND_URL =
    "http://localhost:5000";


function ProfileDetails({
    user,
    loading,
    onProfileImageUpdated,
}) {
    const fileInputRef =
        useRef(null);


    const [
        uploading,
        setUploading,
    ] = useState(false);


    const [
        imageError,
        setImageError,
    ] = useState("");


    const [
        imageSuccess,
        setImageSuccess,
    ] = useState("");


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <section
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                "
            >
                <div
                    className="
                        animate-pulse
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >
                        <div
                            className="
                                h-16
                                w-16
                                rounded-full
                                bg-slate-100
                            "
                        />


                        <div
                            className="
                                flex-1
                            "
                        >
                            <div
                                className="
                                    h-4
                                    w-36
                                    rounded
                                    bg-slate-100
                                "
                            />

                            <div
                                className="
                                    mt-2
                                    h-3
                                    w-48
                                    rounded
                                    bg-slate-100
                                "
                            />
                        </div>
                    </div>


                    <div
                        className="
                            mt-6
                            grid
                            gap-3
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >
                        {Array.from({
                            length: 6,
                        }).map(
                            (
                                _,
                                index
                            ) => (
                                <div
                                    key={index}
                                    className="
                                        h-16
                                        rounded-lg
                                        bg-slate-100
                                    "
                                />
                            )
                        )}
                    </div>
                </div>
            </section>
        );
    }


    // ======================================================
    // EMPTY
    // ======================================================

    if (!user) {
        return (
            <section
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                "
            >
                <p
                    className="
                        text-[10px]
                        text-slate-500
                    "
                >
                    Profile information is unavailable.
                </p>
            </section>
        );
    }


    // ======================================================
    // USER INFORMATION
    // ======================================================

    const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`
            .trim() ||
        "User";


    const initial =
        user.firstName
            ?.charAt(0)
            ?.toUpperCase() ||
        "U";


    const profileImageUrl =
        user.profileImage
            ? `${BACKEND_URL}${user.profileImage}`
            : "";


    const assignedSections =
        Array.isArray(
            user.assignedTrainingSections
        )
            ? user.assignedTrainingSections
            : [];


    // ======================================================
    // UPLOAD IMAGE
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
                setUploading(true);


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
                    response.data?.user;


                if (!updatedUser) {
                    throw new Error(
                        "Updated profile was not returned."
                    );
                }


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


                onProfileImageUpdated?.(
                    updatedUser
                );


                setImageSuccess(
                    response.data
                        ?.message ||
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
                    "Unable to upload profile image."
                );

            } finally {
                setUploading(false);

                event.target.value =
                    "";
            }
        };


    // ======================================================
    // UI
    // ======================================================

    return (
        <section
            className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            {/* PROFILE TOP */}

            <div
                className="
                    border-b
                    border-slate-100
                    p-4
                    sm:p-5
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                    "
                >
                    {/* IMAGE */}

                    <div
                        className="
                            relative
                            w-fit
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                handleAvatarClick
                            }
                            disabled={
                                uploading
                            }
                            className="
                                group
                                relative
                                block
                                h-20
                                w-20
                                overflow-hidden
                                rounded-full
                                border-4
                                border-white
                                bg-blue-50
                                shadow-sm
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
                                        h-full
                                        w-full
                                        object-cover
                                    "
                                />
                            ) : (
                                <span
                                    className="
                                        flex
                                        h-full
                                        w-full
                                        items-center
                                        justify-center
                                        text-xl
                                        font-semibold
                                        text-blue-600
                                    "
                                >
                                    {initial}
                                </span>
                            )}


                            <span
                                className="
                                    absolute
                                    inset-0
                                    flex
                                    items-center
                                    justify-center
                                    bg-slate-900/50
                                    text-[8px]
                                    font-medium
                                    text-white
                                    opacity-0
                                    transition
                                    group-hover:opacity-100
                                "
                            >
                                {uploading
                                    ? "Uploading..."
                                    : "Change"}
                            </span>
                        </button>


                        <input
                            ref={
                                fileInputRef
                            }
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={
                                handleImageChange
                            }
                            className="hidden"
                        />
                    </div>


                    {/* NAME */}

                    <div
                        className="
                            min-w-0
                        "
                    >
                        <h2
                            className="
                                break-words
                                text-[16px]
                                font-semibold
                                text-slate-800
                            "
                        >
                            {fullName}
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-slate-400
                            "
                        >
                            @{user.username || "—"}
                        </p>


                        <div
                            className="
                                mt-2
                                flex
                                flex-wrap
                                gap-2
                            "
                        >
                            <Badge>
                                {formatLabel(
                                    user.role
                                )}
                            </Badge>


                            <Badge>
                                {formatLabel(
                                    user.status
                                )}
                            </Badge>
                        </div>


                        <p
                            className="
                                mt-3
                                text-[7px]
                                text-slate-400
                            "
                        >
                            Click your profile image to upload a new image. Maximum 2 MB.
                        </p>
                    </div>
                </div>
            </div>


            {/* FEEDBACK */}

            <div
                className="
                    space-y-2
                    px-4
                    pt-4
                    sm:px-5
                "
            >
                <FeedbackAlert
                    type="success"
                    message={
                        imageSuccess
                    }
                    onClose={() =>
                        setImageSuccess("")
                    }
                />


                <FeedbackAlert
                    type="error"
                    message={
                        imageError
                    }
                    onClose={() =>
                        setImageError("")
                    }
                />
            </div>


            {/* DETAILS */}

            <div
                className="
                    p-4
                    sm:p-5
                "
            >
                <h3
                    className="
                        text-[11px]
                        font-semibold
                        text-slate-800
                    "
                >
                    Personal Information
                </h3>


                <div
                    className="
                        mt-4
                        grid
                        gap-3
                        sm:grid-cols-2
                        xl:grid-cols-3
                    "
                >
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
                        label="Age"
                        value={
                            user.age
                        }
                    />

                    <DetailField
                        label="Gender"
                        value={
                            formatLabel(
                                user.gender
                            )
                        }
                    />

                    <DetailField
                        label="Email"
                        value={
                            user.email ||
                            user.personalEmail
                        }
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
                            formatAddress(
                                user.address
                            )
                        }
                    />

                    <DetailField
                        label="Username"
                        value={
                            user.username
                        }
                    />

                    <DetailField
                        label="Role"
                        value={
                            formatLabel(
                                user.role
                            )
                        }
                    />
                </div>


                {/* TRAINING */}

                {assignedSections.length >
                    0 && (
                        <div
                            className="
                            mt-6
                            border-t
                            border-slate-100
                            pt-5
                        "
                        >
                            <h3
                                className="
                                text-[11px]
                                font-semibold
                                text-slate-800
                            "
                            >
                                Training Access
                            </h3>


                            <div
                                className="
                                mt-3
                                flex
                                flex-wrap
                                gap-2
                            "
                            >
                                {assignedSections.map(
                                    (
                                        section
                                    ) => (
                                        <span
                                            key={
                                                section
                                            }
                                            className="
                                            rounded-full
                                            bg-blue-50
                                            px-3
                                            py-1.5
                                            text-[8px]
                                            font-medium
                                            text-blue-600
                                        "
                                        >
                                            {formatTrainingSection(
                                                section
                                            )}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    )}
            </div>
        </section>
    );
}


function DetailField({
    label,
    value,
}) {
    return (
        <div
            className="
                min-w-0
                rounded-lg
                bg-slate-50
                p-3
            "
        >
            <p
                className="
                    text-[7px]
                    uppercase
                    tracking-wide
                    text-slate-400
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    break-words
                    text-[9px]
                    font-medium
                    text-slate-700
                "
            >
                {value ===
                    undefined ||
                    value ===
                    null ||
                    value ===
                    ""
                    ? "—"
                    : value}
            </p>
        </div>
    );
}


function Badge({
    children,
}) {
    return (
        <span
            className="
                rounded-full
                bg-slate-100
                px-2.5
                py-1
                text-[7px]
                font-medium
                text-slate-600
            "
        >
            {children}
        </span>
    );
}


function formatLabel(
    value
) {
    if (!value) {
        return "—";
    }


    return String(value)
        .replace(
            /[-_]/g,
            " "
        )
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
}


function formatAddress(
    address
) {
    if (!address) {
        return "—";
    }


    if (
        typeof address ===
        "string"
    ) {
        return address;
    }


    if (
        typeof address ===
        "object"
    ) {
        return Object.values(
            address
        )
            .filter(Boolean)
            .join(", ");
    }


    return String(
        address
    );
}


function formatTrainingSection(
    section
) {
    if (
        section ===
        "manual-handling"
    ) {
        return "Manual Handling";
    }


    if (
        section ===
        "working-at-height"
    ) {
        return "Working at Height";
    }


    return formatLabel(
        section
    );
}


export default ProfileDetails;