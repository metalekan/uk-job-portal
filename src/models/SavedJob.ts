import { Schema, model, models } from 'mongoose';

const SavedJobSchema = new Schema({
  userId: { type: String, required: true },
  jobId: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  redirect_url: { type: String, required: true },
  salary_min: { type: Number },
  salary_max: { type: Number },
  contract_type: { type: String },
  created: { type: String }, // Keep original Adzuna creation date string if needed
}, { timestamps: true });

// Ensure a user can only save a specific job once
SavedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const SavedJob = models.SavedJob || model('SavedJob', SavedJobSchema);

export default SavedJob;
