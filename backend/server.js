const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Atlas integration
const { createUser, findUserByEmail } = require('./userModel');

// Middleware
app.use(cors());
app.use(express.json());

// Register user endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Check if user already exists
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }
    // Store user (hash password in production!)
    await createUser({ email, password, name, createdAt: new Date() });
    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});
// ...existing code...
async function getFirebaseCerts() {
  const now = Date.now();
  if (cachedCerts && now < certsExpiry) return cachedCerts;
  const url = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch Firebase certs');
  const cacheControl = res.headers.get('cache-control');
  let maxAge = 0;
  if (cacheControl) {
    const m = cacheControl.match(/max-age=(\d+)/);
    if (m) maxAge = parseInt(m[1], 10) * 1000;
  }
  const json = await res.json();
  cachedCerts = json;
  certsExpiry = now + (maxAge || 60 * 60 * 1000); // default 1h
  return cachedCerts;
}

// Middleware to verify Firebase ID token from Authorization: Bearer <token>
async function verifyTokenMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).json({ error: 'Unauthorized: no token' });
  const idToken = match[1];
  try {
    const decodedHeader = jwt.decode(idToken, { complete: true });
    if (!decodedHeader || !decodedHeader.header) throw new Error('Invalid token');
    const kid = decodedHeader.header.kid;
    const certs = await getFirebaseCerts();
    const cert = certs[kid];
    if (!cert) throw new Error('Unknown kid');
    const verifyOptions = { algorithms: ['RS256'] };
    if (FIREBASE_PROJECT_ID) {
      verifyOptions.issuer = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;
      verifyOptions.audience = FIREBASE_PROJECT_ID;
    }
    const decoded = jwt.verify(idToken, cert, verifyOptions);
    req.user = decoded; // contains email, uid, etc.
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
}

// SQLite database for subscriptions
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/data.db', (err) => {
  if (err) {
    console.error('Failed to open database:', err);
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    plan TEXT,
    subscribed_at TEXT
  )`);
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your message - The Realest Tips',
      html: `
        <h2>Thank You, ${name}!</h2>
        <p>We have received your message and will get back to you shortly.</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p>Our team typically responds within 24-48 hours.</p>
        <p>Best regards,<br>The Realest Tips Team</p>
      `
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Record a subscription (database-driven)
app.post('/api/subscription', verifyTokenMiddleware, (req, res) => {
  try {
    const userEmail = req.user && req.user.email;
    const { plan } = req.body;
    if (!userEmail) return res.status(400).json({ error: 'Email not available from token' });
    const subscribed_at = new Date().toISOString();
    const sql = `INSERT OR REPLACE INTO subscriptions (email, plan, subscribed_at) VALUES (?, ?, ?)`;
    db.run(sql, [userEmail, plan || 'VVIP', subscribed_at], function(err) {
      if (err) {
        console.error('DB insert error:', err);
        return res.status(500).json({ error: 'Failed to save subscription' });
      }
      return res.status(200).json({ success: true, email: userEmail, plan: plan || 'VVIP', subscribed_at });
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check subscription by email
app.get('/api/subscription', verifyTokenMiddleware, (req, res) => {
  const userEmail = req.user && req.user.email;
  if (!userEmail) return res.status(400).json({ error: 'Email not available from token' });
  db.get('SELECT * FROM subscriptions WHERE email = ?', [userEmail], (err, row) => {
    if (err) {
      console.error('DB select error:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    if (row) {
      return res.status(200).json({ subscribed: true, subscription: row });
    }
    return res.status(200).json({ subscribed: false });
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
