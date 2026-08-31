"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AreaSelectorCountry,
  AreaSelectorMessages,
} from "@/components/area-selector";

export type SiteCatalogControls = {
  country: AreaSelectorCountry;
  currentArea: string;
  messages: AreaSelectorMessages;
};

type SiteCatalogControlsContextValue = {
  controls: SiteCatalogControls | null;
  register: (controls: SiteCatalogControls | null) => void;
};

const SiteCatalogControlsContext =
  createContext<SiteCatalogControlsContextValue | null>(null);

export function SiteCatalogControlsProvider({ children }: { children: ReactNode }) {
  const [controls, setControls] = useState<SiteCatalogControls | null>(null);
  const register = useCallback((nextControls: SiteCatalogControls | null) => {
    setControls(nextControls);
  }, []);
  const value = useMemo(() => ({ controls, register }), [controls, register]);

  return (
    <SiteCatalogControlsContext.Provider value={value}>
      {children}
    </SiteCatalogControlsContext.Provider>
  );
}

export function SiteCatalogControlsRegistration({
  country,
  currentArea,
  messages,
}: SiteCatalogControls) {
  const register = useContext(SiteCatalogControlsContext)?.register;

  useEffect(() => {
    register?.({ country, currentArea, messages });
    return () => register?.(null);
  }, [country, currentArea, messages, register]);

  return null;
}

export function useSiteCatalogControls(): SiteCatalogControls | null {
  return useContext(SiteCatalogControlsContext)?.controls ?? null;
}
