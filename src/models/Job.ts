import mongoose, { Schema, model, models } from 'mongoose';

const JobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String },
  postedBy: { type: String }, // Clerk User ID
}, { timestamps: true });

const Job = models.Job || model('Job', JobSchema);

export default Job;
