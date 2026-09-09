import TrainingPageIntro from "./TrainingPageIntro";


function TrainingManagementShell({
    title,
    description = "",
    action = null,
    children,
}) {
    return (
        <div className="space-y-6">

            {/* ================================================= */}
            {/* PAGE INTRO */}
            {/* ================================================= */}

            <TrainingPageIntro
                title={title}
                description={description}
                action={action}
            />


            {/* ================================================= */}
            {/* PAGE CONTENT */}
            {/* ================================================= */}

            <div className="space-y-6">
                {children}
            </div>

        </div>
    );
}


export default TrainingManagementShell;