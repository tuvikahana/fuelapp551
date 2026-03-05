import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import type { IUserRepository } from '../interfaces/IUserRepository';

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  async verifyPassword(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
