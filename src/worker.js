import { Resend } from 'resend';

export default {
  async fetch(request, env) {
    // CORS headers for preflight requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      // Initialize Resend with API key from environment variables
      const resend = new Resend(env.RESEND_API_KEY);

      // Parse form data
      const data = await request.json();
			const {name, email, subject, message} = data;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        return Response.json(
          { error: 'Missing required fields: name, email, subject, and message' },
          { status: 400, headers: corsHeaders }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return Response.json(
          { error: 'Invalid email format' },
          { status: 400, headers: corsHeaders }
        );
      }

      // Send email using Resend
      const res = await resend.emails.send({
        from: 'website@abdelrahman.co', // Using your domain
        to: 'info@abdelrahman.co', // Your receiving email
        subject: subject, // Use the subject provided by the user
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
        text: `
          New Contact Form Submission

          Name: ${name}
          Email: ${email}
          Subject: ${subject}
          Message: ${message}
        `,
        reply_to: email, // Allow replying directly to the sender
      });

      return Response.json(
        { success: true, message: 'Email sent successfully', id: res.data?.id },
        { headers: corsHeaders }
      );

    } catch (error) {
      console.error('Error sending email:', error);

      return Response.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500, headers: corsHeaders }
      );
    }
  },
};
