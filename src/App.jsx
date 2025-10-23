import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Fifa from './pages/Fifa.jsx'

export default function App() {
  return (
    <div className="container">
      <div className="shell">
        {/* Simple header; link kept for future expansion */}
        <div className="row" style={{ marginBottom: 16 }}>
          <div>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>
              FIFA 2026 Schedule
            </Link>
          </div>
          {/* You can add more nav links here later */}
        </div>

        <Routes>
          <Route path="/" element={<Fifa />} />
        </Routes>
      </div>
    </div>
  )
}
