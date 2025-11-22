"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Calendar, MapPin, Package } from "lucide-react";

const operationTypes = [
  { value: "INCOMING", label: "Receipts", color: "green" },
  { value: "OUTGOING", label: "Deliveries", color: "blue" },
  { value: "INTERNAL", label: "Internal", color: "purple" },
  { value: "ADJUSTMENT", label: "Adjustments", color: "orange" }
];

const statuses = [
  { value: "DRAFT", label: "Draft", color: "gray" },
  { value: "WAITING", label: "Waiting", color: "yellow" },
  { value: "READY", label: "Ready", color: "blue" },
  { value: "DONE", label: "Done", color: "green" },
  { value: "CANCELED", label: "Canceled", color: "red" }
];

const categories = [
  "Electronics", "Furniture", "Raw Materials", "Office Supplies", "Tools"
];

const locations = [
  "Main Warehouse", "Production Floor", "Rack A", "Rack B", "Warehouse 2"
];

export default function DashboardFilters() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const toggleFilter = (value: string, filterType: 'types' | 'statuses' | 'categories' | 'locations') => {
    const setters = {
      types: setSelectedTypes,
      statuses: setSelectedStatuses,
      categories: setSelectedCategories,
      locations: setSelectedLocations
    };
    
    const currentValues = {
      types: selectedTypes,
      statuses: selectedStatuses,
      categories: selectedCategories,
      locations: selectedLocations
    };

    const setter = setters[filterType];
    const current = currentValues[filterType];
    
    if (current.includes(value)) {
      setter(current.filter(v => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setSelectedLocations([]);
    setDateRange({ start: "", end: "" });
  };

  const hasActiveFilters = selectedTypes.length > 0 || 
                          selectedStatuses.length > 0 || 
                          selectedCategories.length > 0 || 
                          selectedLocations.length > 0 ||
                          dateRange.start || dateRange.end;

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Dynamic Filters</h3>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {selectedTypes.length + selectedStatuses.length + selectedCategories.length + selectedLocations.length} active
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="w-3 h-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Document Type Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Document Type</label>
            </div>
            <div className="space-y-1">
              {operationTypes.map(type => (
                <label key={type.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.value)}
                    onChange={() => toggleFilter(type.value, 'types')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Status</label>
            </div>
            <div className="space-y-1">
              {statuses.map(status => (
                <label key={status.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status.value)}
                    onChange={() => toggleFilter(status.value, 'statuses')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Product Category</label>
            </div>
            <div className="space-y-1">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleFilter(category, 'categories')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Warehouse/Location</label>
            </div>
            <div className="space-y-1">
              {locations.map(location => (
                <label key={location} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(location)}
                    onChange={() => toggleFilter(location, 'locations')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{location}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Date Range</label>
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start date"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="End date"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
