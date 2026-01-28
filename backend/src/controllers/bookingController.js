const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const PromoCode = require('../models/PromoCode');
const ApiError = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const paymentService = require('../services/paymentService');
const notificationService = require('../services/notificationService');
const emailService = require('../services/emailService');

// @desc    Create booking
// @route   POST /api/v1/bookings
// @access  Private
exports.create = async (req, res) => {
  const { trip: tripId, numberOfGuests, selectedDate, guestDetails, paymentMethod, promoCode } = req.body;

  // Get trip details
  const trip = await Trip.findById(tripId).populate('vendor');
  if (!trip) {
    throw new ApiError(404, 'Trip not found');
  }

  // Check availability
  if (!trip.isAvailable(selectedDate, numberOfGuests)) {
    throw new ApiError(400, 'Trip not available for selected date and number of guests');
  }

  // Calculate pricing
  const basePrice = trip.price * numberOfGuests;
  let discount = 0;
  let appliedPromoCode = null;

  // Apply promo code if provided
  if (promoCode) {
    const promo = await PromoCode.findOne({ code: promoCode.toUpperCase() });

    if (promo) {
      // Validate promo code
      const validation = promo.isValid(basePrice, req.user.id, trip.vendor._id);

      if (!validation.valid) {
        throw new ApiError(400, validation.message);
      }

      // Calculate discount
      discount = promo.calculateDiscount(basePrice);
      appliedPromoCode = promo;
    } else {
      throw new ApiError(404, 'Invalid promo code');
    }
  }

  const platformFee = basePrice * 0.10; // 10% platform fee
  const totalPrice = basePrice + platformFee - discount;
  const vendorAmount = basePrice * (1 - trip.vendor.commissionRate / 100);

  // Create payment intent only for card payments
  let paymentIntent = { id: 'pi_mock_' + Date.now(), client_secret: 'mock_secret' };

  if (paymentMethod === 'card') {
    try {
      paymentIntent = await paymentService.createPaymentIntent({
        amount: totalPrice,
        currency: trip.currency,
        customerId: req.user.stripeCustomerId,
      });
    } catch (error) {
      console.warn('Stripe payment intent creation failed, using mock for dev:', error.message);
      // Fallback for dev mode without valid keys
      if (process.env.NODE_ENV === 'development') {
        paymentIntent = { id: 'pi_mock_fallback_' + Date.now(), client_secret: 'mock_secret' };
      } else {
        throw error;
      }
    }
  }

  // Create booking
  const booking = await Booking.create({
    trip: tripId,
    user: req.user.id,
    vendor: trip.vendor._id,
    selectedDate: new Date(selectedDate),
    numberOfGuests,
    guestDetails,
    basePrice,
    platformFee,
    discount,
    totalPrice,
    vendorAmount,
    paymentIntentId: paymentIntent.id,
    paymentMethod,
    appliedPromoCode: appliedPromoCode?._id,
  });

  // Record promo code usage if applied
  if (appliedPromoCode) {
    await appliedPromoCode.recordUsage(req.user.id, booking._id, discount);
  }

  // Send notifications
  await notificationService.notifyBookingCreated(booking);
  await emailService.sendBookingConfirmation(req.user.email, booking);

  res.status(201).json(
    new ApiResponse(201, { booking, clientSecret: paymentIntent.client_secret }, 'Booking created successfully')
  );
};

// @desc    Get booking by ID
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.get = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('trip')
    .populate('vendor', 'businessName')
    .populate('user', 'name email');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Check authorization
  if (
    booking.user._id.toString() !== req.user.id.toString() &&
    booking.vendor._id.toString() !== req.user.id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError(403, 'Not authorized to view this booking');
  }

  res.json(new ApiResponse(200, booking));
};

// @desc    Get user bookings
// @route   GET /api/v1/bookings/my-bookings
// @access  Private
exports.listForUser = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const filter = { user: req.user.id };
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .populate('trip', 'title slug images price')
    .populate('vendor', 'businessName')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Booking.countDocuments(filter);

  res.json(
    new ApiResponse(200, {
      bookings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    })
  );
};

// @desc    Update booking
// @route   PATCH /api/v1/bookings/:id
// @access  Private
exports.update = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Check authorization
  if (booking.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to update this booking');
  }

  const { status, specialRequests } = req.body;

  if (status) booking.status = status;
  if (specialRequests) booking.guestDetails.specialRequests = specialRequests;

  await booking.save();

  res.json(new ApiResponse(200, booking, 'Booking updated successfully'));
};

// @desc    Cancel booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.cancel = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('trip');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Check authorization
  if (booking.user.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'Not authorized to cancel this booking');
  }

  if (booking.status === 'cancelled') {
    throw new ApiError(400, 'Booking already cancelled');
  }

  if (booking.status === 'completed') {
    throw new ApiError(400, 'Cannot cancel completed booking');
  }

  // Check cancellation policy
  const daysUntilTrip = Math.ceil((new Date(booking.selectedDate) - new Date()) / (1000 * 60 * 60 * 24));
  const cancellationPolicy = booking.trip.cancellationPolicy;
  let refundPercentage = 0;

  if (daysUntilTrip >= cancellationPolicy.fullRefundDays) {
    refundPercentage = 100;
  } else if (daysUntilTrip >= cancellationPolicy.partialRefundDays) {
    refundPercentage = cancellationPolicy.partialRefundPercentage;
  }

  booking.status = 'cancelled';
  booking.cancellationDate = new Date();
  booking.refundAmount = (booking.totalPrice * refundPercentage) / 100;
  booking.refundStatus = refundPercentage > 0 ? 'pending' : 'not_applicable';

  await booking.save();

  // Process refund if applicable
  if (refundPercentage > 0 && booking.paymentStatus === 'completed') {
    await paymentService.processRefund({
      paymentIntentId: booking.paymentIntentId,
      amount: booking.refundAmount,
    });
    booking.refundStatus = 'processed';
    await booking.save();
  }

  res.json(new ApiResponse(200, booking, 'Booking cancelled successfully'));
};

