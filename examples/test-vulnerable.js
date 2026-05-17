// Example file with intentional security vulnerabilities for testing
// DO NOT use this code in production!

// 1. Hardcoded credentials (CRITICAL)
const DATABASE_PASSWORD = "MySecretPassword123!";
const API_KEY = "sk_live_1234567890abcdefghijklmnop";
const AWS_SECRET = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

// 2. SQL Injection vulnerability (CRITICAL)
function getUserById(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return database.query(query);
}

// 3. XSS vulnerability (HIGH)
function displayUserComment(comment) {
  document.getElementById('comments').innerHTML = comment;
}

// 4. Command injection (CRITICAL)
function processFile(filename) {
  const exec = require('child_process').exec;
  exec('cat ' + filename, (error, stdout) => {
    console.log(stdout);
  });
}

// 5. Missing authentication (CRITICAL)
app.get('/admin/users', (req, res) => {
  // No authentication check!
  const users = database.getAllUsers();
  res.json(users);
});

// 6. Weak password validation (HIGH)
function validatePassword(password) {
  return password.length >= 4; // Too weak!
}

// 7. Insecure random for security (HIGH)
function generateToken() {
  return Math.random().toString(36).substring(7);
}

// 8. Sensitive data in logs (MEDIUM)
function loginUser(username, password) {
  console.log('Login attempt:', username, password); // Logging password!
  // ... authentication logic
}

// 9. Missing CSRF protection (HIGH)
app.post('/transfer-money', (req, res) => {
  const { amount, toAccount } = req.body;
  // No CSRF token check!
  transferMoney(amount, toAccount);
});

// 10. Insecure session configuration (HIGH)
app.use(session({
  secret: 'keyboard cat', // Hardcoded secret
  cookie: { secure: false } // Not secure
}));

// 11. Missing input validation (HIGH)
function createUser(userData) {
  // No validation!
  return database.insert('users', userData);
}

// 12. Eval with user input (CRITICAL)
function calculateExpression(expr) {
  return eval(expr); // Never use eval with user input!
}

// 13. Weak encryption (CRITICAL)
const crypto = require('crypto');
function encryptData(data) {
  const cipher = crypto.createCipher('des', 'weak-key'); // DES is broken!
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

// 14. Missing rate limiting (MEDIUM)
app.post('/api/login', (req, res) => {
  // No rate limiting - vulnerable to brute force
  authenticateUser(req.body.username, req.body.password);
});

// 15. Insecure CORS (HIGH)
app.use(cors({
  origin: '*', // Allows all origins
  credentials: true // With credentials!
}));

// 16. Path traversal (HIGH)
function readFile(filename) {
  const fs = require('fs');
  return fs.readFileSync('./uploads/' + filename); // No path validation!
}

// 17. JWT without expiration (HIGH)
function createJWT(userId) {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ userId }, 'secret'); // No expiresIn!
}

// 18. Debug mode in production (MEDIUM)
const DEBUG = true;
if (DEBUG) {
  console.log('Debug mode enabled in production!');
}

// 19. Unencrypted sensitive data (HIGH)
function storeUserData(user) {
  // Storing SSN without encryption
  database.insert('users', {
    name: user.name,
    ssn: user.ssn, // Should be encrypted!
    creditCard: user.creditCard // Should be encrypted!
  });
}

// 20. Missing error handling (MEDIUM)
function processPayment(amount) {
  // No try-catch, errors will expose stack traces
  const result = paymentGateway.charge(amount);
  return result;
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
