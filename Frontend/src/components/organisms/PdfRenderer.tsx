import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "simplebar-react/dist/simplebar.min.css";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
  Download,
} from "lucide-react";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "../atoms/ui/button";
import { Input } from "../atoms/ui/input";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../atoms/ui/dropdown-menu";
import SimpleBar from "simplebar-react";
import PdfFullscreen from "../molecules/PdfFullscreen";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url: string;
  externalLoading?: boolean;
}

const PdfRenderer = ({ url, externalLoading = false, }: PdfRendererProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  // Para manejar re-renders al cambiar scale (zoom)
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isInternalLoading = renderedScale !== scale;
  const isLoading = externalLoading || isInternalLoading;
  // True mientras la página con la nueva escala no haya terminado de renderizar.

  // Validación de página a saltar
  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= (numPages ?? 0)),
  });
  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: { page: "1" },
    resolver: zodResolver(CustomPageValidator),
  });

  // Mide el ancho del contenedor, aplicamos throttle para no recalcularlo en exceso.
  const { width, ref } = useResizeDetector({
    refreshMode: "throttle",
    refreshRate: 100,
  });

  /** Manejo del input para saltar a una página */
  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    const num = Number(page);
    setCurrPage(num);
    setValue("page", page);
  };

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error descargando el PDF");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "reporte-normas.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Error descargando PDF:", err);
    }
  }, [url]);

  /** Ajusta la página anterior */
  const prevPage = () => {
    const newPage = Math.max(currPage - 1, 1);
    setCurrPage(newPage);
    setValue("page", String(newPage));
  };

  /** Ajusta la página siguiente */
  const nextPage = () => {
    if (!numPages) return;
    const newPage = Math.min(currPage + 1, numPages);
    setCurrPage(newPage);
    setValue("page", String(newPage));
  };

  return (
    <div className="w-full flex flex-col items-center border border-border rounded-md">
      <div className="h-14 w-full border-b border-border flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          {/* Anterior */}
          <Button
            disabled={currPage <= 1}
            onClick={prevPage}
            variant="ghost"
            aria-label="previous page"
            type="button"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          {/* Input para saltar a página */}
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-accent-foreground text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>

          {/* Siguiente */}
          <Button
            disabled={!numPages || currPage === numPages}
            onClick={nextPage}
            variant="ghost"
            aria-label="next page"
            type="button"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>

        {/* Zoom y Rotación */}
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="gap-1.5"
                aria-label="zoom"
                variant="ghost"
                type="button"
              >
                <Search className="h-4 w-4" />
                {Math.round(scale * 100)}%
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(0.5)}>
                50%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(0.75)}>
                75%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            variant="ghost"
            aria-label="rotate 90 degrees"
            type="button"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleDownload} variant="ghost" type="button">
            <Download className="h-4 w-4" />
          </Button>

          {/* Fullscreen */}
          <PdfFullscreen fileUrl={url} />
        </div>
      </div>

      {/* Contenedor principal del PDF */}
      <div className="flex-1 w-full max-h-screen">
        {/* SimpleBar con max-h si es necesario */}
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          {/* Contenedor medido por useResizeDetector */}
          <div ref={ref} className="">
            <Document
              file={url}
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              noData={(
                <div className="flex justify-center h-64">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              )}

              onLoadError={(err) => console.error("Error loading PDF:", err)}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                // Si es la primera vez, marca la escala actual como renderizada:
                if (renderedScale === null) {
                  setRenderedScale(scale);
                }
              }}
              className="max-h-full"
            >
              {/* Página con la escala previa, oculta si no hay un “viejo scale” */}
              {isLoading && renderedScale !== null && (
                <Page
                  pageNumber={currPage}
                  rotate={rotation}
                  width={width ? width * renderedScale : 600 * renderedScale}
                  key={`old-scale-${renderedScale}`}
                />
              )}

              {/* Página principal con la nueva escala (se oculta mientras esté “cargando”) */}
              <Page
                className={cn(isLoading ? "hidden" : "")}
                pageNumber={currPage}
                rotate={rotation}
                width={width ? width * scale : 600 * scale}
                key={`page-scale-${scale}`}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => {
                  // Una vez renderizada la nueva escala, actualizamos renderedScale:
                  setRenderedScale(scale);
                }}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
