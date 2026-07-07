import { db, getSettings } from "./src/lib/firebase-server";
import { collection, getDocs } from "firebase/firestore";

async function test() {
  console.log("Starting Firebase connection test...");
  console.log("db is initialized:", !!db);
  try {
    const settings = await getSettings();
    console.log("getSettings() succeeded! Result keys:", Object.keys(settings));
  } catch (err: any) {
    console.error("getSettings() failed with error:", err.message, err.stack);
  }

  if (db) {
    try {
      console.log("Direct collection getDocs query...");
      const snapshot = await getDocs(collection(db, "settings"));
      console.log("Query success! Found docs count:", snapshot.size);
      snapshot.forEach(doc => {
        console.log("Doc ID:", doc.id, "Keys:", Object.keys(doc.data()));
      });
    } catch (err: any) {
      console.error("Direct getDocs query failed with error:", err.message, err.stack);
    }
  }
}

test();
