"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orderDrafts, setOrderDrafts] = useState<Record<string, { quantity: string; unit: string }>>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (storedUser.role !== "BUYER") {
      router.push("/login");
      return;
    }

    setUser(storedUser);
    setAuthorized(true);

    async function loadProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    }

    loadProducts();
  }, [router]);

  async function placeOrder(productId: string) {
    if (!user?.id) {
      alert("Please login first");
      return;
    }

    const draft = orderDrafts[productId] || { quantity: "1", unit: "G" };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buyerId: user.id,
        productId,
        quantity: Number(draft.quantity),
        unit: draft.unit,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error?.error || "Unable to create order");
      return;
    }

    alert("Order created successfully.");
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!authorized) {
    return <div className="p-10">Checking Access...</div>;
  }

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">
            Buyer Dashboard
          </h1>
          <p className="text-slate-600">
            Logged in as <strong>{user?.name}</strong>
          </p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-950 transition hover:bg-slate-100"
        >
          Logout
        </button>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Available Products</h2>
            <p className="text-slate-600">Browse inventory and place orders quickly.</p>
          </div>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 sm:w-72"
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filteredProducts.map((product) => (
            <div key={product.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">{product.name}</h3>
                  <p className="text-sm text-slate-500">SKU: {product.sku}</p>
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-sm text-white">
                  ₹{Number(product.pricePerUnit).toFixed(2)} / {product.baseUnit?.toLowerCase() || 'unit'}
                </span>
              </div>

              <p className="mt-4 text-slate-700">{product.description}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                <span>Stock: {product.stockQuantity}</span>
                <span>Seller: {product.seller?.name || "Unknown"}</span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={(orderDrafts[product.id]?.quantity) ?? "1"}
                  onChange={(e) =>
                    setOrderDrafts({
                      ...orderDrafts,
                      [product.id]: {
                        ...(orderDrafts[product.id] || { unit: product.baseUnit || 'G' }),
                        quantity: e.target.value,
                      },
                    })
                  }
                  className="w-28 rounded-2xl border border-slate-300 bg-white px-3 py-2"
                />

                <select
                  value={(orderDrafts[product.id]?.unit) ?? (product.baseUnit || 'G')}
                  onChange={(e) =>
                    setOrderDrafts({
                      ...orderDrafts,
                      [product.id]: {
                        ...(orderDrafts[product.id] || { quantity: '1' }),
                        unit: e.target.value,
                      },
                    })
                  }
                  className="rounded-2xl border border-slate-300 bg-white px-3 py-2"
                >
                  <option value="G">g</option>
                  <option value="KG">kg</option>
                  <option value="L">L</option>
                  <option value="ML">mL</option>
                  <option value="UNIT">unit</option>
                </select>
              </div>

              <button
                onClick={() => placeOrder(product.id)}
                className="mt-5 rounded-2xl bg-slate-950 px-4 py-3 text-white transition hover:bg-slate-800"
              >
                Place Order
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
