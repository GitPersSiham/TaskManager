import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  category: { type: String }, // Exemple : "Travail", "Maison"
  status: {
    type: String,
    enum: ['à faire', 'en cours', 'terminée'],
    default: 'à faire'
  },
  subtasks: [SubtaskSchema],
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);