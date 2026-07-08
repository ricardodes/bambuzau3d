import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeFirestore, 
  getFirestore,
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  writeBatch,
  deleteDoc
} from "firebase/firestore";
import fs from "fs";
import path from "path";
import appletConfig from "../../firebase-applet-config.json";
import shippedLocalDb from "../data/local_db_backup.json";

// Find and load firebase-applet-config.json with robust fallback paths
const loadConfig = () => {
  if (appletConfig && appletConfig.projectId) {
    console.log("[Firebase Config] Successfully loaded config from static import.");
    return appletConfig;
  }

  const searchPaths = [
    path.join(process.cwd(), "firebase-applet-config.json"),
    path.join(process.cwd(), "src", "lib", "firebase-applet-config.json")
  ];

  for (const p of searchPaths) {
    if (fs.existsSync(p)) {
      try {
        console.log("[Firebase Config] Config found at path:", p);
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      } catch (e) {
        console.error(`[Firebase Config] Error parsing config at ${p}:`, e);
      }
    }
  }
  return null;
};

// Helper to resolve the correct backup JSON path (resilient in serverless)
const getBackupPath = () => {
  const isVercelEnv = !!process.env.VERCEL;
  const backupDir = isVercelEnv 
    ? path.join("/tmp", "data")
    : path.join(process.cwd(), "src", "data");
  return path.join(backupDir, "local_db_backup.json");
};

const config = loadConfig();
if (!config) {
  console.warn("WARNING: firebase-applet-config.json not found! Running in local fallback mode.");
}

export const app = config ? (getApps().length === 0 ? initializeApp(config) : getApp()) : null;

// Safe Firestore database reference getter to prevent "Firestore already initialized" crashes
const getSafeFirestore = () => {
  if (!app) return null;
  const dbId = config.firestoreDatabaseId || "(default)";
  try {
    // Force long-polling to prevent gRPC streaming/connection RST_STREAM crashes on serverless (Vercel)
    return initializeFirestore(app, { experimentalForceLongPolling: true }, dbId);
  } catch (err) {
    try {
      return getFirestore(app, dbId);
    } catch (getErr) {
      console.error("Critical: Failed to get/initialize Firestore:", getErr);
      return null;
    }
  }
};

export const db = getSafeFirestore();

// Category Interface
export interface Category {
  id: string;
  label: string;
  desc: string;
  image: string;
  href: string;
  imageScale?: string;
}

