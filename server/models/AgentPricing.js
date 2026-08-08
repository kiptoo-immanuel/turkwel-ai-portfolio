import mongoose from 'mongoose';

const agentPricingSchema = new mongoose.Schema(
  {
    aiAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'AIAgent', required: true },
    planName: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'USD' },
    billingType: {
      type: String,
      enum: ['free', 'one_time', 'monthly', 'annual', 'custom'],
      default: 'one_time',
    },
  },
  { timestamps: true }
);

export default mongoose.models.AgentPricing || mongoose.model('AgentPricing', agentPricingSchema);
