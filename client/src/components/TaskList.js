import React from "react";
import { Link } from "react-router-dom";
import PriorityPill from "./PriorityPill";

export default function TaskList({ tasks = [], onDelete, onToggleStatus }) {
  return (
    <table className="tasks-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Priority</th>
          <th>Due</th>
          <th>Status</th>
          <th>Assigned To</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.length === 0 && (
          <tr><td colSpan="6" style={{ textAlign: "center" }}>No tasks yet</td></tr>
        )}
        {tasks.map((t) => (
          <tr key={t._id}>
            <td><Link to={`/tasks/${t._id}`}>{t.title}</Link></td>
            <td><PriorityPill priority={t.priority} /></td>
            <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</td>
            <td>{t.status}</td>
            <td>{t.assignedTo?.name || "-"}</td>
            <td>
              <button onClick={() => onToggleStatus(t)} className="btn small">
                {t.status === "pending" ? "Complete" : "Mark Pending"}
              </button>
              <Link to={`/tasks/${t._id}/edit`} className="btn small ghost">Edit</Link>
              <button onClick={() => onDelete(t)} className="btn small danger">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
