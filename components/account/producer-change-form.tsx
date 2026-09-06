"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import type { ProducerChangeFormState } from "@/lib/accounts/producer-change-submission";

import type { Locale } from "@/lib/i18n/locales";
import {
  getProducerEditorLabels,
  producerEditorMessage,
} from "@/lib/i18n/producer-editor";
import {
  ProducerProductsEditor,
  type ProductEditorData,
} from "./producer-products-editor";

type ProducerChangeFormOption = Readonly<{
  label: string;
  value: string;
}>;

export type ProducerChangeFormField = Readonly<{
  help: string;
  initialValue: string;
  key: string;
  kind:
    | "category"
    | "categories"
    | "coordinate"
    | "description-locale"
    | "email"
    | "online-sales"
    | "sales-channels"
    | "tel"
    | "text"
    | "textarea"
    | "url"
    | "yes-no";
  label: string;
  maxLength: number;
  options: readonly ProducerChangeFormOption[];
  required: boolean;
}>;

type ProducerChangeFormProps = Readonly<{
  action: (
    state: ProducerChangeFormState,
    data: FormData,
  ) => Promise<ProducerChangeFormState>;
  baseRowHash: string;
  locale?: Locale;
  products?: ProductEditorData;
  languageOptions?: readonly ProducerChangeFormOption[];
  draft?: { id: string; lockVersion: number; authorNote: string };
  country: string;
  premiumFields: readonly ProducerChangeFormField[];
  producerId: number;
  standardFields: readonly ProducerChangeFormField[];
}>;

