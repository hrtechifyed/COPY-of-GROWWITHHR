/* GrowWithHR report runtime corrections v0.21.0 */
(() => {
    "use strict";

    const VERSION = "0.21.0-report-runtime-corrections";
    const INTELLIGENCE_LABEL = "UNDERSTANDING INTELLIGENCE ENGINE";

    function installPdfCorrections() {
        const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
        if (!JsPDF?.API || JsPDF.API.__growwithhrReportCorrectionsInstalled) return;

        const originalText = JsPDF.API.text;
        const originalTextWithLink = JsPDF.API.textWithLink;
        const originalRoundedRect = JsPDF.API.roundedRect;

        if (typeof originalText === "function") {
            JsPDF.API.text = function correctedText(value, ...args) {
                let nextValue = value;
                if (typeof value === "string") {
                    nextValue = value
                        .replace(/M4 EXPLAINABLE INTELLIGENCE/g, INTELLIGENCE_LABEL)
                        .replace(/M4 explainability section/gi, "Understanding Intelligence Engine section");
                } else if (Array.isArray(value)) {
                    nextValue = value.map((line) => typeof line === "string"
                        ? line.replace(/M4 EXPLAINABLE INTELLIGENCE/g, INTELLIGENCE_LABEL)
                        : line);
                }
                return originalText.call(this, nextValue, ...args);
            };
        }

        if (typeof originalTextWithLink === "function") {
            JsPDF.API.textWithLink = function correctedTextWithLink(text, x, y, options = {}) {
                const result = originalTextWithLink.call(this, text, x, y, options);
                const url = options?.url;
                if (url && typeof this.link === "function") {
                    const size = Number(this.getFontSize?.() || 8);
                    const width = Math.max(18, Number(this.getTextWidth?.(String(text)) || 0));
                    const height = Math.max(4, size * 0.42);
                    this.link(Number(x), Number(y) - height + 0.8, width, height + 1.5, { url });
                    if (typeof this.line === "function") {
                        this.line(Number(x), Number(y) + 0.8, Number(x) + width, Number(y) + 0.8);
                    }
                }
                return result;
            };
        }

        if (typeof originalRoundedRect === "function") {
            JsPDF.API.roundedRect = function correctedRoadmapRect(x, y, width, height, radiusX, radiusY, style) {
                const isRoadmapBadge = Math.abs(Number(width) - 40) < 0.2 && Math.abs(Number(height) - 11) < 0.2;
                if (isRoadmapBadge && typeof this.setFillColor === "function" && typeof this.setDrawColor === "function") {
                    const isDark = window.localStorage?.getItem("growwithhr-report-theme") === "dark";
                    this.setFillColor(...(isDark ? [21, 21, 21] : [244, 247, 251]));
                    this.setDrawColor(...(isDark ? [68, 68, 68] : [166, 181, 202]));
                }
                return originalRoundedRect.call(this, x, y, width, height, radiusX, radiusY, style);
            };
        }

        JsPDF.API.__growwithhrReportCorrectionsInstalled = VERSION;
    }

    installPdfCorrections();

    window.GrowWithHRReportRuntimeCorrections = Object.freeze({
        version: VERSION,
        intelligenceLabel: INTELLIGENCE_LABEL
    });
})();
