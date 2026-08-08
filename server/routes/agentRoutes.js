import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AIAgent from '../models/AIAgent.js';
import AgentPricing from '../models/AgentPricing.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'public', 'uploads', 'agents');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `agent_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const upload = multer({ storage });

// Seed initial default AI Agents and Pricing Plans
const seedInitialAgents = async () => {
  try {
    const count = await AIAgent.countDocuments();
    if (count === 0) {
      const hvacAgent = await AIAgent.create({
        name: 'HVAC Thermal Load Balancer Agent',
        shortDescription: 'Predictive Thermal Load Balancing & Energy AI',
        fullDescription: 'Custom autonomous agents connected directly to BACnet, Modbus, and Niagara Tridium frameworks. Runs continuous predictive thermal simulations, dynamic damper adjustments, and automated fault diagnostics.',
        category: 'built-environment',
        features: ['BACnet/Tridium Integration', 'Predictive Thermal Load Balancing', 'Automated FDD Fault Detection', 'Occupant Comfort Learning'],
        benefits: ['30%-45% Energy Reduction', 'Zero Manual Chiller Tweaks', 'Instant BMS Integration'],
        image: '/assets/hvac_bim.jpg',
        status: { published: true, available: true },
      });

      await AgentPricing.insertMany([
        { aiAgentId: hvacAgent._id, planName: 'Basic Facility', price: 149, billingType: 'monthly' },
        { aiAgentId: hvacAgent._id, planName: 'Enterprise Campus', price: 499, billingType: 'monthly' },
      ]);

      const bimAgent = await AIAgent.create({
        name: 'BIM Clash & Code Auditor Agent',
        shortDescription: 'Automated 3D MEP Clash Resolution & IBC Code Auditing',
        fullDescription: 'Plugs directly into Revit, ArchiCAD, and openIFC pipelines to resolve complex MEP clashes and enforce strict building code compliance.',
        category: 'built-environment',
        features: ['Parametric IFC Re-routing', 'IBC & ADA Compliance Check', 'COBie Tag Auto Generation'],
        benefits: ['4.5 Hours Saved per Model', 'Zero On-site MEP Conflicts'],
        image: '/assets/hero_building.jpg',
        status: { published: true, available: true },
      });

      await AgentPricing.insertMany([
        { aiAgentId: bimAgent._id, planName: 'Per Model Scan', price: 99, billingType: 'one_time' },
        { aiAgentId: bimAgent._id, planName: 'Unlimited Studio', price: 299, billingType: 'monthly' },
      ]);

      const cadAgent = await AIAgent.create({
        name: 'Generative CAD & DFM Optimization Agent',
        shortDescription: 'Generative CAD Topology & FEA Stress Lightweighting',
        fullDescription: 'Generates lightweight structural meshes, FEA stress maps, and verifies CNC tool path accessibility.',
        category: 'product-dev',
        features: ['Generative Mesh Thinning', '5-Axis CNC Toolpath Verification', 'FEA Von Mises Simulation'],
        benefits: ['34% Weight Reduction', 'Instant DFM Certification'],
        image: '/assets/product_cad.jpg',
        status: { published: true, available: true },
      });

      await AgentPricing.insertMany([
        { aiAgentId: cadAgent._id, planName: 'CAD Professional', price: 199, billingType: 'one_time' },
      ]);

      console.log('[Agents Seed] Initialized default AI Agents & Pricing Plans.');
    }
  } catch (err) {
    console.error('[Agents Seed Error]', err.message);
  }
};
seedInitialAgents();

