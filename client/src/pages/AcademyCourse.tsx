import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Check, FileText, LockKeyhole, PlayCircle, Sparkles } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function AcademyCourse() {
  const { user, loading } = useAuth();
  const [, params] = useRoute("/academy/course/:id");
  const courseId = Number(params?.id);
  const courseQuery = trpc.academy.course.useQuery({ courseId }, { enabled: Boolean(user && courseId) });
  const progressMutation = trpc.academy.markLessonComplete.useMutation({ onSuccess: () => courseQuery.refetch() });

  if (loading) return <CourseShell><div className="academy-loading">Carregando conteúdo...</div></CourseShell>;
  if (!user) return <CourseShell><section className="academy-gate"><div className="academy-gate-mark"><LockKeyhole size={18} /></div><p className="academy-kicker">Conteúdo exclusivo</p><h1>Entre para continuar seus estudos.</h1><p>Faça login para acessar as aulas e os materiais desta trilha.</p><button className="academy-primary-button" type="button" onClick={() => startLogin()}>Entrar na Academy</button></section></CourseShell>;
  if (courseQuery.isLoading) return <CourseShell><div className="academy-loading">Abrindo sua trilha...</div></CourseShell>;
  if (courseQuery.isError || !courseQuery.data) return <CourseShell><section className="academy-gate"><p className="academy-kicker">Acesso restrito</p><h1>Este conteúdo não está disponível.</h1><p>Verifique sua assinatura ou retorne para a área de cursos.</p><Link href="/academy" className="academy-primary-button">Voltar para Academy <ArrowLeft size={16} /></Link></section></CourseShell>;

  const { course, modules, lessons, materials, progress } = courseQuery.data;
  const completedIds = new Set(progress.filter(item => item.completedAt).map(item => item.lessonId));
  return (
    <CourseShell>
      <Link href="/academy" className="academy-back-link academy-course-back"><ArrowLeft size={15} /> Voltar para sua Academy</Link>
      <section className="academy-course-hero">
        <div><p className="academy-kicker">{course.eyebrow ?? "Formação Samia Lima"}</p><h1>{course.title}</h1><p>{course.description}</p><div className="academy-course-meta"><span>{course.level}</span><span>{course.durationLabel}</span><span>{lessons.length} aulas</span></div></div>
        <div className="academy-course-hero-mark"><Sparkles size={24} /><span>Estudo<br />com método</span></div>
      </section>
      <section className="academy-lesson-layout">
        <div className="academy-lesson-list">
          <div className="academy-section-heading"><div><p className="academy-kicker">Conteúdo da trilha</p><h2>Assista e pratique.</h2></div><span>{completedIds.size} de {lessons.length} concluídas</span></div>
          {modules.map(module => (
            <div className="academy-module-group" key={module.id}>
              <div className="academy-module-heading"><span>Módulo {String(module.sortOrder).padStart(2, "0")}</span><h3>{module.title}</h3>{module.description ? <p>{module.description}</p> : null}</div>
              {lessons.filter(lesson => lesson.moduleId === module.id).map((lesson, index) => {
                const lessonMaterials = materials.filter(material => material.lessonId === lesson.id);
                const completed = completedIds.has(lesson.id);
                return <article className={`academy-lesson-row ${completed ? "is-complete" : ""}`} key={lesson.id}><div className="academy-lesson-index">{String(index + 1).padStart(2, "0")}</div><div className="academy-lesson-icon"><PlayCircle size={18} /></div><div className="academy-lesson-copy"><h3>{lesson.title}</h3><p>{lesson.description ?? "Aula exclusiva da Academy Samia Lima."}</p><span>{lesson.durationLabel ?? "Aula sob demanda"}</span>{lessonMaterials.length ? <div className="academy-material-list">{lessonMaterials.map(material => <a href={material.url ?? "#"} key={material.id} target={material.url ? "_blank" : undefined} rel="noreferrer"><FileText size={14} /> {material.title}{!material.url ? " · disponível em breve" : ""}</a>)}</div> : null}</div><button type="button" className="academy-complete-button" onClick={() => progressMutation.mutate({ lessonId: lesson.id, completed: !completed })} disabled={progressMutation.isPending}><Check size={16} /> {completed ? "Concluída" : "Concluir"}</button></article>;
              })}
            </div>
          ))}
        </div>
      </section>
    </CourseShell>
  );
}

function CourseShell({ children }: { children: React.ReactNode }) {
  return <div className="academy-shell"><header className="academy-header"><Link href="/" className="academy-brand"><span className="academy-brand-mark">SL</span><span><strong>Samia Lima</strong><em>Academy</em></span></Link><Link href="/academy" className="academy-header-link">Minha área</Link></header><main className="academy-main">{children}</main><footer className="academy-footer"><span>Academy Samia Lima</span><span>Conteúdo exclusivo para assinantes</span></footer></div>;
}
