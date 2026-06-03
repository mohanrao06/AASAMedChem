import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-10 shadow-lg shadow-slate-200/70">
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            AASA MedChem
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Chemical marketplace for buyers, sellers, and admins.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Discover products, add inventory, and manage orders from a polished, unified dashboard.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Link href="/login" className="rounded-3xl bg-slate-900 px-5 py-4 text-center text-white transition hover:bg-slate-700">
            <span className="block text-lg font-semibold">Login</span>
            <span className="text-sm text-slate-200">Enter your account</span>
          </Link>
          <Link href="/login?role=SELLER" className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-center transition hover:border-slate-300">
            <span className="block text-lg font-semibold text-slate-950">Seller sign-in</span>
            <span className="text-sm text-slate-500">Sign in as a seller</span>
          </Link>
          <Link href="/login?role=BUYER" className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-center transition hover:border-slate-300">
            <span className="block text-lg font-semibold text-slate-950">Buyer sign-in</span>
            <span className="text-sm text-slate-500">Sign in as a buyer</span>
          </Link>
          <Link href="/login" className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-center transition hover:border-slate-300">
            <span className="block text-lg font-semibold text-slate-950">Admin</span>
            <span className="text-sm text-slate-500">Sign in as admin</span>
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-2xl font-semibold text-slate-950">Why choose AASA MedChem?</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/50">
              <h3 className="font-semibold text-slate-900">Centralized inventory</h3>
              <p className="mt-2 text-slate-600">Keep product details, stock, and pricing managed cleanly in one place.</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/50">
              <h3 className="font-semibold text-slate-900">Role-based access</h3>
              <p className="mt-2 text-slate-600">Separate experiences for buyers, sellers, and admins.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
