import bcrypt from 'bcryptjs';
import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';

interface RegisterInput {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  password: string;
  roleName?: 'REGISTERED_VOTER' | 'NOMINEE';
}

interface LoginInput {
  phone?: string;
  email?: string;
  identifier?: string;
  password: string;
}

export function formatKenyanPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    cleaned = '254' + cleaned;
  }
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  return cleaned;
}

export const authService = {
  async register(input: RegisterInput) {
    if (!input.phone) {
      throw new AppError('Phone number is required', 400);
    }
    if (!input.password || input.password.length < 4) {
      throw new AppError('Password must be at least 4 characters', 400);
    }

    const formattedPhone = formatKenyanPhone(input.phone);

    // Check if phone already registered
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: formattedPhone },
          ...(input.email ? [{ email: input.email }] : []),
        ],
      },
    });

    if (existing) {
      throw new AppError('An account with this phone number already exists. Please log in.', 409);
    }

    const roleName = input.roleName || 'REGISTERED_VOTER';
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });

    const passwordHash = await bcrypt.hash(input.password, 12);

    let first = input.firstName || '';
    let last = input.lastName || '';
    if (input.name && !first) {
      const parts = input.name.trim().split(' ');
      first = parts[0] || 'Voter';
      last = parts.slice(1).join(' ') || '';
    }
    if (!first) first = 'Voter';

    const generatedEmail = input.email || `${formattedPhone.replace('+', '')}@nduthiawards.co.ke`;

    const user = await prisma.user.create({
      data: {
        firstName: first,
        lastName: last,
        phone: formattedPhone,
        email: generatedEmail,
        passwordHash,
        roleId: role.id,
      },
      include: { role: true },
    });

    const tokens = await this.issueTokens(user.id, user.role.name);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        phone: user.phone,
        role: user.role.name,
      },
      ...tokens,
    };
  },

  async login(input: LoginInput) {
    const rawIdentifier = (input.phone || input.email || input.identifier || '').trim();
    if (!rawIdentifier) {
      throw new AppError('Please enter your phone number or email', 400);
    }
    if (!input.password) {
      throw new AppError('Please enter your password', 400);
    }

    const formattedPhone = formatKenyanPhone(rawIdentifier);

    // Look up by phone OR email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: formattedPhone },
          { phone: rawIdentifier },
          { email: rawIdentifier.toLowerCase() },
        ],
      },
      include: { role: true },
    });

    if (!user) {
      throw new AppError('Account not found. Please check your phone number or sign up.', 401);
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Incorrect password. Please try again.', 401);
    }

    // If user is a NOMINEE (Rider/Participant), verify their registration payment was confirmed
    if (user.role.name === 'NOMINEE') {
      const nomineeRecord = await prisma.nominee.findFirst({ where: { userId: user.id } });
      const paidRecord = await prisma.payment.findFirst({ where: { userId: user.id, status: 'SUCCESS' } });

      if (!nomineeRecord && !paidRecord) {
        throw new AppError(
          'Participant registration payment is incomplete. Please complete your registration and M-Pesa payment to activate your account.',
          403
        );
      }
    }

    const tokens = await this.issueTokens(user.id, user.role.name);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        phone: user.phone,
        role: user.role.name,
      },
      ...tokens,
    };
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true, nominee: { include: { category: true, motorcycle: true } } },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      phone: user.phone,
      role: user.role.name,
      nominee: user.nominee,
    };
  },

  async issueTokens(userId: string, role: string) {
    const accessToken = signAccessToken({ userId, role });
    const refreshToken = signRefreshToken({ userId, role });

    await prisma.user.update({ where: { id: userId }, data: { refreshToken } });

    return { accessToken, refreshToken };
  },
};
