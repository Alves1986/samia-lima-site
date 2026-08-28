/*
 * Direção visual desta página: Clínica Editorial — luxo silencioso, autoridade acolhedora,
 * composição assimétrica, grafite + off-white quente + dourado mineral #B9965A.
 */
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CirclePlay,
  Instagram,
  Menu,
  MessageCircle,
  MoveRight,
  Quote,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

const services = [
  {
    index: "01",
    title: "Avaliação capilar completa",
    text: "Uma leitura cuidadosa do couro cabeludo e da fibra para entender o ponto de partida do seu cabelo.",
    tag: "Diagnóstico",
  },
  {
    index: "02",
    title: "Protocolo de recuperação",
    text: "Estratégias personalizadas para devolver força, equilíbrio e brilho a fios que perderam vitalidade.",
    tag: "Performance",
  },
  {
    index: "03",
    title: "Tratamento para queda",
    text: "Acompanhamento técnico para investigar causas, organizar rotinas e construir uma evolução consistente.",
    tag: "Cuidado contínuo",
  },
  {
    index: "04",
    title: "Reconstrução de fios",
    text: "Um plano preciso para cabelos danificados por química, calor, tração ou excesso de procedimentos.",
    tag: "Reparação",
  },
];

const faqs = [
  {
    question: "Como funciona a primeira avaliação?",
    answer:
      "Começamos por uma conversa detalhada sobre sua rotina, histórico e objetivos. Em seguida, observamos couro cabeludo e fibra para construir uma recomendação coerente — sem indicar um protocolo antes de entender o seu momento.",
  },
  {
    question: "A terapia capilar é indicada para qualquer tipo de cabelo?",
    answer:
      "Sim. O método parte das necessidades reais do couro cabeludo e dos fios, respeitando textura, curvatura, histórico químico e rotina de cada pessoa.",
  },
  {
    question: "Onde acontecem os atendimentos?",
    answer:
      "Os atendimentos presenciais acontecem em Telêmaco Borba, no Paraná. O endereço e a disponibilidade são confirmados no contato de agendamento.",
  },
  {
    question: "Também existem cursos para profissionais?",
    answer:
      "Sim. A frente educacional reúne capacitações online e presenciais para profissionais que desejam aprofundar seu repertório em terapia capilar com mais método e segurança.",
  },
];

