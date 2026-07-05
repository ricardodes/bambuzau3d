import { useState, useEffect } from "react";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { getSafeProductImage } from "@/lib/safe-images";

const SHOPEE_STORE = "https://shopee.com.br/bambuzau3d";

interface Product {
  id: number;
  name: string;
  category: string;
  categoryId: string;
  price: string;
  oldPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  shopeeUrl: string;
  desc: string;
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Busto Homem de Ferro Mark LXXXV",
    category: "Universo Geek",
    categoryId: "geek-marvel",
    price: "R$ 189,90",
    oldPrice: "R$ 249,90",
    rating: 4.9,
    reviews: 84,
    image: "figurine-3d.jpg",
    badge: "Edição Especial",
    shopeeUrl: SHOPEE_STORE,
    desc: "Busto detalhado do Homem de Ferro em filamento silk metálico brilhante de alta precisão.",
  },
  {
    id: 2,
    name: "Martelo Mjölnir de Thor Porta-Copos",
    category: "Universo Geek",
    categoryId: "geek-marvel",
    price: "R$ 119,90",
    rating: 4.8,
    reviews: 62,
    image: "support-3d.jpg",
    badge: "Exclusivo",
    shopeeUrl: SHOPEE_STORE,
    desc: "Base com design do Mjölnir contendo 4 porta-copos temáticos esculpidos em 3D.",
  },
  {
    id: 3,
    name: "Vaso Ecológico Baby Groot",
    category: "Universo Geek",
    categoryId: "geek-marvel",
    price: "R$ 79,90",
    oldPrice: "R$ 99,90",
    rating: 5.0,
    reviews: 145,
    image: "pet-3d.jpg",
    badge: "Mais Vendido",
    shopeeUrl: SHOPEE_STORE,
    desc: "Vaso de suculentas esculpido como o Baby Groot, impresso em material biodegradável.",
  },
  {
    id: 4,
    name: "Dragão de Bambu Articulado",
    category: "Decoração & Vasos",
    categoryId: "decorativos",
    price: "R$ 159,90",
    oldPrice: "R$ 199,90",
    rating: 4.9,
    reviews: 112,
    image: "dragon-3d.jpg",
    badge: "Sucesso de Vendas",
    shopeeUrl: SHOPEE_STORE,
    desc: "Dragão flexível feito em filamento degradê verde e ouro, inspirado na marca Bambuzau.",
  },
  {
    id: 5,
    name: "Lustre Geométrico Bambuzau",
    category: "Decoração & Vasos",
    categoryId: "decorativos",
    price: "R$ 299,90",
    oldPrice: "R$ 389,90",
    rating: 5.0,
    reviews: 28,
    image: "lustres.jpg",
    badge: "Design Autoral",
    shopeeUrl: SHOPEE_STORE,
    desc: "Luminária pendente de teto com traços geométricos modernos que projetam sombras incríveis.",
  },
  {
    id: 6,
    name: "Suporte de Headset Stark Industries",
    category: "Universo Geek",
    categoryId: "geek-marvel",
    price: "R$ 94,90",
    rating: 4.8,
    reviews: 57,
    image: "support-3d.jpg",
    badge: "Setup Geek",
    shopeeUrl: SHOPEE_STORE,
    desc: "Suporte premium para fone de ouvido gamer com detalhes e logo da Stark Industries.",
  },
  {
    id: 7,
    name: "Organizador Hexagonal Colmeia",
    category: "Utilidades Gerais",
    categoryId: "utilidades",
    price: "R$ 119,90",
    rating: 4.9,
    reviews: 73,
    image: "organizer-3d.webp",
    badge: "Prático",
    shopeeUrl: SHOPEE_STORE,
    desc: "Organizador de mesa modular expansível com encaixes perfeitos em estilo colmeia.",
  },
  {
    id: 8,
    name: "Placa Decorativa Nome Personalizado",
    category: "Personalizados",
    categoryId: "personalizados",
    price: "Sob encomenda",
    rating: 5.0,
    reviews: 139,
    image: "event-3d.jpg",
    badge: "100% Customizável",
    shopeeUrl: SHOPEE_STORE,
    desc: "Deixe seu setup com sua cara! Placa 3D com seu nome ou logo em relevo com cores personalizadas.",
  },
  {
    id: 9,
    name: "Mini Vaso Facetado Origami",
    category: "Decoração & Vasos",
    categoryId: "decorativos",
    price: "R$ 49,90",
    rating: 4.7,
    reviews: 35,
    image: "vase-3d.jpg",
    badge: "Minimalista",
    shopeeUrl: SHOPEE_STORE,
    desc: "Vaso decorativo low-poly com acabamento brilhante metálico, ideal para lavabos e escritórios.",
  },
  {
    id: 10,
    name: "Chaveiros Geek Personalizados (Kit 5x)",
    category: "Personalizados",
    categoryId: "personalizados",
    price: "R$ 39,90",
    rating: 5.0,
    reviews: 204,
    image: "figurine-3d.jpg",
    badge: "Brinde Perfeito",
    shopeeUrl: SHOPEE_STORE,
    desc: "Kit com 5 chaveiros em alto relevo com logos de super-heróis, games, Star Wars ou sua marca.",
  },
  {
    id: 11,
    name: "Comedouro Elevado Ergonômico Pet",
    category: "Utilidades Gerais",
    categoryId: "utilidades",
    price: "R$ 129,90",
    oldPrice: "R$ 159,90",
    rating: 4.9,
    reviews: 48,
    image: "pet-3d.jpg",
    badge: "Ergonômico",
    shopeeUrl: SHOPEE_STORE,
    desc: "Comedouro elevado para cães e gatos de pequeno porte, melhorando a postura durante a alimentação.",
  },
  {
    id: 12,
    name: "Suporte de Celular & Tablet Articulado",
    category: "Utilidades Gerais",
    categoryId: "utilidades",
    price: "R$ 34,90",
    rating: 4.8,
    reviews: 91,
    image: "utility-3d.jpg",
    badge: "Portátil",
    shopeeUrl: SHOPEE_STORE,
    desc: "Suporte dobrável de bolso compatível com qualquer modelo de smartphone ou tablet."
  }
];

