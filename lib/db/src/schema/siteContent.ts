import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const siteContentTable = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SiteContent = typeof siteContentTable.$inferSelect;
