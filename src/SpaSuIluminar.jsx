import { useEffect, useRef, useState } from "react";
import escaldaPesImage from "./imagens_site/Escaldapes_e_sais.png";
import rolosAromaticosImage from "./imagens_site/Foto_3_rollons.png";
import saisBanhoImage from "./imagens_site/Sais_de_banho_Adocar.png";
import heroImage from "./imagens_site/Oque voceprecisacuidarhoje.jpg";
import corpoImage from "./imagens_site/Ocorpofala.png";
import menteImage from "./imagens_site/aMentePedeUmaPausa.jpeg";
import almaImage from "./imagens_site/Aalmabuscacaminhos.png";

/* ============================================================
   SpaSu Iluminar — Landing page (v2, estilo da referência)
   1) Troque WHATSAPP pelo número (DDI+DDD+número, só dígitos)
   2) Imagens: preencha o objeto IMAGES. Vazio = espaço reservado.
   ============================================================ */
const WHATSAPP = "555194102121";
const wa = (m = "Olá! Conheci o SpaSu Iluminar pelo site e gostaria de saber mais sobre os atendimentos.") =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(m)}`;

const IMAGES = {
  hero: heroImage, // foto principal do espaço
  corpo: corpoImage, mente: menteImage, alma: almaImage, // seção corpo, mente e alma
  ritual: "", // opcional: fundo do Ritual
};

const C = { luz: "#FAF7F2", areia: "#E7DFD0", salvia: "#D8E2D3", agua: "#C7DDE1", lavanda: "#E3DDF1", ouro: "#F2D79B", pedra: "#BDB7AD" };

const NEEDS = [
  { id: "corpo", bg: C.salvia, tag: "Sinto no corpo", q: "Sinto dores, tensões ou cansaço", d: "Para quem precisa desacelerar e aliviar o peso que o corpo carrega.", msg: "Seu corpo vem falando há um tempo. Que tal ouvi-lo agora?", to: "#corpo", tab: "Massagens" },
  { id: "mente", bg: C.agua, tag: "Carrego na mente", q: "Minha rotina está intensa demais", d: "Para quem tem muitas responsabilidades e sente dificuldade de parar.", msg: "Nem tudo precisa ser resolvido hoje. Existe um lugar para respirar.", to: "#mente", tab: "Experiências de pausa" },
  { id: "alma", bg: C.lavanda, tag: "Busco clareza", q: "Estou cheia de dúvidas", d: "Para quem vive mudanças ou quer olhar os próprios caminhos com mais atenção.", msg: "Às vezes basta outra perspectiva para o caminho ficar mais nítido.", to: "#alma", tab: "Tarô" },
  { id: "ritual", bg: C.ouro, tag: "Ritual Iluminar", q: "Quero uma experiência completa", d: "Tarô e massagem juntos: clareza para a alma, acolhimento para o corpo.", msg: "Primeiro olhar para dentro. Depois, simplesmente descansar.", to: "#ritual", tab: null },
];

const SERVICES = {
  Massagens: [
    ["Healing Massage", "Massagem terapêutica", "Massagem terapêutica para dores, tensões, contraturas e sobrecarga muscular.", "R$ 167,00", "Até 1h30"],
    ["Sopro de Alma", "Massagem relaxante", "Massagem relaxante com aromaterapia e óleos essenciais.", "R$ 157,00", "Até 1h30"],
  ],
  Tarô: [
    ["Caminhos de Luz", "Leitura completa", "Leitura completa para refletir sobre diferentes áreas da vida.", "R$ 117,00", "Até 1 hora"],
    ["Foco & Luz", "Leitura direcionada", "Leitura direcionada para um campo específico.", "R$ 97,00", "Até 30 minutos"],
    ["Pontos de Luz", "Resposta em áudio", "Até 3 perguntas objetivas respondidas em áudio com as cartas.", "R$ 77,00", "Em áudio"],
    ["Uma Luz no Caminho", "Resposta em áudio", "Uma pergunta objetiva respondida em áudio com as cartas.", "R$ 37,00", "Em áudio"],
  ],
  "Experiências de pausa": [
    ["Escalda-pés", "Alívio para pernas e pés", "Um momento de cuidado para aliviar o cansaço das pernas e dos pés.", "R$ 90,00", "40 minutos"],
    ["Head Spa Simples", "Cabeça, pescoço e ombros", "Terapia capilar e massagem na cabeça, pescoço e ombros.", "R$ 187,00", "Aprox. 1 hora"],
    ["Head Spa Completo", "Experiência completa", "Terapia capilar, massagem, revitalização facial e escalda-pés.", "R$ 197,00", "Aprox. 1h30"],
    ["Terapia Capilar", "Couro cabeludo", "Cuidado do couro cabeludo com massagem craniana.", "R$ 117,00", ""],
    ["Revitalização Facial", "Cuidado para o rosto", "Uma experiência de cuidado e renovação para o rosto.", "R$ 107,00", "50 min a 1 hora"],
  ],
};
const TAB_TONE = { Massagens: C.salvia, Tarô: C.lavanda, "Experiências de pausa": C.agua };

const PRODUCTS = [
  { name: "Escalda-pés Alma Leve", items: [["", "R$ 18,00"]], tone: C.agua, image: escaldaPesImage },
  { name: "Sais de Banho", items: [["Adoçar", "R$ 19,00"], ["Renovo", "R$ 19,00"], ["Purificar", "R$ 19,00"]], tone: C.salvia, image: saisBanhoImage },
  { name: "Roll-ons Aromáticos", items: [["Serenar", "R$ 47,00"], ["Manifestar", "R$ 67,00"], ["Adoçar", "R$ 77,00"]], tone: C.lavanda, image: rolosAromaticosImage },
];

/* ---------- utilitários ---------- */
function Reveal({ kind = "up", delay = 0, className = "", children, ...p }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (el.classList.add("in"), io.disconnect()), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv rv-${kind} ${className}`} style={{ transitionDelay: `${delay}ms`, ...p.style }}>{children}</div>;
}
function Photo({ src, label, shape = "frame", className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const on = () => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--py", `${((r.top + r.height / 2 - innerHeight / 2) / innerHeight) * -26}px`);
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <div ref={ref} className={`photo ${shape} ${className}`}>
      {src ? <img src={src} alt={label} loading="lazy" /> : <span className="ph">Sua imagem aqui<small>{label}</small></span>}
    </div>
  );
}
const Btn = ({ href, children, ghost }) => (
  <a className={`btn ${ghost ? "ghost" : ""}`} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"><span>{children}</span></a>
);
const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

