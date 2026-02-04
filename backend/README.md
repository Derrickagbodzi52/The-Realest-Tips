# The Realest Tips - Backend Setup Guide

## Backend Email Configuration

The backend server handles contact form email submissions using Node.js and Nodemailer.

### Installation

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` and add your email credentials

### Gmail Setup (Recommended)

To use Gmail for sending emails:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
3. **In your `.env` file, set:**
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=iiet obcy moaz dobo
   ADMIN_EMAIL=admin@therealestips.com
   ```

### Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

### Testing

To verify the backend is running:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status": "Server is running"}
```

### How It Works

1. User submits the contact form on `/contact-us.html`
2. Form sends a POST request to `http://localhost:5000/api/contact`
3. Backend validates the input
4. Sends two emails:
   - **Admin email:** Full contact details to your admin email
   - **User confirmation:** Acknowledgment email to the user
5. Returns success/error response to the frontend

### Customization

- **Change email service:** Update `EMAIL_SERVICE` in `.env` (supports Gmail, Outlook, custom SMTP, etc.)
- **Custom email templates:** Edit the HTML in `server.js` (lines for `adminMailOptions` and `userMailOptions`)
- **Change port:** Set `PORT=3000` (or any port) in `.env`

### Troubleshooting

- **"Failed to send email":** Check your `.env` credentials
- **"Connection error":** Ensure backend server is running on the correct port
- **Gmail auth failed:** Verify you're using an App Password, not your regular Gmail password

### Deploy to Production

For production deployment, consider:
- **Heroku:** `git push heroku main`
- **Railway.app:** Connect your GitHub repo
- **AWS/DigitalOcean:** Use Node.js deployment guides
- Remember to set environment variables in your hosting platform's dashboard