// Product Interface
export interface Product {
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

// Default seed categories (including the 5 original ones and 6 requested ones)
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "aquario",
    label: "Aquário",
    desc: "Decorações exclusivas para aquarismo",
    image: "aquario.jpg",
    href: "#aquario",
    imageScale: "center top"
  },
  {
    id: "articulados",
    label: "Brinquedos Articulados",
    desc: "Dragões e criaturas totalmente flexíveis impressas em uma só peça",
    image: "dragon-3d.jpg",
    href: "#articulados",
    imageScale: "center 20%"
  },
  {
    id: "automotivas",
    label: "Automotivas",
    desc: "Suportes veiculares, organizadores e peças customizadas",
    image: "automotivas.jpg",
    href: "#automotivas",
    imageScale: "center center"
  },
  {
    id: "brinquedos",
    label: "Brinquedos",
    desc: "Articulados e colecionáveis",
    image: "dragon-3d.jpg",
    href: "#brinquedos",
    imageScale: "center 20%"
  },
  {
    id: "datas-festivas",
    label: "Datas Festivas",
    desc: "Decorações temáticas para Natal, Páscoa e datas festivas",
    image: "festive-3d.jpg",
    href: "#datas-festivas",
    imageScale: "center center"
  },
  {
    id: "decorativos",
    label: "Decoração & Vasos",
    desc: "Lustres geométricos e vasos decorativos com brilho acetinado",
    image: "art-sculpture.jpg",
    href: "#decorativos",
    imageScale: "center 30%"
  },
  {
    id: "eventos",
    label: "Eventos",
    desc: "Troféus, lembrancinhas e itens sob medida para eventos",
    image: "event-3d.jpg",
    href: "#eventos",
    imageScale: "center center"
  },
  {
    id: "geek-marvel",
    label: "Universo Geek",
    desc: "Bustos, action figures e colecionáveis do seu universo favorito",
    image: "figurine-3d.jpg",
    href: "#geek-marvel",
    imageScale: "center center"
  },
  {
    id: "lustres",
    label: "Lustres",
    desc: "Iluminação artesanal única",
    image: "lustres.jpg",
    href: "#lustres",
    imageScale: "center center"
  },
  {
    id: "organizacao",
    label: "Organização & Suportes",
    desc: "Suportes de headset, celular e organizadores modulares para seu setup",
    image: "support-3d.jpg",
    href: "#organizacao",
    imageScale: "center center"
  },
  {
    id: "personalizados",
    label: "Personalizados",
    desc: "Lembrancinhas, troféus e projetos sob medida para você ou sua empresa",
    image: "event-3d.jpg",
    href: "#personalizados",
    imageScale: "center 10%"
  },
  {
    id: "pets",
    label: "Pets",
    desc: "Acessórios e comedouros personalizados para o seu pet",
    image: "pet-3d.jpg",
    href: "#pets",
    imageScale: "center center"
  },
  {
    id: "profissionais",
    label: "Profissionais",
    desc: "Gabaritos, suportes técnicos e organizadores de ferramentas",
    image: "profissionais.jpg",
    href: "#profissionais",
    imageScale: "center center"
  },
  {
    id: "saude-dia-a-dia",
    label: "Saúde e Dia a Dia",
    desc: "Adaptadores ergonômicos e acessórios práticos de saúde",
    image: "saude.jpg",
    href: "#saude-dia-a-dia",
    imageScale: "center center"
  },
  {
    id: "suportes",
    label: "Suportes",
    desc: "Suportes para fones, controles, celulares e paredes",
    image: "support-3d.jpg",
    href: "#suportes",
    imageScale: "center center"
  },
  {
    id: "utilidades",
    label: "Utilidades Gerais",
    desc: "Soluções inteligentes, comedouros pet e itens práticos para o dia a dia",
    image: "utility-3d.jpg",
    href: "#utilidades",
    imageScale: "center center"
  }
];export const DEFAULT_PRODUCTS: Product[] = [
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
    shopeeUrl: "https://shopee.com.br/bambuzau3d",
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
    shopeeUrl: "https://shopee.com.br/bambuzau3d",
    desc: "Base com design do Mjölnir contendo 4 porta-copos temáticos esculpidos in 3D.",
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
    shopeeUrl: "https://shopee.com.br/bambuzau3d",
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
    shopeeUrl: "https://shopee.com.br/bambuzau3d",
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
    shopeeUrl: "https://shopee.com.br/bambuzau3d",
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
    shopeeUrl: "https://shopee.com.br/bambuzau3d",
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
    shopeeUrl: "https://shopee.com.br/bambuzau3d",
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
    shopeeUrl: "https://shopee.com.br/bambuzau3d",
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
    shopeeUrl: "https://shopee.com.br/bambuzau3d",
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
    shopeeUrl: "https://shopee.com.br/bambuzau3d",
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
    shopeeUrl: "https://shopee.com.br/bambuzau3d",
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
    shopeeUrl: "https://shopee.com.br/bambuzau3d",
    desc: "Suporte dobrável de bolso compatível com qualquer modelo de smartphone ou tablet."
  }
];

// Helper functions for Firestore operations
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function getCategories(): Promise<Category[]> {
  if (isLocalDatabaseOnly() || !db) {
    return readLocalDatabase().categories;
  }
  try {
    const colRef = collection(db, "categories");
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  } catch (e: any) {
    if (e?.code === "permission-denied" || String(e).includes("permission")) {
      handleFirestoreError(e, OperationType.GET, "categories");
    }
    console.error("Error fetching categories from Firestore:", e);
    return readLocalDatabase().categories;
  }
}

