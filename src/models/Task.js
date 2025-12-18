import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Project", 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: "" 
  },
  status: { 
    type: String, 
    enum: ["todo", "in-progress", "done"], 
    default: "todo" 
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  // ✅ NEW: Visual Color Tag
  color: {
    type: String, 
    default: "blue" // blue, red, green, yellow, purple
  },
  dueDate: {
    type: Date,
    default: null
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);