"use client";

import {Document, Page, StyleSheet, Text, View} from "@react-pdf/renderer";
import {format} from "date-fns";
import {ptBR} from "date-fns/locale";
import type {OvertimeRecord} from "./OvertimeGrid";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    color: "#6D28D9", // Purple
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#6B7280",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#E5E7EB",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColDate: {
    width: "12%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#E5E7EB",
  },
  tableColActivity: {
    width: "35%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#E5E7EB",
  },
  tableColType: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#E5E7EB",
  },
  tableColTime: {
    width: "12%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#E5E7EB",
  },
  tableColTotal: {
    width: "14%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#E5E7EB",
  },
  tableCell: {
    margin: 4,
    fontSize: 8,
  },
  tableCellRed: {
    margin: 4,
    fontSize: 8,
    color: "#DC2626",
  },
  tableHeader: {
    margin: 4,
    fontSize: 9,
    fontWeight: "bold",
    color: "#4B5563",
  },
  headerRow: {
    backgroundColor: "#F9FAFB",
  },
  summaryRow: {
    backgroundColor: "#F3F4F6",
    borderTopWidth: 2,
    borderTopColor: "#6D28D9",
  },
  summaryText: {
    margin: 4,
    fontSize: 9,
    fontWeight: "bold",
    color: "#1F2937",
  },
});

interface ReportPDFProps {
  records: OvertimeRecord[];
  userName?: string;
}

export const ReportPDF = ({records, userName}: ReportPDFProps) => {
  // Sort records by date ascending
  const sortedRecords = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate totals
  const totalExtra = records
    .filter((r) => r.type === "extra")
    .reduce((acc, r) => acc + r.totalHours, 0);

  const totalCompensation = records
    .filter((r) => r.type === "compensation")
    .reduce((acc, r) => acc + r.totalHours, 0);

  const balance = totalExtra - totalCompensation;

  const formatHours = (hours: number) => {
    const h = Math.floor(Math.abs(hours));
    const m = Math.round((Math.abs(hours) - h) * 60);
    const sign = hours < 0 ? "-" : "";
    return `${sign}${h}h ${m.toString().padStart(2, "0")}min`;
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Horas Extras{userName ? ` - ${userName}` : ""}</Text>
          <Text style={styles.subtitle}>
            Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", {locale: ptBR})}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.headerRow]}>
            <View style={styles.tableColDate}>
              <Text style={styles.tableHeader}>Data</Text>
            </View>
            <View style={styles.tableColActivity}>
              <Text style={styles.tableHeader}>Atividade</Text>
            </View>
            <View style={styles.tableColType}>
              <Text style={styles.tableHeader}>Tipo</Text>
            </View>
            <View style={styles.tableColTime}>
              <Text style={styles.tableHeader}>Início</Text>
            </View>
            <View style={styles.tableColTime}>
              <Text style={styles.tableHeader}>Término</Text>
            </View>
            <View style={styles.tableColTotal}>
              <Text style={styles.tableHeader}>Total (h)</Text>
            </View>
          </View>

          {sortedRecords.map((record) => (
            <View style={styles.tableRow} key={record.id}>
              <View style={styles.tableColDate}>
                <Text style={styles.tableCell}>
                  {format(new Date(record.date), "dd/MM/yyyy", {locale: ptBR})}
                </Text>
              </View>
              <View style={styles.tableColActivity}>
                <Text style={styles.tableCell}>{record.activity}</Text>
              </View>
              <View style={styles.tableColType}>
                <Text style={styles.tableCell}>
                  {record.type === "extra" ? "Extra" : "Compensação"}
                </Text>
              </View>
              <View style={styles.tableColTime}>
                <Text style={styles.tableCell}>{record.startTime}</Text>
              </View>
              <View style={styles.tableColTime}>
                <Text style={styles.tableCell}>{record.endTime}</Text>
              </View>
              <View style={styles.tableColTotal}>
                <Text style={record.type === "compensation" ? styles.tableCellRed : styles.tableCell}>
                  {formatHours(record.totalHours)}
                </Text>
              </View>
            </View>
          ))}

          {/* Summary Row */}
          <View style={[styles.tableRow, styles.summaryRow]}>
            <View style={styles.tableColDate}>
              <Text style={styles.summaryText}></Text>
            </View>
            <View style={styles.tableColActivity}>
              <Text style={styles.summaryText}>SALDO TOTAL</Text>
            </View>
            <View style={styles.tableColType}>
              <Text style={styles.summaryText}></Text>
            </View>
            <View style={styles.tableColTime}>
              <Text style={styles.summaryText}></Text>
            </View>
            <View style={styles.tableColTime}>
              <Text style={styles.summaryText}></Text>
            </View>
            <View style={styles.tableColTotal}>
              <Text style={balance < 0 ? styles.tableCellRed : styles.summaryText}>
                {formatHours(balance)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
