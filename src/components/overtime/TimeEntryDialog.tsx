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
import {useState} from "react";
import type {OvertimeRecord} from "./OvertimeGrid";
import {TimeEntryForm} from "./TimeEntryForm";

import {useTranslations} from "next-intl";

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
  const t = useTranslations("Dialog");
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
        title: t("successTitle"),
        description: entry
          ? t("updateSuccess")
          : t("createSuccess"),
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
        title: t("errorTitle"),
        description:
          error instanceof Error
            ? error.message
            : t("saveError"),
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
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {entry ? t("editTitle") : t("newTitle")}
          </DialogTitle>
          <DialogDescription>
            {entry
              ? t("editDescription")
              : t("newDescription")}
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
