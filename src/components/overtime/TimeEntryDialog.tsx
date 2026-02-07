"use client";

import {createTimeEntry, updateTimeEntry} from "@/app/actions/entry";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {useToast} from "@/hooks/use-toast";
import type {TimeEntryFormData} from "@/lib/validations/timeEntry";
import {calculateTotalHours} from "@/lib/validations/timeEntry";
import {useState} from "react";
import type {OvertimeRecord} from "./OvertimeGrid";
import {TimeEntryForm} from "./TimeEntryForm";

interface TimeEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: OvertimeRecord | null;
  onSuccess?: (action: 'create' | 'update', record: OvertimeRecord) => void;
}

export function TimeEntryDialog({
  open,
  onOpenChange,
  entry,
  onSuccess,
}: TimeEntryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {toast} = useToast();

  const handleSubmit = async (data: TimeEntryFormData) => {
    setIsSubmitting(true);

    try {
      let result;
      if (entry) {
        // Editar
        result = await updateTimeEntry(entry.id, {
          date: data.date,
          activity: data.activity,
          type: data.type,
          startTime: data.startTime,
          endTime: data.endTime,
        });
      } else {
        // Criar
        result = await createTimeEntry({
          date: data.date,
          activity: data.activity,
          type: data.type,
          startTime: data.startTime,
          endTime: data.endTime,
        });
      }

      toast({
        title: "Sucesso!",
        description: entry
          ? "Registro atualizado com sucesso."
          : "Registro criado com sucesso.",
      });

      // Usar o registro retornado pela action
      const recordData: OvertimeRecord = {
        id: result.entry.id,
        date: result.entry.date,
        activity: result.entry.activity,
        type: result.entry.type as "extra" | "compensation",
        startTime: result.entry.startTime,
        endTime: result.entry.endTime,
        totalHours: result.entry.totalHours,
      };

      onOpenChange(false);
      onSuccess?.(entry ? 'update' : 'create', recordData);
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao salvar o registro.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues = entry
    ? {
      date: new Date(entry.date),
      activity: entry.activity,
      type: entry.type,
      startTime: entry.startTime,
      endTime: entry.endTime,
    }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {entry ? "Editar Registro" : "Novo Registro"}
          </DialogTitle>
          <DialogDescription>
            {entry
              ? "Atualize as informações do registro de horas."
              : "Adicione um novo registro de horas extras ou compensação."}
          </DialogDescription>
        </DialogHeader>

        <TimeEntryForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
