import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import TeamMember from '../models/TeamMember.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = express.Router();

// File upload setup for Team images and PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'team');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `team_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WEBP images and PDF documents are allowed.'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 15 * 1024 * 1024 } }); // 15MB limit

// Seed initial default team members if empty
const seedInitialTeam = async () => {
  try {
    const count = await TeamMember.countDocuments();
    if (count === 0) {
      await TeamMember.insertMany([
        {
          name: 'Emmanuel Kiptoo, PE',
          position: 'Lead Design Engineer & Thermal Automation Director',
          biography: 'Licensed Professional Engineer (PE) specializing in mechanical design engineering, HVAC systems, and thermal fluids. Leads our Product Development and BMS HVAC energy optimization agent division.',
          profileImage: '/assets/team-placeholder.jpg',
          email: 'emmanuel@bimaxisgroup.com',
          skills: ['HVAC Automation', 'CAD Design', 'Thermal Fluid Modeling', 'PE License'],
          qualifications: ['Licensed PE (Mechanical & Design)', 'ASHRAE Member', 'M.S. Energy Systems'],
          isPublished: true,
          order: 1,
        },
        {
          name: 'Elena Rostova, AIA',
          position: 'Chief Architect & Spatial AI Lead',
          biography: 'Licensed Architect with 14+ years designing high-density commercial towers and complex healthcare facilities. Pioneers our BIM parametric agents and automated code compliance models.',
          profileImage: '/assets/team-placeholder.jpg',
          email: 'elena@bimaxisgroup.com',
          skills: ['BIM Parametrics', 'Revit Automation', 'ADA Code Compliance', 'AIA License'],
          qualifications: ['Licensed Architect (AIA)', 'Revit Computational Expert', 'Ph.D. Spatial Informatics'],
          isPublished: true,
          order: 2,
        },
        {
          name: 'Dr. Aris Thorne',
          position: 'Head of Autonomous AI Systems',
          biography: 'Former DeepMind researcher specializing in multi-agent reinforcement learning and computer vision for spatial threat detection and automated physical product design.',
          profileImage: '/assets/team-placeholder.jpg',
          email: 'aris@bimaxisgroup.com',
          skills: ['Deep Learning', 'Computer Vision', 'Multi-Agent RL', 'Edge BMS AI'],
          qualifications: ['Ph.D. Autonomous Robotics', '12+ Patents in Generative CAD'],
          isPublished: true,
          order: 3,
        },
      ]);
      console.log('[Team Seed] Initialized default BIMAXISGroup engineering team members.');
    }
  } catch (err) {
    console.error('[Team Seed Error]', err.message);
  }
};
seedInitialTeam();

// PUBLIC: Get published team members
router.get('/public', async (req, res) => {
  try {
    const members = await TeamMember.find({ isPublished: true }).sort({ order: 1, createdAt: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Get all team members (including drafts)
router.get('/admin/all', requireAdminAuth, async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Create Team Member
router.post('/admin', requireAdminAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, position, biography, email, phone, linkedin, website, skills, qualifications, isPublished } = req.body;

    const newMember = new TeamMember({
      name,
      position,
      biography,
      email: email || '',
      phone: phone || '',
      linkedin: linkedin || '',
      website: website || '',
      skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map(s => s.trim()) : [],
      qualifications: Array.isArray(qualifications) ? qualifications : qualifications ? qualifications.split(',').map(q => q.trim()) : [],
      isPublished: isPublished === 'true' || isPublished === true,
    });

    if (req.files && req.files.image && req.files.image[0]) {
      newMember.profileImage = `/uploads/team/${req.files.image[0].filename}`;
    }

    if (req.files && req.files.pdf && req.files.pdf[0]) {
      newMember.profilePdf = {
        url: `/uploads/team/${req.files.pdf[0].filename}`,
        fileName: req.files.pdf[0].originalname,
        uploadedAt: new Date(),
      };
    }

    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ADMIN: Update Team Member
router.put('/admin/:id', requireAdminAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found.' });

    const { name, position, biography, email, phone, linkedin, website, skills, qualifications, isPublished, removePdf } = req.body;

    if (name) member.name = name;
    if (position) member.position = position;
    if (biography) member.biography = biography;
    if (email !== undefined) member.email = email;
    if (phone !== undefined) member.phone = phone;
    if (linkedin !== undefined) member.linkedin = linkedin;
    if (website !== undefined) member.website = website;

    if (skills !== undefined) {
      member.skills = Array.isArray(skills) ? skills : skills ? skills.split(',').map(s => s.trim()) : [];
    }
    if (qualifications !== undefined) {
      member.qualifications = Array.isArray(qualifications) ? qualifications : qualifications ? qualifications.split(',').map(q => q.trim()) : [];
    }
    if (isPublished !== undefined) {
      member.isPublished = isPublished === 'true' || isPublished === true;
    }

    if (req.files && req.files.image && req.files.image[0]) {
      member.profileImage = `/uploads/team/${req.files.image[0].filename}`;
    }

    if (req.files && req.files.pdf && req.files.pdf[0]) {
      member.profilePdf = {
        url: `/uploads/team/${req.files.pdf[0].filename}`,
        fileName: req.files.pdf[0].originalname,
        uploadedAt: new Date(),
      };
    } else if (removePdf === 'true') {
      member.profilePdf = null;
    }

    await member.save();
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ADMIN: Delete Team Member
router.delete('/admin/:id', requireAdminAuth, async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found.' });
    res.json({ message: 'Team member deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
