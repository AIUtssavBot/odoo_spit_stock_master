import { listProducts, ProductRow } from "@/lib/data/provider";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Package, 
  AlertTriangle, 
  Edit, 
  Eye,
  Filter,
  Download,
  MoreHorizontal
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const q = typeof searchParams?.q === "string" ? searchParams?.q : "";
  const products = await listProducts(q);

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">Create and manage your product catalog</p>
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
          <Link href="/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Product
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <form className="w-full" action="/products" method="get">
                <Input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Search by name or SKU..."
                  className="pl-10 w-full"
                />
              </form>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>{products.length} products</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Stock Level</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Cost</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const stockStatus = p.current_stock === 0 ? "out" : p.current_stock <= p.min_stock_level ? "low" : "normal";
                  const stockStatusColor = stockStatus === "out" ? "destructive" : stockStatus === "low" ? "warning" : "secondary";
                  const stockStatusText = stockStatus === "out" ? "Out of Stock" : stockStatus === "low" ? "Low Stock" : "In Stock";
                  
                  return (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{p.name}</div>
                            <div className="text-sm text-gray-500 font-mono">{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">
                          {p.category || "-"}
                        </span>
                        {p.uom && (
                          <span className="text-xs text-gray-400 ml-1">({p.uom})</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{p.current_stock}</span>
                          <span className="text-sm text-gray-500">/ {p.min_stock_level}</span>
                        </div>
                        {stockStatus !== "normal" && (
                          <div className="mt-1">
                            <Badge variant={stockStatusColor} className="text-xs">
                              {stockStatusText}
                            </Badge>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-900">${p.cost.toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={stockStatus === "normal" ? "secondary" : stockStatusColor}>
                          {stockStatusText}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td className="py-12 text-center" colSpan={6}>
                      <div className="flex flex-col items-center">
                        <Package className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No products yet</p>
                        <p className="text-gray-400 text-sm mt-1">Create your first product to get started</p>
                        <Link href="/products/new" className="mt-4">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Product
                          </Button>
                        </Link>
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