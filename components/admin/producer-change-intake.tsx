import type { ProducerChangeIntake } from "@/lib/accounts/producer-change-intake";

export function ProducerChangeIntakeRecord({
  intake,
}: {
  intake: ProducerChangeIntake | null;
}) {
  return (
    <section className="admin-panel" aria-labelledby="intake-record-title">
      <div className="admin-section-heading">
        <div>
          <h3 id="intake-record-title">Proposal origin</h3>
          <p>
            The channel identifies how the request arrived. Editorial review
            verifies the facts.
          </p>
        </div>
      </div>
      <dl className="admin-definition-list">
        <div>
          <dt>Channel</dt>
          <dd>
            {intake?.channel === "whatsapp"
              ? "WhatsApp · linked producer account"
              : intake?.channel === "web"
                ? "Chisan web editor"
                : "Not recorded for this historical proposal"}
          </dd>
        </div>
        {intake?.channel === "whatsapp" ? (
          <>
            <div>
              <dt>
                {intake.version === 1
                  ? "Producer confirmation received"
                  : "Producer message received · automatic intake"}
              </dt>
              <dd>
                <time
                  dateTime={
                    intake.version === 1
                      ? intake.confirmedAt
                      : intake.receivedAt
                  }
                >
                  {intake.version === 1
                    ? intake.confirmedAt
                    : intake.receivedAt}
                </time>
              </dd>
            </div>
            <div>
              <dt>Launch date stated by producer</dt>
              <dd>
                {intake.launchOn ?? "Not supplied"} · review context only; does
                not schedule publication
              </dd>
            </div>
            <div>
              <dt>AI extraction steps</dt>
              <dd>{intake.extractions.length}</dd>
            </div>
            {intake.version === 2 && intake.replacesRequestId ? (
              <div className="admin-definition-list__wide">
                <dt>Replaces previous proposal</dt>
                <dd>
                  <a href={`/admin/cambios/${intake.replacesRequestId}`}>
                    {intake.replacesRequestId}
                  </a>
                </dd>
              </div>
            ) : null}
            <div className="admin-definition-list__wide">
              <dt>Submitted candidate fingerprint</dt>
              <dd>
                <code>{intake.candidateHash}</code>
              </dd>
            </div>
          </>
        ) : null}
      </dl>
      {intake?.channel === "whatsapp" ? (
        <>
          <p>
            Review the requested products below against the producer context.
            Photo extraction does not establish image rights, ingredients or
            certifications.
          </p>
          <details>
            <summary>Extraction history and message references</summary>
            <p className="admin-request-id">
              Message:{" "}
              {intake.version === 1
                ? intake.confirmationMessageId
                : intake.submittedMessageId}
            </p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Input</th>
                    <th scope="col">Model and reasoning</th>
                    <th scope="col">Extractor version</th>
                    <th scope="col">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {intake.extractions.map((step) => (
                    <tr key={step.messageId}>
                      <td>
                        {step.inputKind}
                        <br />
                        <time dateTime={step.at}>{step.at}</time>
                      </td>
                      <td>
                        {step.provider} · {step.model}
                        <br />
                        {step.reasoningEffort ?? "Model default"} ·{" "}
                        {step.maxOutputTokens} output token limit
                      </td>
                      <td>{step.promptVersion}</td>
                      <td>
                        <code className="admin-request-id">
                          {step.messageId}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : null}
    </section>
  );
}
