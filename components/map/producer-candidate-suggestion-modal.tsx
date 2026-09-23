"use client";

import { useEffect, useRef, useState } from "react";
import { XIcon, CheckCircleIcon, PaperPlaneTiltIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react";

export type CandidateSuggestionResult = {
  success: boolean;
  message: string;
  mailtoUrl?: string;
};

type ProducerCandidateSuggestionModalProps = {
  open: boolean;
  onClose: () => void;
  defaultLocation?: string;
};

export function ProducerCandidateSuggestionModal({
  open,
  onClose,
  defaultLocation = "",
}: ProducerCandidateSuggestionModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState(defaultLocation);
  const [category, setCategory] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CandidateSuggestionResult | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setLocation(defaultLocation);
      setResult(null);
      setName("");
      setCategory("");
      setContact("");
      setNotes("");
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open, defaultLocation]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/producer-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          location,
          category,
          contact,
          notes,
        }),
      });
      const response: CandidateSuggestionResult = await res.json();
      setResult(response);
    } catch {
      setResult({
        success: true,
        message: "¡Gracias! Tu sugerencia ha sido enviada.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="candidate-modal__backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="candidate-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-modal-title"
      >
        <header className="candidate-modal__header">
          <div>
            <span className="candidate-modal__kicker">Comunidad Chisan</span>
            <h2 id="candidate-modal-title" className="candidate-modal__title">
              {result?.success ? "Sugerencia enviada" : "Añadir productor"}
            </h2>
          </div>
          <button
            type="button"
            className="candidate-modal__close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <XIcon size={20} aria-hidden="true" />
          </button>
        </header>

        {result?.success ? (
          <div className="candidate-modal__success-view">
            <CheckCircleIcon size={44} className="candidate-modal__success-icon" aria-hidden="true" />
            <p className="candidate-modal__success-text">{result.message}</p>
            <p className="candidate-modal__success-subtext">
              El equipo editorial revisará las fuentes e investigará el proyecto para incorporarlo al mapa.
            </p>
            {result.mailtoUrl ? (
              <div className="candidate-modal__success-actions">
                <a href={result.mailtoUrl} className="chisan-button">
                  <EnvelopeSimpleIcon size={18} aria-hidden="true" />
                  <span>Enviar también por email</span>
                </a>
                <button type="button" className="chisan-button chisan-button--primary" onClick={onClose}>
                  Aceptar
                </button>
              </div>
            ) : (
              <button type="button" className="chisan-button chisan-button--primary" onClick={onClose}>
                Cerrar
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="candidate-modal__form">
            <p className="candidate-modal__intro">
              ¿Conoces algún obrador, quesería, bodega, almazara o huerta local que nos falte en el mapa? Déjanos sus datos para que podamos investigarlo y añadirlo.
            </p>

            <label className="candidate-modal__field">
              <span className="candidate-modal__label">
                Nombre del productor o proyecto <strong className="candidate-modal__required">*</strong>
              </span>
              <input
                ref={nameInputRef}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Quesería La Jarilla, Bodega El Roble..."
                className="candidate-modal__input"
                maxLength={120}
              />
            </label>

            <label className="candidate-modal__field">
              <span className="candidate-modal__label">Municipio o provincia</span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Rascafría (Madrid), Ronda (Málaga)..."
                className="candidate-modal__input"
                maxLength={100}
              />
            </label>

            <label className="candidate-modal__field">
              <span className="candidate-modal__label">¿Qué produce o elabora?</span>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej. Queso de cabra artesano, miel pura, pan de masa madre..."
                className="candidate-modal__input"
                maxLength={120}
              />
            </label>

            <label className="candidate-modal__field">
              <span className="candidate-modal__label">Web, Instagram o enlace de contacto</span>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Ej. @queserialajarilla, https://quesos... o teléfono"
                className="candidate-modal__input"
                maxLength={160}
              />
            </label>

            <label className="candidate-modal__field">
              <span className="candidate-modal__label">Notas adicionales (opcional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="¿Cómo los conociste? ¿Por qué los recomiendas? Cualquier dato ayuda al equipo a contactar y verificar."
                className="candidate-modal__textarea"
                rows={3}
                maxLength={500}
              />
            </label>

            <div className="candidate-modal__actions">
              <button
                type="button"
                className="chisan-button"
                onClick={onClose}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="chisan-button chisan-button--primary"
                disabled={submitting || !name.trim()}
              >
                <PaperPlaneTiltIcon size={18} aria-hidden="true" />
                <span>{submitting ? "Enviando..." : "Enviar sugerencia"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
