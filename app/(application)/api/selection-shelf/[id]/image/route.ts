import { createShelfImageHandler } from "@/lib/selection-shelf/http";
import { shelfHttpDependencies } from "@/lib/selection-shelf/http.server";
export const dynamic = "force-dynamic";
export const GET = createShelfImageHandler(shelfHttpDependencies);
