const response = await window.fetch("/api/send-advisory", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    credentials: "same-origin",
    body: JSON.stringify({
        action,
        lead: payload.lead || {},
        report: payload.report || {},
        answers: payload.answers || {},
        pdf: {
            base64: payload.pdf.base64,
            filename: payload.pdf.filename,
            sizeBytes: payload.pdf.sizeBytes
        }
    })
});
