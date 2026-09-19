import { z } from "zod";

// Shared by browser-facing references and server-side approved content.
export const contentItemIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80);
