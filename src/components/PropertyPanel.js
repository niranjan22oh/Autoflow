import React, { useState, useEffect } from "react";
import "./PropertyPanel.css";

const PropertyPanel = ({ node, updateNodeProperties }) => {
  const [properties, setProperties] = useState({});

  // Initialize properties from node data
  useEffect(() => {
    setProperties(node.data.properties || {});
  }, [node]);

  // Generate property fields based on node type
  const getPropertyFields = () => {
    // Different node types have different property fields
    switch (node.type) {
      case "triggerNode":
        return [
          {
            id: "endpoint",
            label: "Endpoint Path",
            type: "text",
            placeholder: "/api/trigger",
          },
          {
            id: "method",
            label: "HTTP Method",
            type: "select",
            options: ["GET", "POST", "PUT", "DELETE"],
          },
          {
            id: "authentication",
            label: "Authentication",
            type: "select",
            options: ["None", "API Key", "JWT", "OAuth2"],
          },
        ];
      case "actionNode":
        if (node.data.label === "HTTP Request") {
          return [
            {
              id: "url",
              label: "URL",
              type: "text",
              placeholder: "https://api.example.com/endpoint",
            },
            {
              id: "method",
              label: "Method",
              type: "select",
              options: ["GET", "POST", "PUT", "DELETE"],
            },
            {
              id: "headers",
              label: "Headers",
              type: "json",
              placeholder: '{"Content-Type": "application/json"}',
            },
            {
              id: "body",
              label: "Body",
              type: "json",
              placeholder: '{"key": "value"}',
            },
          ];
        }
        if (node.data.label === "Database Query") {
          return [
            {
              id: "connection",
              label: "Connection",
              type: "select",
              options: ["Default Database", "External DB"],
            },
            {
              id: "query",
              label: "Query",
              type: "textarea",
              placeholder: "SELECT * FROM users WHERE id = {{id}}",
            },
            {
              id: "parameters",
              label: "Parameters",
              type: "json",
              placeholder: '{"id": "{{input.userId}}"}',
            },
          ];
        }
        // Default action properties
        return [
          {
            id: "inputMapping",
            label: "Input Mapping",
            type: "json",
            placeholder: '{"key": "{{source.value}}"}',
          },
          {
            id: "outputMapping",
            label: "Output Mapping",
            type: "json",
            placeholder: '{"result": "{{output.value}}"}',
          },
        ];
      case "conditionNode":
        return [
          {
            id: "condition",
            label: "Condition",
            type: "text",
            placeholder: "{{input.value}} > 10",
          },
          {
            id: "trueLabel",
            label: "True Label",
            type: "text",
            placeholder: "Yes",
          },
          {
            id: "falseLabel",
            label: "False Label",
            type: "text",
            placeholder: "No",
          },
        ];
      default:
        return [
          { id: "name", label: "Name", type: "text", placeholder: "My Node" },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Node description...",
          },
        ];
    }
  };

  // Handle property changes
  const handlePropertyChange = (propertyId, value) => {
    const newProperties = {
      ...properties,
      [propertyId]: value,
    };
    setProperties(newProperties);
    updateNodeProperties(newProperties);
  };

  // Render a property field based on its type
  const renderPropertyField = (field) => {
    const value = properties[field.id] || "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => handlePropertyChange(field.id, e.target.value)}
          />
        );
      case "textarea":
        return (
          <textarea
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => handlePropertyChange(field.id, e.target.value)}
          />
        );
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handlePropertyChange(field.id, e.target.value)}
          >
            <option value="">Select...</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "json":
        return (
          <textarea
            value={
              typeof value === "object" ? JSON.stringify(value, null, 2) : value
            }
            placeholder={field.placeholder}
            onChange={(e) => {
              try {
                // Try to parse as JSON if possible
                const jsonValue = JSON.parse(e.target.value);
                handlePropertyChange(field.id, jsonValue);
              } catch (err) {
                // Otherwise store as string
                handlePropertyChange(field.id, e.target.value);
              }
            }}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handlePropertyChange(field.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="property-panel">
      <div className="panel-header">
        <h3>Properties: {node.data.label}</h3>
      </div>
      <div className="panel-content">
        <div className="property-form">
          {getPropertyFields().map((field) => (
            <div key={field.id} className="property-field">
              <label>{field.label}</label>
              {renderPropertyField(field)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
