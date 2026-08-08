import express from 'express';
import VisitorAnalytics from '../models/VisitorAnalytics.js';
import TeamMember from '../models/TeamMember.js';
import AIAgent from '../models/AIAgent.js';
import Model3D from '../models/Model3D.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC: Track page view
router.post('/public/track', async (req, res) => {
  try {
    const { page, sessionId, referrer } = req.body;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if session already visited today
    const existing = await VisitorAnalytics.findOne({
      sessionId: sessionId || 'anon',
      timestamp: { $gte: startOfDay },
    });

    const isUniqueVisit = !existing;

    await VisitorAnalytics.create({
      page: page || '/',
      sessionId: sessionId || `session_${Math.random().toString(36).substring(2)}`,
      referrer: referrer || 'direct',
      isUniqueVisit,
      userAgent: req.headers['user-agent'] || '',
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Get Dashboard summary metrics & stats
router.get('/admin/dashboard-stats', requireAdminAuth, async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Visitor counts
    const totalVisitors = await VisitorAnalytics.countDocuments();
    const visitorsToday = await VisitorAnalytics.countDocuments({ timestamp: { $gte: startOfDay } });
    const visitorsThisWeek = await VisitorAnalytics.countDocuments({ timestamp: { $gte: startOfWeek } });
    const visitorsThisMonth = await VisitorAnalytics.countDocuments({ timestamp: { $gte: startOfMonth } });

    // Team stats
    const totalTeamMembers = await TeamMember.countDocuments();

    // AI Agents stats
    const totalAgents = await AIAgent.countDocuments();
    const availableAgents = await AIAgent.countDocuments({ 'status.available': true });
    const unavailableAgents = await AIAgent.countDocuments({ 'status.available': false });

    // 3D Models breakdown
    const totalModels = await Model3D.countDocuments();
    const productModels = await Model3D.countDocuments({ category: 'Product' });
    const mepModels = await Model3D.countDocuments({ category: 'MEP' });
    const structuralModels = await Model3D.countDocuments({ category: 'Structural' });
    const processingModels = await Model3D.countDocuments({ conversionStatus: 'processing' });
    const readyModels = await Model3D.countDocuments({ conversionStatus: 'ready' });
    const failedModels = await Model3D.countDocuments({ conversionStatus: 'failed' });

    // Top visited pages
    const topPages = await VisitorAnalytics.aggregate([
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // 7-day traffic trend chart data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const trafficTrend = await VisitorAnalytics.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          totalViews: { $sum: 1 },
          uniqueVisits: { $sum: { $cond: ['$isUniqueVisit', 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      visitors: {
        total: totalVisitors,
        today: visitorsToday,
        week: visitorsThisWeek,
        month: visitorsThisMonth,
      },
      team: {
        total: totalTeamMembers,
      },
      agents: {
        total: totalAgents,
        available: availableAgents,
        unavailable: unavailableAgents,
      },
      models3d: {
        total: totalModels,
        product: productModels,
        mep: mepModels,
        structural: structuralModels,
        processing: processingModels,
        ready: readyModels,
        failed: failedModels,
      },
      topPages,
      trafficTrend,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
