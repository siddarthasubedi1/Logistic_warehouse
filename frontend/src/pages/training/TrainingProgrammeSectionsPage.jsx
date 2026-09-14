import {
    Navigate,
    useLocation,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import LearningSectionManager from "../../components/training/LearningSectionManager";

import {
    getSessionUser,
} from "../../utils/session";


/* =========================================================
   READ STORED PROGRAMME

   The programme ID is kept internally inside sessionStorage.

   It is NOT shown in the browser URL.
========================================================= */

function getStoredProgramme() {
    try {
        const storedProgramme =
            sessionStorage.getItem(
                "selectedTrainingProgramme"
            );


        if (
            !storedProgramme
        ) {
            return null;
        }


        return JSON.parse(
            storedProgramme
        );

    } catch (
    error
    ) {
        console.error(
            "Unable to read selected training programme:",
            error
        );


        return null;
    }
}


/* =========================================================
   PAGE
========================================================= */

function TrainingProgrammeSectionsPage() {
    const location =
        useLocation();


    const user =
        getSessionUser();


    const role =
        String(
            user?.role ||
            ""
        )
            .trim()
            .toLowerCase();


    /* =====================================================
       PROGRAMME

       First try React Router state.

       If the page is refreshed, use sessionStorage.
    ===================================================== */

    const programme =
        location.state?.programme ||
        getStoredProgramme();


    const programmeId =
        programme?._id ||
        sessionStorage.getItem(
            "selectedTrainingProgrammeId"
        );


    /* =====================================================
       NO PROGRAMME SELECTED

       Return to Training Programmes instead of showing
       an invalid or empty Learning Sections page.
    ===================================================== */

    if (
        !programmeId
    ) {
        return (
            <Navigate
                to="/training-programmes"
                replace
            />
        );
    }


    return (
        <DashboardLayout
            role={
                role
            }
            showHeader={
                false
            }
        >
            <div
                className="
                    app-page
                    space-y-5
                "
            >
                <LearningSectionManager
                    role={
                        role
                    }
                    programmeId={
                        programmeId
                    }
                    initialProgramme={
                        programme
                    }
                />
            </div>
        </DashboardLayout>
    );
}


export default TrainingProgrammeSectionsPage;