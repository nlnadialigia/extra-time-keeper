/**
 * @jest-environment node
 */

import { createTimeEntry, updateTimeEntry, deleteTimeEntry } from '@/app/actions/entry';
import { prisma } from '@/lib/db';

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    timeEntry: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock revalidatePath
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const { getServerSession } = require('next-auth');

describe('Entry Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTimeEntry', () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockSession = { user: { email: 'test@example.com' } };
    const validEntryData = {
      date: new Date('2024-01-15'),
      activity: 'Test activity',
      type: 'extra' as const,
      startTime: '09:00',
      endTime: '17:00',
    };

    it('should create entry successfully', async () => {
      getServerSession.mockResolvedValue(mockSession);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.timeEntry.create.mockResolvedValue({
        id: 'entry-1',
        ...validEntryData,
        totalHours: 8,
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await createTimeEntry(validEntryData);

      expect(result.success).toBe(true);
      expect(mockPrisma.timeEntry.create).toHaveBeenCalledWith({
        data: {
          ...validEntryData,
          totalHours: 8,
          userId: 'user-1',
        },
      });
    });

    it('should throw error when not authenticated', async () => {
      getServerSession.mockResolvedValue(null);

      await expect(createTimeEntry(validEntryData)).rejects.toThrow('Não autorizado');
    });

    it('should throw error when user not found', async () => {
      getServerSession.mockResolvedValue(mockSession);
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(createTimeEntry(validEntryData)).rejects.toThrow('Usuário não encontrado');
    });
  });
});
