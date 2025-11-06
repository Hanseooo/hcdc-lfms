// hooks/useReports.ts
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import type { PaginatedResponse, Report } from "@/types/apiResponse";
import type { CreateReportPayload } from "@/types/apiPayloads";
import { compressImage } from "@/utils/imageUtils";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

interface UseReportsOptions {
  type?: "lost" | "found";
  search?: string;
  category?: string;
  ordering?: "date_time" | "-date_time";
}

export function useReports({
  type,
  search,
  category,
  ordering,
}: UseReportsOptions) {
  const [reports, setReports] = useState<Report[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(
    `${BASE_URL}/reports/reports/?status=approved`
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 🔹 Fetch reports (already works)
  const fetchReports = useCallback(
    async (url?: string, reset = false) => {
      if (loading || !hasMore) return;

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
              status: "approved",
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
      } finally {
        setLoading(false);
      }
    },
    [type, search, category, ordering, nextUrl, loading, hasMore]
  );

  useEffect(() => {
    setReports([]);
    setNextUrl(`${BASE_URL}/reports/reports/?status=approved`);
    setHasMore(true);
  }, [type, search, category, ordering]);

  async function uploadPost(payload: CreateReportPayload) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const formData = new FormData();

        // 🔹 Compress and append image if provided
        if (payload.photo instanceof File) {
        const compressedPhoto = await compressImage(payload.photo, 480); // 480p max height or width
        formData.append("photo", compressedPhoto);
        }

        // 🔹 Append other fields
        Object.entries(payload).forEach(([key, value]) => {
        if (key !== "photo" && value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
        });

        // 🔹 Send request
        const response = await axios.post(`${BASE_URL}/reports/reports/`, formData, {
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
        },
        });

        return response.data;
    } catch (err: any) {
        console.error("Upload failed:", err.response?.data || err);
        throw err;
    }
    }


  return { reports, loading, fetchReports, uploadPost, hasMore };
}
