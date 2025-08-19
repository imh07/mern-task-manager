const express = require("express");
const { listUsers } = require("../controllers/userController");
const { requireAuth, permit } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, permit("admin"), listUsers);

module.exports = router;
