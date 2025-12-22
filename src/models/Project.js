import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a project title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  type: {
    type: String, // e.g. 'Startup', 'Hackathon'
    default: 'Personal'
  },
  timeCommitment: {
    type: String, // e.g. 'Part-time', 'Full-time'
    default: 'Flexible'
  },
  teamSize: {
    type: Number,
    default: 1
  },
  techStack: {
    type: [String],
    default: [],
  },
  githubLink: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, // <--- The missing comma was here!

  // ✅ NEW FIELD: Track team members
  team: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, default: 'Member' } // e.g. 'Expert', 'Learner'
    }
  ]
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;