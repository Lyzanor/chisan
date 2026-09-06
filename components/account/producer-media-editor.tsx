"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ProducerContent } from "@/lib/catalog/content-schema";
import {
  PRODUCER_MEDIA_LIMITS,
  preparedMediaSrc,
  privateMediaSrc,
  type PreparedMediaReference,
} from "@/lib/accounts/producer-media-policy";
import type { Locale } from "@/lib/i18n/locales";
import { getProducerMediaLabels } from "@/lib/i18n/producer-media";
import styles from "./producer-media-editor.module.css";

type Media = ProducerContent["gallery"][number];
export function ProducerMediaEditor({
  country,
  producerId,
  gallery,
  products,
  uploads,
  published,
  locale,
  languageOptions,
  target,
  onTarget,
  onAdd,
  onEdit,
  onMove,
  onRemove,
  onUndo,
  canUndo,
  onBusy,
}: {
  country: string;
  producerId: number;
  gallery: Media[];
  products: ProducerContent["products"];
  uploads: PreparedMediaReference[];
  published: Media[];
  locale: Locale;
  languageOptions: readonly { value: string; label: string }[];
  target: string;
  onTarget: (id: string) => void;
  onAdd: (
    media: Media,
    upload: PreparedMediaReference,
    productId: string,
  ) => void;
  onEdit: (id: string, patch: Partial<Media>) => void;
  onMove: (index: number, step: number) => void;
  onRemove: (id: string) => void;
  onUndo: () => void;
  canUndo: boolean;
  onBusy: (busy: boolean) => void;
}) {
  const words = getProducerMediaLabels(locale);
  const [rights, setRights] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const limit = Math.max(PRODUCER_MEDIA_LIMITS.images, published.length);
  const source = (item: Media) => {
    if (published.some((p) => p.src === item.src)) return item.src;
    const upload = uploads.find(
      (u) => preparedMediaSrc(country, producerId, u.sha256) === item.src,
    );
    return upload ? privateMediaSrc(upload.uploadId) : item.src;
  };
  function attach(upload: PreparedMediaReference, productId = target) {
    const src = preparedMediaSrc(country, producerId, upload.sha256);
    const existing = gallery.find((item) => item.src === src);
    const id = existing?.id ?? `image-${upload.uploadId}`;
    onAdd(
      existing ?? {
        id,
        src,
        width: upload.width,
        height: upload.height,
        alt: "",
        caption: "",
        credit: "",
        locale,
      },
      upload,
      productId,
    );
    setNotice(words.ready);
    requestAnimationFrame(() =>
      document.getElementById(`media-alt-${id}`)?.focus(),
    );
  }
  async function uploadFiles(files: File[]) {
    setError("");
    setNotice("");
    if (!rights) {
      setError(words.errors.rights);
      return;
    }
    if (files.length + gallery.length > limit) {
      setError(words.errors.limit);
      return;
    }
    const productId = target;
    setBusy(true);
    onBusy(true);
    try {
      for (const file of files) {
        if (file.size > PRODUCER_MEDIA_LIMITS.inputBytes) {
          setError(`${file.name}: ${words.errors.size}`);
          break;
        }
        const response = await fetch(
          `/api/producer-media?country=${country}&producerId=${producerId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
              "x-chisan-media-rights": "confirmed",
            },
            body: file,
          },
        );
        const result = await response.json();
        if (!response.ok) {
          setError(
            `${file.name}: ${words.errors[result.error as keyof typeof words.errors] ?? words.errors.unavailable}`,
          );
          break;
        }
        attach(result as PreparedMediaReference, productId);
      }
    } catch {
      setError(words.errors.unavailable);
    } finally {
      setBusy(false);
      onBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  const reusable = uploads.filter(
    (upload) =>
      !gallery.some(
        (item) =>
          item.src === preparedMediaSrc(country, producerId, upload.sha256),
      ) &&
      !published.some(
        (item) =>
          item.src === preparedMediaSrc(country, producerId, upload.sha256),
      ),
  );
  return (
    <fieldset
      className={styles.editor}
      id="producer-change-gallery"
      disabled={busy}
    >
      <legend>{words.title}</legend>
      <p>{words.help}</p>
      <div className={styles.upload}>
        <label className="account-field" htmlFor="media-target">
          <span>{words.target}</span>
          <select
            id="media-target"
            value={products.some((p) => p.id === target) ? target : ""}
            onChange={(e) => onTarget(e.target.value)}
          >
            <option value="">{words.gallery}</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || "…"}
              </option>
            ))}
          </select>
        </label>
        <label className="account-check">
          <input
            type="checkbox"
            checked={rights}
            onChange={(e) => setRights(e.target.checked)}
          />
          <span>{words.rights}</span>
        </label>
        <input
          ref={input}
          className={styles.file}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          aria-label={words.add}
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles([...e.target.files]);
          }}
        />
        <button
          type="button"
          className="account-button account-button--secondary"
          disabled={!rights || gallery.length >= limit}
          onClick={() => input.current?.click()}
        >
          {busy ? words.uploading : words.add}
        </button>
        <small>{words.formats}</small>
      </div>
      {error ? (
        <p role="alert" className="account-field-error">
          {error}
        </p>
      ) : null}
      <p role="status" aria-live="polite">
        {busy ? words.uploading : notice}
      </p>
      <p>
        {gallery.length} / {limit}
      </p>
      {!gallery.length ? <p className="account-empty">{words.empty}</p> : null}
      <ol className={styles.list}>
        {gallery.map((item, index) => {
          const assigned = products.filter((p) =>
            p.media_ids.includes(item.id),
          );
          return (
            <li className={styles.card} key={item.id}>
              <div className={styles.picture}>
                <a
                  href={source(item)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${words.preview}: ${item.alt || index + 1}`}
                >
                  <Image
                    src={source(item)}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    unoptimized={source(item).startsWith("/api/")}
                    sizes="(max-width: 600px) 85vw, 240px"
                  />
                </a>
                <small>
                  {published.some((p) => p.src === item.src)
                    ? words.published
                    : words.private}
                </small>
                <small>
                  {assigned.length
                    ? `${words.assigned}: ${assigned.map((p) => p.name).join(", ")}`
                    : words.gallery}
                </small>
              </div>
              <div className={styles.fields}>
                <label
                  className="account-field"
                  htmlFor={`media-alt-${item.id}`}
                >
                  <span>{words.alt}</span>
                  <input
                    id={`media-alt-${item.id}`}
                    required
                    maxLength={160}
                    value={item.alt}
                    onChange={(e) => onEdit(item.id, { alt: e.target.value })}
                  />
                </label>
                <label className="account-field">
                  <span>{words.caption}</span>
                  <textarea
                    maxLength={1000}
                    rows={2}
                    value={item.caption}
                    onChange={(e) =>
                      onEdit(item.id, { caption: e.target.value })
                    }
                  />
                </label>
                <label className="account-field">
                  <span>{words.credit}</span>
                  <input
                    maxLength={300}
                    value={item.credit}
                    onChange={(e) =>
                      onEdit(item.id, { credit: e.target.value })
                    }
                  />
                </label>
                <label className="account-field">
                  <span>{words.language}</span>
                  <select
                    value={item.locale}
                    onChange={(e) =>
                      onEdit(item.id, {
                        locale: e.target.value as Media["locale"],
                      })
                    }
                  >
                    {languageOptions
                      .filter((o) => o.value)
                      .map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                  </select>
                </label>
                <div className={styles.tools}>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onMove(index, -1)}
                    aria-label={`${words.up}: ${item.alt || index + 1}`}
                  >
                    {words.up}
                  </button>
                  <button
                    type="button"
                    disabled={index === gallery.length - 1}
                    onClick={() => onMove(index, 1)}
                    aria-label={`${words.down}: ${item.alt || index + 1}`}
                  >
                    {words.down}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onRemove(item.id);
                      setNotice(words.removed);
                    }}
                    aria-label={`${words.remove}: ${item.alt || index + 1}`}
                  >
                    {words.remove}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {canUndo ? (
        <button type="button" className="account-link-button" onClick={onUndo}>
          {words.undo}
        </button>
      ) : null}
      {reusable.length ? (
        <details>
          <summary>
            {words.reuse} ({reusable.length})
          </summary>
          <p>{words.reuseHelp}</p>
          <ul className={styles.recent}>
            {reusable.map((u) => (
              <li key={u.uploadId}>
                <Image
                  src={privateMediaSrc(u.uploadId)}
                  alt=""
                  width={160}
                  height={120}
                  unoptimized
                />
                <button
                  type="button"
                  className="account-link-button"
                  disabled={gallery.length >= limit}
                  onClick={() => attach(u)}
                >
                  {words.use}
                </button>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </fieldset>
  );
}
