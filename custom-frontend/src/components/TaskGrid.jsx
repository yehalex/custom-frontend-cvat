import React from "react";
import TaskCard from "./TaskCard";

const TaskGrid = ({ tasks, onSelect }) => {
  if (!tasks?.length) return <div>No tasks</div>;
  return (
    <div className="task-grid">
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} onClick={onSelect} />
      ))}
    </div>
  );
};

export default TaskGrid;
