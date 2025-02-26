import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import "./CustomNode.css";

const ConditionNode = memo(({ id, data, selected }) => {
  return (
    <div className={`custom-node condition-node ${selected ? "selected" : ""}`}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <div className="custom-node-content">
        <div className="node-header condition-header">
          <div className="node-title">{data.label}</div>
          // src/components/nodes/ConditionNode.js (continued)
        </div>
        <div className="node-body">
          {data.properties?.condition ? (
            <div className="condition-expression">
              <span className="condition-text">
                {data.properties.condition}
              </span>
            </div>
          ) : (
            <div className="no-properties">Set condition expression</div>
          )}
          <div className="branch-labels">
            <span className="true-label">
              {data.properties?.trueLabel || "True"}
            </span>
            <span className="false-label">
              {data.properties?.falseLabel || "False"}
            </span>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ background: "#4CAF50", left: "25%" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ background: "#F44336", left: "75%" }}
      />
    </div>
  );
});

export default ConditionNode;
