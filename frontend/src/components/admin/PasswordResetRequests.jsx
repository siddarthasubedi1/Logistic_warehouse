import {
    useEffect,
    useState,
} from "react";

import FeedbackAlert from "../ui/FeedbackAlert";

import {
    getUserDisplayName,
} from "../../utils/training";


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
        typeof user?.address ===
            "string"
            ? user.address
            : "",

    gender:
        user?.gender ||
        "",
});


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


    useEffect(() => {
        if (
            !open
        ) {
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


    return (
        <div
            className="
                fixed
                inset-0
                z-[240]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-slate-950/55
                p-3
                backdrop-blur-[1px]
                sm:p-5
            "
        >
            <section
                role="dialog"
                aria-modal="true"
                className="
                    my-auto
                    w-full
                    max-w-[720px]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                "
            >
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-slate-200
                        px-4
                        py-4
                        sm:px-5
                    "
                >
                    <div>
                        <p
                            className="
                                text-[7px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-blue-600
                            "
                        >
                            User Management
                        </p>

                        <h2
                            className="
                                mt-1
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
                                text-[8px]
                                font-medium
                                text-slate-500
                            "
                        >
                            {displayName} · @{user.username}
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
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-md
                            text-lg
                            text-slate-400
                            hover:bg-slate-100
                        "
                    >
                        ×
                    </button>
                </div>


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        p-4
                        sm:p-5
                    "
                >
                    <FeedbackAlert
                        type="error"
                        message={
                            errorMessage
                        }
                    />


                    <div
                        className="
                            mt-4
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >
                        <Field
                            label="First Name"
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
                        </Field>


                        <Field
                            label="Last Name"
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
                        </Field>


                        <Field
                            label="Age"
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
                        </Field>


                        <Field
                            label="Gender"
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
                        </Field>


                        <Field
                            label="Email"
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
                        </Field>


                        <Field
                            label="Phone Number"
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
                        </Field>


                        <div
                            className="
                                md:col-span-2
                            "
                        >
                            <Field
                                label="Address"
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
                            </Field>
                        </div>
                    </div>


                    <div
                        className="
                            mt-5
                            rounded-lg
                            bg-slate-50
                            p-3
                        "
                    >
                        <p
                            className="
                                text-[8px]
                                font-medium
                                text-slate-600
                            "
                        >
                            Username, role and password are not changed from this form.
                        </p>
                    </div>


                    <div
                        className="
                            mt-5
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
                                min-h-[40px]
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-5
                                text-[9px]
                                font-semibold
                                text-slate-700
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
                                min-h-[40px]
                                rounded-lg
                                bg-blue-600
                                px-5
                                text-[9px]
                                font-semibold
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
            </section>
        </div>
    );
}


function Field({
    label,
    children,
}) {
    return (
        <label>
            <span
                className="
                    mb-2
                    block
                    text-[8px]
                    font-semibold
                    text-slate-700
                "
            >
                {label}
            </span>

            {children}
        </label>
    );
}


const inputClass = `
    min-h-[40px]
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[9px]
    font-medium
    text-slate-800
    outline-none
    focus:border-blue-500
    focus:ring-1
    focus:ring-blue-100
    disabled:bg-slate-50
`;


export default EditUserModal;