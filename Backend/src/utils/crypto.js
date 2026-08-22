const crypto = require('crypto');

/**
 * Generate a cryptographically secure random string (hex format).
 * @param {number} bytes - Number of random bytes (default 32)
 * @returns {string}
 */
const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hash a plain string token using SHA-256 algorithm.
 * @param {string} token 
 * @returns {string} Hashed hex string
 */
const hashToken = (token) => {
  if (!token) return null;
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateRandomToken,
  hashToken,
};
