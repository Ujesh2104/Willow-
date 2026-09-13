import crypto from 'crypto';
import { DB } from '../data/dbStore.js';

const normalizeEmail = (rawEmail) => {
  const trimmed = (rawEmail || '').trim().toLowerCase();
  const [localPart, domain] = trimmed.split('@');
  if (!localPart || !domain) return trimmed;

  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const cleanLocal = localPart.replace(/\./g, '').split('+')[0];
    return `${cleanLocal}@gmail.com`;
  }
  return trimmed;
};

const generateSecureToken = () => {
  return 'wtoken_' + crypto.randomBytes(24).toString('hex');
};

export const register = (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Full legal name and email address are required.' });
  }

  if (!password || password.length < 4) {
    return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long.' });
  }

  const sanitized = normalizeEmail(email);
  const existing = DB.users.find((u) => u.email === sanitized);

  if (existing) {
    return res.status(400).json({
      success: false,
      message: `An account already exists with ${sanitized}. Please Sign In directly.`
    });
  }

  const token = generateSecureToken();
  const tokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const newSessionId = 'sess_' + Math.random().toString(36).substring(2, 9);

  const newUser = {
    id: 'usr_' + Date.now().toString(36),
    name: name.trim(),
    email: sanitized,
    phone: phone || '+91 98000 00000',
    password: password.trim(),
    role: sanitized === 'admin@willow.com' ? 'admin' : 'fan',
    token,
    tokenExpiresAt,
    currentSessionId: newSessionId,
    savedFans: [
      {
        id: 'fan_' + Date.now(),
        name: name.trim(),
        age: 25,
        gender: 'M',
        idType: 'Aadhaar',
        idNumber: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000)
      }
    ]
  };

  DB.users.push(newUser);

  const { password: _, ...userSafe } = newUser;

  res.status(201).json({
    success: true,
    message: 'Fan registered successfully',
    token,
    user: userSafe
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const sanitized = normalizeEmail(email);
  let user = DB.users.find((u) => u.email === sanitized);

  // Default admin account auto-provision if missing
  if (!user && sanitized === 'admin@willow.com') {
    user = {
      id: 'admin_master_01',
      name: 'Stadium Administrator',
      email: 'admin@willow.com',
      phone: '+91 99999 00000',
      password: 'admin123',
      role: 'admin',
      currentSessionId: 'sess_admin_root',
      savedFans: []
    };
    DB.users.push(user);
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User Not Found: No account is registered with ${sanitized}. Please click "Create Account" below.`
    });
  }

  // Password verification
  if (user.password && password) {
    if (user.password !== password.trim()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials and try again.'
      });
    }
  }

  // Generate fresh token on each login
  const token = generateSecureToken();
  const tokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const newSessionId = 'sess_' + Math.random().toString(36).substring(2, 9);

  user.token = token;
  user.tokenExpiresAt = tokenExpiresAt;
  user.currentSessionId = newSessionId;

  const { password: _, ...userSafe } = user;

  res.json({
    success: true,
    message: 'Authenticated successfully (Single session locked)',
    token,
    user: userSafe
  });
};

export const logout = (req, res) => {
  const { email, token } = req.body;
  const sanitized = email ? normalizeEmail(email) : null;

  let user = null;
  if (sanitized) {
    user = DB.users.find((u) => u.email === sanitized);
  } else if (token) {
    user = DB.users.find((u) => u.token === token);
  }

  if (user) {
    user.token = null;
    user.tokenExpiresAt = 0;
    user.currentSessionId = null;
  }

  res.json({
    success: true,
    message: 'Session terminated and token invalidated successfully.'
  });
};

export const verifyToken = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.body?.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const user = DB.users.find((u) => u.token === token);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token. Please sign in again.' });
  }

  if (user.tokenExpiresAt && Date.now() > user.tokenExpiresAt) {
    user.token = null;
    user.tokenExpiresAt = 0;
    return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
  }

  const { password: _, ...userSafe } = user;

  res.json({
    success: true,
    valid: true,
    user: userSafe
  });
};

export const updateSavedFans = (req, res) => {
  const { email, fans } = req.body;
  const sanitized = normalizeEmail(email);
  const user = DB.users.find((u) => u.email === sanitized);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (fans && fans.length > 4) {
    return res.status(400).json({
      success: false,
      message: 'Maximum 4 attendees allowed in pre-saved master list.'
    });
  }

  user.savedFans = fans;
  res.json({
    success: true,
    message: 'Master fan list updated',
    savedFans: user.savedFans
  });
};
