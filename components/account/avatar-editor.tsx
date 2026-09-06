"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "./user-avatar";
import styles from "./avatar-editor.module.css";

export function AvatarEditor({
  name,
  initialUrl,
}: {
  name: string;
  initialUrl: string | null;
}) {
  const [avatarUrl, setAvatarUrl] = useState(initialUrl);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  async function save(file: File | null) {
    if (busy) return;
    if (file && file.size > 4 * 1024 * 1024) {
      setMessage("La foto debe ocupar como máximo 4 MB.");
      return;
    }
    if (
      file &&
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      setMessage("Elige una imagen JPG, PNG o WebP.");
      return;
    }
    const temporaryUrl = file ? URL.createObjectURL(file) : null;
    setPreview(temporaryUrl);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/account/avatar", {
        method: file ? "POST" : "DELETE",
        headers: {
          "X-Chisan-Avatar": "1",
          ...(file ? { "Content-Type": file.type } : {}),
        },
        body: file,
      });
      if (!response.ok) {
        if (response.status === 429)
          throw new Error("Has cambiado la foto varias veces. Prueba mañana.");
        if (response.status === 422)
          throw new Error(
            "No hemos podido leer la imagen. Elige otra foto JPG, PNG o WebP.",
          );
        throw new Error("No se ha guardado la foto. Inténtalo de nuevo.");
      }
      const result = await response.json();
      setAvatarUrl(result.avatarUrl);
      setMessage(file ? "Foto guardada." : "Foto eliminada.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se ha guardado la foto.",
      );
    } finally {
      if (temporaryUrl) URL.revokeObjectURL(temporaryUrl);
      setPreview(null);
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  return (
    <div className={styles.editor} aria-busy={busy}>
      <div className={styles.row}>
        <UserAvatar name={name} src={preview ?? avatarUrl} size={64} />
        <div>
          <label className="account-field">
            <span>Foto de perfil</span>
            <input
              ref={input}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void save(file);
              }}
            />
          </label>
          <p className={styles.hint}>
            JPG, PNG o WebP, hasta 4 MB. Se guarda al elegirla.
          </p>
        </div>
      </div>
      {avatarUrl ? (
        <button
          type="button"
          className="account-button account-button--secondary"
          disabled={busy}
          onClick={() => void save(null)}
        >
          Quitar foto
        </button>
      ) : null}
      <p className={styles.hint}>
        Si entras con Google, usamos su foto como imagen inicial. Puedes
        cambiarla cuando quieras.
      </p>
      <p role="status" aria-live="polite">
        {busy ? "Guardando foto…" : message}
      </p>
    </div>
  );
}
