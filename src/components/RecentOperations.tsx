import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OperationRow } from "@/lib/data/provider";
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  ArrowRight, 
  Wrench,
  Eye,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";

interface RecentOperationsProps {
  operations: OperationRow[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "DRAFT": return "bg-gray-100 text-gray-800";
    case "WAITING": return "bg-yellow-100 text-yellow-800";
    case "READY": return "bg-blue-100 text-blue-800";
    case "DONE": return "bg-green-100 text-green-800";
    case "CANCELED": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "INCOMING": return ArrowDownRight;
    case "OUTGOING": return ArrowUpRight;
    case "INTERNAL": return ArrowRight;
    case "ADJUSTMENT": return Wrench;
    default: return ArrowRight;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "INCOMING": return "text-green-600 bg-green-50";
    case "OUTGOING": return "text-blue-600 bg-blue-50";
    case "INTERNAL": return "text-purple-600 bg-purple-50";
    case "ADJUSTMENT": return "text-orange-600 bg-orange-50";
    default: return "text-gray-600 bg-gray-50";
  }
};

export default function RecentOperations({ operations }: RecentOperationsProps) {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Operations</h3>
          <Link href="/operations">
            <Button variant="outline" size="sm">
              View all
            </Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {operations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ArrowRight className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent operations</p>
            </div>
          ) : (
            operations.map((operation) => {
              const Icon = getTypeIcon(operation.type);
              return (
                <div
                  key={operation.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(operation.type)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {operation.reference || `${operation.type} #${operation.id.slice(-8)}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {operation.partner} • {operation.source_location} → {operation.destination_location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(operation.status)}>
                      {operation.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {operations.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Link href="/operations">
              <Button variant="outline" className="w-full">
                View all operations
                <MoreHorizontal className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
