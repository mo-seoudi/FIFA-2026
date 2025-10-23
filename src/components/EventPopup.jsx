// src/components/EventPopup.jsx
import React, { useEffect, useRef } from 'react'

export default function EventPopup({ match, onClose }) {
  const closeRef = useRef(null)

  // Close on Esc
  useEffect(() => {
    if (!match) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [match, onClose])

  // Autofocus close button when popup opens
  useEffect(() => {
    if (match && closeRef.current) {
      closeRef.current.focus()
    }
  }, [match])

  if (!match) return null

  return (
    <>
      {/* Clicking the dimmed background closes */}
      <div className="mask" onClick={onClose} />

      <div className="popup" aria-hidden={!match}>
        <div
          className="popup-inner"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
          // Prevent clicks inside from bubbling to the mask (defensive)
          onClick={(e) => e.stopPropagation()}
        >
          <button
            ref={closeRef}
            onClick={onClose}
            className="close"
            aria-label="Close"
          >
            ×
          </button>

          <h3 id="popup-title" style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>
            {match.city}
          </h3>

          <div style={{ fontSize: 14, color: '#374151', display: 'grid', gap: 4 }}>
            <div style={{ fontWeight: 600 }}>
              {new Date(match.date).toLocaleDateString(undefined, {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </div>
            <div>Match <strong>#{match.match_number}</strong></div>
            <div>Phase: <strong>{match.phase}</strong></div>
            <div>Fixture: <strong>{match.fixture}</strong></div>
            <div>Venue: <strong>{match.venue}</strong></div>
          </div>
        </div>
      </div>
    </>
  )
}
