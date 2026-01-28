const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema(
  {
    payout: { type: mongoose.Schema.Types.ObjectId, ref: 'Payout' },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String },
    amount: { type: Number },
    balanceAfter: { type: Number },
    metadata: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PayoutLedger', ledgerSchema);
