import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";

const NAV_LINKS = [
  { label: "Universo Geek", href: "#geek-marvel" },
  { label: "Decoração",     href: "#decorativos" },
  { label: "Personalizados",href: "#personalizados" },
  { label: "Utilidades",    href: "#utilidades" },
];

interface NavHeaderProps {
  settings: {
    storeName: string;
    shopeeStoreUrl: string;
    logoUrl?: string;
  };
  onOpenCart?: () => void;
  cartCount: number;
}

export function NavHeader({ settings, onOpenCart, cartCount }: NavHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const storeName = settings?.storeName || "Bambuzau 3D";

  return (
    <>
      {/* Top Banner: WhatsApp Pedido */}
      <div
        id="top-frete-gratis-banner"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 36,
          background: "var(--color-accent)",
          color: "var(--color-bamboo)",
          zIndex: 101,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.72rem",
          fontWeight: 800,
          fontFamily: "var(--font-display)",
          letterSpacing: "0.08em",
          borderBottom: "1px solid rgba(30,77,43,0.2)",
          textTransform: "uppercase",
        }}
      >
        <span>🍃 ENCOMENDE SUAS PEÇAS PERSONALIZADAS DIRETO PELO WHATSAPP!</span>
      </div>

      <header
        style={{
          position: "fixed",
          top: scrolled ? 0 : 36,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "var(--color-surface)" : "rgba(229, 239, 228, 0.85)",
          borderBottom: "1px solid var(--color-border)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease, top 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            padding: "0 1.5rem",
            height: scrolled ? 76 : 84,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            transition: "height 0.3s ease",
          }}
        >
          {/* Logo Brand: Exact Custom SVG of Bambuzau 3D */}
          <a href="#" aria-label={storeName} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
            {/* SVG Logo Icon matching the image */}
            <svg
              viewBox="0 0 160 160"
              style={{
                height: scrolled ? 54 : 64,
                width: "auto",
                transition: "height 0.3s ease",
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
                    fontSize: scrolled ? "1.35rem" : "1.55rem",
                    color: "#1E4D2B",
                    letterSpacing: "-0.04em",
                    textTransform: "lowercase",
                    transition: "font-size 0.3s ease",
                  }}
                >
                  bambuzau
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: scrolled ? "1.25rem" : "1.4rem",
                    color: "#F2A202",
                    letterSpacing: "-0.02em",
                    transition: "font-size 0.3s ease",
                  }}
                >
                  3d
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: scrolled ? "0.48rem" : "0.55rem",
                  fontWeight: 700,
                  color: "#1E4D2B",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginTop: "2px",
                  lineHeight: 1,
                  transition: "font-size 0.3s ease",
                }}
              >
                Personalizados que conectam
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex" style={{ alignItems: "center", gap: "1.75rem" }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--color-fg-muted)",
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                  transition: "color 0.25s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-accent)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-fg-muted)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Area Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={onOpenCart}
              className="btn-whatsapp"
              style={{
                padding: "0.5rem 1.15rem",
                fontSize: "0.8rem",
                gap: "0.375rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <ShoppingBag size={14} />
              Carrinho
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "#EF4444",
                    color: "#FFFFFF",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    borderRadius: "50%",
                    minWidth: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    boxShadow: "0 2px 5px rgba(239, 68, 68, 0.4)",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="lg:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-accent)",
                cursor: "pointer",
                padding: "0.4rem",
                display: "flex",
              }}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div
            style={{
              background: "var(--color-surface)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <nav style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "var(--color-fg)",
                    textDecoration: "none",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  onOpenCart?.();
                }}
                className="btn-whatsapp"
                style={{ marginTop: "1rem", justifyContent: "center", display: "flex", width: "100%", gap: "0.5rem" }}
              >
                <ShoppingBag size={16} />
                Meu Carrinho ({cartCount})
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
