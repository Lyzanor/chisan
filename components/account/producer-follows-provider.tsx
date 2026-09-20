"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getProducerFollowsAction, updateProducerFollowAction } from "@/app/(application)/cuenta/actions/favorites";
import { ProducerFollowsContext, guestFollows as guest, type FollowState } from "./producer-follows-context";

function SignedInFollows({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<FollowState & { userId?: string | null }>({ status: "loading", keys: [] });
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set());
  const inFlight = useRef(new Set<string>());
  const currentUser = useRef(userId);
  const revision = useRef(0);

  useEffect(() => {
    currentUser.current = userId;
    if (!isLoaded || !isSignedIn) return;
    let active = true;
    const requestedRevision = revision.current;
    void getProducerFollowsAction().then((result) => {
      if (active && revision.current === requestedRevision) setState({ ...result, userId });
    }).catch(() => {
      if (active && revision.current === requestedRevision) setState({ status: "unavailable", keys: [], userId });
    });
    return () => { active = false; };
  }, [isLoaded, isSignedIn, userId, pathname]);

  const visibleState: FollowState = !isLoaded ? guest
    : !isSignedIn ? guest : state.userId === userId ? state : { status: "loading", keys: [] };

  async function setFollowing(country: string, producerId: number, following: boolean) {
    const key = `${country}:${producerId}`;
    if (!isSignedIn) return "guest" as const;
    if (inFlight.current.has(key)) return "error" as const;
    inFlight.current.add(key);
    revision.current += 1;
    setPending(new Set(inFlight.current));
    const requestUser = userId;
    try {
      const result = await updateProducerFollowAction({ country, producerId, following });
      if (currentUser.current !== requestUser) return "error" as const;
      if (result === "saved") {
        setState((previous) => ({ ...previous, status: "ready", keys: following
          ? [...new Set([...previous.keys, key])] : previous.keys.filter((value) => value !== key) }));
        router.refresh();
      }
      return result;
    } catch {
      return "error" as const;
    } finally {
      inFlight.current.delete(key);
      setPending(new Set(inFlight.current));
    }
  }

  return <ProducerFollowsContext.Provider value={{ ...visibleState, pending, setFollowing }}>{children}</ProducerFollowsContext.Provider>;
}

export function ProducerFollowsProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  return enabled ? <SignedInFollows>{children}</SignedInFollows> : children;
}
