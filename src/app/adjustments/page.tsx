import { listProducts } from "@/lib/data/provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MapPin } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdjustmentsPage() {
  const products = await listProducts();

  return (
    <main className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Adjustments</h1>
            <p className="text-gray-600">Adjust stock levels for your products</p>
          </div>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.sku}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">WH/Stock1</span>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600">Current Stock: </span>
                        <span className="font-medium">{product.current_stock}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/products/${product.id}`}>
                          Adjust
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500">Create your first product to start adjusting stock.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}