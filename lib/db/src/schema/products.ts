import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  latexType: text("latex_type"),
  latexContent: text("latex_content"),
  tag: text("tag"),
  badge: text("badge"),
  headline: text("headline"),
  shortDesc: text("short_desc"),
  description: text("description"),
  highlights: jsonb("highlights").$type<string[]>().default([]),
  specs: jsonb("specs").$type<Record<string, string>>().default({}),
  sizes: jsonb("sizes").$type<string[]>().default([]),
  useCases: jsonb("use_cases").$type<string[]>().default([]),
  heroImage: text("hero_image"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  priceINR: text("price_inr"),
  priceUSD: text("price_usd"),
  priceNote: text("price_note"),
  deliveryNote: text("delivery_note"),
  variants: jsonb("variants").$type<Array<{label:string;sku?:string;priceINR:string;priceUSD:string}>>().default([]),
  visible: boolean("visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
