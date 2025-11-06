import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Search } from "lucide-react";

interface FiltersBarProps {
  onFilterChange: (filters: {
    type?: "lost" | "found";
    search?: string;
    category?: string;
    ordering?: "date_time" | "-date_time";
  }) => void;
  currentFilters: {
    type?: "lost" | "found";
    search?: string;
    category?: string;
    ordering?: "date_time" | "-date_time";
  };
}

const categories = [
  "Electronics",
  "Clothing",
  "Documents",
  "Accessories",
  "Other",
];

export default function FiltersBar({
  onFilterChange,
  currentFilters,
}: FiltersBarProps) {
  const [searchValue, setSearchValue] = useState(currentFilters.search || "");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <Tabs
        defaultValue="lost"
        onValueChange={(value) => {
          if (value === "lost" || value === "found") {
            onFilterChange({ type: value });
          }
        }}
      >
        <TabsList>
          <TabsTrigger value="lost">Lost Items</TabsTrigger>
          <TabsTrigger value="found">Found Items</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search, Category, Sort */}
      <div className="flex flex-wrap gap-3 w-full sm:w-auto sm:justify-end">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              onFilterChange({ ...currentFilters, search: e.target.value });
            }}
            className="pl-8 w-40 sm:w-56"
          />
        </div>

        <Select
          value={currentFilters.category || ""}
          onValueChange={(v) =>
            onFilterChange({ ...currentFilters, category: v })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase()}>
                {cat}
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
