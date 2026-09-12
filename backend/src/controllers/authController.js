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

export const register = (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Full name and email are required.' });
  }

  const sanitized = normalizeEmail(email);
  const existing = DB.users.find((u) => u.email === sanitized);

  if (existing) {
    return res.status(400).json({
      success: false,
      message: `An account already exists with ${sanitized}. Please Sign In directly.`
    });
  }

  const newSessionId = 'sess_' + Math.random().toString(36).substring(2, 9);
  const newUser = {
    id: 'usr_' + Date.now().toString(36),
    name: name.trim(),
    email: sanitized,
    phone: phone || '+91 98000 00000',
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

  res.status(201).json({
    success: true,
    message: 'Fan registered successfully',
    user: newUser
  });
};

export const login = (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const sanitized = normalizeEmail(email);
  let user = DB.users.find((u) => u.email === sanitized);

  const newSessionId = 'sess_' + Math.random().toString(36).substring(2, 9);

  if (!user) {
    
    user = {
      id: 'usr_' + Math.random().toString(36).substring(2, 7),
      name: sanitized.split('@')[0].toUpperCase() + ' (Fan)',
      email: sanitized,
      phone: '+91 98200 ' + Math.floor(10000 + Math.random() * 90000),
      currentSessionId: newSessionId,
      savedFans: [
        {
          id: 'fan_1',
          name: sanitized.split('@')[0].toUpperCase(),
          age: 26,
          gender: 'M',
          idType: 'Aadhaar',
          idNumber: '•••• •••• 4421'
        }
      ]
    };
    DB.users.push(user);
  } else {
    
    user.currentSessionId = newSessionId;
  }

  res.json({
    success: true,
    message: 'Authenticated successfully (Single session locked)',
    user
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
