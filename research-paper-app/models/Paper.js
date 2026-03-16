const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [200, 'Author name cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Artificial Intelligence',
      'Machine Learning',
      'Computer Networks',
      'Cybersecurity',
      'Data Science',
      'Software Engineering',
      'Computer Vision',
      'Natural Language Processing',
      'Cloud Computing',
      'Internet of Things',
      'Blockchain',
      'Human-Computer Interaction',
      'Other'
    ]
  },
  abstract: {
    type: String,
    required: [true, 'Abstract is required'],
    trim: true,
    maxlength: [5000, 'Abstract cannot exceed 5000 characters']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  pdfFile: {
    type: String,
    required: [true, 'PDF file is required']
  },
  fileSize: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Paper', PaperSchema);
