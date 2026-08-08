import mongoose from 'mongoose';

const visitorAnalyticsSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    page: { type: String, required: true, default: '/' },
    sessionId: { type: String, required: true, index: true },
    referrer: { type: String, default: 'direct' },
    isUniqueVisit: { type: Boolean, default: true },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.VisitorAnalytics || mongoose.model('VisitorAnalytics', visitorAnalyticsSchema);
