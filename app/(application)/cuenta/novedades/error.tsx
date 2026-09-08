"use client";
export default function TimelineError({ reset }: { reset: () => void }) {
  return (
    <div className="account-content">
      <h2>No se han podido cargar las novedades</h2>
      <p>Tus seguimientos se conservan. Inténtalo de nuevo en unos momentos.</p>
      <button className="account-button" onClick={reset}>
        Volver a intentar
      </button>
    </div>
  );
}
