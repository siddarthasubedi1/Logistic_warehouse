import { useNavigate } from "react-router-dom";

function Unauthorized() {
    const navigate = useNavigate();

    const storedUser =
        sessionStorage.getItem("user");

    let user = null;

    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch {
        user = null;
    }

    const goToDashboard = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        switch (user.role) {
            case "admin":
                navigate("/admin");
                break;

            case "trainer":
                navigate("/trainer");
                break;

            case "trainee":
                navigate("/trainee");
                break;

            default:
                navigate("/login");
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-600">
                    !
                </div>

                <h1 className="mt-5 text-3xl font-bold text-slate-900">
                    Access Denied
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    You do not have permission to
                    access this page.
                </p>

                <button
                    type="button"
                    onClick={
                        goToDashboard
                    }
                    className="mt-7 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Return to Dashboard
                </button>
            </div>
        </main>
    );
}

export default Unauthorized;