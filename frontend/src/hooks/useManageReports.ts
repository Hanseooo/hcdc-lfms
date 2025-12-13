import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import type { PaginatedResponse, Report } from "@/types/apiResponse";
import { API_BASE_URL } from "@/api/apiConfig";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${API_BASE_URL}`;

interface UseReportsOptions {
  type?: "lost" | "found";
  search?: string;
  category?: string;
  ordering?: "date_time" | "-date_time";
  status?: "pending" | "resolved" | "rejected";
}

export function useManageReports({
  type,
  search,
  category,
  ordering,
  status = "pending",
}: UseReportsOptions) {
  const [reports, setReports] = useState<Report[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(
    `${BASE_URL}/reports/reports/`
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchReports = useCallback(
    async (url?: string, reset = false) => {
      if (loading || (!url && !hasMore)) return;
      setLoading(true);

      try {
        const response = await axios.get<PaginatedResponse<Report>>(
          url || nextUrl!,
          {
            params: {
              type,
              search,
              category,
              ordering,
              status,
            },
          }
        );

        setReports((prev) =>
          reset ? response.data.results : [...prev, ...response.data.results]
        );
        setNextUrl(response.data.next);
        setHasMore(Boolean(response.data.next));
      } catch (err) {
        console.error("Error fetching reports:", err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [type, search, category, ordering, status, nextUrl, loading, hasMore]
  );

  // Reset list when filters change
  useEffect(() => {
    setReports([]);
    setNextUrl(`${BASE_URL}/reports/reports/?status=${status}`);
    setHasMore(true);
  }, [type, search, category, ordering, status]);

  return { reports, loading, fetchReports, hasMore, setReports };
}