function valueSet(value: string): Set<string> {
  return new Set(
    value
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

const LONG_PROSE_FIELDS = new Set([
  "descripcion",
  "mensaje a la comunidad",
  "quien hay detras",
  "historia",
]);

function fieldId(group: "standard" | "premium", index: number): string {
  return `producer-change-${group}-${index}`;
}

function fieldDescriptionIds(id: string, hasError: boolean): string {
  return `${id}-help${hasError ? ` ${id}-error` : ""}`;
}

function ProducerChangeField({
  field,
  group,
  index,
  state,
}: Readonly<{
  field: ProducerChangeFormField;
  group: "standard" | "premium";
  index: number;
  state: ProducerChangeFormState;
}>) {
  const id = fieldId(group, index);
  const error = state.fieldErrors[field.key];
  const describedBy = fieldDescriptionIds(id, Boolean(error));
  const value = state.values[field.key] ?? field.initialValue;
  const isFullWidth = ["categories", "sales-channels", "textarea"].includes(
    field.kind,
  );
  const className = `account-field${isFullWidth ? " account-field--full" : ""}`;

  if (field.kind === "categories" || field.kind === "sales-channels") {
    const selected = valueSet(value);
    return (
      <fieldset
        id={id}
        className={className}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        tabIndex={error ? -1 : undefined}
      >
        <legend>{field.label}</legend>
        <div className="account-checkbox-grid">
          {field.options.map((option) => (
            <label
              key={option.value}
              className="account-check account-check--compact"
            >
              <input
                type="checkbox"
                name={field.key}
                value={option.value}
                defaultChecked={selected.has(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <small id={`${id}-help`}>{field.help}</small>
        {error ? (
          <small id={`${id}-error`} className="account-field-error">
            {error}
          </small>
        ) : null}
      </fieldset>
    );
  }

  const controlProps = {
    "aria-describedby": describedBy,
    "aria-invalid": error ? ("true" as const) : undefined,
    id,
    name: field.key,
  };

  return (
    <div className={className}>
      <label htmlFor={id}>{field.label}</label>
      {field.kind === "textarea" ? (
        <textarea
          {...controlProps}
          defaultValue={value}
          required={field.required}
          maxLength={
            LONG_PROSE_FIELDS.has(field.key) ? undefined : field.maxLength
          }
          rows={
            field.key === "historia"
              ? 10
              : LONG_PROSE_FIELDS.has(field.key)
                ? 6
                : 3
          }
        />
      ) : field.options.length > 0 ? (
        <select
          {...controlProps}
          defaultValue={
            value || (field.kind === "online-sales" ? "no comprobado" : "")
          }
          required={field.required}
        >
          {field.options.map((option) => (
            <option key={option.value || "none"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...controlProps}
          type={
            ["email", "tel", "url"].includes(field.kind) ? field.kind : "text"
          }
          defaultValue={value}
          required={field.required}
          maxLength={field.maxLength}
          inputMode={field.kind === "coordinate" ? "decimal" : undefined}
        />
      )}
      <small id={`${id}-help`}>{field.help}</small>
      {error ? (
        <small id={`${id}-error`} className="account-field-error">
          {error}
        </small>
      ) : null}
    </div>
  );
}

function SubmitProducerChangeButton({
  blocked,
  locale,
}: Readonly<{ blocked: boolean; locale: Locale }>) {
  const { pending } = useFormStatus();
  const labels = getProducerEditorLabels(locale);
  return (
    <div className="account-inline-actions">
      <button
        type="submit"
        name="intent"
        value="draft"
        formNoValidate
        className="account-button account-button--secondary"
        disabled={pending || blocked}
      >
        {pending ? labels.saving : labels.draft}
      </button>
      <button
        type="submit"
        name="intent"
        value="submit"
        className="account-button"
        disabled={pending || blocked}
      >
        {pending ? labels.saving : labels.submit}
      </button>
    </div>
  );
}

function PendingFields({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <fieldset disabled={pending} className="producer-editor-fields">
      {children}
    </fieldset>
  );
}

export function ProducerChangeForm({
  action,
  baseRowHash,
  locale = "en",
  products,
  languageOptions = [],
  draft,
  country,
  premiumFields,
  producerId,
  standardFields,
}: ProducerChangeFormProps) {
  const initialValues = Object.fromEntries(
    [...standardFields, ...premiumFields].map((field) => [
      field.key,
      field.initialValue,
    ]),
  );
  initialValues.authorNote = draft?.authorNote ?? "";
  initialValues.gallery = JSON.stringify(products?.gallery ?? []);
  initialValues.uploads = JSON.stringify(products?.uploads ?? []);
  initialValues.products = JSON.stringify(products?.products ?? []);
  const initialState: ProducerChangeFormState = {
    fieldErrors: {},
    formError: null,
    reloadRequired: false,
    revision: 0,
    values: initialValues,
    draftId: draft?.id,
    draftVersion: draft?.lockVersion,
  };
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [state, formAction] = useActionState(
    async (previousState: ProducerChangeFormState, data: FormData) => {
      const result = await action(previousState, data);
      setDirty(Boolean(result.formError));
      return result;
    },
    initialState,
  );
  const labels = getProducerEditorLabels(locale);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.revision > 0 && state.formError) errorSummaryRef.current?.focus();
  }, [state.formError, state.revision]);

  const fieldErrorEntries = Object.entries(state.fieldErrors);
  const errorFieldIds = new Map<string, string>([
    ...standardFields.map(
      (field, index) => [field.key, fieldId("standard", index)] as const,
    ),
    ...premiumFields.map(
      (field, index) => [field.key, fieldId("premium", index)] as const,
    ),
    ["authorNote", "producer-change-author-note"] as const,
    ["products", "producer-change-products"] as const,
  ]);
  const authorNoteError = state.fieldErrors.authorNote
    ? producerEditorMessage(locale, state.fieldErrors.authorNote)
    : undefined;

  return (
    <form
      key={state.revision}
      ref={formRef}
      onChange={() => setDirty(true)}
      onSubmit={event => { if (uploading) event.preventDefault(); else setDirty(false); }}
      action={formAction}
      className="account-form account-form--wide"
    >
      <PendingFields>
        <input type="hidden" name="draftId" value={state.draftId ?? ""} />
        <input
          type="hidden"
          name="draftVersion"
          value={state.draftVersion ?? ""}
        />
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="producerId" value={producerId} />
        <input type="hidden" name="baseRowHash" value={baseRowHash} />

        {state.formError ? (
          <div
            ref={errorSummaryRef}
            className="account-callout account-callout--error account-error-summary"
            role="alert"
            tabIndex={-1}
          >
            <strong>{labels.error}</strong>
            <p>{producerEditorMessage(locale, state.formError)}</p>
            {fieldErrorEntries.length > 0 ? (
              <ul>
                {fieldErrorEntries.map(([key, message]) => {
                  const targetId = errorFieldIds.get(key);
                  return (
                    <li key={key}>
                      {targetId ? (
                        <a href={`#${targetId}`}>
                          {producerEditorMessage(locale, message)}
                        </a>
                      ) : (
                        producerEditorMessage(locale, message)
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}
            {state.reloadRequired ? (
              <div>
                <button
                  type="button"
                  className="account-button account-button--secondary"
                  onClick={async () => {
                    const data = new FormData(formRef.current!);
                    const values = [...data.entries()].filter(
                      ([key]) =>
                        ![
                          "country",
                          "producerId",
                          "draftId",
                          "draftVersion",
                          "baseRowHash",
                          "baseContentHash",
                        ].includes(key),
                    );
                    await navigator.clipboard.writeText(
                      JSON.stringify(values, null, 2),
                    );
                    setCopied(true);
                  }}
                >
                  {labels.copy}
                </button>
                {copied ? <p role="status">{labels.copied}</p> : null}
              </div>
            ) : null}
            {state.reloadRequired ? (
              <button
                type="button"
                className="account-button account-button--secondary"
                onClick={() => window.location.reload()}
              >
                {labels.reload}
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="producer-editor-progress" role="status">
          <strong>
            {dirty
              ? labels.unsaved
              : state.draftId
                ? labels.saved
                : labels.initial}
          </strong>
          <p>
            {state.draftId && !dirty ? labels.draftHelp : labels.reviewHelp}
          </p>
        </div>
        {products ? (
          <ProducerProductsEditor
            content={{ ...products, uploads: (() => { try { const values = JSON.parse(state.values.uploads); return [...(products.uploads ?? []), ...values].filter((item, index, all) => all.findIndex(u => u.uploadId === item.uploadId) === index); } catch { return products.uploads; } })() }}
            country={country} producerId={producerId} onBusy={setUploading}
            initialGallery={(() => { try { return JSON.parse(state.values.gallery); } catch { return products.gallery; } })()}
            initialProducts={(() => {
              try {
                return JSON.parse(state.values.products);
              } catch {
                return products.products;
              }
            })()}
            locale={locale}
            languageOptions={languageOptions}
            onChange={() => setDirty(true)}
          />
        ) : null}
        <fieldset className="account-form-section">
          <legend>{labels.standard}</legend>
          <p>{labels.standardHelp}</p>
          <div className="account-form-grid">
            {standardFields.map((field, index) => (
              <ProducerChangeField
                key={field.key}
                field={field}
                group="standard"
                index={index}
                state={state}
              />
            ))}
          </div>
        </fieldset>

        {premiumFields.length > 0 ? (
          <fieldset className="account-form-section account-form-section--premium">
            <legend>{labels.expanded}</legend>
            <p>{labels.expandedHelp}</p>
            <div className="account-form-grid">
              {premiumFields.map((field, index) => (
                <ProducerChangeField
                  key={field.key}
                  field={field}
                  group="premium"
                  index={index}
                  state={state}
                />
              ))}
            </div>
          </fieldset>
        ) : null}

        <div className="account-field">
          <label htmlFor="producer-change-author-note">{labels.note}</label>
          <textarea
            id="producer-change-author-note"
            name="authorNote"
            defaultValue={state.values.authorNote ?? ""}
            required
            minLength={20}
            maxLength={4_000}
            rows={6}
            placeholder={labels.notePlaceholder}
            aria-describedby={`producer-change-author-note-help${authorNoteError ? " producer-change-author-note-error" : ""}`}
            aria-invalid={authorNoteError ? "true" : undefined}
          />
          <small id="producer-change-author-note-help">{labels.noteHelp}</small>
          {authorNoteError ? (
            <small
              id="producer-change-author-note-error"
              className="account-field-error"
            >
              {authorNoteError}
            </small>
          ) : null}
        </div>

        <p>{labels.reviewHelp}</p>
        <SubmitProducerChangeButton
          blocked={state.reloadRequired || uploading}
          locale={locale}
        />
      </PendingFields>
    </form>
  );
}
