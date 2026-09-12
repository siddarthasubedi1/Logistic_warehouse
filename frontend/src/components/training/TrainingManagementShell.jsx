import TrainingPageIntro from "./TrainingPageIntro";


function TrainingManagementShell({
    title,
    description = "",
    action = null,
    children,
}) {
    return (
        <section
            className="
                w-full
                min-w-0
                space-y-4
            "
        >
            <TrainingPageIntro
                title={
                    title
                }
                description={
                    description
                }
                action={
                    action
                }
            />


            <div
                className="
                    w-full
                    min-w-0
                    space-y-4
                "
            >
                {children}
            </div>
        </section>
    );
}


export default TrainingManagementShell;