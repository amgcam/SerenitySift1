import Link from "next/link"
import type { ReactNode } from "react"

export const metadata = {
  title: "Professional Mode Coming Soon | SerenitySift",
  description: "Professional Mode is currently invite-only and in beta.",
}

export default function ProLayout({ children }: { children: ReactNode }) {
  void children

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16">
        <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur md:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">
            🔒
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Professional Mode
          </p>

          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Coming Soon
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-lg leading-8 text-slate-300">
            SerenitySift Professional Mode is currently in private beta and is
            available by invitation only.
          </p>

          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-left text-sm leading-7 text-slate-200">
            <p className="font-semibold text-cyan-200">
              What this means right now:
            </p>
            <p className="mt-2">
              Pro accounts, client dashboards, professional tools, and related
              features are not publicly available yet. These features are being
              tested carefully before release.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-full bg-cyan-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Return to Dashboard
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Go Home
            </Link>
          </div>

          <p className="mt-8 text-xs text-slate-500">
            Individual SerenitySift accounts remain available. Professional Mode
            will open later after additional testing and safeguards.
          </p>
        </section>
      </div>
    </main>
  )
}