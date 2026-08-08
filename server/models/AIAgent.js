import mongoose from 'mongoose';

const aiAgentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, default: '' },
    category: { type: String, default: 'built-environment' },
    features: [{ type: String }],
    benefits: [{ type: String }],
    image: { type: String, default: '/assets/hvac_bim.jpg' },
    demoUrl: { type: String, default: '' },
    documentationUrl: { type: String, default: '' },
    purchaseUrl: { type: String, default: '' },
    status: {
      published: { type: Boolean, default: true },
      available: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.AIAgent || mongoose.model('AIAgent', aiAgentSchema);
