import express from 'express';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bimaxisgroup_admin_jwt_secret_key_2026';

// Seed initial default Admin user if none exists
const seedDefaultAdmin = async () => {
  try {
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      const defaultAdmin = new AdminUser({
        name: 'BIMAXIS Administrator',
        email: 'admin@bimaxisgroup.com',
        password_hash: 'AdminBIMAXIS2026!', // Will be hashed by pre-save hook
      });
      await defaultAdmin.save();
      console.log('[Auth Seed] Created default admin user: admin@bimaxisgroup.com / AdminBIMAXIS2026!');
    }
  } catch (error) {
    console.error('[Auth Seed Error]', error.message);
  }
};
seedDefaultAdmin();

// @route POST /api/admin/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const user = await AdminUser.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    // Sign JWT
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Set httpOnly cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Authentication successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Login failed: ${error.message}` });
  }
});

// @route POST /api/admin/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ message: 'Logged out successfully.' });
});

// @route GET /api/admin/auth/me
router.get('/me', requireAdminAuth, (req, res) => {
  res.json({ user: req.adminUser });
});

export default router;
