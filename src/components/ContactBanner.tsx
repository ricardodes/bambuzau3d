import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

interface ContactBannerProps {
  settings?: {
    storeName?: string;
    shopeeStoreUrl: string;
    whatsAppPhone: string;
    whatsAppMessage: string;
    isAdminOnline?: boolean;
    contactEmail?: string;
  };
}

export function ContactBanner({ settings }: ContactBannerProps) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", messageText: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const whatsAppPhone = settings?.whatsAppPhone || "5511999999999";
  const isAdminOnline = settings?.isAdminOnline ?? true;
  const storeName = settings?.storeName || "Bambuzau 3D";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.messageText) {
      alert("Por favor, preencha os campos obrigatórios (Nome, E-mail e Mensagem).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          messageText: formData.messageText,
          read: false,
          replied: false,
          createdAt: new Date().toISOString()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        const submittedName = formData.name;
        const submittedMsg = formData.messageText;
        const submittedEmail = formData.email;

        setFormData({ name: "", email: "", phone: "", messageText: "" });

        // If admin is online, redirect to WhatsApp for instant reply!
        if (isAdminOnline && whatsAppPhone) {
          const cleanPhone = whatsAppPhone.replace(/\D/g, "");
          const text = `Olá! Enviei um contato pelo site da ${storeName}:\n\n*Nome:* ${submittedName}\n*E-mail:* ${submittedEmail}\n*Mensagem:* ${submittedMsg}`;
          setTimeout(() => {
            window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, "_blank");
          }, 1200);
        }
      } else {
        alert("Erro ao enviar: " + (data.error || "Erro interno"));
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar mensagem de contato.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="personalizados"
      style={{ padding: "6rem 2rem", background: "transparent" }}
    >
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        <div
          className="grid grid-cols-1 lg:grid-cols-12"
          style={{
            borderRadius: "1.25rem",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            background: "linear-gradient(135deg, var(--color-accent) 0%, #112B18 100%)",
            boxShadow: "0 16px 40px rgba(30, 77, 43, 0.12)",
            padding: "3rem",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* Left Column - Copy - lg:col-span-5 */}
          <div className="lg:col-span-5">
            <span className="section-label" style={{ color: "var(--color-accent-light)", letterSpacing: "0.18em" }}>Personalizados & Encomendas</span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                letterSpacing: "-0.025em",
                color: "#FFFFFF",
                lineHeight: 1.2,
                marginTop: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              Fale Conosco & Faça seu Orçamento
            </h2>
            <p
              style={{
                fontSize: "0.92rem",
                color: "rgba(255, 255, 255, 0.85)",
                lineHeight: 1.75,
                marginBottom: "2rem",
              }}
            >
              Personalizamos peças com seu nome, logo, tema ou design exclusivo.
              Topos de bolo, lembranças de casamento, brindes corporativos e decoração sob medida. Preencha o formulário e fale diretamente com o nosso time!
            </p>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a
                href={`https://wa.me/${whatsAppPhone.replace(/\D/g, "")}?text=${encodeURIComponent("Olá! Gostaria de fazer um orçamento para um produto personalizado.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ padding: "0.75rem 1.5rem", borderRadius: "1.5rem" }}
              >
                <CheckCircle2 size={16} />
                Orçamento via WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column - Beautiful Live Contact Form - lg:col-span-7 */}
          <div className="lg:col-span-7" style={{ background: "#FFFFFF", border: "1px solid rgba(30, 77, 43, 0.1)", padding: "2rem", borderRadius: "1rem", boxShadow: "0 12px 32px rgba(0, 0, 0, 0.05)" }}>
            
            {/* Real-time Online/Offline status badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--color-fg-muted)", fontWeight: 600, fontFamily: "var(--font-display)" }}>
                CANAL DE ATENDIMENTO
              </span>
              
              {isAdminOnline ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(30,77,43,0.08)", border: "1px solid var(--color-border)", padding: "0.35rem 0.75rem", borderRadius: "2rem", color: "var(--color-accent)", fontSize: "0.78rem", fontWeight: 700 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)", boxShadow: "0 0 8px var(--color-accent)", display: "inline-block" }} />
                  Suporte Online (WhatsApp)
                </div>
              ) : (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", padding: "0.35rem 0.75rem", borderRadius: "2rem", color: "#F59E0B", fontSize: "0.78rem", fontWeight: 700 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />
                  Offline (Resposta por E-mail)
                </div>
              )}
            </div>

            {success ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ display: "inline-flex", padding: "1rem", borderRadius: "50%", background: "rgba(30,77,43,0.08)", color: "var(--color-accent)", marginBottom: "1rem" }}>
                  <CheckCircle2 size={40} />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-fg)", fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
                  Mensagem Enviada!
                </h3>
                <p style={{ color: "var(--color-fg-muted)", fontSize: "0.88rem", maxWidth: "340px", margin: "0 auto 1.5rem", lineHeight: 1.5 }}>
                  {isAdminOnline 
                    ? "Iniciando redirecionamento para o nosso WhatsApp para que você receba um atendimento instantâneo..."
                    : "Sua mensagem foi enviada à nossa caixa de entrada e será respondida diretamente em seu e-mail!"
                  }
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  style={{ background: "transparent", border: "1px solid var(--color-border)", color: "var(--color-fg)", padding: "0.5rem 1.2rem", borderRadius: "0.5rem", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  Enviar Outra Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }} className="grid grid-cols-1 sm:grid-cols-2">
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "var(--color-fg-muted)", marginBottom: "0.4rem", fontWeight: 500 }}>Seu Nome*</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: João Silva"
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid var(--color-border)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "var(--color-fg)", fontSize: "0.85rem", transition: "all 0.2s" }}
                      className="focus:border-[var(--color-accent)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "var(--color-fg-muted)", marginBottom: "0.4rem", fontWeight: 500 }}>Seu E-mail*</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Ex: joao@email.com"
                      style={{ width: "100%", background: "#FFFFFF", border: "1px solid var(--color-border)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "var(--color-fg)", fontSize: "0.85rem", transition: "all 0.2s" }}
                      className="focus:border-[var(--color-accent)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "var(--color-fg-muted)", marginBottom: "0.4rem", fontWeight: 500 }}>WhatsApp (Opcional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: 11999999999"
                    style={{ width: "100%", background: "#FFFFFF", border: "1px solid var(--color-border)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "var(--color-fg)", fontSize: "0.85rem", transition: "all 0.2s" }}
                    className="focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "var(--color-fg-muted)", marginBottom: "0.4rem", fontWeight: 500 }}>Mensagem / Orçamento personalizado*</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.messageText}
                    onChange={e => setFormData({ ...formData, messageText: e.target.value })}
                    placeholder="Diga-nos o que você deseja criar! Ex: Gostaria de imprimir um busto de 15cm do Darth Vader..."
                    style={{ width: "100%", background: "#FFFFFF", border: "1px solid var(--color-border)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "var(--color-fg)", fontSize: "0.85rem", resize: "none", lineHeight: 1.45, transition: "all 0.2s" }}
                    className="focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-whatsapp"
                  style={{
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "1.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-display)",
                    cursor: submitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "opacity 0.2s"
                  }}
                >
                  <Send size={15} />
                  {submitting ? "Enviando..." : (isAdminOnline ? "Falar com Atendimento Online" : "Enviar Mensagem por E-mail")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
