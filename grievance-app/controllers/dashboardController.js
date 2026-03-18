const Grievance = require('../models/Grievance');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const role = req.session.user.role;

    let totalGrievances, pending, inProgress, resolved;

    if (role === 'citizen') {
      totalGrievances = await Grievance.countDocuments({ submittedBy: userId });
      pending = await Grievance.countDocuments({ submittedBy: userId, status: 'Pending' });
      inProgress = await Grievance.countDocuments({ submittedBy: userId, status: { $in: ['Under Review', 'In Progress'] } });
      resolved = await Grievance.countDocuments({ submittedBy: userId, status: 'Resolved' });
    } else {
      totalGrievances = await Grievance.countDocuments();
      pending = await Grievance.countDocuments({ status: 'Pending' });
      inProgress = await Grievance.countDocuments({ status: { $in: ['Under Review', 'In Progress'] } });
      resolved = await Grievance.countDocuments({ status: 'Resolved' });
    }

    const totalUsers = role === 'admin' ? await User.countDocuments() : null;

    // Recent grievances
    const query = role === 'citizen' ? { submittedBy: userId } : {};
    const recentGrievances = await Grievance.find(query)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly stats for chart (last 6 months)
    const months = [];
    const monthlyCounts = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const q = role === 'citizen' ? { submittedBy: userId, createdAt: { $gte: start, $lte: end } } : { createdAt: { $gte: start, $lte: end } };
      const count = await Grievance.countDocuments(q);
      months.push(start.toLocaleString('default', { month: 'short' }));
      monthlyCounts.push(count);
    }

    // Category stats for pie chart
    const categories = ['Roads & Infrastructure', 'Water Supply', 'Electricity', 'Sanitation', 'Public Safety', 'Education', 'Health Services', 'Other'];
    const categoryCounts = await Promise.all(categories.map(cat => {
      const q = role === 'citizen' ? { submittedBy: userId, category: cat } : { category: cat };
      return Grievance.countDocuments(q);
    }));

    res.render('dashboard/index', {
      title: 'Dashboard',
      totalGrievances, pending, inProgress, resolved, totalUsers,
      recentGrievances, months: JSON.stringify(months),
      monthlyCounts: JSON.stringify(monthlyCounts),
      categories: JSON.stringify(categories),
      categoryCounts: JSON.stringify(categoryCounts)
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500', { title: 'Server Error', errorId: Date.now() });
  }
};
