import React from 'react'
import { Link } from 'react-router-dom'

export default function MobileMenu({ open, onClose }) {
  return (
    <div className={`fixed inset-0 z-50 transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`} aria-hidden={!open}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 shadow-lg flex flex-col">
        <button className="self-end" onClick={onClose} aria-label="Close menu">✕</button>
        <nav className="mt-4 flex flex-col gap-3">
          <Link to="/" onClick={onClose}>Home</Link>
          <Link to="/find-caregivers" onClick={onClose}>Find Caregivers</Link>
          <Link to="/live-tracking" onClick={onClose}>Live Tracking</Link>
          <Link to="/activity-logs" onClick={onClose}>Activity Logs</Link>
          <Link to="/login" onClick={onClose}>Login</Link>
        </nav>
      </aside>
    </div>
  )
}
