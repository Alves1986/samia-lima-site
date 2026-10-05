import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Check, FileText, LockKeyhole, PlayCircle, Send, Sparkles, Star, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";

export default function AcademyCourse() {
  const { user, loading } = useAuth();
  const [, params] = useRoute("/academy/course/:id");
  const courseId = Number(params?.id);
  const courseQuery = trpc.academy.course.useQuery({ courseId }, { enabled: Boolean(user && courseId) });
  const progressMutation = trpc.academy.markLessonComplete.useMutation({ onSuccess: () => courseQuery.refetch() });
  const feedbackMutation = trpc.academy.submitFeedback.useMutation({ onSuccess: () => courseQuery.refetch() });
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  useEffect(() => { if (courseQuery.data?.lessons[0] && activeLesson === null) setActiveLesson(courseQuery.data.lessons[0].id); }, [courseQuery.data, activeLesson]);
  if (loading) return <CourseShell><LoadingState label="Carregando conteúdo..." /></CourseShell>;
  if (!user) return <CourseShell><section className="academy-gate"><div className="academy-gate-mark"><LockKeyhole size={18} /></div><p className="academy-kicker">Conteúdo exclusivo</p><h1>Entre para continuar seus estudos.</h1><p>Faça login para acessar as aulas e os materiais desta trilha.</p><button className="academy-primary-button" type="button" onClick={() => startLogin()}>Entrar na Academy</button></section></CourseShell>;
  if (courseQuery.isLoading) return <CourseShell><LoadingState label="Abrindo sua trilha..." /></CourseShell>;
  if (courseQuery.isError || !courseQuery.data) return <CourseShell><section className="academy-gate"><p className="academy-kicker">Acesso restrito</p><h1>Este conteúdo não está disponível.</h1><p>Verifique sua assinatura ou retorne para a área de cursos.</p><Link href="/academy" className="academy-primary-button">Voltar para Academy <ArrowLeft size={16} /></Link></section></CourseShell>;
  const { course, modules, lessons, materials, progress, feedback } = courseQuery.data;
  const completedIds = new Set(progress.filter(item => item.completedAt).map(item => item.lessonId));
  const selectedLesson = lessons.find(lesson => lesson.id === activeLesson) ?? lessons[0];
  const selectedFeedback = feedback.find(item => item.lessonId === selectedLesson?.id);
  return <CourseShell>
    <Link href="/academy" className="academy-back-link academy-course-back"><ArrowLeft size={15} /> Voltar para sua Academy</Link>
    <section className="academy-course-hero"><div><p className="academy-kicker">{course.eyebrow ?? "Formação Samia Lima"}</p><h1>{course.title}</h1><p>{course.description}</p><div className="academy-course-meta"><span>{course.level}</span><span>{course.durationLabel}</span><span>{lessons.length} aulas</span></div></div><div className="academy-course-hero-mark"><Sparkles size={24} /><span>Estudo<br />com método</span></div></section>
    <section className="academy-lesson-layout">
      <div className="academy-lesson-list"><div className="academy-section-heading"><div><p className="academy-kicker">Conteúdo da trilha</p><h2>Assista e pratique.</h2></div><span>{completedIds.size} de {lessons.length} concluídas</span></div>
        {modules.map(module => <div className="academy-module-group" key={module.id}><div className="academy-module-heading"><span>Módulo {String(module.sortOrder).padStart(2, "0")}</span><h3>{module.title}</h3>{module.description ? <p>{module.description}</p> : null}</div>{lessons.filter(lesson => lesson.moduleId === module.id).map((lesson, index) => { const lessonMaterials = materials.filter(material => material.lessonId === lesson.id); const completed = completedIds.has(lesson.id); const selected = selectedLesson?.id === lesson.id; return <article className={`academy-lesson-row ${completed ? "is-complete" : ""} ${selected ? "is-selected" : ""}`} key={lesson.id} onClick={() => setActiveLesson(lesson.id)}><div className="academy-lesson-index">{String(index + 1).padStart(2, "0")}</div><div className="academy-lesson-icon"><PlayCircle size={18} /></div><div className="academy-lesson-copy"><h3>{lesson.title}</h3><p>{lesson.description ?? "Aula exclusiva da Academy Samia Lima."}</p><span>{lesson.durationLabel ?? "Aula sob demanda"}</span>{lessonMaterials.length ? <div className="academy-material-list">{lessonMaterials.map(material => <a href={material.url ?? "#"} key={material.id} target={material.url ? "_blank" : undefined} rel="noreferrer" onClick={e => e.stopPropagation()}><FileText size={14} /> {material.title}{!material.url ? " · disponível em breve" : ""}</a>)}</div> : null}</div><button type="button" className="academy-complete-button" onClick={e => { e.stopPropagation(); progressMutation.mutate({ lessonId: lesson.id, completed: !completed }); }} disabled={progressMutation.isPending}><Check size={16} /> {completed ? "Concluída" : "Concluir"}</button></article>; })}</div>)}
      </div>
      {selectedLesson ? <LessonFeedback lessonId={selectedLesson.id} lessonTitle={selectedLesson.title} initialRating={selectedFeedback?.rating ?? 0} initialComment={selectedFeedback?.comment ?? ""} mutation={feedbackMutation} /> : null}
    </section>
  </CourseShell>;
}
function LessonFeedback({ lessonId, lessonTitle, initialRating, initialComment, mutation }: { lessonId: number; lessonTitle: string; initialRating: number; initialComment: string; mutation: ReturnType<typeof trpc.academy.submitFeedback.useMutation> }) { const [rating, setRating] = useState(initialRating); const [comment, setComment] = useState(initialComment); useEffect(() => { setRating(initialRating); setComment(initialComment); }, [initialRating, initialComment, lessonId]); return <aside className="academy-feedback-card"><p className="academy-kicker">Seu retorno</p><h2>Como foi esta aula?</h2><p className="academy-feedback-lesson">{lessonTitle}</p><div className="academy-stars" aria-label="Avalie de 1 a 5 estrelas">{[1,2,3,4,5].map(value => <button key={value} type="button" aria-label={`${value} estrelas`} className={value <= rating ? "is-rated" : ""} onClick={() => setRating(value)}><Star size={22} fill="currentColor" /></button>)}</div><textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="O que você leva desta aula para sua prática?" maxLength={1000} /><button className="academy-primary-button" type="button" onClick={() => mutation.mutate({ lessonId, rating, comment })} disabled={!rating || mutation.isPending}>{mutation.isPending ? <><Loader2 size={15} className="academy-spin" /> Enviando...</> : <>Salvar feedback <Send size={15} /></>}</button>{mutation.isSuccess ? <span className="academy-feedback-success">Feedback salvo com carinho.</span> : null}</aside>; }
function LoadingState({ label }: { label: string }) { return <div className="academy-loading"><Loader2 size={18} className="academy-spin" /> {label}</div>; }
function CourseShell({ children }: { children: React.ReactNode }) { return <div className="academy-shell"><header className="academy-header"><Link href="/" className="academy-brand"><span className="academy-brand-mark">SL</span><span><strong>Samia Lima</strong><em>Academy</em></span></Link><Link href="/academy" className="academy-header-link">Minha área</Link></header><main className="academy-main">{children}</main><footer className="academy-footer"><span>Academy Samia Lima</span><span>Conteúdo exclusivo para assinantes</span></footer></div>; }
