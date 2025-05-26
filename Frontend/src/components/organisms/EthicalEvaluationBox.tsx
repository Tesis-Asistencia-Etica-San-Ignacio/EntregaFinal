import { Button } from "../atoms/ui/button";
import ModalForm from "./dialogs/ModalForm";
import type { FormField } from "@/types/formTypes";

interface EthicalEvaluationBoxProps {
  readonly selectedTask?: {
    cita?: string;
    justification?: string;
  } | null;
  modalFormFields?: FormField[] | FormField[][];
  onModalSubmit?: (data: any) => Promise<void> | void;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export default function EthicalEvaluationBox({
  open,
  onOpenChange,
  selectedTask,
  modalFormFields,
  onModalSubmit,
}: EthicalEvaluationBoxProps) {
  return (
    <div className="flex flex-col h-full">

      <div className="flex flex-col flex-1 min-h-0 gap-y-4">

        <div className="basis-[30%] max-h-[30%] overflow-y-auto border p-4 rounded-md">

          <h2 className="font-semibold mb-2">Cita</h2>
          {selectedTask?.cita ? (
            <p>{selectedTask.cita}</p>
          ) : (
            <p className="text-muted-foreground">
              Selecciona una fila para ver la cita.
            </p>
          )}
        </div>

        <div className="basis-[70%] max-h-[70%] overflow-y-auto border p-4 rounded-md">

          <h2 className="font-semibold mb-2">Justificación</h2>
          {selectedTask?.justification ? (
            <p>{selectedTask.justification}</p>
          ) : (
            <p className="text-muted-foreground">
              Selecciona una fila para ver la justificación.
            </p>
          )}
        </div>
      </div>


      <div className="flex justify-end mt-4">
        <Button onClick={() => onOpenChange(true)}>Enviar resultado</Button>
      </div>

      {modalFormFields && onModalSubmit && (
        <ModalForm
          open={open}
          onOpenChange={onOpenChange}
          title={{ text: "Enviar resultado de la evaluación", align: "left" }}
          formDataConfig={modalFormFields}
          onSubmit={onModalSubmit}
          submitButtonText="Enviar resultado"
          width="70%"
          height="80%"
        />
      )}
    </div>
  );
}
