import { useState, useMemo } from "react";
import type { ColumnConfig } from "@/types/table";
import useGetCasesByUserHook from "@/hooks/cases/useGetCasesByUser";
import useDeleteCases from "@/hooks/cases/useDeleteCases";
import ModalForm from "@/components/organisms/dialogs/ModalForm";
import PdfRenderer from "@/components/organisms/PdfRenderer";
import HistoryTemplate from "../templates/HistoryTemplate";
import useFetchCasePdf from "@/hooks/pdf/useFetchCasesPdf";

export default function CaseHistoryScreen() {
  // ──────────────────────── hooks y estados ────────────────────────────────
  const { files } = useGetCasesByUserHook();

  const { deleteCase } = useDeleteCases();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [toDeleteId, setToDeleteId] = useState<string>("");
  //pdf
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const { pdfUrl, fetchCasePdf, loading: pdfLoading } = useFetchCasePdf();
  // ───────────────────────────── efectos ───────────────────────────────────
  const tableData = useMemo(
    () =>
      files.map((f: any) => ({
        id: f.id,
        nombre_proyecto: f.nombre_proyecto,
        version: f.version,
        pdf: f.pdf,
        codigo: f.codigo,
        createdAt: new Date(f.createdAt).toISOString().split("T")[0],
        updatedAt: new Date(f.updatedAt).toISOString().split("T")[0],
      })),
    [files]
  );
  // ───────────────────── handlers de la tabla ──────────────────────────────

  const handleViewPdf = async (row: any) => {
    const parts = (row.pdf as string).split("/");
    const filename = parts[parts.length - 1];
    await fetchCasePdf(filename);
    setPdfModalOpen(true);
  }


  const handleDelete = (row: any) => {
    setToDeleteId(row.id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteCase(toDeleteId);
    setDeleteDialogOpen(false);
    setConfirmValue("");
  };
  // — Columnas de la tabla —
  const columnsConfig: ColumnConfig[] = [
    { id: "id", accessorKey: "id", headerLabel: "ID", searchable: false, hidden: true },
    { id: "pdf", accessorKey: "pdf", headerLabel: "pdf", searchable: false, hidden: true },
    { id: "nombre_proyecto", accessorKey: "nombre_proyecto", headerLabel: "Nombre Proyecto", searchable: true },
    { id: "version", accessorKey: "version", headerLabel: "Versión", searchable: true },
    { id: "codigo", accessorKey: "codigo", headerLabel: "Código", searchable: true },
    { id: "createdAt", accessorKey: "createdAt", headerLabel: "Creado" },
    { id: "updatedAt", accessorKey: "updatedAt", headerLabel: "Actualizado" },
    {
      id: "actions",
      type: "actions",
      actionItems: [
        // { label: "Editar", onClick: handleEdit },
        { label: "Eliminar", onClick: handleDelete },
        { label: "Ver PDF", onClick: handleViewPdf },
      ],
    },
  ];

  // ─────────────────────────── render ─────────────────────────────────────
  return (
    <HistoryTemplate
      /* ---------- Tabla ---------- */
      data={tableData}
      columnsConfig={columnsConfig}

      /* -------- Eliminación ------ */
      deleteDialogOpen={deleteDialogOpen}
      onDeleteDialogChange={setDeleteDialogOpen}
      onConfirmDelete={handleConfirmDelete}
      confirmValue={confirmValue}
      onConfirmValueChange={setConfirmValue}

      /*-----PDF-----*/
      extraModal={
        <ModalForm
          open={pdfModalOpen}
          onOpenChange={open => {
            setPdfModalOpen(open);
            if (!open) URL.revokeObjectURL(pdfUrl);  // libera memoria
          }}
          title={{ text: "Ver Consentimiento Informado", align: "left" }}
          formDataConfig={[[
            {
              type: "custom",
              key: "pdfPreview",
              placeholder: "Vista previa",
              component: <PdfRenderer url={pdfUrl} externalLoading={pdfLoading} />,
              required: false,
            }
          ]]}
          onSubmit={() => setPdfModalOpen(false)}
          submitButtonText="Cerrar"
          width="70%"
          height="90%"
        />
      }
    />
  );
}
