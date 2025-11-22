"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Package, 
  MapPin, 
  FileText, 
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { ProductRow } from "@/lib/data/provider";

interface StockAdjustmentFormProps {
  product: ProductRow;
  location: string;
  onAdjustmentComplete?: () => void;
}

export function StockAdjustmentForm({ product, location, onAdjustmentComplete }: StockAdjustmentFormProps) {
  const [countedQty, setCountedQty] = useState<number>(product.current_stock);
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const difference = countedQty - product.current_stock;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/adjustments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          location,
          countedQty,
          reason,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Stock successfully adjusted by ${difference > 0 ? "+" : ""}${difference} units.`,
        });
        if (onAdjustmentComplete) {
          onAdjustmentComplete();
        }
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to adjust stock.",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Package className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Stock Adjustment</h2>
          <p className="text-gray-600">Adjust stock for {product.name}</p>
        </div>
      </div>

      {result && (
        <div className={`mb-6 p-4 rounded-lg border ${
          result.success 
            ? "bg-green-50 border-green-200" 
            : "bg-red-50 border-red-200"
        }`}>
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              result.success ? "text-green-800" : "text-red-800"
            }`}>
              {result.message}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">{product.sku}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{location}</div>
                <div className="text-sm text-gray-500">Adjustment location</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Stock
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{product.current_stock}</div>
              <div className="text-sm text-gray-500">units</div>
            </div>
          </div>

          <div>
            <label htmlFor="countedQty" className="block text-sm font-medium text-gray-700 mb-2">
              Counted Quantity
            </label>
            <Input
              id="countedQty"
              type="number"
              min="0"
              value={countedQty}
              onChange={(e) => setCountedQty(Number(e.target.value))}
              className="text-2xl h-14"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difference
            </label>
            <div className={`p-3 rounded-lg ${
              difference > 0 
                ? "bg-green-50 border border-green-200" 
                : difference < 0 
                  ? "bg-red-50 border border-red-200" 
                  : "bg-gray-50"
            }`}>
              <div className={`text-2xl font-bold ${
                difference > 0 
                  ? "text-green-700" 
                  : difference < 0 
                    ? "text-red-700" 
                    : "text-gray-700"
              }`}>
                {difference > 0 ? "+" : ""}{difference}
              </div>
              <div className="text-sm text-gray-500">units</div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Adjustment (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="reason"
              type="text"
              placeholder="e.g., Damaged goods, Theft, Count correction..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCountedQty(product.current_stock);
              setReason("");
              setResult(null);
            }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || difference === 0}
            className={difference === 0 ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isSubmitting ? "Adjusting..." : "Adjust Stock"}
          </Button>
        </div>
      </form>
    </Card>
  );
}