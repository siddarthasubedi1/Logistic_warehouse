import {
    useState,
} from "react";

import api from "../../services/api";

import {
    clearAuthSession,
} from "../../utils/session";


function ForcePasswordChangeModal({
    user,
    onCompleted,
}) {
    const [
        currentPassword,
        setCurrentPassword,
    ] = useState("");


    const [
        newPassword,
        setNewPassword,
    ] = useState("");


    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        completed,
        setCompleted,
    ] = useState(false);


    const accountName =
        `${user?.firstName || ""} ${user?.lastName || ""}`
            .trim() ||
        user?.username ||
        "Account";


    const passwordLengthValid =
        newPassword.length >=
        12;


    const passwordDifferent =
        newPassword.length >
        0 &&
        currentPassword.length >
        0 &&
        newPassword !==
        currentPassword;


    const passwordMatches =
        newPassword.length >
        0 &&
        newPassword ===
        confirmPassword;


    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();


            setError(
                ""
            );


            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            ) {
                setError(
                    "Please complete all password fields."
                );

                return;
            }


            if (
                newPassword.length <
                12
            ) {
                setError(
                    "New password must contain at least 12 characters."
                );

                return;
            }


            if (
                newPassword ===
                currentPassword
            ) {
                setError(
                    "The new password must be different from the temporary password."
                );

                return;
            }


            if (
                newPassword !==
                confirmPassword
            ) {
                setError(
                    "New password and confirmation do not match."
                );

                return;
            }


            try {
                setLoading(
                    true
                );


                await api.post(
                    "/auth/change-password",
                    {
                        currentPassword,

                        newPassword,
                    }
                );


                clearAuthSession();


                setCompleted(
                    true
                );

            } catch (error) {
                console.error(
                    "Forced password change error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to change password."
                );

            } finally {
                setLoading(
                    false
                );
            }
        };


    if (
        completed
    ) {
        return (
            <ModalWrapper>
                <div
                    className="
                        px-6
                        py-8
                        text-center
                    "
                >
                    <div
                        className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-100
                            text-[21px]
                            font-bold
                            text-emerald-600
                        "
                    >
                        ✓
                    </div>


                    <h2
                        className="
                            mt-5
                            text-[18px]
                            font-bold
                            text-[#172033]
                        "
                    >
                        Password Changed Successfully.
                    </h2>


                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-[320px]
                            text-[11px]
                            leading-5
                            text-slate-500
                        "
                    >
                        Your temporary password is no longer valid. Please login again using your new password.
                    </p>


                    <button
                        type="button"
                        onClick={
                            onCompleted
                        }
                        className="
                            mt-6
                            h-11
                            w-full
                            rounded-lg
                            bg-[#1769e8]
                            text-[12px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#0b5ed7]
                        "
                    >
                        Back to Login
                    </button>
                </div>
            </ModalWrapper>
        );
    }


    return (
        <ModalWrapper>
            <div
                className="
                    border-b
                    border-slate-200
                    px-5
                    py-5
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
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-amber-50
                            text-amber-500
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="
                                h-5
                                w-5
                            "
                        >
                            <rect
                                x="6"
                                y="10"
                                width="12"
                                height="10"
                                rx="2"
                            />

                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                    </div>


                    <div>
                        <h2
                            className="
                                text-[15px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Password Change Required
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                leading-5
                                text-slate-500
                            "
                        >
                            You are using a temporary password generated by the administrator. You must create a new password before accessing your account.
                        </p>
                    </div>
                </div>
            </div>


            <form
                onSubmit={
                    handleSubmit
                }
                className="
                    space-y-4
                    p-5
                "
            >
                {/* ACCOUNT */}

                <div
                    className="
                        rounded-lg
                        border
                        border-blue-100
                        bg-blue-50
                        p-3
                    "
                >
                    <p
                        className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-blue-600
                        "
                    >
                        Account
                    </p>


                    <p
                        className="
                            mt-1
                            text-[12px]
                            font-bold
                            text-[#172033]
                        "
                    >
                        {accountName}
                    </p>


                    <p
                        className="
                            mt-1
                            text-[9px]
                            capitalize
                            text-slate-600
                        "
                    >
                        {user?.username ||
                            ""}

                        {user?.role
                            ? ` · ${user.role}`
                            : ""}
                    </p>
                </div>


                {error && (
                    <div
                        className="
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-[10px]
                            font-medium
                            text-red-700
                        "
                    >
                        {error}
                    </div>
                )}


                <PasswordField
                    label="Current Temporary Password"
                    value={
                        currentPassword
                    }
                    onChange={
                        setCurrentPassword
                    }
                    disabled={
                        loading
                    }
                />


                <PasswordField
                    label="New Password"
                    value={
                        newPassword
                    }
                    onChange={
                        setNewPassword
                    }
                    disabled={
                        loading
                    }
                />


                <PasswordField
                    label="Confirm New Password"
                    value={
                        confirmPassword
                    }
                    onChange={
                        setConfirmPassword
                    }
                    disabled={
                        loading
                    }
                />


                <div
                    className="
                        rounded-lg
                        border
                        border-slate-200
                        bg-slate-50
                        p-3
                    "
                >
                    <p
                        className="
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-[0.1em]
                            text-slate-500
                        "
                    >
                        Password Requirements
                    </p>


                    <div
                        className="
                            mt-3
                            space-y-2
                        "
                    >
                        <Requirement
                            valid={
                                passwordLengthValid
                            }
                        >
                            At least 12 characters
                        </Requirement>


                        <Requirement
                            valid={
                                passwordDifferent
                            }
                        >
                            Different from temporary password
                        </Requirement>


                        <Requirement
                            valid={
                                passwordMatches
                            }
                        >
                            New passwords match
                        </Requirement>
                    </div>
                </div>


                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className="
                        flex
                        h-11
                        w-full
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#1769e8]
                        text-[11px]
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#0b5ed7]
                        disabled:opacity-50
                    "
                >
                    {loading
                        ? "Changing Password..."
                        : "Change Password"}
                </button>


                <p
                    className="
                        text-center
                        text-[8px]
                        leading-4
                        text-slate-400
                    "
                >
                    This step cannot be skipped. Dashboard access remains blocked until your password is changed.
                </p>
            </form>
        </ModalWrapper>
    );
}


function PasswordField({
    label,
    value,
    onChange,
    disabled,
}) {
    const [
        visible,
        setVisible,
    ] = useState(false);


    return (
        <label
            className="
                block
            "
        >
            <span
                className="
                    mb-2
                    block
                    text-[9px]
                    font-semibold
                    text-slate-700
                "
            >
                {label}
            </span>


            <div
                className="
                    relative
                "
            >
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-y-0
                        left-0
                        flex
                        w-10
                        items-center
                        justify-center
                        text-slate-400
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
                        <rect
                            x="6"
                            y="10"
                            width="12"
                            height="10"
                            rx="2"
                        />

                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                </div>


                <input
                    type={
                        visible
                            ? "text"
                            : "password"
                    }
                    value={
                        value
                    }
                    onChange={(
                        event
                    ) => {
                        onChange(
                            event.target.value
                        );
                    }}
                    disabled={
                        disabled
                    }
                    className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        pl-10
                        pr-11
                        text-[11px]
                        text-[#172033]
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                    "
                />


                <button
                    type="button"
                    onClick={() =>
                        setVisible(
                            (
                                current
                            ) =>
                                !current
                        )
                    }
                    disabled={
                        disabled
                    }
                    className="
                        absolute
                        inset-y-0
                        right-0
                        flex
                        w-10
                        items-center
                        justify-center
                        text-slate-400
                        hover:text-blue-600
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
                        {visible ? (
                            <>
                                <path d="M3 3l18 18" />

                                <path d="M10.7 10.7a2 2 0 0 0 2.6 2.6" />

                                <path d="M9.8 5.2A10.6 10.6 0 0 1 12 5c5 0 8.5 4.2 9 7" />
                            </>
                        ) : (
                            <>
                                <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />

                                <circle
                                    cx="12"
                                    cy="12"
                                    r="2.5"
                                />
                            </>
                        )}
                    </svg>
                </button>
            </div>
        </label>
    );
}


function Requirement({
    valid,
    children,
}) {
    return (
        <div
            className="
                flex
                items-center
                gap-2
            "
        >
            <div
                className={`
                    flex
                    h-4
                    w-4
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-[7px]
                    font-bold

                    ${valid
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-200 text-slate-500"
                    }
                `}
            >
                {valid
                    ? "✓"
                    : "•"}
            </div>


            <span
                className={`
                    text-[8px]

                    ${valid
                        ? "font-medium text-emerald-600"
                        : "text-slate-500"
                    }
                `}
            >
                {children}
            </span>
        </div>
    );
}


function ModalWrapper({
    children,
}) {
    return (
        <div
            className="
                fixed
                inset-0
                z-[200]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-[#07111f]/65
                p-4
                backdrop-blur-[3px]
            "
        >
            <section
                role="dialog"
                aria-modal="true"
                className="
                    my-auto
                    w-full
                    max-w-[470px]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                "
            >
                {children}
            </section>
        </div>
    );
}


export default ForcePasswordChangeModal;