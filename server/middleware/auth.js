import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bimaxisgroup_admin_jwt_secret_key_2026';

export const requireAdminAuth = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header or httpOnly cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized. Admin authentication token required.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await AdminUser.findById(decoded.id).select('-password_hash');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized. Admin user account not found.' });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized. Invalid or expired authentication token.' });
  }
};
