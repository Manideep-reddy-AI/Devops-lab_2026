const Paper = require('../models/Paper');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  'Artificial Intelligence', 'Machine Learning', 'Computer Networks',
  'Cybersecurity', 'Data Science', 'Software Engineering',
  'Computer Vision', 'Natural Language Processing', 'Cloud Computing',
  'Internet of Things', 'Blockchain', 'Human-Computer Interaction', 'Other'
];

// GET /papers
exports.getAllPapers = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { abstract: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'title') sortOption = { title: 1 };
    else if (sort === 'year') sortOption = { year: -1 };
    else if (sort === 'author') sortOption = { author: 1 };

    const papers = await Paper.find(query).sort(sortOption).populate('uploadedBy', 'name');

    res.render('papers/index', {
      title: 'Research Papers',
      papers,
      categories: CATEGORIES,
      search: search || '',
      selectedCategory: category || 'all',
      sort: sort || 'newest'
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load papers.');
    res.redirect('/dashboard');
  }
};

// GET /papers/create
exports.getCreatePaper = (req, res) => {
  res.render('papers/create', { title: 'Upload Paper', categories: CATEGORIES });
};

// POST /papers
exports.createPaper = async (req, res) => {
  try {
    if (!req.file) {
      req.flash('error', 'Please upload a PDF file.');
      return res.redirect('/papers/create');
    }

    const { title, author, category, abstract, year } = req.body;

    const paper = await Paper.create({
      title,
      author,
      category,
      abstract,
      year: parseInt(year),
      pdfFile: req.file.filename,
      fileSize: req.file.size,
      uploadedBy: req.session.userId
    });

    // Increment papersUploaded count
    await User.findByIdAndUpdate(req.session.userId, { $inc: { papersUploaded: 1 } });

    req.flash('success', 'Paper uploaded successfully!');
    res.redirect(`/papers/${paper._id}`);
  } catch (err) {
    console.error(err);
    if (req.file) {
      fs.unlink(path.join(__dirname, '..', 'public', 'uploads', 'pdfs', req.file.filename), () => {});
    }
    req.flash('error', 'Could not upload paper. ' + (err.message || ''));
    res.redirect('/papers/create');
  }
};

// GET /papers/:id
exports.getPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!paper) {
      req.flash('error', 'Paper not found.');
      return res.redirect('/papers');
    }
    res.render('papers/show', { title: paper.title, paper });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load paper.');
    res.redirect('/papers');
  }
};

// GET /papers/:id/edit
exports.getEditPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      req.flash('error', 'Paper not found.');
      return res.redirect('/papers');
    }

    // Only uploader or admin can edit
    if (paper.uploadedBy.toString() !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'Not authorized to edit this paper.');
      return res.redirect('/papers');
    }

    res.render('papers/edit', { title: 'Edit Paper', paper, categories: CATEGORIES });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load paper.');
    res.redirect('/papers');
  }
};

// PUT /papers/:id
exports.updatePaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      req.flash('error', 'Paper not found.');
      return res.redirect('/papers');
    }

    if (paper.uploadedBy.toString() !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'Not authorized to edit this paper.');
      return res.redirect('/papers');
    }

    const { title, author, category, abstract, year } = req.body;
    paper.title = title;
    paper.author = author;
    paper.category = category;
    paper.abstract = abstract;
    paper.year = parseInt(year);
    await paper.save();

    req.flash('success', 'Paper updated successfully!');
    res.redirect(`/papers/${paper._id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not update paper.');
    res.redirect(`/papers/${req.params.id}/edit`);
  }
};

// DELETE /papers/:id
exports.deletePaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      req.flash('error', 'Paper not found.');
      return res.redirect('/papers');
    }

    if (paper.uploadedBy.toString() !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'Not authorized to delete this paper.');
      return res.redirect('/papers');
    }

    // Delete the PDF file
    const filePath = path.join(__dirname, '..', 'public', 'uploads', 'pdfs', paper.pdfFile);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await User.findByIdAndUpdate(paper.uploadedBy, { $inc: { papersUploaded: -1 } });
    await Paper.findByIdAndDelete(req.params.id);

    req.flash('success', 'Paper deleted successfully!');
    res.redirect('/papers');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not delete paper.');
    res.redirect('/papers');
  }
};
