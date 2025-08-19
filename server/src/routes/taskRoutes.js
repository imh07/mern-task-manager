const express = require("express");
const {
  createTask, getTasks, getTaskById,
  updateTask, deleteTask, updateStatus, assignTask
} = require("../controllers/taskController");
const { requireAuth, permit } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth); // all below are protected

router.post("/", createTask);                     // create
router.get("/", getTasks);                        // list + pagination
router.get("/:id", getTaskById);                  // details
router.put("/:id", updateTask);                   // edit
router.delete("/:id", deleteTask);                // delete
router.patch("/:id/status", updateStatus);        // change status
router.patch("/:id/assign", permit("admin"), assignTask); // assign (admin only)

module.exports = router;
