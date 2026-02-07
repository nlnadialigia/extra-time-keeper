import { calculateTotalHours, timeEntrySchema } from '@/lib/validations/timeEntry';

describe('timeEntry validations', () => {
  describe('calculateTotalHours', () => {
    it('should calculate hours correctly for same day', () => {
      expect(calculateTotalHours('09:00', '17:00')).toBe(8);
      expect(calculateTotalHours('14:30', '18:45')).toBe(4.25);
    });

    it('should handle minutes correctly', () => {
      expect(calculateTotalHours('09:15', '10:30')).toBe(1.25);
      expect(calculateTotalHours('08:45', '12:15')).toBe(3.5);
    });

    it('should work with overnight shifts', () => {
      expect(calculateTotalHours('22:00', '06:00')).toBe(8);
      expect(calculateTotalHours('23:30', '07:15')).toBe(7.75);
    });
  });

  describe('timeEntrySchema', () => {
    const validData = {
      date: new Date('2024-01-15'),
      activity: 'Test activity',
      type: 'extra' as const,
      startTime: '09:00',
      endTime: '17:00',
    };

    it('should validate correct data', () => {
      expect(() => timeEntrySchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid activity length', () => {
      expect(() => 
        timeEntrySchema.parse({ ...validData, activity: 'ab' })
      ).toThrow();
    });

    it('should reject invalid time format', () => {
      expect(() => 
        timeEntrySchema.parse({ ...validData, startTime: '25:00' })
      ).toThrow();
    });

    it('should reject end time before start time', () => {
      expect(() => 
        timeEntrySchema.parse({ ...validData, startTime: '17:00', endTime: '09:00' })
      ).toThrow();
    });
  });
});
