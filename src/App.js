import React from "react";
import FlowBuilder from "./components/FlowBuilder";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>No-Code Automation Flow Builder</h1>
      </header>
      <main>
        <FlowBuilder />
      </main>
    </div>
  );
}

export default App;
