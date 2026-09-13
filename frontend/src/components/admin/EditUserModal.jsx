import {
    useEffect,
    useState,
} from "react";


function getInitialValues(
    user
) {
    return {
        firstName:
            user?.firstName ||
            "",

        lastName:
            user?.lastName ||
            "",

        email:
            user?.email ||
            "",

        phoneNumber:
            user?.phoneNumber ||
            "",

        address:
            user?.address ||
            "",

        age:
            user?.age ||
            "",

        gender:
            user?.gender ||
            "",
    };
}


function EditUserModal({
    open = false,
    user = null,
    loading = false,
    onSave,
    onClose,
}) {
    const [
        values,
        setValues,
    ] = useState(
        getInitialValues(
            user
        )
    );

    const [
        error,
        setError,
    ] = useState("");


    /* =========================================================
       RESET VALUES WHEN OPENING
    ========================================================= */

    useEffect(() => {
        if (
            open &&
            user
        ) {
            setValues(
                getInitialValues(
                    user
                )
            );

            setError(
                ""
            );
        }
    }, [
        open,
        user,
    ]);


    if (
        !open ||
        !user
    ) {
        return null;
    }


    /* =========================================================
       CHANGE
    ========================================================= */

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } =
            event.target;

        setValues(
            (
                current
            ) => ({
                ...current,

                [name]:
                    value,
            })
        );

        setError(
            ""
        );
    };


    /* =========================================================
       SUBMIT
    ========================================================= */

    const handleSubmit = (
        event
    ) => {
        event.preventDefault();


        if (
            !values.firstName.trim() ||
            !values.lastName.trim() ||
            !values.email.trim() ||
            !values.phoneNumber.trim() ||
            !values.address.trim() ||
            !values.age ||
            !values.gender
        ) {
            setError(
                "Please complete all required fields."
            );

            return;
        }


        if (
            Number(
                values.age
            ) < 16
        ) {
            setError(
                "Age must be 16 or above."
            );

            return;
        }


        onSave?.({
            firstName:
                values.firstName.trim(),

            lastName:
                values.lastName.trim(),

            email:
                values.email.trim(),

            phoneNumber:
                values.phoneNumber.trim(),

            address:
                values.address.trim(),

            age:
                Number(
                    values.age
                ),

            gender:
                values.gender,
        });
    };


    const name =
        `${user.firstName || ""} ${user.lastName || ""}`
            .trim() ||
        user.username ||
        "User";


    return (
        <div
            className="
                fixed
                inset-0
                z-[500]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-slate-950/55
                p-3
                backdrop-blur-[2px]
                sm:p-5
            "
        >
            <section
                role="dialog"
                aria-modal="true"
                className="
                    my-auto
                    w-full
                    max-w-[650px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#dbe4ef]
                    bg-white
                    shadow-[0_24px_70px_rgba(15,23,42,0.28)]
                "
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-[#e8eef5]
                        bg-[#f8fafc]
                        px-5
                        py-4
                        sm:px-6
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
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#1769e8]
                                text-[11px]
                                font-bold
                                text-white
                            "
                        >
                            {name
                                .charAt(
                                    0
                                )
                                .toUpperCase()}
                        </div>


                        <div>
                            <h2
                                className="
                                    text-[14px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                Edit User
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-[#64748b]
                                "
                            >
                                Update personal details for {name}.
                            </p>
                        </div>
                    </div>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            loading
                        }
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-[18px]
                            text-[#64748b]
                            transition
                            hover:bg-slate-200
                            disabled:opacity-40
                        "
                    >
                        ×
                    </button>
                </div>


                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <div
                    className="
                        border-b
                        border-[#e8eef5]
                        px-5
                        py-4
                        sm:px-6
                    "
                >
                    <div
                        className="
                            grid
                            gap-3
                            sm:grid-cols-3
                        "
                    >
                        <InfoBox
                            label="Username"
                            value={
                                user.username ||
                                "—"
                            }
                        />

                        <InfoBox
                            label="Role"
                            value={
                                user.role ||
                                "—"
                            }
                        />

                        <InfoBox
                            label="Status"
                            value={
                                user.status ||
                                "active"
                            }
                        />
                    </div>
                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        p-5
                        sm:p-6
                    "
                >
                    {error && (
                        <div
                            className="
                                mb-4
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-[9px]
                                text-red-700
                            "
                        >
                            {error}
                        </div>
                    )}


                    <div
                        className="
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >
                        <InputField
                            label="First Name"
                            name="firstName"
                            value={
                                values.firstName
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                        <InputField
                            label="Last Name"
                            name="lastName"
                            value={
                                values.lastName
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            value={
                                values.email
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                        <InputField
                            label="Phone Number"
                            name="phoneNumber"
                            value={
                                values.phoneNumber
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                        <InputField
                            label="Age"
                            name="age"
                            type="number"
                            min="16"
                            value={
                                values.age
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />


                        <label>
                            <span
                                className="
                                    mb-2
                                    block
                                    text-[9px]
                                    font-semibold
                                    text-[#334155]
                                "
                            >
                                Gender
                                <span
                                    className="
                                        ml-1
                                        text-red-500
                                    "
                                >
                                    *
                                </span>
                            </span>

                            <select
                                name="gender"
                                value={
                                    values.gender
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="
                                    min-h-[42px]
                                    w-full
                                    rounded-lg
                                    border
                                    border-[#cbd5e1]
                                    bg-white
                                    px-3
                                    text-[10px]
                                    text-[#172033]
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            >
                                <option value="">
                                    Select gender
                                </option>

                                <option value="male">
                                    Male
                                </option>

                                <option value="female">
                                    Female
                                </option>

                                <option value="other">
                                    Other
                                </option>

                                <option value="prefer-not-to-say">
                                    Prefer not to say
                                </option>
                            </select>
                        </label>


                        <div
                            className="
                                md:col-span-2
                            "
                        >
                            <label>
                                <span
                                    className="
                                        mb-2
                                        block
                                        text-[9px]
                                        font-semibold
                                        text-[#334155]
                                    "
                                >
                                    Address
                                    <span
                                        className="
                                            ml-1
                                            text-red-500
                                        "
                                    >
                                        *
                                    </span>
                                </span>

                                <textarea
                                    name="address"
                                    value={
                                        values.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    rows="3"
                                    className="
                                        w-full
                                        resize-none
                                        rounded-lg
                                        border
                                        border-[#cbd5e1]
                                        bg-white
                                        px-3
                                        py-3
                                        text-[10px]
                                        text-[#172033]
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                />
                            </label>
                        </div>
                    </div>


                    {/* =================================================
                        NOTE
                    ================================================= */}

                    <div
                        className="
                            mt-5
                            rounded-lg
                            border
                            border-blue-100
                            bg-blue-50
                            px-4
                            py-3
                        "
                    >
                        <p
                            className="
                                text-[9px]
                                font-semibold
                                text-blue-700
                            "
                        >
                            Account access information
                        </p>

                        <p
                            className="
                                mt-1
                                text-[8px]
                                leading-4
                                text-blue-600
                            "
                        >
                            Username, role, password and training assignments
                            are managed separately and are not changed by this form.
                        </p>
                    </div>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div
                        className="
                            mt-6
                            flex
                            flex-col-reverse
                            gap-2
                            border-t
                            border-[#e8eef5]
                            pt-5
                            sm:flex-row
                            sm:justify-end
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            disabled={
                                loading
                            }
                            className="
                                min-h-[40px]
                                rounded-lg
                                border
                                border-[#cbd5e1]
                                bg-white
                                px-5
                                text-[9px]
                                font-semibold
                                text-[#52627a]
                                transition
                                hover:bg-[#f8fafc]
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="
                                min-h-[40px]
                                rounded-lg
                                bg-[#1769e8]
                                px-6
                                text-[9px]
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#0b5ed7]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}


/* =========================================================
   INPUT
========================================================= */

function InputField({
    label,
    required,
    ...props
}) {
    return (
        <label>
            <span
                className="
                    mb-2
                    block
                    text-[9px]
                    font-semibold
                    text-[#334155]
                "
            >
                {label}

                {required && (
                    <span
                        className="
                            ml-1
                            text-red-500
                        "
                    >
                        *
                    </span>
                )}
            </span>


            <input
                {...props}
                required={
                    required
                }
                className="
                    min-h-[42px]
                    w-full
                    rounded-lg
                    border
                    border-[#cbd5e1]
                    bg-white
                    px-3
                    text-[10px]
                    text-[#172033]
                    outline-none
                    transition
                    placeholder:text-[#94a3b8]
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                "
            />
        </label>
    );
}


/* =========================================================
   INFO
========================================================= */

function InfoBox({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-lg
                border
                border-[#e1e8f0]
                bg-[#f8fafc]
                px-3
                py-3
            "
        >
            <p
                className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[#94a3b8]
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    truncate
                    text-[9px]
                    font-semibold
                    capitalize
                    text-[#172033]
                "
            >
                {value}
            </p>
        </div>
    );
}


export default EditUserModal;