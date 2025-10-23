// src/components/MonthCalendar.jsx
import React from 'react'

export default function MonthCalendar({ items, onSelect, ym, highlightColors = {} }) {
  // Monday-first month grid
  const first = new Date(ym.year, ym.month, 1)
  const firstDay = first.getDay() // 0 Sun .. 6 Sat
  const monthStartOffset = (firstDay + 6) % 7 // shift so Monday=0
  const startDate = new Date(ym.year, ym.month, 1 - monthStartOffset)

  // Build a local YYYY-MM-DD key (no UTC conversion!)
  const localDateKey = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dd}`
  }

  const total = 42 // 6 weeks x 7 days
  const cells = []
  for (let i = 0; i < total; i++) {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    const iso = localDateKey(d) // <-- local, not UTC
    const inCurrent = d.getMonth() === ym.month
    const dayItems = items.filter(m => m.date === iso)
    cells.push({ date: d, iso, inCurrent, dayItems })
  }

  const weekLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

  // -------- helpers --------
  // Default for non-highlighted cities is dark gray
  const colorForCity = (city) => highlightColors[city] || '#374151'

  const textColorForBg = (bg) => {
    try {
      let r, g, b
      if (bg.startsWith('#')) {
        const hex = bg.replace('#','')
        const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex
        r = parseInt(full.slice(0,2), 16)
        g = parseInt(full.slice(2,4), 16)
        b = parseInt(full.slice(4,6), 16)
      } else if (bg.startsWith('rgb')) {
        const nums = bg.replace(/[^\d.,]/g,'').split(',').map(v => parseFloat(v))
        ;[r, g, b] = nums
      } else {
        return '#fff'
      }
      const L = (0.299*r + 0.587*g + 0.114*b) / 255
      return L > 0.62 ? '#111' : '#fff'
    } catch { return '#fff' }
  }

  return (
    <div className="cal">
      <div className="cal-head">
        {weekLabels.map(w => <div key={w}>{w}</div>)}
      </div>
      <div className="cal-grid">
        {cells.map((c, idx) => (
          <div key={idx} className={`day ${c.inCurrent ? '' : 'out'}`}>
            <div className="hdr">
              <span style={{ fontWeight: 600 }}>{c.date.getDate()}</span>
              {c.dayItems.length > 0 && <span className="pill">{c.dayItems.length}</span>}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {c.dayItems.map(m => {
                const bg = colorForCity(m.city)
                const fg = textColorForBg(bg)
                return (
                  <button
                    key={m.match_number}
                    className="event"
                    style={{ background: bg, color: fg }}
                    title={m.city}
                    aria-label={`${m.city}, match #${m.match_number}`}
                    onClick={() => onSelect(m)}
                  >
                    {m.city}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
