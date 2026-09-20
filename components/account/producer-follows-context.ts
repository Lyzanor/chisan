"use client";

import { createContext, useContext } from "react";

export type FollowState = { status: "loading" | "guest" | "ready" | "unavailable"; keys: string[] };
export type FollowContext = FollowState & {
  pending: ReadonlySet<string>;
  setFollowing: (country: string, producerId: number, following: boolean) => Promise<"saved" | "guest" | "error">;
};
export const guestFollows: FollowContext = { status: "guest", keys: [], pending: new Set(), setFollowing: async () => "guest" };
export const ProducerFollowsContext = createContext<FollowContext>(guestFollows);
export function useProducerFollows() { return useContext(ProducerFollowsContext); }
