import type { User } from '@/lib/types';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  verifyPassword(username: string, password: string): Promise<Omit<User, 'passwordHash'> | null>;
}
