import React, { useEffect, useState } from "react";
import cvatApi from "../services/cvatApi";

const TaskDetails = ({ task }) => {
  const [details, setDetails] = useState(task);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setError("");
    (async () => {
      try {
        const d = await cvatApi.getTask(task.id);
        if (active) setDetails(d);
      } catch (e) {
        if (active) setError("Failed to load task details ", e);
      }
      try {
        const url = await cvatApi.getTaskPreviewBlobUrl(task.id);
        if (active) setPreviewUrl(url);
      } catch (e) {
        if (active) setError((prev) => prev || "Failed to load preview", e);
      }
    })();
    return () => {
      active = false;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [task.id, previewUrl]);

  const createdBy = details?.owner?.username || "admin";
  const createdDate = details?.created_date || "";
  //   const updatedDate = details?.updated_date || "";
  //   const size = details?.size ?? "-";
  //   const status = details?.status ?? "-";
  const bugTracker = details?.bug_tracker || "";

  return (
    <div className="task-details td-scope">
      {error ? (
        <div className="td-error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="td-titlebar">
        <div className="td-title-left">
          <h2 className="td-title">
            {details?.name ?? task.name}
            <button className="td-icon-btn" aria-label="Rename" title="Rename">
              ✎
            </button>
          </h2>
          <div className="td-meta">
            Task #{details?.id || task.id} Created by {createdBy}
            {createdDate
              ? ` on ${new Date(createdDate).toLocaleDateString()}`
              : ""}
          </div>
        </div>
        <div className="td-assign">
          <span className="td-assign-label">Assigned to</span>
          <select className="td-assign-select" disabled defaultValue="">
            <option value="">Select a user</option>
          </select>
        </div>
      </div>

      <div className="td-grid">
        <div className="td-preview">
          {previewUrl ? (
            <img src={previewUrl} alt={details?.name ?? task.name} />
          ) : (
            <div className="thumb-placeholder">No preview</div>
          )}
        </div>

        <div className="td-side">
          <div className="td-section">
            <div className="td-section-header">
              <div className="td-section-title">Task description</div>
              <button className="td-btn td-ghost" title="Edit description">
                Edit
              </button>
            </div>
            <div className="td-section-body td-description">—</div>
          </div>

          <div className="td-section">
            <div className="td-section-header">
              <div className="td-section-title">Issue Tracker</div>
              <button className="td-icon-link" title="Edit tracker">
                <span className="td-ico-penu" aria-hidden="true" />
              </button>
            </div>
            <div className="td-section-body">{bugTracker || "—"}</div>
          </div>

          {/* <div className="td-quickinfo">
            <div>
              <span className="td-k">Status</span>
              <span className="td-v">{status}</span>
            </div>
            <div>
              <span className="td-k">Size</span>
              <span className="td-v">{size}</span>
            </div>
            <div>
              <span className="td-k">Updated</span>
              <span className="td-v">{updatedDate || "—"}</span>
            </div>
          </div> */}

          <div className="td-tabsbar">
            <div className="td-tabs">
              <button className="td-tab">
                <span className="td-ico-penu" aria-hidden="true" />
                Raw
              </button>
              <button className="td-tab td-tab--active">
                <span className="td-ico-penu" aria-hidden="true" />
                Constructor
              </button>
            </div>
            <div className="td-toolbar">
              <button className="td-btn">Add label</button>
              <button className="td-btn">Setup skeleton</button>
              <button className="td-btn">From model</button>

              {/* <div className="td-chip">
                <span>object</span>
                <button className="td-chip-btn" title="Edit">
                  ✎
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <style>{`
.td-scope {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
  overflow: auto;
  background: #fff;
}

/* banners */
.td-scope .td-error {
  background: #fdecea;
  color: #b00020;
  border: 1px solid #f5c2c0;
  padding: 8px 12px;
  border-radius: 4px;
}

/* title bar */
.td-scope .td-titlebar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.td-scope .td-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}
.td-scope .td-icon-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #666;
  padding: 2px 4px;
}
.td-scope .td-meta {
  margin-top: 4px;
  color: #6b7280;
  font-size: 12px;
}
.td-scope .td-assign {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.td-scope .td-assign-label { color: #6b7280; font-size: 14px; }
.td-scope .td-assign-select {
  min-width: 220px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
  color: #9ca3af;
}

/* tabs + toolbar are now below the grid (not sticky) */
.td-scope .td-tabsbar {
  background: #fff;
  padding-top: 8px;
  margin-top: 4px;
  border-top: 1px solid #e5e7eb;
}
.td-scope .td-tabs {
  display: flex;
  gap: 8px;
}
.td-scope .td-tab {
  border: none;
  background: transparent;
  padding: 10px 12px;
  cursor: pointer;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.td-scope .td-tab--active {
  color: #111827;
  border-bottom: 2px solid #3b82f6;
}
.td-scope .td-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0 0;
}
.td-scope .td-btn {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  border-radius: 6px;
  cursor: pointer;
}
.td-scope .td-ghost { background: #f3f4f6; }
.td-scope .td-chip {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #dcfce7;
  color: #065f46;
  border: 1px solid #a7f3d0;
  border-radius: 999px;
  padding: 6px 10px;
}
.td-scope .td-chip-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #065f46;
}

/* grid: 35% / 65% */
.td-scope .td-grid {
  display: grid;
  grid-template-columns: 35% 65%;
  gap: 20px;
  align-items: start;
}

/* left preview */
.td-scope .td-preview {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
}
.td-scope .td-preview img {
  width: 100%;
  height: auto;
  display: block;
}
.td-scope .thumb-placeholder { color: #9ca3af; padding: 60px 0; }

/* right side */
.td-scope .td-side { display: flex; flex-direction: column; gap: 12px; }
.td-scope .td-section {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
}
.td-scope .td-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
}
.td-scope .td-section-title { font-weight: 600; }
.td-scope .td-section-body { padding: 10px 12px; color: #374151; }
.td-scope .td-description { color: #6b7280; font-style: italic; }
.td-scope .td-quickinfo {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.td-scope .td-quickinfo .td-k { color: #6b7280; margin-right: 6px; }
.td-scope .td-quickinfo .td-v { font-weight: 500; }

/* pen-with-underline icon (matches screenshot style) */
.td-scope .td-ico-penu {
  width: 18px;
  height: 18px;
  display: inline-block;
  background: currentColor;
  -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>') no-repeat center / contain;
          mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>') no-repeat center / contain;
}

/* RWD */
@media (max-width: 1200px) {
  .td-scope .td-grid { grid-template-columns: 40% 60%; }
}
@media (max-width: 992px) {
  .td-scope .td-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .td-scope { padding: 12px 12px; }
  .td-scope .td-assign-select { min-width: 160px; }
}
      `}</style>
    </div>
  );
};

export default TaskDetails;
