"use client";

import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {calculateTotalHours, timeEntrySchema, type TimeEntryFormData} from "@/lib/validations/timeEntry";
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns";
import {enUS, ptBR} from "date-fns/locale";
import {CalendarIcon, Loader2} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";

interface TimeEntryFormProps {
  defaultValues?: Partial<TimeEntryFormData>;
  onSubmit: (data: TimeEntryFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TimeEntryForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TimeEntryFormProps) {
  const t = useTranslations("Form");
  const tc = useTranslations("Common");
  const tg = useTranslations("Grid");
  const locale = useLocale();
  const dateLocale = locale === "pt" ? ptBR : enUS;
  const [totalHours, setTotalHours] = useState<number>(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const form = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: defaultValues || {
      date: new Date(),
      activity: "",
      type: "extra",
      startTime: "",
      endTime: "",
    },
  });

  // Calcular horas automaticamente
  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");

  useEffect(() => {
    if (startTime && endTime) {
      try {
        const hours = calculateTotalHours(startTime, endTime);
        setTotalHours(hours);
      } catch {
        setTotalHours(0);
      }
    }
  }, [startTime, endTime]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Data */}
        <FormField
          control={form.control}
          name="date"
          render={({field}) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("date")}</FormLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", {locale: dateLocale})
                      ) : (
                        <span>{t("selectDate")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setIsCalendarOpen(false);
                    }}
                    captionLayout="dropdown"
                    className="rounded-lg border shadow-sm"
                    locale={dateLocale}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Atividade */}
        <FormField
          control={form.control}
          name="activity"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("activity")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("activityPlaceholder")}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("activityHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo */}
        <FormField
          control={form.control}
          name="type"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("type")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectType")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="extra">{tg("extra")}</SelectItem>
                  <SelectItem value="compensation">{tg("compensation")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Horários */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({field}) => (
              <FormItem>
                <FormLabel>{t("start")}</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({field}) => (
              <FormItem>
                <FormLabel>{t("end")}</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Total calculado */}
        {totalHours > 0 && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              {t("totalHours")}:{" "}
              <span className="font-semibold text-foreground">
                {Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}min
              </span>
            </p>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="destructive"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {tc("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {defaultValues ? tc("update") : tc("create")} {t("recordPrefix")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
