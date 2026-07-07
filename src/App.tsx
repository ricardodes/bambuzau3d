import { useState, useEffect, lazy, Suspense } from "react";
import { NavHeader } from "@/components/NavHeader";
import { Hero } from "@/components/Hero";
import { CategoryFloat } from "@/components/CategoryFloat";
import { ProductGrid } from "@/components/ProductGrid";
import { WhyUs } from "@/components/WhyUs";
import { Testimonials } from "@/components/Testimonials";
import { ContactBanner } from "@/components/ContactBanner";
import { Footer } from "@/components/Footer";
import { GlowingWaves } from "@/components/GlowingWaves";
import { MessageCircle } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";

const AdminPanel = lazy(() =>
  import("@/components/AdminPanel").then((module) => ({ default: module.AdminPanel }))
);

interface AppSettings {
  storeName: string;
  storeDescription: string;
  shopeeStoreUrl: string;
  whatsAppPhone: string;
  whatsAppMessage: string;
  whatsAppEnabled: boolean;
  socialInstagram?: string;
  socialFacebook?: string;
  socialYoutube?: string;
  socialTelegram?: string;
  wholesaleWhatsApp?: string;
  wholesaleTelegram?: string;
  logoUrl?: string;
  adminPassword?: string;
  isAdminOnline?: boolean;
  contactEmail?: string;
  useLocalDatabaseOnly?: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  storeName: "Bambuzau 3D",
  storeDescription: "Personalizados que conectam. O melhor do universo Geek, Marvel, decorações sofisticadas e impressões 3D sob medida com o mais alto nível de acabamento.",
  shopeeStoreUrl: "https://shopee.com.br/bambuzau3d",
  whatsAppPhone: "5515997788281",
  whatsAppMessage: "Olá Bambuzau 3D! Gostaria de encomendar uma peça personalizada!",
  whatsAppEnabled: true,
  socialInstagram: "bambuzau3d",
  socialFacebook: "",
  socialYoutube: "",
  socialTelegram: "",
  wholesaleWhatsApp: "5515997788281",
  wholesaleTelegram: "",
  logoUrl: "",
  adminPassword: "admin123",
  isAdminOnline: true,
  contactEmail: "bambuzau3d@gmail.com",
  useLocalDatabaseOnly: false
};

