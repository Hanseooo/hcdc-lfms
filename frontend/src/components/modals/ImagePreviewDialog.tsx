import { Dialog, DialogContent } from "@/components/ui/dialog";

export function ImagePreviewDialog({
  open,
  onClose,
  src,
  alt,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
