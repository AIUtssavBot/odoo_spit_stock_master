import { listMoves } from "@/lib/data/provider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Package, 
  Calendar, 
  MapPin, 
  FileText,
  Download,
  Filter,
  Eye
} from "lucide-react";

type MoveRow = {
  id: string;
  date: string;
  product_id: string;
  product_name?: string;
  qty: number;
  from_location: string;
  to_location: string;
  reference_doc: string;
  status: "DRAFT" | "WAITING" | "READY" | "DONE" | "CANCELED";
};

export const dynamic = "force-dynamic";

export default async function MoveHistoryPage() {
  let moves: MoveRow[] = [];
  try {
    moves = await listMoves();
  } catch (err: any) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Move History</h1>
        <p className="mt-4 text-red-600">Failed to load moves: {err?.message || String(err)}</p>
      </main>
    );
  }

  const getStatusInfo = (status: MoveRow["status"]) => {
    switch (status) {
      case "DRAFT":
        return { variant: "secondary" as const, color: "text-gray-600", icon: "📝" };
      case "WAITING":
        return { variant: "warning" as const, color: "text-yellow-600", icon: "⏳" };
      case "READY":
        return { variant: "default" as const, color: "text-blue-600", icon: "✅" };
      case "DONE":
        return { variant: "secondary" as const, color: "text-green-600", icon: "✓" };
      case "CANCELED":
        return { variant: "destructive" as const, color: "text-red-600", icon: "✕" };
      default:
        return { variant: "secondary" as const, color: "text-gray-600", icon: "?" };
    }
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Move History</h1>
          <p className="mt-2 text-gray-600">All stock movements across locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Movement</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Reference</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {moves.map((m) => {
                  const statusInfo = getStatusInfo(m.status);
                  const isCanceled = m.status === "CANCELED";
                  
                  return (
                    <tr 
                      key={m.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        isCanceled ? "opacity-60" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {new Date(m.date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(m.date).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="w-3 h-3 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {m.product_name || "Unknown Product"}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              {m.product_id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sm">
                            <span className={`font-medium ${isCanceled ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {Number(m.qty)}
                            </span>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          </div>
                          <div className="text-xs text-gray-500 max-w-xs">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{m.from_location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" />
                              <span className="truncate">{m.to_location}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-mono text-gray-600">
                            {m.reference_doc || "-"}
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                            <span>{statusInfo.icon}</span>
                            {m.status}
                          </Badge>
                          {isCanceled && (
                            <span className="text-xs text-red-600 font-medium">Canceled</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {moves.length === 0 && (
                  <tr>
                    <td className="py-12 text-center" colSpan={6}>
                      <div className="flex flex-col items-center">
                        <ArrowRight className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No stock movements yet</p>
                        <p className="text-gray-400 text-sm mt-1">Stock movements will appear here once you start operations</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </main>
  );
}