import {
  AnyPgColumn,
  jsonb,
  pgSchema,
  primaryKey,
  smallserial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

const AuthSchema = pgSchema("auth");

// Define tables
export const Users = AuthSchema.table(
  "users",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 100 }).unique().notNull(),
    phone: varchar({ length: 20 }).unique(),
    passwordHash: text("password_hash").default(sql`null`),
    userMetadata: jsonb("user_metadata"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).default(sql`null`),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  }),
);

export const Roles = AuthSchema.table("roles", {
  id: smallserial().primaryKey(),
  name: varchar({ length: 50 }).notNull(),
  parentRole: smallserial("parent_role").references(
    (): AnyPgColumn => Roles.id,
    { onDelete: "set null" },
  ),
});

export const Permissions = AuthSchema.table("permissions", {
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  entity: varchar({ length: 50 }).notNull(),
  action: varchar({ length: 50 }).notNull(),
  description: text(),
});

export const RolePermissions = AuthSchema.table(
  "role_permissions",
  {
    roleId: smallserial("role_id").references(() => Roles.id, {
      onDelete: "cascade",
    }),
    permissionId: uuid("permission_id").references(() => Permissions.id, {
      onDelete: "cascade",
    }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
    pkWithCustomName: primaryKey({
      name: "role_permissions_pk",
      columns: [table.roleId, table.permissionId],
    }),
  }),
);

export const UserRoles = AuthSchema.table(
  "user_roles",
  {
    userId: uuid("user_id").references(() => Users.id, { onDelete: "cascade" }),
    roleId: smallserial("role_id").references(() => Roles.id, {
      onDelete: "cascade",
    }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.roleId] }),
    pkWithCustomName: primaryKey({
      name: "user_roles_pk",
      columns: [table.userId, table.roleId],
    }),
  }),
);

// Define relationships
export const UsersRelations = relations(Users, ({ many }) => ({
  userRoles: many(UserRoles),
}));
export const UserRolesRelations = relations(UserRoles, ({ one }) => ({
  user: one(Users, {
    fields: [UserRoles.userId],
    references: [Users.id],
  }),
  role: one(Roles, {
    fields: [UserRoles.roleId],
    references: [Roles.id],
  }),
}));

export const RolesRelations = relations(Roles, ({ many }) => ({
  rolePermissions: many(RolePermissions),
}));

export const RolePermissionsRelations = relations(
  RolePermissions,
  ({ one }) => ({
    role: one(Roles, {
      fields: [RolePermissions.roleId],
      references: [Roles.id],
    }),
    permission: one(Permissions, {
      fields: [RolePermissions.permissionId],
      references: [Permissions.id],
    }),
  }),
);

export const PermissionsRelations = relations(Permissions, ({ many }) => ({
  rolePermissions: many(RolePermissions),
}));
