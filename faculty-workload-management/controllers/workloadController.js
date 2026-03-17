const Workload = require("../models/Workload");
const User = require("../models/User");
const { WORKLOAD_TYPES } = require("../models/Workload");
const { addFlash } = require("../middleware/flash");

function parseSort({ sort, dir }) {
  const allowed = new Set(["facultyName", "department", "course", "workloadType", "hours", "semester", "academicYear", "createdAt"]);
  const s = allowed.has(sort) ? sort : "createdAt";
  const d = dir === "asc" ? 1 : -1;
  return { sort: s, dir: d };
}

async function listWorkloads(req, res, next) {
  try {
    const user = res.locals.user;
    const q = String(req.query.q || "").trim();
    const { sort, dir } = parseSort({ sort: String(req.query.sort || ""), dir: String(req.query.dir || "") });

    const baseFilter = user.role === "admin" ? {} : { faculty: user._id };

    const filter = { ...baseFilter };
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { facultyName: rx },
        { department: rx },
        { course: rx },
        { workloadType: rx },
        { semester: rx },
        { academicYear: rx }
      ];
    }

    const workloads = await Workload.find(filter).sort({ [sort]: dir }).lean();

    return res.render("workloads/list", {
      title: "Workloads",
      workloads,
      q,
      sort,
      dir: dir === 1 ? "asc" : "desc"
    });
  } catch (e) {
    return next(e);
  }
}

async function showCreate(req, res, next) {
  try {
    const user = res.locals.user;
    const facultyList =
      user.role === "admin"
        ? await User.find({ role: "faculty" }).sort({ name: 1 }).lean()
        : [await User.findById(user._id).lean()];

    return res.render("workloads/new", {
      title: "Add Workload",
      facultyList,
      workloadTypes: WORKLOAD_TYPES
    });
  } catch (e) {
    return next(e);
  }
}

async function createWorkload(req, res, next) {
  try {
    const user = res.locals.user;
    const {
      facultyId,
      department,
      course,
      workloadType,
      hours,
      semester,
      academicYear
    } = req.body;

    const targetFacultyId = user.role === "admin" ? String(facultyId || "") : user._id.toString();
    if (!targetFacultyId) {
      addFlash(req, "danger", "Faculty is required.");
      return res.redirect("/workloads/new");
    }

    const faculty = await User.findById(targetFacultyId).lean();
    if (!faculty || faculty.role !== "faculty") {
      addFlash(req, "danger", "Selected faculty not found.");
      return res.redirect("/workloads/new");
    }

    const cleanDepartment = String(department || faculty.department || "").trim();
    const cleanCourse = String(course || "").trim();
    const cleanType = String(workloadType || "").trim();
    const cleanSemester = String(semester || "").trim();
    const cleanYear = String(academicYear || "").trim();
    const cleanHours = Number(hours);

    if (!cleanDepartment || !cleanCourse || !cleanType || !cleanSemester || !cleanYear || Number.isNaN(cleanHours)) {
      addFlash(req, "danger", "All fields are required.");
      return res.redirect("/workloads/new");
    }
    if (cleanHours < 0) {
      addFlash(req, "danger", "Hours must be 0 or greater.");
      return res.redirect("/workloads/new");
    }
    if (!WORKLOAD_TYPES.includes(cleanType)) {
      addFlash(req, "danger", "Invalid workload type.");
      return res.redirect("/workloads/new");
    }

    await Workload.create({
      faculty: faculty._id,
      facultyName: faculty.name,
      department: cleanDepartment,
      course: cleanCourse,
      workloadType: cleanType,
      hours: cleanHours,
      semester: cleanSemester,
      academicYear: cleanYear
    });

    addFlash(req, "success", "Workload added.");
    return res.redirect("/workloads");
  } catch (e) {
    return next(e);
  }
}

async function showEdit(req, res, next) {
  try {
    const user = res.locals.user;
    const wl = await Workload.findById(req.params.id).lean();
    if (!wl) return res.status(404).render("errors/404", { title: "Not Found" });

    if (user.role !== "admin" && wl.faculty.toString() !== user._id.toString()) {
      return res.status(403).render("errors/403", { title: "Forbidden" });
    }

    const facultyList =
      user.role === "admin"
        ? await User.find({ role: "faculty" }).sort({ name: 1 }).lean()
        : [await User.findById(user._id).lean()];

    return res.render("workloads/edit", {
      title: "Edit Workload",
      wl,
      facultyList,
      workloadTypes: WORKLOAD_TYPES
    });
  } catch (e) {
    return next(e);
  }
}

async function updateWorkload(req, res, next) {
  try {
    const user = res.locals.user;
    const existing = await Workload.findById(req.params.id);
    if (!existing) return res.status(404).render("errors/404", { title: "Not Found" });

    if (user.role !== "admin" && existing.faculty.toString() !== user._id.toString()) {
      return res.status(403).render("errors/403", { title: "Forbidden" });
    }

    const {
      facultyId,
      department,
      course,
      workloadType,
      hours,
      semester,
      academicYear
    } = req.body;

    const targetFacultyId = user.role === "admin" ? String(facultyId || "") : user._id.toString();
    const faculty = await User.findById(targetFacultyId).lean();
    if (!faculty || faculty.role !== "faculty") {
      addFlash(req, "danger", "Selected faculty not found.");
      return res.redirect(`/workloads/${existing._id}/edit`);
    }

    const cleanDepartment = String(department || faculty.department || "").trim();
    const cleanCourse = String(course || "").trim();
    const cleanType = String(workloadType || "").trim();
    const cleanSemester = String(semester || "").trim();
    const cleanYear = String(academicYear || "").trim();
    const cleanHours = Number(hours);

    if (!cleanDepartment || !cleanCourse || !cleanType || !cleanSemester || !cleanYear || Number.isNaN(cleanHours)) {
      addFlash(req, "danger", "All fields are required.");
      return res.redirect(`/workloads/${existing._id}/edit`);
    }
    if (cleanHours < 0) {
      addFlash(req, "danger", "Hours must be 0 or greater.");
      return res.redirect(`/workloads/${existing._id}/edit`);
    }
    if (!WORKLOAD_TYPES.includes(cleanType)) {
      addFlash(req, "danger", "Invalid workload type.");
      return res.redirect(`/workloads/${existing._id}/edit`);
    }

    existing.faculty = faculty._id;
    existing.facultyName = faculty.name;
    existing.department = cleanDepartment;
    existing.course = cleanCourse;
    existing.workloadType = cleanType;
    existing.hours = cleanHours;
    existing.semester = cleanSemester;
    existing.academicYear = cleanYear;

    await existing.save();

    addFlash(req, "success", "Workload updated.");
    return res.redirect("/workloads");
  } catch (e) {
    return next(e);
  }
}

async function deleteWorkload(req, res, next) {
  try {
    const user = res.locals.user;
    const wl = await Workload.findById(req.params.id).lean();
    if (!wl) {
      addFlash(req, "danger", "Workload not found.");
      return res.redirect("/workloads");
    }

    if (user.role !== "admin" && wl.faculty.toString() !== user._id.toString()) {
      return res.status(403).render("errors/403", { title: "Forbidden" });
    }

    await Workload.deleteOne({ _id: wl._id });
    addFlash(req, "success", "Workload deleted.");
    return res.redirect("/workloads");
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  listWorkloads,
  showCreate,
  createWorkload,
  showEdit,
  updateWorkload,
  deleteWorkload
};

