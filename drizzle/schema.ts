import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const academyMemberships = mysqlTable(
  "academy_memberships",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    status: mysqlEnum("status", ["active", "trial", "paused", "cancelled"]).default("active").notNull(),
    planName: varchar("planName", { length: 120 }).default("Academy Samia Lima").notNull(),
    startedAt: timestamp("startedAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({ userStatusIdx: uniqueIndex("academy_memberships_user_status_idx").on(table.userId, table.status) }),
);

export type AcademyMembership = typeof academyMemberships.$inferSelect;
export type InsertAcademyMembership = typeof academyMemberships.$inferInsert;

export const academyCourses = mysqlTable("academy_courses", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  eyebrow: varchar("eyebrow", { length: 120 }),
  description: text("description").notNull(),
  coverUrl: text("coverUrl"),
  level: varchar("level", { length: 80 }).default("Essencial").notNull(),
  durationLabel: varchar("durationLabel", { length: 80 }).default("Conteúdo sob demanda").notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AcademyCourse = typeof academyCourses.$inferSelect;
export type InsertAcademyCourse = typeof academyCourses.$inferInsert;

export const academyModules = mysqlTable("academy_modules", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ courseOrderIdx: uniqueIndex("academy_modules_course_order_idx").on(table.courseId, table.sortOrder) }));

export type AcademyModule = typeof academyModules.$inferSelect;
export type InsertAcademyModule = typeof academyModules.$inferInsert;

export const academyLessons = mysqlTable(
  "academy_lessons",
  {
    id: int("id").autoincrement().primaryKey(),
    courseId: int("courseId").notNull(),
    moduleId: int("moduleId").notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    description: text("description"),
    videoUrl: text("videoUrl"),
    durationLabel: varchar("durationLabel", { length: 80 }),
    sortOrder: int("sortOrder").default(0).notNull(),
    isPreview: boolean("isPreview").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({ courseOrderIdx: uniqueIndex("academy_lessons_course_order_idx").on(table.courseId, table.sortOrder) }),
);

export type AcademyLesson = typeof academyLessons.$inferSelect;
export type InsertAcademyLesson = typeof academyLessons.$inferInsert;

export const academyMaterials = mysqlTable("academy_materials", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lessonId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  materialType: mysqlEnum("materialType", ["pdf", "checklist", "template", "link"]).default("pdf").notNull(),
  url: text("url"),
  storageKey: text("storageKey"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AcademyMaterial = typeof academyMaterials.$inferSelect;
export type InsertAcademyMaterial = typeof academyMaterials.$inferInsert;

export const academyProgress = mysqlTable(
  "academy_progress",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    lessonId: int("lessonId").notNull(),
    completedAt: timestamp("completedAt"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({ userLessonIdx: uniqueIndex("academy_progress_user_lesson_idx").on(table.userId, table.lessonId) }),
);

export type AcademyProgress = typeof academyProgress.$inferSelect;
export type InsertAcademyProgress = typeof academyProgress.$inferInsert;

export const academyFeedback = mysqlTable(
  "academy_feedback",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    lessonId: int("lessonId").notNull(),
    rating: int("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({ userLessonIdx: uniqueIndex("academy_feedback_user_lesson_idx").on(table.userId, table.lessonId) }),
);
export type AcademyFeedback = typeof academyFeedback.$inferSelect;
export type InsertAcademyFeedback = typeof academyFeedback.$inferInsert;
