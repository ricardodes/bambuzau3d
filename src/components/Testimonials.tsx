import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Ana Paula",
    role: "Cliente · São Paulo, SP",
    avatar: "AP",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    text: "Comprei o dragão articulado para o meu filho e ele ficou apaixonado! A qualidade é incrível, parece brinquedo de loja importada. Chegou bem embalado e antes do prazo.",
    product: "Dragão Articulado",
  },
  {
    name: "Marcos Souza",
    role: "Aquarista · Belo Horizonte, MG",
    avatar: "MS",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    text: "As peças para aquário são perfeitas! Resistentes, detalhadas e os peixes adoraram. Pedi personalizadas com o formato que eu queria e o resultado superou expectativas.",
    product: "Decoração de Aquário",
  },
  {
    name: "Juliana Torres",
    role: "Org. de Eventos · Rio de Janeiro, RJ",
    avatar: "JT",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    text: "Encomendei os personalizados para uma festa de 15 anos e ficaram simplesmente lindos. Todos os convidados perguntaram onde comprei. Já indiquei para vários clientes!",
    product: "Kit Festa Personalizado",
  },
  {
    name: "Roberto Lima",
    role: "Empresário · Curitiba, PR",
    avatar: "RL",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    text: "Pedi brindes personalizados para minha empresa com nosso logo e ficaram incríveis. Prazo cumprido, atendimento excelente pelo WhatsApp. Já fiz o segundo pedido!",
    product: "Brinde Corporativo",
  },
  {
    name: "Camila Ferreira",
    role: "Decoradora · Porto Alegre, RS",
    avatar: "CF",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    text: "Utilizo as peças nos meus projetos de design de interiores. Os clientes ficam encantados com a originalidade e acabamento. Preço justo e qualidade superior.",
    product: "Escultura Abstrata",
  },
  {
    name: "Pedro Gomes",
    role: "Colecionador · Florianópolis, SC",
    avatar: "PG",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    text: "Tenho vários itens do catálogo e cada um é uma obra de arte. O mago colecionável ficou magnífico. Dá pra sentir a paixão em cada peça. Recomendo demais!",
    product: "Mago Colecionável",
  },
];

export function Testimonials() {
  return (
    <section
      id="depoimentos"
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
            marginBottom: "3rem",
          }}
        >
          <div>
            <span className="section-label">Depoimentos</span>
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
              O que nossos clientes dizem
            </h2>
          </div>

          {/* Shopee rating badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.625rem",
              background: "var(--color-shopee-soft)",
              border: "1px solid rgba(238,77,45,0.2)",
            }}
          >
            <div style={{ display: "flex", gap: 2 }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={13} style={{ fill: "#FACC15", color: "#FACC15" }} />
              ))}
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "var(--color-fg)",
              }}
            >
              4.9/5
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--color-fg-muted)" }}>
              +2.400 avaliações
            </span>
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: "1rem" }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="card"
              style={{ padding: "1.625rem", display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Quote size={22} style={{ color: "var(--color-accent)", opacity: 0.5 }} />

              <div style={{ display: "flex", gap: 3 }}>
                {[1,2,3,4,5].map(j => (
                  <Star key={j} size={12} style={{ fill: "#FACC15", color: "#FACC15" }} />
                ))}
              </div>

              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-fg-muted)",
                  lineHeight: 1.7,
                  flex: 1,
                }}
              >
                "{t.text}"
              </p>

              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: "var(--color-accent)",
                  background: "var(--color-accent-soft)",
                  padding: "0.28rem 0.7rem",
                  borderRadius: "2rem",
                  alignSelf: "flex-start",
                }}
              >
                {t.product}
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  paddingTop: "0.875rem",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--color-accent), var(--color-bamboo))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    flexShrink: 0,
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                  }}
                >
                  {t.photoUrl ? (
                    <img 
                      src={t.photoUrl} 
                      alt={t.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    t.avatar
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "var(--color-fg)",
                    }}
                  >
                    {t.name}
                  </p>
                  <p style={{ fontSize: "0.73rem", color: "var(--color-fg-muted)" }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
