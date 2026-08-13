import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';
import { broadcast, SOCKET_EVENTS } from '../../sockets';

interface CastVoteInput {
  userId: string;
  nomineeId: string;
  paymentId: string;
}

export const votesService = {
  // Final step of the workflow: Payment Verified -> Login/Register -> Vote Enabled -> this.
  async cast(input: CastVoteInput) {
    const payment = await prisma.payment.findUnique({ where: { id: input.paymentId } });

    if (!payment) throw new AppError('Payment not found', 404);
    if (payment.userId !== input.userId) throw new AppError('This payment does not belong to you', 403);
    if (payment.status !== 'SUCCESS') throw new AppError('Payment has not been verified yet', 402);

    // One payment = one vote — duplicate vote prevention.
    const existingVote = await prisma.vote.findUnique({ where: { paymentId: input.paymentId } });
    if (existingVote) throw new AppError('This payment has already been used to cast a vote', 409);

    const [vote, nominee] = await prisma.$transaction([
      prisma.vote.create({
        data: { userId: input.userId, nomineeId: input.nomineeId, paymentId: input.paymentId },
      }),
      prisma.nominee.update({
        where: { id: input.nomineeId },
        data: { voteCount: { increment: 1 } },
        include: { category: true },
      }),
    ]);

    // Instantly push the new tally to every connected client (homepage,
    // category page, leaderboards) via WebSockets — no refresh required.
    broadcast(SOCKET_EVENTS.VOTE_CAST, {
      nomineeId: nominee.id,
      nomineeName: nominee.name,
      categoryId: nominee.categoryId,
      categoryName: nominee.category.name,
      voteCount: nominee.voteCount,
    });

    return vote;
  },

  async historyForUser(userId: string) {
    return prisma.vote.findMany({
      where: { userId },
      include: { nominee: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async leaderboard(limit = 10) {
    return prisma.nominee.findMany({
      orderBy: { voteCount: 'desc' },
      take: limit,
      include: { category: true },
    });
  },
};
