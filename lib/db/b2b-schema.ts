import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  jsonb,
  integer,
  bigint,
  timestamp,
  primaryKey,
  index,
  check,
} from "drizzle-orm/pg-core";
import { users } from "./schema";
import type {
  BusinessTerms,
  BusinessOffer,
  RequestedProduct,
} from "../b2b/policy";
const time = (name: string) =>
  timestamp(name, { withTimezone: true, mode: "date" });
export const businessProfiles = pgTable(
  "business_profiles",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => users.id),
    businessName: varchar("business_name", { length: 160 }).notNull(),
    activity: varchar("activity", { length: 30 }).notNull(),
    enabled: boolean("enabled").notNull().default(false),
    updatedAt: time("updated_at").notNull().defaultNow(),
  },
  (table) => [
    check(
      "business_profiles_activity_check",
      sql`${table.activity} in ('restaurante','hosteleria','tienda','distribucion','otro')`,
    ),
  ],
);
export const businessProductTerms = pgTable(
  "business_product_terms",
  {
    country: varchar("country", { length: 2 }).notNull(),
    producerId: bigint("producer_id", { mode: "number" }).notNull(),
    productId: varchar("product_id", { length: 80 }).notNull(),
    terms: jsonb("terms").$type<BusinessTerms>().notNull(),
    version: integer("version").notNull().default(1),
    updatedBy: uuid("updated_by")
      .notNull()
      .references(() => users.id),
    updatedAt: time("updated_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.country, table.producerId, table.productId] }),
    check(
      "business_product_terms_identity_check",
      sql`${table.country} ~ '^[a-z]{2}$' and ${table.producerId} > 0 and ${table.version} > 0`,
    ),
    check(
      "business_product_terms_json_check",
      sql`jsonb_typeof(${table.terms}) = 'object'`,
    ),
  ],
);
export const businessEnquiries = pgTable(
  "business_enquiries",
  {
    id: uuid("id").primaryKey(),
    requesterId: uuid("requester_id")
      .notNull()
      .references(() => users.id),
    country: varchar("country", { length: 2 }).notNull(),
    producerId: bigint("producer_id", { mode: "number" }).notNull(),
    business: jsonb("business")
      .$type<{ businessName: string; activity: string }>()
      .notNull(),
    products: jsonb("products").$type<RequestedProduct[]>().notNull(),
    frequency: varchar("frequency", { length: 120 }).notNull(),
    deliveryLocation: varchar("delivery_location", { length: 240 }).notNull(),
    message: text("message").notNull(),
    status: varchar("status", { length: 10 }).notNull().default("open"),
    createdAt: time("created_at").notNull().defaultNow(),
    updatedAt: time("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("business_enquiries_buyer_idx").on(
      table.requesterId,
      table.updatedAt,
    ),
    index("business_enquiries_supplier_idx").on(
      table.country,
      table.producerId,
      table.updatedAt,
    ),
    check(
      "business_enquiries_status_check",
      sql`${table.status} in ('open','closed')`,
    ),
    check(
      "business_enquiries_identity_check",
      sql`${table.country} ~ '^[a-z]{2}$' and ${table.producerId} > 0`,
    ),
    check(
      "business_enquiries_products_check",
      sql`jsonb_typeof(${table.products}) = 'array' and jsonb_array_length(${table.products}) between 1 and 10`,
    ),
    check(
      "business_enquiries_message_check",
      sql`length(${table.message}) between 1 and 2000`,
    ),
  ],
);
export const businessMessages = pgTable(
  "business_messages",
  {
    id: uuid("id").primaryKey(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => businessEnquiries.id),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),
    side: varchar("side", { length: 10 }).notNull(),
    body: text("body").notNull(),
    offer: jsonb("offer").$type<BusinessOffer>(),
    createdAt: time("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("business_messages_enquiry_idx").on(table.enquiryId, table.createdAt),
    check(
      "business_messages_side_check",
      sql`${table.side} in ('buyer','supplier')`,
    ),
    check(
      "business_messages_offer_check",
      sql`${table.offer} is null or (${table.side} = 'supplier' and jsonb_typeof(${table.offer}) = 'object')`,
    ),
    check(
      "business_messages_body_check",
      sql`length(${table.body}) between 1 and 2000`,
    ),
  ],
);
