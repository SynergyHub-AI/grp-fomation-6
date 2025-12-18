import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Project", 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  // ✅ Reply & Edit Fields
  replyTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Message", 
    default: null 
  },
  isEdited: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

// ⚠️ FIX: Force re-compile model in dev to pick up schema changes
if (process.env.NODE_ENV !== 'production') {
    delete mongoose.models.Message;
}

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);