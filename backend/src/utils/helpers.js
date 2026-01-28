const crypto = require('crypto');
const slugify = require('slugify');
const { differenceInDays, format, parseISO, isAfter, isBefore } = require('date-fns');

const generateSlug = (text, uniqueId = '') => {
  const baseSlug = slugify(text || '', {
    lower: true,
    strict: true,
    trim: true,
  });
  const suffix = uniqueId || crypto.randomBytes(4).toString('hex');
  return `${baseSlug}-${suffix}`;
};

const generateRandomString = (length = 32) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[randomBytes[i] % 10];
  }
  return otp;
};

const generateTransactionId = (prefix = 'TXN') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const calculateCommission = (amount, rate) => {
  return Math.round(amount * (rate / 100) * 100) / 100;
};

const calculateVendorPayout = (bookingAmount, commissionRate, holdbackRate = 0) => {
  const commission = calculateCommission(bookingAmount, commissionRate);
  const holdback = calculateCommission(bookingAmount, holdbackRate);
  const vendorNet = bookingAmount - commission - holdback;

  return {
    totalAmount: bookingAmount,
    platformCommission: commission,
    holdbackAmount: holdback,
    vendorNet: Math.round(vendorNet * 100) / 100,
  };
};

const calculateRefundAmount = (bookingAmount, policy, tripStartDate) => {
  const daysUntilTrip = differenceInDays(new Date(tripStartDate), new Date());

  const rule = policy.rules.find((r) => daysUntilTrip >= r.daysBeforeStart);

  if (!rule) {
    return 0;
  }

  const refundPercentage = rule.refundPercentage;
  return Math.round(bookingAmount * (refundPercentage / 100) * 100) / 100;
};

const paginate = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
};

const paginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};

const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

const daysBetween = (date1, date2) => {
  return Math.abs(differenceInDays(new Date(date1), new Date(date2)));
};

const isPastDate = (date) => {
  return isBefore(new Date(date), new Date());
};

const isFutureDate = (date) => {
  return isAfter(new Date(date), new Date());
};

const cleanObject = (obj, options = {}) => {
  const { removeEmpty = true, removeNull = true, removeUndefined = true } = options;

  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => {
      if (removeUndefined && v === undefined) return false;
      if (removeNull && v === null) return false;
      if (removeEmpty && v === '') return false;
      return true;
    })
  );
};

module.exports = {
  generateSlug,
  generateRandomString,
  generateOTP,
  generateTransactionId,
  calculateCommission,
  calculateVendorPayout,
  calculateRefundAmount,
  paginate,
  paginationMeta,
  formatCurrency,
  formatDate,
  daysBetween,
  isPastDate,
  isFutureDate,
  cleanObject,
};
