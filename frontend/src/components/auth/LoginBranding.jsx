import blueImage from "../../images/blueimage.png";

function CubeLogo() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />
            <path d="m4 7.5 8 4.5 8-4.5" />
            <path d="M12 12v9" />
        </svg>
    );
}

const features = [
    {
        title: "Expert Content",
        text: "Industry approved safety training",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
    },
    {
        title: "Track Progress",
        text: "Monitor your learning and performance",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <circle
                    cx="12"
                    cy="8"
                    r="4"
                />

                <path d="m9.5 12-1 8 3.5-2 3.5 2-1-8" />
            </svg>
        ),
    },
    {
        title: "Stay Compliant",
        text: "Meet workplace safety standards",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" />
            </svg>
        ),
    },
];

function LoginBranding() {
    return (
        <section
            className="login-branding"
            aria-label="UK LogiWare Safety Training"
        >
            <img
                className="login-branding-image"
                src={blueImage}
                alt="Warehouse worker handling a package safely"
            />

            <div className="login-branding-overlay" />

            <div className="login-branding-content">
                <div className="login-brand-logo">
                    <div className="login-brand-logo-icon">
                        <CubeLogo />
                    </div>

                    <div>
                        <div className="login-brand-logo-name">
                            <span>UK Logi</span>

                            <strong>
                                Ware
                            </strong>
                        </div>

                        <div className="login-brand-logo-subtitle">
                            WAREHOUSING &amp; LOGISTICS
                        </div>
                    </div>
                </div>

                <div className="login-brand-copy">
                    <h2>
                        Work Safe. Learn Safe

                        <span>
                            Every Step Matters
                        </span>
                    </h2>

                    <p>
                        Interactive health &amp; safety training
                        for a safer workplace and a stronger team.
                    </p>
                </div>

                <div className="login-brand-features">
                    {features.map((feature) => (
                        <div
                            className="login-brand-feature"
                            key={feature.title}
                        >
                            <span className="login-brand-feature-icon">
                                {feature.icon}
                            </span>

                            <div>
                                <strong>
                                    {feature.title}
                                </strong>

                                <p>
                                    {feature.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default LoginBranding;