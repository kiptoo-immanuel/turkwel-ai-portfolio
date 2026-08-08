import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Model3D from '../models/Model3D.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { process3DModelConversion } from '../services/converterService.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'public', 'uploads', 'models_source');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cad_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB CAD file limit
});

// Seed default 3D models if empty
const seedInitial3DModels = async () => {
  try {
    const count = await Model3D.countDocuments();
    if (count === 0) {
      const m1 = await Model3D.create({
        title: 'Commercial HVAC Chiller & Air Riser System',
        shortDescription: '3D MEP parametric model showing chiller piping and ductwork routing.',
        fullDescription: 'High-density commercial tower HVAC equipment layout exported from Revit. Features dynamic thermal sensors and VFD air handler nodes.',
        category: 'MEP',
        tags: ['HVAC', 'Revit MEP', 'Chiller', 'Piping'],
        sourceFile: {
          url: '/uploads/models_source/sample_hvac.rvt',
          fileName: 'commercial_hvac_riser.rvt',
          format: 'rvt',
          sizeBytes: 18500000,
        },
        convertedFile: {
          url: '/uploads/converted/sample_hvac.glb',
          fileName: 'commercial_hvac_riser.glb',
          format: 'glb',
        },
        thumbnail: { url: '/assets/hero_building.jpg' },
        conversionStatus: 'ready',
        isPublished: true,
        isFeatured: true,
      });

      const m2 = await Model3D.create({
        title: 'Titanium Generative Drone Arm Component',
        shortDescription: 'Generative CAD structural mesh lightweighting model.',
        fullDescription: 'Optimized via FEA stress simulation for maximum rigidity at 31% reduced mass.',
        category: 'Product',
        tags: ['Generative CAD', 'SolidWorks', 'FEA', 'Aerospace'],
        sourceFile: {
          url: '/uploads/models_source/sample_drone.step',
          fileName: 'generative_drone_arm.step',
          format: 'step',
          sizeBytes: 12400000,
        },
        convertedFile: {
          url: '/uploads/converted/sample_drone.glb',
          fileName: 'generative_drone_arm.glb',
          format: 'glb',
        },
        thumbnail: { url: '/assets/product_cad.jpg' },
        conversionStatus: 'ready',
        isPublished: true,
        isFeatured: true,
      });

      console.log('[3D Gallery Seed] Initialized default 3D engineering models.');
    }
  } catch (err) {
    console.error('[3D Gallery Seed Error]', err.message);
  }
};
seedInitial3DModels();

// PUBLIC: Get published & ready 3D models
router.get('/public', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isPublished: true, conversionStatus: 'ready' };
    if (category && category !== 'All') {
      query.category = category;
    }
    const models = await Model3D.find(query).sort({ isFeatured: -1, createdAt: -1 });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUBLIC: Increment model view count
router.post('/public/:id/view', async (req, res) => {
  try {
    await Model3D.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Get all models (including processing/drafts)
router.get('/admin/all', requireAdminAuth, async (req, res) => {
  try {
    const models = await Model3D.find().sort({ createdAt: -1 });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Upload & create 3D Model (Triggers auto-conversion background pipeline)
router.post('/admin', requireAdminAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CAD or 3D source file uploaded.' });
    }

    const { title, shortDescription, fullDescription, category, tags, isPublished, isFeatured } = req.body;
    const ext = path.extname(req.file.originalname).replace('.', '').toLowerCase();

    const newModel = new Model3D({
      title,
      shortDescription: shortDescription || '',
      fullDescription: fullDescription || '',
      category: category || 'MEP',
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map(t => t.trim()) : [],
      sourceFile: {
        url: `/uploads/models_source/${req.file.filename}`,
        fileName: req.file.originalname,
        format: ext,
        sizeBytes: req.file.size,
      },
      conversionStatus: 'uploaded',
      isPublished: isPublished === 'true' || isPublished === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    await newModel.save();

    // Trigger asynchronous conversion pipeline
    setTimeout(() => {
      process3DModelConversion(newModel._id);
    }, 100);

    res.status(201).json(newModel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ADMIN: Update 3D Model details
router.put('/admin/:id', requireAdminAuth, async (req, res) => {
  try {
    const model = await Model3D.findById(req.params.id);
    if (!model) return res.status(404).json({ message: '3D model entry not found.' });

    const { title, shortDescription, fullDescription, category, tags, isPublished, isFeatured } = req.body;

    if (title) model.title = title;
    if (shortDescription !== undefined) model.shortDescription = shortDescription;
    if (fullDescription !== undefined) model.fullDescription = fullDescription;
    if (category) model.category = category;
    if (tags !== undefined) {
      model.tags = Array.isArray(tags) ? tags : tags ? tags.split(',').map(t => t.trim()) : [];
    }
    if (isPublished !== undefined) model.isPublished = isPublished === 'true' || isPublished === true;
    if (isFeatured !== undefined) model.isFeatured = isFeatured === 'true' || isFeatured === true;

    await model.save();
    res.json(model);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ADMIN: Re-trigger conversion pipeline for a model
router.post('/admin/:id/convert', requireAdminAuth, async (req, res) => {
  try {
    const model = await Model3D.findById(req.params.id);
    if (!model) return res.status(404).json({ message: 'Model not found.' });

    model.conversionStatus = 'processing';
    model.conversionError = null;
    await model.save();

    setTimeout(() => {
      process3DModelConversion(model._id);
    }, 100);

    res.json({ message: 'Conversion pipeline re-triggered.', model });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Delete 3D Model
router.delete('/admin/:id', requireAdminAuth, async (req, res) => {
  try {
    const model = await Model3D.findByIdAndDelete(req.params.id);
    if (!model) return res.status(404).json({ message: 'Model not found.' });
    res.json({ message: '3D Model entry deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
