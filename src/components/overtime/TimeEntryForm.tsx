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
import {ptBR} from "date-fns/locale";
import {CalendarIcon, Loader2} from "lucide-react";
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
  const [totalHours, setTotalHours] = useState<number>(0);

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
          render={({field}) => {
            const [open, setOpen] = useState(false);
            
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
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
                          format(field.value, "PPP", {locale: ptBR})
                        ) : (
                          <span>Selecione uma data</span>
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
                        setOpen(false);
                      }}
                      captionLayout="dropdown"
                      className="rounded-lg border shadow-sm"
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Atividade */}
        <FormField
          control={form.control}
          name="activity"
          render={({field}) => (
            <FormItem>
              <FormLabel>Atividade</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva a atividade realizada..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Descreva brevemente a atividade (3-200 caracteres)
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
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="extra">Hora Extra</SelectItem>
                  <SelectItem value="compensation">Compensação</SelectItem>
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
                <FormLabel>Início</FormLabel>
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
                <FormLabel>Término</FormLabel>
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
              Total de horas:{" "}
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
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {defaultValues ? "Atualizar" : "Criar"} Registro
          </Button>
        </div>
      </form>
    </Form>
  );
}
