import LoginBranding from "../components/auth/LoginBranding";
import LoginForm from "../components/auth/LoginForm";

function Login() {
    return (
        <main className="min-h-screen bg-slate-100 lg:flex">
            <LoginBranding />

            <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
                <LoginForm />
            </section>
        </main>
    );
}

export default Login;