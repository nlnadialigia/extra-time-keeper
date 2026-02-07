"use client";

import {OvertimeRecord} from "@/components/overtime/OvertimeGrid";
import {useState, useCallback} from "react";

export function useTimeEntries(initialRecords: OvertimeRecord[]) {
  const [records, setRecords] = useState<OvertimeRecord[]>(initialRecords);

  const addRecord = useCallback((newRecord: OvertimeRecord) => {
    setRecords(prev => [newRecord, ...prev]);
  }, []);

  const updateRecord = useCallback((id: string, updatedRecord: OvertimeRecord) => {
    setRecords(prev => prev.map(record => 
      record.id === id ? updatedRecord : record
    ));
  }, []);

  const removeRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  }, []);

  const refreshRecords = useCallback((newRecords: OvertimeRecord[]) => {
    setRecords(newRecords);
  }, []);

  return {
    records,
    addRecord,
    updateRecord,
    removeRecord,
    refreshRecords
  };
}
