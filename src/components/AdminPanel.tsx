import { useState, useEffect } from "react";
import { getSafeProductImage } from "@/lib/safe-images";
import { 
  ShoppingBag, 
  MessageSquare, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  Globe, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Settings,
  Upload,
  Database,
  RefreshCw,
  Download
} from "lucide-react";

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
}

interface AdminPanelProps {
  onClose: () => void;
}

const CATEGORIES_MAPPING = [
  { id: "decorativos", label: "Decorativos" },
  { id: "lustres", label: "Lustres" },
  { id: "aquario", label: "Aquário" },
  { id: "brinquedos", label: "Brinquedos" },
  { id: "personalizados", label: "Personalizados" },
  { id: "pets", label: "Pets" },
  { id: "suportes", label: "Suportes" },
  { id: "organizacao", label: "Organização" },
  { id: "datas-festivas", label: "Datas Festivas" },
  { id: "eventos", label: "Eventos" },
  { id: "utilidades", label: "Utilidades" },
  { id: "profissionais", label: "Profissionais" },
  { id: "saude-dia-a-dia", label: "Saúde e Dia a Dia" },
  { id: "automotivas", label: "Automotivas" }
];

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"products" | "shopee" | "whatsapp" | "general" | "messages" | "backup">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    storeName: "Bambuzau 3D",
    storeDescription: "Personalizados que conectam. O melhor do universo Geek, Marvel, decorações sofisticadas e impressões 3D sob medida com o mais alto nível de acabamento.",
    shopeeStoreUrl: "https://shopee.com.br/bambuzau3d",
    whatsAppPhone: "5515997788281",
    whatsAppMessage: "Olá! Quero fazer um pedido!",
    whatsAppEnabled: true,
    socialInstagram: "bambuzau3d",
    socialFacebook: "",
    socialYoutube: "",
    socialTelegram: "",
    wholesaleWhatsApp: "5515997788281",
    wholesaleTelegram: "https://t.me/bambuzau3d",
    logoUrl: "",
    adminPassword: "admin123",
    isAdminOnline: true,
    contactEmail: "bambuzau3d@gmail.com"
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Form states for creating/editing product
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("decorativos");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOldPrice, setProdOldPrice] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodBadge, setProdBadge] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodShopeeUrl, setProdShopeeUrl] = useState("");

  const [dailyBackups, setDailyBackups] = useState<{ name: string; size: string; createdAt: string }[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);

  const fetchBackupsList = async () => {
    try {
      const res = await fetch("/api/backup/list", {
        headers: { "x-admin-password": getAdminPassword() }
      });
      const data = await res.json();
      if (data.success) {
        setDailyBackups(data.backups || []);
      }
    } catch (err) {
      console.error("Erro ao buscar backups:", err);
    }
  };

  const handleRestoreBackup = async (file: File) => {
    setIsRestoring(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const backupData = JSON.parse(text);

          const res = await fetch("/api/backup/restore", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-password": getAdminPassword()
            },
            body: JSON.stringify({ backupData })
          });

          const data = await res.json();
          if (data.success) {
            showToast("Banco de dados restaurado com sucesso!", "success");
            fetchData();
            fetchBackupsList();
          } else {
            showToast("Falha ao restaurar: " + (data.error || "Erro desconhecido"), "error");
          }
        } catch (err) {
          showToast("Arquivo JSON inválido ou corrompido.", "error");
        } finally {
          setIsRestoring(false);
        }
      };
      reader.onerror = () => {
        showToast("Falha ao ler o arquivo selecionado.", "error");
        setIsRestoring(false);
      };
      reader.readAsText(file);
    } catch (err) {
      console.error(err);
      showToast("Falha ao processar o arquivo.", "error");
      setIsRestoring(false);
    }
  };

  useEffect(() => {
    if (activeTab === "backup") {
      fetchBackupsList();
    }
  }, [activeTab]);

  const getAdminPassword = () => {
    return localStorage.getItem("admin_password") || "";
  };

  // Load Data
  useEffect(() => {
    const auth = localStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let loadedProducts = false;
    let loadedSettings = false;

    // 1. Fetch Products
    try {
      const prodRes = await fetch("/api/products");
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success) {
          setProducts(prodData.products);
          loadedProducts = true;
        }
      } else {
        console.warn("Products API response not OK:", prodRes.status);
      }
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }

    // 2. Fetch Settings
    const adminPass = getAdminPassword();
    try {
      const settingsRes = await fetch("/api/settings", {
        headers: adminPass ? { "x-admin-password": adminPass } : undefined
      });
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.success) {
          setSettings(settingsData.settings);
          loadedSettings = true;
        }
      } else {
        console.warn("Settings API response not OK:", settingsRes.status);
      }
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    }

    // 3. Fetch Messages (only if password is available)
    if (adminPass) {
      try {
        const msgRes = await fetch("/api/messages", {
          headers: { "x-admin-password": adminPass }
        });
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          if (msgData.success) {
            setMessages(msgData.messages || []);
          }
        } else {
          console.warn("Messages API response not OK:", msgRes.status);
        }
      } catch (err) {
        console.error("Erro ao carregar mensagens:", err);
      }
    }

    // Fallback notification only if both core entities completely fail
    if (!loadedProducts && !loadedSettings) {
      showToast("Falha ao carregar alguns dados do banco. Usando dados locais como fallback.", "error");
    }

    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("admin_authenticated", "true");
        localStorage.setItem("admin_password", passwordInput);
        showToast("Acesso autorizado!");
        
        // Re-run the resilient fetchData which handles setting, products and messages
        await fetchData();
      } else {
        setAuthError("Senha de acesso incorreta.");
      }
    } catch (err: any) {
      console.error("Login verification error:", err);
      setAuthError(`Erro de comunicação com o servidor: ${err?.message || "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_password");
    onClose();
  };

  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-password": getAdminPassword()
        },
        body: JSON.stringify({ read: !currentRead })
      });
      const data = await res.json();
      if (data.success) {
        showToast(currentRead ? "Mensagem marcada como não lida" : "Mensagem marcada como lida");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast("Erro ao atualizar status", "error");
    }
  };

  const handleToggleMessageReplied = async (id: string, currentReplied: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-password": getAdminPassword()
        },
        body: JSON.stringify({ replied: !currentReplied })
      });
      const data = await res.json();
      if (data.success) {
        showToast(currentReplied ? "Resposta pendente" : "Mensagem marcada como respondida");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast("Erro ao atualizar resposta", "error");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta mensagem definitivamente?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { 
        method: "DELETE",
        headers: { "x-admin-password": getAdminPassword() }
      });
      const data = await res.json();
      if (data.success) {
        showToast("Mensagem excluída com sucesso");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast("Erro ao excluir mensagem", "error");
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Open product form (Create)
  const handleNewProduct = () => {
    setEditingProduct(null);
    setProdName("");
    setProdCategory("decorativos");
    setProdPrice("R$ ");
    setProdOldPrice("");
    setProdImage("");
    setProdBadge("");
    setProdDesc("");
    setProdShopeeUrl(settings.shopeeStoreUrl);
    setFormError("");
    setIsFormOpen(true);
  };

  // Open product form (Edit)
  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCategory(prod.categoryId);
    setProdPrice(prod.price);
    setProdOldPrice(prod.oldPrice || "");
    setProdImage(prod.image);
    setProdBadge(prod.badge || "");
    setProdDesc(prod.desc);
    setProdShopeeUrl(prod.shopeeUrl || settings.shopeeStoreUrl);
    setFormError("");
    setIsFormOpen(true);
  };

  // Save product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodDesc) {
      setFormError("Nome, preço e descrição são obrigatórios.");
      return;
    }

    const selectedCat = CATEGORIES_MAPPING.find(c => c.id === prodCategory);

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: prodName,
      category: selectedCat ? selectedCat.label : "Decorativos",
      categoryId: prodCategory,
      price: prodPrice,
      oldPrice: prodOldPrice || undefined,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviews: editingProduct ? editingProduct.reviews : Math.floor(Math.random() * 40) + 12,
      image: prodImage || "art-sculpture.jpg",
      badge: prodBadge || undefined,
      shopeeUrl: prodShopeeUrl || settings.shopeeStoreUrl,
      desc: prodDesc
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-password": getAdminPassword()
        },
        body: JSON.stringify(productPayload)
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingProduct ? "Produto atualizado!" : "Produto cadastrado com sucesso!");
        setIsFormOpen(false);
        fetchData();
      } else {
        showToast(data.error || "Erro ao salvar produto", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erro de rede ao salvar produto", "error");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este produto definitivamente?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { 
        method: "DELETE",
        headers: { "x-admin-password": getAdminPassword() }
      });
      const data = await res.json();
      if (data.success) {
        showToast("Produto removido com sucesso!");
        fetchData();
      } else {
        showToast(data.error || "Erro ao deletar produto", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erro de rede ao deletar produto", "error");
    }
  };

  // Save settings (Shopee, WhatsApp, General info)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-password": getAdminPassword()
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        showToast("Configurações atualizadas no banco!");
        fetchData();
      } else {
        showToast(data.error || "Erro ao salvar configurações", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erro ao conectar com o servidor", "error");
    }
  };

  const updateSettingField = (field: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const removeImageBackground = (base64OrUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      if (!base64OrUrl) {
        resolve("");
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = base64OrUrl;

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          // Resize to max 400px to avoid large base64 payload exceeding Firestore 1MB limits
          const MAX_DIM = 400;
          let w = img.width;
          let h = img.height;
          if (w > MAX_DIM || h > MAX_DIM) {
            if (w > h) {
              h = Math.round((h * MAX_DIM) / w);
              w = MAX_DIM;
            } else {
              w = Math.round((w * MAX_DIM) / h);
              h = MAX_DIM;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(base64OrUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, w, h);
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;

          const getPixelColor = (px: number, py: number) => {
            const idx = (py * w + px) * 4;
            return {
              r: data[idx],
              g: data[idx + 1],
              b: data[idx + 2],
              a: data[idx + 3]
            };
          };

          const setPixelAlpha = (px: number, py: number, alpha: number) => {
            const idx = (py * w + px) * 4;
            data[idx + 3] = alpha;
          };

          const color1 = getPixelColor(0, 0);
          let color2 = { ...color1 };
          let foundColor2 = false;

          // Search top border for second checkerboard color
          for (let x = 0; x < Math.min(w, 60); x++) {
            const col = getPixelColor(x, 0);
            const dist = Math.abs(col.r - color1.r) + Math.abs(col.g - color1.g) + Math.abs(col.b - color1.b);
            if (dist > 30) {
              color2 = col;
              foundColor2 = true;
              break;
            }
          }

          // If not found, search left border
          if (!foundColor2) {
            for (let y = 0; y < Math.min(h, 60); y++) {
              const col = getPixelColor(0, y);
              const dist = Math.abs(col.r - color1.r) + Math.abs(col.g - color1.g) + Math.abs(col.b - color1.b);
              if (dist > 30) {
                color2 = col;
                foundColor2 = true;
                break;
              }
            }
          }

          // If the top-left corner is already mostly transparent, skip removal to protect existing PNGs
          if (color1.a < 15) {
            resolve(canvas.toDataURL("image/png"));
            return;
          }

          // Queue for BFS
          const queue: [number, number][] = [];
          const visited = new Uint8Array(w * h);

          // Enqueue all border pixels
          for (let x = 0; x < w; x++) {
            queue.push([x, 0]);
            visited[0 * w + x] = 1;
            queue.push([x, h - 1]);
            visited[(h - 1) * w + x] = 1;
          }
          for (let y = 1; y < h - 1; y++) {
            queue.push([0, y]);
            visited[y * w + 0] = 1;
            queue.push([w - 1, y]);
            visited[y * w + (w - 1)] = 1;
          }

          const isBgColor = (col: { r: number; g: number; b: number; a: number }) => {
            if (col.a < 30) return true;

            const dist1 = Math.abs(col.r - color1.r) + Math.abs(col.g - color1.g) + Math.abs(col.b - color1.b);
            const dist2 = Math.abs(col.r - color2.r) + Math.abs(col.g - color2.g) + Math.abs(col.b - color2.b);

            // Match if close to either of the detected border colors
            if (dist1 < 55 || dist2 < 55) {
              return true;
            }

            // Or typical gray & white mock transparency checkerboard patterns
            const isWhiteChecker = (col.r > 240 && col.g > 240 && col.b > 240) ||
                                   (col.r > 190 && col.r < 210 && col.g > 190 && col.g < 210 && col.b > 190 && col.b < 210) ||
                                   (col.r > 140 && col.r < 165 && col.g > 140 && col.g < 165 && col.b > 140 && col.b < 165);
            if (isWhiteChecker) return true;

            // Or general near-white or near-black backgrounds
            const isNearWhite = col.r > 215 && col.g > 215 && col.b > 215;
            const isNearBlack = col.r < 45 && col.g < 45 && col.b < 45;
            return isNearWhite || isNearBlack;
          };

          // BFS flood fill
          let head = 0;
          while (head < queue.length) {
            const [cx, cy] = queue[head++];
            const col = getPixelColor(cx, cy);

            if (isBgColor(col)) {
              setPixelAlpha(cx, cy, 0);

              const neighbors = [
                [cx + 1, cy],
                [cx - 1, cy],
                [cx, cy + 1],
                [cx, cy - 1]
              ];

              for (const [nx, ny] of neighbors) {
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                  const idx = ny * w + nx;
                  if (visited[idx] === 0) {
                    visited[idx] = 1;
                    queue.push([nx, ny]);
                  }
                }
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch (err) {
          console.error("Erro ao remover fundo via canvas:", err);
          resolve(base64OrUrl); // fallback to original on error (CORS, etc)
        }
      };

      img.onerror = () => {
        resolve(base64OrUrl);
      };
    });
  };

  const handleLogoUpload = async (originalLogoUrl: string) => {
    try {
      let logoUrl = originalLogoUrl;
      
      if (originalLogoUrl) {
        showToast("Processando imagem e removendo fundo...");
        logoUrl = await removeImageBackground(originalLogoUrl);
      }

      updateSettingField("logoUrl", logoUrl);
      if (originalLogoUrl) {
        showToast("Fundo transparente removido com sucesso! Clique no botão 'Salvar Informações' abaixo para gravar.", "success");
      } else {
        showToast("Logo removida localmente. Clique no botão 'Salvar Informações' abaixo para gravar.", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Erro ao processar a logo", "error");
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#09090E", color: "#F4F4F8", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        {/* Toast Notification */}
        {toast && (
          <div style={{ position: "fixed", top: "2rem", right: "2rem", background: toast.type === "success" ? "#10B981" : "#EF4444", color: "#fff", padding: "1rem 1.5rem", borderRadius: "0.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: "0.75rem", zIndex: 1000 }}>
            {toast.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{toast.message}</span>
          </div>
        )}

        <div style={{ width: "100%", maxWidth: "420px", background: "#13131F", border: "1px solid #1F1F2E", borderRadius: "1.25rem", padding: "2rem", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ display: "inline-flex", padding: "1rem", borderRadius: "50%", background: "rgba(196,147,58,0.1)", color: "#C4933A", marginBottom: "1rem" }}>
              <Settings size={32} />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#fff", margin: 0 }}>
              Acesso Restrito
            </h2>
            <p style={{ color: "#AEAEB2", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              Insira a senha de acesso para configurar a {settings.storeName || "Bambuzau 3D"}
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.5rem", fontWeight: 500 }}>Senha do Administrador</label>
              <input
                type="password"
                placeholder="Digite a senha..."
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setAuthError(""); }}
                style={{ width: "100%", background: "#0D0D11", border: "1px solid #2B2B3D", borderRadius: "0.75rem", padding: "0.75rem 1rem", color: "#fff", fontSize: "0.95rem" }}
                autoFocus
              />
              {authError && (
                <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "0.4rem", fontWeight: 500 }}>{authError}</p>
              )}
            </div>

            <button
              type="submit"
              style={{ background: "#C4933A", border: "none", color: "#09090E", padding: "0.8rem", borderRadius: "0.75rem", fontSize: "0.95rem", fontWeight: 700, fontFamily: "var(--font-display)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              Entrar no Painel
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{ background: "transparent", border: "1px solid #2B2B3D", color: "#AEAEB2", padding: "0.8rem", borderRadius: "0.75rem", fontSize: "0.9rem", fontWeight: 600, fontFamily: "var(--font-display)", cursor: "pointer", width: "100%" }}
            >
              Voltar ao Site
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", borderTop: "1px solid #1F1F2E", paddingTop: "1rem", textAlign: "center" }}>
            <span style={{ fontSize: "0.72rem", color: "#AEAEB2" }}>
              Senha padrão de fábrica: <strong style={{ color: "#C4933A" }}>admin123</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D11", color: "#F4F4F8", padding: "1.5rem" }}>
      {/* Toast Notification */}
      {toast && (
        <div 
          style={{
            position: "fixed",
            top: "2rem",
            right: "2rem",
            background: toast.type === "success" ? "#10B981" : "#EF4444",
            color: "#fff",
            padding: "1rem 1.5rem",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            zIndex: 1000,
            animation: "slideIn 0.3s ease-out"
          }}
        >
          {toast.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #1F1F2E",
          paddingBottom: "1.25rem",
          marginBottom: "2rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button 
            onClick={onClose}
            style={{
              background: "#161622",
              border: "1px solid #2B2B3D",
              color: "#C4933A",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              fontWeight: 600,
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#222235"}
            onMouseLeave={e => e.currentTarget.style.background = "#161622"}
          >
            <ArrowLeft size={16} />
            Voltar para o Site
          </button>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "#fff", margin: 0 }}>
              Painel Administrativo
            </h1>
            <p style={{ color: "var(--color-fg-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
              Gerencie produtos, links de vendas, contatos e informações gerais do site
            </p>
          </div>
        </div>
        
        {/* Short Status */}
        <div style={{ background: "#11111A", border: "1px solid #252538", padding: "0.5rem 1rem", borderRadius: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }}></div>
          <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#10B981" }}>Firestore Conectado</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4" style={{ gap: "2rem" }}>
        {/* Navigation Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button
            onClick={() => { setActiveTab("products"); setIsFormOpen(false); }}
            style={{
              padding: "1rem",
              textAlign: "left",
              background: activeTab === "products" ? "rgba(196,147,58,0.12)" : "#13131F",
              border: activeTab === "products" ? "1px solid #C4933A" : "1px solid #1F1F2E",
              borderRadius: "0.75rem",
              color: activeTab === "products" ? "#C4933A" : "#AEAEB2",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "all 0.2s"
            }}
          >
            <ShoppingBag size={18} />
            Produtos ({products.length})
          </button>

          <button
            onClick={() => { setActiveTab("messages"); setIsFormOpen(false); }}
            style={{
              padding: "1rem",
              textAlign: "left",
              background: activeTab === "messages" ? "rgba(196,147,58,0.12)" : "#13131F",
              border: activeTab === "messages" ? "1px solid #C4933A" : "1px solid #1F1F2E",
              borderRadius: "0.75rem",
              color: activeTab === "messages" ? "#C4933A" : "#AEAEB2",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              transition: "all 0.2s"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <MessageSquare size={18} />
              <span>Mensagens (Inbox)</span>
            </div>
            {messages.filter(m => !m.read).length > 0 && (
              <span style={{ background: "#EF4444", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "1rem" }}>
                {messages.filter(m => !m.read).length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab("shopee"); setIsFormOpen(false); }}
            style={{
              padding: "1rem",
              textAlign: "left",
              background: activeTab === "shopee" ? "rgba(196,147,58,0.12)" : "#13131F",
              border: activeTab === "shopee" ? "1px solid #C4933A" : "1px solid #1F1F2E",
              borderRadius: "0.75rem",
              color: activeTab === "shopee" ? "#C4933A" : "#AEAEB2",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "all 0.2s"
            }}
          >
            <Settings size={18} />
            Integração Shopee
          </button>

          <button
            onClick={() => { setActiveTab("whatsapp"); setIsFormOpen(false); }}
            style={{
              padding: "1rem",
              textAlign: "left",
              background: activeTab === "whatsapp" ? "rgba(196,147,58,0.12)" : "#13131F",
              border: activeTab === "whatsapp" ? "1px solid #C4933A" : "1px solid #1F1F2E",
              borderRadius: "0.75rem",
              color: activeTab === "whatsapp" ? "#C4933A" : "#AEAEB2",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "all 0.2s"
            }}
          >
            <MessageSquare size={18} />
            Integração WhatsApp
          </button>

          <button
            onClick={() => { setActiveTab("general"); setIsFormOpen(false); }}
            style={{
              padding: "1rem",
              textAlign: "left",
              background: activeTab === "general" ? "rgba(196,147,58,0.12)" : "#13131F",
              border: activeTab === "general" ? "1px solid #C4933A" : "1px solid #1F1F2E",
              borderRadius: "0.75rem",
              color: activeTab === "general" ? "#C4933A" : "#AEAEB2",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "all 0.2s"
            }}
          >
            <Globe size={18} />
            Informações do Site
          </button>

          <button
            onClick={() => { setActiveTab("backup"); setIsFormOpen(false); }}
            style={{
              padding: "1rem",
              textAlign: "left",
              background: activeTab === "backup" ? "rgba(196,147,58,0.12)" : "#13131F",
              border: activeTab === "backup" ? "1px solid #C4933A" : "1px solid #1F1F2E",
              borderRadius: "0.75rem",
              color: activeTab === "backup" ? "#C4933A" : "#AEAEB2",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "all 0.2s"
            }}
          >
            <Database size={18} />
            Backup & BD Secundário
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "1rem",
              textAlign: "left",
              background: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "0.75rem",
              color: "#EF4444",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginTop: "2rem",
              transition: "all 0.2s"
            }}
          >
            <XCircle size={18} />
            Sair do Painel
          </button>
        </div>

        {/* Workspace Content */}
        <div className="lg:col-span-3" style={{ background: "#13131F", border: "1px solid #1F1F2E", borderRadius: "1rem", padding: "1.75rem" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 0" }}>
              <div style={{ width: 40, height: 40, border: "3px solid rgba(196,147,58,0.2)", borderTopColor: "#C4933A", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <p style={{ marginTop: "1rem", color: "#AEAEB2", fontFamily: "var(--font-display)" }}>Carregando dados...</p>
            </div>
          ) : (
            <>
              {/* TAB: PRODUCTS */}
              {activeTab === "products" && !isFormOpen && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                      Catálogo de Produtos ({products.length})
                    </h2>
                    <button
                      onClick={handleNewProduct}
                      style={{
                        background: "#C4933A",
                        border: "none",
                        color: "#09090E",
                        padding: "0.6rem 1.2rem",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        transition: "opacity 0.2s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                      <Plus size={16} />
                      Adicionar Produto
                    </button>
                  </div>

                  {products.length === 0 ? (
                    <div style={{ border: "2px dashed #1F1F2E", borderRadius: "1rem", padding: "3rem", textAlign: "center" }}>
                      <ShoppingBag size={48} style={{ color: "#2B2B3D", margin: "0 auto 1rem" }} />
                      <p style={{ color: "var(--color-fg-muted)", fontSize: "0.95rem" }}>Nenhum produto cadastrado no banco.</p>
                      <button onClick={handleNewProduct} style={{ background: "none", border: "1px solid #C4933A", color: "#C4933A", padding: "0.5rem 1.2rem", borderRadius: "2rem", marginTop: "1rem", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600 }}>
                        Criar meu primeiro produto
                      </button>
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #1F1F2E" }}>
                            <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>Imagem</th>
                            <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>Produto</th>
                            <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>Categoria</th>
                            <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>Preço</th>
                            <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-fg-muted)", textAlign: "right" }}>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((prod) => (
                            <tr key={prod.id} style={{ borderBottom: "1px solid #1F1F2E", verticalAlign: "middle" }}>
                              <td style={{ padding: "0.75rem 1rem" }}>
                                <img 
                                  src={getSafeProductImage(prod.id, prod.image)}
                                  alt={prod.name}
                                  style={{ width: 44, height: 44, objectFit: "cover", borderRadius: "0.375rem", background: "#1A1A26" }}
                                  onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=200";
                                  }}
                                />
                              </td>
                              <td style={{ padding: "0.75rem 1rem" }}>
                                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#fff" }}>{prod.name}</div>
                                {prod.badge && (
                                  <span style={{ fontSize: "0.65rem", background: "rgba(196,147,58,0.2)", border: "1px solid #C4933A", color: "#C4933A", padding: "0.1rem 0.4rem", borderRadius: "1rem", marginTop: "0.25rem", display: "inline-block" }}>
                                    {prod.badge}
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#AEAEB2" }}>
                                {prod.category}
                              </td>
                              <td style={{ padding: "0.75rem 1rem", fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>
                                {prod.price}
                                {prod.oldPrice && (
                                  <div style={{ fontSize: "0.7rem", textDecoration: "line-through", color: "var(--color-muted)" }}>{prod.oldPrice}</div>
                                )}
                              </td>
                              <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                  <button
                                    onClick={() => handleEditProduct(prod)}
                                    title="Editar"
                                    style={{ background: "#1F1F2E", border: "1px solid #2B2B3D", color: "#fff", padding: "0.4rem", borderRadius: "0.25rem", cursor: "pointer" }}
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod.id)}
                                    title="Deletar"
                                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", padding: "0.4rem", borderRadius: "0.25rem", cursor: "pointer" }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: PRODUCT FORM */}
              {activeTab === "products" && isFormOpen && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                    <button 
                      onClick={() => setIsFormOpen(false)}
                      style={{ background: "none", border: "none", color: "#AEAEB2", cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                      {editingProduct ? "Editar Produto" : "Novo Produto"}
                    </h2>
                  </div>

                  <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {formError && (
                      <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #EF4444", color: "#EF4444", padding: "0.75rem", borderRadius: "0.5rem", fontSize: "0.85rem" }}>
                        {formError}
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Nome do Produto*</label>
                        <input
                          type="text"
                          value={prodName}
                          onChange={e => setProdName(e.target.value)}
                          placeholder="Ex: Luminária de Mesa Iron Man"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Categoria*</label>
                        <select
                          value={prodCategory}
                          onChange={e => setProdCategory(e.target.value)}
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        >
                          {CATEGORIES_MAPPING.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Preço Atual* (ou texto)</label>
                        <input
                          type="text"
                          value={prodPrice}
                          onChange={e => setProdPrice(e.target.value)}
                          placeholder="Ex: R$ 89,90 ou Sob encomenda"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Preço Antigo (Opcional)</label>
                        <input
                          type="text"
                          value={prodOldPrice}
                          onChange={e => setProdOldPrice(e.target.value)}
                          placeholder="Ex: R$ 119,90"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Imagem (URL externa ou nome do arquivo)*</label>
                        <input
                          type="text"
                          value={prodImage}
                          onChange={e => setProdImage(e.target.value)}
                          placeholder="Ex: vase-3d.jpg ou link https://..."
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                        <span style={{ fontSize: "0.68rem", color: "var(--color-fg-muted)", marginTop: "0.25rem", display: "block" }}>
                          Selecione um arquivo existente (`art-sculpture.jpg`, `vase-3d.jpg`, `dragon-3d.jpg`, `figurine-3d.jpg`, `support-3d.jpg`, `pet-3d.jpg`, `organizer-3d.webp`, `festive-3d.jpg`, `event-3d.jpg`, `utility-3d.jpg`) ou coloque um link completo.
                        </span>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Etiqueta de Destaque (Opcional)</label>
                        <input
                          type="text"
                          value={prodBadge}
                          onChange={e => setProdBadge(e.target.value)}
                          placeholder="Ex: Mais Vendido, Promoção, Premium"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Link Personalizado do Produto na Shopee (Opcional)</label>
                      <input
                        type="url"
                        value={prodShopeeUrl}
                        onChange={e => setProdShopeeUrl(e.target.value)}
                        placeholder="Deixe em branco para usar a loja padrão"
                        style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Descrição Curta*</label>
                      <textarea
                        rows={3}
                        value={prodDesc}
                        onChange={e => setProdDesc(e.target.value)}
                        placeholder="Detalhes técnicos ou de design da peça impressa em 3D..."
                        style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", resize: "none" }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        style={{ background: "#1F1F2E", border: "1px solid #2B2B3D", color: "#fff", padding: "0.6rem 1.2rem", borderRadius: "0.5rem", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600 }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        style={{ background: "#C4933A", border: "none", color: "#09090E", padding: "0.6rem 1.5rem", borderRadius: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-display)", fontWeight: 700 }}
                      >
                        <Save size={16} />
                        Salvar Produto
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: MESSAGES INBOX */}
              {activeTab === "messages" && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    Mensagens do Fale Conosco ({messages.length})
                  </h2>
                  <p style={{ color: "var(--color-fg-muted)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                    Responda seus clientes rapidamente via WhatsApp ou e-mail. Dica: Clique em "Responder WhatsApp" para abrir o chat pré-configurado!
                  </p>

                  {messages.length === 0 ? (
                    <div style={{ border: "2px dashed #1F1F2E", borderRadius: "1rem", padding: "3rem", textAlign: "center" }}>
                      <MessageSquare size={48} style={{ color: "#2B2B3D", margin: "0 auto 1rem" }} />
                      <p style={{ color: "var(--color-fg-muted)", fontSize: "0.95rem" }}>Sua caixa de entrada está limpa! Nenhuma mensagem recebida.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {messages.map((msg) => {
                        const dateStr = msg.createdAt ? new Date(msg.createdAt).toLocaleString("pt-BR") : "Data indisponível";
                        const cleanPhone = msg.phone ? msg.phone.replace(/\D/g, "") : "";
                        const waReplyUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá, ${msg.name}! Vi seu contato no formulário do site da Bambuzau 3D sobre a mensagem: "${msg.messageText}". Como podemos te ajudar?`)}` : null;

                        return (
                          <div 
                            key={msg.id} 
                            style={{ 
                              background: msg.read ? "#161622" : "rgba(196,147,58,0.05)", 
                              border: msg.read ? "1px solid #1F1F2E" : "1px solid rgba(196,147,58,0.3)", 
                              borderRadius: "0.75rem", 
                              padding: "1.25rem",
                              transition: "all 0.2s"
                            }}
                          >
                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.75rem" }}>
                              <div>
                                <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  {msg.name}
                                  {!msg.read && (
                                    <span style={{ background: "#C4933A", color: "#09090E", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "0.25rem" }}>Novo</span>
                                  )}
                                </h4>
                                <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--color-fg-muted)" }}>
                                  E-mail: <span style={{ color: "#fff" }}>{msg.email}</span> {msg.phone && <>| WhatsApp: <span style={{ color: "#fff" }}>{msg.phone}</span></>}
                                </p>
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "#AEAEB2", fontFamily: "var(--font-mono)" }}>
                                {dateStr}
                              </span>
                            </div>

                            <div style={{ background: "#0D0D11", border: "1px solid #1F1F2E", padding: "0.85rem 1rem", borderRadius: "0.5rem", color: "#E5E5EA", fontSize: "0.88rem", lineHeight: 1.45, marginBottom: "1rem", whiteSpace: "pre-wrap" }}>
                              {msg.messageText}
                            </div>

                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", borderTop: "1px solid #1F1F2E", paddingTop: "0.75rem" }}>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", background: msg.read ? "rgba(255,255,255,0.05)" : "rgba(196,147,58,0.1)", color: msg.read ? "#AEAEB2" : "#C4933A", padding: "0.2rem 0.5rem", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: msg.read ? "#AEAEB2" : "#C4933A" }} />
                                  {msg.read ? "Mensagem Lida" : "Mensagem Pendente"}
                                </span>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", background: msg.replied ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.05)", color: msg.replied ? "#10B981" : "#EF4444", padding: "0.2rem 0.5rem", borderRadius: "1rem", border: "1px solid rgba(16,185,129,0.1)" }}>
                                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: msg.replied ? "#10B981" : "#EF4444" }} />
                                  {msg.replied ? "Respondido" : "Não Respondido"}
                                </span>
                              </div>

                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                {waReplyUrl && (
                                  <a
                                    href={waReplyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                      if (!msg.read) handleToggleMessageRead(msg.id, false);
                                      if (!msg.replied) handleToggleMessageReplied(msg.id, false);
                                    }}
                                    style={{
                                      background: "#25D366",
                                      border: "none",
                                      color: "#fff",
                                      padding: "0.4rem 0.8rem",
                                      borderRadius: "0.35rem",
                                      fontSize: "0.78rem",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.35rem",
                                      textDecoration: "none"
                                    }}
                                  >
                                    <MessageSquare size={14} />
                                    Responder WhatsApp
                                  </a>
                                )}

                                <button
                                  onClick={() => handleToggleMessageRead(msg.id, msg.read)}
                                  style={{
                                    background: "#1F1F2E",
                                    border: "1px solid #2B2B3D",
                                    color: "#AEAEB2",
                                    padding: "0.4rem 0.8rem",
                                    borderRadius: "0.35rem",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    cursor: "pointer"
                                  }}
                                >
                                  {msg.read ? "Marcar como Não Lido" : "Marcar como Lido"}
                                </button>

                                <button
                                  onClick={() => handleToggleMessageReplied(msg.id, msg.replied)}
                                  style={{
                                    background: "#1F1F2E",
                                    border: "1px solid #2B2B3D",
                                    color: msg.replied ? "#EF4444" : "#10B981",
                                    padding: "0.4rem 0.8rem",
                                    borderRadius: "0.35rem",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    cursor: "pointer"
                                  }}
                                >
                                  {msg.replied ? "Marcar como Não Respondido" : "Marcar como Respondido"}
                                </button>

                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  style={{
                                    background: "rgba(239,68,68,0.1)",
                                    border: "1px solid rgba(239,68,68,0.2)",
                                    color: "#EF4444",
                                    padding: "0.4rem 0.6rem",
                                    borderRadius: "0.35rem",
                                    cursor: "pointer"
                                  }}
                                  title="Excluir Mensagem"
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
              )}

              {/* TAB: SHOPEE INTEGRATION */}
              {activeTab === "shopee" && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
                    Integração & Configurações da Shopee
                  </h2>
                  <p style={{ color: "var(--color-fg-muted)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                    Gerencie o redirecionamento global dos botões de compra. Quando o usuário clica em "Comprar na Shopee", ele é enviado à sua loja oficial cadastrada aqui.
                  </p>

                  <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>URL da sua Loja Shopee</label>
                      <input
                        type="url"
                        value={settings.shopeeStoreUrl}
                        onChange={e => updateSettingField("shopeeStoreUrl", e.target.value)}
                        placeholder="https://shopee.com.br/nomedaloja"
                        style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        required
                      />
                    </div>

                    <div style={{ background: "#161622", border: "1px solid #2B2B3D", padding: "1rem", borderRadius: "0.5rem" }}>
                      <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", color: "#C4933A", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <ExternalLink size={14} /> Como integrar produtos individuais?
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "#AEAEB2", lineHeight: 1.45 }}>
                        Você pode definir links específicos para cada peça na aba <strong>Produtos</strong>. Se um produto não tiver um link individual configurado, ele usará este link geral da sua loja automaticamente.
                      </p>
                    </div>

                    <button
                      type="submit"
                      style={{ background: "#C4933A", border: "none", color: "#09090E", padding: "0.6rem 1.5rem", borderRadius: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", width: "max-content", marginTop: "1rem", fontFamily: "var(--font-display)", fontWeight: 700 }}
                    >
                      <Save size={16} />
                      Salvar Integração
                    </button>
                  </form>
                </div>
              )}

              {/* TAB: WHATSAPP INTEGRATION */}
              {activeTab === "whatsapp" && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
                    Configurações do WhatsApp
                  </h2>
                  <p style={{ color: "var(--color-fg-muted)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                    Configure o botão flutuante e de banners para receber contatos diretos no seu celular, com uma mensagem pré-definida facilitando os orçamentos de impressões personalizadas.
                  </p>

                  <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem", marginBottom: "0.5rem" }} className="grid grid-cols-1 md:grid-cols-2">
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#1A1A26", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #2B2B3D" }}>
                        <input
                          type="checkbox"
                          id="whatsappEnabled"
                          checked={settings.whatsAppEnabled}
                          onChange={e => updateSettingField("whatsAppEnabled", e.target.checked)}
                          style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#25D366" }}
                        />
                        <label htmlFor="whatsappEnabled" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                          Ativar Botão Flutuante de WhatsApp no site
                        </label>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: settings.isAdminOnline ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", padding: "1rem", borderRadius: "0.5rem", border: settings.isAdminOnline ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>Status de Atendimento</span>
                          <span style={{ fontSize: "0.72rem", color: "#AEAEB2" }}>
                            {settings.isAdminOnline ? "ONLINE - Fale no WhatsApp ativo" : "OFFLINE - Formulário de E-mail ativo"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateSettingField("isAdminOnline", !settings.isAdminOnline)}
                          style={{
                            marginLeft: "auto",
                            background: settings.isAdminOnline ? "#10B981" : "#EF4444",
                            border: "none",
                            color: "#fff",
                            padding: "0.4rem 0.8rem",
                            borderRadius: "1.5rem",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          {settings.isAdminOnline ? "ONLINE ●" : "OFFLINE ○"}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Número de Celular (com DDI e DDD, sem espaços)</label>
                        <input
                          type="text"
                          value={settings.whatsAppPhone}
                          onChange={e => updateSettingField("whatsAppPhone", e.target.value)}
                          placeholder="5511999999999"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                          required
                        />
                        <span style={{ fontSize: "0.68rem", color: "var(--color-fg-muted)", marginTop: "0.25rem", display: "block" }}>
                          Formato: Código do País (55) + DDD (Ex: 11) + Número. Apenas dígitos.
                        </span>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Nome de usuário do Instagram</label>
                        <input
                          type="text"
                          value={settings.socialInstagram || ""}
                          onChange={e => updateSettingField("socialInstagram", e.target.value)}
                          placeholder="bambuzau3d"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Link ou Usuário do Facebook</label>
                        <input
                          type="text"
                          value={settings.socialFacebook || ""}
                          onChange={e => updateSettingField("socialFacebook", e.target.value)}
                          placeholder="bambuzau3d"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Link ou Usuário do YouTube</label>
                        <input
                          type="text"
                          value={settings.socialYoutube || ""}
                          onChange={e => updateSettingField("socialYoutube", e.target.value)}
                          placeholder="c/bambuzau3d"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Usuário ou Canal do Telegram</label>
                        <input
                          type="text"
                          value={settings.socialTelegram || ""}
                          onChange={e => updateSettingField("socialTelegram", e.target.value)}
                          placeholder="bambuzau3d"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>WhatsApp de Atacado (Apenas números com DDI/DDD)</label>
                        <input
                          type="text"
                          value={settings.wholesaleWhatsApp || ""}
                          onChange={e => updateSettingField("wholesaleWhatsApp", e.target.value)}
                          placeholder="5511999999999"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Telegram de Atacado (Link ou canal, Ex: t.me/canal)</label>
                        <input
                          type="text"
                          value={settings.wholesaleTelegram || ""}
                          onChange={e => updateSettingField("wholesaleTelegram", e.target.value)}
                          placeholder="https://t.me/bambuzau3d"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Mensagem Padrão (Início de Conversa)</label>
                      <textarea
                        rows={3}
                        value={settings.whatsAppMessage}
                        onChange={e => updateSettingField("whatsAppMessage", e.target.value)}
                        placeholder="Olá! Quero tirar uma dúvida com a equipe da Bambuzau 3D..."
                        style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", resize: "none" }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{ background: "#C4933A", border: "none", color: "#09090E", padding: "0.6rem 1.5rem", borderRadius: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", width: "max-content", marginTop: "1rem", fontFamily: "var(--font-display)", fontWeight: 700 }}
                    >
                      <Save size={16} />
                      Salvar Whatsapp & Redes
                    </button>
                  </form>
                </div>
              )}

              {/* TAB: GENERAL SITE INFO */}
              {activeTab === "general" && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
                    Informações Gerais do Site
                  </h2>
                  <p style={{ color: "var(--color-fg-muted)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                    Altere o nome oficial da marca, descrição institucional sobre impressão 3D e links adicionais que serão exibidos nos cabeçalhos e rodapés do site.
                  </p>

                  <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Nome da Loja</label>
                      <input
                        type="text"
                        value={settings.storeName}
                        onChange={e => updateSettingField("storeName", e.target.value)}
                        placeholder="Bambuzau 3D"
                        style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Descrição Institucional (About Us / Footer)</label>
                      <textarea
                        rows={4}
                        value={settings.storeDescription}
                        onChange={e => updateSettingField("storeDescription", e.target.value)}
                        placeholder="Peças com design sob medida, filamentos selecionados e controle absoluto de qualidade..."
                        style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", resize: "none" }}
                        required
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }} className="grid grid-cols-1 md:grid-cols-2">
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>E-mail para Recebimento de Contatos</label>
                        <input
                          type="email"
                          value={settings.contactEmail || ""}
                          onChange={e => updateSettingField("contactEmail", e.target.value)}
                          placeholder="bambuzau3d@gmail.com"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                        <span style={{ fontSize: "0.68rem", color: "var(--color-fg-muted)", marginTop: "0.25rem", display: "block" }}>
                          As mensagens enviadas pelo Fale Conosco quando você estiver offline serão notificadas neste e-mail.
                        </span>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.4rem", fontWeight: 500 }}>Senha do Painel de Admin</label>
                        <input
                          type="text"
                          value={settings.adminPassword || ""}
                          onChange={e => updateSettingField("adminPassword", e.target.value)}
                          placeholder="admin123"
                          style={{ width: "100%", background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff" }}
                        />
                        <span style={{ fontSize: "0.68rem", color: "var(--color-fg-muted)", marginTop: "0.25rem", display: "block" }}>
                          Mude a senha usada para entrar na área administrativa (Padrão: admin123).
                        </span>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#AEAEB2", marginBottom: "0.2rem", fontWeight: 600 }}>Logo sem Fundo (PNG Transparente)</label>
                      <span style={{ fontSize: "0.72rem", color: "var(--color-accent)", display: "block", marginBottom: "0.6rem" }}>
                        Essa logo sem fundo será exibida no topo (cabeçalho) e no final (rodapé) do site.
                      </span>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }} className="grid grid-cols-1 md:grid-cols-[120px_1fr]">
                        <div style={{ background: "#0D0D11", border: "1px solid #1F1F2E", borderRadius: "0.5rem", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "0.5rem" }}>
                          {settings.logoUrl ? (
                            <img src={settings.logoUrl} alt="Preview Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} referrerPolicy="no-referrer" />
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "#AEAEB2", textAlign: "center" }}>Sem Logo</span>
                          )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <div 
                            style={{ 
                              border: "2px dashed #2B2B3D", 
                              borderRadius: "0.5rem", 
                              padding: "1rem", 
                              textAlign: "center", 
                              background: "#1A1A26",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => {
                              e.preventDefault();
                              const file = e.dataTransfer.files[0];
                              if (file && file.type.startsWith("image/")) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  handleLogoUpload(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    handleLogoUpload(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              };
                              input.click();
                            }}
                          >
                            <Upload size={18} style={{ color: "#C4933A", marginBottom: "0.25rem" }} />
                            <p style={{ margin: 0, fontSize: "0.78rem", color: "#F4F4F8" }}>
                              Arraste seu PNG sem fundo ou <strong style={{ color: "#C4933A" }}>clique aqui</strong>
                            </p>
                            <span style={{ fontSize: "0.65rem", color: "#AEAEB2" }}>Use imagens com fundo transparente (.png, .svg ou .webp)</span>
                          </div>

                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={settings.logoUrl || ""}
                              onChange={e => updateSettingField("logoUrl", e.target.value)}
                              placeholder="Ou digite o link de uma imagem sem fundo..."
                              style={{ flex: 1, background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", color: "#fff", fontSize: "0.8rem" }}
                            />
                            {settings.logoUrl && (
                              <button 
                                type="button"
                                onClick={() => updateSettingField("logoUrl", "")}
                                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", borderRadius: "0.5rem", padding: "0 0.75rem", fontSize: "0.8rem", cursor: "pointer" }}
                              >
                                Limpar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{ background: "#C4933A", border: "none", color: "#09090E", padding: "0.6rem 1.5rem", borderRadius: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", width: "max-content", marginTop: "1rem", fontFamily: "var(--font-display)", fontWeight: 700 }}
                    >
                      <Save size={16} />
                      Salvar Informações
                    </button>
                  </form>
                </div>
              )}

              {/* TAB: BACKUP & SECONDARY DATABASE */}
              {activeTab === "backup" && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
                    Backup & Banco de Dados Secundário
                  </h2>
                  <p style={{ color: "var(--color-fg-muted)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                    Este sistema garante dupla persistência e segurança total para sua loja. Todos os dados do Firestore são espelhados em tempo real no banco de dados secundário local JSON no servidor. Você também pode fazer backups manuais para o seu PC ou gerenciar os backups automáticos diários.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }} className="grid grid-cols-1 md:grid-cols-2">
                    {/* Status Card */}
                    <div style={{ background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.75rem", padding: "1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                        <div style={{ padding: "0.5rem", borderRadius: "0.5rem", background: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                          <Database size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "#fff" }}>Banco de Dados Secundário</h3>
                          <span style={{ fontSize: "0.72rem", color: "#10B981", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginTop: "0.15rem" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }}></span>
                            Sincronizado & Ativo (Local JSON)
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: "1px solid #2B2B3D", paddingTop: "1rem", fontSize: "0.8rem", color: "#AEAEB2" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Modo de Operação:</span>
                          <strong style={{ color: "#fff" }}>Dupla Persistência (Firestore + JSON)</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Espelhamento de Dados:</span>
                          <strong style={{ color: "#10B981" }}>Tempo Real (Auto-Sinc)</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Última Sincronização:</span>
                          <strong style={{ color: "#fff" }}>{new Date().toLocaleDateString("pt-BR")}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Manual Backup Card */}
                    <div style={{ background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.75rem", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#fff" }}>Salvar Backup no PC</h3>
                        <p style={{ fontSize: "0.78rem", color: "#AEAEB2", margin: 0, lineHeight: 1.4 }}>
                          Gere um arquivo de backup completo contendo todos os produtos, fotos, configurações da loja e mensagens recebidas, e baixe instantaneamente para o seu computador.
                        </p>
                      </div>

                      <button
                        onClick={async () => {
                          try {
                            showToast("Gerando backup completo...");
                            const res = await fetch("/api/backup/download", {
                              headers: { "x-admin-password": getAdminPassword() }
                            });
                            if (!res.ok) throw new Error();
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `bambuzau-3d-backup-${new Date().toISOString().split("T")[0]}.json`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            window.URL.revokeObjectURL(url);
                            showToast("Backup baixado para o seu PC!", "success");
                          } catch (e) {
                            showToast("Erro ao baixar backup.", "error");
                          }
                        }}
                        style={{ background: "#C4933A", border: "none", color: "#09090E", padding: "0.6rem 1.2rem", borderRadius: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", marginTop: "1rem", fontFamily: "var(--font-display)", fontWeight: 700 }}
                      >
                        <Download size={16} />
                        Baixar Backup para o PC
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", marginTop: "1.5rem" }} className="grid grid-cols-1 md:grid-cols-2">
                    {/* Automatic Daily Backups */}
                    <div style={{ background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.75rem", padding: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "#fff" }}>Backups Diários Automáticos</h3>
                        <button 
                          onClick={fetchBackupsList}
                          title="Atualizar lista"
                          style={{ background: "none", border: "none", color: "#C4933A", cursor: "pointer" }}
                        >
                          <RefreshCw size={14} />
                        </button>
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "#AEAEB2", marginBottom: "1rem", lineHeight: 1.4 }}>
                        O servidor gera snapshots diários automaticamente. Os últimos 7 dias são armazenados e reciclados de forma inteligente no servidor.
                      </p>

                      {dailyBackups.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "1.5rem", color: "#AEAEB2", fontSize: "0.8rem", border: "1px dashed #2B2B3D", borderRadius: "0.5rem" }}>
                          Nenhum backup diário automático listado no servidor.
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "180px", overflowY: "auto" }}>
                          {dailyBackups.map((bk) => (
                            <div key={bk.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", background: "#13131F", border: "1px solid #1F1F2E", borderRadius: "0.375rem" }}>
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#fff" }}>{bk.name}</span>
                                <span style={{ fontSize: "0.65rem", color: "#AEAEB2" }}>Tamanho: {bk.size} | {new Date(bk.createdAt).toLocaleDateString("pt-BR")}</span>
                              </div>
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await fetch(`/api/backup/download-daily/${bk.name}`, {
                                      headers: { "x-admin-password": getAdminPassword() }
                                    });
                                    if (!res.ok) throw new Error();
                                    const blob = await res.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = bk.name;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    window.URL.revokeObjectURL(url);
                                    showToast("Backup diário baixado!", "success");
                                  } catch (e) {
                                    showToast("Falha ao baixar backup diário.", "error");
                                  }
                                }}
                                style={{ background: "#222235", border: "1px solid #2B2B3D", color: "#C4933A", fontSize: "0.7rem", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", cursor: "pointer", fontWeight: 600 }}
                              >
                                Baixar
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Restore Database Card */}
                    <div style={{ background: "#1A1A26", border: "1px solid #2B2B3D", borderRadius: "0.75rem", padding: "1.5rem" }}>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#fff" }}>Restaurar Banco de Dados</h3>
                      <p style={{ fontSize: "0.78rem", color: "#AEAEB2", marginBottom: "1.25rem", lineHeight: 1.4 }}>
                        Faça upload de um arquivo de backup (.json) gerado anteriormente para restaurar todos os produtos e configurações em caso de troca de computador ou perda de dados.
                      </p>

                      <div 
                        style={{ 
                          border: "2px dashed #2B2B3D", 
                          borderRadius: "0.5rem", 
                          padding: "1.5rem 1rem", 
                          textAlign: "center", 
                          background: "#13131F",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => {
                          e.preventDefault();
                          const file = e.dataTransfer.files[0];
                          if (file && file.name.endsWith(".json")) {
                            handleRestoreBackup(file);
                          } else {
                            showToast("Apenas arquivos JSON de backup são suportados.", "error");
                          }
                        }}
                        onClick={() => {
                          if (isRestoring) return;
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = ".json";
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleRestoreBackup(file);
                            }
                          };
                          input.click();
                        }}
                      >
                        <Upload size={20} style={{ color: "#C4933A", marginBottom: "0.5rem" }} />
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "#fff", fontWeight: 600 }}>
                          {isRestoring ? "Restaurando..." : "Selecionar arquivo de backup .json"}
                        </p>
                        <span style={{ fontSize: "0.65rem", color: "#AEAEB2", marginTop: "0.25rem", display: "block" }}>Arraste o arquivo ou clique para selecionar</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
