"use client";

import { useAuth } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { guestProducerViewerState, type ProducerViewerState } from "@/lib/accounts/producer-viewer-state";

const ProducerAccountContext = createContext<ProducerViewerState | null>(null);
export const useProducerAccountState = () => useContext(ProducerAccountContext);

function AuthenticatedProducerAccount({
  country, producerId, activeOwner, children,
}: {
  country: string; producerId: number; activeOwner: boolean; children: ReactNode;
}) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const key = `${userId}:${country}:${producerId}`;
  const [result, setResult] = useState<{ key: string; state: ProducerViewerState } | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const controller = new AbortController();
    const query = new URLSearchParams({ country, producerId: String(producerId) });
    void fetch(`/api/account/producer?${query}`, {
      cache: "no-store", signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) return;
      const state: ProducerViewerState = await response.json();
      if (!controller.signal.aborted) setResult({ key, state });
    }).catch(() => undefined);
    return () => controller.abort();
  }, [isLoaded, isSignedIn, country, producerId, key]);

  // Never retain another viewer's or another producer's controls during navigation.
  const state = !isLoaded || !isSignedIn
    ? guestProducerViewerState(activeOwner)
    : result?.key === key ? result.state : null;
  return <ProducerAccountContext.Provider value={state}>{children}</ProducerAccountContext.Provider>;
}

export function ProducerAccountProvider({ enabled, ...props }: {
  enabled: boolean; country: string; producerId: number; activeOwner: boolean; children: ReactNode;
}) {
  return enabled ? <AuthenticatedProducerAccount {...props} /> : props.children;
}
