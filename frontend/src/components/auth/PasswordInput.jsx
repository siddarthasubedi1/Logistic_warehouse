import {
    useState,
} from "react";


function PasswordInput({
    value,
    onChange,
    placeholder = "Enter your password",
    disabled = false,
    required = false,
    name = "password",
    autoComplete = "current-password",
}) {
    const [
        visible,
        setVisible,
    ] = useState(false);


    return (
        <div
            className="
                relative
                w-full
            "
        >
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-0
                    flex
                    w-11
                    items-center
                    justify-center
                    text-[#8da2bd]
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
                name={
                    name
                }
                value={
                    value
                }
                onChange={
                    onChange
                }
                placeholder={
                    placeholder
                }
                disabled={
                    disabled
                }
                required={
                    required
                }
                autoComplete={
                    autoComplete
                }
                className="
                    h-[48px]
                    w-full
                    rounded-lg
                    border
                    border-[#d4deeb]
                    bg-[#edf4ff]
                    pl-11
                    pr-12
                    text-[14px]
                    font-medium
                    text-[#172033]
                    outline-none
                    transition
                    placeholder:text-[#9aabc1]
                    focus:border-[#3b82f6]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-blue-100
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            />


            <button
                type="button"
                aria-label={
                    visible
                        ? "Hide password"
                        : "Show password"
                }
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
                    w-11
                    items-center
                    justify-center
                    text-[#8da2bd]
                    transition
                    hover:text-blue-600
                "
            >
                {visible ? (
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
                        <path d="M3 3l18 18" />

                        <path d="M10.7 10.7a2 2 0 0 0 2.6 2.6" />

                        <path d="M9.8 5.2A10.6 10.6 0 0 1 12 5c5 0 8.5 4.2 9 7-.2 1.2-1 2.6-2.1 3.8" />

                        <path d="M6.2 6.2C4.3 7.5 3.2 9.5 3 12c.5 2.8 4 7 9 7 1.5 0 2.9-.4 4.1-1" />
                    </svg>
                ) : (
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
                        <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />

                        <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}


export default PasswordInput;