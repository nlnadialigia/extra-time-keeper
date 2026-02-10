"use client";

import {deleteTimeEntry} from "@/app/actions/entry";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {Loader2} from "lucide-react";
import {useState} from "react";

import {useTranslations} from "next-intl";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entryId: string;
  entryActivity: string;
  onSuccess?: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  entryId,
  entryActivity,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const t = useTranslations("Dashboard");
  const tc = useTranslations("Common");
  const td = useTranslations("Delete");
  const [isDeleting, setIsDeleting] = useState(false);
  const {toast} = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteTimeEntry(entryId);

      toast({
        title: tc("success"),
        description: t("deleteSuccess"),
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: tc("error"),
        description:
          error instanceof Error
            ? error.message
            : t("deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{td("title")}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>{t("deleteConfirm", {activity: entryActivity})}</p>
              <p className="mt-2 font-semibold">{t("deleteDescription")}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{tc("cancel")}</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tc("delete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
