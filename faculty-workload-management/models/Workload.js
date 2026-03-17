const mongoose = require("mongoose");

const WORKLOAD_TYPES = ["Teaching", "Research", "Administrative", "Other"];

const workloadSchema = new mongoose.Schema(
  {
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    facultyName: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true, index: true },
    course: { type: String, required: true, trim: true, index: true },
    workloadType: { type: String, required: true, enum: WORKLOAD_TYPES, index: true },
    hours: { type: Number, required: true, min: 0 },
    semester: { type: String, required: true, trim: true, index: true },
    academicYear: { type: String, required: true, trim: true, index: true }
  },
  { timestamps: true }
);

workloadSchema.index({ department: 1, workloadType: 1 });

module.exports = mongoose.model("Workload", workloadSchema);
module.exports.WORKLOAD_TYPES = WORKLOAD_TYPES;

