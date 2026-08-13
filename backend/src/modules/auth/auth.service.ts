import bcrypt from 'bcryptjs';
import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new AppError('An account with this email already exists', 409);
    }

    // Every registered voter defaults to the REGISTERED_VOTER role.
    const role = await prisma.role.upsert({
      where: { name: 'REGISTERED_VOTER' },
      update: {},
      create: { name: 'REGISTERED_VOTER' },
    });

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        passwordHash,
        roleId: role.id,
      },
      include: { role: true },
    });

    // TODO: send email verification link via nodemailer.

    return this.issueTokens(user.id, user.role.name);
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { role: true },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    return this.issueTokens(user.id, user.role.name);
  },

  async issueTokens(userId: string, role: string) {
    const accessToken = signAccessToken({ userId, role });
    const refreshToken = signRefreshToken({ userId, role });

    await prisma.user.update({ where: { id: userId }, data: { refreshToken } });

    return { accessToken, refreshToken };
  },
};
