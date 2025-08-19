import React from "react";

const map = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

export default function PriorityPill({ priority }) {
  const cls = map[priority] || map.medium;
  return <span className={`priority-pill ${cls}`}>{priority}</span>;
}
