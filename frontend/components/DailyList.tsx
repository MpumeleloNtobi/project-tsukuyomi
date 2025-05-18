import { CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Task = {
  id: string;
  createdAt: string;
  status: "pending" | "shipped" | "collected";
};

interface DailyListProps {
  tasks: Task[];
  onRefresh?: () => void;
  loading?: boolean;
  error?: string;
}

export default function DailyList({
  tasks,
  onRefresh,
  loading,
  error,
}: DailyListProps) {
  return (
    <div className="p-6">
      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Loader2 className="animate-spin" /> Loading tasks...
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!loading && tasks.length === 0 && (
        <p className="text-muted-foreground">No tasks for today.</p>
      )}

      <div className="grid gap-4 mt-4">
        {tasks.map(({ id, createdAt, status }) => (
          <Card key={id} className="flex items-center justify-between p-4">
            <CardContent className="p-0 text-base">
              Order placed at {new Date(createdAt).toLocaleString()}
            </CardContent>

            {status === "shipped" || status === "collected" ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <span className="text-sm text-yellow-600">
                {status.toUpperCase()}
              </span>
            )}
          </Card>
        ))}
      </div>

      {onRefresh && (
        <Button className="mt-6" onClick={onRefresh} disabled={loading}>
          Refresh List
        </Button>
      )}
    </div>
  );
}
