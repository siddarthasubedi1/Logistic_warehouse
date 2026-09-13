import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import LoginBranding from "../components/auth/LoginBranding";
import LoginForm from "../components/auth/LoginForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import ForcePasswordChangeModal from "../components/auth/ForcePasswordChangeModal";

import "../styles/login.css";


function Login() {
    const navigate =
        useNavigate();


    const [
        mode,
        setMode,
    ] = useState(
        "login"
    );


    const [
        forcedPasswordData,
        setForcedPasswordData,
    ] = useState(
        null
    );


    return (
        <main className="figma-login-page">

            <div className="figma-login-layout">

                <LoginBranding />


                <section className="figma-login-right">

                    <div className="figma-login-form-container">

                        {mode ===
                            "login" ? (
                            <LoginForm
                                onForgotPassword={() =>
                                    setMode(
                                        "forgot"
                                    )
                                }
                                onForcePasswordChange={
                                    setForcedPasswordData
                                }
                            />
                        ) : (
                            <ForgotPasswordForm
                                onBack={() =>
                                    setMode(
                                        "login"
                                    )
                                }
                            />
                        )}

                    </div>

                </section>

            </div>


            {forcedPasswordData && (
                <ForcePasswordChangeModal
                    user={
                        forcedPasswordData.user
                    }
                    currentPassword={
                        forcedPasswordData.currentPassword
                    }
                    onComplete={(
                        path
                    ) => {
                        setForcedPasswordData(
                            null
                        );

                        navigate(
                            path,
                            {
                                replace:
                                    true,
                            }
                        );
                    }}
                />
            )}

        </main>
    );
}


export default Login;