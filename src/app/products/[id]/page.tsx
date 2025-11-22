import { getProductById, getProductStockByLocation } from "@/lib/data/provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  AlertTriangle,
  Edit,
  Eye,
  TrendingUp,
  TrendingDown,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StockAdjustmentModal } from "@/components/StockAdjustmentModal";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  
  if (!product) {
    notFound();
  }

  const stockByLocation = await getProductStockByLocation(params.id);
  const totalStock = stockByLocation.reduce((sum, loc) => sum + loc.quantity, 0);
  const stockStatus = totalStock === 0 ? "out" : totalStock <= product.min_stock_level ? "low" : "normal";
  const stockStatusColor = stockStatus === "out" ? "destructive" : stockStatus === "low" ? "warning" : "secondary";
  const stockStatusText = stockStatus === "out" ? "Out of Stock" : stockStatus === "low" ? "Low Stock" : "In Stock";

  return (
    <main className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600">Product details and stock information</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Information */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Product Information</h2>
                  <Button variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">SKU / Code</label>
                    <div className="text-sm font-mono text-gray-900">{product.sku}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <div className="text-sm text-gray-900">{product.category || "Uncategorized"}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Unit of Measure</label>
                    <div className="text-sm text-gray-900">{product.uom || "N/A"}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cost per Unit</label>
                    <div className="text-sm text-gray-900">${product.cost.toFixed(2)}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Minimum Stock Level</label>
                    <div className="text-sm text-gray-900">{product.min_stock_level}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Status</label>
                    <div className="mt-1">
                      <Badge variant={stockStatusColor}>
                        {stockStatusText}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stock Overview */}
            <Card className="mt-6">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-gray-500" />
                  <h2 className="text-lg font-semibold">Stock Overview</h2>
                </div>
                
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-gray-900">{totalStock}</div>
                  <div className="text-sm text-gray-600">Total Units</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Minimum Level</span>
                    <span className="font-medium">{product.min_stock_level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Buffer Stock</span>
                    <span className={`font-medium ${totalStock > product.min_stock_level ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.max(0, totalStock - product.min_stock_level)}
                    </span>
                  </div>
                </div>
                
                {stockStatus !== "normal" && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        {stockStatus === "out" ? "Out of stock - reorder immediately" : "Low stock - consider reordering"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Stock by Location */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <h2 className="text-lg font-semibold">Stock by Location</h2>
                  </div>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stockByLocation.map((location) => {
                    const percentage = totalStock > 0 ? (location.quantity / totalStock) * 100 : 0;
                    const isLow = location.quantity <= product.min_stock_level / stockByLocation.length;
                    
                    return (
                      <div key={location.location} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`} />
                            <div>
                              <div className="font-medium text-gray-900">{location.location}</div>
                              <div className="text-xs text-gray-500">Location</div>
                            </div>
                          </div>
                          {isLow && (
                            <Badge variant="warning" className="text-xs">
                              Low
                            </Badge>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-2xl font-bold text-gray-900">{location.quantity}</div>
                          <div className="text-sm text-gray-600">units</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Percentage</span>
                            <span className="font-medium">{percentage.toFixed(1)}%</span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" className="flex-1">
                            Transfer
                          </Button>
                          <StockAdjustmentModal product={product} location={location.location}>
                            <Button variant="outline" className="flex-1">
                              Adjust
                            </Button>
                          </StockAdjustmentModal>
                        </div>
                      </div>
                    );
                  })}
                  
                  {stockByLocation.length === 0 && (
                    <div className="col-span-2 text-center py-8">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No stock locations found</p>
                      <p className="text-gray-400 text-sm mt-1">This product hasn't been stocked in any location yet</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Recent Stock Movements */}
            <Card className="mt-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-500" />
                    <h2 className="text-lg font-semibold">Recent Stock Movements</h2>
                  </div>
                  <Link href={`/moves?product=${params.id}`}>
                    <Button variant="outline">
                      View All
                    </Button>
                  </Link>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium">No recent movements</p>
                  <p className="text-sm text-gray-400 mt-1">Stock movements will appear here</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
