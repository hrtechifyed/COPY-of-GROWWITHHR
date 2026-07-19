/* ==========================================================
   GrowWithHR
   Executive Advisory Industry Catalogue

   Responsibility:
   - Load data/industries.json
   - Use the local fallback catalogue when loading fails
   - Read and write the browser industry cache
   - Normalise catalogue records
   - Build industry and alias lookups
   - Build datalist search options
   - Resolve user-entered industry values
   - Support the "Other" industry path

   This module must not:
   - render assessment screens;
   - mutate the main assessment state directly;
   - validate unrelated assessment fields;
   - prepare reports;
   - generate PDFs;
   - send email-delivery requests.
========================================================== */

(() => {
    "use strict";

    const modules =
        window.GrowWithHRModules =
        window.GrowWithHRModules || {};

    function definitions() {
        return (
            modules.AssessmentDefinition ||
            {}
        );
    }

    function utils() {
        return (
            modules.AssessmentUtils ||
            {}
        );
    }

    function storage() {
        return (
            modules.AssessmentStorage ||
            {}
        );
    }

    function fallbackNormaliseSearchText(value) {
        return String(value || "")
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[&]/g, " and ")
            .replace(/[^a-z0-9]+/g, " ")
            .trim()
            .replace(/\s+/g, " ");
    }

    function normaliseSearchText(value) {
        const helper =
            utils().normaliseSearchText;

        return (
            typeof helper === "function"
                ? helper(value)
                : fallbackNormaliseSearchText(value)
        );
    }

    function cloneAliases(value) {
        return Array.isArray(value)
            ? value
                .map((item) => {
                    return String(item || "").trim();
                })
                .filter(Boolean)
            : [];
    }

    function cloneFocusItems(value) {
        return Array.isArray(value)
            ? value
                .map((item) => {
                    return String(item || "").trim();
                })
                .filter(Boolean)
            : [];
    }

    function fallbackIndustries() {
        const fallback =
            definitions().INDUSTRY_FALLBACK;

        return Array.isArray(fallback)
            ? fallback.map((industry) => ({
                ...industry,
                aliases: cloneAliases(
                    industry?.aliases
                ),
                recommendedFocus:
                    cloneFocusItems(
                        industry?.recommendedFocus
                    )
            }))
            : [];
    }

    function configuredDataUrl() {
        return String(
            definitions()
                .INDUSTRY_DATA_URL ||
            "data/industries.json"
        );
    }

    /**
     * Normalises one industry record.
     *
     * @param {*} industry
     * @param {number} index
     * @returns {Object|null}
     */
    function normaliseIndustry(
        industry,
        index
    ) {
        if (
            !industry ||
            typeof industry !== "object" ||
            Array.isArray(industry)
        ) {
            return null;
        }

        const name =
            String(
                industry.name || ""
            ).trim();

        const id =
            String(
                industry.id ||
                `industry-${index}`
            ).trim();

        if (!name || !id) {
            return null;
        }

        return {
            id,
            name,

            displayLabel:
                String(
                    industry.displayLabel ||
                    name
                ).trim(),

            category:
                String(
                    industry.category ||
                    "Other"
                ).trim(),

            aliases:
                cloneAliases(
                    industry.aliases
                ),

            ruleProfile:
                String(
                    industry.ruleProfile ||
                    name
                ).trim(),

            riskLevel:
                String(
                    industry.riskLevel ||
                    ""
                ).trim(),

            recommendedFocus:
                cloneFocusItems(
                    industry.recommendedFocus
                )
        };
    }

    /**
     * Normalises an industry catalogue and removes duplicate IDs.
     *
     * @param {*} industries
     * @param {Array} fallback
     * @returns {Array<Object>}
     */
    function normaliseCatalogue(
        industries,
        fallback = []
    ) {
        const seenIds =
            new Set();

        const catalogue =
            (
                Array.isArray(industries)
                    ? industries
                    : []
            )
                .map((industry, index) => {
                    return normaliseIndustry(
                        industry,
                        index
                    );
                })
                .filter((industry) => {
                    if (
                        !industry ||
                        seenIds.has(industry.id)
                    ) {
                        return false;
                    }

                    seenIds.add(
                        industry.id
                    );

                    return true;
                });

        if (catalogue.length) {
            return catalogue;
        }

        return (
            Array.isArray(fallback)
                ? fallback
                : []
        )
            .map((industry, index) => {
                return normaliseIndustry(
                    industry,
                    index
                );
            })
            .filter(Boolean);
    }

    /**
     * Creates a searchable lookup and datalist option collection.
     *
     * @param {Array<Object>} catalogue
     * @returns {{
     *   lookup: Map<string, Object>,
     *   searchOptions: Array<{value: string, label: string}>
     * }}
     */
    function buildIndexes(catalogue) {
        const lookup =
            new Map();

        const searchOptions = [];

        const optionKeys =
            new Set();

        (
            Array.isArray(catalogue)
                ? catalogue
                : []
        ).forEach((industry) => {
            const searchableValues = [
                industry.name,
                industry.displayLabel,
                ...cloneAliases(
                    industry.aliases
                )
            ];

            searchableValues.forEach((value) => {
                const lookupKey =
                    normaliseSearchText(
                        value
                    );

                if (
                    lookupKey &&
                    !lookup.has(lookupKey)
                ) {
                    lookup.set(
                        lookupKey,
                        industry
                    );
                }
            });

            const canonicalKey =
                normaliseSearchText(
                    industry.name
                );

            if (
                canonicalKey &&
                !optionKeys.has(
                    canonicalKey
                )
            ) {
                optionKeys.add(
                    canonicalKey
                );

                searchOptions.push({
                    value:
                        industry.name,

                    label:
                        `${industry.displayLabel} · ` +
                        `${industry.category}`
                });
            }

            cloneAliases(
                industry.aliases
            ).forEach((alias) => {
                const aliasKey =
                    normaliseSearchText(
                        alias
                    );

                if (
                    !aliasKey ||
                    optionKeys.has(
                        aliasKey
                    )
                ) {
                    return;
                }

                optionKeys.add(
                    aliasKey
                );

                searchOptions.push({
                    value: alias,

                    label:
                        `${industry.displayLabel} · ` +
                        `${industry.category}`
                });
            });
        });

        return {
            lookup,
            searchOptions
        };
    }

    /**
     * Extracts an industry array from a JSON payload.
     *
     * Supported formats:
     *
     * [
     *   { "id": "...", "name": "..." }
     * ]
     *
     * or:
     *
     * {
     *   "industries": [...]
     * }
     *
     * @param {*} payload
     * @returns {Array}
     */
    function extractIndustries(payload) {
        if (Array.isArray(payload)) {
            return payload;
        }

        if (
            payload &&
            typeof payload === "object" &&
            Array.isArray(
                payload.industries
            )
        ) {
            return payload.industries;
        }

        return [];
    }

    class IndustryCatalogService {
        /**
         * @param {Object} [options]
         * @param {string} [options.dataUrl]
         * @param {Array} [options.fallback]
         * @param {Object} [options.storage]
         * @param {Function} [options.fetch]
         */
        constructor(options = {}) {
            this.dataUrl =
                String(
                    options.dataUrl ||
                    configuredDataUrl()
                );

            this.fallback =
                normaliseCatalogue(
                    options.fallback ||
                    fallbackIndustries()
                );

            this.storage =
                options.storage ||
                storage();

            this.fetchImplementation =
                options.fetch ||
                (
                    typeof window.fetch ===
                    "function"
                        ? window.fetch.bind(
                            window
                        )
                        : null
                );

            this.catalogue = [];

            this.lookup =
                new Map();

            this.searchOptions = [];

            this.lastLoadSource =
                "fallback";

            this.lastLoadError =
                null;

            this.prepare(
                this.readCachedCatalogue()
            );
        }

        /**
         * Reads cached industries or returns the local fallback.
         *
         * @returns {Array<Object>}
         */
        readCachedCatalogue() {
            const read =
                this.storage
                    .readIndustryCache;

            if (
                typeof read === "function"
            ) {
                return read(
                    this.fallback
                );
            }

            return [
                ...this.fallback
            ];
        }

        /**
         * Writes the current catalogue to the browser cache.
         *
         * @returns {boolean}
         */
        writeCache() {
            const write =
                this.storage
                    .writeIndustryCache;

            if (
                typeof write !== "function"
            ) {
                return false;
            }

            return Boolean(
                write(
                    this.catalogue
                )
            );
        }

        /**
         * Rebuilds the catalogue and search indexes.
         *
         * @param {Array} industries
         * @returns {Array<Object>}
         */
        prepare(industries) {
            this.catalogue =
                normaliseCatalogue(
                    industries,
                    this.fallback
                );

            const indexes =
                buildIndexes(
                    this.catalogue
                );

            this.lookup =
                indexes.lookup;

            this.searchOptions =
                indexes.searchOptions;

            return this.getIndustries();
        }

        /**
         * Loads the remote industry catalogue.
         *
         * The cached or fallback catalogue remains usable if loading fails.
         *
         * @returns {Promise<{
         *   industries: Array<Object>,
         *   searchOptions: Array<Object>,
         *   source: string,
         *   error: Error|null
         * }>}
         */
        async load() {
            if (
                typeof this.fetchImplementation !==
                "function"
            ) {
                const error =
                    new Error(
                        "Fetch is not available."
                    );

                this.lastLoadError =
                    error;

                this.lastLoadSource =
                    this.catalogue.length
                        ? "cache-or-fallback"
                        : "fallback";

                console.warn(
                    "GrowWithHR: the industry catalogue could not be loaded. " +
                    "Using the cached or fallback catalogue.",
                    error
                );

                return this.getLoadResult();
            }

            try {
                const response =
                    await this.fetchImplementation(
                        this.dataUrl,
                        {
                            cache:
                                "no-cache",

                            headers: {
                                "Accept":
                                    "application/json"
                            }
                        }
                    );

                if (
                    !response ||
                    !response.ok
                ) {
                    const status =
                        response?.status ??
                        "unknown";

                    throw new Error(
                        "Industry catalogue returned " +
                        `${status}.`
                    );
                }

                const payload =
                    await response.json();

                const industries =
                    extractIndustries(
                        payload
                    );

                if (!industries.length) {
                    throw new Error(
                        "Industry catalogue did not contain any industries."
                    );
                }

                this.prepare(
                    industries
                );

                this.writeCache();

                this.lastLoadSource =
                    "network";

                this.lastLoadError =
                    null;

                return this.getLoadResult();
            } catch (error) {
                this.lastLoadError =
                    error;

                this.lastLoadSource =
                    this.catalogue.length
                        ? "cache-or-fallback"
                        : "fallback";

                console.warn(
                    "GrowWithHR: data/industries.json could not be loaded. " +
                    "Using the cached or fallback catalogue.",
                    error
                );

                return this.getLoadResult();
            }
        }

        /**
         * Returns a safe copy of the current catalogue.
         *
         * @returns {Array<Object>}
         */
        getIndustries() {
            return this.catalogue.map(
                (industry) => ({
                    ...industry,

                    aliases:
                        [...industry.aliases],

                    recommendedFocus:
                        [
                            ...industry
                                .recommendedFocus
                        ]
                })
            );
        }

        /**
         * Returns datalist-compatible search options.
         *
         * @returns {Array<{value: string, label: string}>}
         */
        getSearchOptions() {
            return this.searchOptions.map(
                (option) => ({
                    ...option
                })
            );
        }

        /**
         * Returns one industry by a canonical name, display label or alias.
         *
         * @param {*} value
         * @returns {Object|null}
         */
        resolve(value) {
            const lookupKey =
                normaliseSearchText(
                    value
                );

            if (!lookupKey) {
                return null;
            }

            return (
                this.lookup.get(
                    lookupKey
                ) ||
                null
            );
        }

        /**
         * Determines whether the selected industry is the Other option.
         *
         * @param {*} value
         * @returns {boolean}
         */
        isOther(value) {
            const industry =
                this.resolve(value);

            return (
                industry?.id === "other" ||
                normaliseSearchText(value) ===
                    "other"
            );
        }

        /**
         * Returns the industry name that should be used by the assessment and
         * advisory report.
         *
         * @param {Object} answers
         * @returns {string}
         */
        getEffectiveName(answers) {
            const source =
                (
                    answers &&
                    typeof answers ===
                        "object"
                )
                    ? answers
                    : {};

            if (
                this.isOther(
                    source.industry
                )
            ) {
                return (
                    String(
                        source.customIndustry ||
                        "Other"
                    ).trim() ||
                    "Other"
                );
            }

            return (
                this.resolve(
                    source.industry
                )?.name ||
                String(
                    source.industry ||
                    ""
                ).trim()
            );
        }

        /**
         * Applies a resolved industry to an answer object.
         *
         * This method mutates only the answer object explicitly supplied by
         * the caller. It does not read controller state.
         *
         * @param {Object} answers
         * @param {*} value
         * @returns {Object|null}
         */
        applyToAnswers(
            answers,
            value
        ) {
            if (
                !answers ||
                typeof answers !== "object"
            ) {
                return null;
            }

            const rawValue =
                String(
                    value ??
                    answers.industry ??
                    ""
                ).trim();

            const industry =
                this.resolve(
                    rawValue
                );

            if (!industry) {
                answers.industry =
                    rawValue;

                answers.industryId =
                    "";

                answers.industryCategory =
                    "";

                answers.industryRuleProfile =
                    "";

                return null;
            }

            answers.industry =
                industry.name;

            answers.industryId =
                industry.id;

            answers.industryCategory =
                industry.category;

            answers.industryRuleProfile =
                industry.ruleProfile;

            return industry;
        }

        /**
         * Returns useful metadata for diagnostics and tests.
         *
         * @returns {Object}
         */
        getStatus() {
            return {
                source:
                    this.lastLoadSource,

                dataUrl:
                    this.dataUrl,

                industryCount:
                    this.catalogue.length,

                searchOptionCount:
                    this.searchOptions.length,

                hasError:
                    Boolean(
                        this.lastLoadError
                    ),

                errorMessage:
                    this.lastLoadError
                        ? String(
                            this.lastLoadError
                                .message ||
                            this.lastLoadError
                        )
                        : ""
            };
        }

        getLoadResult() {
            return {
                industries:
                    this.getIndustries(),

                searchOptions:
                    this.getSearchOptions(),

                source:
                    this.lastLoadSource,

                error:
                    this.lastLoadError
            };
        }
    }

    /**
     * Creates a fresh industry-catalogue service.
     *
     * @param {Object} [options]
     * @returns {IndustryCatalogService}
     */
    function create(options = {}) {
        return new IndustryCatalogService(
            options
        );
    }

    const IndustryCatalog = {
        moduleVersion: "1.0.0",

        create,
        normaliseIndustry,
        normaliseCatalogue,
        buildIndexes,
        extractIndustries,

        IndustryCatalogService
    };

    modules.IndustryCatalog =
        Object.freeze(
            IndustryCatalog
        );
})();
