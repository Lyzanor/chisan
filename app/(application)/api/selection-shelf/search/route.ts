import { createShelfMutationHandler } from "@/lib/selection-shelf/http";
import { shelfHttpDependencies } from "@/lib/selection-shelf/http.server";
export const POST = createShelfMutationHandler(shelfHttpDependencies, "search");
