"use server";

import {
  getEditorialFeaturedProducers,
  type ActivityFeaturedProducer,
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
