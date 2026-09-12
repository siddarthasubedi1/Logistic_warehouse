import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProfileDetails from "../components/account/ProfileDetails";
import ChangePasswordForm from "../components/account/ChangePasswordForm";

import FeedbackAlert from "../components/ui/FeedbackAlert";

import api from "../services/api";


function ProfilePage({
    role,
}) {
    const navigate =
        useNavigate();


    const [
        user,
        setUser,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    useEffect(() => {
        let mounted =
            true;


        const loadProfile =
            async () => {
                try {
                    setLoading(
                        true
                    );

                    setError(
                        ""
                    );


                    const response =
                        await api.get(
                            "/users/me"
                        );


                    if (!mounted) {
                        return;
                    }


                    const currentUser =
                        response.data?.user ||
                        null;


                    setUser(
                        currentUser
                    );


                    if (
                        currentUser
                    ) {
                        sessionStorage.setItem(
                            "user",
                            JSON.stringify(
                                currentUser
                            )
                        );
                    }

                } catch (error) {
                    console.error(
                        "Profile loading error:",
                        error
                    );


                    if (
                        mounted
                    ) {
                        setError(
                            error.response?.data?.message ||
                            "Unable to load profile."
                        );
                    }

                } finally {
                    if (
                        mounted
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            };


        loadProfile();


        return () => {
            mounted =
                false;
        };
    }, []);


    const dashboardPath =
        role ===
            "trainer"
            ? "/trainer"
            : "/trainee";


    const handleProfileImageUpdated = (
        updatedUser
    ) => {
        setUser(
            (
                currentUser
            ) => ({
                ...currentUser,
                ...updatedUser,
            })
        );
    };


    return (
        <DashboardLayout
            role={
                role
            }
            showHeader={false}
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1200px]
                    space-y-4
                "
            >
                {/* HEADER */}

                <section
                    className="
                        flex
                        flex-col
                        gap-4
                        bg-white
                        px-4
                        py-4
                        sm:px-5
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >
                    <div>
                        <p
                            className="
                                text-[7px]
                                font-semibold
                                uppercase
                                tracking-[0.12em]
                                text-blue-600
                            "
                        >
                            Account Center
                        </p>


                        <h1
                            className="
                                mt-1
                                text-[20px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            My Profile
                        </h1>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                font-medium
                                text-slate-600
                            "
                        >
                            Manage your personal details, profile image and account security.
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                dashboardPath
                            )
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-4
                            py-2.5
                            text-[8px]
                            font-semibold
                            text-slate-700
                            transition
                            hover:bg-slate-50
                            sm:w-auto
                        "
                    >
                        ← Back to Dashboard
                    </button>
                </section>


                {/* BLUE BANNER */}

                <section
                    className="
                        rounded-xl
                        bg-gradient-to-r
                        from-[#073763]
                        to-[#1f55c7]
                        p-5
                        text-white
                        sm:p-6
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.14em]
                                    text-blue-100
                                "
                            >
                                UK LogiWare Safety Training
                            </p>


                            <h2
                                className="
                                    mt-2
                                    text-[14px]
                                    font-bold
                                "
                            >
                                Keep your account secure and up to date
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    text-blue-100
                                "
                            >
                                Update your profile photo and manage your password from one secure place.
                            </p>
                        </div>


                        <div
                            className="
                                rounded-lg
                                bg-white/10
                                px-4
                                py-3
                            "
                        >
                            <p
                                className="
                                    text-[7px]
                                    text-blue-100
                                "
                            >
                                Account Role
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    font-semibold
                                    capitalize
                                "
                            >
                                {role}
                            </p>
                        </div>
                    </div>
                </section>


                <FeedbackAlert
                    type="error"
                    message={
                        error
                    }
                    onClose={() =>
                        setError(
                            ""
                        )
                    }
                />


                {/* TWO COLUMNS */}

                <section
                    className="
                        grid
                        gap-4
                        lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.8fr)]
                    "
                >
                    <ProfileDetails
                        user={
                            user
                        }
                        loading={
                            loading
                        }
                        onProfileImageUpdated={
                            handleProfileImageUpdated
                        }
                    />


                    <ChangePasswordForm />
                </section>
            </div>
        </DashboardLayout>
    );
}


export default ProfilePage;