"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/api/axiosInstance";
import { toast } from "sonner";
import type {
  ReportResolutionLog,
  ReportResolutionLogResponse,
} from "@/types/apiResponse";
import {
  Loader2,
  CalendarDays,
  Package,
  UserCheck,
  UserRound,
  Tag,
} from "lucide-react";

interface LogsModalProps {
  open: boolean;
  onClose: () => void;
}

export function LogsModal({ open, onClose }: LogsModalProps) {
  const [resolutionLogs, setResolutionLogs] = useState<ReportResolutionLog[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(
    "/reports/resolution-logs/"
  );
  const [hasMore, setHasMore] = useState(true);

  const fetchResolutionLogs = useCallback(async () => {
    if (!nextPage || loading) return;

    try {
      setLoading(true);

      // Handle absolute URLs (DRF behavior)
      const url = nextPage.startsWith("http")
        ? nextPage.replace("http://127.0.0.1:8000/api", "")
        : nextPage;

      const res = await api.get<ReportResolutionLogResponse>(url);
      const data = res.data;

      setResolutionLogs((prev) => [...prev, ...data.results]);
      setNextPage(data.next);
      setHasMore(!!data.next);
    } catch {
      toast.error("Failed to fetch resolution logs");
    } finally {
      setLoading(false);
    }
  }, [nextPage, loading]);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setResolutionLogs([]);
      setNextPage("/reports/resolution-logs/");
      setHasMore(true);
    }
  }, [open]);

  // Fetch first page
  useEffect(() => {
    if (open && resolutionLogs.length === 0) fetchResolutionLogs();
  }, [open, fetchResolutionLogs, resolutionLogs.length]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col dark:bg-neutral-950 bg-background">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Resolution Logs
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-2">
          {resolutionLogs.length === 0 && loading ? (
            <div className="flex-1 flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : resolutionLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No resolution logs found.
            </p>
          ) : (
            <ul className="space-y-3">
              {resolutionLogs.map((log) => {
                const typeColor =
                  log.report.type === "lost"
                    ? "bg-red-600/10 text-red-600 border-red-600/20"
                    : "bg-green-600/10 text-green-600 border-green-600/20";

                const item =
                  log.report.type === "lost"
                    ? log.report.lost_item
                    : log.report.found_item;

                return (
                  <Card
                    key={log.id}
                    className="border bg-foreground/5 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          {item?.item_name || log.report_title}
                        </CardTitle>
                        <Badge variant="outline" className={typeColor}>
                          {log.report.type.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          <span>{item?.category || "N/A"}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {new Date(log.date_resolved).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <Separator className="my-2" />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1">
                        <p>
                          <UserCheck className="inline h-4 w-4 mr-1" />
                          <span className="font-medium text-foreground">
                            Resolved by:
                          </span>{" "}
                          {log.resolved_by?.full_name}
                        </p>

                        {log.claimed_by && (
                          <p>
                            <UserRound className="inline h-4 w-4 mr-1" />
                            <span className="font-medium text-foreground">
                              Claimed by:
                            </span>{" "}
                            {log.claimed_by?.full_name}
                          </p>
                        )}

                        <p>
                          <UserRound className="inline h-4 w-4 mr-1" />
                          <span className="font-medium text-foreground">
                            Received by:
                          </span>{" "}
                          {log.receiver_name}
                        </p>

                        <p>
                          <UserRound className="inline h-4 w-4 mr-1" />
                          <span className="font-medium text-foreground">
                            Given by:
                          </span>{" "}
                          {log.giver_name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </ul>
          )}

          {/* Load More */}
          {hasMore && !loading && resolutionLogs.length > 0 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={fetchResolutionLogs}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors flex items-center gap-2"
              >
                Load More
              </button>
            </div>
          )}

          {loading && resolutionLogs.length > 0 && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
