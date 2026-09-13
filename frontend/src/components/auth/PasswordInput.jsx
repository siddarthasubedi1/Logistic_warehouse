import {
    useState,
} from "react";

function PasswordInput({
    id = "password",
    name = "password",
    value,
    onChange,
    placeholder = "Enter your password",
    autoComplete = "current-password",
    disabled = false,
    required = false,
    className = "",
}) {
    const [
        visible,
        setVisible,
    ] = useState(false);

    return (
        <div
            className={`auth-input-shell ${className}`}
        >
            <span
                className="auth-input-icon"
                aria-hidden="true"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <rect
                        x="5.5"
                        y="10"
                        width="13"
                        height="10"
                        rx="2"
                    />

                    <path d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3" />
                </svg>
            </span>

            <input
                id={id}
                name={name}
                type={
                    visible
                        ? "text"
                        : "password"
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
                autoComplete={
                    autoComplete
                }
                disabled={
                    disabled
                }
                required={
                    required
                }
                className="auth-input auth-input-with-left-icon auth-input-with-right-icon"
            />

            <button
                type="button"
                className="auth-input-action"
                onClick={() =>
                    setVisible(
                        (
                            current
                        ) =>
                            !current
                    )
                }
                aria-label={
                    visible
                        ? "Hide password"
                        : "Show password"
                }
                disabled={
                    disabled
                }
            >
                {visible ? (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="M3 3l18 18" />

                        <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />

                        <path d="M9.9 5.1A10.6 10.6 0 0 1 12 4.9c5.2 0 8.5 4.7 9 5.5.2.4.2.8 0 1.2a13.6 13.6 0 0 1-2.5 3.1" />

                        <path d="M6.2 6.2A14 14 0 0 0 3 10.4c-.2.4-.2.8 0 1.2.5.8 3.8 5.5 9 5.5 1 0 1.9-.2 2.8-.5" />
                    </svg>
                ) : (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="M2.7 12s3.3-6 9.3-6 9.3 6 9.3 6-3.3 6-9.3 6-9.3-6-9.3-6Z" />

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