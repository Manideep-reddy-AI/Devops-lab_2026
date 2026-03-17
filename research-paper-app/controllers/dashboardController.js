const Paper = require('../models/Paper');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const totalPapers = await Paper.countDocuments();
    const totalUsers = await User.countDocuments();

    // Papers uploaded in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUploads = await Paper.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Total storage used (sum of fileSize)
    const storageResult = await Paper.aggregate([
      { $group: { _id: null, total: { $sum: '$fileSize' } } }
    ]);
    const storageUsed = storageResult.length > 0
      ? (storageResult[0].total / (1024 * 1024)).toFixed(2)
      : '0.00';

    // Papers per month (last 6 months) for Bar chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const papersPerMonth = await Paper.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const barLabels = [];
    const barData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const yr = d.getFullYear();
      const mo = d.getMonth() + 1;
      barLabels.push(monthNames[mo - 1] + ' ' + yr);
      const found = papersPerMonth.find(p => p._id.year === yr && p._id.month === mo);
      barData.push(found ? found.count : 0);
    }

    // Papers by category for Pie chart
    const papersByCategory = await Paper.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const pieLabels = papersByCategory.map(p => p._id);
    const pieData = papersByCategory.map(p => p.count);

    // Recent papers
    const recentPapers = await Paper.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('uploadedBy', 'name');

    res.render('dashboard/index', {
      title: 'Dashboard',
      totalPapers,
      totalUsers,
      recentUploads,
      storageUsed,
      barLabels: JSON.stringify(barLabels),
      barData: JSON.stringify(barData),
      pieLabels: JSON.stringify(pieLabels),
      pieData: JSON.stringify(pieData),
      recentPapers
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load dashboard data.');
    res.redirect('/auth/login');
  }
};
