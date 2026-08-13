import { Router } from 'express';
import { prisma } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/apiResponse';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';

const router = Router();

// Public stats (homepage + live results — no auth required)
router.get(
  '/public-stats',
  asyncHandler(async (_req, res) => {
    const [totalVotes, registeredVoters, categories] = await Promise.all([
      prisma.vote.count(),
      prisma.user.count(),
      prisma.category.count({ where: { isActive: true } }),
    ]);
    return ok(res, {
      totalVotes,
      registeredVoters,
      categories,
      lastUpdated: new Date().toISOString(),
    });
  })
);

// Full dashboard summary — admin stats cards
router.get(
  '/summary',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  asyncHandler(async (_req, res) => {
    const [totalVotes, registeredVoters, totalNominees, revenue, categories] = await Promise.all([
      prisma.vote.count(),
      prisma.user.count(),
      prisma.nominee.count(),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'SUCCESS' } }),
      prisma.category.count({ where: { isActive: true } }),
    ]);

    return ok(res, {
      totalVotes,
      registeredVoters,
      totalNominees,
      activeCategories: categories,
      totalRevenue: Number(revenue._sum.amount ?? 0),
      daysLeft: 10,
    });
  })
);

// Votes per day for last 7 days — line/bar chart
router.get(
  '/votes-by-day',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  asyncHandler(async (_req, res) => {
    const days = 7;
    const result: { date: string; votes: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);
      const count = await prisma.vote.count({
        where: { createdAt: { gte: d, lt: nextD } },
      });
      result.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        votes: count,
      });
    }
    return ok(res, result);
  })
);

// Votes by category — donut chart
router.get(
  '/votes-by-category',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { nominees: { select: { voteCount: true } } },
    });
    const data = categories.map((c) => ({
      name: c.name,
      votes: c.nominees.reduce((s: number, n: { voteCount: number }) => s + n.voteCount, 0),
    }));
    const total = data.reduce((s, d) => s + d.votes, 0);
    return ok(
      res,
      data.map((d) => ({
        ...d,
        percent: total > 0 ? Math.round((d.votes / total) * 100) : 0,
      }))
    );
  })
);

// Top nominees across all categories
router.get(
  '/top-nominees',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  asyncHandler(async (_req, res) => {
    const nominees = await prisma.nominee.findMany({
      orderBy: { voteCount: 'desc' },
      take: 5,
      include: {
        category: { select: { name: true } },
        motorcycle: { include: { images: true } },
      },
    });
    return ok(
      res,
      nominees.map((n, i) => ({
        rank: i + 1,
        id: n.id,
        name: n.name,
        category: n.category.name,
        votes: n.voteCount,
        imageUrl: n.motorcycle?.images[0]?.url ?? null,
      }))
    );
  })
);

// Recent payments — admin table
router.get(
  '/recent-payments',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  asyncHandler(async (_req, res) => {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    return ok(
      res,
      payments.map((p, i) => ({
        id: `TXN-${24560 - i}`,
        voter: `${p.user.firstName} ${p.user.lastName}`,
        method: p.method,
        amount: Number(p.amount),
        currency: p.currency,
        status: p.status,
        createdAt: p.createdAt,
      }))
    );
  })
);

// Recent audit log activity
router.get(
  '/recent-activity',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  asyncHandler(async (_req, res) => {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    return ok(res, logs);
  })
);

export default router;