/* ---------- seções ---------- */
function Nav() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const on = () => setS(scrollY > 20);
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={`nav ${s ? "stuck" : ""}`}>
      <a href="#inicio" className="logo"><span className="sun">✺</span> SpaSu <em>Iluminar</em></a>
      <div className="links">
        <a href="#momento">Meu momento</a><a href="#corpo">Corpo, mente e alma</a><a href="#ritual">Ritual</a><a href="#servicos">Serviços</a><a href="#produtos">Produtos</a>
      </div>
      <a className="pill" href={wa()} target="_blank" rel="noreferrer">Agendar pelo WhatsApp</a>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-txt">
        <p className="eyebrow">Acolhimento & bem-estar</p>
        <h1>O que você precisa <em>cuidar</em> hoje?</h1>
        <p className="lead">Às vezes o corpo pede descanso. Às vezes, a mente pede silêncio. E, em alguns momentos, a alma só precisa de um pouco mais de clareza.</p>
        <div className="row">
          <Btn href="#momento">Descobrir meu momento</Btn>
          <span className="note"><i>✺</i> Um espaço para iluminar corpo e alma.</span>
        </div>
      </div>
      <div className="hero-media">
        <div className="frame-back" />
        <Photo src={IMAGES.hero} label="Foto principal do espaço" />
        <div className="float-tag">Corpo · Mente · Alma<small>SpaSu Iluminar</small></div>
      </div>
    </section>
  );
}

