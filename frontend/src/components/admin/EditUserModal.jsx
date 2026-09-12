import {
    useEffect,
    useState,
} from "react";

import FeedbackAlert from "../ui/FeedbackAlert";

import {
    getUserDisplayName,
} from "../../utils/training";


// ======================================================
// INITIAL FORM
// ======================================================

const getInitialFormData = (
    user
) => ({
    firstName:
        user?.firstName ||
        "",

    lastName:
        user?.lastName ||
        "",

    age:
        user?.age ||
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

    gender:
        user?.gender ||
        "",
});


// ======================================================
// EDIT USER MODAL
// ======================================================

function EditUserModal({
    open = false,
    user = null,
    saving = false,
    errorMessage = "",
    onSave,
    onClose,
}) {
    const [
        formData,
        setFormData,
    ] = useState(
        getInitialFormData(
            user
        )
    );


    // ======================================================
    // UPDATE FORM WHEN USER CHANGES
    // ======================================================

    useEffect(() => {
        if (
            open &&
            user
        ) {
            setFormData(
                getInitialFormData(
                    user
                )
            );
        }
    }, [
        open,
        user,
    ]);


    // ======================================================
    // CLOSE USING ESC
    // ======================================================

    useEffect(() => {
        if (!open) {
            return undefined;
        }


        const handleKeyDown = (
            event
        ) => {
            if (
                event.key ===
                "Escape" &&
                !saving
            ) {
                onClose?.();
            }
        };


        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        open,
        saving,
        onClose,
    ]);


    if (
        !open ||
        !user
    ) {
        return null;
    }


    // ======================================================
    // CHANGE
    // ======================================================

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } =
            event.target;


        setFormData(
            (
                current
            ) => ({
                ...current,

                [name]:
                    value,
            })
        );
    };


    // ======================================================
    // SUBMIT
    // ======================================================

    const handleSubmit = (
        event
    ) => {
        event.preventDefault();


        onSave?.({
            firstName:
                formData
                    .firstName
                    .trim(),

            lastName:
                formData
                    .lastName
                    .trim(),

            age:
                Number(
                    formData.age
                ),

            email:
                formData
                    .email
                    .trim(),

            phoneNumber:
                formData
                    .phoneNumber
                    .trim(),

            address:
                formData
                    .address
                    .trim(),

            gender:
                formData.gender,
        });
    };


    const displayName =
        getUserDisplayName(
            user,
            user.username ||
            "User"
        );


    const initial =
        displayName
            .charAt(0)
            .toUpperCase();


    // ======================================================
    // UI
    // ======================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-slate-950/45
                p-3
                sm:p-5
            "
        >
            <div
                role="dialog"
                aria-modal="true"
                className="
                    my-auto
                    max-h-[94vh]
                    w-full
                    max-w-2xl
                    overflow-y-auto
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-xl
                "
            >

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-slate-200
                        px-5
                        py-4
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
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
                                rounded-full
                                bg-blue-50
                                text-[10px]
                                font-semibold
                                text-blue-600
                            "
                        >
                            {initial}
                        </div>


                        <div
                            className="
                                min-w-0
                            "
                        >
                            <h2
                                className="
                                    text-[13px]
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                Edit User
                            </h2>


                            <p
                                className="
                                    mt-1
                                    truncate
                                    text-[8px]
                                    text-slate-400
                                "
                            >
                                {displayName}
                            </p>
                        </div>
                    </div>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            saving
                        }
                        aria-label="Close"
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            text-lg
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700
                            disabled:opacity-40
                        "
                    >
                        ×
                    </button>
                </div>


                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        p-5
                        sm:p-6
                    "
                >
                    <FeedbackAlert
                        type="error"
                        message={
                            errorMessage
                        }
                    />


                    {/* ================================================= */}
                    {/* ACCOUNT INFO */}
                    {/* ================================================= */}

                    <div
                        className="
                            mt-1
                            grid
                            gap-3
                            rounded-lg
                            bg-slate-50
                            p-4
                            sm:grid-cols-2
                        "
                    >
                        <InformationItem
                            label="Username"
                            value={
                                user.username ||
                                "—"
                            }
                        />


                        <InformationItem
                            label="Role"
                            value={
                                user.role ||
                                "—"
                            }
                        />


                        <InformationItem
                            label="Account Status"
                            value={
                                user.status ||
                                "—"
                            }
                        />


                        <InformationItem
                            label="Account Type"
                            value={
                                user.accountStatus ||
                                "Created"
                            }
                        />
                    </div>


                    {/* ================================================= */}
                    {/* USER DETAILS */}
                    {/* ================================================= */}

                    <div
                        className="
                            mt-6
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
                                gap-4
                                md:grid-cols-2
                            "
                        >
                            <FormField
                                label="First Name"
                                required
                            >
                                <input
                                    type="text"
                                    name="firstName"
                                    value={
                                        formData.firstName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className={
                                        inputClass
                                    }
                                    required
                                />
                            </FormField>


                            <FormField
                                label="Last Name"
                                required
                            >
                                <input
                                    type="text"
                                    name="lastName"
                                    value={
                                        formData.lastName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className={
                                        inputClass
                                    }
                                    required
                                />
                            </FormField>


                            <FormField
                                label="Age"
                                required
                            >
                                <input
                                    type="number"
                                    name="age"
                                    min="16"
                                    value={
                                        formData.age
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className={
                                        inputClass
                                    }
                                    required
                                />
                            </FormField>


                            <FormField
                                label="Gender"
                                required
                            >
                                <select
                                    name="gender"
                                    value={
                                        formData.gender
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className={
                                        inputClass
                                    }
                                    required
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
                                </select>
                            </FormField>


                            <FormField
                                label="Email"
                                required
                            >
                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className={
                                        inputClass
                                    }
                                    required
                                />
                            </FormField>


                            <FormField
                                label="Phone Number"
                                required
                            >
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={
                                        formData.phoneNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className={
                                        inputClass
                                    }
                                    required
                                />
                            </FormField>


                            <div
                                className="
                                    md:col-span-2
                                "
                            >
                                <FormField
                                    label="Address"
                                    required
                                >
                                    <input
                                        type="text"
                                        name="address"
                                        value={
                                            formData.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            saving
                                        }
                                        className={
                                            inputClass
                                        }
                                        required
                                    />
                                </FormField>
                            </div>
                        </div>
                    </div>


                    {/* ================================================= */}
                    {/* ACTIONS */}
                    {/* ================================================= */}

                    <div
                        className="
                            mt-6
                            flex
                            flex-col-reverse
                            gap-2
                            border-t
                            border-slate-100
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
                                saving
                            }
                            className="
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-5
                                py-2.5
                                text-[9px]
                                font-medium
                                text-slate-600
                                hover:bg-slate-50
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                saving
                            }
                            className="
                                rounded-lg
                                bg-blue-600
                                px-5
                                py-2.5
                                text-[9px]
                                font-medium
                                text-white
                                hover:bg-blue-700
                                disabled:opacity-50
                            "
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


function FormField({
    label,
    required = false,
    children,
}) {
    return (
        <label
            className="
                block
            "
        >
            <span
                className="
                    text-[9px]
                    font-medium
                    text-slate-600
                "
            >
                {label}

                {required && (
                    <span
                        className="
                            text-red-500
                        "
                    >
                        {" "}*
                    </span>
                )}
            </span>


            <div
                className="
                    mt-2
                "
            >
                {children}
            </div>
        </label>
    );
}


function InformationItem({
    label,
    value,
}) {
    return (
        <div>
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
                    capitalize
                    text-slate-700
                "
            >
                {value}
            </p>
        </div>
    );
}


const inputClass = `
    h-10
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[9px]
    text-slate-700
    outline-none
    placeholder:text-slate-400
    focus:border-blue-500
    disabled:cursor-not-allowed
    disabled:bg-slate-50
    disabled:text-slate-400
`;


export default EditUserModal;