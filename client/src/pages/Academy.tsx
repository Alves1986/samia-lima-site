import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, LockKeyhole, LogOut, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Academy() {
  const { user, loading, logout } = useAuth();
  const catalog = trpc.academy.catalog.useQuery();
  const dashboard = trpc.academy.dashboard.useQuery(undefined, { enabled: Boolean(user) });

  if (loading) return <AcademyShell><div className="academy-loading">Preparando sua Academy...</div></AcademyShell>;

  if (!user) {
    return (
      <AcademyShell>
        <section className="academy-gate">
          <div className="academy-gate-mark"><Sparkles size={18} /></div>
          <p className="academy-kicker">Academy Samia Lima</p>
          <h1>Conhecimento para transformar sua prática.</h1>
          <p>Entre na sua área de membros para acessar cursos, aulas e materiais exclusivos para profissionais.</p>
          <button className="academy-primary-button" type="button" onClick={() => startLogin()}>Entrar na Academy <ArrowRight size={16} /></button>
          <Link href="/" className="academy-back-link">Voltar para o site principal</Link>
        </section>
      </AcademyShell>
    );
  }

  const membership = dashboard.data?.membership;
  const hasMembership = Boolean(membership);
  const courses = dashboard.data?.courses ?? catalog.data ?? [];

  return (
    <AcademyShell userName={user.name ?? "Aluno"} isAdmin={user.role === "admin"} onLogout={logout}>
      <section className="academy-welcome">
        <div>
          <p className="academy-kicker">Área do aluno</p>
          <h1>Olá, {user.name?.split(" ")[0] ?? "aluno"}.</h1>
          <p>Seu espaço de estudo para aprofundar o olhar, organizar protocolos e levar mais segurança para cada atendimento.</p>
        </div>
        <div className={`academy-membership-badge ${hasMembership ? "is-active" : "is-locked"}`}>
          {hasMembership ? <CheckCircle2 size={16} /> : <LockKeyhole size={16} />}
          <span>{hasMembership ? "Assinatura ativa" : "Acesso pendente"}</span>
        </div>
      </section>

      {!hasMembership ? (
        <section className="academy-subscription-card">
          <div>
            <p className="academy-kicker">Próximo passo</p>
            <h2>Ative seu acesso aos conteúdos completos.</h2>
            <p>Seu login está pronto. A assinatura da Academy libera aulas, materiais e acompanhamento do progresso.</p>
          </div>
          <a className="academy-primary-button" href="mailto:academy@samialima.com.br?subject=Assinatura%20Academy">Quero ser assinante <ArrowRight size={16} /></a>
        </section>
      ) : null}

      <section className="academy-section-heading">
        <div><p className="academy-kicker">Trilhas disponíveis</p><h2>Aprenda no seu ritmo.</h2></div>
        <span>{courses.length} cursos</span>
      </section>

      <div className="academy-course-grid">
        {courses.map(course => {
          const courseRecord = course as Record<string, unknown>;
          const hasProgress = typeof courseRecord.progressPercent === "number";
          return (
            <article className="academy-course-card" key={course.id}>
              <div className="academy-course-cover" style={course.coverUrl ? { backgroundImage: `url(${course.coverUrl})` } : undefined}>
                <span>{course.eyebrow ?? "Formação Samia Lima"}</span><BookOpen size={24} />
              </div>
              <div className="academy-course-body">
                <div className="academy-course-meta"><span>{course.level}</span><span>{course.durationLabel}</span></div>
                <h3>{course.title}</h3><p>{course.description}</p>
                {hasProgress ? (
                  <div className="academy-progress-wrap">
                    <div className="academy-progress-label"><span>{Number(courseRecord.completedLessons)} de {Number(courseRecord.lessonCount)} aulas</span><strong>{Number(courseRecord.progressPercent)}%</strong></div>
                    <div className="academy-progress-track"><span style={{ width: `${Number(courseRecord.progressPercent)}%` }} /></div>
                  </div>
                ) : null}
                {hasMembership ? <Link href={`/academy/course/${course.id}`} className="academy-course-link">Acessar curso <ArrowRight size={15} /></Link> : <span className="academy-locked-link"><LockKeyhole size={14} /> Conteúdo exclusivo</span>}
              </div>
            </article>
          );
        })}
      </div>

      {!catalog.isLoading && courses.length === 0 ? <div className="academy-empty-state"><Sparkles size={18} /><p>Os primeiros conteúdos estão sendo preparados. Em breve, sua trilha aparecerá aqui.</p></div> : null}
    </AcademyShell>
  );
}

function AcademyShell({ children, userName, isAdmin, onLogout }: { children: React.ReactNode; userName?: string; isAdmin?: boolean; onLogout?: () => void }) {
  return (
    <div className="academy-shell">
      <header className="academy-header">
        <Link href="/" className="academy-brand"><span className="academy-brand-mark">SL</span><span><strong>Samia Lima</strong><em>Academy</em></span></Link>
        <nav className="academy-header-nav"><Link href="/">Site principal</Link>{isAdmin ? <Link href="/academy/admin">Gestão</Link> : null}{userName ? <span className="academy-user">{userName}</span> : null}{onLogout ? <button type="button" onClick={onLogout} aria-label="Sair"><LogOut size={16} /></button> : null}</nav>
      </header>
      <main className="academy-main">{children}</main>
      <footer className="academy-footer"><span>Academy Samia Lima</span><span><Clock3 size={13} /> Conteúdo sob demanda</span></footer>
    </div>
  );
}
