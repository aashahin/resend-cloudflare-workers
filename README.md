# Resend Service with Cloudflare Workers

A simple email service using Resend and Cloudflare Workers for handling contact forms.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or if using bun
bun install
```

### 2. Configure Resend

1. Sign up for a [Resend account](https://resend.com)
2. Get your API key from the Resend dashboard
3. Verify your domain in Resend (required for production)

### 3. Set Environment Variables

For development, create a `.dev.vars` file in the root directory:

```bash
# .dev.vars
RESEND_API_KEY=your_resend_api_key_here
```

For production, use Wrangler to set secrets:

```bash
wrangler secret put RESEND_API_KEY
# Enter your API key when prompted
```

### 4. Update Configuration

Edit `src/worker.js` and update these values:

- `from: 'noreply@yourdomain.com'` - Replace with your verified domain
- `to: 'your-email@example.com'` - Replace with your receiving email

### 5. Development

```bash
npm run dev
# or
bun run dev
```

This will start the development server at `http://localhost:8787`

### 6. Testing

Open `test.html` in your browser to test the contact form locally.

### 7. Deployment

```bash
npm run deploy
# or
bun run deploy
```

## API Endpoint

### POST /

Send a contact form email.

**Request Format:** `multipart/form-data`

**Required Fields:**

- `name` (string): Sender's name
- `email` (string): Sender's email address
- `subject` (string): Email subject line
- `message` (string): Message content

**Response:**

```json
{
	"success": true,
	"message": "Email sent successfully",
	"id": "email_id"
}
```

**Error Response:**

```json
{
	"error": "Error message"
}
```

## Features

- ✅ CORS support for cross-origin requests
- ✅ Input validation (required fields, email format)
- ✅ Error handling and proper HTTP status codes
- ✅ HTML and text email formats
- ✅ Reply-to functionality
- ✅ Security best practices

## Important Notes

1. **Domain Verification**: In production, you must use a verified domain in the `from` field
2. **Rate Limiting**: Consider implementing rate limiting for production use
3. **Spam Protection**: Add captcha or other spam protection mechanisms
4. **Environment Variables**: Never commit API keys to version control

## Troubleshooting

### Common Issues

1. **"Domain not verified" error**: Make sure your domain is verified in Resend
2. **CORS errors**: The worker includes CORS headers, but make sure your frontend domain is allowed
3. **API key not found**: Ensure you've set the `RESEND_API_KEY` environment variable

### Debugging

Check the Cloudflare Workers logs in your dashboard for detailed error messages.
