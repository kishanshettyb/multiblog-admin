'use client'

import { Button } from '@/components/ui/button'

export default function AdminHomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br">
      {/* ✅ Hero Section - Full height center */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight mb-6">
            Manage Your <span className="text-blue-600">Blogspot Locations</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Stay in control of your blogs across different regions — update posts, track engagement,
            and manage categories from one powerful dashboard.
          </p>
          <Button
            size="lg"
            className="rounded-full px-8 py-6 text-lg font-medium shadow-md hover:shadow-lg transition"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* ✅ About Section */}
      <section className="bg-white py-20 px-6 text-center border-t border-slate-100">
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
          Why Choose Blogspot Admin?
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-12 text-base md:text-lg">
          Our admin dashboard helps you manage multiple blog locations, automate updates, and
          monitor performance metrics — all in one place.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-slate-800 mb-3 text-lg">🔒 Secure Login</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Protect your account with modern authentication and encrypted access.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-slate-800 mb-3 text-lg">📊 Powerful Insights</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Get detailed analytics on your blogs and audience engagement.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-slate-800 mb-3 text-lg">⚙️ Easy Management</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Update, schedule, and categorize your blog posts seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Blogspot Admin — Built with ❤️ using Next.js + ShadCN UI
      </footer>
    </div>
  )
}
