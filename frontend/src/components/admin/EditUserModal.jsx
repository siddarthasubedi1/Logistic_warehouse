import {
    useEffect,
    useState,
} from "react";

import ActionButton from "../ui/ActionButton";
import FeedbackAlert from "../ui/FeedbackAlert";
import StatusBadge from "../ui/StatusBadge";

import {
    getUserDisplayName,
} from "../../utils/training";


// ======================================================
// INITIAL FORM DATA
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
    // RESET WHEN USER CHANGES
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
    // HIDDEN
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
            (
                current
            ) => ({
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
    // DISPLAY
    // ==================================================

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


    // ==================================================
    // UI
    // ==================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-slate-950/55
                p-3
                backdrop-blur-[2px]
                sm:p-4
            "
        >
            <div
                role="dialog"
                aria-modal="true"
                className="
                    max-h-[94vh]
                    w-full
                    max-w-2xl
                    overflow-y-auto
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                "
            >

                {/* ====================================== */}
                {/* HEADER */}
                {/* ====================================== */}

                <div
                    className="
                        relative
                        overflow-hidden
                        border-b
                        border-slate-100
                        bg-gradient-to-r
                        from-white
                        via-white
                        to-blue-50
                        px-4
                        py-5
                        sm:px-6
                    "
                >

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-16
                            h-40
                            w-40
                            rounded-full
                            bg-blue-50
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            flex
                            items-start
                            justify-between
                            gap-4
                        "
                    >

                        <div
                            className="
                                flex
                                min-w-0
                                items-start
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#073763]
                                    text-sm
                                    font-bold
                                    text-white
                                "
                            >
                                {initial}
                            </div>


                            <div className="min-w-0">

                                <p
                                    className="
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-blue-600
                                    "
                                >
                                    User Management
                                </p>


                                <h2
                                    className="
                                        mt-1
                                        truncate
                                        text-base
                                        font-bold
                                        text-slate-900
                                        sm:text-lg
                                    "
                                >
                                    Edit User
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        truncate
                                        text-[10px]
                                        text-slate-500
                                    "
                                >
                                    {displayName}
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            aria-label="Close edit user"
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                text-lg
                                text-slate-400
                                shadow-sm
                                transition
                                hover:bg-slate-50
                                hover:text-slate-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            ×
                        </button>

                    </div>

                </div>


                {/* ====================================== */}
                {/* FORM */}
                {/* ====================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        space-y-5
                        p-4
                        sm:p-6
                    "
                >

                    <FeedbackAlert
                        type="error"
                        message={errorMessage}
                    />


                    {/* ================================== */}
                    {/* ACCOUNT SUMMARY */}
                    {/* ================================== */}

                    <section
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50/70
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <div>
                                <p
                                    className="
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-slate-400
                                    "
                                >
                                    Account Information
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[10px]
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Username and account role are
                                    protected account fields.
                                </p>
                            </div>


                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >
                                <StatusBadge
                                    status={user.role}
                                />

                                <StatusBadge
                                    status={user.status}
                                />
                            </div>

                        </div>


                        <div
                            className="
                                mt-4
                                grid
                                gap-3
                                sm:grid-cols-2
                            "
                        >
                            <InfoItem
                                label="Username"
                                value={
                                    user.username ||
                                    "—"
                                }
                            />


                            <InfoItem
                                label="Role"
                                value={
                                    user.role ||
                                    "—"
                                }
                            />
                        </div>

                    </section>


                    {/* ================================== */}
                    {/* PERSONAL DETAILS */}
                    {/* ================================== */}

                    <section>

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                            "
                        >
                            <span
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-50
                                    text-blue-600
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                >
                                    <circle
                                        cx="12"
                                        cy="8"
                                        r="3"
                                    />

                                    <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                                </svg>
                            </span>


                            <div>
                                <h3
                                    className="
                                        text-xs
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    Personal Details
                                </h3>


                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    Update the user's personal
                                    information below.
                                </p>
                            </div>
                        </div>


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
                                    disabled={saving}
                                    className={inputClass}
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
                                    disabled={saving}
                                    className={inputClass}
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
                                    disabled={saving}
                                    className={inputClass}
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
                                    disabled={saving}
                                    className={inputClass}
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
                                    disabled={saving}
                                    className={inputClass}
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
                                    disabled={saving}
                                    className={inputClass}
                                    required
                                />
                            </FormField>


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
                                        disabled={saving}
                                        className={inputClass}
                                        required
                                    />
                                </FormField>
                            </div>

                        </div>

                    </section>


                    {/* ================================== */}
                    {/* NOTE */}
                    {/* ================================== */}

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-blue-100
                            bg-blue-50/70
                            p-4
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="
                                mt-0.5
                                h-4
                                w-4
                                shrink-0
                                text-blue-600
                            "
                        >
                            <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />

                            <path d="M12 9v4" />

                            <path d="M12 16h.01" />
                        </svg>


                        <p
                            className="
                                text-[9px]
                                leading-5
                                text-blue-700
                            "
                        >
                            Editing these details does not change the
                            user's role, password, account status, or
                            training assignments.
                        </p>
                    </div>


                    {/* ================================== */}
                    {/* ACTIONS */}
                    {/* ================================== */}

                    <div
                        className="
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
                        <ActionButton
                            variant="secondary"
                            onClick={onClose}
                            disabled={saving}
                            className="
                                w-full
                                justify-center
                                sm:w-auto
                            "
                        >
                            Cancel
                        </ActionButton>


                        <ActionButton
                            type="submit"
                            variant="primary"
                            disabled={saving}
                            className="
                                w-full
                                justify-center
                                sm:w-auto
                            "
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
                    text-[10px]
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
        <div
            className="
                rounded-lg
                border
                border-slate-100
                bg-white
                px-3
                py-2.5
            "
        >
            <p
                className="
                    text-[8px]
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
                    break-words
                    text-[10px]
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
    h-11
    w-full
    rounded-xl
    border
    border-slate-300
    bg-white
    px-3
    text-[10px]
    text-slate-800
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
    disabled:cursor-not-allowed
    disabled:bg-slate-100
    disabled:text-slate-500
`;


export default EditUserModal;