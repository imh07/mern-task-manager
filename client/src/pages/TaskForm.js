import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function TaskForm({ edit }) {
  const { id } = useParams();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (id) {
      api.get(`/tasks/${id}`).then((r) => {
        const t = r.data.task;
        setTitle(t.title);
        setDescription(t.description);
        setDueDate(t.dueDate ? t.dueDate.slice(0,10) : "");
        setPriority(t.priority);
        setAssignedTo(t.assignedTo?._id || "");
      });
    }
    // load users (for admin assign) — ignore errors
    api.get("/users").then(r => setUsers(r.data.users)).catch(()=>{});
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { title, description, dueDate, priority, assignedTo: assignedTo || null };
    try {
      if (id) await api.put(`/tasks/${id}`, payload);
      else await api.post("/tasks", payload);
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container form">
      <h2>{id ? "Edit Task" : "New Task"}</h2>
      <form onSubmit={submit}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} required />
        <select value={priority} onChange={e=>setPriority(e.target.value)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)}>
          <option value="">-- assign to (optional) --</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
        </select>

        <button className="btn">{id ? "Save" : "Create"}</button>
      </form>
    </div>
  );
}
