import { useState, useEffect } from "react";
import { getSafeCategoryImage } from "@/lib/safe-images";

interface Category {
  id: string;
  label: string;
  desc: string;
  image: string;
  href: string;
  imageScale?: string; // CSS object-position to focus on the right part
}

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "geek-marvel",
    label: "Universo Geek",
    desc: "Colecionáveis, bustos, chaveiros e suportes temáticos",
    image: "figurine-3d.jpg",
    href: "#geek-marvel",
    imageScale: "center 10%",
  },
  {
    id: "decorativos",
    label: "Decoração & Vasos",
    desc: "Lustres geométricos e vasos decorativos de alto brilho",
    image: "vase-3d.jpg",
    href: "#decorativos",
    imageScale: "center 30%",
  },
  {
    id: "personalizados",
    label: "Personalizados",
    desc: "Sua ideia impressa em 3D sob encomenda",
    image: "event-3d.jpg",
    href: "#personalizados",
    imageScale: "center center",
  },
  {
    id: "utilidades",
    label: "Utilidades Gerais",
    desc: "Acessórios e soluções ergonômicas inteligentes",
    image: "utility-3d.jpg",
    href: "#utilidades",
    imageScale: "center center",
  }
];

export function CategoryFloat() {
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar categorias do Firestore:", err);
      });
  }, []);

  return (
    <section
      id="categorias"
      style={{
        background: "transparent",
        padding: "0 2rem 6rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          paddingBottom: "2.5rem",
          textAlign: "center",
        }}
      >
        <span className="section-label" style={{ display: "inline-block", margin: "0 auto" }}>Categorias</span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "var(--color-fg)",
            marginTop: "0.5rem",
          }}
        >
          Explore Nossas Coleções
        </h2>

        {/* Tubelight Effect under 'Explore Nossas Coleções' */}
        <div
          style={{
            position: "relative",
            marginTop: "1.75rem",
            marginBottom: "0.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "70px",
            overflow: "visible",
          }}
        >
          {/* The bright concentrated tube line */}
          <div
            style={{
              width: "350px",
              height: "3px",
              background: "linear-gradient(to right, rgba(30, 77, 43, 0) 0%, rgba(255, 255, 255, 1) 15%, rgba(30, 77, 43, 1) 50%, rgba(255, 255, 255, 1) 85%, rgba(30, 77, 43, 0) 100%)",
              boxShadow: "0 0 14px rgba(242, 162, 2, 0.95), 0 0 28px rgba(30, 77, 43, 0.65), 0 0 45px rgba(242, 162, 2, 0.3)",
              borderRadius: "10px",
              zIndex: 2,
            }}
          />

          {/* Soft downward light cone/wash projection */}
          <div
            style={{
              position: "absolute",
              top: "3px",
              width: "500px",
              height: "65px",
              background: "radial-gradient(ellipse at top, rgba(242, 162, 2, 0.5) 0%, rgba(30, 77, 43, 0.15) 50%, rgba(30, 77, 43, 0) 75%)",
              filter: "blur(12px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        </div>
      </div>

      {/* Floating category row - perfectly aligned 7-column grid of inclined cards with hover flash effect */}
      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          perspective: "1500px", // 3D Perspective Context
          padding: "2.5rem 1rem", // clearance for the vertical rising effect
        }}
        className="category-float-grid"
      >
        {categories.map((cat, idx) => (
          <a
            key={cat.id}
            href={cat.href}
            onMouseEnter={() => setHovered(cat.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              cursor: "pointer",
              opacity: hovered && hovered !== cat.id ? 0.6 : 1,
              transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
              animationDelay: `${idx * 0.04}s`,
              // Removing the card background container entirely so images align perfectly
              background: "transparent",
              border: "none",
              padding: "0",
              transformStyle: "preserve-3d",
              // Elegant inclinations (inclinados) to look custom and organic, straightening on hover with mouse lift
              transform: hovered === cat.id
                ? "translateY(-14px) rotate(0deg) scale(1.08)"
                : (idx % 2 === 0
                  ? "translateY(0) rotate(-4deg) scale(0.96)"
                  : "translateY(0) rotate(4deg) scale(0.96)"),
              zIndex: hovered === cat.id ? 30 : 2,
            }}
            className="cat-float-item"
            aria-label={cat.label}
          >
            {/* Floating image container - now perfectly circular and shiny */}
            <div
              className="flash-container"
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1/1", // Perfect square ratio for alignment
                overflow: "hidden",
                borderRadius: "50%", // Circular category images
                border: hovered === cat.id ? "3px solid var(--color-accent)" : "1px solid var(--color-border)",
                boxShadow: hovered === cat.id
                  ? "0 12px 28px rgba(30, 77, 43, 0.15)"
                  : "0 6px 16px rgba(30, 77, 43, 0.05)",
                transition: "all 0.4s ease",
              }}
            >
              {/* Glow halo behind image */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  filter: "blur(40px)",
                  opacity: hovered === cat.id ? 0.15 : 0,
                  transition: "opacity 0.4s ease",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />

              {/* Image wrapper */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: hovered === cat.id ? "scale(1.06)" : "scale(1)",
                  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                  zIndex: 1,
                }}
              >
                <img
                  src={getSafeCategoryImage(cat.id, cat.image)}
                  alt={cat.label}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: cat.imageScale ?? "center",
                    display: "block",
                    filter: hovered === cat.id
                      ? "brightness(1.08)"
                      : "brightness(0.82)",
                    transition: "filter 0.4s ease",
                  }}
                />
              </div>
            </div>

            {/* Category label + info */}
            <div
              style={{
                width: "100%",
                paddingTop: "0.875rem",
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Tiny indicator bar */}
              <div
                style={{
                  width: hovered === cat.id ? 30 : 12,
                  height: 2,
                  background: "var(--color-accent)",
                  marginBottom: "0.5rem",
                  borderRadius: 2,
                  transition: "width 0.3s ease",
                }}
              />

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: hovered === cat.id ? "var(--color-accent)" : "var(--color-fg)",
                  letterSpacing: "-0.01em",
                  marginBottom: "0.2rem",
                  transition: "color 0.3s",
                }}
              >
                {cat.label}
              </h3>

              <p
                style={{
                  fontSize: "0.72rem",
                  color: "var(--color-fg-muted)",
                  lineHeight: 1.4,
                  padding: "0 0.15rem",
                  margin: 0,
                }}
              >
                {cat.desc}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
