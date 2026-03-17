const User = require("../models/User");
const Workload = require("../models/Workload");

async function getDashboard(req, res, next) {
  try {
    const user = res.locals.user;

    const facultyCountPromise = User.countDocuments({ role: "faculty" });
    const courseCountPromise = Workload.distinct("course").then((c) => c.length);

    const workloadFilter = user.role === "admin" ? {} : { faculty: user._id };

    const assignedHoursPromise = Workload.aggregate([
      { $match: workloadFilter },
      { $group: { _id: null, total: { $sum: "$hours" } } }
    ]).then((r) => (r[0] ? r[0].total : 0));

    // "Pending Requests" isn't in the DB requirements. We'll represent it as workloads with 0 hours as pending.
    const pendingCountPromise = Workload.countDocuments({ ...workloadFilter, hours: 0 });

    const [facultyCount, courseCount, assignedHours, pendingCount] = await Promise.all([
      facultyCountPromise,
      courseCountPromise,
      assignedHoursPromise,
      pendingCountPromise
    ]);

    const byDepartment = await Workload.aggregate([
      { $match: workloadFilter },
      { $group: { _id: "$department", totalHours: { $sum: "$hours" } } },
      { $sort: { totalHours: -1 } }
    ]);

    const byType = await Workload.aggregate([
      { $match: workloadFilter },
      { $group: { _id: "$workloadType", totalHours: { $sum: "$hours" } } },
      { $sort: { totalHours: -1 } }
    ]);

    return res.render("dashboard/index", {
      title: "Dashboard",
      stats: {
        facultyCount,
        courseCount,
        assignedHours,
        pendingCount
      },
      chartData: {
        byDepartment,
        byType
      }
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = { getDashboard };

