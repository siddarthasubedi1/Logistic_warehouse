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
                space-y-5
            "
        >

            {/* ================================================= */}
            {/* PAGE INTRO */}
            {/* ================================================= */}

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


            {/* ================================================= */}
            {/* CONTENT AREA */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    space-y-5
                "
            >

                {/* LIGHT BACKGROUND DECORATION */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-20
                        top-0
                        -z-10
                        hidden
                        h-72
                        w-72
                        rounded-full
                        bg-blue-50/50
                        blur-3xl
                        xl:block
                    "
                />


                {children}

            </div>

        </section>
    );
}


export default TrainingManagementShell;