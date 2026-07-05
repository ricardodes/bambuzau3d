import { ArrowRight } from "lucide-react";
import { getSafeCategoryImage } from "@/lib/safe-images";

interface Category {
  id: string;
  label: string;
  desc: string;
  image: string;
  href: string;
  span?: string;
}

const CATEGORIES: Category[] = [
  {
    id: "decorativos",
    label: "Decorativos",
    desc: "Esculturas e arte 3D para cada ambiente",
    image: "art-sculpture.jpg",
    href: "#decorativos",
    span: "lg:col-span-2",
  },
  {
    id: "lustres",
    label: "Lustres",
    desc: "Iluminação artesanal única",
    image: "lustres.jpg",
    href: "#lustres",
  },
  {
    id: "aquario",
    label: "Aquário",
    desc: "Decorações para aquarismo",
    image: "aquario.jpg",
    href: "#aquario",
  },
  {
    id: "brinquedos",
    label: "Brinquedos",
    desc: "Articulados e colecionáveis",
    image: "dragon-3d.jpg",
    href: "#brinquedos",
  },
  {
    id: "personalizados",
    label: "Personalizados",
    desc: "Festas, empresas e presentes únicos",
    image: "figurine-3d.jpg",
    href: "#personalizados",
    span: "lg:col-span-2",
  },
  {
    id: "profissionais",
    label: "Profissionais",
    desc: "Gabaritos e organizadores técnicos",
    image: "profissionais.jpg",
    href: "#profissionais",
  },
  {
    id: "saude-dia-a-dia",
    label: "Saúde e Dia a Dia",
    desc: "Adaptadores e utilidades ergonômicas",
    image: "saude.jpg",
    href: "#saude-dia-a-dia",
  },
  {
    id: "automotivas",
    label: "Automotivas",
    desc: "Suportes veiculares e peças custom",
    image: "automotivas.jpg",
    href: "#automotivas",
    span: "lg:col-span-2",
  }
];

export function CategoryGrid() {
  return (
    <section
      id="categorias"
      style={{
        padding: "6rem 2rem",
        background: "var(--color-surface)",
      }}
    >
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <span className="section-label">Categorias</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              color: "var(--color-fg)",
              marginTop: "0.625rem",
            }}
          >
            O que você procura?
          </h2>
        </div>

        {/* Mosaic grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: "1rem" }}
        >
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={cat.href}
              className={`group relative overflow-hidden ${cat.span ?? ""}`}
              style={{
                display: "block",
                textDecoration: "none",
                borderRadius: "0.875rem",
                aspectRatio: cat.span ? "2.4/1" : "1.1/1",
                minHeight: 200,
                overflow: "hidden",
                border: "1px solid var(--color-border)",
              }}
            >
              {/* Image */}
              <img
                src={getSafeCategoryImage(cat.id, cat.image)}
                alt={cat.label}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
                }}
                className="group-hover:scale-105"
              />

              {/* Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(9,9,14,0.88) 0%, rgba(9,9,14,0.3) 55%, rgba(9,9,14,0.05) 100%)",
                  transition: "opacity 0.35s",
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: cat.span ? "1.5rem" : "1.2rem",
                    color: "#FFFFFF",
                    marginBottom: "0.3rem",
                  }}
                >
                  {cat.label}
                </h3>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(244,244,248,0.68)",
                    marginBottom: "0.75rem",
                    lineHeight: 1.5,
                  }}
                >
                  {cat.desc}
                </p>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.78rem",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    color: "var(--color-accent)",
                    opacity: 0,
                    transition: "opacity 0.25s",
                  }}
                  className="group-hover:opacity-100"
                >
                  <ArrowRight size={15} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
