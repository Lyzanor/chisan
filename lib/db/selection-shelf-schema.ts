import type { StoredEventRequest } from "../selection-shelf/event-request";
import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, text, integer, jsonb, timestamp, customType, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import { users, accountSelections } from "./schema";
import type { ShelfPoint, ShelfDetection, ShelfInput } from "../selection-shelf/policy";

const time = (name: string) => timestamp(name, { withTimezone: true, mode: "date" });
const imageBytes = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "bytea",
  toDriver: (value) => value,
  fromDriver: (value) => Buffer.isBuffer(value) ? value : Buffer.from(value),
});

// Account-owned presentation. These records cannot change catalog producer facts.
export const selectionShelves = pgTable("selection_shelves", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  selectionId: uuid("selection_id").references(() => accountSelections.id, { onDelete: "cascade" }),
  eventRequest: jsonb("event_request").$type<StoredEventRequest>(),
  input: jsonb("input").$type<ShelfInput>().notNull().default({ kind: "auto", instruction: "", title: "Mi selección" }),
  channel: varchar("channel", { length: 32 }).notNull(),
  messageId: varchar("message_id", { length: 256 }).unique(),
  sha256: varchar("sha256", { length: 64 }).notNull(),
  bytes: imageBytes("bytes").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  status: varchar("status", { length: 16 }).notNull().default("queued"),
  version: integer("version").notNull().default(1),
  suggestions: jsonb("suggestions").$type<ShelfDetection>().notNull().default({ points: [] }),
  points: jsonb("points").$type<ShelfPoint[]>().notNull().default([]),
  analysisError: varchar("analysis_error", { length: 40 }),
  analysisStartedAt: time("analysis_started_at"),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: time("reviewed_at"),
  note: text("note").notNull().default(""),
  rightsConfirmedAt: time("rights_confirmed_at").notNull().defaultNow(),
  createdAt: time("created_at").notNull().defaultNow(),
  updatedAt: time("updated_at").notNull().defaultNow(),
}, (table) => [
  uniqueIndex("selection_shelves_published_idx").on(table.userId).where(sql`${table.status} = 'published' and ${table.selectionId} is null`),
  uniqueIndex("selection_shelves_pending_idx").on(table.userId).where(sql`${table.status} in ('received','queued','processing','review','ready') and ${table.selectionId} is null`),
  uniqueIndex("selection_shelves_selection_published_idx").on(table.selectionId).where(sql`${table.status} = 'published'`),
  uniqueIndex("selection_shelves_selection_pending_idx").on(table.selectionId).where(sql`${table.status} in ('received','queued','processing','review','ready')`),
  index("selection_shelves_selection_id_idx").on(table.selectionId),
  index("selection_shelves_queue_idx").on(table.status, table.createdAt),
  check("selection_shelves_status_check", sql`${table.status} in ('received','queued','processing','review','ready','published','rejected','superseded')`),
  check("selection_shelves_channel_check", sql`${table.channel} ~ '^[a-z][a-z0-9_-]{0,31}$'`),
  check("selection_shelves_version_check", sql`${table.version} > 0`),
  check("selection_shelves_image_check", sql`${table.width} between 200 and 2400 and ${table.height} between 200 and 2400 and octet_length(${table.bytes}) between 1 and 1572864 and ${table.sha256} = encode(sha256(${table.bytes}), 'hex')`),
  check("selection_shelves_points_check", sql`jsonb_typeof(${table.points}) = 'array' and jsonb_array_length(${table.points}) <= 80`),
  check("selection_shelves_review_check", sql`${table.status} <> 'published' or (${table.reviewedBy} is not null and ${table.reviewedAt} is not null and jsonb_array_length(${table.points}) > 0)`),
]);

export const selectionShelfWhatsAppLinks = pgTable("selection_shelf_whatsapp_links", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  instruction: varchar("instruction", { length: 600 }).notNull().default(""),
  sender: varchar("sender", { length: 15 }).unique(),
  tokenHash: varchar("token_hash", { length: 64 }).unique(),
  tokenExpiresAt: time("token_expires_at"),
  expiresAt: time("expires_at").notNull(),
  rightsConfirmedAt: time("rights_confirmed_at").notNull().defaultNow(),
}, (table) => [check("selection_shelf_whatsapp_sender_check", sql`${table.sender} is null or ${table.sender} ~ '^[1-9][0-9]{6,14}$'`)]);
