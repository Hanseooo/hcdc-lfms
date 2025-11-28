import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Report } from "@/types/apiResponse";

interface OtherReportsCardProps {
  report: Report;
}
export function OtherReportsCard({ report }: OtherReportsCardProps) {
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
    <Card className="w-full bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* IMAGE */}
      <div className="relative w-full aspect-video bg-muted flex items-center justify-center text-muted-foreground text-sm">
        {item?.photo_url ? (
          <img
            src={item.photo_url}
            alt={item.item_name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <span>No image available</span>
        )}
      </div>

      <CardHeader className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold capitalize">
            {item?.item_name}
          </h3>
          <Badge variant={report.type === "lost" ? "destructive" : "default"}>
            {report.type}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={report.reported_by.profile_avatar_url || undefined}
            />
            <AvatarFallback>
              {report.reported_by.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm leading-tight">
            <p className="font-medium">
              {`${report.reported_by.first_name} ${report.reported_by.last_name}`}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
              {report.reported_by.email}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-2 text-sm">
        {item?.description && (
          <p className="text-muted-foreground text-sm wrap-break-word">
            {item.description}
          </p>
        )}

        <p>
          <span className="font-semibold">Location:</span> {location}
        </p>

        {date && (
          <p>
            <span className="font-semibold">
              {report.type === "lost" ? "Date Lost:" : "Date Found:"}
            </span>{" "}
            {new Date(date).toLocaleString()}
          </p>
        )}

        <p>
          <span className="font-semibold">Status:</span>{" "}
          <Badge variant="secondary">{report.status}</Badge>
        </p>
      </CardContent>
    </Card>
  );
}
