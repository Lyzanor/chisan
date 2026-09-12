"use client";

import { EnvelopeSimpleIcon, ArrowUpRightIcon, PhoneIcon } from "@phosphor-icons/react";
import type { FormEvent } from "react";
import type { ProducerContactMessages } from "@/lib/i18n/producer-contact";

export function ProducerContact({
  email, phone, callLabel, name, messages,
}: {
  email: string;
  phone?: string;
  callLabel?: string;
  name: string;
  messages: ProducerContactMessages;
}) {
  function composeEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = String(new FormData(event.currentTarget).get("message") ?? "").trim();
    if (!message) return;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Chisan · ${name}`)}&body=${encodeURIComponent(message)}`;
  }

  return (
    <section id="detail-contact" className="producer-contact" aria-labelledby="producer-contact-title">
      <h2 id="producer-contact-title">
        <EnvelopeSimpleIcon size={20} aria-hidden="true" />
        {messages.title}
      </h2>
      {phone ? <a className="producer-contact__recipient" href={`tel:${phone}`}><PhoneIcon size={20} aria-hidden="true" />{callLabel} · {phone}</a> : null}
      {email ? <a className="producer-contact__recipient" href={`mailto:${email}`}><EnvelopeSimpleIcon size={20} aria-hidden="true" />{email}</a> : null}
      {email ? <form onSubmit={composeEmail}>
        <label htmlFor="producer-contact-message">{messages.message}</label>
        <textarea
          id="producer-contact-message"
          name="message"
          required
          maxLength={2000}
          rows={3}
          placeholder={messages.placeholder}
          aria-describedby="producer-contact-explanation"
        />
        <p id="producer-contact-explanation">{messages.explanation}</p>
        <button type="submit">
          {messages.action}<ArrowUpRightIcon size={18} aria-hidden="true" />
        </button>
      </form> : null}
    </section>
  );
}
