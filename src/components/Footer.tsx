import { MessageCircle, Instagram, Facebook, Youtube, Send } from "lucide-react";

interface FooterProps {
  settings?: {
    storeName: string;
    storeDescription: string;
    shopeeStoreUrl: string;
    whatsAppPhone: string;
    whatsAppMessage: string;
    socialInstagram?: string;
    socialFacebook?: string;
    socialYoutube?: string;
    socialTelegram?: string;
    wholesaleWhatsApp?: string;
    wholesaleTelegram?: string;
    logoUrl?: string;
  };
}

export function Footer({ settings }: FooterProps) {
  const whatsAppPhone = settings?.whatsAppPhone || "5515997788281";
  const whatsAppMessage = settings?.whatsAppMessage || "Olá! Quero fazer um pedido!";
  const whatsAppUrl = `https://wa.me/${whatsAppPhone}?text=${encodeURIComponent(whatsAppMessage)}`;
  const storeName = settings?.storeName || "Bambuzau 3D";
  const storeDescription = settings?.storeDescription || "Personalizados que conectam. O melhor do Universo Geek, decorações sofisticadas e impressões 3D sob medida com o mais alto nível de acabamento.";

  const instagramUser = settings?.socialInstagram || "bambuzau3d";
  const instagramUrl = instagramUser 
    ? (instagramUser.startsWith("http") ? instagramUser : `https://instagram.com/${instagramUser}`)
    : "#";

  const facebookUser = settings?.socialFacebook;
  const facebookUrl = facebookUser 
    ? (facebookUser.startsWith("http") ? facebookUser : `https://facebook.com/${facebookUser}`)
    : "#";

  const youtubeUser = settings?.socialYoutube;
  const youtubeUrl = youtubeUser 
    ? (youtubeUser.startsWith("http") ? youtubeUser : `https://youtube.com/${youtubeUser}`)
    : "#";

  const telegramUser = settings?.socialTelegram;
  const telegramUrl = telegramUser 
    ? (telegramUser.startsWith("http") ? telegramUser : `https://t.me/${telegramUser}`)
    : "#";

  return (
    <footer
      style={{
        position: "relative",
        background: "linear-gradient(to bottom, var(--color-surface) 0%, var(--color-bg) 100%)",
        borderTop: "1px solid var(--color-border)",
        overflow: "hidden",
      }}
    >
      {/* 88% Transparency Bamboo Wall Background Layer (Only 12% Opacity) at the footer */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/bamboo_dense_wall.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 80%",
          backgroundRepeat: "no-repeat",
          opacity: 0.12,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1360,
          margin: "0 auto",
          padding: "4rem 2rem 2rem",
        }}
      >
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-col items-start" style={{ marginTop: "-1rem" }}>
          <a
            href="#"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              marginBottom: "1rem",
            }}
          >
            {/* SVG Logo Icon matching the image */}
            <svg
              viewBox="0 0 160 160"
              style={{
                height: 64,
                width: "auto",
              }}
            >
              {/* Green Circular Border Frame */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#1E4D2B"
                strokeWidth="5"
                strokeDasharray="240 10 240 10"
              />
              
              {/* Left Bamboo Stalk (Forest Green) */}
              <path
                d="M58 115 C58 85, 62 60, 56 45"
                fill="none"
                stroke="#1E4D2B"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Segment joints for Left Bamboo */}
              <line x1="56.5" y1="95" x2="60.5" y2="93" stroke="#FAF6F0" strokeWidth="2" />
              <line x1="58.5" y1="75" x2="61.5" y2="73" stroke="#FAF6F0" strokeWidth="2" />
              <line x1="57" y1="58" x2="59.5" y2="56" stroke="#FAF6F0" strokeWidth="2" />

              {/* Middle Bamboo Stalk (Bamboo Yellow/Orange) */}
              <path
                d="M80 120 C81 85, 83 55, 78 35"
                fill="none"
                stroke="#F2A202"
                strokeWidth="9"
                strokeLinecap="round"
              />
              {/* Segment joints for Middle Bamboo */}
              <line x1="77.5" y1="98" x2="84.5" y2="97" stroke="#FAF6F0" strokeWidth="2.5" />
              <line x1="78.5" y1="72" x2="85" y2="71" stroke="#FAF6F0" strokeWidth="2.5" />
              <line x1="77" y1="48" x2="82" y2="47.5" stroke="#FAF6F0" strokeWidth="2.5" />

              {/* Right Bamboo Stalk (Forest Green) */}
              <path
                d="M102 115 C101 88, 103 62, 97 45"
                fill="none"
                stroke="#1E4D2B"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Segment joints for Right Bamboo */}
              <line x1="99" y1="94" x2="103.5" y2="92.5" stroke="#FAF6F0" strokeWidth="2" />
              <line x1="100.5" y1="74" x2="104.5" y2="72" stroke="#FAF6F0" strokeWidth="2" />
              <line x1="97.5" y1="56" x2="101" y2="54.5" stroke="#FAF6F0" strokeWidth="2" />

              {/* Delicate Leaves (Forest Green & Orange) */}
              {/* Left Leaves */}
              <path d="M58 75 C45 70, 42 62, 45 58 C48 65, 54 70, 58 75 Z" fill="#1E4D2B" />
              <path d="M56 45 C42 42, 40 32, 44 28 C47 36, 52 42, 56 45 Z" fill="#1E4D2B" />
              <path d="M60 93 C48 95, 42 100, 44 104 C48 99, 55 96, 60 93 Z" fill="#1E4D2B" />

              {/* Right Leaves */}
              <path d="M102 74 C115 70, 118 62, 115 58 C112 65, 106 70, 102 74 Z" fill="#1E4D2B" />
              <path d="M97 45 C111 42, 113 32, 109 28 C106 36, 101 42, 97 45 Z" fill="#1E4D2B" />
              <path d="M101 92 C114 93, 118 97, 116 102 C112 97, 105 95, 101 92 Z" fill="#1E4D2B" />

              {/* Middle Leaves */}
              <path d="M81 72 C92 65, 95 55, 91 51 C88 59, 84 66, 81 72 Z" fill="#F2A202" />
              <path d="M79 98 C68 92, 65 82, 69 78 C72 86, 76 93, 79 98 Z" fill="#F2A202" />
            </svg>

            {/* Typography brand name and tagline */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.15rem", lineHeight: 1 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "1.45rem",
                    color: "#1E4D2B",
                    letterSpacing: "-0.04em",
                    textTransform: "lowercase",
                  }}
                >
                  bambuzau
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "1.3rem",
                    color: "#F2A202",
                    letterSpacing: "-0.02em",
                  }}
                >
                  3d
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.5rem",
                  fontWeight: 700,
                  color: "#1E4D2B",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginTop: "2px",
                  lineHeight: 1,
                }}
              >
                Personalizados que conectam
              </span>
            </div>
          </a>

          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--color-fg-muted)",
              lineHeight: 1.7,
              marginBottom: "1.25rem",
              maxWidth: 320,
            }}
          >
            {storeDescription}
          </p>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[
              { Icon: Instagram, label: "Instagram", url: instagramUrl },
              { Icon: Facebook,  label: "Facebook", url: facebookUrl },
              { Icon: Youtube,   label: "YouTube", url: youtubeUrl },
              { Icon: Send,      label: "Telegram", url: telegramUrl },
            ].filter(social => social.url !== "#").map(({ Icon, label, url }) => (
              <a
                key={label}
                href={url}
                target={url !== "#" ? "_blank" : undefined}
                rel={url !== "#" ? "noopener noreferrer" : undefined}
                aria-label={label}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-fg-muted)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-accent)";
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-fg-muted)";
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Categorias */}
        <div className="sm:col-span-1 lg:col-span-2">
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-fg)",
              marginBottom: "1rem",
            }}
          >
            Categorias
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              { label: "Universo Geek",   href: "#geek-marvel" },
              { label: "Articulados",     href: "#articulados" },
              { label: "Decoração & Vasos", href: "#decorativos" },
              { label: "Organização & Suportes", href: "#organizacao" },
              { label: "Personalizados",  href: "#personalizados" },
              { label: "Utilidades",      href: "#utilidades" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-fg-muted)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-muted)")}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Informações */}
        <div className="sm:col-span-1 lg:col-span-2">
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-fg)",
              marginBottom: "1rem",
            }}
          >
            Informações
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Como Comprar",         href: "#" },
              { label: "Prazos e Envio",       href: "#" },
              { label: "Política de Troca",    href: "#" },
              { label: "Perguntas Frequentes", href: "#" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-fg-muted)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-muted)")}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div>
            <span style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "0.68rem", 
              fontWeight: 700, 
              letterSpacing: "0.12em", 
              textTransform: "uppercase", 
              color: "var(--color-fg)",
              display: "block",
              marginBottom: "0.75rem"
            }}>
              Meios de Pagamento
            </span>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {/* PIX */}
              <div title="Pix" style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "6px", width: "42px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 100 100" style={{ width: "20px", height: "20px" }}>
                  <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="none" stroke="#32BCAD" strokeWidth="11" />
                  <path d="M50 35 L65 50 L50 65 L35 50 Z" fill="#32BCAD" />
                </svg>
              </div>
              {/* Visa */}
              <div title="Visa" style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "6px", width: "42px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: "900", fontStyle: "italic", fontSize: "10px", color: "#3B82F6", letterSpacing: "-0.05em" }}>VISA</span>
              </div>
              {/* Mastercard */}
              <div title="Mastercard" style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "6px", width: "42px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#EB001B", marginRight: "-4px" }} />
                  <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FF5F00", opacity: 0.85 }} />
                </div>
              </div>
              {/* Elo */}
              <div title="Elo" style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "6px", width: "42px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "sans-serif", fontWeight: "900", fontSize: "10px", color: "#F97316" }}>elo</span>
              </div>
              {/* Boleto */}
              <div title="Boleto" style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "6px", width: "42px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", gap: "2px", alignItems: "center", height: "12px" }}>
                  <div style={{ width: "2px", height: "12px", background: "rgba(255, 255, 255, 0.6)" }} />
                  <div style={{ width: "1px", height: "12px", background: "rgba(255, 255, 255, 0.6)" }} />
                  <div style={{ width: "3px", height: "12px", background: "rgba(255, 255, 255, 0.6)" }} />
                  <div style={{ width: "1px", height: "12px", background: "rgba(255, 255, 255, 0.6)" }} />
                  <div style={{ width: "2px", height: "12px", background: "rgba(255, 255, 255, 0.6)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-col">
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-fg)",
              marginBottom: "1rem",
            }}
          >
            Contato
          </h4>
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--color-fg-muted)",
              lineHeight: 1.7,
              marginBottom: "1rem",
            }}
          >
            Dúvidas, orçamentos e pedidos personalizados — fale conosco!
          </p>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ fontSize: "0.82rem", padding: "0.6rem 1.2rem", justifyContent: "center", display: "flex", borderRadius: "1.5rem" }}
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
          <p style={{ fontSize: "0.72rem", color: "var(--color-fg-muted)", opacity: 0.8, marginTop: "0.6rem", textAlign: "center" }}>
            Respondemos em até 2 horas
          </p>

          {/* Wholesale Section */}
          <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
            <h5 style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 700, color: "var(--color-fg)", marginBottom: "0.4rem" }}>
              Atacado & Parcerias:
            </h5>
            <p style={{ fontSize: "0.75rem", color: "var(--color-fg-muted)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
              Entre em contato para condições de atacado via WhatsApp ou Telegram:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <a
                href={`https://wa.me/${settings?.wholesaleWhatsApp || "5515997788281"}?text=Olá!%20Quero%20saber%20mais%20sobre%20as%20condições%20de%20atacado%20da%20Bambuzau%203D.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ fontSize: "0.74rem", padding: "0.45rem 0.8rem", justifyContent: "center", display: "flex", borderRadius: "1.5rem" }}
              >
                <MessageCircle size={12} />
                WhatsApp Atacado
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--color-border)", background: "rgba(30, 77, 43, 0.05)", position: "relative", zIndex: 2 }}>
        <div
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            padding: "1.25rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "var(--color-fg-muted)" }}>
            © {new Date().getFullYear()} {storeName}. Todos os direitos reservados.
          </span>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            {["WhatsApp", "Pix", "Cartão", "Boleto"].map((item) => (
              <span key={item} style={{ fontSize: "0.75rem", color: "var(--color-fg-muted)" }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
