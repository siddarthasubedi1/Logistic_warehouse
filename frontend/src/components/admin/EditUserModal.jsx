import {
    useEffect,
    useState,
} from "react";

import ActionButton from "../ui/ActionButton";
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
        user?.firstName || "",

    lastName:
        user?.lastName || "",

    age:
        user?.age || "",

    email:
        user?.email || "",

    phoneNumber:
        user?.phoneNumber || "",

    address:
        user?.address || "",

    gender:
        user?.gender || "",
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


    // ==================================================
    // RESET FORM WHEN USER CHANGES
    // ==================================================

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


    // ==================================================
    // DO NOT SHOW
    // ==================================================

    if (
        !open ||
        !user
    ) {
        return null;
    }


    // ==================================================
    // CHANGE
    // ==================================================

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;


        setFormData(
            (current) => ({
                ...current,

                [name]:
                    value,
            })
        );
    };


    // ==================================================
    // SUBMIT
    // ==================================================

    const handleSubmit = (
        event
    ) => {
        event.preventDefault();


        if (!onSave) {
            return;
        }


        onSave({
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


    // ==================================================
    // UI
    // ==================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-slate-950/50
                p-4
            "
        >
            <div
                className="
                    max-h-[90vh]
                    w-full
                    max-w-2xl
                    overflow-y-auto
                    rounded-2xl
                    bg-white
                    shadow-2xl
                "
            >

                {/* ====================================== */}
                {/* HEADER */}
                {/* ====================================== */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-slate-200
                        px-6
                        py-5
                    "
                >
                    <div>
                        <h2
                            className="
                                text-lg
                                font-bold
                                text-slate-900
                            "
                        >
                            Edit User
                        </h2>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                            "
                        >
                            Update information for{" "}
                            {getUserDisplayName(
                                user,
                                "this user"
                            )}.
                        </p>
                    </div>


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
                            px-3
                            py-2
                            text-lg
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        ×
                    </button>
                </div>


                {/* ====================================== */}
                {/* FORM */}
                {/* ====================================== */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-5 p-6"
                >

                    <FeedbackAlert
                        type="error"
                        message={
                            errorMessage
                        }
                    />


                    {/* ================================== */}
                    {/* ACCOUNT INFORMATION */}
                    {/* ================================== */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                        "
                    >
                        <div
                            className="
                                grid
                                gap-3
                                sm:grid-cols-2
                            "
                        >
                            <InfoItem
                                label="Username"
                                value={
                                    user.username ||
                                    "Not generated"
                                }
                            />


                            <InfoItem
                                label="Role"
                                value={
                                    user.role ||
                                    "Unknown"
                                }
                            />
                        </div>


                        <p
                            className="
                                mt-3
                                text-[11px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Username and role are not changed from this
                            form. Training areas can be changed from the
                            Training Assignment section.
                        </p>
                    </div>


                    {/* ================================== */}
                    {/* PERSONAL INFORMATION */}
                    {/* ================================== */}

                    <div
                        className="
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >

                        {/* First name */}

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


                        {/* Last name */}

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


                        {/* Age */}

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


                        {/* Gender */}

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


                        {/* Email */}

                        <FormField
                            label="Personal Email"
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


                        {/* Phone */}

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


                        {/* Address */}

                        <div className="md:col-span-2">
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


                    {/* ================================== */}
                    {/* ACTIONS */}
                    {/* ================================== */}

                    <div
                        className="
                            flex
                            flex-wrap
                            justify-end
                            gap-3
                            border-t
                            border-slate-200
                            pt-5
                        "
                    >
                        <ActionButton
                            variant="secondary"
                            onClick={
                                onClose
                            }
                            disabled={
                                saving
                            }
                        >
                            Cancel
                        </ActionButton>


                        <ActionButton
                            type="submit"
                            variant="primary"
                            disabled={
                                saving
                            }
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </ActionButton>
                    </div>

                </form>

            </div>
        </div>
    );
}


// ======================================================
// FORM FIELD
// ======================================================

function FormField({
    label,
    required = false,
    children,
}) {
    return (
        <label className="block">
            <span
                className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    text-slate-700
                "
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </span>

            {children}
        </label>
    );
}


// ======================================================
// INFO ITEM
// ======================================================

function InfoItem({
    label,
    value,
}) {
    return (
        <div>
            <p
                className="
                    text-[10px]
                    font-semibold
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
                    text-sm
                    font-semibold
                    capitalize
                    text-slate-800
                "
            >
                {value}
            </p>
        </div>
    );
}


// ======================================================
// INPUT STYLE
// ======================================================

const inputClass = `
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    py-2.5
    text-sm
    text-slate-800
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
    disabled:cursor-not-allowed
    disabled:bg-slate-100
    disabled:text-slate-500
`;


export default EditUserModal;