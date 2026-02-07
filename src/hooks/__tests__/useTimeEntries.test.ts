import { renderHook, act } from '@testing-library/react';
import { useTimeEntries } from '@/hooks/useTimeEntries';
import { OvertimeRecord } from '@/components/overtime/OvertimeGrid';

describe('useTimeEntries', () => {
  const mockRecord: OvertimeRecord = {
    id: '1',
    date: new Date('2024-01-15'),
    activity: 'Test activity',
    type: 'extra',
    startTime: '09:00',
    endTime: '17:00',
    totalHours: 8,
  };

  it('should initialize with provided records', () => {
    const { result } = renderHook(() => useTimeEntries([mockRecord]));
    
    expect(result.current.records).toEqual([mockRecord]);
  });

  it('should add new record', () => {
    const { result } = renderHook(() => useTimeEntries([]));
    
    act(() => {
      result.current.addRecord(mockRecord);
    });
    
    expect(result.current.records).toEqual([mockRecord]);
  });

  it('should update existing record', () => {
    const { result } = renderHook(() => useTimeEntries([mockRecord]));
    const updatedRecord = { ...mockRecord, activity: 'Updated activity' };
    
    act(() => {
      result.current.updateRecord('1', updatedRecord);
    });
    
    expect(result.current.records[0].activity).toBe('Updated activity');
  });

  it('should remove record', () => {
    const { result } = renderHook(() => useTimeEntries([mockRecord]));
    
    act(() => {
      result.current.removeRecord('1');
    });
    
    expect(result.current.records).toEqual([]);
  });
});
