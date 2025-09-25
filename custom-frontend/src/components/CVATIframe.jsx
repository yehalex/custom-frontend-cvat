import React from "react";

const CVATIframe = ({ taskId }) => {
  // const iframeUrl = `http://localhost:8080/tasks/${taskId}`;
  const iframeUrl = `/cvat/tasks/${taskId}`;

  return (
    <div className="cvat-iframe-container">
      <iframe
        src={iframeUrl}
        title={`CVAT Task ${taskId}`}
        className="cvat-iframe"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation"
      />
      <style>{`
        .cvat-iframe-container {
          width: 100%;
          height: 100%;
          min-height: 600px;
          border: none;
          overflow: hidden;
        }
        
        .cvat-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default CVATIframe;
