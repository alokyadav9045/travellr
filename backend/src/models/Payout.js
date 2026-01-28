const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['hold', 'ready', 'processing', 'paid', 'failed', 'cancelled'], default: 'hold' },
    method: { type: String },
    externalId: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payout', payoutSchema);
