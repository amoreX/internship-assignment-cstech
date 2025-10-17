import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Agents table
export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
}).extend({
  phone: z.string().min(1, "Phone number is required"),
});

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

// List items uploaded from CSV
export const listItems = pgTable("list_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  phone: text("phone").notNull(),
  notes: text("notes"),
  agentId: varchar("agent_id").references(() => agents.id),
  distributionId: varchar("distribution_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertListItemSchema = createInsertSchema(listItems).omit({
  id: true,
  createdAt: true,
}).extend({
  agentId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  distributionId: z.string().nullable().optional(),
});

export type InsertListItem = z.infer<typeof insertListItemSchema>;
export type ListItem = typeof listItems.$inferSelect;

// Distribution records to track CSV uploads
export const distributions = pgTable("distributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  totalItems: integer("total_items").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDistributionSchema = createInsertSchema(distributions).omit({
  id: true,
  createdAt: true,
});

export type InsertDistribution = z.infer<typeof insertDistributionSchema>;
export type Distribution = typeof distributions.$inferSelect;

// CSV upload validation schema
export const csvRowSchema = z.object({
  FirstName: z.string().min(1, "First name is required"),
  Phone: z.string().min(1, "Phone is required"),
  Notes: z.string().optional().default(""),
});

export type CsvRow = z.infer<typeof csvRowSchema>;
