const asyncHandler = require('../middleware/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
// const sendEmail = require('../utils/sendEmail'); // Assuming this exists or we'll mock it

exports.submitContact = asyncHandler(async (req, res, next) => {
    const { name, email, subject, message, phone } = req.body;

    if (!name || !email || !message) {
        return next(ApiError.badRequest('Please provide name, email and message'));
    }

    // In a real app, we would save this to DB or send an email
    // For now, we'll log it and mock success
    console.log('Contact Form Submission:', { name, email, subject, message, phone });

    // Example email sending (commented out until configured)
    /*
    await sendEmail({
      email: 'support@travellr.com',
      subject: `New Contact: ${subject}`,
      message: `From: ${name} <${email}>\nPhone: ${phone}\n\n${message}`
    });
    */

    return new ApiResponse(200, null, 'Message sent successfully').send(res);
});

exports.subscribeNewsletter = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(ApiError.badRequest('Email is required'));
    }

    // Check if already subscribed
    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
        return new ApiResponse(200, null, 'Already subscribed').send(res);
    }

    await NewsletterSubscriber.create({ email });

    return new ApiResponse(201, null, 'Subscribed successfully').send(res);
});
