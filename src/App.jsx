import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";

const App = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
