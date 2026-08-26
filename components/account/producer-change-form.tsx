"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  submitProducerChangeAction,
  type ProducerChangeFormState,
} from "@/app/(application)/cuenta/actions";

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
  baseRowHash: string;
  country: string;
  premiumFields: readonly ProducerChangeFormField[];
  producerId: number;
  standardFields: readonly ProducerChangeFormField[];
}>;

function valueSet(value: string): Set<string> {
  return new Set(value.split("|").map((item) => item.trim()).filter(Boolean));
}

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
  const isFullWidth = ["categories", "sales-channels", "textarea"].includes(field.kind);
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
            <label key={option.value} className="account-check account-check--compact">
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
            field.key === "descripcion" || field.key === "mensaje a la comunidad"
              ? undefined
              : field.maxLength
          }
          rows={
            field.key === "descripcion" || field.key === "mensaje a la comunidad" ? 6 : 3
          }
        />
      ) : field.options.length > 0 ? (
        <select
          {...controlProps}
          defaultValue={value || (field.kind === "online-sales" ? "no comprobado" : "")}
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
          type={["email", "tel", "url"].includes(field.kind) ? field.kind : "text"}
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

function SubmitProducerChangeButton({ blocked }: Readonly<{ blocked: boolean }>) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="account-button" disabled={pending || blocked}>
      {pending ? "Submitting changes…" : "Submit changes for review"}
    </button>
  );
}

export function ProducerChangeForm({
  baseRowHash,
  country,
  premiumFields,
  producerId,
  standardFields,
}: ProducerChangeFormProps) {
  const initialValues = Object.fromEntries(
    [...standardFields, ...premiumFields].map((field) => [field.key, field.initialValue]),
  );
  initialValues.authorNote = "";
  const initialState: ProducerChangeFormState = {
    fieldErrors: {},
    formError: null,
    reloadRequired: false,
    revision: 0,
    values: initialValues,
  };
  const [state, formAction] = useActionState(submitProducerChangeAction, initialState);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.revision > 0 && state.formError) errorSummaryRef.current?.focus();
  }, [state.formError, state.revision]);

  const fieldErrorEntries = Object.entries(state.fieldErrors);
  const errorFieldIds = new Map<string, string>([
    ...standardFields.map((field, index) => [field.key, fieldId("standard", index)] as const),
    ...premiumFields.map((field, index) => [field.key, fieldId("premium", index)] as const),
    ["authorNote", "producer-change-author-note"] as const,
  ]);
  const authorNoteError = state.fieldErrors.authorNote;

  return (
    <form
      key={state.revision}
      action={formAction}
      className="account-form account-form--wide"
    >
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
          <strong>We could not submit these changes.</strong>
          <p>{state.formError}</p>
          {fieldErrorEntries.length > 0 ? (
            <ul>
              {fieldErrorEntries.map(([key, message]) => {
                const targetId = errorFieldIds.get(key);
                return (
                  <li key={key}>
                    {targetId ? <a href={`#${targetId}`}>{message}</a> : message}
                  </li>
                );
              })}
            </ul>
          ) : null}
          {state.reloadRequired ? (
            <button
              type="button"
              className="account-button account-button--secondary"
              onClick={() => window.location.reload()}
            >
              Reload latest profile
            </button>
          ) : null}
        </div>
      ) : null}

      <fieldset className="account-form-section">
        <legend>Standard profile fields</legend>
        <p>Ordinary factual corrections remain available without payment.</p>
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
          <legend>Expanded profile fields</legend>
          <p>These paid fields remain subject to the same editorial review.</p>
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
        <label htmlFor="producer-change-author-note">Reason and supporting source</label>
        <textarea
          id="producer-change-author-note"
          name="authorNote"
          defaultValue={state.values.authorNote ?? ""}
          required
          minLength={20}
          maxLength={4_000}
          rows={6}
          placeholder="Explain what changed and include the official public source. For a community message, state that it is the producer-authored text submitted here."
          aria-describedby={`producer-change-author-note-help${authorNoteError ? " producer-change-author-note-error" : ""}`}
          aria-invalid={authorNoteError ? "true" : undefined}
        />
        <small id="producer-change-author-note-help">
          Objective catalog claims still need public support. A community message is reviewed
          as attributed producer speech and keeps its authorship in the account audit trail.
        </small>
        {authorNoteError ? (
          <small id="producer-change-author-note-error" className="account-field-error">
            {authorNoteError}
          </small>
        ) : null}
      </div>

      <SubmitProducerChangeButton blocked={state.reloadRequired} />
    </form>
  );
}
