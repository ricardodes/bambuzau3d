import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const BASE = import.meta.env.BASE_URL;
interface HeroProps {
  settings?: {
    shopeeStoreUrl?: string;
    storeName?: string;
    storeDescription?: string;
    whatsAppPhone?: string;
    whatsAppMessage?: string;
  };
}

const HERO_OPTIONS = [
  { 
    id: "winter_garden_3d.jpg", 
    name: "Jardim de Inverno Moderno", 
    desc: "Elegância integrada à natureza, com vasos e detalhes geométricos impressos em 3D no ambiente" 
  },
  { 
    id: "beach_house_3d.jpg", 
    name: "Refúgio de Praia", 
    desc: "Decorações em alto relevo e iluminação inspirada nas formas orgânicas do mar com peças 3D" 
  },
  { 
    id: "feng_shui_3d.jpg", 
    name: "Harmonia e Feng Shui", 
    desc: "Equilíbrio em apartamentos com incensórios e peças autorais sob medida feitas em impressora 3D" 
  }
];

export function Hero({ settings: _settings }: HeroProps) {
  const [activeHero, setActiveHero] = useState<string>(() => {
    return localStorage.getItem("active_hero_image") || "winter_garden_3d.jpg";
  });

  // Preload other high-res hero images to avoid white flash during transition, deferred by 2.5s to prevent network contention
  useEffect(() => {
    const timer = setTimeout(() => {
      const cleanBase = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;
      HERO_OPTIONS.forEach((opt) => {
        if (opt.id === activeHero) return;
        const img = new Image();
        img.src = opt.id.startsWith("http") ? opt.id : `${cleanBase}/images/${opt.id}`;
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, [activeHero]);

  // Auto-slide carousel effect (rotates background every 6.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHero((prev) => {
        const currentIndex = HERO_OPTIONS.findIndex((opt) => opt.id === prev);
        const nextIndex = (currentIndex + 1) % HERO_OPTIONS.length;
        const nextHeroId = HERO_OPTIONS[nextIndex].id;
        localStorage.setItem("active_hero_image", nextHeroId);
        return nextHeroId;
      });
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 640,
        display: "flex",
        alignItems: "flex-start",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <img
        src={activeHero.startsWith("http") ? activeHero : `${BASE.endsWith("/") ? BASE.slice(0, -1) : BASE}/images/${activeHero}`}
        alt="Sala decorada com peças Bambuzau 3D"
        onError={(e) => {
          const cleanBase = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;
          e.currentTarget.src = `${cleanBase}/images/hero-room.jpg`;
        }}
        loading="eager"
        fetchPriority="high"
        referrerPolicy="no-referrer"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 0,
          transition: "filter 0.6s ease, opacity 0.5s ease-in-out",
          filter: "brightness(0.9)",
        }}
      />

      {/* Top-left gradient for text legibility — fades away fast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(125deg, rgba(7,7,8,0.88) 0%, rgba(7,7,8,0.60) 30%, rgba(7,7,8,0.15) 58%, rgba(7,7,8,0) 80%)",
        }}
      />
      {/* Subtle overall veil so hotspot labels read well */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "rgba(7,7,8,0.18)",
        }}
      />

      {/* Bottom fade to page bg */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 180,
          zIndex: 2,
          background: "linear-gradient(to top, var(--color-bg) 0%, transparent 100%)",
        }}
      />

      {/* Hero content */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: 1360,
          margin: "0 auto",
          padding: "0 2rem",
          paddingTop: 160,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 820, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              justifyContent: "center",
            }}
          >
            <span
              className="section-label"
              style={{ color: "var(--color-accent-light)", letterSpacing: "0.15em", fontWeight: 600, fontSize: "0.75rem" }}
            >
              EXCLUSIVIDADE & NATUREZA DIGITAL
            </span>
          </div>

          <h1
            className="fade-up"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              marginBottom: "1.5rem",
            }}
          >
            Esculpindo Espaços,
            <br />
            Conectando <span style={{ color: "var(--color-accent-light)" }}>Vidas</span>
          </h1>

          <p
            className="fade-up fade-up-d1"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              lineHeight: 1.75,
              color: "rgba(244,244,248,0.72)",
              marginBottom: "2.25rem",
              maxWidth: 640,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Arquitete seu jardim ideal em 3D realista antes do primeiro plantio. Design botânico sofisticado integrado à tecnologia para materializar o seu santuário particular.
          </p>

          <div
            className="fade-up fade-up-d2"
            style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2.25rem" }}
          >
            <a
              href={`https://wa.me/${_settings?.whatsAppPhone || "5515997788281"}?text=${encodeURIComponent(_settings?.whatsAppMessage || "Olá! Gostaria de simular um projeto 3D!")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "var(--color-accent-light)",
                color: "#070708",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
                padding: "0.75rem 1.75rem",
                borderRadius: "9999px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.1)";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              SIMULAR PROJETO 3D
            </a>
            <a
              href="#projetos-autorais"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.4)",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
                padding: "0.75rem 1.75rem",
                borderRadius: "9999px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                textDecoration: "none",
                background: "rgba(255, 255, 255, 0.05)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#FFFFFF";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              }}
            >
              EXPLORAR PORTFÓLIO
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#projetos-autorais"
        className="bounce-soft"
        style={{
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          color: "rgba(244,244,248,0.45)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          textDecoration: "none",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(244,244,248,0.85)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(244,244,248,0.45)")}
      >
        <span
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            fontFamily: "var(--font-display)",
            textTransform: "uppercase",
          }}
        >
          DESCOBRIR
        </span>
        <ChevronDown size={18} />
      </a>
    </section>
  );
}
