import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const checkoutIntentsTable = pgTable("checkout_intents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  productName: text("product_name"),
  currency: text("currency"),
  estimatedPriceRange: text("estimated_price_range"),
  paymentMode: text("payment_mode"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertCheckoutIntentSchema = createInsertSchema(
  checkoutIntentsTable,
).omit({ id: true, status: true, createdAt: true });
export type InsertCheckoutIntent = z.infer<typeof insertCheckoutIntentSchema>;
export type CheckoutIntent = typeof checkoutIntentsTable.$inferSelect;
