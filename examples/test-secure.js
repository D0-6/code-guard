// Example file with secure coding practices
// This is how the vulnerable code should be fixed

require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');

// 1. Use environment variables for secrets
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const API_KEY = process.env.API_KEY;
const AWS_SECRET = process.env.AWS_SECRET_ACCESS_KEY;

/**
 * Safely retrieves user by ID using parameterized query
 * @param {string} userId - User ID to fetch
 * @returns {Promise<Object>} User object
 */
async function getUserById(userId) {
  // Validate input
  if (!validator.isUUID(userId)) {
    throw new Error('Invalid user ID format');
  }
  
  // Use parameterized query to prevent SQL injection
  const query = "SELECT * FROM users WHERE id = ?";
  return database.query(query, [userId]);
}

/**
 * Safely displays user comment with XSS protection
 * @param {string} comment - User comment to display
 */
function displayUserComment(comment) {
  // Sanitize HTML to prevent XSS
  const DOMPurify = require('dompurify');
  const clean = DOMPurify.sanitize(comment);
  document.getElementById('comments').textContent = clean;
}

/**
 * Safely processes file with path validation
 * @param {string} filename - Filename to process
 * @returns {Promise<string>} File contents
 */
async function processFile(filename) {
  const path = require('path');
  const fs = require('fs').promises;
  
  // Validate filename - no path traversal
  const safeName = path.basename(filename);
  const safePath = path.join(__dirname, 'uploads', safeName);
  
  // Ensure file is within allowed directory
  if (!safePath.startsWith(path.join(__dirname, 'uploads'))) {
    throw new Error('Invalid file path');
  }
  
  return fs.readFile(safePath, 'utf8');
}

/**
 * Authentication middleware
 */
function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

/**
 * Admin authorization middleware
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Protected admin route with authentication
app.get('/admin/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await database.getAllUsers();
    res.json(users);
  } catch (error) {
    logger.error('Error fetching users', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if password is strong enough
 */
function validatePassword(password) {
  // Minimum 12 characters, must include uppercase, lowercase, number, and special char
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && 
         hasUpperCase && 
         hasLowerCase && 
         hasNumbers && 
         hasSpecialChar;
}

/**
 * Generates cryptographically secure token
 * @returns {string} Secure random token
 */
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Logs user login attempt securely
 * @param {string} username - Username attempting login
 * @param {boolean} success - Whether login succeeded
 */
function loginUser(username, success) {
  // Never log passwords!
  logger.info('Login attempt', {
    username,
    success,
    timestamp: new Date().toISOString(),
    ip: req.ip
  });
}

// CSRF protection middleware
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// Protected money transfer with CSRF
app.post('/transfer-money', csrfProtection, requireAuth, async (req, res) => {
  try {
    const { amount, toAccount } = req.body;
    
    // Validate inputs
    if (!validator.isNumeric(amount.toString()) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    if (!validator.isUUID(toAccount)) {
      return res.status(400).json({ error: 'Invalid account ID' });
    }
    
    await transferMoney(amount, toAccount);
    res.json({ success: true });
  } catch (error) {
    logger.error('Transfer failed', { error: error.message });
    res.status(500).json({ error: 'Transfer failed' });
  }
});

// Secure session configuration
app.use(session({
  secret: process.env.SESSION_SECRET, // From environment
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // Prevent XSS
    maxAge: 3600000, // 1 hour
    sameSite: 'strict' // CSRF protection
  }
}));

/**
 * Creates user with input validation
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user
 */
async function createUser(userData) {
  // Validate all inputs
  if (!validator.isEmail(userData.email)) {
    throw new Error('Invalid email');
  }
  
  if (!validatePassword(userData.password)) {
    throw new Error('Password does not meet requirements');
  }
  
  if (!validator.isAlphanumeric(userData.username)) {
    throw new Error('Invalid username');
  }
  
  // Hash password before storing
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  const sanitizedData = {
    email: validator.normalizeEmail(userData.email),
    username: validator.escape(userData.username),
    password: hashedPassword
  };
  
  return database.insert('users', sanitizedData);
}

/**
 * Safely evaluates mathematical expression
 * @param {string} expr - Expression to evaluate
 * @returns {number} Result
 */
function calculateExpression(expr) {
  // Never use eval! Use a safe math parser instead
  const math = require('mathjs');
  
  try {
    // mathjs safely parses and evaluates math expressions
    return math.evaluate(expr);
  } catch (error) {
    throw new Error('Invalid expression');
  }
}

/**
 * Encrypts data using strong encryption
 * @param {string} data - Data to encrypt
 * @returns {string} Encrypted data
 */
function encryptData(data) {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return JSON.stringify({
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  });
}

// Rate limiting for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const result = await authenticateUser(
      req.body.username,
      req.body.password
    );
    res.json(result);
  } catch (error) {
    logger.warn('Login failed', { username: req.body.username });
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Secure CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','), // Specific origins only
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security headers
app.use(helmet());

/**
 * Safely reads file with path validation
 * @param {string} filename - Filename to read
 * @returns {Promise<string>} File contents
 */
async function readFile(filename) {
  const path = require('path');
  const fs = require('fs').promises;
  
  // Validate and sanitize path
  const safeName = path.basename(filename);
  const safePath = path.resolve('./uploads', safeName);
  const uploadsDir = path.resolve('./uploads');
  
  // Prevent path traversal
  if (!safePath.startsWith(uploadsDir)) {
    throw new Error('Invalid file path');
  }
  
  return fs.readFile(safePath, 'utf8');
}

/**
 * Creates JWT with expiration
 * @param {string} userId - User ID for token
 * @returns {string} JWT token
 */
function createJWT(userId) {
  const jwt = require('jsonwebtoken');
  
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h', // Token expires in 1 hour
      issuer: 'your-app',
      audience: 'your-app-users'
    }
  );
}

// Environment-based configuration
const DEBUG = process.env.NODE_ENV !== 'production';

if (DEBUG) {
  console.log('Running in development mode');
} else {
  console.log('Running in production mode');
}

/**
 * Stores user data with encryption
 * @param {Object} user - User data to store
 * @returns {Promise<Object>} Stored user
 */
async function storeUserData(user) {
  // Encrypt sensitive data
  const encryptedSSN = encryptData(user.ssn);
  const encryptedCreditCard = encryptData(user.creditCard);
  
  return database.insert('users', {
    name: user.name,
    ssn: encryptedSSN,
    creditCard: encryptedCreditCard,
    encryptedAt: new Date().toISOString()
  });
}

/**
 * Processes payment with error handling
 * @param {number} amount - Payment amount
 * @returns {Promise<Object>} Payment result
 */
async function processPayment(amount) {
  try {
    // Validate amount
    if (!validator.isNumeric(amount.toString()) || amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    
    const result = await paymentGateway.charge(amount);
    
    // Log success (without sensitive data)
    logger.info('Payment processed', {
      amount,
      transactionId: result.id,
      timestamp: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    // Log error without exposing stack trace to user
    logger.error('Payment processing failed', {
      error: error.message,
      amount
    });
    
    throw new Error('Payment processing failed');
  }
}

module.exports = {
  getUserById,
  displayUserComment,
  processFile,
  validatePassword,
  generateToken,
  loginUser,
  createUser,
  calculateExpression,
  encryptData,
  readFile,
  createJWT,
  storeUserData,
  processPayment
};

// Made with Bob
