import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingCart, MessageCircle } from "lucide-react";
import { getSafeProductImage } from "@/lib/safe-images";

interface CartItem {
  id: number;
  name: string;
  price: number;
  priceString: string;
  image: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  whatsAppPhone: string;
  storeName: string;
}

function parsePrice(priceStr: string): number {
  if (!priceStr || priceStr.toLowerCase().includes("encomenda") || priceStr.toLowerCase().includes("consulta")) {
    return 0;
  }
  const clean = priceStr.replace("R$", "").replace(/\s/g, "").replace(".", "").replace(",", ".");
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  whatsAppPhone,
  storeName,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const [isWholesale, setIsWholesale] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Calculate subtotal
  let subtotal = 0;
  let hasSobConsulta = false;
  cart.forEach((item) => {
    const itemPrice = parsePrice(item.priceString);
    if (itemPrice === 0) {
      hasSobConsulta = true;
    }
    subtotal += itemPrice * item.quantity;
  });

  // Determine if there is any item with a quantity suggesting wholesale (e.g. >= 5 units of a single product, or >= 10 total products)
  const hasWholesaleQuantities = cart.some(item => item.quantity >= 5) || totalItems >= 10;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    let message = `🎋 *${storeName.toUpperCase()} - NOVO PEDIDO* 🎋\n`;
    message += `─────────────────────────\n\n`;
    
    if (isWholesale) {
      message += `💼 *SOLICITAÇÃO DE ORÇAMENTO (ATACADO / REVENDA)*\n`;
      message += `_Interesse em preços e condições especiais para maiores volumes_\n\n`;
    } else {
      message += `🛒 *DETALHES DO PEDIDO (VAREJO):*\n\n`;
    }

    message += `📋 *ITENS SOLICITADOS:*\n\n`;

    cart.forEach((item, index) => {
      const itemPrice = parsePrice(item.priceString);
      const isCustom = itemPrice === 0;
      const unitValue = isCustom ? "Sob consulta" : item.priceString;
      const subtotalValue = isCustom ? "A combinar" : `R$ ${(itemPrice * item.quantity).toFixed(2).replace(".", ",")}`;
      
      const numEmoji = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"][index] || "•";
      
      message += `${numEmoji} *[${item.quantity}x]* _${item.name}_\n`;
      message += `   • Valor un.: ${unitValue}\n`;
      message += `   • Subtotal: ${subtotalValue}\n`;
      
      if (item.quantity >= 5) {
        message += `   ⚠️ _(Item com volume de Atacado!)_\n`;
      }
      message += `\n`;
    });

    message += `─────────────────────────\n`;
    message += `📦 *RESUMO DO PEDIDO:*\n`;
    message += `• *Total de Itens:* ${totalItems} ${totalItems === 1 ? "peça" : "peças"}\n`;
    
    if (hasSobConsulta) {
      message += `• *Valor Total Estimado:* R$ ${subtotal.toFixed(2).replace(".", ",")} _*(itens personalizados a combinar)*_\n`;
    } else {
      message += `• *Valor Total:* R$ ${subtotal.toFixed(2).replace(".", ",")}\n`;
    }
    
    if (isWholesale) {
      message += `• *Tipo:* 📥 Atacado / Revenda (Aguardando proposta)\n`;
    } else if (hasWholesaleQuantities) {
      message += `• *Nota:* Pedido qualificado para possível negociação de atacado.\n`;
    }
    
    message += `─────────────────────────\n\n`;
    message += `💬 *MENSAGEM:*\n`;
    if (isWholesale) {
      message += `Olá! Gostaria de receber o orçamento com condições especiais de atacado/revenda para os itens acima, bem como prazos de produção e opções de entrega. Obrigado!`;
    } else {
      message += `Olá! Gostaria de confirmar o prazo de produção para os itens selecionados, além de consultar as opções de frete/entrega e formas de pagamento.`;
    }

    const cleanPhone = whatsAppPhone.replace(/\D/g, "");
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      id="cart-drawer-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        justifyContent: "flex-end",
        background: "rgba(22, 41, 28, 0.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "var(--color-bg)",
          height: "100%",
          boxShadow: "-10px 0 35px rgba(30, 77, 43, 0.12)",
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid var(--color-border)",
          animation: "slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        {/* Style block for animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slide-in {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}} />

        {/* Header */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--color-surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "var(--color-accent-soft)",
                color: "var(--color-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingCart size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-fg)" }}>
                Meu Carrinho
              </h3>
              <p style={{ fontSize: "0.75rem", color: "var(--color-fg-muted)" }}>
                {totalItems} {totalItems === 1 ? "item adicionado" : "itens adicionados"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar Carrinho"
            style={{
              background: "none",
              border: "none",
              color: "var(--color-fg-muted)",
              cursor: "pointer",
              padding: "0.4rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-border)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {cart.length === 0 ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: "var(--color-border)",
                  color: "var(--color-fg-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  opacity: 0.8,
                }}
              >
                <ShoppingCart size={32} />
              </div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-fg)", marginBottom: "0.5rem" }}>
                Seu carrinho está vazio
              </h4>
              <p style={{ fontSize: "0.82rem", color: "var(--color-fg-muted)", maxWidth: "260px", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                Navegue pelo nosso catálogo e adicione suas peças favoritas para encomendar via WhatsApp.
              </p>
              <button
                onClick={onClose}
                className="btn-whatsapp"
                style={{ fontSize: "0.8rem", padding: "0.6rem 1.25rem" }}
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {cart.map((item) => {
                return (
                  <div
                    key={item.id}
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.75rem",
                      padding: "0.875rem",
                      display: "flex",
                      gap: "0.875rem",
                      alignItems: "center",
                    }}
                  >
                    {/* Rounded Image as requested */}
                    <img
                      src={getSafeProductImage(item.id, item.image)}
                      alt={item.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "1px solid var(--color-border)",
                      }}
                    />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: "var(--color-fg)",
                          margin: "0 0 0.25rem 0",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </h4>
                      <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-accent)", margin: "0 0 0.5rem 0" }}>
                        {item.priceString}
                      </p>

                      {/* Controls */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            background: "var(--color-bg)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "0.5rem",
                            overflow: "hidden",
                          }}
                        >
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: "0.3rem 0.5rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              color: "var(--color-fg-muted)",
                            }}
                          >
                            <Minus size={12} />
                          </button>
                          <span
                            style={{
                              padding: "0 0.5rem",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              color: "var(--color-fg)",
                              minWidth: "1.5rem",
                              textAlign: "center",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: "0.3rem 0.5rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              color: "var(--color-fg-muted)",
                            }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          aria-label="Excluir item"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#EF4444",
                            cursor: "pointer",
                            padding: "0.3rem",
                            borderRadius: "0.37rem",
                            display: "flex",
                            alignItems: "center",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#FEE2E2")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div
            style={{
              padding: "1.5rem",
              borderTop: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Atacado Hint & Checkbox */}
            <div 
              style={{
                background: isWholesale ? "rgba(74, 222, 128, 0.05)" : "rgba(255, 255, 255, 0.01)",
                border: isWholesale ? "1px solid rgba(74, 222, 128, 0.2)" : "1px solid var(--color-border)",
                borderRadius: "0.625rem",
                padding: "0.75rem 0.875rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
                transition: "all 0.2s"
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", userSelect: "none", margin: 0 }}>
                <input 
                  type="checkbox"
                  checked={isWholesale}
                  onChange={(e) => setIsWholesale(e.target.checked)}
                  style={{
                    accentColor: "var(--color-accent)",
                    width: "16px",
                    height: "16px",
                    cursor: "pointer"
                  }}
                />
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-fg)" }}>
                  Solicitar orçamento para Atacado / Revenda
                </span>
              </label>
              <p style={{ fontSize: "0.72rem", color: "var(--color-fg-muted)", lineHeight: 1.4, margin: 0, paddingLeft: "1.5rem" }}>
                Ative esta opção se deseja consultar descontos especiais de atacado ou revenda para volumes de peças 3D.
              </p>
              {hasWholesaleQuantities && !isWholesale && (
                <div style={{ paddingLeft: "1.5rem", marginTop: "0.25rem" }}>
                  <span style={{ 
                    fontSize: "0.68rem", 
                    background: "rgba(223, 179, 90, 0.12)", 
                    color: "#DFB35A", 
                    padding: "0.15rem 0.45rem", 
                    borderRadius: "0.25rem",
                    fontWeight: 600,
                    display: "inline-block"
                  }}>
                    💡 Recomendado: Seu carrinho possui maior volume de itens!
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-fg-muted)" }}>
                Valor Total Estimado:
              </span>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--color-fg)" }}>
                  R$ {subtotal.toFixed(2).replace(".", ",")}
                </span>
                {hasSobConsulta && (
                  <p style={{ fontSize: "0.68rem", color: "var(--color-bamboo)", fontWeight: 500, marginTop: "2px" }}>
                    *Alguns itens sob consulta
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <button
                onClick={handleCheckout}
                className="btn-whatsapp"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  padding: "0.875rem",
                  borderRadius: "0.75rem",
                }}
              >
                <MessageCircle size={18} />
                Enviar Pedido via WhatsApp
              </button>

              <button
                onClick={onClearCart}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-fg-muted)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "0.4rem",
                  textDecoration: "underline",
                  opacity: 0.8,
                  alignSelf: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
              >
                Limpar carrinho
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
