import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  const load = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data.task);
    } catch (err) {
      alert("Unable to load task");
      navigate("/");
    }
  };

  useEffect(() => { load(); }, [id]);

  const changeStatus = async (newStatus) => {
    await api.patch(`/tasks/${id}/status`, { status: newStatus });
    load();
  };

  const remove = async () => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`);
    navigate("/");
  };

  if (!task) return <div className="container">Loading…</div>;

  return (
    <div className="container">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p><strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Assigned To:</strong> {task.assignedTo?.name || "-"}</p>

      {task.status === "pending" ? (
        <button className="btn" onClick={() => changeStatus("completed")}>Mark Completed</button>
      ) : (
        <button className="btn" onClick={() => changeStatus("pending")}>Mark Pending</button>
      )}

      <button className="btn ghost" onClick={() => navigate(`/tasks/${id}/edit`)}>Edit</button>
      <button className="btn danger" onClick={remove}>Delete</button>
    </div>
  );
}
