import Link from "next/link";

export default function TestOrderPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-lg shadow-slate-200/70">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-950">Quick Access</h1>
        <p className="text-slate-600">
          Use the dashboard links to test seller, buyer, and admin experiences.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/seller" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:border-slate-300">
          <h2 className="text-xl font-semibold text-slate-950">Seller Dashboard</h2>
          <p className="mt-2 text-sm text-slate-600">Add new products and manage inventory.</p>
        </Link>
        <Link href="/buyer" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:border-slate-300">
          <h2 className="text-xl font-semibold text-slate-950">Buyer Dashboard</h2>
          <p className="mt-2 text-sm text-slate-600">Browse products and place orders.</p>
        </Link>
        <Link href="/admin" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:border-slate-300">
          <h2 className="text-xl font-semibold text-slate-950">Admin Dashboard</h2>
          <p className="mt-2 text-sm text-slate-600">Review orders and product listings.</p>
        </Link>
      </div>
    </main>
  );
}
