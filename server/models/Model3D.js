import mongoose from 'mongoose';

const model3DSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: '' },
    fullDescription: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Product', 'MEP', 'Structural'],
      default: 'MEP',
    },
    tags: [{ type: String }],
    sourceFile: {
      url: { type: String, required: true },
      fileName: { type: String, required: true },
      format: { type: String, required: true },
      sizeBytes: { type: Number, default: 0 },
      uploadedAt: { type: Date, default: Date.now },
    },
    convertedFile: {
      url: { type: String, default: null },
      fileName: { type: String, default: null },
      format: { type: String, default: 'glb' },
    },
    thumbnail: {
      url: { type: String, default: null },
    },
    conversionStatus: {
      type: String,
      enum: ['uploaded', 'processing', 'ready', 'failed'],
      default: 'uploaded',
    },
    conversionError: { type: String, default: null },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Model3D || mongoose.model('Model3D', model3DSchema);
