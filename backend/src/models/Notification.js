const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String },
    title: { type: String },
    body: { type: String },
    payload: { type: Object },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
