const express = require("express");
const path = require("path");

const app = express();

// ---------- Middleware ----------
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV !== "test") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
  });
}

// ---------- In-memory data store ----------
let tasks = [
  { id: 1, title: "Learn Node.js", done: false },
  { id: 2, title: "Build a REST API", done: false },
];
let nextId = 3;

// ---------- Routes ----------
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

app.post("/api/tasks", (req, res) => {
  const { title } = req.body || {};
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });

  const { title, done } = req.body || {};
  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Title must be a non-empty string" });
    }
    task.title = title.trim();
  }
  if (done !== undefined) task.done = Boolean(done);
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Task not found" });
  tasks.splice(index, 1);
  res.status(204).send();
});

// ---------- Fallbacks ----------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
