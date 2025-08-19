// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");

// const app = express();

// // Middlewares
// app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(morgan("dev"));

// // Health check route
// app.get("/api/health", (_req, res) => {
//   res.json({ status: "ok", service: "task-manager-api", time: new Date().toISOString() });
// });

// const PORT = process.env.PORT || 5000;

// async function start() {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ MongoDB connected:", conn.connection.name);

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ Failed to start server:", err.message);
//     process.exit(1);
//   }
// }

// start();

// // Graceful shutdown
// process.on("SIGINT", async () => {
//   await mongoose.connection.close();
//   console.log("\n🛑 MongoDB connection closed. Bye!");
//   process.exit(0);
// });


require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

// ================== Middlewares ==================
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// ================== Routes ==================

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Task Manager API 🚀",
    health: "/api/health"
  });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "task-manager-api",
    time: new Date().toISOString()
  });
});

// TODO: Add your feature routes here
// Example:
// const taskRoutes = require("./routes/taskRoutes");
// app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

// ================== Start Server ==================
async function start() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected:", conn.connection.name);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

start();

// ================== Graceful Shutdown ==================
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("\n🛑 MongoDB connection closed. Bye!");
  process.exit(0);
});


// ... existing requires & app setup above

// ====== routes (add these) ======
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// ... keep your start() and graceful shutdown as-is
