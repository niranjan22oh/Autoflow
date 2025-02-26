import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import "./CustomNode.css";

const TriggerNode = memo(({ id, data, selected }) => {
  return (
    <div className={`custom-node trigger-node ${selected ? "selected" : ""}`}>
      <div className="custom-node-content">
        <div className="node-header trigger-header">
          <div className="node-title">{data.label}</div>
        </div>
        <div className="node-body">
          {Object.entries(data.properties || {}).length > 0 ? (
            <div className="properties-summary">
              {Object.entries(data.properties).map(([key, value]) => (
                <div key={key} className="property-item">
                  <span className="property-key">{key}:</span>
                  <span className="property-value">
                    {typeof value === "object"
                      ? "[Object]"
                      : String(value).length > 15
                      ? String(value).substring(0, 15) + "..."
                      : value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-properties">Configure trigger properties</div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
    </div>
  );
});

export default TriggerNode;
