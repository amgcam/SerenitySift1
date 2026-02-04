import { Loader2, Sparkles } from 'lucide-react';

export default function InsightsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-purple via-deep-purple to-black flex items-center justify-center pb-24">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Sparkles className="w-12 h-12 text-soft-cyan animate-pulse" />
          <Loader2 className="w-6 h-6 text-soft-cyan animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-soft-text">Generating AI insights...</p>
      </div>
    </div>
  );
}
