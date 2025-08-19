import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSearchHistory } from "@/contexts/SearchHistoryContext";
import { History, MapPin, ArrowRight, X, Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Location } from "@shared/schema";

interface SearchHistoryProps {
  onSelectHistory: (pickup: Location, dropoff: Location) => void;
}

export function SearchHistory({ onSelectHistory }: SearchHistoryProps) {
  const { history, removeFromHistory, clearHistory } = useSearchHistory();
  const [open, setOpen] = useState(false);

  const handleSelectEntry = (pickup: Location, dropoff: Location) => {
    onSelectHistory(pickup, dropoff);
    setOpen(false);
  };

  const handleRemoveEntry = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    removeFromHistory(id);
  };

  const handleClearAll = () => {
    clearHistory();
  };

  if (history.length === 0) {
    return null; // Don't show the button if there's no history
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40"
          data-testid="button-search-history"
        >
          <History className="w-4 h-4" />
          Recent Searches ({history.length})
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Search History
          </DialogTitle>
          <DialogDescription>
            Your recent ride searches. Click any entry to reuse it.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="text-sm">
            {history.length} {history.length === 1 ? 'search' : 'searches'}
          </Badge>
          
          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:border-red-200"
                  data-testid="button-clear-history"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Search History</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your saved searches. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll} className="bg-red-600 hover:bg-red-700">
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {history.map((entry) => (
            <Card
              key={entry.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] border-primary/10 hover:border-primary/30"
              onClick={() => handleSelectEntry(entry.pickup, entry.dropoff)}
              data-testid={`history-entry-${entry.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Route */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate font-medium">
                          {entry.pickup.address}
                        </span>
                      </div>
                      
                      <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate font-medium">
                          {entry.dropoff.address}
                        </span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                    </div>
                  </div>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-1 h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => handleRemoveEntry(entry.id, e)}
                    data-testid={`button-delete-history-${entry.id}`}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            Click on any search to reuse it. History is stored locally on your device.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}