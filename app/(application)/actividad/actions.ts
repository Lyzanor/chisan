"use server";

import { getCurrentAccount } from "@/lib/accounts/auth";
import {
  getEditorialFeaturedProducers,
  getFollowedProducers,
  type ActivityFeaturedProducer,
  type ActivityFollowedProducer,
} from "@/lib/activity/data";

export async function getAreaHighlightsAction(
  country: string,
  area: string,
): Promise<ActivityFeaturedProducer[]> {
  try {
    return await getEditorialFeaturedProducers(country, area, 4);
  } catch (error) {
    console.error("Error in getAreaHighlightsAction:", error);
    return [];
  }
}

export async function getFollowedProducersAction(): Promise<
  ActivityFollowedProducer[]
> {
  try {
    const account = await getCurrentAccount();
    if (!account) return [];
    return await getFollowedProducers(account.id);
  } catch (error) {
    console.error("Error in getFollowedProducersAction:", error);
    return [];
  }
}
