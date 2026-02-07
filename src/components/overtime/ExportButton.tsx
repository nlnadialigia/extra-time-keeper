"use client";

import {Button} from "@/components/ui/button";
import {Download, Loader2} from "lucide-react";
import {useEffect, useState} from "react";
import {OvertimeRecord} from "./OvertimeGrid";
import {ReportPDF} from "./ReportPDF";
// We use dynamic import for PDFDownloadLink usually but usePDF hook is also fine 
// or manually handling the blob.
// React-pdf < 4 uses PDFDownloadLink. v4 changed things a bit?
// The user installed latest.
import {PDFDownloadLink} from "@react-pdf/renderer";

export function ExportButton({records}: {records: OvertimeRecord[];}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Carregando PDF...
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<ReportPDF records={records} />}
      fileName={`relatorio-horas-${new Date().toISOString().split("T")[0]}.pdf`}
    >
      {({blob, url, loading, error}) => (
        <Button variant="outline" size="sm" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {loading ? "Gerando..." : "Exportar PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
