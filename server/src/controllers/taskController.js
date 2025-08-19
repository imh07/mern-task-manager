const Task = require("../models/Task");
const User = require("../models/User");

// create
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority = "medium", assignedTo = null } = req.body;
    if (!title || !dueDate) return res.status(400).json({ message: "title and dueDate required" });

    // ensure assignee exists if provided
    let assignee = null;
    if (assignedTo) {
      assignee = await User.findById(assignedTo);
      if (!assignee) return res.status(404).json({ message: "Assigned user not found" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo: assignee ? assignee._id : null,
      createdBy: req.user.id,
    });
    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// list (with pagination + filters)
exports.getTasks = async (req, res) => {
  try {
    let { page = 1, limit = 10, status, priority, search } = req.query;
    page = parseInt(page); limit = Math.min(parseInt(limit), 50);

    // Admin sees all; users see createdBy or assignedTo themselves
    const baseFilter = (req.user.role === "admin")
      ? {}
      : { $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }] };

    if (status) baseFilter.status = status;
    if (priority) baseFilter.priority = priority;
    if (search) {
      baseFilter.$or = (baseFilter.$or || []).concat([
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]);
    }

    const total = await Task.countDocuments(baseFilter);
    const tasks = await Task.find(baseFilter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// details
exports.getTaskById = async (req, res) => {
  try {
    const t = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
    if (!t) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && ![t.createdBy._id.toString(), t.assignedTo?.id].includes(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ task: t });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update
exports.updateTask = async (req, res) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && t.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only creator or admin can update" });
    }

    const allowed = ["title", "description", "dueDate", "priority"];
    allowed.forEach((k) => {
      if (k in req.body) t[k] = req.body[k];
    });

    await t.save();
    res.json({ task: t });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete
exports.deleteTask = async (req, res) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && t.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only creator or admin can delete" });
    }

    await t.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// status update
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body; // "pending" | "completed"
    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Task not found" });

    // creator, assignee, or admin can change status
    const can =
      req.user.role === "admin" ||
      t.createdBy.toString() === req.user.id ||
      (t.assignedTo && t.assignedTo.toString() === req.user.id);

    if (!can) return res.status(403).json({ message: "Forbidden" });

    t.status = status;
    await t.save();
    res.json({ task: t });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// assign to user (admin only)
exports.assignTask = async (req, res) => {
  try {
    const { userId } = req.body;
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Task not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    t.assignedTo = user._id;
    await t.save();
    res.json({ task: t });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
