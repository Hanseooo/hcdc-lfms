import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface FiltersBarProps {
  onFilterChange: (filters: {
    type?: "lost" | "found";
    status?: "pending" | "approved" | "rejected" | "resolved";
    search?: string;
    category?: string;
    ordering?: "date_time" | "-date_time";
  }) => void;
  currentFilters: {
    type?: "lost" | "found";
    status?: "pending" | "approved" | "rejected" | "resolved";
    search?: string;
    category?: string;
    ordering?: "date_time" | "-date_time";
  };
}


const categories = [
  { label: "All", value: "all" },
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Documents", value: "documents" },
  { label: "Accessories", value: "accessories" },
  { label: "Other", value: "other" },
];

export default function FiltersBar({
  onFilterChange,
  currentFilters,
}: FiltersBarProps) {
  const [searchValue, setSearchValue] = useState(currentFilters.search || "");

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange({ ...currentFilters, search: searchValue || undefined });
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchValue]);


  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <Tabs
        value={currentFilters.type ?? currentFilters.status ?? "lost"}
        onValueChange={(v) => {
          if (v === "resolved") {
            onFilterChange({
              ...currentFilters,
              type: undefined,
              status: "resolved",
            });
          } else {
            onFilterChange({
              ...currentFilters,
              status: undefined,
              type: v as "lost" | "found",
            });
          }
        }}
      >
        <TabsList>
          <TabsTrigger value="lost">Lost Items</TabsTrigger>
          <TabsTrigger value="found">Found Items</TabsTrigger>
          <TabsTrigger value="resolved">Resolved Items</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-3 w-full sm:w-auto sm:justify-end">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-8 w-40 sm:w-56"
          />
        </div>

        <Select
          value={currentFilters.category ?? "all"}
          onValueChange={(v) =>
            onFilterChange({
              ...currentFilters,
              category: v === "all" ? undefined : v,
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.ordering || "-date_time"}
          onValueChange={(v: "date_time" | "-date_time") =>
            onFilterChange({ ...currentFilters, ordering: v })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-date_time">Newest</SelectItem>
            <SelectItem value="date_time">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
