import fs from "fs";
import path from "path";
import { db, getSettings, getProducts, getCategories, getMessages, DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from "./firebase-server";
import { doc, setDoc, writeBatch } from "firebase/firestore";
import shippedLocalDb from "../data/local_db_backup.json";

const isVercel = !!process.env.VERCEL;
const BACKUP_DIR = isVercel 
  ? path.join("/tmp", "data")
  : path.join(process.cwd(), "src", "data");
const LOCAL_DB_PATH = path.join(BACKUP_DIR, "local_db_backup.json");
const DAILY_BACKUP_DIR = path.join(BACKUP_DIR, "daily_backups");

// Ensure backup directories exist
function ensureDirs() {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    if (!fs.existsSync(DAILY_BACKUP_DIR)) {
      fs.mkdirSync(DAILY_BACKUP_DIR, { recursive: true });
    }
  } catch (e) {
    console.warn("[Backup System] Não foi possível criar pastas locais de backup (esperado em ambientes serverless como Vercel):", e);
  }
}

export interface BackupData {
  settings: any;
  products: any[];
  categories: any[];
  messages: any[];
  lastUpdated: string;
}

// Read current local backup DB
export function getBackupDB(): BackupData {
  ensureDirs();

  if (!fs.existsSync(LOCAL_DB_PATH)) {
    if (shippedLocalDb) {
      try {
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(shippedLocalDb, null, 2), "utf-8");
        console.log("[Backup System] Successfully cached shipped DB file into:", LOCAL_DB_PATH);
      } catch (writeErr) {
        console.warn("[Backup System] Failed to cache shipped DB file into writeable path:", writeErr);
      }
      return {
        settings: shippedLocalDb.settings || {},
        products: shippedLocalDb.products || [],
        categories: shippedLocalDb.categories || [],
        messages: shippedLocalDb.messages || [],
        lastUpdated: (shippedLocalDb as any).lastUpdated || new Date().toISOString()
      };
    }
  }

  if (fs.existsSync(LOCAL_DB_PATH)) {
    try {
      const fileContent = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      const data = JSON.parse(fileContent);

      return {
        settings: data.settings || {},
        products: data.products || [],
        categories: data.categories || [],
        messages: data.messages || [],
        lastUpdated: data.lastUpdated || new Date().toISOString()
      };
    } catch (e) {
      console.error("Erro ao ler banco de dados secundário local JSON:", e);
    }
  }

  // Fallback initial empty structure
  return {
    settings: {},
    products: [],
    categories: [],
    messages: [],
    lastUpdated: new Date().toISOString()
  };
}

// Synchronize primary Firestore DB data to the secondary local JSON database
export async function syncToBackupDB(updates: {
  settings?: any;
  products?: any[];
  categories?: any[];
  messages?: any[];
}) {
  ensureDirs();
  const current = getBackupDB();

  if (updates.settings) current.settings = updates.settings;
  if (updates.products) current.products = updates.products;
  if (updates.categories) current.categories = updates.categories;
  if (updates.messages) current.messages = updates.messages;

  current.lastUpdated = new Date().toISOString();

  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(current, null, 2), "utf-8");
    console.log("[Banco de Dados Secundário] Sincronizado com sucesso!");
  } catch (e) {
    console.error("Falha ao salvar no banco de dados secundário:", e);
  }
}

// Seed local database mirror by fetching fresh snapshots from Firestore
export async function seedBackupDBFromFirestore(): Promise<BackupData> {
  console.log("[Banco de Dados Secundário] Sincronizando espelhamento inicial do Firestore...");
  try {
    const settings = await getSettings();
    const products = await getProducts();
    const categories = await getCategories();
    const messages = await getMessages();

    const data: BackupData = {
      settings,
      products,
      categories,
      messages,
      lastUpdated: new Date().toISOString()
    };

    ensureDirs();
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    console.log("[Banco de Dados Secundário] Espelhamento inicial concluído!");
    return data;
  } catch (e) {
    console.error("Falha ao sincronizar espelhamento inicial do Firestore:", e);
    return getBackupDB();
  }
}

