"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Package, 
  AlertCircle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    uom: "",
    min_stock_level: 0,
    initial_stock: 0,
    cost: 0,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          category: form.category || null,
          uom: form.uom || null,
          min_stock_level: Number(form.min_stock_level) || 0,
          initial_stock: Number(form.initial_stock) || 0,
          cost: Number(form.cost) || 0,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || "Failed to create product");
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/products");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  function onChange<K extends keyof typeof form>(key: K, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  if (success) {
    return (
      <main className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Created Successfully</h2>
              <p className="text-gray-600 mb-6">
                Product "{form.name}" has been added to your inventory.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/products">
                  <Button variant="outline">
                    Back to Products
                  </Button>
                </Link>
                <Link href="/products/new">
                  <Button>
                    Create Another Product
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
              <p className="text-gray-600">Add a new product to your inventory</p>
            </div>
          </div>
        </div>

        <Card>
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    placeholder="Enter product name"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                    SKU / Code *
                  </label>
                  <Input
                    id="sku"
                    value={form.sku}
                    onChange={(e) => onChange("sku", e.target.value)}
                    placeholder="e.g., PROD-001"
                    required
                    className="font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={(e) => onChange("category", e.target.value)}
                    placeholder="e.g., Electronics"
                  />
                </div>

                <div>
                  <label htmlFor="uom" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit of Measure
                  </label>
                  <Input
                    id="uom"
                    value={form.uom}
                    onChange={(e) => onChange("uom", e.target.value)}
                    placeholder="e.g., pcs, kg, boxes"
                  />
                </div>

                <div>
                  <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                    Cost per Unit *
                  </label>
                  <Input
                    id="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.cost}
                    onChange={(e) => onChange("cost", e.target.valueAsNumber ?? Number(e.target.value))}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="min_stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Stock Level
                  </label>
                  <Input
                    id="min_stock"
                    type="number"
                    min="0"
                    value={form.min_stock_level}
                    onChange={(e) => onChange("min_stock_level", e.target.valueAsNumber ?? Number(e.target.value))}
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this level</p>
                </div>

                <div>
                  <label htmlFor="initial_stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Stock (optional)
                  </label>
                  <Input
                    id="initial_stock"
                    type="number"
                    min="0"
                    value={form.initial_stock}
                    onChange={(e) => onChange("initial_stock", e.target.valueAsNumber ?? Number(e.target.value))}
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Starting quantity for this product</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Link href="/products">
                  <Button variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </main>
  );
}