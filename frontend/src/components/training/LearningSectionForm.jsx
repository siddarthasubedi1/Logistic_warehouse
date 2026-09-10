import ActionButton from "../ui/ActionButton";


function LearningSectionForm({
    formData,
    editingSection = null,
    saving = false,
    onChange,
    onSubmit,
    onCancel,
}) {

    // ======================================================
    // IMAGE
    // ======================================================

    const imageExists =
        Boolean(
            formData.imageUrl?.trim()
        );


    // ======================================================
    // UI
    // ======================================================

    return (
        <form
            onSubmit={
                onSubmit
            }
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    overflow-hidden
                    border-b
                    border-slate-200
                    bg-gradient-to-r
                    from-[#073763]
                    via-[#0b4f87]
                    to-[#1769aa]
                    px-5
                    py-5
                    text-white
                    sm:px-6
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-12
                        -top-12
                        h-32
                        w-32
                        rounded-full
                        bg-white/10
                    "
                />


                <div
                    className="
                        relative
                        flex
                        items-start
                        gap-4
                    "
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/15
                            bg-white/10
                        "
                    >

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <path d="M4 5h7v14H4z" />

                            <path d="M13 5h7v14h-7z" />

                            <path d="M7 9h2" />

                            <path d="M16 9h2" />
                        </svg>

                    </div>


                    <div>

                        <p
                            className="
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.18em]
                                text-blue-100
                            "
                        >
                            Learning Content
                        </p>


                        <h2
                            className="
                                mt-1
                                text-base
                                font-bold
                                sm:text-lg
                            "
                        >
                            {editingSection
                                ? "Edit Learning Section"
                                : "Add Learning Section"}
                        </h2>


                        <p
                            className="
                                mt-1
                                max-w-xl
                                text-[10px]
                                leading-5
                                text-blue-100
                            "
                        >
                            Add structured workplace safety information,
                            instructions and supporting visual content.
                        </p>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* FORM BODY */}
            {/* ================================================= */}

            <div
                className="
                    space-y-6
                    p-4
                    sm:p-5
                    lg:p-6
                "
            >

                {/* ================================================= */}
                {/* MAIN CONTENT */}
                {/* ================================================= */}

                <FormSection
                    title="Section Content"
                    description="Enter the title and learning information Trainees will read."
                    icon="content"
                >

                    <div className="space-y-5">

                        {/* TITLE */}

                        <FormField
                            label="Section Title"
                            required
                        >

                            <input
                                type="text"
                                name="title"
                                minLength="2"
                                maxLength="150"
                                value={
                                    formData.title
                                }
                                onChange={
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Example: Correct Lifting Technique"
                                className={
                                    inputClass
                                }
                                required
                            />


                            <div
                                className="
                                    mt-2
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    text-[9px]
                                    text-slate-400
                                "
                            >

                                <span>
                                    Minimum 2 characters.
                                </span>


                                <span
                                    className="
                                        font-semibold
                                    "
                                >
                                    {formData.title.length}/150
                                </span>

                            </div>

                        </FormField>


                        {/* CONTENT */}

                        <FormField
                            label="Learning Content"
                            required
                        >

                            <textarea
                                name="content"
                                rows="10"
                                value={
                                    formData.content
                                }
                                onChange={
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Enter safety information, instructions, examples and important learning points..."
                                className={`${inputClass} min-h-[220px] resize-y`}
                                required
                            />


                            <HelperText>
                                Keep the section focused on one clear safety topic where possible.
                            </HelperText>

                        </FormField>

                    </div>

                </FormSection>


                {/* ================================================= */}
                {/* IMAGE */}
                {/* ================================================= */}

                <FormSection
                    title="Section Image"
                    description="Add an optional supporting workplace safety image."
                    icon="image"
                >

                    <div
                        className="
                            grid
                            gap-4
                            lg:grid-cols-2
                        "
                    >

                        {/* IMAGE URL */}

                        <FormField
                            label="Image URL"
                        >

                            <input
                                type="url"
                                name="imageUrl"
                                value={
                                    formData.imageUrl
                                }
                                onChange={
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="https://example.com/image.jpg"
                                className={
                                    inputClass
                                }
                            />


                            <HelperText>
                                Optional. Enter a direct URL to a relevant learning image.
                            </HelperText>

                        </FormField>


                        {/* ALT TEXT */}

                        <FormField
                            label="Image Alt Text"
                            required={
                                imageExists
                            }
                        >

                            <input
                                type="text"
                                name="imageAltText"
                                maxLength="250"
                                value={
                                    formData.imageAltText
                                }
                                onChange={
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Example: Worker lifting a box using correct posture"
                                className={
                                    inputClass
                                }
                                required={
                                    imageExists
                                }
                            />


                            <div
                                className="
                                    mt-2
                                    flex
                                    items-start
                                    justify-between
                                    gap-3
                                    text-[9px]
                                    text-slate-400
                                "
                            >

                                <span>
                                    {imageExists
                                        ? "Required because an image URL is provided."
                                        : "Required only when an image is used."}
                                </span>


                                <span
                                    className="
                                        shrink-0
                                        font-semibold
                                    "
                                >
                                    {formData.imageAltText.length}/250
                                </span>

                            </div>

                        </FormField>

                    </div>


                    {/* IMAGE PREVIEW */}

                    {imageExists && (
                        <div
                            className="
                                mt-5
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
                            "
                        >

                            <div
                                className="
                                    mb-3
                                    flex
                                    flex-col
                                    gap-2
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-[11px]
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        Image Preview
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-[9px]
                                            text-slate-500
                                        "
                                    >
                                        Preview how the supporting learning image will appear.
                                    </p>

                                </div>


                                <span
                                    className="
                                        w-fit
                                        rounded-full
                                        bg-blue-50
                                        px-3
                                        py-1
                                        text-[9px]
                                        font-semibold
                                        text-blue-700
                                    "
                                >
                                    Optional Visual
                                </span>

                            </div>


                            <div
                                className="
                                    flex
                                    min-h-[180px]
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                "
                            >

                                <img
                                    src={
                                        formData.imageUrl
                                    }
                                    alt={
                                        formData.imageAltText ||
                                        "Learning section preview"
                                    }
                                    className="
                                        max-h-[360px]
                                        w-full
                                        object-contain
                                    "
                                    onError={(
                                        event
                                    ) => {
                                        event.currentTarget.style.display =
                                            "none";
                                    }}
                                />

                            </div>


                            {formData.imageAltText && (
                                <div
                                    className="
                                        mt-3
                                        rounded-xl
                                        bg-white
                                        px-3
                                        py-2
                                        text-[9px]
                                        text-slate-500
                                    "
                                >
                                    <span
                                        className="
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        Alternative text:
                                    </span>{" "}
                                    {formData.imageAltText}
                                </div>
                            )}

                        </div>
                    )}

                </FormSection>


                {/* ================================================= */}
                {/* STATUS */}
                {/* ================================================= */}

                <FormSection
                    title="Section Availability"
                    description="Control whether Trainees can access this learning section."
                    icon="status"
                >

                    <FormField
                        label="Section Status"
                        required
                    >

                        <div className="relative">

                            <select
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                className={
                                    selectClass
                                }
                                required
                            >
                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>


                            <SelectArrow />

                        </div>


                        <div
                            className="
                                mt-3
                                grid
                                gap-3
                                sm:grid-cols-2
                            "
                        >

                            <StatusCard
                                title="Active"
                                description="Available to Trainees through the learning flow."
                                selected={
                                    formData.status ===
                                    "active"
                                }
                                type="active"
                            />


                            <StatusCard
                                title="Inactive"
                                description="Retained in the programme but unavailable to normal Trainee access."
                                selected={
                                    formData.status ===
                                    "inactive"
                                }
                                type="inactive"
                            />

                        </div>

                    </FormField>

                </FormSection>


                {/* ================================================= */}
                {/* ORDER */}
                {/* ================================================= */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-blue-100
                        bg-gradient-to-r
                        from-blue-50
                        to-white
                        p-4
                        sm:p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-white
                                text-blue-600
                                shadow-sm
                            "
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <path d="M8 5h12" />

                                <path d="M8 12h12" />

                                <path d="M8 19h12" />

                                <path d="m3 7 2-2 2 2" />

                                <path d="m3 17 2 2 2-2" />
                            </svg>

                        </div>


                        <div>

                            <p
                                className="
                                    text-[11px]
                                    font-bold
                                    text-blue-800
                                "
                            >
                                Section Order
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    leading-5
                                    text-blue-700
                                "
                            >
                                New sections are automatically added to
                                the end of the programme. Their position
                                can later be changed using the existing
                                Move Up and Move Down controls.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* ACTIONS */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        flex-col-reverse
                        gap-3
                        border-t
                        border-slate-100
                        pt-5
                        sm:flex-row
                        sm:justify-end
                    "
                >

                    <ActionButton
                        variant="secondary"
                        disabled={
                            saving
                        }
                        onClick={
                            onCancel
                        }
                        className="
                            w-full
                            justify-center
                            sm:w-auto
                        "
                    >
                        Cancel
                    </ActionButton>


                    <ActionButton
                        type="submit"
                        variant="primary"
                        disabled={
                            saving
                        }
                        className="
                            w-full
                            justify-center
                            sm:w-auto
                        "
                    >
                        {saving
                            ? "Saving..."
                            : editingSection
                                ? "Save Changes"
                                : "Add Section"}
                    </ActionButton>

                </div>

            </div>

        </form>
    );
}


// ======================================================
// FORM SECTION
// ======================================================

function FormSection({
    title,
    description,
    icon,
    children,
}) {
    return (
        <section>

            <div
                className="
                    mb-5
                    flex
                    items-start
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                    "
                >
                    <SectionIcon
                        type={
                            icon
                        }
                    />
                </div>


                <div>

                    <h3
                        className="
                            text-sm
                            font-bold
                            text-slate-900
                        "
                    >
                        {title}
                    </h3>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            leading-5
                            text-slate-500
                        "
                    >
                        {description}
                    </p>

                </div>

            </div>


            {children}

        </section>
    );
}


// ======================================================
// FORM FIELD
// ======================================================

function FormField({
    label,
    required = false,
    children,
}) {
    return (
        <label className="block">

            <span
                className="
                    text-[11px]
                    font-semibold
                    text-slate-700
                "
            >
                {label}

                {required && (
                    <span
                        className="
                            ml-1
                            text-red-500
                        "
                    >
                        *
                    </span>
                )}

            </span>


            <div className="mt-2">
                {children}
            </div>

        </label>
    );
}


// ======================================================
// HELPER
// ======================================================

function HelperText({
    children,
}) {
    return (
        <p
            className="
                mt-2
                text-[9px]
                leading-4
                text-slate-400
            "
        >
            {children}
        </p>
    );
}


// ======================================================
// STATUS CARD
// ======================================================

function StatusCard({
    title,
    description,
    selected,
    type,
}) {
    return (
        <div
            className={`
                rounded-xl
                border
                p-3
                transition

                ${selected
                    ? type ===
                        "active"
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-red-200 bg-red-50"
                    : "border-slate-200 bg-slate-50"
                }
            `}
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <span
                    className={`
                        h-2
                        w-2
                        rounded-full

                        ${selected
                            ? type ===
                                "active"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            : "bg-slate-300"
                        }
                    `}
                />


                <p
                    className="
                        text-[10px]
                        font-bold
                        text-slate-700
                    "
                >
                    {title}
                </p>

            </div>


            <p
                className="
                    mt-2
                    text-[9px]
                    leading-4
                    text-slate-500
                "
            >
                {description}
            </p>

        </div>
    );
}


// ======================================================
// ICON
// ======================================================

function SectionIcon({
    type,
}) {

    if (
        type ===
        "image"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="2"
                />

                <circle
                    cx="8"
                    cy="9"
                    r="2"
                />

                <path d="m4 18 5-5 3 3 3-4 5 6" />
            </svg>
        );
    }


    if (
        type ===
        "status"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />

                <path d="m8 12 2.5 2.5L16 9" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path d="M5 4h14v16H5z" />

            <path d="M8 8h8" />

            <path d="M8 12h8" />

            <path d="M8 16h5" />
        </svg>
    );
}


// ======================================================
// SELECT ARROW
// ======================================================

function SelectArrow() {
    return (
        <div
            className="
                pointer-events-none
                absolute
                inset-y-0
                right-0
                flex
                items-center
                pr-3
                text-slate-400
            "
        >

            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
            >
                <path d="m7 10 5 5 5-5" />
            </svg>

        </div>
    );
}


// ======================================================
// SHARED INPUT STYLE
// ======================================================

const inputClass = `
    w-full
    rounded-xl
    border
    border-slate-300
    bg-white
    px-3.5
    py-3
    text-xs
    text-slate-800
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
    disabled:cursor-not-allowed
    disabled:bg-slate-100
    disabled:text-slate-500
`;


const selectClass = `
    w-full
    appearance-none
    rounded-xl
    border
    border-slate-300
    bg-white
    px-3.5
    py-3
    pr-10
    text-xs
    text-slate-800
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
    disabled:cursor-not-allowed
    disabled:bg-slate-100
    disabled:text-slate-500
`;


export default LearningSectionForm;