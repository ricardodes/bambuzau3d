const BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || "/";
const cleanBase = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;

// Immutable local image repository protecting high-quality 3D printing assets
export const SAFE_PRODUCT_IMAGES: Record<number, string> = {
  1: "dragon-3d.jpg",
  2: "vase-3d.jpg",
  3: "organizer-3d.webp",
  4: "figurine-3d.jpg",
  5: "art-sculpture.jpg",
  6: "vase-3d.jpg",
  7: "organizer-3d.webp",
  8: "figurine-3d.jpg",
  9: "pet-3d.jpg",
  10: "pet-3d.jpg",
  11: "support-3d.jpg",
  12: "support-3d.jpg",
  13: "organizer-3d.webp",
  14: "organizer-3d.webp",
  15: "festive-3d.jpg",
  16: "festive-3d.jpg",
  17: "event-3d.jpg",
  18: "event-3d.jpg",
  19: "utility-3d.jpg",
  20: "utility-3d.jpg"
};

export const SAFE_CATEGORY_IMAGES: Record<string, string> = {
  "decorativos": "art-sculpture.jpg",
  "lustres": "lustres.jpg",
  "aquario": "aquario.jpg",
  "brinquedos": "dragon-3d.jpg",
  "personalizados": "figurine-3d.jpg",
  "pets": "pet-3d.jpg",
  "suportes": "support-3d.jpg",
  "organizacao": "organizer-3d.jpg",
  "datas-festivas": "festive-3d.jpg",
  "eventos": "event-3d.jpg",
  "utilidades": "utility-3d.jpg",
  "profissionais": "profissionais.jpg",
  "saude-dia-a-dia": "saude.jpg",
  "automotivas": "automotivas.jpg"
};

/**
 * Returns a robust, safe image URL for a product.
 * If the product is a default product (ID 1-20), it will ALWAYS return the local safe backup image
 * even if the database is broken or has modified values.
 */
export function getSafeProductImage(productId: number | string, dbImage: string): string {
  const numericId = Number(productId);
  const localImage = isNaN(numericId) ? undefined : SAFE_PRODUCT_IMAGES[numericId];
  const targetImage = localImage || dbImage;
  
  if (!targetImage) {
    return `${cleanBase}/images/art-sculpture.jpg`;
  }
  
  if (targetImage.startsWith("http")) {
    return targetImage;
  }
  
  return `${cleanBase}/images/${targetImage}`;
}

/**
 * Returns a robust, safe image URL for a category.
 * If the category is a default category, it will ALWAYS return the local safe backup image.
 */
export function getSafeCategoryImage(categoryId: string | undefined | null, dbImage: string): string {
  if (!categoryId) {
    return `${cleanBase}/images/art-sculpture.jpg`;
  }
  const localImage = SAFE_CATEGORY_IMAGES[categoryId];
  const targetImage = localImage || dbImage;
  
  if (!targetImage) {
    return `${cleanBase}/images/art-sculpture.jpg`;
  }
  
  if (targetImage.startsWith("http")) {
    return targetImage;
  }
  
  return `${cleanBase}/images/${targetImage}`;
}
