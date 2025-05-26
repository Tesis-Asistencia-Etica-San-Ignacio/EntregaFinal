import { Expand } from "lucide-react";
import { Button } from "../atoms/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../atoms/ui/dialog";
import { useState } from "react";
import SimpleBar from "simplebar-react";
import { Loader2 } from "lucide-react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

interface PdfFullscreenProps {
  fileUrl: string;
}

const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);

  // Detecta el ancho dentro del diálogo
  const { width, ref } = useResizeDetector({
    refreshMode: "throttle",
    refreshRate: 100,
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(false);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant="ghost" aria-label="fullscreen" type="button">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl w-full">
        {/* SimpleBar para scroll vertical si el PDF es extenso */}
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
          <div ref={ref} className="overflow-x-auto">
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              file={fileUrl}
              onLoadError={(err) => console.error("Error loading PDF:", err)}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className="max-h-full"
            >
              {Array.from({ length: numPages }, (_, i) => i + 1).map((pageIndex) => (
                <Page
                  key={pageIndex}
                  pageNumber={pageIndex}
                  // Ajustamos cada página al ancho detectado
                  width={width || 700} // fallback 700px si no se detecta ancho
                  loading={
                    <div className="flex justify-center">
                      <Loader2 className="my-24 h-6 w-6 animate-spin" />
                    </div>
                  }
                  className="mb-8" // pequeña separación entre páginas
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscreen;
