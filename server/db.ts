import { and, asc, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  academyCourses,
  academyLessons,
  academyMaterials,
  academyModules,
  academyMemberships,
  academyProgress,
  type InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getActiveMembership(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(academyMemberships)
    .where(
      and(
        eq(academyMemberships.userId, userId),
        or(eq(academyMemberships.status, "active"), eq(academyMemberships.status, "trial")),
        or(isNull(academyMemberships.expiresAt), gt(academyMemberships.expiresAt, new Date())),
      ),
    )
    .limit(1);
  return result[0];
}

export async function listPublishedCourses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(academyCourses).where(eq(academyCourses.isPublished, true)).orderBy(asc(academyCourses.createdAt));
}

export async function getCourseWithContent(courseId: number, userId?: number) {
  const db = await getDb();
  if (!db) return undefined;
  const course = (await db.select().from(academyCourses).where(eq(academyCourses.id, courseId)).limit(1))[0];
  if (!course) return undefined;
  const modules = await db.select().from(academyModules).where(eq(academyModules.courseId, courseId)).orderBy(asc(academyModules.sortOrder));
  const lessons = await db.select().from(academyLessons).where(eq(academyLessons.courseId, courseId)).orderBy(asc(academyLessons.sortOrder));
  const lessonIds = lessons.map(lesson => lesson.id);
  const materials = lessonIds.length
    ? await db.select().from(academyMaterials).where(inArray(academyMaterials.lessonId, lessonIds)).orderBy(asc(academyMaterials.sortOrder))
    : [];
  const progress = userId && lessonIds.length
    ? await db.select().from(academyProgress).where(and(eq(academyProgress.userId, userId), inArray(academyProgress.lessonId, lessonIds)))
    : [];
  return { course, modules, lessons, materials, progress };
}

export async function getStudentDashboard(userId: number) {
  const db = await getDb();
  if (!db) return { membership: undefined, courses: [], completedLessonIds: [] as number[] };

  const [courses, membership, progress] = await Promise.all([
    listPublishedCourses(),
    getActiveMembership(userId),
    db.select().from(academyProgress).where(eq(academyProgress.userId, userId)),
  ]);
  const courseIds = courses.map(course => course.id);
  const lessons = courseIds.length
    ? await db.select().from(academyLessons).where(inArray(academyLessons.courseId, courseIds))
    : [];
  const completedIds = new Set(progress.filter(item => item.completedAt).map(item => item.lessonId));
  const coursesWithProgress = courses.map(course => {
    const courseLessons = lessons.filter(lesson => lesson.courseId === course.id);
    const completed = courseLessons.filter(lesson => completedIds.has(lesson.id)).length;
    return {
      ...course,
      lessonCount: courseLessons.length,
      completedLessons: completed,
      progressPercent: courseLessons.length ? Math.round((completed / courseLessons.length) * 100) : 0,
    };
  });

  return { membership, courses: coursesWithProgress, completedLessonIds: Array.from(completedIds) };
}

export async function listAdminStudents() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, membershipStatus: academyMemberships.status, planName: academyMemberships.planName }).from(users).leftJoin(academyMemberships, eq(users.id, academyMemberships.userId)).orderBy(asc(users.createdAt));
}

export async function listAdminCourses() {
  const db = await getDb();
  if (!db) return [];
  const courses = await db.select().from(academyCourses).orderBy(asc(academyCourses.createdAt));
  const lessons = await db.select().from(academyLessons).orderBy(asc(academyLessons.sortOrder));
  const modules = await db.select().from(academyModules).orderBy(asc(academyModules.sortOrder));
  const materials = await db.select().from(academyMaterials).orderBy(asc(academyMaterials.sortOrder));
  return courses.map(course => ({ ...course, modules: modules.filter(module => module.courseId === course.id).map(module => ({ ...module, lessons: lessons.filter(lesson => lesson.moduleId === module.id).map(lesson => ({ ...lesson, materials: materials.filter(material => material.lessonId === lesson.id) })) })) }));
}

export async function createAcademyCourse(input: { title: string; slug: string; eyebrow?: string; description: string; level?: string; durationLabel?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(academyCourses).values({ ...input, isPublished: true });
}

export async function updateAcademyCourse(input: { id: number; title?: string; description?: string; eyebrow?: string; level?: string; durationLabel?: string; isPublished?: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const { id, ...values } = input;
  await db.update(academyCourses).set({ ...values, updatedAt: new Date() }).where(eq(academyCourses.id, id));
}

export async function createAcademyModule(input: { courseId: number; title: string; description?: string; sortOrder: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(academyModules).values(input);
}

export async function updateAcademyModule(input: { id: number; title?: string; description?: string; sortOrder?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const { id, ...values } = input;
  await db.update(academyModules).set(values).where(eq(academyModules.id, id));
}

export async function createAcademyLesson(input: { courseId: number; moduleId: number; title: string; description?: string; durationLabel?: string; sortOrder: number; isPreview?: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(academyLessons).values(input);
}

export async function updateAcademyLesson(input: { id: number; title?: string; description?: string; durationLabel?: string; sortOrder?: number; isPreview?: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const { id, ...values } = input;
  await db.update(academyLessons).set({ ...values, updatedAt: new Date() }).where(eq(academyLessons.id, id));
}

export async function createAcademyMaterial(input: { lessonId: number; title: string; description?: string; materialType: "pdf" | "checklist" | "template" | "link"; url: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(academyMaterials).values(input);
}

export async function activateMembership(userId: number, planName = "Academy Samia Lima") {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(academyMemberships).values({ userId, status: "active", planName }).onDuplicateKeyUpdate({ set: { status: "active", planName, updatedAt: new Date() } });
}

export async function markLessonComplete(userId: number, lessonId: number, completed: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(academyProgress).values({ userId, lessonId, completedAt: completed ? new Date() : null }).onDuplicateKeyUpdate({
    set: { completedAt: completed ? new Date() : null, updatedAt: new Date() },
  });
}
