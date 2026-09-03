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

import type { Locale } from "@/lib/i18n/locales";

export type LanguageMenuOption = {
  locale: Locale;
  label: string;
  href: string;
};

export type LanguageMenuConfig = {
  currentLocale: Locale;
  label: string;
  options: LanguageMenuOption[];
};

type LanguageMenuContextValue = LanguageMenuConfig & {
  register: (menu: LanguageMenuConfig) => void;
};

const LanguageMenuContext = createContext<LanguageMenuContextValue | null>(null);

export function SiteLanguageMenuProvider({
  children,
  initialMenu,
}: {
  children: ReactNode;
  initialMenu: LanguageMenuConfig;
}) {
  const [menu, setMenu] = useState(initialMenu);
  const register = useCallback((nextMenu: LanguageMenuConfig) => {
    setMenu(nextMenu);
  }, []);
  const value = useMemo(() => ({ ...menu, register }), [menu, register]);

  return (
    <LanguageMenuContext.Provider value={value}>
      {children}
    </LanguageMenuContext.Provider>
  );
}

export function useLanguageMenu() {
  const menu = useContext(LanguageMenuContext);
  if (!menu) {
    throw new Error("useLanguageMenu must be used within SiteLanguageMenuProvider.");
  }
  return menu;
}

export function useRegisterLanguageMenu(menu: LanguageMenuConfig) {
  const { register } = useLanguageMenu();
  const { currentLocale, label, options } = menu;

  useEffect(() => {
    register({ currentLocale, label, options });
  }, [currentLocale, label, options, register]);
}
