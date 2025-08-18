import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <section className="mt-4 px-4">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <div>
            <h4 className="font-semibold text-red-800" data-testid="text-error-title">
              Unable to fetch ride prices
            </h4>
            <p className="text-sm text-red-600" data-testid="text-error-description">
              {error?.message || "Please check your connection and try again."}
            </p>
          </div>
        </div>
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 border-red-300"
          data-testid="button-retry"
        >
          Try Again
        </Button>
      </div>
    </section>
  );
}
