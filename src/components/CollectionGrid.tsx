import { ChevronDown } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

const PRODUCTS = [
  { id: 1, name: "Terracotta Amphora", price: "$120", image: "pottery-vase-gray.png", tag: "NEW" },
  { id: 2, name: "Speckled Mug Set of 2", price: "$68", image: "pottery-mug-oat.png", tag: "LOW STOCK" },
  { id: 3, name: "Heavyweight Linen Throw", price: "$185", image: "pottery-linen-throw.png" },
  { id: 4, name: "Umber Serving Bowl", price: "$140", image: "pottery-bowl-umber.png" },
  { id: 5, name: "Cream Dinner Plate", price: "$48", image: "pottery-plate-cream.png" },
  { id: 6, name: "Tall Stoneware Vase", price: "$145", image: "pottery-bowl-terra.png" },
  { id: 7, name: "Umber Espresso Cup", price: "$36", image: "pottery-cup-umber.png" },
  { id: 8, name: "Hand-Thrown Detail Vessel", price: "$210", image: "pottery-detail.png", tag: "LIMITED" },
  { id: 9, name: "Textured Stoneware Vase", price: "$165", image: "pottery-texture.png" },
];

export function CollectionGrid() {
  return (
    <section id="collection" className="w-full bg-pottery-cream font-sans py-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="font-editorial text-5xl text-pottery-ink mb-6">All Objects</h2>
          <p className="text-pottery-muted text-lg font-light leading-relaxed">
            Thoughtfully designed pieces for everyday living. Explore our full collection of ceramics, textiles, and homewares.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="w-full lg:w-64 shrink-0 space-y-10">
            <div>
              <h3 className="text-sm tracking-widest uppercase text-pottery-ink mb-4">Category</h3>
              <ul className="space-y-3 text-sm text-pottery-muted font-light">
                <li className="flex justify-between text-pottery-ink"><a href="#collection">All Objects</a><span>42</span></li>
                <li className="flex justify-between hover:text-pottery-ink transition-slow"><a href="#collection">Ceramics</a><span>18</span></li>
                <li className="flex justify-between hover:text-pottery-ink transition-slow"><a href="#collection">Linens</a><span>12</span></li>
                <li className="flex justify-between hover:text-pottery-ink transition-slow"><a href="#collection">Lighting</a><span>8</span></li>
                <li className="flex justify-between hover:text-pottery-ink transition-slow"><a href="#collection">Furniture</a><span>4</span></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm tracking-widest uppercase text-pottery-ink mb-4">Price</h3>
              <ul className="space-y-3 text-sm text-pottery-muted font-light">
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-pottery-hairline text-pottery-ink focus:ring-pottery-ink" />
                  <span>Under $50</span>
                </li>
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-pottery-hairline text-pottery-ink focus:ring-pottery-ink" />
                  <span>$50–$150</span>
                </li>
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-pottery-hairline text-pottery-ink focus:ring-pottery-ink" />
                  <span>Over $150</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm tracking-widest uppercase text-pottery-ink mb-4">Material</h3>
              <ul className="space-y-3 text-sm text-pottery-muted font-light">
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-pottery-hairline text-pottery-ink focus:ring-pottery-ink" />
                  <span>Stoneware</span>
                </li>
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-pottery-hairline text-pottery-ink focus:ring-pottery-ink" />
                  <span>Linen</span>
                </li>
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-pottery-hairline text-pottery-ink focus:ring-pottery-ink" />
                  <span>Brass</span>
                </li>
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-pottery-hairline text-pottery-ink focus:ring-pottery-ink" />
                  <span>Wood</span>
                </li>
              </ul>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-8 border-b border-pottery-hairline pb-4">
              <button className="flex items-center gap-2 text-sm text-pottery-ink bg-pottery-white-warm px-4 py-2 border border-pottery-hairline rounded-sm">
                <span className="w-2 h-2 rounded-full bg-pottery-terracotta"></span>
                In Stock
              </button>
              <button className="flex items-center gap-2 text-sm text-pottery-ink">
                Sort by: Featured <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {PRODUCTS.map((product) => (
                <a href="#" key={product.id} className="group block">
                  <div className="aspect-[4/3] bg-pottery-white-warm mb-4 relative rounded-sm overflow-hidden border border-pottery-hairline">
                    <img
                      src={`${BASE.endsWith("/") ? BASE.slice(0, -1) : BASE}/images/${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-slow group-hover:scale-105"
                    />
                    {product.tag && (
                      <div className="absolute top-4 left-4 bg-pottery-white-warm px-3 py-1 text-[10px] tracking-widest uppercase text-pottery-ink border border-pottery-hairline rounded-sm">
                        {product.tag}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-baseline mt-4">
                    <h3 className="font-editorial text-lg text-pottery-ink">{product.name}</h3>
                    <span className="text-pottery-ink font-light text-sm pl-4">{product.price}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