const DAMASK_WALLPAPER = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
    <defs>
      <!-- Premium 3D Satin Forest Green Gradient (Soft watermark style) -->
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E4D2B" stop-opacity="0.10" />
        <stop offset="35%" stop-color="#2A663A" stop-opacity="0.06" />
        <stop offset="75%" stop-color="#FAF6F0" stop-opacity="0.01" />
        <stop offset="100%" stop-color="#FAF6F0" stop-opacity="0" />
      </linearGradient>

      <!-- Glossy 3D Highlight in soft orange-yellow -->
      <linearGradient id="h" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#F2A202" stop-opacity="0.14" />
        <stop offset="60%" stop-color="#FAF6F0" stop-opacity="0.02" />
        <stop offset="100%" stop-color="#FAF6F0" stop-opacity="0" />
      </linearGradient>

      <!-- Delicate Drop Shadow to elevate elements softly -->
      <filter id="ds" x="-20%" y="-20%" width="150%" height="150%">
        <feDropShadow dx="1" dy="3" stdDeviation="3" flood-color="#1E4D2B" flood-opacity="0.05" />
      </filter>
    </defs>

    <g filter="url(#ds)">
      <!-- Symmetrical Center Baroque Medallion -->
      <path d="M160 30 C170 65, 195 90, 225 80 C205 115, 180 135, 160 175 C140 135, 115 115, 95 80 C125 90, 150 65, 160 30 Z" fill="url(#g)" stroke="rgba(30, 77, 43, 0.12)" stroke-width="1" />
      <path d="M160 70 C166 90, 185 100, 195 100 C178 118, 172 135, 160 150 C148 135, 142 118, 125 100 C135 100, 154 90, 160 70 Z" fill="url(#h)" />

      <!-- Ornate Foliage / Curly Scrolls Left -->
      <path d="M25 25 C55 35, 70 65, 50 90 C80 85, 110 105, 95 140 C75 130, 60 155, 75 185 C55 165, 30 170, 10 155" fill="none" stroke="url(#g)" stroke-width="8" stroke-linecap="round" />
      <path d="M25 25 C55 35, 70 65, 50 90" fill="url(#g)" />
      
      <!-- Ornate Foliage / Curly Scrolls Right -->
      <path d="M295 25 C265 35, 250 65, 270 90 C240 85, 210 105, 225 140 C245 130, 260 155, 245 185 C265 165, 290 170, 310 155" fill="none" stroke="url(#g)" stroke-width="8" stroke-linecap="round" />
      <path d="M295 25 C265 35, 250 65, 270 90" fill="url(#g)" />

      <!-- Bottom Ornate Leaves Left -->
      <path d="M25 295 C55 285, 70 255, 50 230 C80 235, 110 215, 95 180 C75 190, 60 165, 75 135 C55 155, 30 150, 10 165" fill="none" stroke="url(#g)" stroke-width="7" stroke-linecap="round" />
      <path d="M25 295 C55 285, 70 255, 50 230" fill="url(#g)" />

      <!-- Bottom Ornate Leaves Right -->
      <path d="M295 295 C265 285, 250 255, 270 230 C240 235, 210 215, 225 180 C245 190, 260 165, 245 135 C265 155, 290 150, 310 165" fill="none" stroke="url(#g)" stroke-width="7" stroke-linecap="round" />
      <path d="M295 295 C265 285, 250 255, 270 230" fill="url(#g)" />

      <!-- Seamless Connecting Waves -->
      <path d="M0 160 C55 175, 105 195, 160 195 C215 195, 265 175, 320 160" fill="none" stroke="url(#g)" stroke-width="4.5" stroke-linecap="round" />
      <path d="M0 0 C55 10, 105 35, 160 35 C215 35, 265 10, 320 0" fill="none" stroke="url(#g)" stroke-width="4.5" stroke-linecap="round" />
      <path d="M0 320 C55 310, 105 285, 160 285 C215 285, 265 310, 320 320" fill="none" stroke="url(#g)" stroke-width="4.5" stroke-linecap="round" />

      <!-- Aesthetic Accents and Dots -->
      <circle cx="160" cy="220" r="6" fill="url(#h)" stroke="rgba(30, 77, 43, 0.15)" />
      <circle cx="160" cy="242" r="4" fill="url(#h)" />
      <circle cx="90" cy="155" r="5" fill="url(#h)" />
      <circle cx="230" cy="155" r="5" fill="url(#h)" />
    </g>
  </svg>
