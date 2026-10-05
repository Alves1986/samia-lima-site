import { describe, expect, it, vi } from "vitest";

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    updateAcademyModule: vi.fn().mockResolvedValue(undefined),
    updateAcademyLesson: vi.fn().mockResolvedValue(undefined),
    saveLessonFeedback: vi.fn().mockResolvedValue(undefined),
    getAdminAcademyStats: vi.fn().mockResolvedValue({ activeSubscriptions: 3, totalStudents: 8, averageProgress: 42, completedLessons: 12, totalFeedback: 5, averageRating: 4.8 }),
    listAdminStudents: vi.fn().mockResolvedValue([]),
    listAdminCourses: vi.fn().mockResolvedValue([]),
  };
});
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(user: TrpcContext["user"] = null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("academy router", () => {
  it("exposes a public catalog without requiring authentication", async () => {
    const caller = appRouter.createCaller(createContext());
    const catalog = await caller.academy.catalog();
    expect(Array.isArray(catalog)).toBe(true);
  });

  it("blocks the admin panel for regular users", async () => {
    const caller = appRouter.createCaller(
      createContext({
        id: 7,
        openId: "regular-user",
        name: "Regular User",
        email: "user@example.com",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }),
    );

    await expect(caller.academy.adminOverview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("blocks catalog editing mutations for regular users", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 7, openId: "regular-user", name: "Regular User", email: "user@example.com", loginMethod: "manus", role: "user",
      createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    }));

    await expect(caller.academy.adminUpdateModule({ id: 1, title: "Novo módulo" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.academy.adminUpdateLesson({ id: 1, title: "Nova aula" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows administrators to edit modules and lessons", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 1, openId: "admin-user", name: "Admin", email: "admin@example.com", loginMethod: "manus", role: "admin",
      createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    }));

    await expect(caller.academy.adminUpdateModule({ id: 3, title: "Módulo revisado", description: "Descrição revisada", sortOrder: 2 })).resolves.toEqual({ success: true });
    await expect(caller.academy.adminUpdateLesson({ id: 5, title: "Aula revisada", description: "Descrição revisada", sortOrder: 3 })).resolves.toEqual({ success: true });
  });

  it("blocks course content without an active membership", async () => {
    const caller = appRouter.createCaller(
      createContext({
        id: 42,
        openId: "academy-student",
        name: "Academy Student",
        email: "student@example.com",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }),
    );

    await expect(caller.academy.course({ courseId: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("blocks lesson feedback without an active membership", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 42, openId: "academy-student", name: "Academy Student", email: "student@example.com", loginMethod: "manus", role: "user",
      createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    }));
    await expect(caller.academy.submitFeedback({ lessonId: 1, rating: 5, comment: "Excelente aula." })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("validates feedback rating between one and five stars", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 42, openId: "academy-student", name: "Academy Student", email: "student@example.com", loginMethod: "manus", role: "user",
      createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    }));
    await expect(caller.academy.submitFeedback({ lessonId: 1, rating: 6 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("exposes aggregate academy stats to administrators", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 1, openId: "admin-user", name: "Admin", email: "admin@example.com", loginMethod: "manus", role: "admin",
      createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    }));
    const overview = await caller.academy.adminOverview();
    expect(overview.stats).toMatchObject({ activeSubscriptions: 3, averageProgress: 42, averageRating: 4.8 });
  });
});
