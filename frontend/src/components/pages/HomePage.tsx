"use client";

import { useEffect, useState } from "react";
import CreateReportSection from "../sections/CreateReportSection";
import UserProfileSection from "../sections/UserProfileSection";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bell, ClipboardClock, ClipboardList, FileUser, } from "lucide-react";
import { NotificationModal } from "@/components/modals/NotificationModal";
import { LogsModal } from "@/components/modals/LogsModal";
import { api } from "@/api/axiosInstance";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ActivityLogsModal } from "../modals/ActivityLogsModal";
import { ModifyUserModal } from "../modals/ModifyUserModal";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function HomePage() {
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openLogs, setOpenLogs] = useState(false);
  const [openActivityLog, setOpenActivityLog] = useState(false);
  const [openModifyUser, setOpenModifyUser] = useState(false);
  const [isNotifOpened, setIsNotifOpened] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get(`/reports/notifications/unread-count/`);
        setUnreadCount(res.data.unread_count || 0);
      } catch {
        toast.error("Failed to fetch unread notifications");
      }
    };

    fetchUnreadCount();
  }, []);

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8 lg:px-16 transition-colors duration-500 min-w-[300px]">
      <header className="flex flex-col items-center mb-10 space-y-2">
        <TooltipProvider delayDuration={200}>
          <div className="w-full flex justify-end gap-2">
            {/* Admin: Modify User */}
            {user?.user_type === "admin" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpenModifyUser(true)}
                    className="relative"
                  >
                    <FileUser className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Modify User</TooltipContent>
              </Tooltip>
            )}

            {/* Activity Logs */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpenActivityLog(true)}
                  className="relative"
                >
                  <ClipboardClock className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Activity Logs</TooltipContent>
            </Tooltip>

            {/* Resolution Logs */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpenLogs(true)}
                  className="relative"
                >
                  <ClipboardList className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Resolution Logs</TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setOpenNotifications(true);
                    setIsNotifOpened(true);
                  }}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && !isNotifOpened && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Notifications</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <div className="text-center mt-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-[#800000] via-[#b22222] to-[#800000] bg-clip-text text-transparent">
            Lost & Found Management System
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed">
            Submit or browse reports of lost and found items. Help reunite
            people with their belongings one item at a time.
          </p>
        </div>
      </header>

      <Separator className="my-8 max-w-5xl mx-auto opacity-60" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 items-center">
        <aside className="flex justify-center lg:justify-start">
          <UserProfileSection />
        </aside>

        <main className="space-y-8">
          <CreateReportSection />
        </main>
      </div>

      <footer className="text-center text-sm px-4 py-6 text-muted-foreground mt-12 opacity-75">
        © {new Date().getFullYear()} HCDC Lost & Found Management System. Built
        with ❤️ to help people reconnect with their belongings in the campus.
      </footer>

      <NotificationModal
        open={openNotifications}
        onClose={() => setOpenNotifications(false)}
      />
      <LogsModal open={openLogs} onClose={() => setOpenLogs(false)} />
      <ActivityLogsModal
        open={openActivityLog}
        onClose={() => setOpenActivityLog(false)}
      />
      <ModifyUserModal
        open={openModifyUser}
        onClose={() => setOpenModifyUser(false)}
      />
    </div>
  );
}
