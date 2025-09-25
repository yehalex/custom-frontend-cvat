import React, { useEffect, useState } from "react";
import cvatApi from "../services/cvatApi";

const TaskCard = ({ task, onClick }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const url = await cvatApi.getTaskPreviewBlobUrl(task.id);
        if (active) setPreviewUrl(url);
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {
      active = false;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [task.id, previewUrl]);

  return (
    <div className="task-card" onClick={() => onClick(task)}>
      <div className="thumb">
        {previewUrl ? (
          <img src={previewUrl} alt={task.name} />
        ) : (
          <div className="thumb-placeholder">No preview</div>
        )}
      </div>
      <div className="meta">
        <div className="name">{task.name}</div>
        <div className="sub">
          Status: {task.status} • Size: {task.size}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