// @desc    Confirm payment
// @route   POST /api/v1/bookings/:id/confirm-payment
// @access  Private
exports.confirmPayment = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.user.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  if (booking.paymentStatus === 'completed') {
    throw new ApiError(400, 'Payment already completed');
  }

  // Confirm payment with Stripe
  const payment = await paymentService.confirmPayment(booking.paymentIntentId);

  if (payment.status === 'succeeded') {
    booking.paymentStatus = 'completed';
    booking.status = 'confirmed';
    await booking.save();

    // Send notifications
    await emailService.sendBookingConfirmation(req.user.email, booking);
    await notificationService.notifyBookingConfirmed(booking);
  }

  res.json(new ApiResponse(200, booking, 'Payment confirmed successfully'));
};

// @desc    Request refund
// @route   POST /api/v1/bookings/:id/request-refund
// @access  Private
exports.requestRefund = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.user.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  if (booking.refundStatus !== 'none') {
    throw new ApiError(400, 'Refund already requested or processed');
  }

  booking.refundStatus = 'requested';
  await booking.save();

  res.json(new ApiResponse(200, booking, 'Refund requested successfully'));
};

// @desc    Calculate booking price
// @route   POST /api/v1/bookings/calculate
// @access  Private
exports.calculatePrice = async (req, res, next) => {
  const { tripId, departureId, guests, addOns, promoCode } = req.body;

  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new ApiError(404, 'Trip not found');
  }

  // Calculate base price
  const basePrice = trip.price * guests;
  let discount = 0;
  let addOnsTotal = 0;

  // Calculate add-ons
  if (addOns && Array.isArray(addOns)) {
    for (const item of addOns) {
      addOnsTotal += item.price * item.quantity;
    }
  }

  // Apply promo code if provided
  if (promoCode) {
    const promo = await PromoCode.findOne({ code: promoCode.toUpperCase() });
    if (promo && promo.isValid(basePrice, req.user?.id, trip.vendor)) {
      discount = promo.calculateDiscount(basePrice);
    }
  }

  const serviceFee = (basePrice + addOnsTotal) * 0.10;
  const totalAmount = basePrice + addOnsTotal + serviceFee - discount;

  res.json(new ApiResponse(200, {
    subtotal: basePrice,
    addOnsTotal,
    serviceFee,
    discount,
    totalAmount
  }, 'Price calculated successfully'));
};

// @desc    Download booking invoice
// @route   GET /api/v1/bookings/:id/invoice
// @access  Private
exports.downloadInvoice = async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('trip')
    .populate('user')
    .populate('vendor');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  // Generate PDF invoice (using a library like pdfkit or puppeteer)
  const invoiceContent = `
    INVOICE
    ==============================
    Booking ID: ${booking._id}
    Trip: ${booking.trip.title}
    Customer: ${booking.user.name}
    Vendor: ${booking.vendor.businessName}
    
    Date: ${booking.createdAt.toLocaleDateString()}
    Trip Date: ${booking.selectedDate.toLocaleDateString()}
    Guests: ${booking.numberOfGuests}
    
    Subtotal: $${booking.basePrice}
    Service Fee: $${booking.platformFee}
    Discount: -$${booking.discount}
    -----
    Total: $${booking.totalPrice}
    ==============================
  `;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${booking._id}.txt`);
  res.send(invoiceContent);
};

// @desc    Send message on booking
// @route   POST /api/v1/bookings/:id/message
// @access  Private
exports.sendMessage = async (req, res, next) => {
  const { message } = req.body;
  const bookingId = req.params.id;

  if (!message) {
    throw new ApiError(400, 'Message is required');
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Check authorization
  if (booking.user.toString() !== req.user.id && booking.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  // Create message (assuming you have a Message model)
  const Message = require('../models/Message');
  const newMessage = await Message.create({
    booking: bookingId,
    sender: req.user.id,
    message,
    attachments: req.files ? req.files.map(f => f.path) : []
  });

  // Notify the other party
  await notificationService.notifyNewMessage(booking, newMessage);

  res.status(201).json(new ApiResponse(201, newMessage, 'Message sent successfully'));
};

// @desc    Get booking messages
// @route   GET /api/v1/bookings/:id/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  const bookingId = req.params.id;
  const { page = 1, limit = 20 } = req.query;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Check authorization
  if (booking.user.toString() !== req.user.id && booking.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  const Message = require('../models/Message');
  const messages = await Message.find({ booking: bookingId })
    .populate('sender', 'name email avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Message.countDocuments({ booking: bookingId });

  res.json(new ApiResponse(200, {
    messages,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    }
  }, 'Messages retrieved successfully'));
};
