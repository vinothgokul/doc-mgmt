import { PrismaClient } from '@prisma/client';
import {mockDeep, DeepMockProxy} from 'jest-mock-extended';

export type PrismaMock = DeepMockProxy<PrismaClient>;

export const createMock = (): PrismaMock => {
  return mockDeep<PrismaClient>();
}