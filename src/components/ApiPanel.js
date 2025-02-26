import React, { useState, useEffect } from "react";
import "./ApiPanel.css";

const ApiPanel = ({ flowData, onClose }) => {
  const [apiSpec, setApiSpec] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("endpoints");

  // Simulate API generation process
  useEffect(() => {
    // In a real implementation, this would be an API call to the backend
    setTimeout(() => {
      // Generate a mock API specification based on the flow data
      const generatedApiSpec = generateMockApiSpec(flowData);
      setApiSpec(generatedApiSpec);
      setIsLoading(false);
    }, 1000);
  }, [flowData]);

  // Mock API specification generator
  const generateMockApiSpec = (flowData) => {
    // Find trigger nodes which become API endpoints
    const triggerNodes = flowData.nodes.filter(
      (node) => node.type === "triggerNode"
    );

    const endpoints = triggerNodes.map((node) => {
      const properties = node.data.properties || {};
      return {
        path: properties.endpoint || `/api/flow/${node.id}`,
        method: properties.method || "POST",
        description: `Endpoint for ${node.data.label}`,
        requestSchema: {
          type: "object",
          properties: {
            input: {
              type: "object",
              properties: {
                param1: { type: "string" },
                param2: { type: "number" },
              },
            },
          },
        },
        responseSchema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "object" },
          },
        },
      };
    });

    return {
      name: "Generated Flow API",
      version: "1.0.0",
      baseUrl: "https://api.example.com",
      endpoints,
      testUrl: "https://test.example.com/api",
    };
  };

  // Generate code snippet for testing the API
  const generateCodeSnippet = (endpoint) => {
    return `// JavaScript fetch example
fetch("${apiSpec.baseUrl}${endpoint.path}", {
  method: "${endpoint.method}",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  body: JSON.stringify({
    "input": {
      "param1": "value1",
      "param2": 42
    }
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));`;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="api-panel">
        <div className="panel-header">
          <h3>Generating API...</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="panel-content loading">
          <div className="spinner"></div>
          <p>Processing flow and generating API endpoints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="api-panel">
      <div className="panel-header">
        <h3>Generated API</h3>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="panel-tabs">
        <button
          className={activeTab === "endpoints" ? "active" : ""}
          onClick={() => setActiveTab("endpoints")}
        >
          Endpoints
        </button>
        <button
          className={activeTab === "testing" ? "active" : ""}
          onClick={() => setActiveTab("testing")}
        >
          Testing
        </button>
        <button
          className={activeTab === "documentation" ? "active" : ""}
          onClick={() => setActiveTab("documentation")}
        >
          Documentation
        </button>
      </div>

      <div className="panel-content">
        {activeTab === "endpoints" && (
          <div className="endpoints-tab">
            <div className="api-info">
              <p>
                <strong>API Name:</strong> {apiSpec.name}
              </p>
              <p>
                <strong>Version:</strong> {apiSpec.version}
              </p>
              <p>
                <strong>Base URL:</strong> {apiSpec.baseUrl}
              </p>
            </div>

            <h4>Available Endpoints:</h4>
            <div className="endpoints-list">
              {apiSpec.endpoints.map((endpoint, index) => (
                <div key={index} className="endpoint-item">
                  <div className="endpoint-header">
                    <span
                      className={`method-badge ${endpoint.method.toLowerCase()}`}
                    >
                      {endpoint.method}
                    </span>
                    <span className="endpoint-path">{endpoint.path}</span>
                  </div>
                  <div className="endpoint-details">
                    <p>{endpoint.description}</p>
                    <div className="schemas">
                      <div className="schema">
                        <h5>Request Schema:</h5>
                        <pre>
                          {JSON.stringify(endpoint.requestSchema, null, 2)}
                        </pre>
                      </div>
                      <div className="schema">
                        <h5>Response Schema:</h5>
                        <pre>
                          {JSON.stringify(endpoint.responseSchema, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "testing" && (
          <div className="testing-tab">
            <div className="test-form">
              <h4>Test API Endpoint</h4>
              <div className="form-group">
                <label>Endpoint:</label>
                <select defaultValue={apiSpec.endpoints[0]?.path}>
                  {apiSpec.endpoints.map((endpoint, index) => (
                    <option key={index} value={endpoint.path}>
                      {endpoint.method} {endpoint.path}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Request Body:</label>
                <textarea
                  defaultValue={JSON.stringify(
                    {
                      input: {
                        param1: "test value",
                        param2: 42,
                      },
                    },
                    null,
                    2
                  )}
                  rows="6"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Headers:</label>
                <textarea
                  defaultValue={JSON.stringify(
                    {
                      "Content-Type": "application/json",
                      Authorization: "Bearer API_KEY",
                    },
                    null,
                    2
                  )}
                  rows="4"
                ></textarea>
              </div>

              <button className="test-button">Send Request</button>

              <div className="response-section">
                <h4>Response:</h4>
                <pre className="response-box">
                  {JSON.stringify(
                    {
                      success: true,
                      data: {
                        id: "123456",
                        status: "processed",
                        result: {
                          value1: "response data",
                          value2: 100,
                        },
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            <div className="code-snippets">
              <h4>Code Snippet:</h4>
              <pre className="code-box">
                {generateCodeSnippet(apiSpec.endpoints[0])}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "documentation" && (
          <div className="documentation-tab">
            <h4>API Documentation</h4>
            <p>
              This documentation describes the API automatically generated from
              your flow. You can integrate with this API using any programming
              language that supports HTTP requests.
            </p>

            <h5>Authentication</h5>
            <p>
              All API requests require authentication. You can use your API key
              in the Authorization header:
            </p>
            <pre>Authorization: Bearer YOUR_API_KEY</pre>

            <h5>Error Handling</h5>
            <p>
              The API uses standard HTTP status codes to indicate success or
              failure:
            </p>
            <ul>
              <li>200 - Success</li>
              <li>400 - Bad Request</li>
              <li>401 - Unauthorized</li>
              <li>404 - Not Found</li>
              <li>500 - Server Error</li>
            </ul>

            <h5>Endpoints</h5>
            {apiSpec.endpoints.map((endpoint, index) => (
              <div key={index} className="doc-endpoint">
                <h6>
                  <span
                    className={`method-badge ${endpoint.method.toLowerCase()}`}
                  >
                    {endpoint.method}
                  </span>
                  {endpoint.path}
                </h6>
                <p>{endpoint.description}</p>
                <div className="doc-section">
                  <h6>Request Parameters:</h6>
                  <pre>{JSON.stringify(endpoint.requestSchema, null, 2)}</pre>
                </div>
                <div className="doc-section">
                  <h6>Response Format:</h6>
                  <pre>{JSON.stringify(endpoint.responseSchema, null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiPanel;
