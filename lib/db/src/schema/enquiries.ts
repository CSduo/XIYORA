import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  company: text("company"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  customerType: text("customer_type"),
  productName: text("product_name"),
  productSlug: text("product_slug"),
  selectedSize: text("selected_size"),
  quantity: text("quantity"),
  message: text("message"),
  inquiryType: text("inquiry_type"),
  intentLabel: text("intent_label"),
  estimatedPort: text("estimated_port"),
  estimatedPriceRange: text("estimated_price_range"),
  currency: text("currency"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertEnquirySchema = createInsertSchema(enquiriesTable).omit({
  id: true,
  status: true,
  createdAt: true,
});
export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type Enquiry = typeof enquiriesTable.$inferSelect;
