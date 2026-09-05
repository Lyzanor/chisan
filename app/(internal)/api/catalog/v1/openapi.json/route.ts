import { catalogOptions, catalogResponse } from "@/lib/agents/catalog-http";
import { catalogOpenApi } from "@/lib/agents/openapi";

export const runtime = "nodejs";
export function GET(request: Request) { return catalogResponse(request, catalogOpenApi, true); }
export const OPTIONS = catalogOptions;
