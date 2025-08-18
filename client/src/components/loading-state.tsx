import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <section className="mt-4 px-4">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="animate-spin h-6 w-6 text-secondary" />
          <span className="text-gray-600" data-testid="text-loading">
            Comparing prices...
          </span>
        </div>
      </div>
    </section>
  );
}
