const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending", index: true },
    priority: { type: String, enum: ["high", "medium", "low"], default: "medium", index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
