import { createShelfMutationHandler } from "@/lib/selection-shelf/http";
import { shelfHttpDependencies } from "@/lib/selection-shelf/http.server";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const POST = createShelfMutationHandler(shelfHttpDependencies, "upload");
export const DELETE = createShelfMutationHandler(shelfHttpDependencies, "withdraw");

export const PATCH = createShelfMutationHandler(shelfHttpDependencies, "publish");
