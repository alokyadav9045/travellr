const nodemailer = require('nodemailer');
const env = require('../config/env');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    if (env.email?.service === 'sendgrid' || env.EMAIL_SERVICE === 'sendgrid') {
      // SendGrid configuration
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
    } else {
      // SMTP configuration
      return nodemailer.createTransport({
        host: env.email?.host || process.env.EMAIL_HOST,
        port: env.email?.port || parseInt(process.env.EMAIL_PORT, 10) || 587,
        secure: (env.email?.port || 587) === 465,
        auth: {
          user: env.email?.user || process.env.EMAIL_USER,
          pass: env.email?.pass || process.env.EMAIL_PASS
        }
      });
    }
  }

  async sendEmail({ to, subject, html, text, attachments = [] }) {
    try {
      const mailOptions = {
        from: `${env.email?.fromName || 'Travellr'} <${env.email?.from || 'noreply@travellr.com'}>`,
        to,
        subject,
        html,
        text,
        attachments
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FF6B35; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #FF6B35; 
                      color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Travellr!</h1>
            </div>
            <div class="content">
              <p>Hi ${user.name},</p>
              <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Travellr. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      html
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FF6B35; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #FF6B35; 
                      color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset</h1>
            </div>
            <div class="content">
              <p>Hi ${user.name},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Travellr. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      html
    });
  }

  async sendBookingConfirmation(booking, customer, trip) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FF6B35; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .button { display: inline-block; padding: 12px 30px; background: #FF6B35; 
                      color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${customer.name},</p>
              <p>Great news! Your booking has been confirmed. Here are the details:</p>
              <div class="booking-details">
                <h2>${trip.title}</h2>
                <div class="detail-row">
                  <span>Booking Number:</span>
                  <strong>${booking.bookingNumber}</strong>
                </div>
                <div class="detail-row">
                  <span>Departure Date:</span>
                  <strong>${new Date(booking.departure.startDate).toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}</strong>
                </div>
                <div class="detail-row">
                  <span>Duration:</span>
                  <strong>${trip.duration.days} days, ${trip.duration.nights} nights</strong>
                </div>
                <div class="detail-row">
                  <span>Guests:</span>
                  <strong>${booking.totalGuests} person(s)</strong>
                </div>
                <div class="detail-row">
                  <span>Total Amount:</span>
                  <strong>$${booking.pricing.totalAmount.toFixed(2)}</strong>
                </div>
              </div>
              <p style="text-align: center;">
                <a href="${env.CLIENT_URL}/bookings/${booking._id}" class="button">View Booking Details</a>
              </p>
              <p>We'll send you a reminder before your trip starts. If you have any questions, feel free to contact the vendor or our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Travellr. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: customer.email,
      subject: `Booking Confirmed - ${trip.title}`,
      html
    });
  }

  async sendTripReminder(booking, customer, trip, daysUntil) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FF6B35; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #FF6B35; 
                      color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Trip Starts in ${daysUntil} Days!</h1>
            </div>
            <div class="content">
              <p>Hi ${customer.name},</p>
              <p>This is a friendly reminder that your trip <strong>${trip.title}</strong> starts in ${daysUntil} days!</p>
              <p><strong>Departure Date:</strong> ${new Date(booking.departure.startDate).toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}</p>
              <p>Make sure you have all the necessary documents and preparations ready.</p>
              <p style="text-align: center;">
                <a href="${env.CLIENT_URL}/bookings/${booking._id}" class="button">View Trip Details</a>
              </p>
              <p>Have a wonderful journey!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Travellr. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: customer.email,
      subject: `Reminder: Your trip starts in ${daysUntil} days!`,
      html
    });
  }

  async sendVendorPayoutNotification(vendor, payout) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00B894; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .amount { font-size: 36px; font-weight: bold; color: #00B894; text-align: center; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payout Processed!</h1>
            </div>
            <div class="content">
              <p>Hi ${vendor.businessName},</p>
              <p>Great news! Your payout has been processed successfully.</p>
              <div class="amount">$${payout.amount.toFixed(2)}</div>
              <p style="text-align: center;">The funds should arrive in your account within 2-3 business days.</p>
              <p><strong>Payout Period:</strong> ${new Date(payout.periodStart).toLocaleDateString()} - ${new Date(payout.periodEnd).toLocaleDateString()}</p>
              <p><strong>Number of Bookings:</strong> ${payout.bookings.length}</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Travellr. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: vendor.contactEmail,
      subject: 'Your Payout Has Been Processed',
      html
    });
  }
}

module.exports = new EmailService();
