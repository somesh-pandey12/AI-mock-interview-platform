import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import InterviewPanel from './pages/InterviewPanel.jsx'
import Forum from './pages/Forum.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview/:id" element={<InterviewPanel />} />
        <Route path="/forum" element={<Forum />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)