// PUBLIC: Get published agents with pricing plans
router.get('/public', async (req, res) => {
  try {
    const agents = await AIAgent.find({ 'status.published': true }).lean();
    const agentIds = agents.map(a => a._id);
    const pricings = await AgentPricing.find({ aiAgentId: { $in: agentIds } }).lean();

    const result = agents.map(agent => ({
      ...agent,
      plans: pricings.filter(p => p.aiAgentId.toString() === agent._id.toString()),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Get all agents + plans
router.get('/admin/all', requireAdminAuth, async (req, res) => {
  try {
    const agents = await AIAgent.find().sort({ createdAt: -1 }).lean();
    const agentIds = agents.map(a => a._id);
    const pricings = await AgentPricing.find({ aiAgentId: { $in: agentIds } }).lean();

    const result = agents.map(agent => ({
      ...agent,
      plans: pricings.filter(p => p.aiAgentId.toString() === agent._id.toString()),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Create AI Agent
router.post('/admin', requireAdminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, shortDescription, fullDescription, category, features, benefits, demoUrl, documentationUrl, purchaseUrl, published, available } = req.body;

    const agent = new AIAgent({
      name,
      shortDescription,
      fullDescription: fullDescription || '',
      category: category || 'built-environment',
      features: Array.isArray(features) ? features : features ? features.split(',').map(f => f.trim()) : [],
      benefits: Array.isArray(benefits) ? benefits : benefits ? benefits.split(',').map(b => b.trim()) : [],
      demoUrl: demoUrl || '',
      documentationUrl: documentationUrl || '',
      purchaseUrl: purchaseUrl || '',
      status: {
        published: published === 'true' || published === true,
        available: available === 'true' || available === true,
      },
    });

    if (req.file) {
      agent.image = `/uploads/agents/${req.file.filename}`;
    }

    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ADMIN: Update AI Agent
router.put('/admin/:id', requireAdminAuth, upload.single('image'), async (req, res) => {
  try {
    const agent = await AIAgent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found.' });

    const { name, shortDescription, fullDescription, category, features, benefits, demoUrl, documentationUrl, purchaseUrl, published, available } = req.body;

    if (name) agent.name = name;
    if (shortDescription) agent.shortDescription = shortDescription;
    if (fullDescription !== undefined) agent.fullDescription = fullDescription;
    if (category) agent.category = category;
    if (demoUrl !== undefined) agent.demoUrl = demoUrl;
    if (documentationUrl !== undefined) agent.documentationUrl = documentationUrl;
    if (purchaseUrl !== undefined) agent.purchaseUrl = purchaseUrl;

    if (features !== undefined) {
      agent.features = Array.isArray(features) ? features : features ? features.split(',').map(f => f.trim()) : [];
    }
    if (benefits !== undefined) {
      agent.benefits = Array.isArray(benefits) ? benefits : benefits ? benefits.split(',').map(b => b.trim()) : [];
    }

    if (published !== undefined || available !== undefined) {
      agent.status = {
        published: published !== undefined ? (published === 'true' || published === true) : agent.status.published,
        available: available !== undefined ? (available === 'true' || available === true) : agent.status.available,
      };
    }

    if (req.file) {
      agent.image = `/uploads/agents/${req.file.filename}`;
    }

    await agent.save();
    res.json(agent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ADMIN: Delete AI Agent & linked pricing plans
router.delete('/admin/:id', requireAdminAuth, async (req, res) => {
  try {
    const agent = await AIAgent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found.' });
    await AgentPricing.deleteMany({ aiAgentId: req.params.id });
    res.json({ message: 'AI Agent and linked pricing plans deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Add/Edit/Delete Pricing Plan per Agent
router.post('/admin/:id/pricing', requireAdminAuth, async (req, res) => {
  try {
    const { planName, price, currency, billingType } = req.body;
    const plan = new AgentPricing({
      aiAgentId: req.params.id,
      planName,
      price: Number(price) || 0,
      currency: currency || 'USD',
      billingType: billingType || 'one_time',
    });
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/admin/pricing/:planId', requireAdminAuth, async (req, res) => {
  try {
    await AgentPricing.findByIdAndDelete(req.params.planId);
    res.json({ message: 'Pricing plan deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
