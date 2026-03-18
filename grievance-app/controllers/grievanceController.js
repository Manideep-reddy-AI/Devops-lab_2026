const Grievance = require('../models/Grievance');
const User = require('../models/User');

const CATEGORIES = ['Roads & Infrastructure', 'Water Supply', 'Electricity', 'Sanitation', 'Public Safety', 'Education', 'Health Services', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const STATUSES = ['Pending', 'Under Review', 'In Progress', 'Resolved', 'Rejected', 'Closed'];

exports.index = async (req, res) => {
  try {
    const role = req.session.user.role;
    const userId = req.session.user._id;
    const { search, status, category, priority, page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (role === 'citizen') query.submittedBy = userId;
    if (search) query.$or = [{ title: new RegExp(search, 'i') }, { ticketId: new RegExp(search, 'i') }, { location: new RegExp(search, 'i') }];
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const total = await Grievance.countDocuments(query);
    const grievances = await Grievance.find(query)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit);

    res.render('grievances/index', {
      title: 'Grievances', grievances, total,
      page: Number(page), pages: Math.ceil(total / limit),
      search, status, category, priority,
      CATEGORIES, STATUSES, PRIORITIES
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500', { title: 'Server Error', errorId: Date.now() });
  }
};

exports.getCreate = (req, res) => {
  res.render('grievances/create', { title: 'Submit Grievance', CATEGORIES, PRIORITIES });
};

exports.postCreate = async (req, res) => {
  try {
    const { title, description, category, priority, location } = req.body;
    const attachment = req.file ? '/uploads/attachments/' + req.file.filename : '';
    await Grievance.create({
      title, description, category, priority, location, attachment,
      submittedBy: req.session.user._id
    });
    req.session.success = 'Grievance submitted successfully!';
    res.redirect('/grievances');
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to submit grievance.';
    res.redirect('/grievances/create');
  }
};

exports.show = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('submittedBy', 'name email phone')
      .populate('assignedTo', 'name email')
      .populate('remarks.addedBy', 'name role');
    if (!grievance) return res.status(404).render('errors/404', { title: 'Not Found' });
    const officers = await User.find({ role: { $in: ['officer', 'admin'] } }, 'name email');
    res.render('grievances/show', { title: 'Grievance Details', grievance, officers, STATUSES });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500', { title: 'Server Error', errorId: Date.now() });
  }
};

exports.getEdit = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).render('errors/404', { title: 'Not Found' });
    if (grievance.submittedBy.toString() !== req.session.user._id.toString() && req.session.user.role === 'citizen') {
      req.session.error = 'Unauthorized.';
      return res.redirect('/grievances');
    }
    res.render('grievances/edit', { title: 'Edit Grievance', grievance, CATEGORIES, PRIORITIES });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500', { title: 'Server Error', errorId: Date.now() });
  }
};

exports.putEdit = async (req, res) => {
  try {
    const { title, description, category, priority, location } = req.body;
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).render('errors/404', { title: 'Not Found' });
    grievance.title = title;
    grievance.description = description;
    grievance.category = category;
    grievance.priority = priority;
    grievance.location = location;
    if (req.file) grievance.attachment = '/uploads/attachments/' + req.file.filename;
    await grievance.save();
    req.session.success = 'Grievance updated successfully!';
    res.redirect('/grievances/' + grievance._id);
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to update grievance.';
    res.redirect('/grievances');
  }
};

exports.delete = async (req, res) => {
  try {
    await Grievance.findByIdAndDelete(req.params.id);
    req.session.success = 'Grievance deleted successfully!';
    res.redirect('/grievances');
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to delete grievance.';
    res.redirect('/grievances');
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, assignedTo, remark } = req.body;
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).render('errors/404', { title: 'Not Found' });
    grievance.status = status;
    if (assignedTo) grievance.assignedTo = assignedTo;
    if (status === 'Resolved') grievance.resolvedAt = new Date();
    if (remark && remark.trim()) {
      grievance.remarks.push({ text: remark.trim(), addedBy: req.session.user._id });
    }
    await grievance.save();
    req.session.success = 'Status updated successfully!';
    res.redirect('/grievances/' + grievance._id);
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to update status.';
    res.redirect('/grievances/' + req.params.id);
  }
};
