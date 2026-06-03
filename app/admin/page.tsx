"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const statusStyle = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-100 text-emerald-700";
    case "REJECTED":
      return "bg-rose-100 text-rose-700";
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function AdminPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({ buyers: 0, sellers: 0, orders: 0, products: 0 });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role !== "ADMIN") {
      router.push("/login");
      return;
    }

    setAuthorized(true);
    loadOrders();
    loadProducts();
    loadStats();
  }, [router]);

  async function loadOrders() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
  }

  async function loadProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  async function loadStats() {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  }

  async function updateStatus(orderId: string, status: string) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    loadOrders();
  }

  if (!authorized) {
    return <div className="p-10">Checking Access...</div>;
  }

  return (
    <main className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Buyers</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{stats.buyers}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Sellers</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{stats.sellers}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Orders</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{stats.orders}</p>
          <p className="text-sm text-slate-600">Total value: ₹{Number(stats.totalOrderValue || 0).toFixed(2)}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Products</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{stats.products}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Admin Dashboard</h1>
          <p className="text-slate-600">Monitor products, orders, and approvals.</p>
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
        <h2 className="text-2xl font-semibold text-slate-950 mb-4">Seller Products</h2>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
            No products found yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {products.map((product) => (
              <div key={product.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{product.name}</h3>
                    <p className="text-sm text-slate-500">SKU: {product.sku}</p>
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-sm text-white">
                    ₹{product.pricePerUnit}
                  </span>
                </div>
                <p className="mt-4 text-slate-700">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span>Seller: {product.seller?.name || "Unknown"}</span>
                  <span>Stock: {product.stockQuantity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <h2 className="text-2xl font-semibold text-slate-950 mb-4">Customer Orders</h2>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
            No orders available.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>Buyer: {order.buyer?.name}</p>
                    <p>Email: {order.buyer?.email}</p>
                    {order.items && order.items.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-slate-700">Items:</p>
                        <ul className="mt-1 text-sm text-slate-600">
                          {order.items.map((it: any) => (
                            <li key={it.id}>
                              {(it.product?.name || products.find((p) => p.id === it.productId)?.name || it.productId)} — {it.orderedQuantity} {it.orderedUnit || ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-slate-950">₹{order.totalAmount}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(order.id, "APPROVED")}
                      className="rounded-2xl border border-slate-300 bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, "REJECTED")}
                      className="rounded-2xl border border-slate-300 bg-rose-600 px-4 py-2 text-sm text-white transition hover:bg-rose-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
