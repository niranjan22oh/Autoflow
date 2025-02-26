import React from "react";
import "./Sidebar.css";

const nodeCategories = [
  {
    title: "Triggers",
    items: [
      {
        type: "triggerNode",
        name: "Webhook Trigger",
        description: "Start flow from an HTTP request",
      },
      {
        type: "triggerNode",
        name: "Schedule Trigger",
        description: "Run flow at scheduled times",
      },
      {
        type: "triggerNode",
        name: "Database Trigger",
        description: "Trigger on database changes",
      },
    ],
  },
  {
    title: "Actions",
    items: [
      {
        type: "actionNode",
        name: "HTTP Request",
        description: "Make external API calls",
      },
      {
        type: "actionNode",
        name: "Database Query",
        description: "Run database operations",
      },
      {
        type: "actionNode",
        name: "Send Email",
        description: "Send email notifications",
      },
      {
        type: "actionNode",
        name: "Transform Data",
        description: "Transform data between steps",
      },
    ],
  },
  {
    title: "Logic",
    items: [
      {
        type: "conditionNode",
        name: "Condition",
        description: "Add conditional branching",
      },
      {
        type: "conditionNode",
        name: "Switch",
        description: "Multi-way branching based on value",
      },
      {
        type: "conditionNode",
        name: "Loop",
        description: "Iterate over data collections",
      },
    ],
  },
];

const Sidebar = () => {
  // Handle drag start for a node
  const onDragStart = (event, nodeType, nodeName) => {
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    event.dataTransfer.setData("application/reactflow/name", nodeName);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Components</h3>
      </div>
      <div className="sidebar-content">
        {nodeCategories.map((category) => (
          <div key={category.title} className="component-category">
            <h4>{category.title}</h4>
            <div className="component-list">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className={`component-item ${item.type}`}
                  draggable
                  onDragStart={(event) =>
                    onDragStart(event, item.type, item.name)
                  }
                >
                  <div className="component-name">{item.name}</div>
                  <div className="component-desc">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
