import ActionButton from "../ui/ActionButton";


function LearningSectionForm({
    formData,
    editingSection = null,
    saving = false,
    onChange,
    onSubmit,
    onCancel,
}) {
    const imageExists =
        Boolean(
            formData.imageUrl?.trim()
        );


    return (
        <form
            onSubmit={onSubmit}
            className="
                space-y-6
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
            "
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div>
                <h2 className="text-base font-bold text-slate-900">
                    {editingSection
                        ? "Edit Learning Section"
                        : "Add Learning Section"}
                </h2>


                <p className="mt-1 text-xs leading-5 text-slate-500">
                    Add structured learning content to this training
                    programme.
                </p>
            </div>


            {/* ================================================= */}
            {/* SECTION TITLE */}
            {/* ================================================= */}

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
                    placeholder="Enter learning section title"
                    className={inputClass}
                    required
                />


                <div className="mt-1 flex items-center justify-between gap-3 text-[11px] text-slate-400">
                    <span>
                        Minimum 2 characters.
                    </span>

                    <span>
                        {formData.title.length}/150
                    </span>
                </div>
            </FormField>


            {/* ================================================= */}
            {/* LEARNING CONTENT */}
            {/* ================================================= */}

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
                    placeholder="Enter the learning content for this section..."
                    className={inputClass}
                    required
                />


                <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    Enter the information, instructions, or examples
                    that the Trainee should read in this section.
                </p>
            </FormField>


            {/* ================================================= */}
            {/* OPTIONAL IMAGE */}
            {/* ================================================= */}

            <div className="border-t border-slate-100 pt-5">

                <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                        Section Image
                    </h3>


                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        An image is optional. If you add an image,
                        alternative text is required for accessibility.
                    </p>
                </div>


                <div className="grid gap-4 md:grid-cols-2">

                    {/* ============================================= */}
                    {/* IMAGE URL */}
                    {/* ============================================= */}

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
                            className={inputClass}
                        />
                    </FormField>


                    {/* ============================================= */}
                    {/* IMAGE ALT TEXT */}
                    {/* ============================================= */}

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
                            placeholder="Example: Worker lifting a box safely"
                            className={inputClass}
                            required={
                                imageExists
                            }
                        />


                        <div className="mt-1 flex items-center justify-between gap-3 text-[11px] text-slate-400">
                            <span>
                                {imageExists
                                    ? "Required because an image URL is provided."
                                    : "Required only when an image is used."}
                            </span>

                            <span>
                                {formData.imageAltText.length}/250
                            </span>
                        </div>
                    </FormField>

                </div>


                {/* ============================================= */}
                {/* IMAGE PREVIEW */}
                {/* ============================================= */}

                {imageExists && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">

                        <p className="mb-3 text-xs font-semibold text-slate-700">
                            Image Preview
                        </p>


                        <img
                            src={
                                formData.imageUrl
                            }
                            alt={
                                formData.imageAltText ||
                                "Learning section preview"
                            }
                            className="
                                max-h-72
                                w-full
                                rounded-lg
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
                )}

            </div>


            {/* ================================================= */}
            {/* STATUS */}
            {/* ================================================= */}

            <div className="border-t border-slate-100 pt-5">

                <FormField
                    label="Section Status"
                    required
                >
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
                        className={inputClass}
                        required
                    >
                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>
                    </select>


                    <p className="mt-1 text-[11px] leading-5 text-slate-400">
                        Active sections are available to Trainees.
                        Inactive sections are retained but hidden from
                        normal learning access.
                    </p>
                </FormField>

            </div>


            {/* ================================================= */}
            {/* ORDER INFORMATION */}
            {/* ================================================= */}

            <div
                className="
                    rounded-xl
                    border
                    border-blue-100
                    bg-blue-50
                    p-4
                "
            >
                <p className="text-xs font-semibold text-blue-800">
                    Section Order
                </p>


                <p className="mt-1 text-[11px] leading-5 text-blue-700">
                    New sections are automatically added to the end
                    of the programme. You can change their position
                    later using the Move Up and Move Down buttons.
                </p>
            </div>


            {/* ================================================= */}
            {/* ACTIONS */}
            {/* ================================================= */}

            <div
                className="
                    flex
                    flex-wrap
                    justify-end
                    gap-3
                    border-t
                    border-slate-100
                    pt-5
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
                            : "Add Section"}
                </ActionButton>
            </div>

        </form>
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

            <span className="text-xs font-semibold text-slate-700">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
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
// SHARED INPUT STYLE
// ======================================================

const inputClass = `
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    py-2.5
    text-sm
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