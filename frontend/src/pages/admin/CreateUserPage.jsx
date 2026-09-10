import DashboardLayout from "../../components/dashboard/DashboardLayout";

import CreateUserForm from "../../components/admin/CreateUserForm";


function CreateUserPage() {
    return (
        <DashboardLayout
            role="admin"
            showHeader={
                false
            }
        >

            <div className="space-y-5">

                {/* ================================================= */}
                {/* PAGE HEADER */}
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

                    {/* DECORATION */}

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
                            right-20
                            top-6
                            hidden
                            h-24
                            w-24
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
                            items-start
                            gap-4
                        "
                    >

                        {/* ICON */}

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
                                backdrop-blur
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
                                    cx="9"
                                    cy="8"
                                    r="3"
                                />

                                <path d="M3 20c.5-4 2.5-6 6-6" />

                                <path d="M18 13v8" />

                                <path d="M14 17h8" />
                            </svg>
                        </div>


                        {/* TEXT */}

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
                                User Administration
                            </p>


                            <h1
                                className="
                                    mt-1
                                    text-xl
                                    font-bold
                                    sm:text-2xl
                                "
                            >
                                Create User
                            </h1>


                            <p
                                className="
                                    mt-2
                                    max-w-2xl
                                    text-[11px]
                                    leading-5
                                    text-blue-100
                                    sm:text-xs
                                "
                            >
                                Add Trainer or Trainee information,
                                review the pending account and generate
                                secure temporary login credentials.
                            </p>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* PROCESS GUIDE */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    <ProcessStep
                        number="01"
                        title="Enter Details"
                        description="Add personal information."
                    />


                    <ProcessStep
                        number="02"
                        title="Select Role"
                        description="Choose Trainer or Trainee."
                    />


                    <ProcessStep
                        number="03"
                        title="Review Account"
                        description="Confirm pending-user information."
                    />


                    <ProcessStep
                        number="04"
                        title="Generate Credentials"
                        description="Create temporary username and password."
                    />

                </section>


                {/* ================================================= */}
                {/* APPROVED CREATE USER FORM */}
                {/* ================================================= */}

                <CreateUserForm />


                {/* ================================================= */}
                {/* SECURITY NOTE */}
                {/* ================================================= */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-amber-200
                        bg-gradient-to-r
                        from-amber-50
                        to-white
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
                                text-amber-600
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
                                <path d="M12 3 3 20h18L12 3Z" />

                                <path d="M12 9v4" />

                                <path d="M12 17h.01" />
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
                                Temporary Credential Security
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
                                Generated credentials are intended for
                                the user's first login. Trainer and
                                Trainee accounts are then required to
                                change the temporary password.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </DashboardLayout>
    );
}


// ======================================================
// PROCESS STEP
// ======================================================

function ProcessStep({
    number,
    title,
    description,
}) {
    return (
        <div
            className="
                relative
                overflow-hidden
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
                    absolute
                    right-3
                    top-2
                    text-3xl
                    font-black
                    text-slate-100
                "
            >
                {number}
            </div>


            <div
                className="
                    relative
                    z-10
                "
            >

                <div
                    className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-50
                        text-[9px]
                        font-bold
                        text-blue-700
                    "
                >
                    {number}
                </div>


                <p
                    className="
                        mt-3
                        text-[11px]
                        font-bold
                        text-slate-800
                    "
                >
                    {title}
                </p>


                <p
                    className="
                        mt-1
                        text-[9px]
                        leading-4
                        text-slate-500
                    "
                >
                    {description}
                </p>

            </div>

        </div>
    );
}


export default CreateUserPage;