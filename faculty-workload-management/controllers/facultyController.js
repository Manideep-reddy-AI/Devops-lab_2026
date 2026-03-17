const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Workload = require("../models/Workload");
const { addFlash } = require("../middleware/flash");

async function listFaculty(req, res, next) {
  try {
    const q = String(req.query.q || "").trim();
    const filter = { role: "faculty" };
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { email: rx }, { department: rx }];
    }

    const faculty = await User.find(filter).sort({ name: 1 }).lean();
    const totals = await Workload.aggregate([
      { $match: {} },
      { $group: { _id: "$faculty", totalHours: { $sum: "$hours" } } }
    ]);
    const totalsMap = new Map(totals.map((t) => [String(t._id), t.totalHours]));

    const rows = faculty.map((f) => ({
      ...f,
      totalHours: totalsMap.get(String(f._id)) || 0
    }));

    return res.render("faculty/list", { title: "Faculty", rows, q });
  } catch (e) {
    return next(e);
  }
}

async function showCreateFaculty(req, res) {
  return res.render("faculty/new", { title: "Add Faculty" });
}

async function createFaculty(req, res, next) {
  try {
    const { name, department, email, password } = req.body;

    const cleanName = String(name || "").trim();
    const cleanDepartment = String(department || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const pass = String(password || "");

    if (!cleanName || !cleanDepartment || !normalizedEmail || !pass) {
      addFlash(req, "danger", "All fields are required.");
      return res.redirect("/faculty/new");
    }
    if (pass.length < 8) {
      addFlash(req, "danger", "Password must be at least 8 characters.");
      return res.redirect("/faculty/new");
    }

    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      addFlash(req, "danger", "Email is already registered.");
      return res.redirect("/faculty/new");
    }

    const passwordHash = await bcrypt.hash(pass, 12);
    await User.create({
      name: cleanName,
      department: cleanDepartment,
      email: normalizedEmail,
      passwordHash,
      role: "faculty"
    });

    addFlash(req, "success", "Faculty created.");
    return res.redirect("/faculty");
  } catch (e) {
    return next(e);
  }
}

async function showEditFaculty(req, res, next) {
  try {
    const faculty = await User.findById(req.params.id).lean();
    if (!faculty || faculty.role !== "faculty") return res.status(404).render("errors/404", { title: "Not Found" });

    const total = await Workload.aggregate([
      { $match: { faculty: faculty._id } },
      { $group: { _id: null, totalHours: { $sum: "$hours" } } }
    ]);

    return res.render("faculty/edit", {
      title: "Edit Faculty",
      faculty,
      totalHours: total[0] ? total[0].totalHours : 0
    });
  } catch (e) {
    return next(e);
  }
}

async function updateFaculty(req, res, next) {
  try {
    const faculty = await User.findById(req.params.id);
    if (!faculty || faculty.role !== "faculty") return res.status(404).render("errors/404", { title: "Not Found" });

    const { name, department, email, password } = req.body;
    const cleanName = String(name || "").trim();
    const cleanDepartment = String(department || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const pass = String(password || "");

    if (!cleanName || !cleanDepartment || !normalizedEmail) {
      addFlash(req, "danger", "Name, Department, and Email are required.");
      return res.redirect(`/faculty/${faculty._id}/edit`);
    }

    const existingEmailOwner = await User.findOne({ email: normalizedEmail }).lean();
    if (existingEmailOwner && String(existingEmailOwner._id) !== String(faculty._id)) {
      addFlash(req, "danger", "Email is already used by another account.");
      return res.redirect(`/faculty/${faculty._id}/edit`);
    }

    faculty.name = cleanName;
    faculty.department = cleanDepartment;
    faculty.email = normalizedEmail;
    if (pass) {
      if (pass.length < 8) {
        addFlash(req, "danger", "New password must be at least 8 characters.");
        return res.redirect(`/faculty/${faculty._id}/edit`);
      }
      faculty.passwordHash = await bcrypt.hash(pass, 12);
    }
    await faculty.save();

    // Keep denormalized facultyName/department updated for future list/search
    await Workload.updateMany({ faculty: faculty._id }, { $set: { facultyName: faculty.name, department: faculty.department } });

    addFlash(req, "success", "Faculty updated.");
    return res.redirect("/faculty");
  } catch (e) {
    return next(e);
  }
}

async function deleteFaculty(req, res, next) {
  try {
    const faculty = await User.findById(req.params.id).lean();
    if (!faculty || faculty.role !== "faculty") {
      addFlash(req, "danger", "Faculty not found.");
      return res.redirect("/faculty");
    }

    await Workload.deleteMany({ faculty: faculty._id });
    await User.deleteOne({ _id: faculty._id });

    addFlash(req, "success", "Faculty deleted (and related workloads removed).");
    return res.redirect("/faculty");
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  listFaculty,
  showCreateFaculty,
  createFaculty,
  showEditFaculty,
  updateFaculty,
  deleteFaculty
};

