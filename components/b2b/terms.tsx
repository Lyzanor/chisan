import type { BusinessTerms } from "@/lib/b2b/policy";
export function BusinessTermsSummary({ value }: { value: BusinessTerms }) {
  return (
    <dl>
      {value.weeklyCapacity !== undefined ? (
        <>
          <dt>Capacidad semanal orientativa</dt>
          <dd>
            {value.weeklyCapacity} {value.capacityUnit}
          </dd>
        </>
      ) : null}
      {value.minimumOrder !== undefined ? (
        <>
          <dt>Pedido mínimo</dt>
          <dd>
            {value.minimumOrder} {value.orderUnit}
          </dd>
        </>
      ) : null}
      <dt>Reparto</dt>
      <dd>
        {value.deliveryDays
          .map(
            (d) =>
              [
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
                "Domingo",
              ][d - 1],
          )
          .join(", ") || "Días por acordar"}
        {value.deliveryRadiusKm !== undefined
          ? ` · ${value.deliveryRadiusKm} km desde ${value.deliveryOrigin}`
          : ""}
        {value.deliveryArea ? ` · ${value.deliveryArea}` : ""}
      </dd>
      {value.leadTimeHours !== undefined ? (
        <>
          <dt>Antelación</dt>
          <dd>{value.leadTimeHours} horas</dd>
        </>
      ) : null}
      {value.notes ? (
        <>
          <dt>Notas y vigencia</dt>
          <dd style={{ whiteSpace: "pre-wrap" }}>{value.notes}</dd>
        </>
      ) : null}
    </dl>
  );
}
