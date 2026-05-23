// backend/middleware/rbac.js
// Role‑Based Access Control middleware
// Checks JWT payload for user role and verifies required permission for the route.

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Load public key for RS256 verification (generated elsewhere)
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '..', 'config', 'jwt.pub'), 'utf8');

// Permission matrix – map role -> allowed actions
const permissionMatrix = {
  parent: [
    'view:children',
    'create:application',
    'upload:documents',
    'view:status',
    'schedule:meetings'
  ],
  orphanage_admin: [
    'manage:orphanage',
    'manage:children',
    'review:applications',
    'upload:documents'
  ],
  super_admin: [
    'manage:all',
    'configure:rbac',
    'view:audit_logs'
  ],
  counsellor: [
    'view:assigned_sessions',
    'create:session_notes'
  ],
  verification_officer: [
    'view:pending_documents',
    'approve:documents',
    'reject:documents'
  ],
  legal_officer: [
    'view:legal_cases',
    'sign:documents'
  ]
};

/**
 * rbac(permission) – Express middleware generator.
 * @param {string} requiredPermission – e.g. "view:children" or "manage:orphanage".
 */
function rbac(requiredPermission) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
      // Attach user info to request for downstream handlers
      req.user = {
        id: payload.sub,
        role: payload.role,
        email: payload.email
      };
      const role = payload.role;
      const allowed = permissionMatrix[role] || [];
      if (allowed.includes(requiredPermission) || role === 'super_admin') {
        return next();
      }
      return res.status(403).json({ message: 'Forbidden – insufficient permissions' });
    } catch (err) {
      console.error('RBAC verification error:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

module.exports = { rbac };
