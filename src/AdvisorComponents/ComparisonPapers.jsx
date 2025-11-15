import React from "react";

export default function ComparisonPapers({ paper, onClose }) {
  return (
    <div className="comparison-modal">
      <div className="comparison-header">
        <h3>{paper?.title || "Paper Comparison"}</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className="comparison-body">
        {/* TODO: Implement comparison of versions here */}
        <p>This will display version differences and feedback.</p>
      </div>
    </div>
  );
}
