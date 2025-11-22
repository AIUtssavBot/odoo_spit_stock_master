"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { ProductRow } from "@/lib/data/provider";
import { StockAdjustmentForm } from "@/components/StockAdjustmentForm";

interface StockAdjustmentModalProps {
  product: ProductRow;
  location: string;
  children?: React.ReactNode;
}

export function StockAdjustmentModal({ product, location, children }: StockAdjustmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAdjustmentComplete = () => {
    setIsOpen(false);
    // Optionally refresh the parent page or show a notification
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Adjust Stock
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Stock Adjustment</DialogTitle>
        </DialogHeader>
        <StockAdjustmentForm 
          product={product} 
          location={location} 
          onAdjustmentComplete={handleAdjustmentComplete} 
        />
      </DialogContent>
    </Dialog>
  );
}