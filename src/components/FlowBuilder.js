import React, { useState, useRef, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./Sidebar";
import PropertyPanel from "./PropertyPanel";
import CustomNode from "./nodes/CustomNode";
import TriggerNode from "./nodes/TriggerNode";
import ActionNode from "./nodes/ActionNode";
import ConditionNode from "./nodes/ConditionNode";
import { v4 as uuidv4 } from "uuid";
import ApiPanel from "./ApiPanel";
import "./FlowBuilder.css";

// Define node types for our custom nodes
const nodeTypes = {
  customNode: CustomNode,
  triggerNode: TriggerNode,
  actionNode: ActionNode,
  conditionNode: ConditionNode,
};

const FlowBuilder = () => {
  // React Flow states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Selected elements
  const [selectedNode, setSelectedNode] = useState(null);
  const [showApiPanel, setShowApiPanel] = useState(false);

  // DOM reference for the flow wrapper
  const reactFlowWrapper = useRef(null);

  // Store the React Flow instance
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Handle connecting nodes
  const onConnect = useCallback(
    (params) => {
      // Create a unique id for the new edge
      const newEdge = {
        ...params,
        id: `e-${uuidv4()}`,
        animated: true,
        style: { stroke: "#555" },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Set up the React Flow instance when ready
  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Handle edge selection
  const onEdgeClick = useCallback((event, edge) => {
    // Could implement edge properties editing here
  }, []);

  // Handle pane click (deselect elements)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle dropping a new node onto the canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle the drop event to create a new node
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // Get the node type from the drag data
      const nodeType = event.dataTransfer.getData("application/reactflow/type");
      const nodeName = event.dataTransfer.getData("application/reactflow/name");

      // Exit if we're not dropping a node type
      if (!nodeType) {
        return;
      }

      // Get the position of the drop relative to the flow container
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create a new node with default properties
      const newNode = {
        id: `node-${uuidv4()}`,
        type: nodeType,
        position,
        data: {
          label: nodeName || "New Node",
          properties: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Update node properties
  const updateNodeProperties = useCallback(
    (nodeId, properties) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                properties,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Generate API from flow
  const generateApi = useCallback(() => {
    // Show the API panel
    setShowApiPanel(true);

    // In a real implementation, this would send the flow data to the backend
    // for API generation and retrieve the generated API details
    console.log("Flow data for API generation:", { nodes, edges });
  }, [nodes, edges]);

  // Save the flow to backend
  const saveFlow = useCallback(() => {
    const flowData = {
      nodes,
      edges,
    };
    console.log("Saving flow:", flowData);
    // In a real implementation, this would call an API to save the flow
    alert("Flow saved successfully! (simulated)");
  }, [nodes, edges]);

  return (
    <div className="flow-builder-container">
      <Sidebar />
      <div className="flow-wrapper" ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#aaa" gap={16} />
            <Controls />
            <MiniMap
              nodeStrokeColor={(n) => {
                return "#000000";
              }}
              nodeColor={(n) => {
                return n.type === "triggerNode"
                  ? "#6ede87"
                  : n.type === "actionNode"
                  ? "#6865A5"
                  : n.type === "conditionNode"
                  ? "#ff8a65"
                  : "#00BFFF";
              }}
            />
          </ReactFlow>
        </ReactFlowProvider>

        <div className="action-buttons">
          <button onClick={saveFlow} className="save-button">
            Save Flow
          </button>
          <button onClick={generateApi} className="generate-api-button">
            Generate API
          </button>
        </div>
      </div>

      {selectedNode && (
        <PropertyPanel
          node={selectedNode}
          updateNodeProperties={(properties) =>
            updateNodeProperties(selectedNode.id, properties)
          }
        />
      )}

      {showApiPanel && (
        <ApiPanel
          flowData={{ nodes, edges }}
          onClose={() => setShowApiPanel(false)}
        />
      )}
    </div>
  );
};

export default FlowBuilder;