export async function getProducts(): Promise<Product[]> {
  if (isLocalDatabaseOnly() || !db) {
    return readLocalDatabase().products.sort((a, b) => Number(a.id) - Number(b.id));
  }
  try {
    const colRef = collection(db, "products");
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      return [];
    }
    // Parse and sort by id
    const prods = snapshot.docs.map(doc => doc.data() as Product);
    return prods.sort((a, b) => Number(a.id) - Number(b.id));
  } catch (e: any) {
    if (e?.code === "permission-denied" || String(e).includes("permission")) {
      handleFirestoreError(e, OperationType.GET, "products");
    }
    console.error("Error fetching products from Firestore:", e);
    return readLocalDatabase().products.sort((a, b) => Number(a.id) - Number(b.id));
  }
}

// Product Write operations
export async function addProduct(prod: Product): Promise<void> {
  if (isLocalDatabaseOnly() || !db) {
    const current = readLocalDatabase();
    const updated = current.products.filter(p => p.id !== prod.id);
    updated.push(prod);
    writeLocalDatabase({ products: updated });
    return;
  }
  try {
    const docRef = doc(db, "products", String(prod.id));
    await setDoc(docRef, prod);
  } catch (e: any) {
    if (e?.code === "permission-denied" || String(e).includes("permission")) {
      handleFirestoreError(e, OperationType.WRITE, `products/${prod.id}`);
    }
    console.error("Error adding product to Firestore:", e);
    throw e;
  }
}

export async function deleteProduct(id: number): Promise<void> {
  if (isLocalDatabaseOnly() || !db) {
    const current = readLocalDatabase();
    const updated = current.products.filter(p => p.id !== id);
    writeLocalDatabase({ products: updated });
    return;
  }
  try {
    const docRef = doc(db, "products", String(id));
    await deleteDoc(docRef);
  } catch (e: any) {
    if (e?.code === "permission-denied" || String(e).includes("permission")) {
      handleFirestoreError(e, OperationType.DELETE, `products/${id}`);
    }
    console.error("Error deleting product from Firestore:", e);
    throw e;
  }
}

// Settings structures
export interface AppSettings {
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

// Helper to determine if we are strictly using the local JSON database
export function isLocalDatabaseOnly(): boolean {
  if (process.env.USE_LOCAL_DB === "true") {
    return true;
  }
  try {
    const data = readLocalDatabase();
    if (data?.settings?.useLocalDatabaseOnly === true) {
      return true;
    }
  } catch (e) {
    // ignore
  }
  return false;
}

// Helper to read all local DB data
export function readLocalDatabase(): {
  settings: AppSettings;
  categories: Category[];
  products: Product[];
  messages: any[];
} {
  const backupPath = getBackupPath();
  const defaultData = {
    settings: DEFAULT_SETTINGS,
    categories: DEFAULT_CATEGORIES,
    products: DEFAULT_PRODUCTS,
    messages: []
  };

  // Determine the best source of truth for reading
  if (!fs.existsSync(backupPath)) {
    if (shippedLocalDb) {
      console.log("[Local DB] Active path fell back to statically imported JSON data.");
      // Cache statically imported data to writeable backupPath if possible
      const dir = path.dirname(backupPath);
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(backupPath, JSON.stringify(shippedLocalDb, null, 2), "utf-8");
        console.log("[Local DB] Cached statically imported DB into writable path:", backupPath);
      } catch (writeErr) {
        console.warn("[Local DB] Failed to cache statically imported DB into writable path:", writeErr);
      }
      return {
        settings: { ...DEFAULT_SETTINGS, ...(shippedLocalDb.settings || {}) },
        categories: (shippedLocalDb.categories || DEFAULT_CATEGORIES) as Category[],
        products: (shippedLocalDb.products || DEFAULT_PRODUCTS) as Product[],
        messages: shippedLocalDb.messages || []
      };
    }
    return defaultData;
  }

