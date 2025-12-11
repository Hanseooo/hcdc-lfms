"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { CreateReportPayload } from "@/types/apiPayloads";
import { useReports } from "@/hooks/useReports";
import { toast } from "sonner";

// ✅ helper function to compress image to ~480p keeping aspect ratio
async function compressImage(file: File, maxHeight = 480): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return reject("Failed to load image.");
      img.src = e.target.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas not supported.");

      const aspectRatio = img.width / img.height;
      const targetHeight = maxHeight;
      const targetWidth = targetHeight * aspectRatio;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Failed to compress image.");
          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
          });
          resolve(compressedFile);
        },
        "image/jpeg",
        0.8
      );
    };

    img.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export default function CreateReportSection() {
  const [reportType, setReportType] = useState<"lost" | "found" | "">("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [locationLastSeen, setLocationLastSeen] = useState("");
  const [locationFound, setLocationFound] = useState("");
  const [dateLost, setDateLost] = useState<Date | undefined>();
  const [dateFound, setDateFound] = useState<Date | undefined>();
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { uploadPost } = useReports({});

  async function handleSubmit() {
    try {
      if (!reportType) {
        toast.error("Please select a report type.");
        return;
      }
      if (!itemName || !description || !category) {
        toast.error("Please fill in all required fields.");
        return;
      }

      setLoading(true);

      let compressedPhoto = photo;
      if (photo) {
        compressedPhoto = await compressImage(photo, 720);
      }

      const payload: CreateReportPayload = {
        type: reportType,
        item_name: itemName,
        description,
        category,
        location_last_seen:
        reportType === "lost" ? locationLastSeen : undefined,
        location_found: reportType === "found" ? locationFound : undefined,
        photo: compressedPhoto || undefined,
        date_lost: dateLost ? dateLost.toISOString().split("T")[0] : undefined,
        date_found: dateFound
          ? dateFound.toISOString().split("T")[0]
          : undefined,
      };

      await uploadPost({ ...payload, photo: compressedPhoto as any });
      toast.success("Report submitted successfully for review!");

      // reset form
      setReportType("");
      setItemName("");
      setDescription("");
      setCategory("");
      setLocationLastSeen("");
      setLocationFound("");
      setDateLost(undefined);
      setDateFound(undefined);
      setPhoto(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-3xl mx-auto mt-12 p-6 shadow-lg border border-white/10 bg-card/80 backdrop-blur-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center bg-linear-to-r from-[#800000] via-[#b22222] to-[#800000] bg-clip-text text-transparent">
          Create Report
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Type */}
        <div className="md:col-span-2">
          <Label className="font-semibold">Report Type</Label>
          <Select
            onValueChange={(v: "lost" | "found") => setReportType(v)}
            value={reportType}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lost">Lost Item</SelectItem>
              <SelectItem value="found">Found Item</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Item Name */}
        <div className="md:col-span-2">
          <Label className="font-semibold">Item Name</Label>
          <Input
            className="mt-2"
            placeholder="e.g. Wallet, Phone"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="md:col-span-2">
          <Label className="font-semibold">Category</Label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select item category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              {/* <SelectItem value="school_supplies">School Supplies</SelectItem> */}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label className="font-semibold">Description</Label>
          <Textarea
            className="mt-2"
            placeholder="Provide more details..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Conditional Fields */}
        {reportType === "lost" && (
          <>
            <div>
              <Label className="font-semibold">
                Location Last Seen (optional)
              </Label>
              <Input
                className="mt-2"
                value={locationLastSeen}
                onChange={(e) => setLocationLastSeen(e.target.value)}
                placeholder="e.g. Library, Classroom..."
              />
            </div>

            <div>
              <Label className="font-semibold">Date Lost (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2",
                      !dateLost && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateLost ? (
                      format(dateLost, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                  <div className="p-3">
                    <Calendar
                      mode="single"
                      selected={dateLost}
                      onSelect={setDateLost}
                      className="rounded-md border-0 w-[320px]"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}

        {reportType === "found" && (
          <>
            <div>
              <Label className="font-semibold">Location Found (optional)</Label>
              <Input
                className="mt-2"
                value={locationFound}
                onChange={(e) => setLocationFound(e.target.value)}
                placeholder="e.g. Near Library, Canteen..."
              />
            </div>

            <div>
              <Label className="font-semibold">Date Found (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2",
                      !dateFound && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFound ? (
                      format(dateFound, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                  <div className="p-3">
                    <Calendar
                      mode="single"
                      selected={dateFound}
                      onSelect={setDateFound}
                      className="rounded-md border-0 w-[320px]"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}

        {/* Photo Upload */}
        <div className="md:col-span-2">
          <Label className="font-semibold">Upload Photo</Label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="cursor-pointer flex-1"
            />
            {photo && (
              <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-none">
                {photo.name}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-center pt-4">
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-linear-to-r from-[#800000] via-[#b22222] to-[#800000] text-white hover:opacity-90 px-8 py-2 text-lg font-semibold rounded-lg shadow-md"
          >
            <Upload className="mr-2 h-5 w-5" />{" "}
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