`)}`;

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Cart State with Local Storage Persistence
  const [cart, setCart] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("bambuzau_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("bambuzau_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [cart]);

  const handleAddToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: 0,
          priceString: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    }
  };

  useEffect(() => {
    fetchSettings();
    
    const handleLocation = () => {
      const isParamAdmin = 
        window.location.hash === "#admin" || 
        window.location.pathname === "/admin" || 
        window.location.pathname === "/admin/";
      setIsAdminMode(isParamAdmin);
    };

    window.addEventListener("hashchange", handleLocation);
    window.addEventListener("popstate", handleLocation);
    handleLocation();

    return () => {
      window.removeEventListener("hashchange", handleLocation);
      window.removeEventListener("popstate", handleLocation);
    };
  }, []);

  // Refresh settings when returning from admin mode
  useEffect(() => {
    if (!isAdminMode) {
      fetchSettings();
    }
  }, [isAdminMode]);

  // Synchronize document title and description dynamically for optimal SEO
  useEffect(() => {
    if (settings) {
      const storeName = settings.storeName || "Bambuzau 3D";
      const storeDesc = settings.storeDescription || "Personalizados que conectam. O melhor do Universo Geek, decorações sofisticadas e impressões 3D sob medida com o mais alto nível de acabamento.";
      
      document.title = `${storeName} - Impressão 3D de Alta Precisão`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", storeDesc);
      }
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", `${storeName} - Impressão 3D de Alta Precisão`);
      }

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute("content", storeDesc);
      }
    }
  }, [settings]);

  const whatsAppUrl = `https://wa.me/${settings.whatsAppPhone}?text=${encodeURIComponent(settings.whatsAppMessage)}`;

  if (isAdminMode) {
    return (
      <Suspense fallback={
        <div style={{
          minHeight: "100vh",
          background: "#070708",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: "var(--font-display)",
          fontSize: "1rem"
        }}>
          Carregando painel administrativo...
        </div>
      }>
        <AdminPanel 
          onClose={() => {
            if (window.location.hash === "#admin") {
              window.location.hash = "";
            }
            if (window.location.pathname === "/admin" || window.location.pathname === "/admin/") {
              window.history.pushState({}, "", "/");
            }
            setIsAdminMode(false);
          }} 
        />
      </Suspense>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", position: "relative" }}>
      {/* Fixed nav overlays the hero */}
      <NavHeader 
        settings={settings} 
        onOpenCart={() => setCartOpen(true)}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
      />

      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero settings={settings} />

        <CategoryFloat />

        {/* Animated forest green and bamboo gold moving wave effect between categories and catalog */}
        <div style={{ position: "relative", height: "130px", overflow: "hidden", pointerEvents: "none", width: "100%", margin: "0 auto", background: "transparent" }}>
          <GlowingWaves theme="bambuzau" yOffsets={[0.42, 0.52, 0.46, 0.5]} />
          {/* Subtle smooth mask so the waves fade out horizontally and vertically */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, var(--color-bg) 0%, transparent 12%, transparent 88%, var(--color-bg) 100%), linear-gradient(to bottom, var(--color-bg) 0%, transparent 15%, transparent 85%, var(--color-bg) 100%)",
            zIndex: 2
          }} />
        </div>

        {/* Anchor targets for nav deep-links */}
        <span id="projetos-autorais" style={{ display: "block", marginTop: "-80px", paddingTop: "80px" }} />
        <span id="geek-marvel"     style={{ display: "block", marginTop: "-80px", paddingTop: "80px" }} />
        <span id="decorativos"     style={{ display: "block" }} />
        <span id="personalizados"  style={{ display: "block" }} />

        {/* PORTFÓLIO CONCEITUAL / PROJETOS AUTORAIS 3D SECTION with dark green background */}
        <section
          style={{
            padding: "6rem 2rem 5rem 2rem",
            background: "#0A2413", // Deep dark green requested by user
            color: "#FFFFFF",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <span
              style={{
                color: "var(--color-accent-light)",
                fontSize: "0.825rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.875rem",
              }}
            >
              PORTFÓLIO CONCEITUAL
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4.5vw, 2.75rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.025em",
                marginBottom: "1rem",
              }}
            >
              Projetos Autorais 3D
            </h2>
            <div
              style={{
                width: "48px",
                height: "2px",
                background: "var(--color-accent-light)",
                margin: "1.25rem auto",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.05rem",
                lineHeight: 1.75,
                color: "rgba(244, 244, 248, 0.72)",
                maxWidth: "640px",
                margin: "0 auto",
              }}
            >
              Visualizações realistas criadas com precisão milimétrica para antecipar sensações, harmonizar espaços e garantir execuções impecáveis.
            </p>
          </div>
        </section>

        <ProductGrid 
          onAddToCart={handleAddToCart}
          onOpenCart={() => setCartOpen(true)}
        />

        {/* Seamless high-end 3D embossed light organic wallpaper section encompassing WhyUs and Testimonials */}
        <div
          style={{
            position: "relative",
            background: `
              radial-gradient(circle at center, rgba(30, 77, 43, 0.03) 0%, rgba(230, 239, 228, 0.35) 100%),
              url("${DAMASK_WALLPAPER}")
            `,
            backgroundSize: "auto, 280px 280px, auto",
            backgroundRepeat: "no-repeat, repeat, no-repeat",
          }}
        >
          {/* Gentle, seamless transition with absolutely no banding lines and lighter at the bottom */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 0%, transparent 10%, transparent 90%, transparent 100%)",
            pointerEvents: "none"
          }} />
          
          <WhyUs />
          <Testimonials />
        </div>

        <ContactBanner settings={settings} />
      </main>

      <Footer settings={settings} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        whatsAppPhone={settings.whatsAppPhone}
        storeName={settings.storeName}
      />

      {/* WhatsApp FAB */}
      {settings.whatsAppEnabled && (
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Fale conosco pelo WhatsApp"
          style={{
            position: "fixed",
            bottom: "1.75rem",
            right: "1.75rem",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#25D366",
            color: "#fff",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.82rem",
            padding: "0.75rem 1.25rem",
            borderRadius: "2rem",
            textDecoration: "none",
            boxShadow: "0 8px 28px rgba(37,211,102,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.boxShadow = "0 12px 36px rgba(37,211,102,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,211,102,0.4)";
          }}
        >
          <MessageCircle size={17} />
          <span className="hidden sm:inline">Fale conosco</span>
        </a>
      )}
    </div>
  );
}

export default App;