function Needs() {
  const [open, setOpen] = useState(null);
  return (
    <section className="needs wave-top" id="momento">
      <Reveal className="head center-t">
        <p className="eyebrow">Encontre o seu caminho</p>
        <h2 className="grad">O que você precisa hoje?</h2>
        <p className="lead mid">Cada momento pede um tipo de cuidado. Escolha o que mais combina com o que você está sentindo.</p>
      </Reveal>
      <div className="needs-grid">
        {NEEDS.map((n, i) => (
          <Reveal key={n.id} kind="flip" delay={i * 130} className="need-wrap">
            <a href={n.to} className={`need ${open === n.id ? "open" : ""}`} style={{ "--c": n.bg }} onMouseMove={spot}
              onMouseEnter={() => setOpen(n.id)} onMouseLeave={() => setOpen(null)} onFocus={() => setOpen(n.id)} onBlur={() => setOpen(null)}
              onClick={() => n.tab && window.dispatchEvent(new CustomEvent("pick-tab", { detail: n.tab }))}>
              <span className="need-glow" />
              <span className="need-tag">{n.tag}</span>
              <strong>“{n.q}”</strong>
              <span className="need-d">{n.d}</span>
              <span className="need-msg">{n.msg}</span>
              <span className="need-link">Conhecer a experiência <b>→</b></span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Trio() {
  const B = [
    { id: "corpo", tone: C.salvia, t: "O corpo fala", h: "Dores, tensões e cansaço podem ser sinais de que está na hora de parar.", p: "Massagens terapêuticas e relaxantes para aliviar o peso que o corpo carrega.", q: "Um momento para aliviar tensões, respirar e voltar a sentir o corpo com mais presença.", cta: "Conhecer os cuidados para o corpo", tab: "Massagens", img: IMAGES.corpo, shape: "arch" },
    { id: "mente", tone: C.agua, t: "A mente pede pausa", h: "Quando tudo acontece ao mesmo tempo, encontrar um momento para si também é uma forma de cuidado.", p: "Massagens relaxantes, Head Spa e escalda-pés: experiências feitas para desacelerar.", q: "Desacelerar não é parar a vida. É encontrar espaço para continuar com mais leveza.", cta: "Encontrar minha pausa", tab: "Experiências de pausa", img: IMAGES.mente, shape: "blob" },
    { id: "alma", tone: C.lavanda, t: "A alma busca caminhos", h: "Nem todas as respostas estão prontas. Às vezes, precisamos apenas olhar para a situação por outra perspectiva.", p: "O Tarô como espaço de reflexão e autoconhecimento, e não como previsão do futuro.", q: "Uma leitura para refletir, compreender o momento e enxergar novas possibilidades.", cta: "Explorar os caminhos", tab: "Tarô", img: IMAGES.alma, shape: "oval" },
  ];
  return (
    <>
      {B.map((b, i) => (
        <section key={b.id} id={b.id} className={`moment wave-top ${i % 2 ? "flip" : ""}`} style={{ "--tone": b.tone }}>
          <Reveal kind={i % 2 ? "right" : "left"} className="moment-img">
            <span className="halo" />
            <Photo src={b.img} label={b.t} shape={b.shape} />
          </Reveal>
          <div className="moment-txt">
            <Reveal><h2 className="grad">{b.t}</h2></Reveal>
            <Reveal delay={110}><p className="big">{b.h}</p></Reveal>
            <Reveal delay={200}><p className="muted">{b.p}</p></Reveal>
            <Reveal delay={290}><blockquote>“{b.q}”</blockquote></Reveal>
            <Reveal delay={380}>
              <a className="btn ghost" href="#servicos" onClick={() => window.dispatchEvent(new CustomEvent("pick-tab", { detail: b.tab }))}><span>{b.cta}</span></a>
            </Reveal>
          </div>
        </section>
      ))}
    </>
  );
}

function Ritual() {
  const ref = useRef(null);
  const [massage, setMassage] = useState("relaxante");
  useEffect(() => {
    const el = ref.current;
    const on = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, ((innerHeight - r.top) / (innerHeight + r.height * 0.2)) * 1.4 - 0.2));
      el.style.setProperty("--p", p.toFixed(3));
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  const price = massage === "relaxante" ? "R$ 197,00" : "R$ 209,00";
  return (
    <section ref={ref} className="ritual wave-top" id="ritual" style={{ "--rbg": IMAGES.ritual ? `url(${IMAGES.ritual})` : "none" }}>
      <Reveal className="center-t">
        <p className="eyebrow">O grande diferencial</p>
        <h2 className="grad huge">Ritual Iluminar</h2>
        <p className="tag-line">Clareza para a alma. Acolhimento para o corpo.</p>
      </Reveal>
      <div className="merge" aria-hidden>
        <div className="disc d-alma"><span>Alma<small>Tarô · 30 min</small></span></div>
        <div className="disc d-corpo"><span>Corpo<small>Massagem · 1h</small></span></div>
        <div className="glow" />
      </div>
      <Reveal className="ritual-box">
        <p className="big">Alguns momentos pedem mais do que uma pausa. Pedem um espaço para olhar para dentro, compreender o que está acontecendo e, depois, simplesmente descansar.</p>
        <ul className="facts">
          <li>30 minutos de leitura de Tarô</li>
          <li>1 hora de massagem {massage}</li>
          <li>Aproximadamente 1h30 de experiência</li>
        </ul>
        <div className="toggle" role="group" aria-label="Tipo de massagem">
          <button className={massage === "relaxante" ? "on" : ""} onClick={() => setMassage("relaxante")}>Massagem relaxante</button>
          <button className={massage === "terapeutica" ? "on" : ""} onClick={() => setMassage("terapeutica")}>Massagem terapêutica</button>
        </div>
        <p className="price"><small>Investimento</small><b key={price}>{price}</b></p>
        <Btn href={wa(`Olá! Quero viver o Ritual Iluminar com massagem ${massage}.`)}>Quero viver essa experiência</Btn>
      </Reveal>
    </section>
  );
}

function Services() {
  const tabs = Object.keys(SERVICES);
  const [tab, setTab] = useState(tabs[0]);
  const [k, setK] = useState(0);
  useEffect(() => {
    const h = (e) => { setTab(e.detail); setK((x) => x + 1); };
    addEventListener("pick-tab", h);
    return () => removeEventListener("pick-tab", h);
  }, []);
  return (
    <section className="services wave-top" id="servicos" style={{ "--tone": TAB_TONE[tab] }}>
      <Reveal className="head center-t">
        <p className="eyebrow">Experiências</p>
        <h2 className="grad">Encontre o cuidado para o seu momento</h2>
      </Reveal>
      <Reveal delay={100} className="center-t">
        <div className="tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => { setTab(t); setK((x) => x + 1); }}>{t}</button>
          ))}
        </div>
      </Reveal>
      <div className="cards" key={k}>
        {SERVICES[tab].map(([n, label, d, pr, tm], i) => (
          <article key={n} className="card" style={{ "--d": `${i * 110}ms` }} onMouseMove={spot}>
            <span className="need-glow" />
            <h3>{n}</h3>
            <span className="label">{label}</span>
            <p>{d}</p>
            <div className="card-foot">
              <div><b>{pr}</b>{tm && <small>{tm}</small>}</div>
              <a className="soft" href={wa(`Olá! Quero saber mais sobre ${n}.`)} target="_blank" rel="noreferrer">Quero saber mais</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Identify() {
  return (
    <section className="identify wave-top">
      <Reveal kind="blur"><h2 className="grad">Talvez você não esteja procurando apenas um serviço.</h2></Reveal>
      <div className="lines">
        {["Talvez você esteja procurando uma pausa.", "Um momento para aliviar o peso que o corpo carrega.", "Para silenciar um pouco a mente.", "Ou para olhar com mais atenção para aquilo que você está vivendo."].map((t, i) => (
          <Reveal key={i} kind="blur" delay={i * 150}><p>{t}</p></Reveal>
        ))}
      </div>
      <Reveal delay={200}><p className="signoff">No SpaSu Iluminar, cada experiência começa pelo seu momento.</p></Reveal>
    </section>
  );
}

function Products() {
  return (
    <section className="products wave-top" id="produtos">
      <Reveal className="head center-t">
        <p className="eyebrow">Autocuidado</p>
        <h2 className="grad">Leve esse momento com você.</h2>
        <p className="lead mid">Pequenos rituais para continuar a pausa em casa.</p>
      </Reveal>
      <div className="shelf">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.name} kind="flip" delay={i * 160} className="object" style={{ "--t": p.tone }}>
            <div className="vessel">
              {p.image ? <img src={p.image} alt={p.name} loading="lazy" /> : <span />}
            </div>
            <h3>{p.name}</h3>
            <ul>{p.items.map(([n, pr]) => <li key={n + pr}><span>{n}</span><i /><b>{pr}</b></li>)}</ul>
          </Reveal>
        ))}
      </div>
      <Reveal className="center-t"><a className="soft" href={wa("Olá! Conheci o SpaSu Iluminar pelo site e gostaria de saber mais sobre os produtos.")} target="_blank" rel="noreferrer">Perguntar sobre os produtos</a></Reveal>
    </section>
  );
}

function Final() {
  return (
    <section className="final wave-top">
      <div className="orb o1" /><div className="orb o2" />
      <Reveal><h2 className="grad">Um momento para você pode começar agora.</h2></Reveal>
      <Reveal delay={140}><p className="lead mid">Seja para cuidar do corpo, desacelerar a mente ou encontrar mais clareza para os seus caminhos, existe um espaço esperando por você.</p></Reveal>
      <Reveal delay={280}><Btn href={wa()}>Conversar pelo WhatsApp</Btn></Reveal>
      <footer>SpaSu Iluminar · Um espaço para iluminar corpo e alma.</footer>
    </section>
  );
}

export default function App() {
  return (
    <main className="app">
      <style>{CSS}</style>
      <Nav />
      <Hero />
      <Needs />
      <Trio />
      <Ritual />
      <Services />
      <Identify />
      <Products />
      <Final />
      <a className="fab" href={wa()} target="_blank" rel="noreferrer" aria-label="Conversar pelo WhatsApp">WhatsApp</a>
    </main>
  );
}

/* ---------- estilos ---------- */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Nunito+Sans:wght@300;400;600;700&display=swap');
:root{--luz:${C.luz};--areia:${C.areia};--salvia:${C.salvia};--agua:${C.agua};--lav:${C.lavanda};--ouro:${C.ouro};--pedra:${C.pedra};--ink:#3d3f38;--forest:#44594f;--muted:#6d6e64;--gold:#b0893f;--ease:cubic-bezier(.22,.8,.24,1)}
*{box-sizing:border-box;margin:0}html{scroll-behavior:smooth}
.app{font-family:'Nunito Sans',system-ui,sans-serif;color:var(--ink);background:var(--luz);overflow-x:hidden;line-height:1.65}
section{position:relative;padding:clamp(80px,11vw,150px) clamp(20px,7vw,110px)}
h1,h2,h3,.big,blockquote,.signoff,.price b,.logo,.tag-line,.need strong{font-family:'Cormorant Garamond',Georgia,serif;font-weight:400}
h1{font-size:clamp(2.8rem,6vw,5.2rem);line-height:1.04;letter-spacing:-.01em}h1 em{font-style:italic;color:#5b7f86}
h2{font-size:clamp(2.1rem,4.6vw,3.7rem);line-height:1.1}.huge{font-size:clamp(3.2rem,9vw,7rem)}
.grad{background:linear-gradient(95deg,#4f747c 0%,#8a8a63 55%,#b0893f 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.eyebrow{font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;font-weight:600}
.lead{font-size:1.06rem;color:var(--muted);max-width:46ch}.mid{margin:16px auto 0}.muted{color:var(--muted)}.center-t{text-align:center}
.head{max-width:760px;margin:0 auto 52px}
.btn{position:relative;display:inline-block;padding:1em 2em;border-radius:999px;background:var(--forest);color:#fff;text-decoration:none;font-weight:600;font-size:.92rem;overflow:hidden;isolation:isolate;transition:transform .5s var(--ease),box-shadow .5s,color .5s}
.btn::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(110deg,${C.ouro},${C.agua},${C.lavanda});transform:translateX(-101%);transition:transform .8s var(--ease)}
.btn:hover{transform:translateY(-3px);box-shadow:0 14px 30px #44594f30;color:var(--ink)}.btn:hover::before{transform:none}
.btn.ghost{background:#fff7;color:var(--ink);box-shadow:inset 0 0 0 1px #44594f40}
.soft{color:var(--forest);text-decoration:none;font-weight:600;font-size:.88rem;border-bottom:1px solid #44594f55;padding-bottom:2px;transition:letter-spacing .4s,border-color .4s}.soft:hover{letter-spacing:.04em;border-color:var(--forest)}
:focus-visible{outline:2px solid var(--forest);outline-offset:4px}

/* transições de entrada */
.rv{opacity:0;transition:opacity 1.1s var(--ease),transform 1.2s var(--ease),filter 1.1s var(--ease)}
.rv-up{transform:translateY(46px)}.rv-left{transform:translateX(-80px) scale(.95)}.rv-right{transform:translateX(80px) scale(.95)}.rv-blur{filter:blur(12px);transform:translateY(14px)}
.rv-flip{transform:perspective(900px) rotateX(24deg) translateY(60px);transform-origin:50% 100%}
.rv.in{opacity:1;transform:none;filter:none}

/* curva entre as seções (transição suave de uma faixa para outra) */
.wave-top::before{content:"";position:absolute;left:0;right:0;top:-1px;height:clamp(40px,6vw,90px);background:var(--prev,var(--luz));clip-path:ellipse(60% 100% at 50% 0%);pointer-events:none}
.needs{background:var(--luz)}
.moment{background:linear-gradient(180deg,var(--luz),color-mix(in srgb,var(--tone) 45%,var(--luz)))}
.ritual{background:var(--rbg) center/cover,linear-gradient(180deg,${C.lavanda}88,${C.ouro}77 60%,${C.luz})}
.services{background:linear-gradient(180deg,var(--luz),color-mix(in srgb,var(--tone) 35%,var(--areia)));transition:background 1s}
.identify{background:var(--luz)}.products{background:var(--areia)}.final{background:linear-gradient(180deg,${C.areia},${C.agua})}
.wave-top::before{background:var(--luz)}.products::before{background:var(--luz)}.final::before{background:var(--areia)}

/* nav */
.nav{position:fixed;z-index:20;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:18px clamp(20px,7vw,110px);transition:background .5s,padding .5s,box-shadow .5s,backdrop-filter .5s}
.nav.stuck{background:#faf7f2d9;backdrop-filter:blur(14px);padding-block:12px;box-shadow:0 8px 30px #3d3f3810}
.logo{font-size:1.5rem;color:var(--ink);text-decoration:none}.logo em{color:var(--gold)}.sun{color:var(--gold);margin-right:4px}
.links{display:flex;gap:26px}.links a{color:var(--muted);text-decoration:none;font-size:.82rem;transition:color .3s}.links a:hover{color:var(--ink)}
.pill{background:var(--forest);color:#fff;text-decoration:none;font-size:.8rem;font-weight:600;padding:.7em 1.3em;border-radius:99px;transition:transform .4s var(--ease)}.pill:hover{transform:translateY(-2px)}

/* hero */
.hero{min-height:100svh;display:grid;grid-template-columns:1fr 1fr;gap:clamp(30px,6vw,90px);align-items:center;padding-top:130px;background:radial-gradient(80% 60% at 50% -10%,${C.ouro}99 0,${C.ouro}00 70%),var(--luz)}
.hero-txt{display:flex;flex-direction:column;gap:22px;align-items:flex-start;animation:in 1.3s var(--ease) both}
@keyframes in{from{opacity:0;transform:translateY(40px)}}
.row{display:flex;flex-wrap:wrap;gap:18px;align-items:center}.note{font-size:.82rem;color:var(--muted);display:flex;gap:8px;align-items:center;max-width:24ch}.note i{font-style:normal;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--salvia);color:var(--forest);flex:none}
.hero-media{position:relative;animation:in 1.5s .25s var(--ease) both}
.frame-back{position:absolute;inset:14px -14px -14px 14px;border-radius:28px;background:linear-gradient(135deg,var(--agua),var(--salvia));opacity:.8;transition:transform 1s var(--ease)}
.hero-media:hover .frame-back{transform:translate(8px,8px)}
.float-tag{position:absolute;left:-18px;bottom:-14px;background:#fff;border-radius:14px;padding:10px 16px;font-family:'Cormorant Garamond',serif;font-size:1.05rem;box-shadow:0 14px 34px #3d3f3820;animation:bob 6s ease-in-out infinite}.float-tag small{display:block;font:600 .62rem 'Nunito Sans';letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
@keyframes bob{50%{transform:translateY(-8px)}}

/* fotos */
.photo{position:relative;width:100%;overflow:hidden;background:linear-gradient(160deg,#fffb,#fff4);box-shadow:0 36px 70px #3d3f3822;transition:border-radius 1.4s var(--ease)}
.frame{aspect-ratio:4/4.4;border-radius:26px}.arch{aspect-ratio:4/5;border-radius:999px 999px 26px 26px}.oval{aspect-ratio:4/5;border-radius:50%/42%}.blob{aspect-ratio:4/5;border-radius:62% 38% 55% 45%/48% 58% 42% 52%}
.moment-img:hover .photo{border-radius:48% 52% 40% 60%/55% 40% 60% 45%}
.photo img{position:absolute;left:0;top:-7%;width:100%;height:114%;object-fit:cover;transform:translateY(var(--py,0))}
.ph{position:absolute;inset:14px;display:grid;place-content:center;text-align:center;color:var(--muted);font-size:.92rem;border:1.5px dashed #3d3f3835;border-radius:inherit}.ph small{opacity:.7}

/* cards "do que você precisa" */
.needs-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;max-width:1200px;margin:auto}
.need-wrap{display:flex}
.need{--c:#fff;--mx:50%;--my:50%;position:relative;overflow:hidden;display:flex;flex-direction:column;gap:12px;width:100%;min-height:340px;padding:26px 24px;border-radius:22px;background:var(--c);text-decoration:none;color:var(--ink);transition:transform .8s var(--ease),box-shadow .8s var(--ease),border-radius .8s var(--ease)}
.need strong{font-size:1.55rem;line-height:1.15;font-style:italic}
.need-tag{font-size:.64rem;letter-spacing:.2em;text-transform:uppercase;font-weight:700;color:#3d3f38aa}
.need-d{font-size:.88rem;color:#3d3f38b3}
.need-msg{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.1rem;max-height:0;opacity:0;transform:translateY(14px);transition:all .8s var(--ease)}
.need-link{margin-top:auto;font-size:.82rem;font-weight:700}.need-link b{display:inline-block;transition:transform .5s var(--ease)}
.need-glow{position:absolute;inset:0;background:radial-gradient(260px circle at var(--mx) var(--my),#ffffffb0,#fff0 70%);opacity:0;transition:opacity .5s;pointer-events:none}
.need:hover,.need.open{transform:translateY(-12px) rotate(-.6deg);box-shadow:0 30px 60px #3d3f3824;border-radius:34px 34px 22px 22px}
.need:hover .need-glow,.card:hover .need-glow{opacity:1}.need.open .need-msg{max-height:120px;opacity:1;transform:none}.need:hover .need-link b{transform:translateX(6px)}
.needs-grid:hover .need:not(:hover){opacity:.7;transition:opacity .6s}

/* momentos */
.moment{display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,6vw,100px);align-items:center;min-height:100svh}.moment.flip .moment-img{order:2}
.moment-img{position:relative;max-width:480px;width:100%;margin-inline:auto}
.halo{position:absolute;inset:-8% -12%;border-radius:50%;background:var(--tone);filter:blur(50px);opacity:.9;animation:float 14s ease-in-out infinite}
@keyframes float{50%{transform:translate(3%,-4%) scale(1.07)}}
.moment-img .photo{position:relative}
.moment-txt{display:flex;flex-direction:column;gap:22px;align-items:flex-start;max-width:520px}
.big{font-size:clamp(1.4rem,2.4vw,2rem);line-height:1.3}
blockquote{font-size:1.25rem;font-style:italic;padding-left:20px;border-left:2px solid var(--tone);color:var(--ink)}

/* ritual */
.ritual{text-align:center;overflow:hidden;--p:0}
.tag-line{font-size:clamp(1.3rem,2.4vw,1.9rem);font-style:italic;margin-top:12px}
.merge{position:relative;height:clamp(270px,42vw,420px);margin:36px auto;max-width:900px;--p:inherit}
.disc{--s:clamp(190px,32vw,330px);position:absolute;top:50%;left:50%;width:var(--s);height:var(--s);margin:calc(var(--s)/-2);border-radius:50%;display:grid;place-content:center;font-family:'Cormorant Garamond',serif;font-size:1.7rem;line-height:1.2;mix-blend-mode:multiply;transition:transform .15s linear}
.disc small{display:block;font-family:'Nunito Sans',sans-serif;font-size:.78rem;color:var(--muted)}
.d-alma{background:radial-gradient(circle at 40% 35%,${C.lavanda},${C.agua});transform:translateX(calc((1 - var(--p)) * -48% - 18%))}
.d-corpo{background:radial-gradient(circle at 60% 35%,${C.salvia},${C.ouro});transform:translateX(calc((1 - var(--p)) * 48% + 18%))}
.glow{position:absolute;left:50%;top:50%;width:calc(var(--p) * 60%);aspect-ratio:1;transform:translate(-50%,-50%);background:radial-gradient(#fff,#fff0 65%);opacity:var(--p);filter:blur(10px)}
.ritual-box{display:flex;flex-direction:column;align-items:center;gap:24px;max-width:720px;margin:auto;padding:clamp(28px,5vw,56px);border-radius:32px;background:#ffffffb8;backdrop-filter:blur(10px);box-shadow:0 30px 70px #3d3f3815}
.facts{list-style:none;padding:0;display:grid;gap:4px;color:var(--muted)}
.toggle{display:inline-flex;flex-wrap:wrap;justify-content:center;padding:5px;border-radius:99px;background:var(--luz);box-shadow:inset 0 0 0 1px #3d3f3822}
.toggle button{font:inherit;font-size:.88rem;border:0;background:none;padding:.7em 1.3em;border-radius:99px;cursor:pointer;color:var(--ink);transition:all .5s var(--ease)}.toggle .on{background:var(--forest);color:#fff}
.price{display:flex;flex-direction:column}.price small{color:var(--muted)}.price b{font-size:3.1rem;animation:pop .8s var(--ease)}@keyframes pop{from{opacity:0;transform:translateY(14px) scale(.95)}}

/* serviços */
.tabs{display:inline-flex;flex-wrap:wrap;justify-content:center;gap:4px;padding:5px;border-radius:99px;background:#ffffff90;box-shadow:inset 0 0 0 1px #3d3f3820;margin-bottom:44px}
.tabs button{font:inherit;font-size:.9rem;border:0;background:none;padding:.8em 1.5em;border-radius:99px;cursor:pointer;color:var(--muted);transition:all .6s var(--ease)}.tabs .on{background:var(--forest);color:#fff}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:20px;max-width:1150px;margin:auto}
.card{--mx:50%;--my:50%;position:relative;overflow:hidden;display:flex;flex-direction:column;gap:6px;padding:26px 26px 22px;border-radius:20px;background:var(--luz);border:1px solid color-mix(in srgb,var(--tone) 80%,#3d3f38 20%);opacity:0;animation:cardin .9s var(--ease) forwards;animation-delay:var(--d);transition:transform .7s var(--ease),box-shadow .7s}
@keyframes cardin{from{opacity:0;transform:perspective(900px) rotateY(-22deg) translateX(50px);filter:blur(5px)}to{opacity:1;transform:none;filter:none}}
.card:hover{transform:translateY(-8px);box-shadow:0 26px 50px #3d3f3820}
.card h3{font-size:1.65rem;line-height:1.1}.label{font-size:.64rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);font-weight:700}.card p{color:var(--muted);font-size:.92rem;margin-top:8px}
.card-foot{margin-top:auto;padding-top:20px;display:flex;justify-content:space-between;align-items:flex-end;gap:12px}.card-foot b{display:block;font-size:1.15rem}.card-foot small{color:var(--muted)}

/* identificação */
.identify{min-height:100svh;display:flex;flex-direction:column;justify-content:center;gap:44px;max-width:1150px;margin:auto}
.identify h2{font-size:clamp(2.5rem,7vw,5.6rem);max-width:15ch}
.lines{display:grid;gap:14px}.lines p{font-family:'Cormorant Garamond',serif;font-size:clamp(1.3rem,2.6vw,2rem);color:var(--muted);max-width:30em}
.signoff{font-size:clamp(1.5rem,3vw,2.4rem);font-style:italic}

/* produtos */
.shelf{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(24px,4vw,60px);align-items:end;max-width:1100px;margin:auto}
.object{text-align:center}.object h3{font-size:1.7rem;margin:20px 0 12px}
.vessel{height:200px;display:grid;place-items:end center}
.vessel img{width:min(100%,240px);height:200px;object-fit:cover;object-position:center;border-radius:18px;box-shadow:0 24px 40px -18px #3d3f3855;transition:transform 1s var(--ease),box-shadow 1s var(--ease)}
.object:hover .vessel img{transform:translateY(-10px) rotate(-1deg);box-shadow:0 30px 44px -16px #3d3f3866}
.vessel span{width:140px;height:150px;border-radius:50% 50% 46% 46%/60% 60% 40% 40%;background:radial-gradient(circle at 35% 30%,#fffa,#fff0 45%),var(--t);box-shadow:0 30px 40px -10px #3d3f3830;transition:transform 1s var(--ease),border-radius 1s var(--ease)}
.object:hover .vessel span{transform:translateY(-14px) rotate(-4deg);border-radius:46% 54% 50% 50%/55% 50% 50% 45%}
.object:nth-child(3) .vessel span{width:70px;height:170px;border-radius:30px 30px 18px 18px}
.object ul{list-style:none;padding:0;display:grid;gap:6px;max-width:260px;margin:auto}.object li{display:flex;gap:8px;align-items:baseline;color:var(--muted)}.object li i{flex:1;border-bottom:1px dotted #3d3f3844}.object li b{color:var(--ink)}
.products .center-t{margin-top:56px}

/* final */
.final{min-height:90svh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:26px;overflow:hidden}
.final>*{position:relative;z-index:1}.final h2{max-width:16ch;font-size:clamp(2.4rem,6.5vw,5rem)}
.orb{position:absolute;border-radius:50%;filter:blur(60px);opacity:.7;animation:float 16s ease-in-out infinite;z-index:0!important}.o1{width:34vw;height:34vw;background:${C.lavanda};top:-6%;left:-8%}.o2{width:30vw;height:30vw;background:${C.ouro};bottom:-10%;right:-6%;animation-delay:-6s;opacity:.5}
.final footer{position:absolute;bottom:22px;font-size:.78rem;color:var(--muted)}
.fab{position:fixed;right:18px;bottom:18px;z-index:15;padding:.85em 1.4em;border-radius:99px;background:var(--forest);color:#fff;text-decoration:none;font-size:.85rem;font-weight:600;box-shadow:0 10px 30px #0003;transition:transform .5s var(--ease)}.fab:hover{transform:translateY(-4px)}

/* mobile */
@media(max-width:980px){.needs-grid{grid-template-columns:repeat(2,1fr)}.links{display:none}}
@media(max-width:820px){
 .hero{grid-template-columns:1fr;padding-top:110px}.hero-media{max-width:460px}
 .moment{grid-template-columns:1fr;min-height:auto;gap:44px}.moment.flip .moment-img{order:0}
 .shelf{grid-template-columns:1fr;gap:56px}.pill{font-size:.72rem;padding:.65em 1em}.logo{font-size:1.25rem}
}
@media(max-width:560px){.needs-grid{grid-template-columns:1fr}.need{min-height:260px}.fab{display:none}.tabs{border-radius:26px}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition-duration:.01ms!important}.rv,.card{opacity:1;transform:none;filter:none}}
`;
