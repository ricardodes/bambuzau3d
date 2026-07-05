import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  writeBatch
} from "firebase/firestore";
import fs from "fs";
import path from "path";

// Find and load firebase-applet-config.json
const loadConfig = () => {
  const p = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(p)) {
    try {
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch (e) {
      console.error("Error parsing Firebase config:", e);
    }
  }
  return null;
};

const config = loadConfig();
if (!config) {
  console.warn("WARNING: firebase-applet-config.json not found! Running in local fallback mode.");
}

export const app = config ? (getApps().length === 0 ? initializeApp(config) : getApp()) : null;
export const db = app ? (config.firestoreDatabaseId ? getFirestore(app, config.firestoreDatabaseId) : getFirestore(app)) : null;

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
    id: "geek-marvel",
    label: "Universo Geek",
    desc: "Bustos, action figures e colecionáveis do seu universo favorito",
    image: "figurine-3d.jpg",
    href: "#geek-marvel",
    imageScale: "center center",
  },
  {
    id: "decorativos",
    label: "Decoração & Vasos",
    desc: "Lustres geométricos e vasos decorativos com brilho acetinado",
    image: "art-sculpture.jpg",
    href: "#decorativos",
    imageScale: "center 30%",
  },
  {
    id: "personalizados",
    label: "Personalizados",
    desc: "Lembrancinhas, troféus e projetos sob medida para você ou sua empresa",
    image: "event-3d.jpg",
    href: "#personalizados",
    imageScale: "center 10%",
  },
  {
    id: "utilidades",
    label: "Utilidades Gerais",
    desc: "Soluções inteligentes, comedouros pet e itens práticos para o dia a dia",
    image: "utility-3d.jpg",
    href: "#utilidades",
    imageScale: "center center",
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
  if (!db) {
    console.warn("Firebase not configured. Returning DEFAULT_CATEGORIES fallback.");
    return DEFAULT_CATEGORIES;
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
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  if (!db) {
    console.warn("Firebase not configured. Returning DEFAULT_PRODUCTS fallback.");
    return DEFAULT_PRODUCTS;
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
    return [];
  }
}

// Product Write operations
export async function addProduct(prod: Product): Promise<void> {
  if (!db) {
    throw new Error("Firebase não configurado. Não é possível adicionar produtos no modo de fallback local.");
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
  if (!db) {
    throw new Error("Firebase não configurado. Não é possível remover produtos no modo de fallback local.");
  }
  try {
    const { deleteDoc } = await import("firebase/firestore");
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
  contactEmail: "bambuzau3d@gmail.com"
};

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
  if (!db) {
    console.warn("Firebase not configured. Returning empty messages list.");
    return [];
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
    return [];
  }
}

export async function addMessage(msg: Omit<Message, "id" | "createdAt" | "read" | "replied">): Promise<void> {
  if (!db) {
    console.warn("Firebase not configured. Simulated sending message:", msg);
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
  if (!db) {
    throw new Error("Firebase não configurado. Não é possível excluir mensagens no modo de fallback local.");
  }
  try {
    const { deleteDoc } = await import("firebase/firestore");
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
  if (!db) {
    throw new Error("Firebase não configurado. Não é possível atualizar mensagens no modo de fallback local.");
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
  if (!db) {
    console.warn("Firebase not configured. Returning DEFAULT_SETTINGS fallback.");
    return DEFAULT_SETTINGS;
  }
  try {
    const snapshot = await getDocs(collection(db, "settings"));
    const generalDoc = snapshot.docs.find(d => d.id === "general");
    if (!generalDoc) {
      return DEFAULT_SETTINGS;
    }
    const data = generalDoc.data();
    const merged = { ...DEFAULT_SETTINGS, ...data } as AppSettings;
    
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
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  if (!db) {
    throw new Error("Firebase não configurado. Não é possível salvar configurações no modo de fallback local.");
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
    
    // Seed settings
    const settingsCol = collection(db, "settings");
    const settingsSnapshot = await getDocs(settingsCol);
    if (settingsSnapshot.empty) {
      console.log("[Firebase Seeder] Settings collection is empty. Seeding DEFAULT_SETTINGS...");
      const docRef = doc(db, "settings", "general");
      await setDoc(docRef, DEFAULT_SETTINGS);
    }

    console.log("[Firebase Seeder] Synchronizing DEFAULT_CATEGORIES to Firestore...");
    const catBatch = writeBatch(db);
    for (const cat of DEFAULT_CATEGORIES) {
      const docRef = doc(db, "categories", cat.id);
      catBatch.set(docRef, cat, { merge: true });
    }
    await catBatch.commit();
    console.log("[Firebase Seeder] Categories synced successfully.");
    
    console.log("[Firebase Seeder] Synchronizing DEFAULT_PRODUCTS to Firestore...");
    const prodBatch = writeBatch(db);
    for (const prod of DEFAULT_PRODUCTS) {
      const docRef = doc(db, "products", String(prod.id));
      prodBatch.set(docRef, prod, { merge: true });
    }
    await prodBatch.commit();
    console.log("[Firebase Seeder] Products synced successfully.");
  } catch (e: any) {
    if (e?.code === "permission-denied" || String(e).includes("permission")) {
      handleFirestoreError(e, OperationType.WRITE, "seed");
    }
    console.error("[Firebase Seeder] Error seeding database:", e);
  }
}

