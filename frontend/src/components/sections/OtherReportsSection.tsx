import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { OtherReportsCard } from "@/components/cards/OtherReportsCard"
import { useManageReports } from "@/hooks/useManageReports";
import { Skeleton } from "@/components/ui/skeleton";

export default function OtherReportsSection() {
  const [status, setStatus] = useState<"resolved" | "rejected">("resolved");
  const [type, setType] = useState<"lost" | "found" | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const { reports, fetchReports, hasMore, loading } = useManageReports({
    type,
    status,
    search: searchTerm,
  });

  // Debounced search
  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 500);

  // Infinite scroll bottom sentinel
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!bottomRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchReports();
        }
      },
      { threshold: 1 }
    );

    observerRef.current.observe(bottomRef.current);
    return () => observerRef.current?.disconnect();
  }, [bottomRef, hasMore, loading, fetchReports]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6 min-h-96">
      <h2 className="text-2xl font-bold">Other Reports</h2>

      <Tabs
        defaultValue="resolved"
        onValueChange={(v) => setStatus(v as "resolved" | "rejected")}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto rounded-xl p-1 bg-muted">
          <TabsTrigger
            value="resolved"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
          >
            Resolved
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
          >
            Rejected
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-row gap-4">
        <Input
          placeholder="Search reports..."
          className="max-w-sm mx-auto"
          onChange={(e) => handleSearch(e.target.value)}
        />

        <Tabs
          defaultValue="all"
          onValueChange={(v) =>
            setType(v === "all" ? undefined : (v as "lost" | "found"))
          }
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full max-w-xs rounded-xl p-1 bg-muted">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-background rounded-lg"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="lost"
              className="data-[state=active]:bg-background rounded-lg"
            >
              Lost
            </TabsTrigger>
            <TabsTrigger
              value="found"
              className="data-[state=active]:bg-background rounded-lg"
            >
              Found
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {reports.map((r) => (
          <OtherReportsCard key={r.id} report={r} />
        ))}

        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full h-[350px] rounded-xl bg-foreground/10"
            />
          ))}
      </div>

      <div ref={bottomRef} className="h-10" />
    </div>
  );
}
