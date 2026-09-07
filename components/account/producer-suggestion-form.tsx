"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { ProducerChangeFormField } from "@/components/account/producer-change-form";
import type { ProducerSuggestionFormState } from "@/lib/accounts/producer-suggestion-submission";

type ProducerSuggestionFormProps = Readonly<{
  action: (
    state: ProducerSuggestionFormState,
    data: FormData,
  ) => Promise<ProducerSuggestionFormState>;
  baseRowHash: string;
  country: string;
  fields: readonly ProducerChangeFormField[];
  noteMaxLength: number;
  producerId: number;
  section: string;
}>;

const AUTHOR_NOTE_ID = "producer-suggestion-note";

function fieldId(index: number): string {
  return `producer-suggestion-field-${index}`;
}

function valueSet(value: string): Set<string> {
  return new Set(
    value
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function SuggestionField({
  field,
  index,
  state,
}: Readonly<{
  field: ProducerChangeFormField;
  index: number;
  state: ProducerSuggestionFormState;
}>) {
  const id = fieldId(index);
  const error = state.fieldErrors[field.key];
  const describedBy = `${id}-help${error ? ` ${id}-error` : ""}`;
  const value = state.values[field.key] ?? field.initialValue;
  const isFullWidth = ["categories", "sales-channels", "textarea"].includes(
    field.kind,
  );
  const className = `account-field${isFullWidth ? " account-field--full" : ""}`;
  const help = (
    <>
      <small id={`${id}-help`}>{field.help}</small>
      {error ? (
        <small id={`${id}-error`} className="account-field-error">
          {error}
        </small>
      ) : null}
    </>
  );

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
        {help}
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
          maxLength={field.key === "descripcion" ? undefined : field.maxLength}
          rows={field.key === "descripcion" ? 6 : 3}
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
      {help}
    </div>
  );
}

function SubmitSuggestionButton() {
  const { pending } = useFormStatus();
  return (
    <div className="account-inline-actions">
      <button type="submit" className="account-button" disabled={pending}>
        {pending ? "Enviando…" : "Enviar sugerencia"}
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

export function ProducerSuggestionForm({
  action,
  baseRowHash,
  country,
  fields,
  noteMaxLength,
  producerId,
  section,
}: ProducerSuggestionFormProps) {
  const initialState: ProducerSuggestionFormState = {
    fieldErrors: {},
    formError: null,
    reloadRequired: false,
    revision: 0,
    values: {
      ...Object.fromEntries(
        fields.map((field) => [field.key, field.initialValue]),
      ),
      authorNote: "",
    },
  };
  const [state, formAction] = useActionState(action, initialState);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.revision > 0 && state.formError) errorSummaryRef.current?.focus();
  }, [state.formError, state.revision]);

  const errorFieldIds = new Map<string, string>([
    ...fields.map((field, index) => [field.key, fieldId(index)] as const),
    ["authorNote", AUTHOR_NOTE_ID] as const,
  ]);
  const fieldErrorEntries = Object.entries(state.fieldErrors);
  const noteError = state.fieldErrors.authorNote;

  return (
    <form
      key={state.revision}
      action={formAction}
      className="account-form account-form--wide"
    >
      <PendingFields>
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="producerId" value={producerId} />
        <input type="hidden" name="section" value={section} />
        <input type="hidden" name="baseRowHash" value={baseRowHash} />

        {state.formError ? (
          <div
            ref={errorSummaryRef}
            className="account-callout account-callout--error account-error-summary"
            role="alert"
            tabIndex={-1}
          >
            <strong>No se ha podido enviar la sugerencia</strong>
            <p>{state.formError}</p>
            {fieldErrorEntries.length > 0 ? (
              <ul>
                {fieldErrorEntries.map(([key, message]) => {
                  const targetId = errorFieldIds.get(key);
                  return (
                    <li key={key}>
                      {targetId ? (
                        <a href={`#${targetId}`}>{message}</a>
                      ) : (
                        message
                      )}
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
                Recargar los valores actuales
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="account-form-grid">
          {fields.map((field, index) => (
            <SuggestionField
              key={field.key}
              field={field}
              index={index}
              state={state}
            />
          ))}
        </div>

        <div className="account-field account-field--full">
          <label htmlFor={AUTHOR_NOTE_ID}>
            ¿De dónde sale esta corrección?
          </label>
          <textarea
            id={AUTHOR_NOTE_ID}
            name="authorNote"
            required
            rows={5}
            maxLength={noteMaxLength}
            defaultValue={state.values.authorNote ?? ""}
            aria-describedby={`${AUTHOR_NOTE_ID}-help${noteError ? ` ${AUTHOR_NOTE_ID}-error` : ""}`}
            aria-invalid={noteError ? "true" : undefined}
          />
          <small id={`${AUTHOR_NOTE_ID}-help`}>
            Indica una fuente pública comprobable: la web del productor, un
            cartel en el obrador, la carta del mercado o una visita reciente. No
            envíes datos personales de terceros.
          </small>
          {noteError ? (
            <small id={`${AUTHOR_NOTE_ID}-error`} className="account-field-error">
              {noteError}
            </small>
          ) : null}
        </div>

        <SubmitSuggestionButton />
      </PendingFields>
    </form>
  );
}
