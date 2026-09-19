"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SHELF_LIMITS, shelfPointsSchema, type ShelfPoint } from "@/lib/selection-shelf/policy";
import type { createSelectionShelfService } from "@/lib/selection-shelf/service";
import styles from "./shelf.module.css";

type Detail = Awaited<ReturnType<ReturnType<typeof createSelectionShelfService>["reviewDetail"]>>;
const failures: Record<string, string> = {
  changed: "This photo changed while you were reviewing it. Reload before saving; your unsaved edits are still visible below.",
  selection: "Choose approved catalog producers for every point. A proposal needs at least one point.",
  access: "Review access or the owner's premium access is no longer active.",
  invalid: "Check the point labels, positions and review note.",
  budget: "The shared AI allowance is exhausted. No API call was sent. Chisan must authorize another attempt before retrying.",
};
const analysisFailures: Record<string, string> = {
  budget: failures.budget,
  invalid_api_key: "The provider rejected the API key. Correct the server credential before retrying.",
  insufficient_permissions: "The API key does not have permission for this model or endpoint.",
  insufficient_quota: "The provider reports no available API credit or quota.",
  rate_limit_exceeded: "The provider's request limit was reached. Retry later within the Chisan allowance.",
  model_not_found: "The configured model is not available to this API key.",
  max_output_tokens: "The response reached its output token limit. Increase the configured output budget before retrying.",
  invalid_json_schema: "The provider rejected the response schema. The integration needs correction before retrying.",
  transport: "The API response could not be received. Usage is unknown; this does not mean zero cost.",
  interrupted: "Processing was interrupted. No automatic paid retry has been scheduled.",
};
export function ShelfReview({ detail }: { detail: Detail }) {
  const router = useRouter();
  const [points, setPoints] = useState<ShelfPoint[]>(detail.points);
  const [selectedId, setSelectedId] = useState(detail.points[0]?.id ?? "");
  const [version, setVersion] = useState(detail.version);
  const [status, setStatus] = useState(detail.status);
  const [note, setNote] = useState(detail.note);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [pollingExpired, setPollingExpired] = useState(false);
  const selected = points.find((point) => point.id === selectedId);
  const preparing = status === "queued" || status === "processing";
  const editable = ["received", "review", "ready"].includes(status);
  const latestAttempt = detail.analysisAttempts[0];
  const failureCode = detail.analysisError === "budget" ? "budget" : latestAttempt?.failure?.code ?? detail.analysisError;
  useEffect(() => {
    if (!preparing) return;
    let polls = 0;
    const timer = setInterval(() => {
      router.refresh();
      if (++polls >= 24) { clearInterval(timer); setPollingExpired(true); }
    }, 5000);
    return () => clearInterval(timer);
  }, [preparing, router]);
  function update(values: Partial<ShelfPoint>) { setPoints((previous) => previous.map((point) => point.id === selectedId ? { ...point, ...values } : point)); }
  function add(x = 0.5, y = 0.5, label = "") {
    if (points.length >= SHELF_LIMITS.hotspots) return;
    const id = crypto.randomUUID();
    setPoints([...points, { id, producerKey: "", x, y, label }]); setSelectedId(id);
  }
  async function act(action: "save" | "approve" | "reject" | "analyze") {
    if (!["reject", "analyze"].includes(action) && !shelfPointsSchema.safeParse(points).success) { setMessage("Choose a producer and a label for every point; positions must be between 0 and 100%."); return; }
    if (action === "reject" && !note.trim()) { setMessage("Add a review note explaining why the photo cannot be used."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/selection-shelf", { method: "POST", headers: { "Content-Type": "application/json", "X-Chisan-Shelf": "1" },
        body: JSON.stringify({ id: detail.id, version, action, points: action === "reject" ? [] : action === "analyze" ? detail.points : points, note }) });
      const result = await response.json();
      if (!response.ok) { setMessage(failures[result.error] ?? "The request failed. Your edits remain here; try again."); return; }
      setVersion(result.version); setStatus(result.status);
      setMessage(action === "analyze" ? "Request received. The AI will identify labels and place points automatically. This page will update." : action === "approve" ? "Proposal ready. The owner can choose producers and publish it from their account." : action === "reject" ? "Photo rejected." : "Review saved.");
      if (action === "analyze") router.refresh();
    } catch { setMessage("Connection failed. Your edits remain here; try again."); }
    finally { setBusy(false); }
  }
  return <>
    <section className={styles.analysisStatus} aria-label="AI analysis status">
      <p role="status"><strong>{preparing ? (status === "queued" ? "Request received — waiting for analysis" : "AI is identifying labels and placing points") : status === "ready" ? "Proposal ready for the owner" : detail.analysisError ? "Analysis could not be completed" : `Photo status: ${status}`}</strong></p>
      <p>The AI identifies producers and places the points automatically. The owner then chooses what to publish from their account.</p>
      {preparing ? <p>{pollingExpired ? "Automatic refresh has paused. Check the saved result; the request may need attention from Chisan." : "This page updates automatically. You do not need to add points or request another analysis."}</p> : null}
      {status === "review" && detail.analysisError ? <p role="alert">{analysisFailures[failureCode ?? ""] ?? `Automatic analysis failed (${detail.analysisError}). Check the API attempt details before retrying.`}</p> : null}
      {status === "ready" ? <p>{points.length} points linked to {new Set(points.map((point) => point.producerKey)).size} catalog producers.{detail.viewerIsOwner ? <> <Link href="/cuenta/estanteria">Open your owner proposal</Link>.</> : null}</p> : null}
      {status === "review" && !detail.analysisError && !points.length ? <p>No clear catalog matches were found. The photo remains saved for review; no favorites have been added.</p> : null}
      {detail.allowance ? <p>Shared AI allowance: <strong>{detail.allowance.used}/{detail.allowance.limit} attempts used</strong> · {detail.allowance.remaining} remaining. Failed API attempts also count.</p> : null}
      <div className={styles.actions}>
        <button type="button" className="account-button" disabled={!editable || busy || detail.allowance?.remaining === 0} onClick={() => void act("analyze")}>{preparing ? "Analysis in progress…" : "Request AI analysis"}</button>
        <button type="button" className="account-button account-button--secondary" disabled={busy} onClick={() => router.refresh()}>Refresh status</button>
      </div>
      <p role="status">{message}</p>
      <details><summary>API attempts and token usage</summary>
        {detail.analysisAttempts.length ? <ul>{detail.analysisAttempts.map((attempt, index) => <li key={index}>
          <strong>{attempt.provider} · {attempt.model}</strong> · {attempt.outcome} · {(attempt.durationMs / 1000).toFixed(1)} s · <time dateTime={attempt.at}>{attempt.at.replace("T", " ").slice(0, 19)} UTC</time>
          {attempt.failure ? <p>{attempt.failure.kind}{attempt.failure.status ? ` · HTTP ${attempt.failure.status}` : ""}{attempt.failure.code ? ` · ${attempt.failure.code}` : ""}</p> : null}
          {attempt.usage ? <p>Input: {attempt.usage.inputTokens} tokens · Output: {attempt.usage.outputTokens} tokens · Total: {attempt.usage.totalTokens} tokens.<br />Cached input: {attempt.usage.cachedInputTokens ?? "not reported"} · Reasoning included in output: {attempt.usage.reasoningTokens ?? "not reported"}.</p> : <p>The provider did not report token usage. This is not a zero-cost measurement.</p>}
          {attempt.requestId || attempt.failure?.requestId ? <p>Request: <code>{attempt.requestId ?? attempt.failure?.requestId}</code></p> : null}
        </li>)}</ul> : <p>No token usage was recorded for earlier attempts. The next API response will record it here.</p>}
        <p>Only numeric usage and safe diagnostics are stored. Provider billing is the source for the final charge.</p>
      </details>
    </section>
    <div className={styles.editor}>
      <div>
        <div className={styles.editorCanvas}>
          <Image unoptimized src={detail.imageSrc} width={detail.width} height={detail.height} alt="Shelf photo awaiting review" className={styles.image} />
          {points.map((point, index) => <button type="button" key={point.id} className={styles.point} style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }} aria-label={`Edit point ${index + 1}: ${point.label || "Unassigned"}`} aria-pressed={selectedId === point.id} onClick={() => setSelectedId(point.id)}><span>{index + 1}</span></button>)}
          {placing && selected ? <button type="button" className={styles.placeSurface} aria-label="Place selected point on the photo" onClick={(event) => {
            const box = event.currentTarget.getBoundingClientRect();
            update({ x: event.detail ? (event.clientX - box.left) / box.width : 0.5, y: event.detail ? (event.clientY - box.top) / box.height : 0.5 });
            setPlacing(false);
          }} /> : null}
        </div>
        {placing ? <p>Tap the label to move the selected point. Keyboard activation places it in the centre; percentage fields give exact control.</p> : null}
      </div>
      <details className={styles.manualCorrections}><summary>Optional point corrections</summary>
      <p>Use only to correct an AI result. Adding points is not required to request analysis. This photo is a snapshot, not a stock or supplier claim.</p>
      <fieldset disabled={!editable || busy} className={styles.editorPanel}>
        <legend>Review points ({points.length}/{SHELF_LIMITS.hotspots})</legend>
        <button type="button" className="account-button account-button--secondary" disabled={points.length >= SHELF_LIMITS.hotspots} onClick={() => add()}>Add point</button>
        <label>Point<select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setPlacing(false); }}><option value="">Choose a point</option>{points.map((point, index) => <option key={point.id} value={point.id}>{index + 1}. {point.label || "Unassigned"}</option>)}</select></label>
        {selected ? <>
          <label>Producer<select value={selected.producerKey} onChange={(event) => update({ producerKey: event.target.value, productId: undefined })}><option value="">Choose a catalog producer</option>{detail.candidates.map((candidate) => <option key={candidate.key} value={candidate.key}>{candidate.name} · {candidate.city}</option>)}</select></label>
          <label>Reviewed product (optional)<select value={selected.productId ?? ""} onChange={(event) => update({ productId: event.target.value || undefined })}><option value="">Visible label only</option>{detail.candidates.find((candidate) => candidate.key === selected.producerKey)?.products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
          <label>Visible product label<input maxLength={120} value={selected.label} onChange={(event) => update({ label: event.target.value })} /></label>
          <div className={styles.coordinates}>{(["x", "y"] as const).map((axis) => <label key={axis}>{axis === "x" ? "From left (%)" : "From top (%)"}<input type="number" min="0" max="100" step="0.1" value={Number((selected[axis] * 100).toFixed(1))} onChange={(event) => update({ [axis]: Number(event.target.value) / 100 })} /></label>)}</div>
          <div className={styles.actions}><button type="button" className="account-button account-button--secondary" aria-pressed={placing} onClick={() => setPlacing(!placing)}>{placing ? "Cancel placement" : "Place on photo"}</button><button type="button" className="account-button account-button--secondary" onClick={() => { setPoints(points.filter((point) => point.id !== selectedId)); setSelectedId(""); setPlacing(false); }}>Remove point</button></div>
        </> : <p>Select a point in the photo or add one.</p>}
        {detail.suggestions.points.some((point) => !point.producerKey) ? <details><summary>Unmatched AI suggestions</summary><ul>{detail.suggestions.points.filter((point) => !point.producerKey).map((point, index) => <li key={index}>{point.label || "Unreadable label"} <button type="button" className="account-button account-button--secondary" disabled={points.length >= SHELF_LIMITS.hotspots} onClick={() => add(point.x, point.y, point.label)}>Assign manually</button></li>)}</ul></details> : null}
        <label>Internal review note<textarea maxLength={600} value={note} onChange={(event) => setNote(event.target.value)} /></label>
        <div className={styles.actions}>
          <button type="button" className="account-button account-button--secondary" onClick={() => void act("save")}>Save review</button>
          <button type="button" className="account-button" disabled={!points.length} onClick={() => void act("approve")}>Prepare proposal for owner</button>
          <button type="button" className="account-button account-button--secondary" onClick={() => void act("reject")}>Reject photo</button>
        </div>
      </fieldset>
      </details>
    </div>
  </>;
}
