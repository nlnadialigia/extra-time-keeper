import {Button} from "@/components/ui/button";
import {AllCommunityModule, ColDef, ModuleRegistry, themeQuartz} from "ag-grid-community";
import {AgGridReact} from "ag-grid-react";
import {format} from "date-fns";
import {enUS, ptBR} from "date-fns/locale";
import {Pencil, Trash2} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useCallback, useMemo, useRef} from "react";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export interface OvertimeRecord {
  id: string;
  date: Date;
  activity: string;
  type: "extra" | "compensation";
  startTime: string;
  endTime: string;
  totalHours: number;
}

interface OvertimeGridProps {
  records: OvertimeRecord[];
  onEdit?: (record: OvertimeRecord) => void;
  onDelete?: (record: OvertimeRecord) => void;
}

// Custom theme extending Quartz with purple colors
const purpleTheme = themeQuartz.withParams({
  accentColor: "#8B5CF6",
  backgroundColor: "#FEFEFE",
  foregroundColor: "#1F1B24",
  headerBackgroundColor: "#F5F3FF",
  headerTextColor: "#5B21B6",
  rowHoverColor: "#F3E8FF",
  selectedRowBackgroundColor: "#DDD6FE",
  borderColor: "#E5E0EB",
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 14,
  headerFontWeight: 600,
  wrapperBorderRadius: 12,
});

export function OvertimeGrid({records, onEdit, onDelete}: OvertimeGridProps) {
  const t = useTranslations("Grid");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const dateLocale = locale === "pt" ? ptBR : enUS;
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs = useMemo<ColDef<OvertimeRecord>[]>(
    () => [
      {
        field: "date",
        headerName: t("date"),
        flex: 1,
        minWidth: 120,
        valueFormatter: (params) => {
          if (params.value) {
            return format(new Date(params.value), "dd/MM/yyyy", {locale: dateLocale});
          }
          return "";
        },
        sortable: true,
        filter: true,
      },
      {
        field: "activity",
        headerName: t("activity"),
        flex: 2,
        minWidth: 200,
        sortable: true,
        filter: true,
      },
      {
        field: "type",
        headerName: t("type"),
        flex: 1,
        minWidth: 130,
        cellRenderer: (params: {value: string;}) => {
          const isExtra = params.value === "extra";
          return (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${isExtra
                ? "bg-primary/10 text-primary"
                : "bg-accent/10 text-accent"
                }`}
            >
              {isExtra ? t("extra") : t("compensation")}
            </span>
          );
        },
        sortable: true,
        filter: true,
      },
      {
        field: "startTime",
        headerName: t("start"),
        flex: 1,
        minWidth: 100,
        sortable: true,
      },
      {
        field: "endTime",
        headerName: t("end"),
        flex: 1,
        minWidth: 100,
        sortable: true,
      },
      {
        field: "totalHours",
        headerName: t("total"),
        flex: 1,
        minWidth: 100,
        valueFormatter: (params) => {
          if (params.value !== undefined) {
            const hours = Math.floor(params.value);
            const minutes = Math.round((params.value - hours) * 60);
            return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
          }
          return "";
        },
        sortable: true,
        cellClass: (params) => {
          const baseClass = "font-semibold";
          if (params.data?.type === "compensation") {
            return `${baseClass} text-red-600`;
          }
          return baseClass;
        },
      },
      {
        headerName: tc("actions"),
        flex: 1,
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: (params: {data: OvertimeRecord;}) => {
          return (
            <div className="flex gap-2 items-center h-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(params.data)}
                className="h-8 px-2"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(params.data)}
                className="h-8 px-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" color="red" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete, t, tc, dateLocale]
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
    }),
    []
  );

  const onGridReady = useCallback(() => {
    // Grid is ready
  }, []);

  return (
    <div className="h-125 w-full rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <AgGridReact<OvertimeRecord>
        ref={gridRef}
        rowData={records}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        theme={purpleTheme}
        animateRows={true}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
        rowSelection="single"
        domLayout="normal"
      />
    </div>
  );
}