// src/components/sections/PendingReportsSection.tsx
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useManageReports } from "@/hooks/useManageReports";
import ManagePostCard from "../cards/ManagePostCard";

export default function PendingReportsSection() {
  const [filters, setFilters] = useState<{
    type?: "lost" | "found";
    search?: string;
  }>({});

  const { reports, setReports, loading, fetchReports, hasMore } =
    useManageReports(filters);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!bottomRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchReports().catch(() => {});
        }
      },
      { threshold: 1.0 }
    );

    observerRef.current.observe(bottomRef.current);
    return () => observerRef.current?.disconnect();
  }, [bottomRef, hasMore, loading, fetchReports]);

  const handleStatusChange = (id: number) => {
    // ✅ remove from current state immediately
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <section className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Pending Reports</h2>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search..."
            value={filters.search || ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            className="max-w-xs"
          />
          <Tabs
            defaultValue="all"
            onValueChange={(v) =>
              setFilters((f) => ({
                ...f,
                type: v === "all" ? undefined : (v as "lost" | "found"),
              }))
            }
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="lost">Lost</TabsTrigger>
              <TabsTrigger value="found">Found</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <ManagePostCard
            key={report.id}
            report={report}
            onStatusChange={handleStatusChange}
          />
        ))}

        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-[400px] rounded-2xl bg-foreground/25" />
          ))}
      </div>

      <div ref={bottomRef} className="h-10" />
    </section>
  );
}
