"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

const POLL_INTERVAL_MS = 2_000;
const POLL_DURATION_MS = 30_000;

type ProfileUpgradeStatusRefreshProps = Readonly<{
  enabled: boolean;
}>;

export function ProfileUpgradeStatusRefresh({
  enabled,
}: ProfileUpgradeStatusRefreshProps) {
  return enabled ? <ActiveProfileUpgradeStatusRefresh /> : null;
}

function ActiveProfileUpgradeStatusRefresh() {
  const router = useRouter();
  const [automaticChecksComplete, setAutomaticChecksComplete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const refreshStatus = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router, startTransition]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setAutomaticChecksComplete(true);
    }, POLL_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (automaticChecksComplete || isPending) return;

    const timeoutId = window.setTimeout(refreshStatus, POLL_INTERVAL_MS);
    return () => window.clearTimeout(timeoutId);
  }, [automaticChecksComplete, isPending, refreshStatus]);

  const statusMessage = automaticChecksComplete
    ? isPending
      ? "Checking payment status…"
      : "Automatic checks have stopped. You can check the payment status manually."
    : "Checking payment status automatically…";

  return (
    <div className="account-form">
      <p aria-live="polite" aria-atomic="true" aria-busy={isPending}>
        {statusMessage}
      </p>
      <div className="account-inline-actions">
        <button
          type="button"
          className="account-button account-button--secondary"
          disabled={isPending}
          onClick={refreshStatus}
        >
          Check payment status
        </button>
      </div>
    </div>
  );
}
