import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import nomineesRoutes from './modules/nominees/nominees.routes';
import votesRoutes from './modules/votes/votes.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import sponsorsRoutes from './modules/sponsors/sponsors.routes';
import newsRoutes from './modules/news/news.routes';
import galleryRoutes from './modules/gallery/gallery.routes';
import eventsRoutes from './modules/events/events.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoriesRoutes);
router.use('/nominees', nomineesRoutes);
router.use('/votes', votesRoutes);
router.use('/payments', paymentsRoutes);
router.use('/sponsors', sponsorsRoutes);
router.use('/news', newsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/events', eventsRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
