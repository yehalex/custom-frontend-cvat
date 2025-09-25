import React from "react";

const ProjectList = ({ tasks, selectedTask, onTaskSelect }) => {
  return (
    <div className="project-list">
      <h3>Projects</h3>
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className={selectedTask?.id === task.id ? "selected" : ""}
              onClick={() => onTaskSelect(task)}
            >
              <strong>{task.name}</strong>
              <div className="task-info">
                Status: {task.status} | Size: {task.size}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;
