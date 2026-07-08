async function test() {
  console.log("Testing API endpoints on localhost:3000...");
  try {
    const resProducts = await fetch("http://localhost:3000/api/products");
    console.log("Products response status:", resProducts.status);
    const textProducts = await resProducts.text();
    console.log("Products response text (first 200 chars):", textProducts.slice(0, 200));
  } catch (err: any) {
    console.error("Failed to fetch /api/products:", err.message);
  }

  try {
    const resSettings = await fetch("http://localhost:3000/api/settings");
    console.log("Settings response status:", resSettings.status);
    const textSettings = await resSettings.text();
    console.log("Settings response text (first 200 chars):", textSettings.slice(0, 200));
  } catch (err: any) {
    console.error("Failed to fetch /api/settings:", err.message);
  }

  try {
    const resVerify = await fetch("http://localhost:3000/api/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "admin" })
    });
    console.log("Verify response status:", resVerify.status);
    const textVerify = await resVerify.text();
    console.log("Verify response text (first 200 chars):", textVerify.slice(0, 200));
  } catch (err: any) {
    console.error("Failed to fetch /api/verify-password:", err.message);
  }
}

test();