// Automatic Daily Backup Engine
export async function triggerAutomaticDailyBackup(): Promise<{ success: boolean; filename?: string; isNew?: boolean }> {
  ensureDirs();
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
  const backupFileName = `backup-${today}.json`;
  const backupFilePath = path.join(DAILY_BACKUP_DIR, backupFileName);

  // If a backup for today already exists, skip creating a new one to prevent unnecessary I/O
  if (fs.existsSync(backupFilePath)) {
    return { success: true, filename: backupFileName, isNew: false };
  }

  try {
    // Read current state (seed it from Firestore to make sure it's fresh)
    const freshData = await seedBackupDBFromFirestore();

    // Save as daily backup file
    fs.writeFileSync(backupFilePath, JSON.stringify(freshData, null, 2), "utf-8");
    console.log(`[Backup Automático] Diário criado com sucesso: ${backupFileName}`);

    // Clean up old daily backups (keep only the last 7 daily backups to protect storage space)
    const files = fs.readdirSync(DAILY_BACKUP_DIR)
      .filter(f => f.startsWith("backup-") && f.endsWith(".json"))
      .map(f => ({ name: f, path: path.join(DAILY_BACKUP_DIR, f), time: fs.statSync(path.join(DAILY_BACKUP_DIR, f)).mtime.getTime() }))
      .sort((a, b) => b.time - a.time); // newest first

    if (files.length > 7) {
      const oldFiles = files.slice(7);
      for (const old of oldFiles) {
        fs.unlinkSync(old.path);
        console.log(`[Backup Automático] Removido backup antigo excedente: ${old.name}`);
      }
    }

    return { success: true, filename: backupFileName, isNew: true };
  } catch (e) {
    console.error("Erro no backup automático diário:", e);
    return { success: false };
  }
}

// Get list of daily backups stored on the server
export function getDailyBackupsList(): { name: string; size: string; createdAt: string }[] {
  ensureDirs();
  if (!fs.existsSync(DAILY_BACKUP_DIR)) return [];

  try {
    return fs.readdirSync(DAILY_BACKUP_DIR)
      .filter(f => f.startsWith("backup-") && f.endsWith(".json"))
      .map(f => {
        const filePath = path.join(DAILY_BACKUP_DIR, f);
        const stats = fs.statSync(filePath);
        const sizeInKB = (stats.size / 1024).toFixed(1) + " KB";
        return {
          name: f,
          size: sizeInKB,
          createdAt: stats.mtime.toISOString()
        };
      })
      .sort((a, b) => b.name.localeCompare(a.name)); // newest dates first
  } catch (e) {
    console.error("Erro ao listar backups diários:", e);
    return [];
  }
}

// Restore entire backup data back into Firestore and the local JSON DB
export async function restoreBackup(backup: any): Promise<{ success: boolean; message: string }> {
  if (!backup || (!backup.settings && !backup.products)) {
    return { success: false, message: "Arquivo de backup inválido ou vazio." };
  }

  try {
    ensureDirs();

    // 1. Restore local JSON secondary database
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({
      settings: backup.settings || {},
      products: backup.products || [],
      categories: backup.categories || DEFAULT_CATEGORIES,
      messages: backup.messages || [],
      lastUpdated: new Date().toISOString()
    }, null, 2), "utf-8");

    // 2. Restore primary Firestore (if active)
    if (db) {
      console.log("[Backup Restore] Restaurando dados para o Firestore...");

      // Restore Settings
      if (backup.settings) {
        const docRef = doc(db, "settings", "general");
        await setDoc(docRef, backup.settings);
      }

      // Restore Categories
      const categoriesToRestore = backup.categories && backup.categories.length > 0 ? backup.categories : DEFAULT_CATEGORIES;
      const catBatch = writeBatch(db);
      for (const cat of categoriesToRestore) {
        const docRef = doc(db, "categories", cat.id);
        catBatch.set(docRef, cat, { merge: true });
      }
      await catBatch.commit();

      // Restore Products
      const productsToRestore = backup.products && backup.products.length > 0 ? backup.products : DEFAULT_PRODUCTS;
      const prodBatch = writeBatch(db);
      // Clean old products by recreating them
      for (const prod of productsToRestore) {
        const docRef = doc(db, "products", String(prod.id));
        prodBatch.set(docRef, prod, { merge: true });
      }
      await prodBatch.commit();

      // Restore Messages
      if (backup.messages && backup.messages.length > 0) {
        const msgBatch = writeBatch(db);
        for (const msg of backup.messages) {
          if (msg.id) {
            const docRef = doc(db, "messages", msg.id);
            msgBatch.set(docRef, msg, { merge: true });
          }
        }
        await msgBatch.commit();
      }
    }

    console.log("[Backup Restore] Restauração completa efetuada!");
    return { success: true, message: "Backup restaurado com sucesso no Firestore e no banco secundário!" };
  } catch (e: any) {
    console.error("Falha ao restaurar backup:", e);
    return { success: false, message: `Erro ao restaurar backup: ${e.message || e}` };
  }
}
