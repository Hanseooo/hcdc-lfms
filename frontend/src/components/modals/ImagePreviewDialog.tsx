import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

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
      <DialogContent className="p-0 bg-background dark:bg-neutral-900 rounded-lg max-w-full w-[90vw] max-h-[90vh] flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