  try {
    const fileContent = fs.readFileSync(backupPath, "utf-8");
    const data = JSON.parse(fileContent);

    return {
      settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) },
      categories: data.categories || DEFAULT_CATEGORIES,
      products: data.products || DEFAULT_PRODUCTS,
      messages: data.messages || []
    };
  } catch (e) {
    console.error("Error reading local database file, using defaults:", e);
    return defaultData;
  }
}

// Helper to write local DB data
export function writeLocalDatabase(data: {
  settings?: AppSettings;
  categories?: Category[];
  products?: Product[];
  messages?: any[];
}) {
  const backupPath = getBackupPath();
  const current = readLocalDatabase();
  
  const merged = {
    settings: data.settings !== undefined ? data.settings : current.settings,
    categories: data.categories !== undefined ? data.categories : current.categories,
    products: data.products !== undefined ? data.products : current.products,
    messages: data.messages !== undefined ? data.messages : current.messages,
    lastUpdated: new Date().toISOString()
  };

  try {
    const dir = path.dirname(backupPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(backupPath, JSON.stringify(merged, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing local database file:", e);
  }
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  phone: string;
  messageText: string;
  createdAt: string;
  read: boolean;
  replied: boolean;
}

export async function getMessages(): Promise<Message[]> {
  if (isLocalDatabaseOnly() || !db) {
    const msgs = readLocalDatabase().messages;
    return msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  try {
    const colRef = collection(db, "messages");
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      return [];
    }
    const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    return msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e: any) {
    if (e?.code === "permission-denied" || String(e).includes("permission")) {
      handleFirestoreError(e, OperationType.GET, "messages");
    }
    console.error("Error fetching messages from Firestore:", e);
    const msgs = readLocalDatabase().messages;
    return msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function addMessage(msg: Omit<Message, "id" | "createdAt" | "read" | "replied">): Promise<void> {
  if (isLocalDatabaseOnly() || !db) {
    const current = readLocalDatabase();
    const newMsg: Message = {
      ...msg,
      id: "local_" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      read: false,
      replied: false
    };
    current.messages.push(newMsg);
    writeLocalDatabase({ messages: current.messages });
    return;
  }
  try {
    const colRef = collection(db, "messages");
    const docRef = doc(colRef);
    await setDoc(docRef, { ...msg, read: false, replied: false, createdAt: new Date().toISOString() });
  } catch (e: any) {
    if (e?.code === "permission-denied" || String(e).includes("permission")) {
      handleFirestoreError(e, OperationType.WRITE, "messages");
    }
    console.error("Error adding message to Firestore:", e);
    throw e;
  }
}

export async function deleteMessage(id: string): Promise<void> {
  if (isLocalDatabaseOnly() || !db) {
    const current = readLocalDatabase();
    const updated = current.messages.filter(m => m.id !== id);
    writeLocalDatabase({ messages: updated });
    return;
  }
  try {
    const docRef = doc(db, "messages", id);
    await deleteDoc(docRef);
  } catch (e: any) {
    if (e?.code === "permission-denied" || String(e).includes("permission")) {
      handleFirestoreError(e, OperationType.DELETE, `messages/${id}`);
    }
    console.error("Error deleting message from Firestore:", e);
    throw e;
  }
}

export async function updateMessageStatus(id: string, updates: Partial<Message>): Promise<void> {
  if (isLocalDatabaseOnly() || !db) {
    const current = readLocalDatabase();
    const updated = current.messages.map(m => m.id === id ? { ...m, ...updates } : m);
    writeLocalDatabase({ messages: updated });
    return;
  }
  try {
    const docRef = doc(db, "messages", id);
    await setDoc(docRef, updates, { merge: true });
  } catch (e: any) {
    if (e?.code === "permission-denied" || String(e).includes("permission")) {
      handleFirestoreError(e, OperationType.WRITE, `messages/${id}`);
    }
    console.error("Error updating message in Firestore:", e);
    throw e;
  }
}

export async function getSettings(): Promise<AppSettings> {
  if (isLocalDatabaseOnly() || !db) {
    return readLocalDatabase().settings;
  }
  try {
    const snapshot = await getDocs(collection(db, "settings"));
    const generalDoc = snapshot.docs.find(d => d.id === "general") || snapshot.docs.find(d => d.id === "general_inova");
    if (!generalDoc) {
      return readLocalDatabase().settings;
    }
    const data = generalDoc.data();
    const merged = { ...DEFAULT_SETTINGS, ...data } as AppSettings;

    // If the database document is named general_inova but contains the updated settings (or default ones),
    // we should save it under "general" to ensure consistent naming and correct access in other queries.
    if (generalDoc.id === "general_inova" && !(merged.storeName === "InovaStudio" || merged.storeName?.toLowerCase().includes("inovastudio"))) {
      try {
        await setDoc(doc(db, "settings", "general"), merged);
        console.log("Copied general_inova settings to 'general' document successfully.");
      } catch (err) {
        console.error("Failed to copy general_inova to general:", err);
      }
    }
    
    // Auto-migrate settings if they are still set to InovaStudio
    if (merged.storeName === "InovaStudio" || merged.storeName?.toLowerCase().includes("inovastudio")) {
      merged.storeName = "Bambuzau 3D";
      merged.storeDescription = "Personalizados que conectam. O melhor do universo Geek, Marvel, decorações sofisticadas e impressões 3D sob medida com o mais alto nível de acabamento.";
      if (merged.shopeeStoreUrl?.includes("inovastudio")) {
        merged.shopeeStoreUrl = "https://shopee.com.br/bambuzau3d";
      }
      if (merged.whatsAppPhone === "5511999999999") {
        merged.whatsAppPhone = "5515997788281";
      }
      if (merged.socialInstagram === "inovastudio3d" || merged.socialInstagram === "inovastudio") {
        merged.socialInstagram = "bambuzau3d";
      }
      if (merged.wholesaleWhatsApp === "5511999999999") {
        merged.wholesaleWhatsApp = "5515997788281";
      }
      if (merged.wholesaleTelegram?.includes("inovastudio")) {
        merged.wholesaleTelegram = "https://t.me/bambuzau3d";
      }
      if (merged.contactEmail === "contato@inovastudio3d.com.br") {
        merged.contactEmail = "bambuzau3d@gmail.com";
      }
      try {
        await setDoc(doc(db, "settings", "general"), merged);
        console.log("Migrated Firestore settings from InovaStudio to Bambuzau 3D successfully!");
      } catch (err) {
        console.error("Failed to persist migrated settings back to Firestore:", err);
      }
    }
    
    return merged;
  } catch (e: any) {
    if (e?.code === "permission-denied" || String(e).includes("permission")) {
      handleFirestoreError(e, OperationType.GET, "settings");
    }
    console.error("Error fetching settings from Firestore:", e);
    return readLocalDatabase().settings;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  if (isLocalDatabaseOnly() || !db) {
    writeLocalDatabase({ settings });
    return;
  }
  try {
    const docRef = doc(db, "settings", "general");
    await setDoc(docRef, settings);
  } catch (e: any) {
    if (e?.code === "permission-denied" || String(e).includes("permission")) {
      handleFirestoreError(e, OperationType.WRITE, "settings/general");
    }
    console.error("Error saving settings to Firestore:", e);
    throw e;
  }
}

export async function seedDatabaseIfEmpty() {
  if (!db) {
    console.warn("[Firebase Seeder] Firebase not configured. Skipping seeder.");
    return;
  }
  try {
    console.log("[Firebase Seeder] Checking database status...");
    
    let settings = DEFAULT_SETTINGS;
    let categories = DEFAULT_CATEGORIES;
    let products = DEFAULT_PRODUCTS;

    // Load from backup JSON if exists in the bundle
    const backupPath = getBackupPath();
    let backupLoaded = false;
    if (fs.existsSync(backupPath)) {
      try {
        console.log("[Firebase Seeder] Reading backup from:", backupPath);
        const backupContent = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
        if (backupContent.settings && Object.keys(backupContent.settings).length > 0) {
          settings = backupContent.settings;
        }
        if (backupContent.categories && backupContent.categories.length > 0) {
          categories = backupContent.categories;
        }
        if (backupContent.products && backupContent.products.length > 0) {
          products = backupContent.products;
        }
        backupLoaded = true;
        console.log(`[Firebase Seeder] Successfully parsed backup file: ${categories.length} categories, ${products.length} products loaded.`);
      } catch (err) {
        console.error("[Firebase Seeder] Failed to parse backup file, using defaults:", err);
      }
    }
    
    if (!backupLoaded && shippedLocalDb) {
      console.log("[Firebase Seeder] Reading backup from statically imported local_db_backup.json...");
      if (shippedLocalDb.settings && Object.keys(shippedLocalDb.settings).length > 0) {
        settings = shippedLocalDb.settings;
      }
      if (shippedLocalDb.categories && shippedLocalDb.categories.length > 0) {
        categories = shippedLocalDb.categories as any[];
      }
      if (shippedLocalDb.products && shippedLocalDb.products.length > 0) {
        products = shippedLocalDb.products as any[];
      }
      backupLoaded = true;
    }

    // Seed Settings if empty
    const settingsCol = collection(db, "settings");
    const settingsSnapshot = await getDocs(settingsCol);
    if (settingsSnapshot.empty) {
      console.log("[Firebase Seeder] Seeding general settings...");
      const docRef = doc(db, "settings", "general");
      await setDoc(docRef, settings);
    } else {
      console.log("[Firebase Seeder] Settings already initialized.");
    }

    // Sync/Seed Categories if any backup category is missing from Firestore
    const categoriesCol = collection(db, "categories");
    const categoriesSnapshot = await getDocs(categoriesCol);
    const existingCatIds = new Set(categoriesSnapshot.docs.map(doc => doc.id));
    const missingCats = categories.filter(cat => !existingCatIds.has(cat.id));

    if (missingCats.length > 0 || categoriesSnapshot.empty) {
      console.log(`[Firebase Seeder] Found ${missingCats.length} missing categories. Synchronizing all categories to Firestore...`);
      const catBatch = writeBatch(db);
      for (const cat of categories) {
        const docRef = doc(db, "categories", cat.id);
        catBatch.set(docRef, cat, { merge: true });
      }
      await catBatch.commit();
      console.log("[Firebase Seeder] Categories synchronized successfully.");
    } else {
      console.log("[Firebase Seeder] All categories are already present in Firestore.");
    }

    // Sync/Seed Products if any backup product is missing from Firestore
    const productsCol = collection(db, "products");
    const productsSnapshot = await getDocs(productsCol);
    const existingProdIds = new Set(productsSnapshot.docs.map(doc => String(doc.id)));
    const missingProds = products.filter(prod => !existingProdIds.has(String(prod.id)));

    if (missingProds.length > 0 || productsSnapshot.empty) {
      console.log(`[Firebase Seeder] Found ${missingProds.length} missing products. Synchronizing all products to Firestore...`);
      const prodBatch = writeBatch(db);
      for (const prod of products) {
        const docRef = doc(db, "products", String(prod.id));
        prodBatch.set(docRef, prod, { merge: true });
      }
      await prodBatch.commit();
      console.log("[Firebase Seeder] Products synchronized successfully.");
    } else {
      console.log("[Firebase Seeder] All products are already present in Firestore.");
    }
  } catch (e: any) {
    if (e?.code === "permission-denied" || String(e).includes("permission")) {
      handleFirestoreError(e, OperationType.WRITE, "seed");
    }
    console.error("[Firebase Seeder] Error seeding database:", e);
  }
}

export async function forceSyncDatabase(): Promise<{ success: boolean; message: string }> {
  if (!db) {
    throw new Error("Firebase não configurado. Não é possível sincronizar no modo local.");
  }
  try {
    let categories = DEFAULT_CATEGORIES;
    let products = DEFAULT_PRODUCTS;

    const backupPath = path.join(process.cwd(), "src", "data", "local_db_backup.json");
    if (fs.existsSync(backupPath)) {
      try {
        const backupContent = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
        if (backupContent.categories && backupContent.categories.length > 0) {
          categories = backupContent.categories;
        }
        if (backupContent.products && backupContent.products.length > 0) {
          products = backupContent.products;
        }
      } catch (err) {
        console.error("[Force Sync] Failed to parse backup file:", err);
      }
    }

    console.log(`[Force Sync] Synchronizing ${categories.length} categories to Firestore...`);
    const catBatch = writeBatch(db);
    for (const cat of categories) {
      const docRef = doc(db, "categories", cat.id);
      catBatch.set(docRef, cat, { merge: true });
    }
    await catBatch.commit();

    console.log(`[Force Sync] Synchronizing ${products.length} products to Firestore...`);
    const prodBatch = writeBatch(db);
    for (const prod of products) {
      const docRef = doc(db, "products", String(prod.id));
      prodBatch.set(docRef, prod, { merge: true });
    }
    await prodBatch.commit();

    return { 
      success: true, 
      message: `Sincronização forçada concluída com sucesso: ${categories.length} categorias e ${products.length} produtos sincronizados.` 
    };
  } catch (e: any) {
    console.error("[Force Sync] Error:", e);
    throw e;
  }
}

export async function forceRecreateDatabase(): Promise<{ success: boolean; message: string }> {
  if (!db) {
    throw new Error("Firebase não configurado. Não é possível recriar o banco de dados no modo local.");
  }
  try {
    console.log("[Force Recreate] Iniciando recriação completa do banco de dados...");

    // 1. Fetch and delete existing documents in products
    const productsCol = collection(db, "products");
    const productsSnapshot = await getDocs(productsCol);
    for (const docSnap of productsSnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    console.log("[Force Recreate] Produtos antigos removidos.");

    // 2. Fetch and delete existing documents in categories
    const categoriesCol = collection(db, "categories");
    const categoriesSnapshot = await getDocs(categoriesCol);
    for (const docSnap of categoriesSnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    console.log("[Force Recreate] Categorias antigas removidas.");

    // 3. Fetch and delete existing documents in settings
    const settingsCol = collection(db, "settings");
    const settingsSnapshot = await getDocs(settingsCol);
    for (const docSnap of settingsSnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    console.log("[Force Recreate] Configurações antigas removidas.");

    // 4. Fetch and delete existing documents in messages
    const messagesCol = collection(db, "messages");
    const messagesSnapshot = await getDocs(messagesCol);
    for (const docSnap of messagesSnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    console.log("[Force Recreate] Mensagens antigas removidas.");

    // 5. Overwrite local backup file with clean template defaults
    const backupPath = path.join(process.cwd(), "src", "data", "local_db_backup.json");
    const pristineData = {
      settings: DEFAULT_SETTINGS,
      categories: DEFAULT_CATEGORIES,
      products: DEFAULT_PRODUCTS,
      messages: [],
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(backupPath, JSON.stringify(pristineData, null, 2), "utf-8");
    console.log("[Force Recreate] Arquivo JSON local sobrescrito com os dados padrão.");

    // 6. Write defaults back to Firestore
    // Write Settings
    const settingsDocRef = doc(db, "settings", "general");
    await setDoc(settingsDocRef, DEFAULT_SETTINGS);

    // Write Categories in batch
    const catBatch = writeBatch(db);
    for (const cat of DEFAULT_CATEGORIES) {
      const docRef = doc(db, "categories", cat.id);
      catBatch.set(docRef, cat);
    }
    await catBatch.commit();

    // Write Products in batch
    const prodBatch = writeBatch(db);
    for (const prod of DEFAULT_PRODUCTS) {
      const docRef = doc(db, "products", String(prod.id));
      prodBatch.set(docRef, prod);
    }
    await prodBatch.commit();

    console.log("[Force Recreate] Banco de dados totalmente recriado e restabelecido!");
    return {
      success: true,
      message: "Banco de dados recriado com sucesso com as configurações e produtos originais!"
    };
  } catch (e: any) {
    console.error("[Force Recreate] Falha na recriação:", e);
    throw e;
  }
}

