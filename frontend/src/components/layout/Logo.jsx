function Logo({
    compact = false,
    light = false,
}) {
    return (
        <div
            className={`app-logo ${compact
                ? "app-logo-compact"
                : ""
                } ${light
                    ? "app-logo-light"
                    : ""
                }`}
        >
            <span
                className="app-logo-icon"
                aria-hidden="true"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />

                    <path d="m4 7.5 8 4.5 8-4.5" />

                    <path d="M12 12v9" />
                </svg>
            </span>

            {!compact && (
                <span className="app-logo-copy">
                    <strong>
                        UK LogiWare
                    </strong>

                    <small>
                        SAFETY TRAINING
                    </small>
                </span>
            )}
        </div>
    );
}

export default Logo;