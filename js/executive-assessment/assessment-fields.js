/* ==========================================================
   GrowWithHR
   Executive Advisory Assessment Field Builders

   Responsibility:
   - Generate reusable assessment-field HTML
   - Preserve saved values and selected options
   - Preserve current CSS classes and DOM attributes
   - Preserve validation-message placeholders
   - Preserve current accessibility relationships

   This module must not:
   - read or modify controller state directly;
   - access localStorage;
   - attach DOM event listeners;
   - validate answers;
   - move between assessment screens;
   - generate reports or PDFs;
   - send email-delivery requests.

   Every field builder receives the required answers through an
   explicit context object.
========================================================== */

(() => {
    "use strict";

    const modules =
        window.GrowWithHRModules =
        window.GrowWithHRModules || {};

    /**
     * Returns the shared utility module when it is available.
     *
     * @returns {Object}
     */
    function utils() {
        return (
            modules.AssessmentUtils ||
            {}
        );
    }

    /**
     * Fallback HTML escaping used only when AssessmentUtils has not loaded.
     *
     * @param {*} value
     * @returns {string}
     */
    function fallbackEscapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Escapes content inserted into generated HTML.
     *
     * @param {*} value
     * @returns {string}
     */
    function escapeHtml(value) {
        const helper =
            utils().escapeHtml;

        return (
            typeof helper === "function"
                ? helper(value)
                : fallbackEscapeHtml(value)
        );
    }

    /**
     * Escapes content inserted into an HTML attribute.
     *
     * @param {*} value
     * @returns {string}
     */
    function escapeAttribute(value) {
        const helper =
            utils().escapeAttribute;

        if (
            typeof helper === "function"
        ) {
            return helper(value);
        }

        return fallbackEscapeHtml(
            value
        ).replace(
            /`/g,
            "&#96;"
        );
    }

    /**
     * Returns a safe answer object from a rendering context.
     *
     * @param {*} context
     * @returns {Object}
     */
    function resolveAnswers(context) {
        if (
            context &&
            typeof context === "object" &&
            !Array.isArray(context) &&
            context.answers &&
            typeof context.answers === "object" &&
            !Array.isArray(context.answers)
        ) {
            return context.answers;
        }

        return {};
    }

    /**
     * Resolves a field value.
     *
     * An explicitly supplied value takes priority over the answer object.
     *
     * @param {Object} configuration
     * @param {Object} context
     * @returns {*}
     */
    function resolveValue(
        configuration,
        context
    ) {
        if (
            Object.prototype.hasOwnProperty.call(
                configuration,
                "value"
            )
        ) {
            return configuration.value;
        }

        const answers =
            resolveAnswers(context);

        return answers[
            configuration.id
        ];
    }

    /**
     * Creates the aria-describedby value used by standard fields.
     *
     * @param {string} id
     * @param {string} helper
     * @returns {string}
     */
    function describedBy(
        id,
        helper
    ) {
        return (
            helper
                ? `${id}Help ${id}Error`
                : `${id}Error`
        );
    }

    /**
     * Generates a required-field marker.
     *
     * @param {boolean} required
     * @returns {string}
     */
    function requiredMarker(required) {
        return required
            ? '<span aria-hidden="true">*</span>'
            : "";
    }

    /**
     * Generates an optional-field marker.
     *
     * @param {boolean} optional
     * @returns {string}
     */
    function optionalMarker(optional) {
        return optional
            ? (
                '<span class="advisory-optional-label">' +
                "Optional" +
                "</span>"
            )
            : "";
    }

    /**
     * Creates a standard text input.
     *
     * @param {Object} configuration
     * @param {string} configuration.id
     * @param {string} configuration.label
     * @param {string} [configuration.helper]
     * @param {string} [configuration.placeholder]
     * @param {string} [configuration.autocomplete]
     * @param {boolean} [configuration.required]
     * @param {boolean} [configuration.optional]
     * @param {*} [configuration.value]
     * @param {Object} [context]
     * @returns {string}
     */
    function textField(
        {
            id,
            label,
            helper = "",
            placeholder = "",
            autocomplete = "off",
            required = false,
            optional = false,
            value
        },
        context = {}
    ) {
        const fieldValue =
            resolveValue(
                {
                    id,
                    value,
                    ...(value === undefined
                        ? {}
                        : { value })
                },
                context
            );

        return `
            <div class="advisory-field" data-field-wrapper="${escapeAttribute(id)}">
                <label for="${escapeAttribute(id)}">
                    ${label}
                    ${requiredMarker(required)}
                    ${optionalMarker(optional)}
                </label>
                <input
                    id="${escapeAttribute(id)}"
                    name="${escapeAttribute(id)}"
                    type="text"
                    autocomplete="${escapeAttribute(autocomplete)}"
                    placeholder="${escapeAttribute(placeholder)}"
                    value="${escapeAttribute(fieldValue || "")}"
                    aria-describedby="${escapeAttribute(describedBy(id, helper))}"
                    ${required ? "required" : ""}>
                ${helper
                    ? (
                        `<p id="${escapeAttribute(id)}Help" ` +
                        `class="advisory-field-help">${helper}</p>`
                    )
                    : ""}
                <p
                    id="${escapeAttribute(id)}Error"
                    class="advisory-field-error"
                    hidden>
                </p>
            </div>
        `;
    }

    /**
     * Creates a textarea field.
     *
     * @param {Object} configuration
     * @param {string} configuration.id
     * @param {string} configuration.label
     * @param {string} [configuration.helper]
     * @param {string} [configuration.placeholder]
     * @param {number} [configuration.maxlength]
     * @param {boolean} [configuration.required]
     * @param {boolean} [configuration.optional]
     * @param {boolean} [configuration.showCounter]
     * @param {*} [configuration.value]
     * @param {Object} [context]
     * @returns {string}
     */
    function textareaField(
        {
            id,
            label,
            helper = "",
            placeholder = "",
            maxlength = 240,
            required = false,
            optional = false,
            showCounter = false,
            value
        },
        context = {}
    ) {
        const resolvedValue =
            resolveValue(
                {
                    id,
                    ...(value === undefined
                        ? {}
                        : { value })
                },
                context
            );

        const fieldValue =
            String(
                resolvedValue || ""
            );

        const safeMaximum =
            Number.isInteger(
                Number(maxlength)
            )
                ? Number(maxlength)
                : 240;

        return `
            <div class="advisory-field" data-field-wrapper="${escapeAttribute(id)}">
                <label for="${escapeAttribute(id)}">
                    ${label}
                    ${requiredMarker(required)}
                    ${optionalMarker(optional)}
                </label>
                <textarea
                    id="${escapeAttribute(id)}"
                    name="${escapeAttribute(id)}"
                    rows="4"
                    maxlength="${escapeAttribute(safeMaximum)}"
                    placeholder="${escapeAttribute(placeholder)}"
                    aria-describedby="${escapeAttribute(describedBy(id, helper))}"
                    ${required ? "required" : ""}>${escapeHtml(fieldValue)}</textarea>
                <div class="advisory-field-meta">
                    ${helper
                        ? (
                            `<p id="${escapeAttribute(id)}Help" ` +
                            `class="advisory-field-help">${helper}</p>`
                        )
                        : "<span></span>"}
                    ${showCounter
                        ? (
                            `<span id="${escapeAttribute(id)}Counter" ` +
                            `class="advisory-character-count">` +
                            `${fieldValue.length}/${safeMaximum}` +
                            "</span>"
                        )
                        : ""}
                </div>
                <p
                    id="${escapeAttribute(id)}Error"
                    class="advisory-field-error"
                    hidden>
                </p>
            </div>
        `;
    }

    /**
     * Creates a whole-number input.
     *
     * @param {Object} configuration
     * @param {string} configuration.id
     * @param {string} configuration.label
     * @param {string} [configuration.helper]
     * @param {string} [configuration.placeholder]
     * @param {boolean} [configuration.required]
     * @param {boolean} [configuration.optional]
     * @param {number|string} [configuration.min]
     * @param {number|string} [configuration.max]
     * @param {*} [configuration.value]
     * @param {Object} [context]
     * @returns {string}
     */
    function numberField(
        {
            id,
            label,
            helper = "",
            placeholder = "",
            required = false,
            optional = false,
            min = 0,
            max = "",
            value
        },
        context = {}
    ) {
        const fieldValue =
            resolveValue(
                {
                    id,
                    ...(value === undefined
                        ? {}
                        : { value })
                },
                context
            );

        return `
            <div class="advisory-field" data-field-wrapper="${escapeAttribute(id)}">
                <label for="${escapeAttribute(id)}">
                    ${label}
                    ${requiredMarker(required)}
                    ${optionalMarker(optional)}
                </label>
                <input
                    id="${escapeAttribute(id)}"
                    name="${escapeAttribute(id)}"
                    type="number"
                    inputmode="numeric"
                    step="1"
                    min="${escapeAttribute(min)}"
                    ${max !== ""
                        ? `max="${escapeAttribute(max)}"`
                        : ""}
                    placeholder="${escapeAttribute(placeholder)}"
                    value="${escapeAttribute(fieldValue ?? "")}"
                    aria-describedby="${escapeAttribute(describedBy(id, helper))}"
                    ${required ? "required" : ""}>
                ${helper
                    ? (
                        `<p id="${escapeAttribute(id)}Help" ` +
                        `class="advisory-field-help">${helper}</p>`
                    )
                    : ""}
                <p
                    id="${escapeAttribute(id)}Error"
                    class="advisory-field-error"
                    hidden>
                </p>
            </div>
        `;
    }

    /**
     * Creates a searchable input connected to a datalist.
     *
     * @param {Object} configuration
     * @param {string} configuration.id
     * @param {string} configuration.label
     * @param {string} [configuration.helper]
     * @param {string} [configuration.placeholder]
     * @param {Array} [configuration.options]
     * @param {boolean} [configuration.required]
     * @param {*} [configuration.value]
     * @param {Object} [context]
     * @returns {string}
     */
    function datalistField(
        {
            id,
            label,
            helper = "",
            placeholder = "",
            options = [],
            required = false,
            value
        },
        context = {}
    ) {
        const fieldValue =
            resolveValue(
                {
                    id,
                    ...(value === undefined
                        ? {}
                        : { value })
                },
                context
            );

        return `
            <div class="advisory-field" data-field-wrapper="${escapeAttribute(id)}">
                <label for="${escapeAttribute(id)}">
                    ${label}
                    ${requiredMarker(required)}
                </label>
                <input
                    id="${escapeAttribute(id)}"
                    name="${escapeAttribute(id)}"
                    type="search"
                    list="${escapeAttribute(id)}Options"
                    autocomplete="off"
                    spellcheck="false"
                    placeholder="${escapeAttribute(placeholder)}"
                    value="${escapeAttribute(fieldValue || "")}"
                    aria-describedby="${escapeAttribute(describedBy(id, helper))}"
                    ${required ? "required" : ""}>
                <datalist id="${escapeAttribute(id)}Options">
                    ${renderDatalistOptions(options)}
                </datalist>
                ${helper
                    ? (
                        `<p id="${escapeAttribute(id)}Help" ` +
                        `class="advisory-field-help">${helper}</p>`
                    )
                    : ""}
                <p
                    id="${escapeAttribute(id)}Error"
                    class="advisory-field-error"
                    hidden>
                </p>
            </div>
        `;
    }

    /**
     * Converts strings or value/label objects into datalist options.
     *
     * Supported values:
     *
     * "Karnataka"
     *
     * or:
     *
     * {
     *   value: "SaaS",
     *   label: "Information Technology / SaaS · Technology & Digital"
     * }
     *
     * @param {Array} options
     * @returns {string}
     */
    function renderDatalistOptions(options) {
        return (
            Array.isArray(options)
                ? options
                : []
        )
            .map((option) => {
                const value =
                    typeof option === "string"
                        ? option
                        : option?.value;

                const label =
                    typeof option === "string"
                        ? ""
                        : option?.label;

                if (!value) {
                    return "";
                }

                return (
                    `<option value="${escapeAttribute(value)}"` +
                    (
                        label
                            ? (
                                ` label="${escapeAttribute(label)}"`
                            )
                            : ""
                    ) +
                    "></option>"
                );
            })
            .join("");
    }

    /**
     * Creates a select field.
     *
     * Options use this structure:
     *
     * [
     *   ["Private Limited", "Private Limited"],
     *   ["LLP", "LLP"]
     * ]
     *
     * @param {Object} configuration
     * @param {string} configuration.id
     * @param {string} configuration.label
     * @param {string} [configuration.helper]
     * @param {Array} [configuration.options]
     * @param {string} [configuration.placeholder]
     * @param {boolean} [configuration.required]
     * @param {boolean} [configuration.optional]
     * @param {*} [configuration.value]
     * @param {Object} [context]
     * @returns {string}
     */
    function selectField(
        {
            id,
            label,
            helper = "",
            options = [],
            placeholder = "Please select",
            required = false,
            optional = false,
            value
        },
        context = {}
    ) {
        const selectedValue =
            resolveValue(
                {
                    id,
                    ...(value === undefined
                        ? {}
                        : { value })
                },
                context
            );

        const optionMarkup =
            (
                Array.isArray(options)
                    ? options
                    : []
            )
                .map((option) => {
                    if (
                        !Array.isArray(option) ||
                        option.length < 2
                    ) {
                        return "";
                    }

                    const [
                        optionValue,
                        optionLabel
                    ] = option;

                    return `
                        <option
                            value="${escapeAttribute(optionValue)}"
                            ${selectedValue === optionValue
                                ? "selected"
                                : ""}>
                            ${optionLabel}
                        </option>
                    `;
                })
                .join("");

        return `
            <div class="advisory-field" data-field-wrapper="${escapeAttribute(id)}">
                <label for="${escapeAttribute(id)}">
                    ${label}
                    ${requiredMarker(required)}
                    ${optionalMarker(optional)}
                </label>
                <select
                    id="${escapeAttribute(id)}"
                    name="${escapeAttribute(id)}"
                    aria-describedby="${escapeAttribute(describedBy(id, helper))}"
                    ${required ? "required" : ""}>
                    <option value="">${escapeHtml(placeholder)}</option>
                    ${optionMarkup}
                </select>
                ${helper
                    ? (
                        `<p id="${escapeAttribute(id)}Help" ` +
                        `class="advisory-field-help">${helper}</p>`
                    )
                    : ""}
                <p
                    id="${escapeAttribute(id)}Error"
                    class="advisory-field-error"
                    hidden>
                </p>
            </div>
        `;
    }

    /**
     * Creates a radio-card fieldset.
     *
     * Options use this structure:
     *
     * [
     *   ["Hybrid", "Hybrid", "People divide their time..."]
     * ]
     *
     * @param {Object} configuration
     * @param {string} configuration.id
     * @param {string} configuration.legend
     * @param {Array} configuration.options
     * @param {number} [configuration.columns]
     * @param {boolean} [configuration.required]
     * @param {*} [configuration.value]
     * @param {Object} [context]
     * @returns {string}
     */
    function choiceCards(
        {
            id,
            legend,
            options = [],
            columns = 2,
            required = false,
            value
        },
        context = {}
    ) {
        const selectedValue =
            resolveValue(
                {
                    id,
                    ...(value === undefined
                        ? {}
                        : { value })
                },
                context
            );

        const safeColumns =
            Number.isInteger(
                Number(columns)
            )
                ? Number(columns)
                : 2;

        const optionMarkup =
            (
                Array.isArray(options)
                    ? options
                    : []
            )
                .map((option) => {
                    if (
                        !Array.isArray(option) ||
                        option.length < 2
                    ) {
                        return "";
                    }

                    const [
                        optionValue,
                        optionLabel,
                        description
                    ] = option;

                    return `
                        <label class="advisory-choice-card">
                            <input
                                type="radio"
                                name="${escapeAttribute(id)}"
                                value="${escapeAttribute(optionValue)}"
                                ${selectedValue === optionValue
                                    ? "checked"
                                    : ""}>
                            <span class="advisory-choice-card__surface">
                                <strong>${optionLabel}</strong>
                                ${description
                                    ? `<small>${description}</small>`
                                    : ""}
                            </span>
                        </label>
                    `;
                })
                .join("");

        return `
            <fieldset
                class="advisory-choice-fieldset advisory-choice-fieldset--columns-${escapeAttribute(safeColumns)}"
                data-field-wrapper="${escapeAttribute(id)}">
                <legend>
                    ${legend}
                    ${requiredMarker(required)}
                </legend>
                <div class="advisory-choice-grid">
                    ${optionMarkup}
                </div>
                <p
                    id="${escapeAttribute(id)}Error"
                    class="advisory-field-error"
                    hidden>
                </p>
            </fieldset>
        `;
    }

    /**
     * Creates a radio-pill fieldset.
     *
     * @param {Object} configuration
     * @param {string} configuration.id
     * @param {string} configuration.legend
     * @param {Array} configuration.options
     * @param {boolean} [configuration.required]
     * @param {*} [configuration.value]
     * @param {Object} [context]
     * @returns {string}
     */
    function choicePills(
        {
            id,
            legend,
            options = [],
            required = false,
            value
        },
        context = {}
    ) {
        const selectedValue =
            resolveValue(
                {
                    id,
                    ...(value === undefined
                        ? {}
                        : { value })
                },
                context
            );

        const optionMarkup =
            (
                Array.isArray(options)
                    ? options
                    : []
            )
                .map((option) => {
                    if (
                        !Array.isArray(option) ||
                        option.length < 2
                    ) {
                        return "";
                    }

                    const [
                        optionValue,
                        optionLabel
                    ] = option;

                    return `
                        <label class="advisory-choice-pill">
                            <input
                                type="radio"
                                name="${escapeAttribute(id)}"
                                value="${escapeAttribute(optionValue)}"
                                ${selectedValue === optionValue
                                    ? "checked"
                                    : ""}>
                            <span>${optionLabel}</span>
                        </label>
                    `;
                })
                .join("");

        return `
            <fieldset
                class="advisory-choice-fieldset"
                data-field-wrapper="${escapeAttribute(id)}">
                <legend>
                    ${legend}
                    ${requiredMarker(required)}
                </legend>
                <div class="advisory-choice-pills">
                    ${optionMarkup}
                </div>
                <p
                    id="${escapeAttribute(id)}Error"
                    class="advisory-field-error"
                    hidden>
                </p>
            </fieldset>
        `;
    }

    /**
     * Creates a checkbox-card fieldset.
     *
     * @param {Object} configuration
     * @param {string} configuration.id
     * @param {string} configuration.legend
     * @param {string} [configuration.helper]
     * @param {Array} configuration.options
     * @param {boolean} [configuration.required]
     * @param {number|null} [configuration.maximum]
     * @param {Array} [configuration.value]
     * @param {Array} [configuration.selected]
     * @param {Object} [context]
     * @returns {string}
     */
    function checkboxCards(
        {
            id,
            legend,
            helper = "",
            options = [],
            required = false,
            maximum = null,
            value,
            selected
        },
        context = {}
    ) {
        const resolvedValue =
            selected !== undefined
                ? selected
                : resolveValue(
                    {
                        id,
                        ...(value === undefined
                            ? {}
                            : { value })
                    },
                    context
                );

        const selectedValues =
            Array.isArray(
                resolvedValue
            )
                ? resolvedValue
                : [];

        const optionMarkup =
            (
                Array.isArray(options)
                    ? options
                    : []
            )
                .map((option) => {
                    if (
                        !Array.isArray(option) ||
                        option.length < 2
                    ) {
                        return "";
                    }

                    const [
                        optionValue,
                        optionLabel
                    ] = option;

                    return `
                        <label class="advisory-checkbox-card">
                            <input
                                type="checkbox"
                                name="${escapeAttribute(id)}"
                                value="${escapeAttribute(optionValue)}"
                                ${selectedValues.includes(optionValue)
                                    ? "checked"
                                    : ""}>
                            <span>
                                <i
                                    class="fa-solid fa-check"
                                    aria-hidden="true">
                                </i>
                                ${optionLabel}
                            </span>
                        </label>
                    `;
                })
                .join("");

        return `
            <fieldset
                class="advisory-choice-fieldset"
                data-field-wrapper="${escapeAttribute(id)}"
                data-maximum="${escapeAttribute(maximum || "")}">
                <legend>
                    ${legend}
                    ${requiredMarker(required)}
                </legend>
                ${helper
                    ? `<p class="advisory-field-help">${helper}</p>`
                    : ""}
                <div class="advisory-checkbox-grid">
                    ${optionMarkup}
                </div>
                <p
                    id="${escapeAttribute(id)}Error"
                    class="advisory-field-error"
                    hidden>
                </p>
            </fieldset>
        `;
    }

    /**
     * Creates field-builder functions bound to one render context.
     *
     * Example:
     *
     * const fields = AssessmentFields.create({
     *     answers
     * });
     *
     * fields.textField({
     *     id: "companyName",
     *     label: "Organisation name"
     * });
     *
     * @param {Object} context
     * @returns {Object}
     */
    function create(context = {}) {
        return Object.freeze({
            textField(configuration) {
                return textField(
                    configuration,
                    context
                );
            },

            textareaField(configuration) {
                return textareaField(
                    configuration,
                    context
                );
            },

            numberField(configuration) {
                return numberField(
                    configuration,
                    context
                );
            },

            datalistField(configuration) {
                return datalistField(
                    configuration,
                    context
                );
            },

            renderDatalistOptions,

            selectField(configuration) {
                return selectField(
                    configuration,
                    context
                );
            },

            choiceCards(configuration) {
                return choiceCards(
                    configuration,
                    context
                );
            },

            choicePills(configuration) {
                return choicePills(
                    configuration,
                    context
                );
            },

            checkboxCards(configuration) {
                return checkboxCards(
                    configuration,
                    context
                );
            }
        });
    }

    const AssessmentFields = {
        moduleVersion: "1.0.0",

        create,

        textField,
        textareaField,
        numberField,
        datalistField,
        renderDatalistOptions,
        selectField,
        choiceCards,
        choicePills,
        checkboxCards
    };

    modules.AssessmentFields =
        Object.freeze(
            AssessmentFields
        );
})();
