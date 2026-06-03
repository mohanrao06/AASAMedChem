"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    dimension: "WEIGHT",
    baseUnit: "G",
    stockQuantity: "1000",
    pricePerUnit: "10",
  });

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (storedUser.role !== "SELLER") {
      router.push("/login");
      return;
    }

    setUser(storedUser);
    setAuthorized(true);
  }, [router]);

  async function submit() {
    if (!user?.id) {
      alert("Please login first");
      return;
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        stockQuantity: Number(form.stockQuantity),
        pricePerUnit: Number(form.pricePerUnit),
        sellerId: user.id,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error?.error || "Unable to add product");
      return;
    }

    setForm({
      name: "",
      description: "",
      sku: "",
      dimension: "WEIGHT",
      baseUnit: "g",
      stockQuantity: "1000",
      pricePerUnit: "10",
    });

    alert("Product added successfully.");
  }

  if (!authorized) {
    return <div className="p-10">Checking Access...</div>;
  }

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">
            Seller Dashboard
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

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
        <h2 className="text-2xl font-semibold text-slate-950 mb-4">
          Add a new product
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Product Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              placeholder="Name"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">SKU</span>
            <input
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              placeholder="SKU"
            />
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              rows={4}
              placeholder="Product description"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Stock Quantity</span>
            <input
              value={form.stockQuantity}
              onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              placeholder="1000"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Price Per Unit</span>
            <input
              value={form.pricePerUnit}
              onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              placeholder="10"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Unit</span>
            <select
              value={form.baseUnit}
              onChange={(e) => setForm({ ...form, baseUnit: e.target.value })}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            >
              <option value="G">grams (g)</option>
              <option value="KG">kilograms (kg)</option>
              <option value="L">liters (L)</option>
              <option value="ML">milliliters (mL)</option>
              <option value="UNIT">items (unit)</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={submit}
            className="rounded-2xl bg-slate-950 px-6 py-3 text-white transition hover:bg-slate-800"
          >
            Add Product
          </button>
        </div>
      </section>
    </main>
  );
}
