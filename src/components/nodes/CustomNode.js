import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import "./CustomNode.css";

const CustomNode = memo(({ id, data, selected }) => {
  return (
    <div className={`custom-node ${selected ? "selected" : ""}`}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <div className="custom-node-content">
        <div className="node-header">
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
            <div className="no-properties">No properties configured</div>
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

export default CustomNode;
