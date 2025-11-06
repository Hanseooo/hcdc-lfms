import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import type { Report } from "@/types/apiResponse";
import { toast } from "sonner";

interface ManagePostCardProps {
  report: Report;
  onStatusChange?: (id: number, newStatus: "approved" | "rejected") => void;
}

  const token = localStorage.getItem("token");


export default function ManagePostCard({
  report,
  onStatusChange,
}: ManagePostCardProps) {
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (newStatus: "approved" | "rejected") => {
    try {
      setUpdating(true);
    await axios.patch(
    `http://127.0.0.1:8000/api/reports/reports/${report.id}/`,
    { status: newStatus },
        {
            headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
            },
        }
        );
      toast.success(`Report ${newStatus}`);
      onStatusChange?.(report.id, newStatus);
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const item = report.type === "lost" ? report.lost_item : report.found_item;

  const location =
    report.type === "lost"
      ? report.lost_item?.location_last_seen ?? "Unknown"
      : report.found_item?.location_found ?? "Unknown";

  const date =
    report.type === "lost"
      ? report.lost_item?.date_lost
      : report.found_item?.date_found;

  return (
    <Card className="w-full max-w-xl bg-card shadow-lg hover:shadow-xl transition-all rounded-2xl overflow-hidden flex flex-col">
      {item?.photo_url && (
        <div className="relative w-full aspect-video sm:aspect-4/3">
          <img
            src={item.photo_url}
            alt={item.item_name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold capitalize leading-tight">
            {item?.item_name}
          </h3>
          <Badge
            variant={report.type === "lost" ? "destructive" : "default"}
            className="self-start"
          >
            {report.type}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage
              src={report.reported_by.profile_avatar_url || undefined}
            />
            <AvatarFallback>
              {report.reported_by.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm leading-tight">
            <p className="font-medium truncate">
              {`${report.reported_by.first_name} ${report.reported_by.last_name}`}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[180px]">
              {report.reported_by.email}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-2">
        {item?.description && (
          <p className="text-sm text-muted-foreground wrap-break-word">
            {item.description}
          </p>
        )}
        <p className="text-sm">
          <span className="font-semibold">Location:</span> {location}
        </p>
        {date && (
          <p className="text-sm">
            <span className="font-semibold">
              {report.type === "lost" ? "Date Lost:" : "Date Found:"}
            </span>{" "}
            {new Date(date).toLocaleString()}
          </p>
        )}
        <p className="text-sm mt-1">
          <span className="font-semibold">Status:</span>{" "}
          <Badge variant="secondary">{report.status}</Badge>
        </p>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 p-4 border-t">
        <Button
          variant="outline"
          disabled={updating}
          className="w-full sm:w-auto"
          onClick={() => handleUpdate("rejected")}
        >
          Reject
        </Button>
        <Button
          variant="default"
          disabled={updating}
          className="w-full sm:w-auto"
          onClick={() => handleUpdate("approved")}
        >
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
}
