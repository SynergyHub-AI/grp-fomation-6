import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // Password is not required for Google Login
  password: { type: String, required: false },

  // Profile Fields
  avatarUrl: { type: String }, // Custom uploads
  image: { type: String },     // Google Auth often uses 'image'

  jobTitle: { type: String, default: "" },
  bio: { type: String, default: "" },

  // ✅ Added for Search Functionality
  skills: { type: [String], default: [] },

  // Social Links
  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" }
  },

  // Preferences
  preferences: {
    projectInvites: { type: Boolean, default: true },
    newMatches: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },

  // Logic Flag
  hasCompletedOnboarding: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  // OTP Fields
  resetOtp: String,
  resetOtpExpire: Date,
}, { timestamps: true });

// Prevent model overwrite error in development
export default mongoose.models.User || mongoose.model("User", UserSchema);