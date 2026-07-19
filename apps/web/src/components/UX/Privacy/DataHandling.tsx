/**
 * DataHandling gives respondents explicit storage, processing and delivery
 * information for the current GrowWithHR implementation.
 *
 * This component belongs to the experimental React/TypeScript UX layer.
 * Its wording must remain aligned with the deployed static application.
 *
 * @returns A responsive transparency panel.
 * @example <DataHandling compact />
 */
export function DataHandling({
  compact = false
}: {
  compact?: boolean;
}) {
  return (
    <aside
      className="gwhr-data"
      aria-label="How your information is handled"
    >
      <style>{`
        .gwhr-data {
          display: grid;
          gap: 1rem;
          border-radius: 22px;
          background: #f8fbff;
          border: 1px solid #dbe7ff;
          padding: 1rem;
          color: #24364b;
        }

        .gwhr-data-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 0.75rem;
        }

        .gwhr-data-card {
          border-radius: 18px;
          background: white;
          padding: 1rem;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
        }

        .gwhr-data strong {
          color: #102033;
        }
      `}</style>

      <h3>How your data is stored and used</h3>

      <p>
        <strong>Current build:</strong> limited assessment progress, prepared
        report information, recipient details and delivery status may be stored
        in your browser to support the same-browser experience. GrowWithHR does
        not currently maintain a dedicated assessment database or customer
        account.
      </p>

      {!compact && (
        <p>
          <strong>Email delivery:</strong> when you request delivery, the
          recipient information, assessment information needed for the
          advisory, prepared report data and generated PDF are sent to the
          GrowWithHR backend. The backend validates the request and sends the
          advisory through the Gmail API.
        </p>
      )}

      <div className="gwhr-data-grid">
        <div className="gwhr-data-card">
          <strong>Browser save</strong>
          <br />
          Limited progress may be stored in localStorage and can be removed by
          restarting the assessment or clearing browser data.
        </div>

        <div className="gwhr-data-card">
          <strong>Backend processing</strong>
          <br />
          Delivery information and the generated report are sent to the backend
          only when advisory delivery is requested.
        </div>

        <div className="gwhr-data-card">
          <strong>Gmail retention</strong>
          <br />
          Sent emails and PDF attachments may remain in the connected Gmail
          account according to its retention settings.
        </div>

        <div className="gwhr-data-card">
          <strong>Future storage</strong>
          <br />
          New databases, accounts, CRM links, document storage, compliance
          workspaces or RAG history require updated privacy information and
          controls before launch.
        </div>
      </div>

      {!compact && (
        <p>
          Do not enter confidential employee-level personal, medical, payroll,
          disciplinary or performance information into the general company
          assessment.
        </p>
      )}
    </aside>
  );
}
