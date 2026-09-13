function ProfileDetails({
    user,
}) {
    if (
        !user
    ) {
        return (
            <div
                className="
                    p-5
                    text-[9px]
                    text-[#64748b]
                "
            >
                Profile information is unavailable.
            </div>
        );
    }


    const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`
            .trim() ||
        user.fullName ||
        "—";


    const assignedSections =
        Array.isArray(
            user.assignedTrainingSections
        )
            ? user.assignedTrainingSections
            : [];


    return (
        <div
            className="
                p-5
            "
        >
            <div
                className="
                    grid
                    gap-4
                    md:grid-cols-2
                "
            >
                <Detail
                    label="Full Name"
                    value={
                        fullName
                    }
                />

                <Detail
                    label="Username"
                    value={
                        user.username ||
                        "—"
                    }
                />

                <Detail
                    label="Email Address"
                    value={
                        user.email ||
                        user.personalEmail ||
                        "—"
                    }
                />

                <Detail
                    label="Role"
                    value={
                        formatRole(
                            user.role
                        )
                    }
                />

                <Detail
                    label="Age"
                    value={
                        user.age ||
                        "—"
                    }
                />

                <Detail
                    label="Account Status"
                    value={
                        formatStatus(
                            user.status ||
                            (
                                user.isActive ===
                                    false
                                    ? "inactive"
                                    : "active"
                            )
                        )
                    }
                    status
                />
            </div>


            {user.address && (
                <div
                    className="
                        mt-4
                    "
                >
                    <Detail
                        label="Address"
                        value={
                            user.address
                        }
                    />
                </div>
            )}


            {assignedSections.length >
                0 && (
                    <div
                        className="
                        mt-5
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-[#f8fafc]
                        p-4
                    "
                    >
                        <p
                            className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.08em]
                            text-[#64748b]
                        "
                        >
                            Assigned Training Area
                        </p>


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
                                        border
                                        border-blue-100
                                        bg-blue-50
                                        px-3
                                        py-1.5
                                        text-[8px]
                                        font-semibold
                                        text-blue-600
                                    "
                                    >
                                        {formatSection(
                                            section
                                        )}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                )}


            <div
                className="
                    mt-5
                    rounded-xl
                    border
                    border-blue-100
                    bg-blue-50/50
                    p-4
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
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-white
                            text-blue-600
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="
                                h-4
                                w-4
                            "
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />

                            <path d="M12 11v5" />

                            <path d="M12 8h.01" />
                        </svg>
                    </div>


                    <div>
                        <p
                            className="
                                text-[9px]
                                font-semibold
                                text-[#334155]
                            "
                        >
                            Need to update your information?
                        </p>

                        <p
                            className="
                                mt-1
                                text-[8px]
                                leading-4
                                text-[#64748b]
                            "
                        >
                            Contact your Administrator if your name,
                            email, address or other account information
                            needs to be corrected.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


function Detail({
    label,
    value,
    status = false,
}) {
    return (
        <div
            className="
                min-h-[72px]
                rounded-xl
                border
                border-[#e2e8f0]
                bg-white
                px-4
                py-3
            "
        >
            <p
                className="
                    text-[8px]
                    font-medium
                    text-[#64748b]
                "
            >
                {label}
            </p>


            {status ? (
                <span
                    className="
                        mt-2
                        inline-flex
                        rounded-full
                        bg-emerald-50
                        px-2.5
                        py-1
                        text-[8px]
                        font-semibold
                        text-emerald-600
                    "
                >
                    {value}
                </span>
            ) : (
                <p
                    className="
                        mt-2
                        break-words
                        text-[10px]
                        font-semibold
                        text-[#172033]
                    "
                >
                    {value}
                </p>
            )}
        </div>
    );
}


function formatRole(
    role
) {
    const value =
        String(
            role ||
            ""
        ).toLowerCase();


    if (
        value ===
        "admin"
    ) {
        return "Administrator";
    }


    if (
        value ===
        "trainer"
    ) {
        return "Trainer";
    }


    if (
        value ===
        "trainee"
    ) {
        return "Trainee";
    }


    return (
        role ||
        "—"
    );
}


function formatStatus(
    status
) {
    const value =
        String(
            status ||
            ""
        );


    if (
        !value
    ) {
        return "Active";
    }


    return (
        value
            .charAt(0)
            .toUpperCase() +
        value
            .slice(1)
            .toLowerCase()
    );
}


function formatSection(
    value
) {
    const text =
        String(
            value ||
            ""
        )
            .replace(
                /[-_]/g,
                " "
            )
            .trim();


    return text.replace(
        /\b\w/g,
        (
            character
        ) =>
            character.toUpperCase()
    );
}


export default ProfileDetails;