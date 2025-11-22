import { getKPIs, listOperations } from "@/lib/data/provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertTriangle, 
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";
import DashboardFilters from "@/components/DashboardFilters";
import RecentOperations from "@/components/RecentOperations";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const kpi = await getKPIs();
  const recentOps = await listOperations();
  
  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Dashboard</h1>
          <p className="mt-2 text-gray-600">Real-time snapshot of inventory health and operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <DashboardFilters />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <EnhancedKPI 
          title="Total Products in Stock" 
          value={kpi.totalProductsQty} 
          icon={Package}
          trend={12}
          color="blue"
        />
        <EnhancedKPI 
          title="Low Stock Items" 
          value={kpi.lowStockCount} 
          icon={AlertTriangle}
          badge="warning"
          trend={-5}
          color="yellow"
        />
        <EnhancedKPI 
          title="Out of Stock Items" 
          value={kpi.outOfStockCount} 
          icon={XCircle}
          badge="destructive"
          trend={2}
          color="red"
        />
        <EnhancedKPI 
          title="Pending Receipts" 
          value={kpi.pendingReceipts} 
          icon={ArrowDownRight}
          color="green"
        />
        <EnhancedKPI 
          title="Pending Deliveries" 
          value={kpi.pendingDeliveries} 
          icon={ArrowUpRight}
          color="purple"
        />
        <EnhancedKPI 
          title="Internal Transfers" 
          value={kpi.internalTransfersScheduled} 
          icon={RefreshCw}
          color="orange"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentOperations operations={recentOps} />
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Stock Alerts</h3>
            <div className="space-y-3">
              {kpi.lowStockCount > 0 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">
                      {kpi.lowStockCount} items need replenishment
                    </p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              )}
              {kpi.outOfStockCount > 0 && (
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">
                      {kpi.outOfStockCount} items are out of stock
                    </p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              )}
              {kpi.lowStockCount === 0 && kpi.outOfStockCount === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>All stock levels are healthy</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
function EnhancedKPI({ 
  title, 
  value, 
  icon: Icon, 
  badge, 
  trend, 
  color = "blue" 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  badge?: "warning" | "destructive"; 
  trend?: number;
  color?: string;
}) {
  const colorClasses = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500", 
    red: "bg-red-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };

  const bgClasses = {
    blue: "bg-blue-50",
    yellow: "bg-yellow-50",
    red: "bg-red-50", 
    green: "bg-green-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50"
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${bgClasses[color]}`}>
            <Icon className={`w-5 h-5 ${colorClasses[color].replace('bg-', 'text-')}`} />
          </div>
          {typeof badge === "string" && (
            <Badge variant={badge}>{badge === "warning" ? "Attention" : "Alert"}</Badge>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</div>
        <div className="text-sm text-gray-600">{title}</div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend}% from last month
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}