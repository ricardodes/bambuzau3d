import { Shield, Truck, Sparkles, RefreshCw, Check, Leaf } from "lucide-react";

import img3dPrint from "@/assets/images/real_3d_print_1783221943779.jpg";
import imgGarantia from "@/assets/images/real_garantia_1783221955976.jpg";
import imgEntrega from "@/assets/images/real_entrega_1783221966432.jpg";
import imgPronto from "@/assets/images/real_pronto_1783222003479.jpg";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Qualidade de Acabamento",
    desc: "Peças polidas com filamento premium que oferecem brilho e resistência superiores a qualquer peça de impressão 3D comum.",
    image: img3dPrint,
  },
  {
    icon: Shield,
    title: "Garantia Bambuzau",
    desc: "Cada lote é inspecionado à mão sob luz cirúrgica. Se sua peça contiver o menor detalhe ou imperfeição, refazemos imediatamente.",
    image: imgGarantia,
  },
  {
    icon: Leaf,
    title: "Sustentabilidade Ecológica",
    desc: "Fusão de tecnologia com a natureza: utilizamos filamentos de base biológica e biodegradáveis derivados de fontes sustentáveis de amido.",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Truck,
    title: "Transporte Protegido",
    desc: "Nossas embalagens contêm tripla camada de proteção biodegradável, assegurando que o seu item de decoração chegue intacto e limpo.",
    image: imgEntrega,
  },
  {
    icon: RefreshCw,
    title: "Despacho em até 72 horas",
    desc: "Produção sob demanda ágil e otimizada por filamentos de refrigeração rápida, permitindo envio veloz sem comprometer a estabilidade estética.",
    image: imgPronto,
  },
];

const STATS = [
  { value: "+2.400", label: "Clientes satisfeitos" },
  { value: "4.9★",  label: "Avaliação média" },
  { value: "+200",  label: "Produtos no catálogo" },
  { value: "100%",  label: "Garantia de qualidade" },
];

export function WhyUs() {
  return (
    <section
      id="qualidades"
      style={{
        padding: "6rem 2rem",
        position: "relative",
        background: "linear-gradient(180deg, #0A2413 0%, #06180c 100%)", // Luxurious deep dark forest green matching user request
        borderTop: "1px solid rgba(74, 222, 128, 0.08)",
        borderBottom: "1px solid rgba(74, 222, 128, 0.08)",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glows */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "15%",
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(74, 222, 128, 0.07) 0%, rgba(74, 222, 128, 0) 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "15%",
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(30, 77, 43, 0.18) 0%, rgba(30, 77, 43, 0) 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div style={{ maxWidth: 1360, margin: "0 auto", position: "relative", zIndex: 2 }}>
        
        {/* Centered Editorial Header */}
        <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <span style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "0.75rem", 
            fontWeight: 700, 
            letterSpacing: "0.22em", 
            textTransform: "uppercase",
            color: "var(--color-accent-light)",
            display: "block",
            marginBottom: "1rem"
          }}>
            A Essência do Nosso Trabalho
          </span>
          
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3vw, 2.75rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              marginBottom: "1.5rem",
              maxWidth: "800px",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            Qualidade, Tecnologia & Sustentabilidade
          </h2>
          
          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "rgba(244, 244, 248, 0.72)", maxWidth: "700px", margin: "0 auto 2.5rem" }}>
            Fundimos a resiliência dos materiais eco-sustentáveis com a precisão milimétrica da modelagem 3D. O resultado são peças impecáveis, livres de rebarbas, prontas para encantar.
          </p>

          {/* Bullet badges in a horizontal row */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ background: "rgba(74, 222, 128, 0.12)", color: "var(--color-accent-light)", borderRadius: "50%", padding: "0.25rem" }}>
                <Check size={14} />
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(244, 244, 248, 0.9)" }}>Filamento de base biológica</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ background: "rgba(74, 222, 128, 0.12)", color: "var(--color-accent-light)", borderRadius: "50%", padding: "0.25rem" }}>
                <Check size={14} />
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(244, 244, 248, 0.9)" }}>Acabamento artesanal pós-impressão</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ background: "rgba(74, 222, 128, 0.12)", color: "var(--color-accent-light)", borderRadius: "50%", padding: "0.25rem" }}>
                <Check size={14} />
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(244, 244, 248, 0.9)" }}>Inspeção manual com garantia total</span>
            </div>
          </div>
        </div>

        {/* 5 Feature Glassmorphic Cards Grid */}
        <div 
          style={{ 
            display: "grid", 
            gap: "1.5rem",
            maxWidth: "1200px",
            margin: "0 auto"
          }} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="group"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "1.25rem",
                  border: "1px solid rgba(74, 222, 128, 0.12)", // Elegant subtle green border
                  background: "rgba(10, 25, 14, 0.55)", // Translucent dark green
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.35)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "2.25rem 2rem",
                  minHeight: "280px",
                  transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector('.card-bg-img') as HTMLImageElement;
                  if (img) img.style.transform = "scale(1.08)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "rgba(74, 222, 128, 0.35)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(74, 222, 128, 0.18)";
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector('.card-bg-img') as HTMLImageElement;
                  if (img) img.style.transform = "scale(1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(74, 222, 128, 0.12)";
                  e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(0, 0, 0, 0.35)";
                }}
              >
                {/* Background Image behind glass overlay */}
                <img
                  className="card-bg-img"
                  src={feat.image}
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -2,
                    transition: "transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  }}
                  referrerPolicy="no-referrer"
                />
                
                {/* Dark forest translucent overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(4, 11, 6, 0.96) 20%, rgba(8, 20, 11, 0.78) 65%, rgba(8, 20, 11, 0.45) 100%)",
                    zIndex: -1,
                  }}
                />

                {/* Content */}
                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Icon */}
                  <div 
                    style={{ 
                      background: "rgba(74, 222, 128, 0.12)", 
                      border: "1px solid rgba(74, 222, 128, 0.25)", 
                      borderRadius: "0.75rem", 
                      width: 44, 
                      height: 44, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      color: "var(--color-accent-light)",
                      marginBottom: "1.25rem",
                      transition: "all 0.3s"
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      color: "#FFFFFF",
                      marginBottom: "0.625rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {feat.title}
                  </h3>
                  
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(244, 244, 248, 0.82)",
                      lineHeight: 1.6,
                    }}
                  >
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats bar - fully integrated */}
        <div
          style={{
            borderRadius: "1.25rem",
            border: "1px solid rgba(74, 222, 128, 0.12)",
            background: "rgba(10, 25, 14, 0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "2rem 2.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "1.5rem",
            textAlign: "center",
            marginTop: "4.5rem",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.35)"
          }}
        >
          {STATS.map((stat, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.85rem",
                  letterSpacing: "-0.03em",
                  color: "var(--color-accent-light)",
                  marginBottom: "0.25rem",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(244, 244, 248, 0.72)", fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
