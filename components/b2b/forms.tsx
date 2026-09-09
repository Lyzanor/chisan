"use client";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { businessAction } from "@/app/(application)/cuenta/profesional/actions";
import {
  B2B_ROOT,
  emptyBusinessTerms,
  type BusinessTerms,
} from "@/lib/b2b/policy";
const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
function SubmitForm({
  operation,
  payload,
  children,
  label,
}: {
  operation: string;
  payload: unknown;
  children?: React.ReactNode;
  label: string;
}) {
  const [state, action, pending] = useActionState(businessAction, {});
  const router = useRouter();
  useEffect(() => {
    if (state.id) router.push(`${B2B_ROOT}/consultas/${state.id}`);
  }, [state.id, router]);
  return (
    <form action={action} className="account-form">
      <input type="hidden" name="operation" value={operation} />
      <input type="hidden" name="payload" value={JSON.stringify(payload)} />
      {children}
      <button disabled={pending} className="account-button">
        {pending ? "Guardando…" : label}
      </button>
      {state.error ? (
        <p role="alert">{state.error}</p>
      ) : state.success ? (
        <p role="status">{state.success}</p>
      ) : null}
    </form>
  );
}
export function ProfileForm({
  initial,
}: {
  initial: { businessName: string; activity: string; enabled: boolean } | null;
}) {
  const [value, set] = useState(
    initial ?? { businessName: "", activity: "restaurante", enabled: true },
  );
  return (
    <SubmitForm
      operation="profile"
      payload={value}
      label="Guardar datos profesionales"
    >
      <label className="account-field">
        Nombre del negocio
        <input
          required
          maxLength={160}
          value={value.businessName}
          onChange={(e) => set({ ...value, businessName: e.target.value })}
        />
      </label>
      <label className="account-field">
        Actividad
        <select
          value={value.activity}
          onChange={(e) => set({ ...value, activity: e.target.value })}
        >
          {["restaurante", "hosteleria", "tienda", "distribucion", "otro"].map(
            (v) => (
              <option key={v}>{v}</option>
            ),
          )}
        </select>
      </label>
      <label className="account-check">
        <input
          type="checkbox"
          checked={value.enabled}
          onChange={(e) => set({ ...value, enabled: e.target.checked })}
        />{" "}
        Activar consultas profesionales
      </label>
      <p>
        Estos datos se comparten únicamente con los proveedores a los que
        escribas. Son datos declarados por ti.
      </p>
    </SubmitForm>
  );
}
function TermsFields({
  value,
  set,
}: {
  value: BusinessTerms;
  set: (value: BusinessTerms) => void;
}) {
  return (
    <fieldset className="account-form-section">
      <legend>Condiciones por producto</legend>
      {(
        [
          ["weeklyCapacity", "Capacidad semanal orientativa"],
          ["minimumOrder", "Pedido mínimo (MOQ)"],
          ["deliveryRadiusKm", "Radio de reparto (km)"],
          ["leadTimeHours", "Antelación del pedido (horas)"],
        ] as const
      ).map(([key, label]) => (
        <label className="account-field" key={key}>
          {label}
          <input
            type="number"
            min={key === "leadTimeHours" ? 0 : 0.01}
            step={key === "leadTimeHours" ? 1 : "any"}
            value={value[key] ?? ""}
            onChange={(e) =>
              set({
                ...value,
                [key]:
                  e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
          />
        </label>
      ))}
      {(
        [
          ["capacityUnit", "Unidad de capacidad (kg, cajas…)"],
          ["orderUnit", "Unidad del pedido mínimo (kg, caja 5 kg…)"],
          ["deliveryOrigin", "Origen del radio de reparto"],
          ["deliveryArea", "Zona de reparto"],
        ] as const
      ).map(([key, label]) => (
        <label className="account-field" key={key}>
          {label}
          <input
            maxLength={
              key === "deliveryArea" ? 240 : key === "deliveryOrigin" ? 160 : 80
            }
            value={value[key] ?? ""}
            onChange={(e) =>
              set({
                ...value,
                [key]:
                  e.target.value || (key === "deliveryArea" ? "" : undefined),
              })
            }
          />
        </label>
      ))}
      <p>Días de reparto</p>
      {days.map((day, index) => (
        <label className="account-check" key={day}>
          <input
            type="checkbox"
            checked={value.deliveryDays.includes(index + 1)}
            onChange={(e) =>
              set({
                ...value,
                deliveryDays: e.target.checked
                  ? [...value.deliveryDays, index + 1].sort()
                  : value.deliveryDays.filter((d) => d !== index + 1),
              })
            }
          />
          {day}
        </label>
      ))}
      <label className="account-field">
        Notas y vigencia
        <textarea
          maxLength={1000}
          value={value.notes}
          onChange={(e) => set({ ...value, notes: e.target.value })}
        />
      </label>
    </fieldset>
  );
}
export function TermsForm({
  country,
  producerId,
  productId,
  version,
  initial,
}: {
  country: string;
  producerId: number;
  productId: string;
  version: number;
  initial?: BusinessTerms;
}) {
  const [terms, set] = useState(initial ?? emptyBusinessTerms());
  return (
    <SubmitForm
      operation="terms"
      payload={{ country, producerId, productId, version, terms }}
      label="Guardar condiciones privadas"
    >
      <TermsFields value={terms} set={set} />
    </SubmitForm>
  );
}
export function RequestForm({
  country,
  producerId,
  products,
  submissionId,
}: {
  submissionId: string;
  country: string;
  producerId: number;
  products: { id: string; name: string; format?: string }[];
}) {
  const [id] = useState(submissionId);
  const [selected, setSelected] = useState<
    Record<string, { quantity: number; unit: string }>
  >({});
  const [frequency, setFrequency] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  return (
    <SubmitForm
      operation="create"
      payload={{
        id,
        country,
        producerId,
        products: Object.entries(selected).map(([productId, v]) => ({
          productId,
          ...v,
        })),
        frequency,
        deliveryLocation: location,
        message,
      }}
      label="Enviar consulta profesional"
    >
      {products.map((p) => (
        <fieldset className="account-form-section" key={p.id}>
          <legend>
            <label className="account-check">
              <input
                type="checkbox"
                checked={Boolean(selected[p.id])}
                onChange={(e) =>
                  setSelected((current) => {
                    const next = { ...current };
                    if (e.target.checked)
                      next[p.id] = { quantity: 1, unit: p.format ?? "" };
                    else delete next[p.id];
                    return next;
                  })
                }
              />
              {p.name}
            </label>
          </legend>
          {selected[p.id] ? (
            <>
              <label className="account-field">
                Cantidad solicitada
                <input
                  required
                  type="number"
                  min="0.01"
                  step="any"
                  value={selected[p.id].quantity}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      [p.id]: {
                        ...selected[p.id],
                        quantity: Number(e.target.value),
                      },
                    })
                  }
                />
              </label>
              <label className="account-field">
                Unidad o formato
                <input
                  required
                  maxLength={80}
                  value={selected[p.id].unit}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      [p.id]: { ...selected[p.id], unit: e.target.value },
                    })
                  }
                />
              </label>
            </>
          ) : null}
        </fieldset>
      ))}
      <label className="account-field">
        Frecuencia
        <input
          required
          maxLength={120}
          placeholder="Semanal, pedido puntual…"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        />
      </label>
      <label className="account-field">
        Lugar de entrega
        <input
          required
          maxLength={240}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      <label className="account-field">
        Mensaje
        <textarea
          required
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <p>
        El proveedor recibirá tu negocio y esta solicitud. No implica un pedido
        confirmado.
      </p>
    </SubmitForm>
  );
}
export function ReplyForm({
  enquiryId,
  offers,
  submissionId,
}: {
  submissionId: string;
  enquiryId: string;
  offers?: { productId: string; name: string; terms: BusinessTerms }[];
}) {
  const [id] = useState(submissionId);
  const [body, setBody] = useState("");
  const [productId, setProduct] = useState("");
  const [terms, setTerms] = useState(emptyBusinessTerms());
  return (
    <SubmitForm
      key={id}
      operation="reply"
      payload={{
        id,
        enquiryId,
        body,
        ...(productId ? { offer: { productId, terms } } : {}),
      }}
      label={
        productId
          ? "Enviar mensaje y compartir estas condiciones"
          : "Enviar mensaje"
      }
    >
      <label className="account-field">
        Mensaje
        <textarea
          required
          maxLength={2000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>
      {offers?.length ? (
        <>
          <label className="account-field">
            Adjuntar condiciones de un producto
            <select
              value={productId}
              onChange={(e) => {
                setProduct(e.target.value);
                setTerms(
                  offers.find((p) => p.productId === e.target.value)?.terms ??
                    emptyBusinessTerms(),
                );
              }}
            >
              <option value="">Solo mensaje</option>
              {offers.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          {productId ? (
            <>
              <TermsFields value={terms} set={setTerms} />
              <p>
                Compartirás exactamente estos datos con el negocio solicitante.
                Quedarán fechados en la conversación.
              </p>
            </>
          ) : null}
        </>
      ) : null}
    </SubmitForm>
  );
}
export function CloseForm({ id }: { id: string }) {
  return (
    <SubmitForm operation="close" payload={{ id }} label="Cerrar consulta" />
  );
}
