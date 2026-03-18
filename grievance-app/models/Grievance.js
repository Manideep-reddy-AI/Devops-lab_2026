const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Roads & Infrastructure', 'Water Supply', 'Electricity', 'Sanitation', 'Public Safety', 'Education', 'Health Services', 'Other'],
    required: true
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'Under Review', 'In Progress', 'Resolved', 'Rejected', 'Closed'], default: 'Pending' },
  location: { type: String, required: true },
  attachment: { type: String, default: '' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  remarks: [
    {
      text: { type: String },
      addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  resolvedAt: { type: Date, default: null }
}, { timestamps: true });

grievanceSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const count = await mongoose.model('Grievance').countDocuments();
    this.ticketId = 'GRV-' + String(count + 1).padStart(5, '0');
  }
  next();
});

module.exports = mongoose.model('Grievance', grievanceSchema);
