import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  activateMembership,
  createAcademyCourse,
  createAcademyLesson,
  createAcademyMaterial,
  createAcademyModule,
  getActiveMembership,
  updateAcademyLesson,
  updateAcademyModule,
  updateAcademyCourse,
  getCourseWithContent,
  getAdminAcademyStats,
  getStudentDashboard,
  listPublishedCourses,
  listAdminCourses,
  listAdminStudents,
  markLessonComplete,
  saveLessonFeedback,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  academy: router({
    catalog: publicProcedure.query(() => listPublishedCourses()),
    membership: protectedProcedure.query(({ ctx }) => getActiveMembership(ctx.user.id)),
    dashboard: protectedProcedure.query(({ ctx }) => getStudentDashboard(ctx.user.id)),
    course: protectedProcedure
      .input(z.object({ courseId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const membership = await getActiveMembership(ctx.user.id);
        if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "Uma assinatura ativa é necessária para acessar este curso." });
        return getCourseWithContent(input.courseId, ctx.user.id);
      }),
    markLessonComplete: protectedProcedure
      .input(z.object({ lessonId: z.number().int().positive(), completed: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        const membership = await getActiveMembership(ctx.user.id);
        if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "Uma assinatura ativa é necessária para atualizar o progresso." });
        await markLessonComplete(ctx.user.id, input.lessonId, input.completed);
        return { success: true } as const;
      }),
    submitFeedback: protectedProcedure
      .input(z.object({ lessonId: z.number().int().positive(), rating: z.number().int().min(1).max(5), comment: z.string().max(1000).optional() }))
      .mutation(async ({ ctx, input }) => {
        const membership = await getActiveMembership(ctx.user.id);
        if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "Uma assinatura ativa é necessária para enviar feedback." });
        await saveLessonFeedback(ctx.user.id, input.lessonId, input.rating, input.comment);
        return { success: true } as const;
      }),
    adminOverview: adminProcedure.query(async () => ({ ready: true, stats: await getAdminAcademyStats(), students: await listAdminStudents(), courses: await listAdminCourses() })),
    adminActivateMembership: adminProcedure
      .input(z.object({ userId: z.number().int().positive(), planName: z.string().min(2).max(120).optional() }))
      .mutation(async ({ input }) => {
        await activateMembership(input.userId, input.planName);
        return { success: true } as const;
      }),
    adminCreateCourse: adminProcedure
      .input(z.object({ title: z.string().min(2).max(180), slug: z.string().min(2).max(180).regex(/^[a-z0-9-]+$/), eyebrow: z.string().max(120).optional(), description: z.string().min(10), level: z.string().max(80).optional(), durationLabel: z.string().max(80).optional() }))
      .mutation(async ({ input }) => { await createAcademyCourse(input); return { success: true } as const; }),
    adminUpdateCourse: adminProcedure
      .input(z.object({ id: z.number().int().positive(), title: z.string().min(2).max(180).optional(), description: z.string().min(10).optional(), eyebrow: z.string().max(120).optional(), level: z.string().max(80).optional(), durationLabel: z.string().max(80).optional(), isPublished: z.boolean().optional() }))
      .mutation(async ({ input }) => { await updateAcademyCourse(input); return { success: true } as const; }),
    adminCreateModule: adminProcedure
      .input(z.object({ courseId: z.number().int().positive(), title: z.string().min(2).max(180), description: z.string().max(500).optional(), sortOrder: z.number().int().min(1) }))
      .mutation(async ({ input }) => { await createAcademyModule(input); return { success: true } as const; }),
    adminUpdateModule: adminProcedure
      .input(z.object({ id: z.number().int().positive(), title: z.string().min(2).max(180).optional(), description: z.string().max(500).optional(), sortOrder: z.number().int().min(1).optional() }))
      .mutation(async ({ input }) => { await updateAcademyModule(input); return { success: true } as const; }),
    adminCreateLesson: adminProcedure
      .input(z.object({ courseId: z.number().int().positive(), moduleId: z.number().int().positive(), title: z.string().min(2).max(180), description: z.string().max(500).optional(), durationLabel: z.string().max(80).optional(), sortOrder: z.number().int().min(1), isPreview: z.boolean().optional() }))
      .mutation(async ({ input }) => { await createAcademyLesson(input); return { success: true } as const; }),
    adminUpdateLesson: adminProcedure
      .input(z.object({ id: z.number().int().positive(), title: z.string().min(2).max(180).optional(), description: z.string().max(500).optional(), durationLabel: z.string().max(80).optional(), sortOrder: z.number().int().min(1).optional(), isPreview: z.boolean().optional() }))
      .mutation(async ({ input }) => { await updateAcademyLesson(input); return { success: true } as const; }),
    adminCreateMaterial: adminProcedure
      .input(z.object({ lessonId: z.number().int().positive(), title: z.string().min(2).max(180), description: z.string().max(500).optional(), materialType: z.enum(["pdf", "checklist", "template", "link"]), url: z.string().url() }))
      .mutation(async ({ input }) => {
        await createAcademyMaterial(input);
        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
