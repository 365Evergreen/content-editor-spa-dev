import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import EditorPage from "./pages/EditorPage";
import SignInPage from "./pages/SignInPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
