"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { api } from "@/api/axiosInstance";
import { toast } from "sonner";
import type { ActivityLog, ReportResolutionLog } from "@/types/apiResponse";
import { Loader2 } from "lucide-react";

interface LogsModalProps {
  open: boolean;
  onClose: () => void;
}

export function LogsModal({ open, onClose }: LogsModalProps) {
  const [loading, setLoading] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [resolutionLogs, setResolutionLogs] = useState<ReportResolutionLog[]>(
    []
  );

  useEffect(() => {
    if (open) fetchLogs();
  }, [open]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const [activityRes, resolutionRes] = await Promise.all([
        api.get(`/reports/activity-logs/`),
        api.get(`/reports/resolution-logs/`),
      ]);
      setActivityLogs(activityRes.data.results || []);
      setResolutionLogs(resolutionRes.data.results || []);
    } catch {
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col dark:bg-neutral-950 bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            System Logs
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="activity" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="activity">Activity Logs</TabsTrigger>
              <TabsTrigger value="resolution">Resolution Logs</TabsTrigger>
            </TabsList>

            {/* Activity Logs */}
            <TabsContent value="activity" className="flex-1">
              <ScrollArea className="h-[60vh] pr-2">
                {activityLogs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No activity logs found.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {activityLogs.map((log) => (
                      <li
                        key={log.id}
                        className="p-4 rounded-lg border bg-muted/30 dark:bg-neutral-900"
                      >
                        <div className="flex justify-between">
                          <p className="font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {log.user_full_name} – {log.item_name || "N/A"}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Resolution Logs */}
            <TabsContent value="resolution" className="flex-1">
              <ScrollArea className="h-[60vh] pr-2">
                {resolutionLogs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No resolution logs found.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {resolutionLogs.map((log) => (
                      <li
                        key={log.id}
                        className="p-4 rounded-lg border bg-muted/30 dark:bg-neutral-900"
                      >
                        <div className="flex justify-between">
                          <p className="font-medium">{log.report_title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.date_resolved).toLocaleString()}
                          </p>
                        </div>
                        <Separator className="my-2" />
                        <p className="text-sm text-muted-foreground">
                          Resolved by: {log.resolved_by.full_name}
                        </p>
                        {log.claimed_by && (
                          <p className="text-sm text-muted-foreground">
                            Claimed by: {log.claimed_by.full_name}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Receiver: {log.receiver_name} | Giver:{" "}
                          {log.giver_name}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
