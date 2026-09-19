"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SHELF_LIMITS, shelfPointsSchema, type ShelfPoint } from "@/lib/selection-shelf/policy";
import type { createSelectionShelfService } from "@/lib/selection-shelf/service";
import styles from "./shelf.module.css";

type Detail = Awaited<ReturnType<ReturnType<typeof createSelectionShelfService>["reviewDetail"]>>;
const failures: Record<string, string> = {
  changed: "This photo changed while you were reviewing it. Reload before saving; your unsaved edits are still visible below.",
  selection: "Choose currently shared producers for every point. Publishing also requires a visible profile and at least one point.",
  access: "Review access or the owner's premium access is no longer active.",
  invalid: "Check the point labels, positions and review note.",
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
  const [publicHandle, setPublicHandle] = useState<string | null>(null);
  const selected = points.find((point) => point.id === selectedId);
  const editable = ["received", "queued", "processing", "review"].includes(status);
  function update(values: Partial<ShelfPoint>) { setPoints((previous) => previous.map((point) => point.id === selectedId ? { ...point, ...values } : point)); }
  function add(x = 0.5, y = 0.5, label = "") {
    if (points.length >= SHELF_LIMITS.hotspots) return;
    const id = crypto.randomUUID();
    setPoints([...points, { id, producerKey: "", x, y, label }]); setSelectedId(id);
  }
  async function act(action: "admit" | "save" | "publish" | "reject" | "analyze") {
    if (action !== "reject" && !shelfPointsSchema.safeParse(points).success) { setMessage("Choose a producer and a label for every point; positions must be between 0 and 100%."); return; }
    if (action === "reject" && !note.trim()) { setMessage("Add a review note explaining why the photo cannot be used."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/selection-shelf", { method: "POST", headers: { "Content-Type": "application/json", "X-Chisan-Shelf": "1" },
        body: JSON.stringify({ id: detail.id, version, action, points: action === "reject" ? [] : points, note }) });
      const result = await response.json();
      if (!response.ok) { setMessage(failures[result.error] ?? "The request failed. Your edits remain here; try again."); return; }
      setVersion(result.version); setStatus(result.status); setPublicHandle(result.handle);
      setMessage(action === "admit" || action === "analyze" ? "Photo admitted for analysis. Reload the result in a moment. This attempt uses the shared API allowance; publication still requires your review." : action === "publish" ? "Photo published." : action === "reject" ? "Photo rejected." : "Review saved.");
    } catch { setMessage("Connection failed. Your edits remain here; try again."); }
    finally { setBusy(false); }
  }
  return <>
    <p>Status: <strong>{status}</strong> · Source: {detail.channel}</p>
    {status === "received" ? <p><strong>Awaiting Chisan admission.</strong> AI analysis is blocked until you admit this photo. Check that this is an appropriate shelf photo with legible labels. Admission starts one AI attempt within the shared allowance.</p> : null}
    {detail.analysisError ? <p>Automatic analysis unavailable ({detail.analysisError}). You can place points manually or request another attempt within the shared allowance.</p> : null}
    <p>Read each visible label and check the matching producer. Remove uncertain points. This photo is a snapshot, not a stock or supplier claim.</p>
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
        <div className={styles.actions}><button type="button" className="account-button account-button--secondary" disabled={!editable || busy || points.length >= SHELF_LIMITS.hotspots} onClick={() => add()}>Add point</button>
          <button type="button" className="account-button account-button--secondary" disabled={busy} onClick={() => router.refresh()}>Reload saved result</button></div>
      </div>
      <fieldset disabled={!editable || busy} className={styles.editorPanel}>
        <legend>Review points ({points.length}/{SHELF_LIMITS.hotspots})</legend>
        <label>Point<select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setPlacing(false); }}><option value="">Choose a point</option>{points.map((point, index) => <option key={point.id} value={point.id}>{index + 1}. {point.label || "Unassigned"}</option>)}</select></label>
        {selected ? <>
          <label>Producer<select value={selected.producerKey} onChange={(event) => update({ producerKey: event.target.value })}><option value="">Choose a shared producer</option>{detail.candidates.map((candidate) => <option key={candidate.key} value={candidate.key}>{candidate.name} · {candidate.city}</option>)}</select></label>
          <label>Visible product label<input maxLength={120} value={selected.label} onChange={(event) => update({ label: event.target.value })} /></label>
          <div className={styles.coordinates}>{(["x", "y"] as const).map((axis) => <label key={axis}>{axis === "x" ? "From left (%)" : "From top (%)"}<input type="number" min="0" max="100" step="0.1" value={Number((selected[axis] * 100).toFixed(1))} onChange={(event) => update({ [axis]: Number(event.target.value) / 100 })} /></label>)}</div>
          <div className={styles.actions}><button type="button" className="account-button account-button--secondary" aria-pressed={placing} onClick={() => setPlacing(!placing)}>{placing ? "Cancel placement" : "Place on photo"}</button><button type="button" className="account-button account-button--secondary" onClick={() => { setPoints(points.filter((point) => point.id !== selectedId)); setSelectedId(""); setPlacing(false); }}>Remove point</button></div>
        </> : <p>Select a point in the photo or add one.</p>}
        {detail.suggestions.points.some((point) => !point.producerKey) ? <details><summary>Unmatched AI suggestions</summary><ul>{detail.suggestions.points.filter((point) => !point.producerKey).map((point, index) => <li key={index}>{point.label || "Unreadable label"} <button type="button" className="account-button account-button--secondary" disabled={points.length >= SHELF_LIMITS.hotspots} onClick={() => add(point.x, point.y, point.label)}>Assign manually</button></li>)}</ul></details> : null}
        <label>Internal review note<textarea maxLength={600} value={note} onChange={(event) => setNote(event.target.value)} /></label>
        <div className={styles.actions}>
          <button type="button" className="account-button account-button--secondary" onClick={() => void act("save")}>Save review</button>
          {status === "received" ? <button type="button" className="account-button" onClick={() => void act("admit")}>Admit photo and analyze</button> : null}
          <button type="button" className="account-button" disabled={!points.length || status === "received"} onClick={() => void act("publish")}>Publish reviewed photo</button>
          <button type="button" className="account-button account-button--secondary" onClick={() => void act("reject")}>Reject photo</button>
          {status !== "received" ? <button type="button" className="account-button account-button--secondary" disabled={status !== "review"} onClick={() => void act("analyze")}>Request another AI analysis</button> : null}
        </div>
      </fieldset>
    </div>
    <p role="status">{message}</p>
    {status === "published" && publicHandle ? <Link href={`/u/${publicHandle}`}>Open public selection</Link> : null}
  </>;
}
