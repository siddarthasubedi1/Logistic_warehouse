import ActionButton from "../ui/ActionButton";


function LearningSectionForm({
    formData,
    editingSection = null,
    saving = false,

    imageFile = null,
    imagePreview = "",

    onChange,
    onImageChange,
    onSubmit,
    onCancel,
}) {
    const titleLength =
        formData?.title?.length ||
        0;

    const altTextLength =
        formData?.imageAltText
            ?.length ||
        0;

    const hasImage =
        Boolean(
            imageFile ||
            imagePreview
        );


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
            {/* ==========================================
                HEADER
            =========================================== */}

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
                                text-white
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
                            Add structured workplace safety
                            information, instructions and a
                            supporting training image.
                        </p>
                    </div>
                </div>
            </div>


            {/* ==========================================
                BODY
            =========================================== */}

            <div
                className="
                    space-y-7
                    p-4
                    sm:p-5
                    lg:p-6
                "
            >
                {/* ======================================
                    CONTENT
                ======================================= */}

                <FormSection
                    title="Section Content"
                    description="Enter the title and learning information Trainees will read."
                    icon="content"
                >
                    <div className="space-y-5">
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
                                    formData?.title ||
                                    ""
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
                                    justify-between
                                    gap-3
                                    text-[9px]
                                    text-slate-400
                                "
                            >
                                <span>
                                    Minimum 2 characters.
                                </span>

                                <span className="font-semibold">
                                    {titleLength}/150
                                </span>
                            </div>
                        </FormField>


                        <FormField
                            label="Learning Content"
                            required
                        >
                            <textarea
                                name="content"
                                rows="10"
                                value={
                                    formData?.content ||
                                    ""
                                }
                                onChange={
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Enter safety information, instructions, examples and important learning points..."
                                className={`
                                    ${inputClass}
                                    min-h-[220px]
                                    resize-y
                                    py-3
                                    leading-5
                                `}
                                required
                            />

                            <HelperText>
                                Keep the section focused on one
                                clear safety topic where possible.
                            </HelperText>
                        </FormField>
                    </div>
                </FormSection>


                {/* ======================================
                    IMAGE
                ======================================= */}

                <FormSection
                    title="Section Image"
                    description="Upload a supporting workplace safety image for this learning section."
                    icon="image"
                >
                    <div
                        className="
                            grid
                            gap-5
                            lg:grid-cols-2
                        "
                    >
                        {/* IMAGE FILE */}

                        <FormField
                            label="Upload Image"
                            required={
                                !editingSection
                            }
                        >
                            <label
                                className="
                                    group
                                    flex
                                    min-h-[145px]
                                    cursor-pointer
                                    flex-col
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border-2
                                    border-dashed
                                    border-slate-300
                                    bg-slate-50
                                    px-5
                                    py-5
                                    text-center
                                    transition

                                    hover:border-blue-400
                                    hover:bg-blue-50/50
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-100
                                        text-blue-600
                                    "
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                    >
                                        <path d="M12 16V4" />
                                        <path d="m7 9 5-5 5 5" />
                                        <path d="M5 14v5h14v-5" />
                                    </svg>
                                </div>


                                <p
                                    className="
                                        mt-3
                                        max-w-full
                                        truncate
                                        text-[10px]
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    {imageFile
                                        ? imageFile.name
                                        : editingSection &&
                                            hasImage
                                            ? "Choose a new image to replace current image"
                                            : "Choose training image"}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        text-slate-500
                                    "
                                >
                                    JPG, PNG or WebP • Maximum 5 MB
                                </p>


                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={
                                        onImageChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="hidden"
                                />
                            </label>


                            {editingSection && (
                                <HelperText>
                                    Leave this unchanged to keep the
                                    current image, or choose another
                                    image to replace it.
                                </HelperText>
                            )}
                        </FormField>


                        {/* ALT TEXT */}

                        <FormField
                            label="Image Alt Text"
                            required
                        >
                            <input
                                type="text"
                                name="imageAltText"
                                maxLength="250"
                                value={
                                    formData
                                        ?.imageAltText ||
                                    ""
                                }
                                onChange={
                                    onChange
                                }
                                disabled={
                                    saving
                                }
                                placeholder="Example: Worker lifting a box with correct posture"
                                className={
                                    inputClass
                                }
                                required
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
                                    Describe the image for accessibility.
                                </span>

                                <span
                                    className="
                                        shrink-0
                                        font-semibold
                                    "
                                >
                                    {altTextLength}/250
                                </span>
                            </div>


                            <div
                                className="
                                    mt-4
                                    rounded-lg
                                    border
                                    border-blue-100
                                    bg-blue-50
                                    p-3
                                "
                            >
                                <p
                                    className="
                                        text-[8px]
                                        font-semibold
                                        leading-4
                                        text-blue-700
                                    "
                                >
                                    The image is uploaded directly
                                    from your computer. You no longer
                                    need to enter an Image URL.
                                </p>
                            </div>
                        </FormField>
                    </div>


                    {/* IMAGE PREVIEW */}

                    {imagePreview && (
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
                                            text-[8px]
                                            text-slate-500
                                        "
                                    >
                                        Preview of the image that
                                        will appear in this learning
                                        section.
                                    </p>
                                </div>


                                <span
                                    className="
                                        w-fit
                                        rounded-full
                                        bg-blue-50
                                        px-3
                                        py-1
                                        text-[7px]
                                        font-semibold
                                        text-blue-700
                                    "
                                >
                                    Training Image
                                </span>
                            </div>


                            <div
                                className="
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                "
                            >
                                <img
                                    src={
                                        imagePreview
                                    }
                                    alt={
                                        formData
                                            ?.imageAltText ||
                                        "Training image preview"
                                    }
                                    className="
                                        mx-auto
                                        max-h-[420px]
                                        w-full
                                        object-contain
                                    "
                                />
                            </div>
                        </div>
                    )}
                </FormSection>


                {/* ======================================
                    STATUS
                ======================================= */}

                <FormSection
                    title="Section Status"
                    description="Control whether this learning section is currently available."
                    icon="status"
                >
                    <FormField
                        label="Status"
                        required
                    >
                        <select
                            name="status"
                            value={
                                formData?.status ||
                                "active"
                            }
                            onChange={
                                onChange
                            }
                            disabled={
                                saving
                            }
                            className={
                                inputClass
                            }
                        >
                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </FormField>
                </FormSection>
            </div>


            {/* ==========================================
                ACTIONS
            =========================================== */}

            <div
                className="
                    flex
                    flex-col-reverse
                    gap-2
                    border-t
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-4
                    sm:flex-row
                    sm:justify-end
                    sm:px-6
                "
            >
                <ActionButton
                    type="button"
                    variant="secondary"
                    disabled={
                        saving
                    }
                    onClick={
                        onCancel
                    }
                >
                    Cancel
                </ActionButton>


                <ActionButton
                    type="submit"
                    variant="primary"
                    disabled={
                        saving
                    }
                >
                    {saving
                        ? "Saving..."
                        : editingSection
                            ? "Save Changes"
                            : "Create Section"}
                </ActionButton>
            </div>
        </form>
    );
}


/* =========================================================
   FORM SECTION
========================================================= */

function FormSection({
    title,
    description,
    icon,
    children,
}) {
    return (
        <section
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
            "
        >
            <div
                className="
                    flex
                    items-start
                    gap-3
                    border-b
                    border-slate-100
                    px-4
                    py-4
                    sm:px-5
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
                        rounded-lg
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
                            text-[11px]
                            font-bold
                            text-[#172033]
                        "
                    >
                        {title}
                    </h3>

                    <p
                        className="
                            mt-1
                            text-[8px]
                            leading-4
                            text-slate-500
                        "
                    >
                        {description}
                    </p>
                </div>
            </div>


            <div
                className="
                    p-4
                    sm:p-5
                "
            >
                {children}
            </div>
        </section>
    );
}


/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
    label,
    required = false,
    children,
}) {
    return (
        <div>
            <label
                className="
                    mb-2
                    block
                    text-[9px]
                    font-semibold
                    text-slate-700
                "
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            {children}
        </div>
    );
}


/* =========================================================
   HELPER TEXT
========================================================= */

function HelperText({
    children,
}) {
    return (
        <p
            className="
                mt-2
                text-[8px]
                leading-4
                text-slate-400
            "
        >
            {children}
        </p>
    );
}


/* =========================================================
   ICON
========================================================= */

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
                className="h-4 w-4"
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

                <path d="m5 18 5-5 3 3 2-2 4 4" />
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
                className="h-4 w-4"
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
            className="h-4 w-4"
        >
            <path d="M4 5h16v14H4z" />
            <path d="M8 9h8" />
            <path d="M8 13h6" />
        </svg>
    );
}


const inputClass = `
    min-h-[42px]
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[10px]
    text-[#172033]
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


export default LearningSectionForm;