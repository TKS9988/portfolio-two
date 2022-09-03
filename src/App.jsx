import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard, SignUp, Error, Signin } from "./pages";
import { AuthProvider } from "./pages/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/signin" element={<Signin />} />
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
