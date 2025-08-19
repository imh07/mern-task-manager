import React, { useEffect, useState } from "react";
import api from "../api/axios";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 6;

  const fetchTasks = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks?page=${p}&limit=${limit}`);
      setTasks(res.data.tasks);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(1); }, []);

  const handleDelete = async (t) => {
    if (!window.confirm(`Delete "${t.title}"?`)) return;
    await api.delete(`/tasks/${t._id}`);
    fetchTasks(page);
  };

  const handleToggleStatus = async (t) => {
    const newStatus = t.status === "pending" ? "completed" : "pending";
    await api.patch(`/tasks/${t._id}/status`, { status: newStatus });
    fetchTasks(page);
  };

  return (
    <div className="container">
      <h2>Tasks</h2>
      {loading ? <p>Loading…</p> : <TaskList tasks={tasks} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />}
      <div className="pagination">
        <button className="btn" onClick={() => fetchTasks(page - 1)} disabled={page <= 1}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button className="btn" onClick={() => fetchTasks(page + 1)} disabled={page >= totalPages}>Next</button>
      </div>
    </div>
  );
}
