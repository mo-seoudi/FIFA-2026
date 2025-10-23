import React from 'react'

export default function EventPopup({ match, onClose }) {
  if (!match) return null
  return (
    <>
      <div className="mask" onClick={onClose} />
      <div className="popup">
        <div className="popup-inner">
          <button onClick={onClose} className="close" aria-label="Close">×</button>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{match.city}</h3>
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