interface ProductGridProps {
  onAddToCart?: (product: any) => void;
  onOpenCart?: () => void;
}

export function ProductGrid({ onAddToCart, onOpenCart }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);

  const [filters, setFilters] = useState<{ id: string; label: string }[]>([
    { id: "all", label: "Todos os produtos" },
    { id: "geek-marvel", label: "Universo Geek" },
    { id: "decorativos", label: "Decoração & Vasos" },
    { id: "personalizados", label: "Personalizados" },
    { id: "utilidades", label: "Utilidades Gerais" },
    { id: "aquario", label: "Aquário" },
    { id: "automotivas", label: "Automotivas" },
    { id: "brinquedos", label: "Brinquedos" },
    { id: "datas-festivas", label: "Datas Festivas" },
    { id: "eventos", label: "Eventos" },
    { id: "lustres", label: "Lustres" },
    { id: "pets", label: "Pets" },
    { id: "profissionais", label: "Profissionais" },
    { id: "saude-dia-a-dia", label: "Saúde e Dia a Dia" },
    { id: "suportes", label: "Suportes" }
  ]);
  const [active, setActive] = useState("all");
  const [liked, setLiked] = useState<number[]>([]);

  // Fetch products and categories dynamically from Firestore API
  useEffect(() => {
    // Fetch Categories to build dynamic filters
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories && data.categories.length > 0) {
          const dynamicFilters = [
            { id: "all", label: "Todos os produtos" },
            ...data.categories.map((cat: any) => ({
              id: cat.id,
              label: cat.label
            }))
          ];
          setFilters(dynamicFilters);
        }
      })
      .catch((err) => console.error("Error loading categories for filters:", err));

    // Fetch Products
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  // Helper to identify best sellers (mais vendidos)
  const isBestSeller = (p: Product) => {
    const badgeLower = (p.badge || "").toLowerCase();
    return (
      badgeLower.includes("vendido") ||
      badgeLower.includes("campeão") ||
      badgeLower.includes("sucesso") ||
      badgeLower.includes("destaque") ||
      p.rating >= 4.9 && p.reviews >= 40
    );
  };

  // Sort: Best sellers first, then sort by reviews count descend
  const sortedProducts = [...products].sort((a, b) => {
    const aBest = isBestSeller(a) ? 1 : 0;
    const bBest = isBestSeller(b) ? 1 : 0;
    if (aBest !== bBest) return bBest - aBest;
    return b.reviews - a.reviews;
  });

  // Calculate ranks of each best-seller in the sorted products
  const bestSellerRanks: Record<number, number> = {};
  let bestSellerCount = 0;
  sortedProducts.forEach((p) => {
    if (isBestSeller(p)) {
      bestSellerCount++;
      bestSellerRanks[p.id] = bestSellerCount;
    }
  });

  // Listen to hash change to support smooth scrolling but KEEP "Todos" active in the catalog
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        // Find if there is an anchored element for smooth scrolling
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
        // Always reset active to "all" (Todos) when externally navigating so catalog never leaves Todos
        setActive("all");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Call once on mount
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const filtered =
    active === "all" ? sortedProducts : products.filter((p) => p.categoryId === active);

  return (
    <section
      id="catalogo"
      style={{ padding: "6rem 2rem", background: "transparent" }}
    >
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <span className="section-label">Coleções</span>
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
              Catálogo Completo
            </h2>
          </div>
          <button
            onClick={() => onOpenCart?.()}
            className="btn-whatsapp"
            style={{ fontSize: "0.825rem", padding: "0.6rem 1.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <ShoppingCart size={14} />
            Ver Meu Carrinho
          </button>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setActive(f.id);
                // Also update the hash for seamless navigation sharing
                if (f.id === "all") {
                  window.history.pushState(null, "", window.location.pathname);
                } else {
                  window.location.hash = f.id;
                }
              }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.8rem",
                fontWeight: 600,
                padding: "0.5rem 1.1rem",
                borderRadius: "2rem",
                border: active === f.id ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                background: active === f.id ? "var(--color-accent-soft)" : "transparent",
                color: active === f.id ? "var(--color-accent)" : "var(--color-fg-muted)",
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.01em",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{ gap: "1.125rem" }}
        >
          {filtered.map((product) => (
            <div key={product.id} className="card" style={{ display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              {/* Badges and Wishlist on top row of card */}
              <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", right: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
                 {/* Golden Rank Badge for Best Sellers, or fallback standard badge */}
                {active === "all" && bestSellerRanks[product.id] ? (
                  <span
                    style={{
                      background: "linear-gradient(135deg, #DFB35A 0%, #B5893D 50%, #906B2E 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.45)",
                      color: "#121214",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.65rem",
                      fontWeight: 850,
                      letterSpacing: "0.02em",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 12px rgba(223, 179, 90, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.2rem",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 900 }}>#{bestSellerRanks[product.id]}</span>
                    <span>Mais Vendido</span>
                  </span>
                ) : (
                  product.badge ? (
                    <span
                      style={{
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-accent)",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "2rem",
                      }}
                    >
                      {product.badge}
                    </span>
                  ) : <div />
                )}

                {/* Wishlist */}
                <button
                  aria-label="Favoritar"
                  onClick={() =>
                    setLiked((prev) =>
                      prev.includes(product.id)
                        ? prev.filter((id) => id !== product.id)
                        : [...prev, product.id]
                    )
                  }
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <Heart
                    size={12}
                    style={{
                      color: liked.includes(product.id) ? "#EF4444" : "var(--color-fg-muted)",
                      fill: liked.includes(product.id) ? "#EF4444" : "none",
                    }}
                  />
                </button>
              </div>

              {/* Centered Large Product Image */}
              <div
                className="group"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "260px",
                  overflow: "hidden",
                  borderRadius: "0.75rem 0.75rem 0 0",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <img
                  src={getSafeProductImage(product.id, product.image)}
                  alt={product.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.45s ease",
                  }}
                  className="group-hover:scale-110"
                />
              </div>

              {/* Info */}
              <div
                style={{
                  padding: "1rem 1.125rem 1.125rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                  }}
                >
                  {product.category}
                </span>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.975rem",
                    color: "var(--color-fg)",
                    lineHeight: 1.3,
                  }}
                >
                  {product.name}
                </h3>

                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--color-fg-muted)",
                    lineHeight: 1.55,
                    flex: 1,
                  }}
                >
                  {product.desc}
                </p>

                {/* Rating */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  {[1,2,3,4,5].map((i) => (
                    <Star
                      key={i}
                      size={11}
                      style={{
                        fill: i <= Math.floor(product.rating) ? "#FACC15" : "none",
                        color: i <= Math.floor(product.rating) ? "#FACC15" : "var(--color-muted)",
                      }}
                    />
                  ))}
                  <span style={{ fontSize: "0.73rem", color: "var(--color-fg-muted)", marginLeft: 2 }}>
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0.625rem",
                    borderTop: "1px solid var(--color-border)",
                    marginTop: "auto",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 750,
                        fontSize: "0.95rem",
                        color: "var(--color-fg)",
                      }}
                    >
                      {product.price}
                    </span>
                    {product.oldPrice && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          textDecoration: "line-through",
                          color: "var(--color-fg-muted)",
                          opacity: 0.7,
                        }}
                      >
                        {product.oldPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onAddToCart?.(product)}
                    className="btn-whatsapp"
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.45rem 0.85rem",
                      borderRadius: "1.5rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      cursor: "pointer",
                    }}
                  >
                    <ShoppingCart size={11} />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
