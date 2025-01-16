import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// pages
import Home from "./pages/home";
import See from "./pages/see";
import Join from "./pages/join";
import CreateSpace from './pages/create_space'
import UploadContent from "./pages/upload_to_space";
import AdminLogin from "./pages/admin_login";
import AdminPage from "./pages/admin";
import Error from "./pages/Error";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/see" element={<See />}></Route>
      <Route path="/join" element={<Join />}></Route>
      <Route path="/createspace" element={<CreateSpace />}></Route>
      <Route path="/uploadcontent" element={<UploadContent />}></Route>
      <Route path="/adminlogin" element={<AdminLogin />}></Route>
      <Route path="/admin" element={<AdminPage />}></Route>
      <Route path="*" element={<Error />}></Route>
      

    </Routes>
  </BrowserRouter>,
);
reportWebVitals();
