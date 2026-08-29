function ProfileDetails({
    user,
    loading,
}) {
    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <p className="text-sm text-slate-500">
                    Loading profile...
                </p>

            </div>
        );
    }


    if (!user) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">

                <p className="text-sm text-red-600">
                    Unable to load profile information.
                </p>

            </div>
        );
    }


    const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim();


    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* PROFILE HEADING */}

            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                    {user.firstName
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}
                </div>


                <div>

                    <h2 className="text-lg font-bold text-slate-900">
                        {fullName}
                    </h2>

                    <p className="mt-1 text-xs capitalize text-slate-500">
                        {user.role}
                    </p>


                    <span
                        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${user.status === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"
                            }`}
                    >
                        {user.status === "active"
                            ? "Active Account"
                            : "Deactivated"}
                    </span>

                </div>

            </div>


            {/* PERSONAL DETAILS */}

            <div className="mt-6">

                <h3 className="text-sm font-bold text-slate-900">
                    Personal Details
                </h3>

                <p className="mt-1 text-[10px] text-slate-500">
                    Your account and personal information.
                </p>


                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                    <Detail
                        label="First Name"
                        value={user.firstName}
                    />

                    <Detail
                        label="Last Name"
                        value={user.lastName}
                    />

                    <Detail
                        label="Username"
                        value={user.username}
                    />

                    <Detail
                        label="Email"
                        value={user.email}
                    />

                    <Detail
                        label="Role"
                        value={user.role}
                        capitalize
                    />

                    <Detail
                        label="Account Status"
                        value={user.status}
                        capitalize
                    />


                    {user.age !== undefined &&
                        user.age !== null && (
                            <Detail
                                label="Age"
                                value={user.age}
                            />
                        )}


                    {user.gender && (
                        <Detail
                            label="Gender"
                            value={user.gender}
                            capitalize
                        />
                    )}


                    {user.phoneNumber && (
                        <Detail
                            label="Phone Number"
                            value={user.phoneNumber}
                        />
                    )}


                    {user.address && (
                        <Detail
                            label="Address"
                            value={user.address}
                        />
                    )}

                </div>

            </div>

        </section>
    );
}


function Detail({
    label,
    value,
    capitalize = false,
}) {
    return (
        <div>

            <p className="mb-2 text-[10px] font-semibold text-slate-500">
                {label}
            </p>


            <div
                className={`flex min-h-[44px] items-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-[11px] font-medium text-slate-700 ${capitalize
                    ? "capitalize"
                    : ""
                    }`}
            >
                {value ||
                    "Not provided"}
            </div>

        </div>
    );
}


export default ProfileDetails;