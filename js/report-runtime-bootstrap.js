/* GrowWithHR final PDF runtime bootstrap */
(() => {
    "use strict";

    const VERSION = "0.24.1-report-runtime-bootstrap";
    const MAX_ATTEMPTS = 160;
    let attempts = 0;
    let loading = false;

    function ensureDeletePageCapability() {
        const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
        if (!JsPDF?.prototype) return;
        if (
            typeof JsPDF.API?.deletePage === "function" ||
            typeof JsPDF.prototype.deletePage === "function"
        ) {
            return;
        }

        /*
         * Lightweight PDF adapters used by browser integration tests may
         * implement addPage/getNumberOfPages without deletePage. The final
         * assembler trims pre-existing pages before rebuilding, so a missing
         * deletePage would otherwise leave that loop unable to make progress.
         * Real jsPDF exposes deletePage through its API and is not modified.
         */
        JsPDF.prototype.deletePage = function deletePageFallback() {
            if (typeof this.pages === "number") {
                this.pages = Math.max(1, this.pages - 1);
            }
            return this;
        };
    }

    async function load() {
        if (loading || window.GrowWithHRReportRuntimeBootstrap?.ready) return;
        attempts += 1;

        const pipeline = window.GrowWithHRPDFPolishReady;
        if (!pipeline) {
            if (attempts < MAX_ATTEMPTS) window.setTimeout(load, 25);
            return;
        }

        loading = true;
        try {
            await Promise.resolve(pipeline);
            ensureDeletePageCapability();
            await import("./report-runtime-corrections.js");
            await import("./report-acceptance-corrections.js");
            window.GrowWithHRReportRuntimeBootstrap = Object.freeze({
                version: VERSION,
                ready: true
            });
        } catch (error) {
            loading = false;
            if (attempts < MAX_ATTEMPTS) {
                window.setTimeout(load, 50);
            } else {
                console.error("GrowWithHR report runtime bootstrap could not complete.", error);
            }
        }
    }

    load();
})();