import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  whatsapp: text("whatsapp"),
  city: text("city"),
  customerType: text("customer_type"),
  interestCategory: text("interest_category"),
  subscriptionType: text("subscription_type"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(
  subscriptionsTable,
).omit({ id: true, createdAt: true }) as any;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptionsTable.$inferSelect;