const methodPoints = [
  "Diagnóstico antes da indicação",
  "Protocolos pensados para a rotina real",
  "Acompanhamento de evolução",
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function SectionKicker({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div className={`section-kicker ${light ? "section-kicker-light" : ""}`}>
      <span className="section-kicker-line" />
      <span>{children}</span>
    </div>
  );
}

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a href="#inicio" aria-label="Samia Lima — início" className="brand-lockup">
      <img
        src="/manus-storage/samia-monogram_d09d732a.png"
        alt=""
        className={`brand-symbol ${light ? "brand-symbol-light" : ""}`}
      />
      <span className="brand-type">
        <strong>SAMIA</strong>
        <em>LIMA</em>
      </span>
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Formulário preparado para integração", {
      description: "Conecte o seu canal de atendimento para começar a receber os contatos.",
    });
  };

  return (
    <div className="site-shell" id="inicio">
      <header className={`site-header ${scrolled ? "site-header-scrolled" : ""}`}>
        <div className="header-inner">
          <BrandMark />
          <nav className="desktop-nav" aria-label="Navegação principal">
            <a href="#sobre">Sobre</a>
            <a href="#terapia">Terapia capilar</a>
            <a href="#capacitacao">Capacitação</a>
            <a href="#contato">Contato</a>
          </nav>
          <button
            className="header-cta"
            type="button"
            onClick={() => scrollToId("contato")}
          >
            <span>Agendar avaliação</span>
            <ArrowUpRight size={15} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            className="menu-trigger"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div className={`mobile-nav ${menuOpen ? "mobile-nav-open" : ""}`}>
          <a href="#sobre" onClick={closeMenu}>Sobre</a>
          <a href="#terapia" onClick={closeMenu}>Terapia capilar</a>
          <a href="#capacitacao" onClick={closeMenu}>Capacitação</a>
          <a href="#contato" onClick={closeMenu}>Contato</a>
          <button type="button" onClick={() => { closeMenu(); scrollToId("contato"); }}>
            Agendar avaliação <ArrowUpRight size={16} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-image-wrap">
            <img
              src="/manus-storage/samia-hero_b71c9837.png"
              alt="Sâmia Lima em retrato editorial, com cabelos longos e saudáveis"
              className="hero-image"
            />
          </div>
          <div className="hero-overlay" />
          <div className="hero-grain" />
          <div className="hero-content page-width">
            <SectionKicker light>Especialista em terapia capilar avançada</SectionKicker>
            <h1 id="hero-title" className="hero-title">
              Recuperação capilar <i>de alta performance.</i>
            </h1>
            <p className="hero-description">
              Um método preciso para transformar a relação com o seu cabelo —
              com ciência, sensibilidade e acompanhamento de verdade.
            </p>
            <div className="hero-actions">
              <button type="button" className="button button-gold" onClick={() => scrollToId("contato")}>
                Agendar avaliação <ArrowUpRight size={17} strokeWidth={1.8} />
              </button>
              <button type="button" className="button button-ghost-light" onClick={() => scrollToId("capacitacao")}>
                Quero me capacitar <MoveRight size={17} strokeWidth={1.8} />
              </button>
            </div>
          </div>
          <div className="hero-foot page-width">
            <span className="hero-location">Telêmaco Borba · Paraná</span>
            <button type="button" className="hero-scroll" onClick={() => scrollToId("sobre")}>
              <span>Explorar o método</span>
              <ArrowDownRight size={18} strokeWidth={1.4} />
            </button>
          </div>
        </section>

        <section className="proof-section page-width" aria-label="Credenciais e alcance">
          <div className="proof-intro">
            <SectionKicker>Uma especialista. Dois caminhos de transformação.</SectionKicker>
            <p>
              Cuidado para quem quer recuperar a saúde dos fios. Conhecimento
              para quem quer elevar a própria prática.
            </p>
          </div>
          <div className="proof-stats">
            <div className="proof-stat">
              <strong>5<span>k</span></strong>
              <span>profissionais capacitados<br />em todo o Brasil</span>
            </div>
            <div className="proof-stat">
              <strong>01</strong>
              <span>embaixadora oficial<br />Hactoon Professional</span>
            </div>
            <div className="proof-stat">
              <strong>∞</strong>
              <span>cuidado que continua<br />depois da sessão</span>
            </div>
          </div>
        </section>

        <section className="about-section section-pad" id="sobre">
          <div className="page-width about-grid">
            <div className="about-image-column">
              <div className="image-frame image-frame-tall">
                <img
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85"
                  alt="Sâmia Lima avaliando cuidadosamente o cabelo de uma cliente"
                  loading="lazy"
                />
                <span className="image-caption">Método Samia Lima · 01</span>
              </div>
              <div className="about-stamp">
                <Sparkles size={15} strokeWidth={1.4} />
                <span>Ciência<br />com cuidado</span>
              </div>
            </div>
            <div className="about-copy">
              <SectionKicker>Sobre Sâmia Lima</SectionKicker>
              <h2 className="section-title">Cuidar do cabelo é também <i>entender a pessoa.</i></h2>
              <p className="lead-copy">
                Sâmia Lima une a precisão da terapia capilar a um olhar atento
                para a vida real. Porque resultado consistente não nasce de uma
                receita pronta — nasce de um diagnóstico bem feito e de escolhas
                que você consegue sustentar.
              </p>
              <p>
                Especialista em terapia capilar avançada e embaixadora oficial
                Hactoon Professional, Sâmia já compartilhou seu método com mais
                de 5 mil profissionais em todo o Brasil.
              </p>
              <a className="text-link" href="#capacitacao">
                Conheça a trajetória <ArrowUpRight size={16} strokeWidth={1.5} />
              </a>
              <div className="about-signature">Sâmia Lima<span>terapia capilar & educação</span></div>
            </div>
          </div>
        </section>

        <section className="services-section section-pad" id="terapia">
          <div className="page-width">
            <div className="section-heading-row">
              <div>
                <SectionKicker>Para o seu cabelo</SectionKicker>
                <h2 className="section-title">O seu cabelo tem uma história.<br /><i>O tratamento também.</i></h2>
              </div>
              <p className="section-aside-copy">
                Protocolos individuais para diferentes momentos do couro cabeludo
                e da fibra. Tudo começa com uma avaliação cuidadosa.
              </p>
            </div>
            <div className="services-list">
              {services.map((service) => (
                <article className="service-row" key={service.index}>
                  <span className="service-index">{service.index}</span>
                  <div className="service-name-wrap">
                    <span className="service-tag">{service.tag}</span>
                    <h3>{service.title}</h3>
                  </div>
                  <p>{service.text}</p>
                  <button type="button" aria-label={`Saiba mais sobre ${service.title}`} onClick={() => scrollToId("contato")}>
                    <ArrowUpRight size={20} strokeWidth={1.4} />
                  </button>
                </article>
              ))}
            </div>
            <div className="services-footer">
              <span>Sem protocolo pronto. Sem promessa vazia.</span>
              <button type="button" className="button button-dark" onClick={() => scrollToId("contato")}>
                Encontrar meu caminho <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <section className="method-section section-pad-dark" id="metodo">
          <div className="page-width method-grid">
            <div className="method-copy">
              <SectionKicker light>O método</SectionKicker>
              <h2 className="section-title light-title">Menos tentativa.<br /><i>Mais leitura.</i></h2>
              <p>
                O Método Samia Lima organiza o cuidado capilar em etapas claras:
                observar, compreender, tratar e acompanhar. O resultado é uma
                relação mais segura com o próprio cabelo.
              </p>
              <ul className="method-list">
                {methodPoints.map((point) => (
                  <li key={point}><span><Check size={13} /></span>{point}</li>
                ))}
              </ul>
              <button type="button" className="button button-outline-light" onClick={() => scrollToId("contato")}>
                Agendar uma conversa <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="method-image-column">
              <div className="method-image-main">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85" alt="Ambiente de atendimento da clínica Samia Lima" loading="lazy" />
                <span className="image-caption image-caption-dark">O espaço também cuida · 02</span>
              </div>
              <div className="method-note">
                <Quote size={22} strokeWidth={1.2} />
                <p>“Começamos pela raiz: pelo que o seu cabelo está tentando dizer.”</p>
              </div>
            </div>
          </div>
        </section>

        <section className="education-section section-pad" id="capacitacao">
          <div className="page-width education-grid">
            <div className="education-image-wrap">
              <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85" alt="Sâmia Lima ensinando um grupo de profissionais" loading="lazy" />
              <div className="education-image-label">
                <span>Hactoon Professional</span>
                <small>Embaixadora oficial</small>
              </div>
            </div>
            <div className="education-copy">
              <SectionKicker>Para profissionais</SectionKicker>
              <h2 className="section-title">Conhecimento que sai da sala e <i>muda a prática.</i></h2>
              <p className="lead-copy">
                Capacitações para profissionais que querem sair do improviso,
                interpretar melhor cada caso e conduzir seus clientes com mais
                segurança.
              </p>
              <div className="education-metrics">
                <div><strong>Online</strong><span>Conteúdo no seu ritmo</span></div>
                <div><strong>Presencial</strong><span>Imersão com acompanhamento</span></div>
                <div><strong>+5 mil</strong><span>profissionais alcançados</span></div>
              </div>
              <button type="button" className="button button-dark" onClick={() => toast.info("A agenda de próximas turmas será conectada em breve.")}>
                Ver próximas turmas <ArrowUpRight size={16} />
              </button>
              <div className="education-note">
                <CirclePlay size={17} strokeWidth={1.4} />
                <span>Uma introdução à forma de ensinar de Sâmia</span>
              </div>
            </div>
          </div>
        </section>

        <section className="journal-section section-pad-small">
          <div className="page-width journal-grid">
            <div className="journal-heading">
              <SectionKicker>Notas de cuidado</SectionKicker>
              <h2 className="section-title">Conhecimento para levar <i>com você.</i></h2>
            </div>
            <a className="journal-card journal-card-feature" href="#contato">
              <div className="journal-card-image journal-card-image-one" />
              <div className="journal-card-content">
                <span>01 · Rotina</span>
                <h3>O que seu couro cabeludo tenta contar antes da queda?</h3>
                <span className="journal-read">Ler nota <ArrowUpRight size={16} /></span>
              </div>
            </a>
            <a className="journal-card" href="#contato">
              <div className="journal-card-image journal-card-image-two" />
              <div className="journal-card-content">
                <span>02 · Fibra</span>
                <h3>Reconstrução não é uma corrida. É uma leitura.</h3>
                <span className="journal-read">Ler nota <ArrowUpRight size={16} /></span>
              </div>
            </a>
          </div>
        </section>

        <section className="faq-section section-pad" id="faq">
          <div className="page-width faq-grid">
            <div>
              <SectionKicker>Perguntas frequentes</SectionKicker>
              <h2 className="section-title">Antes de começar,<br /><i>vamos conversar.</i></h2>
              <p className="faq-intro">As respostas mais importantes para chegar à sua avaliação com tranquilidade.</p>
              <a href="#contato" className="text-link">Ainda ficou com uma dúvida? <ArrowUpRight size={16} /></a>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div className={`faq-item ${isOpen ? "faq-item-open" : ""}`} key={faq.question}>
                    <button type="button" className="faq-question" onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen}>
                      <span>{faq.question}</span>
                      <ChevronDown size={18} strokeWidth={1.5} />
                    </button>
                    <div className="faq-answer"><p>{faq.answer}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contato">
          <div className="contact-texture" />
          <div className="page-width contact-grid">
            <div className="contact-copy">
              <SectionKicker light>O próximo passo</SectionKicker>
              <h2 className="contact-title">Seu cabelo não precisa de mais uma tentativa. <i>Precisa de um método.</i></h2>
              <p>Conte um pouco sobre o seu momento. A gente começa por aí.</p>
              <div className="contact-details">
                <span>Atendimento em Telêmaco Borba · PR</span>
                <span>Segunda a sexta · horário sob consulta</span>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                <span>Seu nome</span>
                <input name="name" type="text" placeholder="Como podemos chamar você?" required />
              </label>
              <label>
                <span>Seu melhor e-mail</span>
                <input name="email" type="email" placeholder="voce@email.com" required />
              </label>
              <label>
                <span>Eu quero</span>
                <select name="interest" defaultValue="avaliacao">
                  <option value="avaliacao">Agendar uma avaliação</option>
                  <option value="curso">Saber sobre capacitações</option>
                  <option value="parceria">Falar sobre uma parceria</option>
                </select>
              </label>
              <button className="button button-gold button-submit" type="submit">Enviar interesse <ArrowUpRight size={17} /></button>
              <small>Ao enviar, você demonstra interesse em falar com a equipe Samia Lima.</small>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-top">
          <BrandMark light />
          <p>terapia capilar & educação<br />para escolhas mais conscientes.</p>
          <div className="footer-links">
            <a href="#sobre">Sobre</a>
            <a href="#terapia">Terapia capilar</a>
            <a href="#capacitacao">Capacitação</a>
            <a href="#contato">Contato</a>
          </div>
          <a href="#inicio" className="back-top">Voltar ao início <ArrowUpRight size={16} /></a>
        </div>
        <div className="page-width footer-bottom">
          <span>© 2026 Samia Lima. Todos os direitos reservados.</span>
          <span>Feito com intenção.</span>
          <a href="#contato" aria-label="Instagram Samia Lima"><Instagram size={16} strokeWidth={1.4} /></a>
        </div>
      </footer>

      <button type="button" className="whatsapp-float" onClick={() => scrollToId("contato")} aria-label="Falar com a equipe Samia Lima">
        <MessageCircle size={21} strokeWidth={1.7} />
        <span>Fale com a gente</span>
      </button>
    </div>
  );
}
