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
            formData.imageUrl
                ?.trim()
        );


    return (
        <form
            onSubmit={
                onSubmit
            }
            className="
                overflow-hidden
                rounded-xl
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
                    border-b
                    border-slate-100
                    px-4
                    py-4
                    sm:px-5
                "
            >
                <h2
                    className="
                        text-[12px]
                        font-semibold
                        text-slate-800
                    "
                >
                    {editingSection
                        ? "Edit Learning Section"
                        : "Add Learning Section"}
                </h2>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-400
                    "
                >
                    Add learning content to this training programme.
                </p>
            </div>


            <div
                className="
                    space-y-5
                    p-4
                    sm:p-5
                "
            >
                {/* ================================================= */}
                {/* TITLE */}
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
                        className={
                            inputClass
                        }
                        required
                    />


                    <div
                        className="
                            mt-1
                            flex
                            items-center
                            justify-between
                            gap-3
                            text-[7px]
                            text-slate-400
                        "
                    >
                        <span>
                            Minimum 2 characters
                        </span>


                        <span>
                            {
                                formData.title
                                    .length
                            }
                            /150
                        </span>
                    </div>
                </FormField>


                {/* ================================================= */}
                {/* CONTENT */}
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
                        placeholder="Enter the learning content..."
                        className={`
                            ${inputClass}
                            min-h-[220px]
                            resize-y
                            py-3
                            leading-5
                        `}
                        required
                    />
                </FormField>


                {/* ================================================= */}
                {/* IMAGE */}
                {/* ================================================= */}

                <div
                    className="
                        border-t
                        border-slate-100
                        pt-5
                    "
                >
                    <h3
                        className="
                            text-[10px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        Learning Image
                    </h3>


                    <p
                        className="
                            mt-1
                            text-[8px]
                            text-slate-400
                        "
                    >
                        Optional image for this learning section.
                    </p>


                    <div
                        className="
                            mt-4
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >
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
                        </FormField>


                        <FormField
                            label="Image Alt Text"
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
                                placeholder="Describe the image"
                                className={
                                    inputClass
                                }
                            />


                            <p
                                className="
                                    mt-1
                                    text-right
                                    text-[7px]
                                    text-slate-400
                                "
                            >
                                {
                                    formData
                                        .imageAltText
                                        .length
                                }
                                /250
                            </p>
                        </FormField>
                    </div>


                    {/* IMAGE PREVIEW */}

                    {imageExists && (
                        <div
                            className="
                                mt-4
                                overflow-hidden
                                rounded-lg
                                border
                                border-slate-200
                                bg-slate-50
                                p-3
                            "
                        >
                            <p
                                className="
                                    mb-2
                                    text-[8px]
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Preview
                            </p>


                            <img
                                src={
                                    formData.imageUrl
                                }
                                alt={
                                    formData.imageAltText ||
                                    "Learning section"
                                }
                                className="
                                    max-h-[260px]
                                    w-full
                                    rounded-md
                                    object-cover
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

                <div
                    className="
                        border-t
                        border-slate-100
                        pt-5
                    "
                >
                    <div
                        className="
                            max-w-md
                        "
                    >
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
                                className={
                                    inputClass
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
                        </FormField>
                    </div>
                </div>


                {/* ================================================= */}
                {/* ACTIONS */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        flex-col-reverse
                        gap-2
                        border-t
                        border-slate-100
                        pt-5
                        sm:flex-row
                        sm:justify-end
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
                        className="
                            w-full
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
// FIELD
// ======================================================

function FormField({
    label,
    required = false,
    children,
}) {
    return (
        <label
            className="
                block
            "
        >
            <span
                className="
                    mb-2
                    block
                    text-[8px]
                    font-medium
                    text-slate-500
                "
            >
                {label}


                {required && (
                    <span
                        className="
                            text-red-500
                        "
                    >
                        {" "}*
                    </span>
                )}
            </span>


            {children}
        </label>
    );
}


// ======================================================
// INPUT STYLE
// ======================================================

const inputClass = `
    min-h-[40px]
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[9px]
    text-slate-700
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-blue-500
    focus:ring-1
    focus:ring-blue-100
    disabled:cursor-not-allowed
    disabled:bg-slate-50
    disabled:text-slate-400
`;


export default LearningSectionForm;